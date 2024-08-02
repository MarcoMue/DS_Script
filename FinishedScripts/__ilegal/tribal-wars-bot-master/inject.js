
function loadScript(scriptName, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = chrome.runtime.getURL('lib/' + scriptName);
  scriptEl.addEventListener('load', callback, false);
  document.body.appendChild(scriptEl);
}


function loadGameScript(src) {
  var scriptEl = document.createElement('script');
  scriptEl.src = src;
  document.body.appendChild(scriptEl);
}

function loadCss(cssName) {
  var cssEl = document.createElement('link');
  cssEl.type = "text/css";
  cssEl.rel = "stylesheet";
  cssEl.href = chrome.runtime.getURL('css/' + cssName);
  document.head.appendChild(cssEl);
}

window.onload = function () {
  loadCss('general.css');
  loadCss('openFakeAttackPopup.css');

  loadScript('sendAttack.js');
  loadScript('general.js');
  loadScript('menu.js');
  loadScript('openFakeAttackPopup.js');
  //loadScript('autoclean.js');
  //loadScript('unit.js');
}