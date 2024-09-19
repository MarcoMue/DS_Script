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

  var win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
  let scriptConfig = {
    baseScriptUrl: "https://marcomue.github.io/DS_Script/MySkript",
  };

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
  var player = [];
  $("input:radio[name=player]").each(function () {
    playerURLs.push(baseURL + $(this).attr("value"));
    player.push({
      id: $(this).attr("value"),
      name: $(this).parent().text().trim(),
    });
  });
  console.group("Player URLs");
  console.table(playerURLs);
  console.groupEnd();

  let mode = win.game_data.mode;
  console.log("mode", mode);
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

  if (mode === "members_troops") {
    let tribeTable = "#ally_content table.vis.w100";
    let res = extractTableData(tribeTable, 0, 0);
    console.group("Extracted Table Data");
    console.table(res);
    console.groupEnd();

    // TODO: write res to indexed DB with the current Timestamp as the index.
    // check most recent timestamp and compare with current timestamp to decide if to update or not.
    // if the most recent timestamp is less than 1 hour, don't update.

    // Check the most recent timestamp in IndexedDB
    let lastUpdate = await c_sdk.getMostRecentTimestamp();
    let currentTime = new Date().getTime();

    // If the most recent timestamp is less than 1 hour, don't update
    if (lastUpdate && currentTime - lastUpdate < 3600000) {
      console.log("Data is up-to-date. No need to update.");
    } else {
      // Write res to IndexedDB with the current timestamp as the index
      await c_sdk.storeDataInIndexedDB(res, currentTime);
      console.log("Data updated successfully.");
    }

    // Store the data in localStorage
    let storedData = { timestamp: currentTime, data: res };
    console.log("Stored Data", storedData);
    await c_sdk.storeDataInIndexedDB("troops", storedData);
  }

  function extractTableData(selector = tribeTable, rowStart, columnStart) {
    let rows = $(selector).find("tr");
    let data = [];
    for (let i = rowStart; i < rows.length; i++) {
      let row = rows[i];
      let columns = $(row).find("td");
      let rowData = [];
      for (let j = columnStart; j < columns.length; j++) {
        let column = columns[j];

        // Check if the <td> contains an <a> element
        let link = $(column).find("a");
        if (link.length > 0) {
          // If it contains an <a> element, save the href attribute
          value = link.attr("href");
        } else {
          // Otherwise, save the text content
          value = $(column).text().trim();
        }
        // console.debug(row, column, link, value);
        rowData.push(value);
      }
      data.push(rowData);
    }
    return data;
  }
})();
