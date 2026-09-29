function initViewBox() {
    const svg = document.getElementById("svg1");

    svg.style.width = "100vw";
    svg.style.height = "100vh";

    let viewBox = { x: svg.viewBox.baseVal.x, y: svg.viewBox.baseVal.y, width: svg.viewBox.baseVal.width, height: svg.viewBox.baseVal.height }; // Initiale ViewBox
    // let viewBox = { x: 0, y: 0, width: 100, height: 100 }; // Initiale ViewBox

    // Funktion zum Aktualisieren der ViewBox
    function updateViewBox() {
        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }

    // Zoom-Funktion (mit Zentrierung)
    function zoom(event) {
        event.preventDefault();
        const zoomFactor = 1.1; // Zoom-Stärke
        const rect = svg.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        const svgX = (cursorX / rect.width) * viewBox.width + viewBox.x;
        const svgY = (cursorY / rect.height) * viewBox.height + viewBox.y;

        if (event.deltaY < 0) { // Hineinzoomen
            viewBox.width /= zoomFactor;
            viewBox.height /= zoomFactor;
        } else { // Herauszoomen
            viewBox.width *= zoomFactor;
            viewBox.height *= zoomFactor;
        }

        // Zentriere auf den Mauszeiger
        viewBox.x = svgX - (cursorX / rect.width) * viewBox.width;
        viewBox.y = svgY - (cursorY / rect.height) * viewBox.height;

        updateViewBox();
    }

    // Scroll-Funktion (Pan/Schwenken)
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    function startPan(event) {
        isPanning = true;
        startPoint.x = event.clientX;
        startPoint.y = event.clientY;
    }

    function pan(event) {
        if (!isPanning) return;

        const dx = (event.clientX - startPoint.x) * (viewBox.width / svg.clientWidth);
        const dy = (event.clientY - startPoint.y) * (viewBox.height / svg.clientHeight);
        viewBox.x -= dx;
        viewBox.y -= dy;
        startPoint.x = event.clientX;
        startPoint.y = event.clientY;

        updateViewBox();
    }

    function endPan() {
        isPanning = false;
    }

    let lastTouchDistance = null; // Zur Berechnung der Pinch-Zoom-Stärke

    function touchStart(event) {
        if (event.touches.length === 2) {
            // Initialisiere Pinch-Zoom
            lastTouchDistance = getTouchDistance(event.touches);
        } else if (event.touches.length === 1) {
            // Initialisiere Panning
            isPanning = true;
            startPoint.x = event.touches[0].clientX;
            startPoint.y = event.touches[0].clientY;
        }
    }

    function touchMove(event) {
        event.preventDefault();
    
        if (event.touches.length === 2 && lastTouchDistance) {
            // Handle Pinch-Zoom
            const newDistance = getTouchDistance(event.touches);
            const zoomFactor = newDistance / lastTouchDistance;
    
            const touchCenter = getTouchCenter(event.touches);
            const rect = svg.getBoundingClientRect();
            const svgX = (touchCenter.x - rect.left) / rect.width * viewBox.width + viewBox.x;
            const svgY = (touchCenter.y - rect.top) / rect.height * viewBox.height + viewBox.y;
    
            viewBox.width /= zoomFactor;
            viewBox.height /= zoomFactor;
    
            viewBox.x = svgX - (touchCenter.x - rect.left) / rect.width * viewBox.width;
            viewBox.y = svgY - (touchCenter.y - rect.top) / rect.height * viewBox.height;
    
            lastTouchDistance = newDistance;
    
            updateViewBox();
        } else if (event.touches.length === 1 && isPanning) {
            // Handle Panning nur, wenn bewusst bewegt wird
            const dx = (event.touches[0].clientX - startPoint.x) * (viewBox.width / svg.clientWidth);
            const dy = (event.touches[0].clientY - startPoint.y) * (viewBox.height / svg.clientHeight);
            viewBox.x -= dx;
            viewBox.y -= dy;
            startPoint.x = event.touches[0].clientX;
            startPoint.y = event.touches[0].clientY;
    
            updateViewBox();
        }
    }

    function touchEnd(event) {
        if (event.touches.length === 1) {
            // Wenn ein Finger übrig bleibt, den Übergang sanft behandeln
            isPanning = true;
            startPoint.x = event.touches[0].clientX;
            startPoint.y = event.touches[0].clientY;
        } else if (event.touches.length < 1) {
            // Falls keine Finger mehr vorhanden sind, alles zurücksetzen
            isPanning = false;
            lastTouchDistance = null;
        }
    }


    // Event-Listener hinzufügen
    svg.addEventListener("wheel", zoom);
    svg.addEventListener("mousedown", startPan);
    svg.addEventListener("mousemove", pan);
    svg.addEventListener("mouseup", endPan);
    svg.addEventListener("mouseleave", endPan);

    svg.addEventListener("touchstart", touchStart, { passive: false });
    svg.addEventListener("touchmove", touchMove, { passive: false });
    svg.addEventListener("touchend", touchEnd);

}

function getTouchDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.hypot(dx * dx + dy * dy);
}

function getTouchCenter(touches) {
    const [touch1, touch2] = touches;
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}