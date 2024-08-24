javascript: (() => {
  let win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
  let points = +win.game_data.village.points;
  let katterpult = Math.floor(points / 100 / 8);
  let spys = Math.ceil(((points / 100) % 8) / 2);
  katterpult = katterpult > 0 ? katterpult : 1;
  spys = spys > 0 ? spys : 1;
  $("#unit_input_catapult").val(katterpult);
  $("#unit_input_spy").val(spys);
})();
