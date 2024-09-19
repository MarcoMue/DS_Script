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

  var win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
  let mode = win.game_data.mode;
  console.debug("mode", mode);

  let scriptConfig = {
    baseScriptUrl: "https://marcomue.github.io/DS_Script/MySkript",
  };

  await init();

  if (mode === "members_troops") {
    let tribeTable = "#ally_content table.vis.w100";
    let timestamp = new Date().getTime();

    let tableData = parseMembersTroopsTable(tribeTable, 0, 0);
    let troops = createTroopObjects(tableData, timestamp);

    // Add the dropdown with values from localStorage
    let dropdownValues = getDropdownValues();
    let dropdown = createDropdown(dropdownValues);
    insertDropdownIntoDOM(dropdown, handleDropdownChange);

    function handleDropdownChange(selectedValue) {
      console.log("Selected value:", selectedValue);

      tableData.forEach((row) => {
        row.forEach((col) => {
          changeColor(col, selectedValue);
        });
      });
    }

    console.groupCollapsed("Extracted Table Data");
    console.table(tableData);
    console.groupEnd();

    console.groupCollapsed("Extracted Troop Data");
    console.table(troops);
    console.groupEnd();

    await c_sdk.storeDataInIndexedDB("troops", troops, timestamp);
    let lastUpdate = await c_sdk.getResultFromDB();
  }

  function createDropdown(values) {
    let dropdown = $("<select></select>");
    values.forEach((value) => {
      let datetime = new Date(value).toLocaleString();
      let timeAgoText = timeAgo(value);

      let option = $("<option></option>")
        .text(`${datetime} ${timeAgoText}`)
        .val(value);
      dropdown.append(option);
    });
    return dropdown;
  }

  function insertDropdownIntoDOM(dropdown, onChangeCallback) {
    $("#ally_content").append(dropdown);

    // Attach change event listener
    dropdown.change(function () {
      let selectedValue = $(this).val();
      onChangeCallback(selectedValue);
    });
  }

  function getDropdownValues() {
    let values = localStorage.getItem("troops_timestamps");
    return values ? JSON.parse(values) : [];
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
    console.log(column, value);
    let color = "red";
    // Get the current text content of the cell
    let currentText = $(column).text().trim();

    // Add the new value with color into the same cell
    $(column).html(
      `${currentText} <span style="color:${color};">${value}</span>`
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

  function timeAgo(timestamp) {
    const now = new Date();
    const timeDifference = now - new Date(timestamp);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }

  async function init() {
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

    console.debug("TribeTroops.js loaded successfully");
  }
})();
