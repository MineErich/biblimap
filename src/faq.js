import { restore_darkmode, change_darkmode } from "./darkmode.js";

window.onload = restore_darkmode();

document.getElementById("img_dm").addEventListener("click", change_darkmode);
