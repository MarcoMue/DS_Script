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

  let troops = [];
  let currentTime = new Date();
  let comparisonTimestamp;
  if (mode === "members_troops") {
    // TODO 2 different Timestamps for inital load and comparison
    console.log("Timestamp:", currentTime);

    troops = await parseMembersTroopsTable(currentTime);
    await c_sdk.storeDataInIndexedDB("troops", troops, currentTime);

    let timeValues = getTimestampValues();
    if (timeValues.length > 0) {
      comparisonTimestamp = timeValues[0];
    }

    let dropdown = createDropdown(timeValues, comparisonTimestamp);
    insertDropdownIntoDOM(dropdown, parseMembersTroopsTable);
  }

  function createDropdown(values, initialValue) {
    let dropdown = $("<select></select>");
    values.forEach((value) => {
      let datetime = new Date(value).toLocaleString();
      let timeAgoText = timeAgo(value);

      let option = $("<option></option>")
        .text(`${datetime} ${timeAgoText}`)
        .val(value);

      // Set the option as selected if it matches the initial value
      if (value === initialValue) {
        option.attr("selected", "selected");
      }

      dropdown.append(option);
    });
    return dropdown;
  }

  function insertDropdownIntoDOM(dropdown, onChangeCallback) {
    $("#ally_content").append(dropdown);

    // Attach change event listener
    dropdown.change(function () {
      let selectedValue = parseInt($(this).val(), 10);
      onChangeCallback(selectedValue);
    });
  }

  function getTimestampValues(currentTime) {
    function removeElementFromArray(array, element) {
      const index = array.findIndex((item) => item === element);
      if (index !== -1) {
        array.splice(index, 1);
      }
      return array;
    }

    let values = localStorage.getItem("troops_timestamps");
    console.log("Dropdown values:", values);

    if (values === null) {
      return [new Date().getTime()];
    } else {
      values = JSON.parse(values);
      removeElementFromArray(values, currentTime);
      return values;
    }
  }

  function changeColor(column, comparison) {
    if (comparison === undefined) {
      return;
    }

    // Get the current text content of the cell
    let currentText = $(column).text().trim();

    let color;
    if (currentText > comparison) {
      color = "green";
    } else {
      color = "red";
    }

    // Add the new value with color into the same cell
    $(column).append(`<span style="color:${color};">${comparison}</span>`);
  }

  async function parseMembersTroopsTable(date) {
    console.log("Selected value:", date);

    let tribeTable = "#ally_content table.vis.w100";
    let rowStart = 0;
    let columnStart = 0;

    let rows = $(tribeTable).find("tr");
    let data = [];
    for (let i = rowStart; i < rows.length; i++) {
      let row = rows[i];

      // Skip header rows
      if ($(row).find("th").length > 0) {
        continue;
      }

      let rowData = [];
      let playerID;
      let oldTroops;

      let columns = $(row).find("td");
      let link = $(columns[0]).find("a");

      if (link.length > 0) {
        // If it contains an <a> element, save the href attribute
        playerID = link.attr("href").split("id=")[1];

        // no valid playerID found
        if (!playerID) {
          continue;
        }
      } else {
        continue;
      }

      playerID = parseInt(playerID);
      rowData.push(playerID);
      oldTroops = await c_sdk.getResultFromDB(date, playerID);

      // skip first element
      for (let j = columnStart + 1; j < columns.length; j++) {
        let column = columns[j];
        // skip playerID, and timestamp
        let oldUnit = oldTroops[columnStart + 2];

        let value = $(column).text().trim();
        changeColor(column, oldUnit);
        rowData.push(parseInt(value));
      }

      data.push(new c_sdk.types.PlayerTotalTroops(date.getTime(), ...rowData));
    }

    console.group("Extracted Table Data");
    console.table(data);
    console.groupEnd();

    return data;
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
