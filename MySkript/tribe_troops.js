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
    await c_sdk.storeTroops("troops", troops, currentTime);

    let timestampValues = getTimestampValues(currentTime);
    if (timestampValues.length > 0) {
      comparisonTimestamp = timestampValues[0];
    }

    let dropdown = createDropdown(timestampValues, comparisonTimestamp);
    insertDropdownIntoDOM(dropdown, parseMembersTroopsTable);

    let count;
    let key = 1726769522695;

    count = await c_sdk.deleteTroops("troops", key);
    console.log("Deleted rows:", count);

    key = 1726769525448;
    count = await c_sdk.deleteTroops("troops", key);
    console.log("Deleted rows:", count);
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
      onChangeCallback(new Date(selectedValue));
    });
  }

  /**
   * @param {Date} [currentTime]
   */
  function getTimestampValues(currentTime) {
    function removeElementFromArray(array, element) {
      const index = array.findIndex((item) => item == element);
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
      removeElementFromArray(values, currentTime.getTime());
      return values;
    }
  }

  function changeColor(column, index, troops) {
    // playerID
    if (index === 0) {
      return;
    }

    // Get the current text content of the cell
    let currentText = $(column).text().trim();
    let currentCount = parseInt(currentText);

    let prevCount = 0;
    switch (index) {
      case 1:
        prevCount = troops.spear;
        break;
      case 2:
        prevCount = troops.sword;
        break;
      case 3:
        prevCount = troops.axe;
        break;
      case 4:
        prevCount = troops.spy;
        break;
      case 5:
        prevCount = troops.light;
        break;
      case 6:
        prevCount = troops.heavy;
        break;
      case 7:
        prevCount = troops.ram;
        break;
      case 8:
        prevCount = troops.catapult;
        break;
      case 9:
        prevCount = troops.snob;
        break;
      case 10:
        prevCount = troops.outgoing;
        break;
      case 11:
        prevCount = troops.incoming;
        break;

      default:
        prevCount = 0;
        break;
    }

    let color;
    if (currentCount > prevCount) {
      color = "green";
    } else if (currentCount === prevCount) {
      color = "black";
    } else {
      color = "red";
    }

    let newValue = currentCount - prevCount;
    // Check if the span already exists
    let span = $(column).find("span.color-span");
    if (span.length === 0) {
      // Append a new span if it doesn't exist
      $(column).append(
        `<span class="color-span" style="color:${color};">${newValue}</span>`
      );
    } else {
      // Update the existing span
      span.css("color", color).text(newValue);
    }
  }

  /**
   * @param {Date} date
   */
  async function parseMembersTroopsTable(date) {
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

      let columns = $(row).find("td");
      let link = $(columns[0]).find("a");

      if (link && link.length > 0) {
        // If it contains an <a> element, save the href attribute
        playerID = link.attr("href").split("id=")[1];
        // no valid playerID found
        if (!playerID) {
          continue;
        }
      } else {
        // Not a link
        continue;
      }

      rowData.push(playerID);
      let skip = 1;

      playerID = parseInt(playerID);
      let oldTroops = await c_sdk.readData("troops", date.getTime(), playerID);

      for (let j = columnStart + skip; j < columns.length; j++) {
        let column = columns[j];
        if (oldTroops) {
          changeColor(column, j, oldTroops);
        }

        let value = $(column).text().trim();
        rowData.push(parseInt(value));
      }

      data.push(new c_sdk.types.PlayerTotalTroops(date.getTime(), ...rowData));
    }

    if (DEBUG) {
      console.group("Extracted Table Data");
      console.table(data);
      console.groupEnd();
    }

    return data;
  }

  /**
   * @param {string} timestamp
   */
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
