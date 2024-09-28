// ==UserScript==
// @name         Map sdk
// @version      0.3
// @description  draw on map
// @author       Shinko to Kuma, suilenroc
// @match        https://de228.die-staemme.de/game.php?village=*screen=map*
// @grant        none
// ==/UserScript==

let FontColor = "#FFFFFF";
let FontSize = "64px Arial";
let MiniSize = "14px Arial";

$.getScript("https://shinko-to-kuma.com/scripts/mapSdk.js").done(function () {
  // Adelsgrenze WHY
  MapSdk.lines.push({
    x1: 645,
    y1: 568,
    x2: 456,
    y2: 521,
    styling: {
      main: { strokeStyle: "#FFFF00", lineWidth: 2 },
      mini: { strokeStyle: "#FFFF00", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.texts.push({
    text: "Adelsgrenze WHY?",
    x: 539,
    y: 535,
    color: "#FFFFFF",
    font: "64px Arial",
    drawOnMini: true,
    drawOnMap: true,
  });

  //Safegebiet
  MapSdk.lines.push({
    x1: 500,
    y1: 556,
    x2: 500,
    y2: 652,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 556,
    x2: 523,
    y2: 538,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });

  //Korri 1
  MapSdk.texts.push({
    text: "Gollum",
    x: 524,
    y: 543,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 514,
    y1: 545,
    x2: 449,
    y2: 524,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 2
  MapSdk.texts.push({
    text: "FS4L3X",
    x: 515,
    y: 550,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 506,
    y1: 551,
    x2: 457,
    y2: 534,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 3
  MapSdk.texts.push({
    text: "Brauntown",
    x: 510,
    y: 556,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 558,
    x2: 451,
    y2: 539,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 4
  MapSdk.texts.push({
    text: "Krababel",
    x: 507,
    y: 563,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 566,
    x2: 445,
    y2: 543,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 5
  MapSdk.texts.push({
    text: "Daemon",
    x: 507,
    y: 571,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 574,
    x2: 441,
    y2: 548,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 6
  MapSdk.texts.push({
    text: "Deutsche",
    x: 507,
    y: 579,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 582,
    x2: 437,
    y2: 552,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 7
  MapSdk.texts.push({
    text: "Ken Kaneki",
    x: 508,
    y: 586,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 590,
    x2: 432,
    y2: 555,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 8
  MapSdk.texts.push({
    text: "Raptor Formaggi",
    x: 512,
    y: 594,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 597,
    x2: 428,
    y2: 559,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 9
  MapSdk.texts.push({
    text: "SirDavid1",
    x: 507,
    y: 602,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 603,
    x2: 424,
    y2: 563,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 10
  MapSdk.texts.push({
    text: "Bober Kurwa",
    x: 510,
    y: 608,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 610,
    x2: 419,
    y2: 566,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 11
  MapSdk.texts.push({
    text: "Amanak",
    x: 505,
    y: 615,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 620,
    x2: 413,
    y2: 571,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 12
  MapSdk.texts.push({
    text: "Fahren ohne Fahrerlaubnis",
    x: 515,
    y: 625,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 627,
    x2: 409,
    y2: 575,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 13
  MapSdk.texts.push({
    text: "Fraglich",
    x: 505,
    y: 630,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });
  MapSdk.lines.push({
    x1: 500,
    y1: 634,
    x2: 406,
    y2: 579,
    styling: {
      main: { strokeStyle: "#FFFFFF", lineWidth: 2 },
      mini: { strokeStyle: "#FFFFFF", lineWidth: 2 },
    },
    drawOnMini: true,
    drawOnMap: true,
  });
  //Korri 14
  MapSdk.texts.push({
    text: "Stinksauer./Scheibemio",
    x: 505,
    y: 638,
    color: FontColor,
    font: FontSize,
    miniFont: MiniSize,
    drawOnMini: true,
    drawOnMap: true,
  });

  MapSdk.mapOverlay.reload();
});

(function () {
  "use strict";

  // Your code here...
})();
