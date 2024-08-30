// ==UserScript==
// @name            DB-Info
// @version         1.2
// @description     Displays DB information if availible
// @author          mkich, suilenroc, SxR
// @include      https://*.die-staemme.de/game.php?*screen=info_village*
// @include      https://*.die-staemme.de/game.php?*screen=overview_villages*
// @include      https://*.die-staemme.de/game.php?*screen=overview*
// @include      https://*.die-staemme.de/game.php?*screen=settings*
// ==/UserScript==

let win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;

//Konfigurationen
//-----------------------------------

//Aktiviert/Deaktiviert die Anzeige der Datenbank infos generell auf der Dorfinfo seite
win.showVillageDetails = true;
//Wenn auf true gesetzt, dann wird beim öffenen einer Dorfinfo seite automatisch die Datenbank abgefragt
win.autoLoadVillageDetails = true;

//Aktiviert/Deaktiviert die Anzeige der Datenbank in der Dorfübersicht
win.showVillageOverviewWideget = true;

//Aktiviert/Deaktiviert die Anzeige des Datenbankabfragebuttons in der Eintreffenden übersicht
win.showButtonOnAttackScreen = true;

//Konfiguration für den verwendeten DB-Server
win.serverConfig = {
  sfAPI: "https://diestaemmedb.de/API/SF/VillageInfo.php",
  userAPI: "https://diestaemmedb.de/API/User/VillageInfo.php",
  villageDetail:
    "https://diestaemmedb.de/pages/search/villageinfo.php?dorfid=$$village$$",
  reportPage: "https://diestaemmedb.de/pages/report/report.php?id=$$reportID$$",
  allReportsPage:
    "https://diestaemmedb.de/pages/reports/showreports.php?dorfcoords=($$x$$|$$y$$)",
};

win.$.ajaxSetup({ cache: true });
win.$.getScript(
  "https://media.innogames.com/com_DS_DE/Scriptdatenbank/userscript_main/722_DB_Info_SxR_suilenrocm_MKich.js"
);
