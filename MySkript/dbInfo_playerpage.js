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
  addColumnToTable("villages_list");

  const requests = [];
  async function addColumnToTable(tableId) {
    const $table = $(`#${tableId}`);

    if ($table.length) {
      const $headerRow =
        $table.find("thead tr").first() || $table.find("tr").first();
      if ($headerRow.length) {
        generateTableHeaders($headerRow);
      } else {
        console.error("Header row not found in the table.");
      }

      const $rows = $table.find("> tbody > tr");
      $rows.each(function (rowIndex, row) {
        // Get the third <td> that is a direct child of the row
        const $thirdTd = $(row).children("td").eq(2);
        const coordinates = $thirdTd.text().trim();
        console.log("Coordinates:", coordinates);

        // Queue requests (assuming x and y are coordinates from the row)
        const coords = coordinates.split("|");
        const x = coords[0];
        const y = coords[1];
        requests.push({ x, y, row: this });

        // const $newCell = $("<td></td>").text(rowIndex);
        // $(this).append($newCell);
      });
    } else {
      console.error(`Table with ID "${tableId}" not found.`);
    }

    let currentIndex = 0;
    const intervalId = setInterval(async () => {
      if (currentIndex >= requests.length) {
        clearInterval(intervalId);
        return;
      }

      const { x, y, row } = requests[currentIndex];
      await showDatabaseDetails(x, y, (data) => {
        let vv = showDatabaseDetails(495, 480);

        updateTableRow(row, data);
      });

      currentIndex++;
    }, 200);
  }

  async function showDatabaseDetails(x, y) {
    try {
      const formData = new FormData();
      formData.append("Key", localStorage.getItem("dbkey"));
      formData.append("X", x);
      formData.append("Y", y);

      const url = win.serverConfig.userAPI;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 403) {
          UI.ErrorMessage(
            "Datenbankverbindung fehlgeschlagen. Bitte richtigen Key oder Modus einstellen.",
            5000
          );
        } else {
          UI.ErrorMessage("Datenbankverbindung ist nicht verfügbar.", 5000);
        }
        return;
      }

      const data = await response.json();
      if (data) {
        return data;
      } else {
        UI.ErrorMessage("UserScript DB-Info hatte einen Fehler", 5000);
        console.log("empty response", response);
      }
    } catch (error) {
      UI.ErrorMessage("Ein Fehler ist aufgetreten: " + error.message, 5000);
      console.error("Error fetching database details:", error);
    }
  }

  function generateTableHeaders(row) {
    const $typCell = $("<th></th>").text("Datum");
    row.append($typCell);

    const $datumCell = $("<th></th>").text("Typ");
    row.append($datumCell);

    // List of unit image URLs
    const unitImages = [
      "https://dsde.innogamescdn.com/graphic/unit/unit_spear.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_sword.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_axe.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_spy.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_light.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_heavy.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_ram.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_catapult.png",
      "https://dsde.innogamescdn.com/graphic/unit/unit_snob.png",
    ];

    // Create and append cells for each unit image
    unitImages.forEach((url, index) => {
      const $unitCell = $("<th></th>");
      const $img = $("<img>").attr("src", url);
      $unitCell.append($img);
      row.append($unitCell);
    });
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
