export function setDarkmode() {
    localStorage.setItem("darkmode", "true");
    document.getElementById("img_dm").src = "icons/lightmode.svg";
    document.documentElement.dataset.theme = "dark";
    document.body.classList.add("darkmode");
}

export function setLightmode() {
    localStorage.setItem("darkmode", "false");
    document.getElementById("img_dm").src = "icons/darkmode.svg";
    document.documentElement.dataset.theme = "light";
    document.body.classList.remove("darkmode");
}

export function change_darkmode() {
    if (localStorage.darkmode == "true") {
        setLightmode();
    }
    else {
        setDarkmode();
    }
}

export function restore_darkmode() {
    if (localStorage.getItem("darkmode") !== "false" && window.matchMedia("(prefers-color-scheme:dark)").matches) {
        setDarkmode();
    }
    else {
        setLightmode();
    }
}