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

  // Call the function to add a column to the table with ID 'villages_list'
  addColumnToTable("villages_list", "New Header", "New Cell");

  function addColumnToTable(tableId, headerText, cellText) {
    const $table = $(`#${tableId}`);

    if ($table.length) {
      // Add a column to the header
      const $headerRow =
        $table.find("thead tr").first() || $table.find("tr").first();
      if ($headerRow.length) {
        // Example usage
        const data = {
          typ: "Example Type",
          datum: "2023-10-01",
        };
        const $newRow = generateTableRow(data);
        $headerRow.append($newRow);
      } else {
        console.error("Header row not found in the table.");
      }

      // Add a column to each row in the table body
      const $rows = $table.find("> tbody > tr");
      $rows.each(function () {
        const $newCell = $("<td></td>").text(cellText);
        $(this).append($newCell);
      });
    } else {
      console.error(`Table with ID "${tableId}" not found.`);
    }
  }

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

  //   <thead>
  //    <tr>
  //     <th>Typ</th>
  //     <th>Datum</th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_spear.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_sword.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_axe.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_spy.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_light.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_heavy.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_ram.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_catapult.png"></th>
  //     <th><img src="https://dsde.innogamescdn.com/graphic/unit/unit_snob.png"></th>
  //    </tr>
  //   </thead>

  function generateTableRow(data) {
    // Create a new table row
    const $row = $("<tr></tr>");

    // Create and append the 'Typ' cell
    const $typCell = $("<td></td>").text(data.typ);
    $row.append($typCell);

    // Create and append the 'Datum' cell
    const $datumCell = $("<td></td>").text(data.datum);
    $row.append($datumCell);

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
      const $unitCell = $("<td></td>");
      const $img = $("<img>").attr("src", url);
      $unitCell.append($img);
      $row.append($unitCell);
    });

    return $row;
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
