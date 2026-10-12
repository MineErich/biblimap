import { restore_darkmode, change_darkmode } from "./darkmode.js";

function isOpen(bib) {
    const d = new Date();
    let hour = d.getHours();
    let day = d.getDay();
    switch (bib) {
        case "htwk": /* mo-fr 9-20 sa 9-16 */
            if (day <= 5 && day >= 1 && hour >= 9 && hour < 20)
                return true;
            if (day == 6 && hour >= 9 && hour < 16)
                return true;
            return false;

        case "r1": /* mo-fr 8-21 sa 10-20 */
            if (day <= 5 && day >= 1 && hour >= 8 && hour < 21)
                return true;
            if ((day == 6) && hour >= 10 && hour < 20)
                return true;
            return false;

        case "r2": /* mo-fr 8-21 sa 10-20 */
            if (day <= 5 && day >= 1 && hour >= 8 && hour < 21)
                return true;
            if ((day == 6) && hour >= 10 && hour < 20)
                return true;
            return false;
    }
}

function setOpen(bib, element) {
    if (isOpen(bib)) {
        document.getElementById(element).innerHTML = "<img src=\"icons/check.svg\"> Geöffnet";
    } else {
        document.getElementById(element).innerHTML = "<img src=\"icons/nope.svg\"> Geschlossen";
    }
}

window.onload = restore_darkmode();

// TODO: refactor: use a loop to cover all included libs
setOpen("htwk","p_htwk");
setOpen("r1","p_r1");
setOpen("r2","p_r2");

document.getElementById("grid_htwk").addEventListener("click", function () {
    window.location.href = 'biblimap.html?location=HTWK&lvl=0';
});
document.getElementById("grid_r1").addEventListener("click", function () {
    window.location.href = 'biblimap.html?location=Recht+I&lvl=2';
});
document.getElementById("grid_r2").addEventListener("click", function () {
    window.location.href = 'biblimap.html?location=Recht+II&lvl=2';
});

document.getElementById("img_dm").addEventListener("click", change_darkmode);
