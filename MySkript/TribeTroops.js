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
  c_sdk.retrieveInstances("Hello, World!");

  //   openUI();

  async function openUI() {
    const html = `<div id="content"></div>`;
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);

    await loadHTML("ui.html", "content");
    Timing.tickHandlers.timers.init();

    // document
    //   .getElementById("of")
    //   .addEventListener("change", () => setMode("members_troops"));
    // document
    //   .getElementById("in")
    //   .addEventListener("change", () => setMode("members_defense"));
    document.getElementById("run").addEventListener("click", readIncs);
    document.getElementById("test1").addEventListener("click", TestButton1);
    document.getElementById("test2").addEventListener("click", TestButton2);

    // document.getElementById('troop_details').addEventListener('click', readCheckboxValue);

    showLastUpdatedDb();
    setInterval(showLastUpdatedDb, 5000);
    addRadioControls();
  }
})();
