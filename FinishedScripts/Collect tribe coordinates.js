javascript: function addLoader() {
  var widget = document.createElement("div");
  widget.id = "loaders";
  widget.style.position = "fixed";
  widget.style.width = "24px";
  widget.style.height = "24px";
  widget.style.top = "50%";
  widget.style.left = "50%";
  $(widget).css("margin-left", "-12px");
  $(widget).css("margin-top", "-12px");
  widget.style.zIndex = 13000;
  $(widget).append(
    $("<img src='graphic/throbber.gif' height='24' width='24'></img>")
  );
  $("#contentContainer").append($(widget));
}

function removeLoader() {
  $("#loaders").remove();
}

function addFader() {
  var fader = document.createElement("div");
  fader.id = "fader";
  fader.style.position = "fixed";
  fader.style.height = "100%";
  fader.style.width = "100%";
  fader.style.backgroundColor = "black";
  fader.style.top = "0px";
  fader.style.left = "0px";
  fader.style.opacity = "0.6";
  fader.style.zIndex = "12000";
  document.body.appendChild(fader);
}

function removeFader() {
  $("#fader").remove();
}

function wait(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

function getProfile(link) {
  return $.ajax({
    url: link,
    type: "GET",
  });
}

async function getVillagesCoords(link) {
  let response = await getProfile(link);
  return $(response)
    .find("#villages_list")
    .text()
    .match(/[0-9]+\|[0-9]+/g);
}

async function getTribeCoords() {
  addFader();
  addLoader();

  let tr_tags = null;
  let link = null;
  let tribe_coords = [];

  if (window.location.href.indexOf("guest") != -1) {
    tr_tags = $(
      "#content_value > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(1) > table:nth-child(3) > tbody > tr"
    );
  } else {
    tr_tags = $(
      "#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(3) > tbody > tr"
    );
  }

  for (let it = 1; it < tr_tags.length; it++) {
    link = $(tr_tags[it]).find("td:eq(0) a").attr("href");
    tribe_coords = tribe_coords.concat(await getVillagesCoords(link));
    await wait(250);
  }

  removeFader();
  removeLoader();

  let prefix = "<textarea cols=80 rows=10>";
  let postfix = "</textarea>";
  let S =
    "<html>" +
    "<head>" +
    "<title>Coletor de Coordenadas</title>" +
    '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />' +
    "</head>" +
    "<body>" +
    "<b>Coletor de Coordenadas</b><hr>Todas as Aldeias da tribo:<br>" +
    prefix +
    tribe_coords.join(" ") +
    postfix +
    "</body></html>";

  let popup = window.open(
    "about:blank",
    "twcc",
    "width=720,height=480,scrollbars=1"
  );

  popup.document.open("text/html", "replace");
  popup.document.write(S);
  popup.document.close();
}

(async function () {
  "use strict";

  $("#content_value").prepend(
    "<input type='button' class='btn' value='Get tribe coords' id='get_tribe_coords'/>"
  );

  $("#get_tribe_coords").on("click", await getTribeCoords);
})();
