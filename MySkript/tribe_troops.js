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
  console.debug("TribeTroops.js loaded successfully", xx);

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
  if (DEBUG) {
    console.group("Player URLs");
    console.table(playerURLs);
    console.groupEnd();
  }

  let mode = win.game_data.mode;
  console.debug("mode", mode);
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
    let timestamp = new Date().getTime();

    let tableData = parseMembersTroopsTable(tribeTable, 0, 0);
    let troops = createTroopObjects(tableData, timestamp);

    if (DEBUG) {
      console.group("Extracted Table Data");
      console.table(tableData);
      console.groupEnd();

      console.group("Extracted Troop Data");
      console.table(troops);
      console.groupEnd();
    }

    await c_sdk.storeDataInIndexedDB("troops", troops, timestamp);
    let lastUpdate = await c_sdk.getResultFromDB();

    rows.forEach((row) => {
      row.forEach((column) => {
        changeColor(column);
      });
    });
  }

  function processColumnData(column) {
    // Check if the <td> contains an <a> element
    let link = $(column).find("a");
    if (link.length > 0) {
      // If it contains an <a> element, save the href attribute
      return link.attr("href").split("id=")[1];
    } else {
      // Otherwise, save the text content
      return $(column).text().trim();
    }
  }

  function changeColor(column) {
    console.log(column);
    let color = "red";
    // Get the current text content of the cell
    let currentText = $(column).text().trim();

    // Add the new value with color into the same cell
    $(column).html(
      `${currentText} <span style="color:${color};">${currentText}</span>`
    );
  }

  function parseMembersTroopsTable(
    selector = tribeTable,
    rowStart,
    columnStart
  ) {
    let rows = $(selector).find("tr");
    let data = [];
    for (let i = rowStart; i < rows.length; i++) {
      let row = rows[i];

      // Skip header rows
      if ($(row).find("th").length > 0) {
        continue;
      }

      let columns = $(row).find("td");
      let rowData = [];

      for (let j = columnStart; j < columns.length; j++) {
        let column = columns[j];
        rowData.push(column);
      }

      // no valid playerID found
      if (!rowData[0] || isNaN(rowData[0])) {
        continue;
      }
      data.push(rowData);
    }
    return data;
  }

  function createTroopObjects(rows, timestamp) {
    return rows.map((row) => {
      let r = row.map((column) => {
        return processColumnData(column);
      });

      return new c_sdk.types.PlayerTotalTroops(timestamp, ...r);
    });
  }
})();
