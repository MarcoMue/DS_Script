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

  let win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
  let mode = win.game_data.mode;
  let screen = win.game_data.screen;

  this.key = win.localStorage.getItem("dbkey");

  let scriptConfig = {
    baseScriptUrl: "https://marcomue.github.io/DS_Script/MySkript",
  };

  if (!win.premium) {
    UI.ErrorMessage(
      "DB-Info kann nur mit aktiven Premium account benutzt werden",
      3000
    );
    return;
  }

  await init();

  // Get all village rows
  // send request and display result
  // queue ?
  showDatabaseDetails(496, 481, null, null);

  function addColumnToTable(tableId, headerText, cellText) {
    const table = document.getElementById(tableId);

    if (table) {
      const headerRow =
        table.querySelector("thead tr") || table.querySelector("tr");
      if (headerRow) {
        const newHeaderCell = document.createElement("th");
        newHeaderCell.textContent = headerText;
        headerRow.appendChild(newHeaderCell);
      } else {
        console.error("Header row not found in the table.");
      }

      // Add a column to each row in the table body
      const rows =
        table.querySelectorAll("tbody tr") || table.querySelectorAll("tr");
      rows.forEach((row) => {
        const newCell = document.createElement("td");
        newCell.textContent = cellText;
        row.appendChild(newCell);
      });
    } else {
      console.error(`Table with ID "${tableId}" not found.`);
    }
  }

  // Call the function to add a column to the table with ID 'villages_list'
  addColumnToTable("villages_list", "New Header", "New Cell");

  async function showDatabaseDetails(x, y, callback, additionals) {
    var formData = new FormData();
    formData.append("Key", localStorage.getItem("dbkey"));
    formData.append("X", x);
    formData.append("Y", y);
    var request = new XMLHttpRequest();
    var url = win.serverConfig.userAPI;
    request.open("POST", url);
    request.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          if (this.responseText) {
            console.log(this.responseText);
            // callback(JSON.parse(this.responseText), x, y, additionals);
          } else {
            UI.ErrorMessage("UserScript DB-Info hatte einen Fehler", 5000);
            console.log("empty response", this);
          }
        } else if (this.status === 403) {
          UI.ErrorMessage(
            "Datenbankverbindung fehlgeschlagen. Bitte richtigen Key oder Modus einstellen.",
            5000
          );
        } else {
          UI.ErrorMessage(
            "Datenbankverbindung ist nicht verf\u00FCgbar.",
            5000
          );
        }
      }
    };
    request.send(formData);
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

    console.debug("dbInfo_playerpage.js loaded successfully");
  }
})();
