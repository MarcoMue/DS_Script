if (typeof DEBUG !== "boolean") DEBUG = false;

/**
 * Dynamically loads a JavaScript file by creating a script element and appending it to the document head.
 *
 * @param {string} url - The URL of the script to load.
 * @returns {Promise<void>} A promise that resolves when the script is successfully loaded, or rejects if an error occurs.
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

(async function () {
  console.log("IIFE called.");

  if (typeof jQuery === "undefined") {
    throw new Error("jQuery is required for this script to work.");
  }

  // Load the library script
  let scriptName = "localStorageAPI.js";
  await loadScript(
    `${scriptConfig.baseScriptUrl}/${scriptName}?` + new Date().getTime()
  )
    .then(() => {
      console.log(`${scriptName} loaded successfully`);
    })
    .catch((error) => {
      console.error("Error loading script:", error);
    });

  if (typeof c_sdk === "undefined") {
    throw new Error("c_sdk is required for this script to work.");
  }

  // Now you can use the library's functions
  c_sdk.storeDataInLocalStorage({ key: "value" });
  let xx = c_sdk.retrieveInstances("Hello, World!");
  console.log("TribeTroops.js loaded successfully", xx);

  // ------------------------------

  var baseURL = `game.php?screen=ally&mode=members_troops&player_id=`;
  var playerURLs = [];

  $("input:radio[name=player]").each(function () {
    playerURLs.push(baseURL + $(this).attr("value"));
    player.push({
      id: $(this).attr("value"),
      name: $(this).parent().text().trim(),
    });
  });

  console.log(playerURLs);

  if (window.location.href.indexOf("screen=ally&mode=members") > -1) {
    //members own tribe
    tribeTable = "#content_value table.vis";
    rowStart = 3;
    columnStart = 6;
    columnName = 0;
    rows = $($("table .vis")[2]).find("tr");

    console.log("members own tribe", rows);
  }

  let mode = win.game_data.mode;

  if (mode.includes("members")) {
    $("#ally_content .modemenu td:gt(0) a").each((i, e) => {
      let selected_player = $('[name*="player_id"] option[selected]').attr(
        "value"
      );
      e.href =
        selected_player === undefined
          ? e.href
          : e.href + "&player_id=" + selected_player;
    });
  }
  if (mode === "members_defense") {
    console.log("members_defense");
    // allyDeffSum();
  } else if (mode === "members_troops") {
    console.log("members_troops");
    // allyTroopSum();
  }
})();
