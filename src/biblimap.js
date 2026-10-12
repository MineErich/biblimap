import { restore_darkmode, change_darkmode } from "./darkmode.js";
import { getURL, setURL, initDialog, init, lvlUpDown, copy_share, showHelp }from "./main.js";
import { initViewBox } from "./viewbox.js";

// check for darkmode
window.onload = restore_darkmode();

// sanitize URL-params; do AJAX
document.addEventListener("DOMContentLoaded", () => {
    let url = getURL(true, true, false);
    let bib = url['location'];
    let lvl = url['lvl'];
    if (bib === false || bib === null) {
        bib = "HTWK";
        setURL(bib, false, false, false);
    }
    if (lvl === false || lvl === null) {
        switch (bib) {
            case "HTWK":
                lvl = 0;
                break;
            case "Recht I":
                lvl = 2;
                break;
            case "Recht II":
                lvl = 2;
                break;
            default:
                lvl = 0;
        }
        setURL(false, lvl, false, false);
    }
    fetch(`maps/${bib}/${lvl}OG.svg`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.text();
        })
        .then(response => {
            const svgContainer = document.getElementById("svg-container");
            svgContainer.innerHTML = "";
            svgContainer.innerHTML = response;

            // wenn Seite geladen ist init-function aufrufen
            document.addEventListener("DOMContentLoaded", init());

            // Dialog zur Bib-Auswahl definieren
            initDialog();
            // SVG bewegbar machen
            initViewBox();
        })
        .catch(e => {
            alert('Fehler beim Laden der SVG-Datei: Bitte prüfe, ob der Link korrekt ist. Du wirst zur Startseite zurückgeleitet.');
            setURL("HTWK", 0, false, true);
        })
});

document.getElementById("btn_share").addEventListener("click", copy_share);
document.getElementById("btn_help").addEventListener("click", showHelp);

document.getElementById("btn_up").addEventListener("click", () => {lvlUpDown(true)});
document.getElementById("btn_down").addEventListener("click", () => {lvlUpDown(false)});

document.getElementById("img_dm").addEventListener("click", change_darkmode);