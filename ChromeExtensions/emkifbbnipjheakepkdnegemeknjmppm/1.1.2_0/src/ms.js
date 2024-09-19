var manifest = chrome.runtime.getManifest();
var version = manifest.version;
var title = manifest.name;
var playerID = document.head.innerText.split('id":"')[1].split('",')[0];
var world = window.location.hostname.split(".")[0];

var string = world + "-ms-" + playerID;

var time;
var milliseconds;

setSettings();
window.addEventListener("load", function () {
  fillGruby();
  addMenu();
  magic();
});
function fillGruby() {
  var data = localStorage.getItem(string).split(";");
  if (window.name.includes("DUPA")) {
    data = window.name.split("DUPA")[1].split(";");
  }
  for (var i = 0; i < Number(data[4]); i++)
    $("#troop_confirm_train")[0].click();
  var x = $(".units-row").find("td").find("input");
  for (var i = 0; i < x.length; i++) {
    x[i].value = data[5 + i];
  }
}

function time3s(x) {
  var y = Number(x.slice(-2)) - 7;
  if (y < 0) y += 60;
  return x.slice(0, -2) + fillTime(y);
}

function magic() {
  var target = document
    .getElementsByClassName("relative_time")[0]
    .innerText.slice(-8);
  var t3s = time3s(time);
  if (target == t3s) reloadPage();
  else if (target == time)
    setTimeout(function () {
      document.getElementById("troop_confirm_submit").click();
    }, milliseconds);
  else setTimeout(magic, 1);
}

function fillTime(x) {
  return Number(x) < 10 ? "0" + Number(x) : x;
}

function setSettingInStorage() {
  if (localStorage.getItem(string) !== null) {
    var settingsText = "";

    var hour = fillTime($('input[id="hour"]')[0].value);
    var min = fillTime($('input[id="min"]')[0].value);
    var sec = fillTime($('input[id="sec"]')[0].value);
    var ms = $('input[id="ms"]')[0].value;

    settingsText += hour + ";";
    settingsText += min + ";";
    settingsText += sec + ";";
    settingsText += ms + ";";
    settingsText += $(".units-row").length - 1 + ";";

    var x = $(".units-row").find("td").find("input");
    for (var i = 0; i < x.length; i++) {
      settingsText += x[i].value + ";";
    }
    localStorage.setItem(string, settingsText);
    window.name = "DUPA" + settingsText;
  }
  setSettings();
}

function setSettings() {
  if (localStorage.getItem(string) === null) {
    localStorage.setItem(string, "21;37;00;350;0");
  }
  var i = 0;
  var temp = localStorage.getItem(string);
  if (window.name.includes("DUPA")) {
    temp = window.name.split("DUPA")[1];
  }
  settings = {
    hour: temp.split(";")[i++],
    min: temp.split(";")[i++],
    sec: temp.split(";")[i++],
    ms: temp.split(";")[i++],
  };
  time = settings["hour"] + ":" + settings["min"] + ":" + settings["sec"];
  milliseconds = settings["ms"];
  // console.log(localStorage.getItem(string))
  // console.log(settings);
  // console.log(time, milliseconds);
}

function saveSettings() {
  setSettingInStorage();

  addHideBox(chrome.i18n.getMessage("saved"), "success");
}

function reloadPage() {
  window.location.reload(false);
}

function randomNumber(min, max) {
  var timer = parseInt(Math.random() * (max - min + 1) + min);
  return timer;
}
function addHideBox(mess, type) {
  //console.log(mess);
  var div = document.createElement("div");
  div.innerHTML =
    '<div class="autoHideBox ' + type + '"><p>' + mess + "</p></div>";
  document.getElementsByClassName("desktop")[0].appendChild(div);
}
function addMenu() {
  addGUI();
  document.getElementById("saveSettings").onclick = saveSettings;
  document.getElementById("spoiler").onclick = spoiler;
}

function addGUI() {
  var errorDetails = "content";
  var gui = $('<div class="vis">');
  var gui_content =
    '  <table class="vis" style="width:100%">\
<tbody><tr class="vis"><h4><img src=https://help.plemiona.pl/images/5/52/Lup.png>' +
    title +
    " v" +
    version +
    ' \
<input class="btn" id="spoiler" type="submit" value="Spoiler" ></h4>';

  gui_content = addTD(gui_content, chrome.i18n.getMessage("G1"));
  gui_content = addTD(
    gui_content,
    '<input type="text" id="hour" size="1" value="' +
      settings["hour"] +
      '"> :\
	<input type="text" id="min" size="1" value="' +
      settings["min"] +
      '"> :\
	<input type="text" id="sec" size="1" value="' +
      settings["sec"] +
      '"> :\
	<input type="text" id="ms" size="1" value="' +
      settings["ms"] +
      '">',
    1
  );
  //gui_content = addTD(gui_content, chrome.i18n.getMessage("G2"));
  /*
	var x='<select id="gruby"><option hidden="">'+chrome.i18n.getMessage("G2")+'</option>'
	for(var i=0;i<=5;i++)
		x+='<option value="'+i+'">'+i+'</option>'
	x+='</select>'
	gui_content = addTD(gui_content, x);*/

  gui_content = addTD(
    gui_content,
    '<input class="btn" id="saveSettings" type="submit" value="' +
      chrome.i18n.getMessage("save") +
      '" >',
    1
  );
  gui_content += "<tr><table style='width:100%;display:none' id='hiddenTable'>";
  for (var i = 1; i <= 6; i++) {
    try {
      gui_content = addTRTD(gui_content, chrome.i18n.getMessage("S" + i));
    } catch (err) {}
  }
  $(gui).html(gui_content);
  var vis = $(".troop_confirm_go").parent();
  if (vis.eq(1).length == 0) vis.eq(0).after(gui);
  else vis.eq(1).after(gui);
}

function spoiler() {
  if (document.getElementById("hiddenTable").style.display === "none") {
    document.getElementById("hiddenTable").style.display = "";
  } else document.getElementById("hiddenTable").style.display = "none";
}

function addTRTD(object, text) {
  object += "<tr>" + addTD("", text, 5);
  return object;
}

function addTD(object, text, col) {
  object += "<td align='center' colspan='" + col + "'>" + text;
  return object;
}
