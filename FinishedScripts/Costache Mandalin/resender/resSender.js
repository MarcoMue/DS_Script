// made by Costache Madalin (lllll llll)
// discord: costache madalin#8472

// game_data.device="DA"

var countApiKey = "res_sender";
var countNameSpace = "madalinoTribalWarsScripts";
let url = window.location.href;

var units = game_data.units;
var unitsLength = units.length;
if (units.includes("snob")) unitsLength--;
if (units.includes("militia")) unitsLength--;
if (units.includes("knight")) unitsLength--;

var headerWood = "#001a33";
var headerWoodEven = "#002e5a";
var headerStone = "#3b3b00";
var headerStoneEven = "#626200";
var headerIron = "#1e003b";
var headerIronEven = "#3c0076";

var defaultTheme =
  '[["theme1",["#E0E0E0","#000000","#C5979D","#2B193D","#2C365E","#484D6D","#4B8F8C","50"]],["currentTheme","theme1"],["theme2",["#E0E0E0","#000000","#F76F8E","#113537","#37505C","#445552","#294D4A","50"]],["theme3",["#E0E0E0","#000000","#ACFCD9","#190933","#665687","#7C77B9","#623B5A","50"]],["theme4",["#E0E0E0","#000000","#181F1C","#60712F","#274029","#315C2B","#214F4B","50"]],["theme5",["#E0E0E0","#000000","#9AD1D4","#007EA7","#003249","#1F5673","#1C448E","50"]],["theme6",["#E0E0E0","#000000","#EA8C55","#81171B","#540804","#710627","#9E1946","50"]],["theme7",["#E0E0E0","#000000","#754043","#37423D","#171614","#3A2618","#523A34","50"]],["theme8",["#E0E0E0","#000000","#9E0031","#8E0045","#44001A","#600047","#770058","50"]],["theme9",["#E0E0E0","#000000","#C1BDB3","#5F5B6B","#323031","#3D3B3C","#575366","50"]],["theme10",["#E0E0E0","#000000","#E6BCCD","#29274C","#012A36","#14453D","#7E52A0","50"]]]';
var localStorageThemeName = "resSenderTheme";
if (localStorage.getItem(localStorageThemeName) != undefined) {
  let mapTheme = new Map(
    JSON.parse(localStorage.getItem(localStorageThemeName))
  );
  Array.from(mapTheme.keys()).forEach((key) => {
    if (key != "currentTheme") {
      let listColors = mapTheme.get(key);
      if (listColors.length == 7) {
        listColors.push(50);
        mapTheme.set(key, listColors);
      }
    }
  });
  localStorage.setItem(
    localStorageThemeName,
    JSON.stringify(Array.from(mapTheme.entries()))
  );
}

var textColor = "#ffffff";
var backgroundInput = "#000000";

var borderColor = "#C5979D"; //#026440
var backgroundContainer = "#2B193D";
var backgroundHeader = "#2C365E";
var backgroundMainTable = "#484D6D";
var backgroundInnerTable = "#4B8F8C";

if (typeof widthInterface === "undefined") var widthInterface = 50; //percentage

var headerColorDarken = -50; //percentage( how much the header should be darker) if it's with -(darker) + (lighter)
var headerColorAlternateTable = -30;
var headerColorAlternateHover = 30;

var backgroundAlternateTableEven = backgroundContainer;
var backgroundAlternateTableOdd = getColorDarker(
  backgroundContainer,
  headerColorAlternateTable
);

var listGroups;
async function main() {
  initializationTheme();
  await $.getScript(
    "https://dl.dropboxusercontent.com/s/i5c0so9hwsizogm/styleCSSGlobal.js?dl=0"
  );
  listGroups = await getGroups();
  await createMainInterface();
  changeTheme();
  createTableSettings();
  addNewPanel();
  addEventPanel();
  getCoordsEvent();
  initializationOwnTabs();
  insertCoordsFromGroups(0);
  insertCoordsFromGroups(1);
  hitCountApi();
}
main();

function getColorDarker(hexInput, percent) {
  let hex = hexInput;

  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  const calculatedPercent = (100 + percent) / 100;

  r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
  g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
  b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

  return `#${("00" + r.toString(16)).slice(-2).toUpperCase()}${(
    "00" + g.toString(16)
  )
    .slice(-2)
    .toUpperCase()}${("00" + b.toString(16)).slice(-2).toUpperCase()}`;
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

//////////////////////////////////////////////////////////// interface /////////////////////////////////////////////////////////

async function createMainInterface() {
  let rows = game_data.device == "desktop" ? 10 : 3;
  let distanceTextarea = game_data.device == "desktop" ? "30px" : "5px";
  let widthSelect = game_data.device == "desktop" ? "100%" : "80%";

  let html_info = `

    <div id="div_container" class="scriptContainer">
        <div class="scriptHeader">
            <div style=" margin-top:10px;"><h2>Resources sender</h2></div>
            <div style="position:absolute;top:10px;right: 10px;"><a href="#" onclick="$('#div_container').remove()"><img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/></a></div>
            <div style="position:absolute;top:8px;right: 35px;" id="div_minimize"><a href="#"><img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/></a></div>
            <div style="position:absolute;top:10px;right: 60px;" id="div_theme"><a href="#" onclick="$('#theme_settings').toggle()"><img src="https://img.icons8.com/material-sharp/24/fa314a/change-theme.png"/></a></div>
        </div>
        <div id="theme_settings"></div>
        <div id="div_body" style="height:600px;overflow:auto">

            <input class="btn evt-confirm-btn btn-confirm-yes" type="button" onclick="createTableSettings()" style="margin:10px" value="settings">
            <center style="margin:10px" ><div id="div_settings" hidden> </div></center>

            <div class="tab-panels" id="tabs_coord">
                <ul class="tabs">
                    <li class="update_tab own active" rel="panel1" ><font >panel1</font > <img class="remove_tab" src="https://img.icons8.com/doodle/16/000000/delete-sign.png"/>  </li>
                    <li id="add_tab"><img src="https://img.icons8.com/color/16/000000/add-tab.png"/> </li>
                </ul>
            <div id="all_tabs">
    
            <div id="panel1" class="panel own active" >
                <center>
                    <table class="scriptTableInner">
                    <tr>
                        <td colspan="3">
                            <input class="btn evt-confirm-btn btn-confirm-yes" type="button" style="margin:5px" onclick="calculateLaunches(event)" value="calculate">
                            <div hidden class="div_results"><input class="btn evt-confirm-btn btn-confirm-yes" type="button" style="margin:5px" value="results" ></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="icon header wood"></span>
                            <center style="margin:5px"><input type="number" class="input_wood scriptInput"  placeholder="140000" value="140000"></center>
                        </td>
                        <td >
                            <span class="icon header stone"></span>
                            <center style="margin:5px"><input type="number" class="input_stone scriptInput"  placeholder="150000" value="150000"></center>
                        </td>
                        <td>
                            <span class="icon header iron"></span>
                            <center style="margin:5px"><input type="number" class="input_iron scriptInput"  placeholder="125000" value="125000"></center>
                        </td>
                    </tr>
                    </table>
                </center>
                <br>
                <div style="display:flex;align-items: center;justify-content: center">
                    <div style="margin-right:${distanceTextarea}">
                        <center><p style="color:${textColor};font-weight: bold;">origin coords:</p></center>
                        <textarea id="input_origin${1}" class="scriptInput" style="width:100%" rows="${rows}" >origin coords${1}</textarea>
                        <center>
                            <select class="select_origin_coord" onchange="insertCoordsFromGroups(0)" style="width:${widthSelect}">
                                <option value="none">none</option>`;
  for (let i = 0; i < listGroups.length; i++) {
    html_info += `<option value="${listGroups[i].href}">${listGroups[i].groupName}</option>`;
  }
  html_info += `</select>
                            </center>
                    </div>
                    <div style="margin-left:${distanceTextarea}"> 
                        <center><p style="color:${textColor};font-weight: bold;">target coords:</p></center>
                        <textarea id="input_target${1}" class="scriptInput" style="width:100%" rows="${rows}" >target coords${1}</textarea>
                        <center>
                            <select class="select_target_coord" onchange="insertCoordsFromGroups(1)" style="width:${widthSelect}">
                                <option value="none">none</option>`;
  for (let i = 0; i < listGroups.length; i++) {
    html_info += `<option value="${listGroups[i].href}">${listGroups[i].groupName}</option>`;
  }
  html_info += `</select>
                            </center>
                        </div>
                    </div>
                </div>
            </div>

            <center><div id="table_view" style="height:300px;width:100%;overflow:auto"></div></center>
        </div>
        </div>
        <div class="scriptFooter">
            <div style=" margin-top:5px;"><h5>made by Costache</h5></div>
        </div>


    </div>`;
  ////////////////////////////////////////add and remove window from page///////////////////////////////////////////
  $("#div_container").remove();
  $("#contentContainer").eq(0).prepend(html_info);
  $("#mobileContent").eq(0).prepend(html_info);

  //for mobile browser

  $("#div_container").css("position", "fixed");
  $("#div_container").draggable();

  if (game_data.device != "desktop") {
    $("#div_body").css("height", "500px");
  }

  $("#div_minimize").on("click", () => {
    let currentWidthPercentage = Math.ceil(
      ($("#div_container").width() / $("body").width()) * 100
    );
    if (currentWidthPercentage >= widthInterface) {
      $("#div_container").css({ width: "10%" });
      $("#div_body").hide();
    } else {
      $("#div_container").css({ width: `${widthInterface}%` });
      $("#div_body").show();
    }
  });
  if (game_data.device != "desktop") {
    $("#div_body").css("height", "500px");
    $(".scriptTableInner").find("input[type=number]").css("width", "90%");
  }
}

function changeTheme() {
  let html = `
    <h3 style="color:${textColor};padding-left:10px;padding-top:5px">after theme is selected run the script again<h3>
    <table class="scriptTable" >
        
        <tr>
            <td>
                <select  id="select_theme">
                    <option value="theme1">theme1</option>
                    <option value="theme2">theme2</option>
                    <option value="theme3">theme3</option>
                    <option value="theme4">theme4</option>
                    <option value="theme5">theme5</option>
                    <option value="theme6">theme6</option>
                    <option value="theme7">theme7</option>
                    <option value="theme8">theme8</option>
                    <option value="theme9">theme9</option>
                    <option value="theme10">theme10</option>
                </select>
            </td>
            <td>value</td>
            <td >color hex</td>
        </tr>
        <tr>
            <td>textColor</td>
            <td style="background-color:${textColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${textColor}"></td>
        </tr>
        <tr>
            <td>backgroundInput</td>
            <td style="background-color:${backgroundInput}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInput}"></td>
        </tr>
        <tr>
            <td>borderColor</td>
            <td style="background-color:${borderColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${borderColor}"></td>
        </tr>
        <tr>
            <td>backgroundContainer</td>
            <td style="background-color:${backgroundContainer}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundContainer}"></td>
        </tr>
        <tr>
            <td>backgroundHeader</td>
            <td style="background-color:${backgroundHeader}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundHeader}"></td>
        </tr>
        <tr>
            <td>backgroundMainTable</td>
            <td style="background-color:${backgroundMainTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundMainTable}"></td>
        </tr>
        <tr>
            <td>backgroundInnerTable</td>
            <td style="background-color:${backgroundInnerTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInnerTable}"></td>
        </tr>
        <tr>
            <td>widthInterface</td>
            <td><input type="range" min="25" max="100" class="slider input_theme" id="input_slider_width" value="${widthInterface}"></td>
            <td id="td_width">${widthInterface}%</td>
        </tr>
        <tr >
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_save_theme" value="Save"></td>
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_reset_theme" value="Default themes"></td>
            <td></td>
        </tr>

    </table>
    `;
  $("#theme_settings").append(html);
  $("#theme_settings").hide();

  let selectedTheme = "";
  let colours = [];
  let mapTheme = new Map();

  $("#select_theme").on("change", () => {
    if (localStorage.getItem(localStorageThemeName) != undefined) {
      selectedTheme = $("#select_theme").find(":selected").text();
      colours = Array.from($(".input_theme")).map((elem) =>
        elem.value.toUpperCase().trim()
      );
      mapTheme = new Map(
        JSON.parse(localStorage.getItem(localStorageThemeName))
      );
      console.log(selectedTheme);
      console.log(mapTheme);
      colours = mapTheme.get(selectedTheme);
      console.log(colours);
      Array.from($(".input_theme")).forEach((elem, index) => {
        elem.value = colours[index];
      });
      Array.from($(".td_background")).forEach((elem, index) => {
        elem.style.background = colours[index];
      });

      mapTheme.set("currentTheme", selectedTheme);
      localStorage.setItem(
        localStorageThemeName,
        JSON.stringify(Array.from(mapTheme.entries()))
      );
    }
  });

  $("#btn_save_theme").on("click", () => {
    colours = Array.from($(".input_theme")).map((elem) =>
      elem.value.toUpperCase().trim()
    );
    selectedTheme = $("#select_theme").find(":selected").text();

    for (let i = 0; i < colours.length - 1; i++) {
      if (colours[i].match(/#[0-9 A-F]{6}/) == null) {
        UI.ErrorMessage("wrong colour: " + colours[i]);
        throw new Error("wrong colour");
      }
    }

    if (localStorage.getItem(localStorageThemeName) != undefined)
      mapTheme = new Map(
        JSON.parse(localStorage.getItem(localStorageThemeName))
      );

    mapTheme.set(selectedTheme, colours);
    mapTheme.set("currentTheme", selectedTheme);

    localStorage.setItem(
      localStorageThemeName,
      JSON.stringify(Array.from(mapTheme.entries()))
    );
    console.log("saved colours for: " + selectedTheme);
    UI.SuccessMessage(
      `saved colours for: ${selectedTheme} \n run the script again`,
      1000
    );
  });

  $("#btn_reset_theme").on("click", () => {
    localStorage.setItem(localStorageThemeName, defaultTheme);
    UI.SuccessMessage("run the script again", 1000);
  });
  $("#input_slider_width").on("input", () => {
    $("#td_width").text($("#input_slider_width").val() + "%");
  });

  if (localStorage.getItem(localStorageThemeName) != undefined) {
    mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)));
    let currentTheme = mapTheme.get("currentTheme");
    document.querySelector("#select_theme").value = currentTheme;
  }
}

function initializationTheme() {
  if (localStorage.getItem(localStorageThemeName) != undefined) {
    let mapTheme = new Map(
      JSON.parse(localStorage.getItem(localStorageThemeName))
    );
    let currentTheme = mapTheme.get("currentTheme");
    let colours = mapTheme.get(currentTheme);

    textColor = colours[0];
    backgroundInput = colours[1];

    borderColor = colours[2];
    backgroundContainer = colours[3];
    backgroundHeader = colours[4];
    backgroundMainTable = colours[5];
    backgroundInnerTable = colours[6];
    widthInterface = colours[7];

    if (game_data.device != "desktop") {
      widthInterface = 98;
    }

    backgroundAlternateTableEven = backgroundContainer;
    backgroundAlternateTableOdd = getColorDarker(
      backgroundContainer,
      headerColorAlternateTable
    );
    console.log("textColor: " + textColor);
    console.log("backgroundContainer: " + backgroundContainer);
  } else {
    localStorage.setItem(localStorageThemeName, defaultTheme);

    let mapTheme = new Map(
      JSON.parse(localStorage.getItem(localStorageThemeName))
    );
    let currentTheme = mapTheme.get("currentTheme");
    let colours = mapTheme.get(currentTheme);

    textColor = colours[0];
    backgroundInput = colours[1];

    borderColor = colours[2];
    backgroundContainer = colours[3];
    backgroundHeader = colours[4];
    backgroundMainTable = colours[5];
    backgroundInnerTable = colours[6];
    widthInterface = colours[7];

    if (game_data.device != "desktop") {
      widthInterface = 98;
    }

    backgroundAlternateTableEven = backgroundContainer;
    backgroundAlternateTableOdd = getColorDarker(
      backgroundContainer,
      headerColorAlternateTable
    );
  }
}

function addEventPanel() {
  $(".tab-panels .tabs li").each((index, item) => {
    // console.log(item.id)
    if (item.id != "add_tab") {
      $(item).off("click");
    }
  });
  $(".tab-panels .tabs li")
    .not("#add_tab")
    .on("click", function (event) {
      // console.log("addEventPanel")
      if (event.target.src == undefined) {
        // console.log("inside if")
        if ($(this).hasClass("active") == false) {
          $("#table_view, .div_results").hide();

          var $panel = $(this).closest(".tab-panels");
          $panel.find(".tabs li.active").removeClass("active");
          $(this).addClass("active");

          //figure out which panel to show
          var panelToShow = $(this).attr("rel");
          if (panelToShow != undefined) {
            //hide current panel
            $panel.find(".panel.active").slideUp(300, showNextPanel);

            //show next panel
            function showNextPanel() {
              $(this).removeClass("active");

              $("#" + panelToShow).slideDown(300, function () {
                $(this).addClass("active");
              });
            }
          }
          insertCoordsFromGroups(0);
          insertCoordsFromGroups(1);
        } else {
          let value = window.prompt("change name tab");
          // console.log(value)
          if (value != "" && value != null) {
            // console.log(this)
            if (this.children.length > 0) this.children[0].innerText = value;
            else this.innerText = value;
            saveOwnData();
          }
        }
      }
    });
}

function addNewPanel() {
  let rows = game_data.device == "desktop" ? 10 : 3;
  let distanceTextarea = game_data.device == "desktop" ? "30px" : "5px";
  let widthSelect = game_data.device == "desktop" ? "100%" : "80%";

  $("#add_tab").on("click", function () {
    let idNewPanel =
      parseInt(
        $(".tabs")
          .eq(0)
          .find("li")
          .last()
          .prev()
          .attr("rel")
          .replace("panel", "")
      ) + 1;
    let htmlLI = `<li class="update_tab own" rel="panel${idNewPanel}"> <font> panel${idNewPanel}</font> <img class="remove_tab" src="https://img.icons8.com/doodle/16/000000/delete-sign.png"/> </li>`;
    $("#add_tab").before(htmlLI);

    let htmlDIV =
      `
        <div id="panel` +
      idNewPanel +
      `" class="panel">
            <center>
                <table class="scriptTableInner">
                <tr>
                    <td colspan="3">
                        <input class="btn evt-confirm-btn btn-confirm-yes" type="button" style="margin:5px" onclick="calculateLaunches(event)" value="calculate">
                        <div hidden class="div_results"><input class="btn evt-confirm-btn btn-confirm-yes" type="button" style="margin:5px" value="results"></div>

                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="icon header wood"></span>
                        <center style="margin:5px"><input type="number" class="input_wood scriptInput" style="text-align:center;" min="0" max="400000" placeholder="140000" value="140000"></center>
                    </td>
                    <td>
                        <span class="icon header stone"></span>
                        <center style="margin:5px"><input type="number" class="input_stone scriptInput" style="text-align:center;" min="0" max="400000" placeholder="150000" value="150000"></center>
                    </td>
                    <td>
                        <span class="icon header iron"></span>
                        <center style="margin:5px"><input type="number" class="input_iron scriptInput" style="text-align:center;" min="0" max="400000" placeholder="125000" value="125000"></center>
                    </td>
                </tr>
            
                </table>
            </center>
        
            <br>
            <div style="display:flex;align-items: center;justify-content: center;">
                <div style="margin-right:${distanceTextarea}">
                    <center><p style="color:${textColor};font-weight: bold;">origin coords:</p></center>
                    <textarea id="input_origin${idNewPanel}" class="scriptInput" style="width:100%" rows="${rows}" >origin coords${idNewPanel}</textarea>
                    <center>
                        <select class="select_origin_coord" onchange="insertCoordsFromGroups(0)" style="width:${widthSelect}">
                            <option value="none">none</option>`;
    for (let i = 0; i < listGroups.length; i++) {
      htmlDIV += `<option value="${listGroups[i].href}">${listGroups[i].groupName}</option>`;
    }
    htmlDIV += `</select>
                    </center>
                </div>
                <div style="margin-left:${distanceTextarea}"> 
                    <center><p style="color:${textColor};font-weight: bold;">target coords:</p></center>
                    <textarea id="input_target${idNewPanel}" class="scriptInput" style="width:100%" rows="${rows}" >target coords${idNewPanel}</textarea>
                    <center>
                        <select class="select_target_coord" onchange="insertCoordsFromGroups(1)" style="width:${widthSelect}">
                            <option value="none">none</option>`;
    for (let i = 0; i < listGroups.length; i++) {
      htmlDIV += `<option value="${listGroups[i].href}">${listGroups[i].groupName}</option>`;
    }
    htmlDIV += `</select>
                    </center>
                </div>
            </div>


            
        </div>`;
    $("#all_tabs").append(htmlDIV);

    addEventPanel();
    removePanel();
    getCoordsEvent();
    saveOwnData();

    if (game_data.device != "desktop") {
      $("#div_body").css("height", "500px");
      $(".scriptTableInner").find("input[type=number]").css("width", "90%");
    }
  });
}

function removePanel() {
  $(".remove_tab").off("click");
  $(".remove_tab").on("click", function () {
    var confirm = window.confirm("are you sure?");
    if (confirm == true && $(".remove_tab").length > 1) {
      let removePanel = $(this).parent().attr("rel");
      $(this).parent().remove();
      $("#" + removePanel).remove();

      if ($(".active").length == 0) {
        let lastTab = $(".update_tab").last();
        lastTab.addClass("active");
        let panelId = lastTab.attr("rel");
        $("#" + panelId).addClass("active");
        $("#" + panelId).slideDown(300);
      }
    }
    saveOwnData();
  });
}

function saveOwnData() {
  let list_name_tabs = Array.from($(".tabs").eq(0).find(".own")).map((e) =>
    e.innerText.trim()
  );
  localStorage.setItem(
    game_data.world + "res_sender_tabs_name",
    JSON.stringify(list_name_tabs)
  );
  let list_input = [];

  //save inputs
  $(
    "#tabs_coord input[type=number],#tabs_coord textarea, #tabs_coord select"
  ).each(function () {
    // var checked = this.checked
    var value = this.value;
    // console.log(value)
    list_input.push(value);
  });

  let data = JSON.stringify(list_input);

  localStorage.setItem(game_data.world + "res_sender_tabs2", data);

  //save settings
  $(
    "#tabs_coord input[type=number], #tabs_coord textarea, #tabs_coord select"
  ).off("click input change");
  $(
    "#tabs_coord input[type=number], #tabs_coord textarea, #tabs_coord select"
  ).on("click input change", () => {
    console.log("save settings");
    let list_input = [];

    //save inputs
    $(
      "#tabs_coord input[type=number],#tabs_coord textarea, #tabs_coord select"
    ).each(function () {
      // var checked = this.checked
      var value = this.value;
      // console.log(value)
      list_input.push(value);
    });

    // console.log(list_input)
    let data = JSON.stringify(list_input);
    localStorage.setItem(game_data.world + "res_sender_tabs2", data);

    let list_name_tabs = Array.from($(".tabs").eq(0).find(".own")).map((e) =>
      e.innerText.trim()
    );
    localStorage.setItem(
      game_data.world + "res_sender_tabs_name",
      JSON.stringify(list_name_tabs)
    );
  });
}

function getCoordsEvent() {
  console.log("getCoordEvent");
  $("textarea").off("mouseout");
  $("textarea").mouseout(function () {
    let current_value = this.value;
    if (current_value.match(/[0-9]{3}\|[0-9]{3}/) != null) {
      let coords = current_value.match(/[0-9]{3}\|[0-9]{3}/g);
      let set = new Set(coords);
      coords = [...set];

      this.value = Array.from(coords).join(" ");
      let paragraph = $(this).parent().find("p").last();
      let text = paragraph.text().replace(/\d+/g, "");

      paragraph.text(text + coords.length);
    }
    saveOwnData();
  });
}

function createTableSettings() {
  let html_table = `
    <table id="settings_table" class="scriptTable">
        <tr>
            <td>setting name</td>
            <td>setting value</td>
        </tr>
        <tr>
            <td>reserve merchants</td>
            <td ><input type="number" id="reserve_merchants" class="scriptInput" placeholder="0" value="0"><a href="#" onclick="UI.InfoMessage('how many merchants you want to keep home as reserve',3000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 13px; height: 13px"/></a></td>
        </tr>
        <tr >
            <td>min resources</td>
            <td><input type="number" id="min_resources" class="scriptInput" placeholder="0" value="0"><a href="#" onclick="UI.InfoMessage('send resources if resources available are above min resources value',3000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 13px; height: 13px"/></a></td>
        </tr>
        <tr >
            <td>max distance(fields)</td>
            <td> <input type="number" id="max_distance" class="scriptInput" placeholder="0" value="500"><a href="#" onclick="UI.InfoMessage('send resources if travel distance is smaller than maximum distance value',3000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 13px; height: 13px"/></a></td>
        </tr>
        <tr hidden  id="tr_merchant_capacity">
            <td>merchants capacity</td>
            <td><input type="number" id="merchant_capacity" class="scriptInput" placeholder="1000" value="1000"></td>
        </tr>
        <tr>
            <td>overflow protection</td>
            <td><input type="checkbox" id="overflow_wh" checked="false"><a href="#" style="margin-left:10px" onclick="UI.InfoMessage('it will not send resources more than 95% from your warehouse capacity',3000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 13px; height: 13px"/></a></td>
            
        </tr>

    </table>`;
  if (document.getElementById("settings_table") == null) {
    document.getElementById("div_settings").innerHTML = html_table;

    if (game_data.locale == "pt_PT") {
      $("#tr_merchant_capacity").show();
    }

    //initialize input numbers
    let list_input = JSON.parse(
      localStorage.getItem(game_data.world + "res_sender_settings")
    );
    if (list_input != null) {
      let index = 0;
      $("#div_settings input[type=number]").each(function (elem) {
        this.value = list_input[index];
        index++;
      });
      $("#div_settings input[type=checkbox]").each(function (elem) {
        this.checked = list_input[index];
        index++;
      });
    }

    $(
      "#div_settings input[type=number], #div_settings input[type=checkbox]"
    ).off("click input change");
    $(
      "#div_settings input[type=number], #div_settings input[type=checkbox]"
    ).on("click input change", () => {
      let list_input = [];
      //save inputs
      $("#div_settings input[type=number]").each(function () {
        list_input.push(this.value);
      });

      $("#div_settings input[type=checkbox]").each(function () {
        list_input.push(this.checked);
      });

      console.log(list_input);
      let data = JSON.stringify(list_input);
      localStorage.setItem(game_data.world + "res_sender_settings", data);
    });
  } else {
    $("#div_settings").toggle(500);
  }
}

function initializationOwnTabs() {
  if (localStorage.getItem(game_data.world + "res_sender_tabs2") != null) {
    let list_input = JSON.parse(
      localStorage.getItem(game_data.world + "res_sender_tabs2")
    );
    let list_name_tabs = JSON.parse(
      localStorage.getItem(game_data.world + "res_sender_tabs_name")
    );
    console.log("list_input", list_input);
    console.log("list_name_tabs", list_name_tabs);
    if (list_name_tabs != undefined) {
      for (let i = 0; i < list_name_tabs.length - 1; i++) {
        document.getElementById("add_tab").click();
      }
      let index = 0;
      //initialize input numbers
      $(
        "#tabs_coord input[type=number],#tabs_coord textarea, #tabs_coord select"
      ).each(function (elem) {
        // console.log(this.value)
        this.value = list_input[index];
        // console.log(this.value)
        index++;
      });

      //initialize name's tabs

      Array.from($(".tabs").eq(0).find(".own")).forEach((elem, index) => {
        elem.getElementsByTagName("font")[0].innerText = list_name_tabs[index];
      });
    }
    saveOwnData();
  }
}

async function calculateLaunches(event) {
  let reserve_merchants = parseInt(
    document.getElementById("reserve_merchants").value
  );
  let min_resources = parseInt(document.getElementById("min_resources").value);
  let max_distance = parseInt(document.getElementById("max_distance").value);
  let merchant_capacity = parseInt(
    document.getElementById("merchant_capacity").value
  );
  let overflow_protection = document.getElementById("overflow_wh").checked;

  let map_production = await getDataProduction().catch((err) => alert(err));
  let map_villageInfo = await getInfoVIllages().catch((err) => alert(err));
  let map_incoming = await getDataIncoming().catch((err) => alert(err));
  let map_production_home = new Map();
  Array.from(map_production.keys()).forEach((key) => {
    let obj = JSON.parse(JSON.stringify(map_production.get(key)));
    map_production_home.set(key, obj);
  });

  reserve_merchants =
    Number.isNaN(reserve_merchants) == true || reserve_merchants < 0
      ? 0
      : reserve_merchants;
  min_resources =
    Number.isNaN(min_resources) == true || min_resources < 0
      ? 0
      : min_resources;
  max_distance =
    Number.isNaN(max_distance) == true || max_distance < 0 ? 0 : max_distance;
  merchant_capacity =
    Number.isNaN(merchant_capacity) == true
      ? 1000
      : merchant_capacity < 1000
      ? 1000
      : merchant_capacity > 1500
      ? 1500
      : merchant_capacity; //capacitiy is 1000 but for .PT might be 1500

  console.log("map_production", map_production);
  console.log("map_production_home", map_production_home);
  console.log("map_incoming", map_incoming);
  console.log("merchant_capacity", merchant_capacity);

  let wood_send = parseInt(
    $(event.target).closest("div").find(".input_wood").val()
  );
  let stone_send = parseInt(
    $(event.target).closest("div").find(".input_stone").val()
  );
  let iron_send = parseInt(
    $(event.target).closest("div").find(".input_iron").val()
  );
  let origin_coord = $(event.target)
    .closest("div")
    .find("textarea")
    .eq(0)
    .val()
    .match(/[0-9]{3}\|[0-9]{3}/g);
  let target_coord = $(event.target)
    .closest("div")
    .find("textarea")
    .eq(1)
    .val()
    .match(/[0-9]{3}\|[0-9]{3}/g);

  origin_coord = origin_coord.filter((e) => !target_coord.includes(e));

  console.log("origin_coord", origin_coord);
  console.log("target_coord", target_coord);

  //add incoming resources
  Array.from(map_production.keys()).forEach((key) => {
    let object = map_production.get(key);
    if (map_incoming.has(key)) {
      object.wood = object.wood + map_incoming.get(key).wood;
      object.stone = object.stone + map_incoming.get(key).stone;
      object.iron = object.iron + map_incoming.get(key).iron;
      map_production.set(key, object);
    }
  });
  console.log("map_production", map_production);
  console.log("map_production_home", map_production_home);

  let list_launches = [];
  if (origin_coord != null && target_coord != null) {
    //eliminate duplicates
    let set = new Set(origin_coord);
    origin_coord = [...set];

    set = new Set(target_coord);
    target_coord = [...set];

    let list_res_send = [],
      list_res_get = [];
    let wood_total = 0,
      stone_total = 0,
      iron_total = 0;
    for (let i = 0; i < origin_coord.length; i++) {
      let obj = map_production_home.get(origin_coord[i]);
      if (obj == undefined) {
        UI.ErrorMessage(
          "origin coords are not found in the current group",
          2000
        );
        throw new Error("origin coord doesn't exist in the current group");
      }

      let capacitiy_available = obj.merchants * merchant_capacity;

      // console.log(obj)
      obj.merchants -= reserve_merchants;

      let wood_available =
        obj.wood > min_resources
          ? Math.min(obj.wood - min_resources, wood_send)
          : 0;
      let stone_available =
        obj.stone > min_resources
          ? Math.min(obj.stone - min_resources, stone_send)
          : 0;
      let iron_available =
        obj.iron > min_resources
          ? Math.min(obj.iron - min_resources, iron_send)
          : 0;

      let factor_available_wood = wood_available / wood_send;
      let factor_available_stone = stone_available / stone_send;
      let factor_available_iron = iron_available / iron_send;

      // console.log(`wood_available:${wood_available}, stone_available:${stone_available}, iron_available:${iron_available}`)
      let min_factor_available = Math.min(
        factor_available_wood,
        factor_available_stone,
        factor_available_iron
      );
      if (min_factor_available < 1) {
        //if one type of res has less than the other => normalize the other res
        if (min_factor_available == factor_available_wood) {
          stone_available = Math.round(
            Math.max(stone_send, stone_available) * min_factor_available
          );
          iron_available = Math.round(
            Math.max(iron_send, iron_available) * min_factor_available
          );
          // console.log(`min_factor_available wood:${min_factor_available}`)
        }
        if (min_factor_available == factor_available_stone) {
          wood_available = Math.round(
            Math.max(wood_send, wood_available) * min_factor_available
          );
          iron_available = Math.round(
            Math.max(iron_send, iron_available) * min_factor_available
          );
          // console.log(`min_factor_available stone:${min_factor_available}`)
        }
        if (min_factor_available == factor_available_iron) {
          wood_available = Math.round(
            Math.max(wood_send, wood_available) * min_factor_available
          );
          stone_available = Math.round(
            Math.max(stone_send, stone_available) * min_factor_available
          );
          // console.log(`min_factor_available iron:${min_factor_available}`)
        }
      }
      // console.log(`norm available: wood_available:${wood_available}, stone_available:${stone_available}, iron_available:${iron_available}`)

      //normalize by total capacity
      let total_res = wood_available + stone_available + iron_available;
      let factor_capacity =
        total_res > capacitiy_available ? capacitiy_available / total_res : 1;
      wood_available = Math.round(wood_available * factor_capacity);
      stone_available = Math.round(stone_available * factor_capacity);
      iron_available = Math.round(iron_available * factor_capacity);
      // console.log(`norm capacity: wood_available:${wood_available}, stone_available:${stone_available}, iron_available:${iron_available}`)

      list_res_send.push({
        coord_origin: obj.coord,
        id_origin: obj.id,
        wood: wood_available,
        stone: stone_available,
        iron: iron_available,
      });

      //how many res will get each target coord, every village will get the same amount of res
      wood_total += wood_available;
      stone_total += stone_available;
      iron_total += iron_available;
    }
    console.log(
      `wood_total:${wood_total}, stone_total:${stone_total}, iron_total:${iron_total}`
    );
    let mapTargets = new Map();
    let maxResource = Math.max(wood_total, stone_total, iron_total);

    //sort total amount of resources
    let sortedResources = [
      {
        value: wood_total,
        type: "wood",
      },
      {
        value: stone_total,
        type: "stone",
      },
      {
        value: iron_total,
        type: "iron",
      },
    ].sort((o1, o2) => {
      return o1.value > o2.value ? 1 : o1.value < o2.value ? -1 : 0;
    });

    let factorResources = {};
    factorResources[sortedResources[0].type] =
      sortedResources[0].value / sortedResources[2].value;
    factorResources[sortedResources[1].type] =
      sortedResources[1].value / sortedResources[2].value;
    factorResources[sortedResources[2].type] = 1;

    console.log(sortedResources);

    let minRes = 1000;
    let minResWood = Math.round(minRes * factorResources["wood"]);
    let minResStone = Math.round(minRes * factorResources["stone"]);
    let minResIron = Math.round(minRes * factorResources["iron"]);
    console.log("minResWood", minResWood);
    console.log("minResStone", minResStone);
    console.log("minResIron", minResIron);

    let safetyBreak = Math.round(maxResource / minRes) + 1;
    let indexSafetyBreak = 0;

    while (
      wood_total > minResWood ||
      stone_total > minResStone ||
      iron_total > minResIron
    ) {
      let breakLoop = true;
      for (let i = 0; i < target_coord.length; i++) {
        if (mapTargets.has(target_coord[i])) {
          let obj = mapTargets.get(target_coord[i]);
          // console.log(obj)

          //limit sending resource to not overflow
          let final_wood = obj.wood + minResWood;
          let final_stone = obj.stone + minResStone;
          let final_iron = obj.iron + minResIron;

          if (
            overflow_protection == true &&
            map_production.has(target_coord[i])
          ) {
            let whCapacity =
              map_production.get(target_coord[i]).capacity * 0.95;
            // console.log(whCapacity)
            let existentWood = map_production.get(target_coord[i]).wood;
            let existentStone = map_production.get(target_coord[i]).stone;
            let existentIron = map_production.get(target_coord[i]).iron;

            final_wood =
              final_wood + existentWood < whCapacity
                ? final_wood
                : Math.max(whCapacity - existentWood, 0);
            final_stone =
              final_stone + existentStone < whCapacity
                ? final_stone
                : Math.max(whCapacity - existentStone, 0);
            final_iron =
              final_iron + existentIron < whCapacity
                ? final_iron
                : Math.max(whCapacity - existentIron, 0);

            final_wood = Math.round(final_wood);
            final_stone = Math.round(final_stone);
            final_iron = Math.round(final_iron);
          }
          if (final_wood > obj.wood && wood_total > minResWood) {
            wood_total -= 1000;
            breakLoop = false;
          }
          if (final_stone > obj.stone && stone_total > minResStone) {
            stone_total -= 1000;
            breakLoop = false;
          }
          if (final_iron > obj.iron && iron_total > minResIron) {
            iron_total -= 1000;
            breakLoop = false;
          }

          mapTargets.set(target_coord[i], {
            coord_target: target_coord[i],
            id_target: map_villageInfo.get(target_coord[i]),
            wood: final_wood,
            stone: final_stone,
            iron: final_iron,
          });
        } else {
          mapTargets.set(target_coord[i], {
            coord_target: target_coord[i],
            id_target: map_villageInfo.get(target_coord[i]),
            wood: 0,
            stone: 0,
            iron: 0,
          });
          breakLoop = false;
        }
      }

      if (breakLoop == true) {
        console.log("finish after: " + indexSafetyBreak + " iterations");
        break;
      }

      indexSafetyBreak++;
      if (indexSafetyBreak > safetyBreak) {
        console.log("safety break after: " + indexSafetyBreak + " iterations");
        break;
      }
    }
    console.log(
      `wood_total:${wood_total}, stone_total:${stone_total}, iron_total:${iron_total}`
    );
    console.log(mapTargets);
    list_res_get = [...mapTargets.values()];

    console.log("list_res_get", list_res_get);
    console.log("list_res_send", list_res_send);

    for (let i = 0; i < list_res_get.length; i++) {
      let id_target = list_res_get[i].id_target;
      let coord_target = list_res_get[i].coord_target;

      //calculate distance from target coord to each origin coord and then sort
      for (let j = 0; j < list_res_send.length; j++) {
        let distance = calcDistance(
          list_res_get[i].coord_target,
          list_res_send[j].coord_origin
        );
        list_res_send[j].distance = distance;
      }
      list_res_send.sort((o1, o2) => {
        return o1.distance > o2.distance
          ? 1
          : o1.distance < o2.distance
          ? -1
          : 0;
      });

      let obj_launch = {
        wood: 0,
        stone: 0,
        iron: 0,
      };

      for (let j = 0; j < list_res_send.length; j++) {
        if (
          list_res_send[j].distance <= max_distance &&
          list_res_get[i].coord_target != list_res_send[j].coord_origin
        ) {
          let coord_origin = list_res_send[j].coord_origin;
          let id_origin = list_res_send[j].id_origin;

          // if resources send >0 then return minimum between send and ged othervise return current value
          let send_wood =
            list_res_send[j].wood > 0
              ? Math.min(list_res_get[i].wood, list_res_send[j].wood)
              : 0;
          let send_stone =
            list_res_send[j].stone > 0
              ? Math.min(list_res_get[i].stone, list_res_send[j].stone)
              : 0;
          let send_iron =
            list_res_send[j].iron > 0
              ? Math.min(list_res_get[i].iron, list_res_send[j].iron)
              : 0;

          obj_launch.wood += send_wood;
          obj_launch.stone += send_stone;
          obj_launch.iron += send_iron;

          list_res_get[i].wood -= send_wood;
          list_res_get[i].stone -= send_stone;
          list_res_get[i].iron -= send_iron;

          list_res_send[j].wood -= send_wood;
          list_res_send[j].stone -= send_stone;
          list_res_send[j].iron -= send_iron;

          let total_send = send_wood + send_stone + send_iron;

          //stupid bug, if a resource has xxx699 must get rid of 699
          let restDivision = total_send % merchant_capacity;
          let minim_resources = merchant_capacity == 1000 ? 700 : 1200; // special case for PT
          if (restDivision < minim_resources) {
            if (send_wood > restDivision) {
              send_wood -= restDivision;
              total_send -= restDivision;
            } else if (send_stone > restDivision) {
              send_stone -= restDivision;
              total_send -= restDivision;
            } else if (send_iron > restDivision) {
              send_iron -= restDivision;
              total_send -= restDivision;
            }
          }

          let own_village = false;
          if (map_production.has(coord_target)) own_village = true;

          if (total_send >= minim_resources)
            list_launches.push({
              total_send: total_send,
              wood: send_wood,
              stone: send_stone,
              iron: send_iron,
              coord_target: coord_target,
              coord_origin: coord_origin,
              id_origin: id_origin,
              id_target: id_target,
              distance: list_res_send[j].distance,
              own_village: own_village,
            });

          let total_get =
            list_res_get[i].wood + list_res_get[i].stone + list_res_get[i].iron;
          if (total_get < minim_resources) {
            // console.log("done sending here")
            break;
          }
        }
      }
    }
    console.log("list_launches", list_launches);

    let map_launches_mass = new Map();

    for (let i = 0; i < list_launches.length; i++) {
      let target_id = list_launches[i].id_target;
      let origin_id = list_launches[i].id_origin;
      let woodKey = `resource[${origin_id}][wood]`;
      let stoneKey = `resource[${origin_id}][stone]`;
      let ironKey = `resource[${origin_id}][iron]`;
      let send_resources = {};

      if (map_production.has(list_launches[i].coord_target)) {
        //create a map with every launch
        if (map_launches_mass.has(target_id)) {
          let obj_update = map_launches_mass.get(target_id);
          obj_update.send_resources[woodKey] = list_launches[i].wood;
          obj_update.send_resources[stoneKey] = list_launches[i].stone;
          obj_update.send_resources[ironKey] = list_launches[i].iron;

          obj_update.total_send += list_launches[i].total_send;
          obj_update.total_wood += list_launches[i].wood;
          obj_update.total_stone += list_launches[i].stone;
          obj_update.total_iron += list_launches[i].iron;

          obj_update.distance = Math.max(
            obj_update.distance,
            list_launches[i].distance
          );
          map_launches_mass.set(target_id, obj_update);
        } else {
          send_resources[woodKey] = list_launches[i].wood;
          send_resources[stoneKey] = list_launches[i].stone;
          send_resources[ironKey] = list_launches[i].iron;

          map_launches_mass.set(target_id, {
            target_id: target_id,
            coord_target: list_launches[i].coord_target,
            send_resources: send_resources,
            total_send: list_launches[i].total_send,
            total_wood: list_launches[i].wood,
            total_stone: list_launches[i].stone,
            total_iron: list_launches[i].iron,
            distance: list_launches[i].distance,
          });
        }
      }
    }
    // console.log("map_launches_mass",map_launches_mass)
    // for(let i=0;i<list_launches.length;i++){
    //     console.log(`coord origin:${list_launches[i].coord_origin}, coord target:${list_launches[i].coord_target}, max:${list_launches[i].total_send}`)
    // }

    createTable(list_launches, map_launches_mass);
  }
}

function getDataProduction() {
  return new Promise((resolve, reject) => {
    let link_combined_production =
      game_data.link_base_pure +
      "overview_villages&mode=prod&mode=prod&group=0";
    console.log(link_combined_production);
    let datePage = httpGet(link_combined_production);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(datePage, "text/html");
    let list_pages = [];

    if ($(htmlDoc).find(".paged-nav-item").parent().find("select").length > 0) {
      Array.from(
        $(htmlDoc)
          .find(".paged-nav-item")
          .parent()
          .find("select")
          .find("option")
      ).forEach(function (item) {
        list_pages.push(item.value);
      });
      list_pages.pop();
    } else if (htmlDoc.getElementsByClassName("paged-nav-item").length > 0) {
      //all pages from the current folder
      let nr = 0;
      Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(
        function (item) {
          let current = item.href;
          current = current.split("page=")[0] + "page=" + nr;
          nr++;
          list_pages.push(current);
        }
      );
    } else {
      list_pages.push(link_combined_production);
    }
    list_pages = list_pages.reverse();
    console.log(list_pages);

    // go to every page and get incoming
    let map_production = new Map();
    function ajaxRequest(urls) {
      let current_url;
      if (urls.length > 0) {
        current_url = urls.pop();
      } else {
        current_url = "stop";
      }
      console.log(current_url);
      let start_ajax = new Date().getTime();
      if (urls.length >= 0 && current_url != "stop") {
        $.ajax({
          url: current_url,
          method: "get",
          success: (data) => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, "text/html");

            if (game_data.device == "desktop") {
              let table_production = Array.from(
                $(htmlDoc).find(".row_a, .row_b")
              );
              for (let i = 0; i < table_production.length; i++) {
                let name = table_production[i]
                  .getElementsByClassName("quickedit-vn")[0]
                  .innerText.trim();
                let coord = table_production[i]
                  .getElementsByClassName("quickedit-vn")[0]
                  .innerText.match(/[0-9]{3}\|[0-9]{3}/)[0];
                let id = table_production[i]
                  .getElementsByClassName("quickedit-vn")[0]
                  .getAttribute("data-id");

                let wood = parseInt(
                  table_production[i]
                    .getElementsByClassName("wood")[0]
                    .innerText.replace(".", "")
                );
                let stone = parseInt(
                  table_production[i]
                    .getElementsByClassName("stone")[0]
                    .innerText.replace(".", "")
                );
                let iron = parseInt(
                  table_production[i]
                    .getElementsByClassName("iron")[0]
                    .innerText.replace(".", "")
                );
                let merchants = parseInt(
                  table_production[i]
                    .querySelector("a[href*='market']")
                    .innerText.split("/")[0]
                );
                let merchants_total = parseInt(
                  table_production[i]
                    .querySelector("a[href*='market']")
                    .innerText.split("/")[1]
                );
                let capacity = parseInt(
                  table_production[i].children[4].innerText
                );
                let points = parseInt(
                  table_production[i].children[2].innerText.replace(".", "")
                );
                let farm_current_pop = parseInt(
                  table_production[i].children[6].innerText.split("/")[0]
                );
                let farm_total_pop = parseInt(
                  table_production[i].children[6].innerText.split("/")[1]
                );
                let farm_usage = farm_current_pop / farm_total_pop;

                let obj = {
                  coord: coord,
                  id: id,
                  wood: wood,
                  stone: stone,
                  iron: iron,
                  name: name,
                  merchants: merchants,
                  merchants_total: merchants_total,
                  capacity: capacity,
                  points: points,
                };

                map_production.set(coord, obj);
              }
            } else {
              let table_production = Array.from(
                $(htmlDoc).find("#production_table").find(".nowrap")
              );
              console.log(table_production);
              for (let i = 0; i < table_production.length; i++) {
                let name =
                  table_production[
                    i
                  ].previousElementSibling.children[0].innerText.trim();
                let coord =
                  table_production[
                    i
                  ].previousElementSibling.children[0].innerText.match(
                    /\d+\|\d+/
                  )[0];
                let id = table_production[i].previousElementSibling
                  .getElementsByClassName("quickedit-vn")[0]
                  .getAttribute("data-id");

                let wood = parseInt(
                  table_production[i]
                    .getElementsByClassName("mwood")[0]
                    .innerText.replace(".", "")
                );
                let stone = parseInt(
                  table_production[i]
                    .getElementsByClassName("mstone")[0]
                    .innerText.replace(".", "")
                );
                let iron = parseInt(
                  table_production[i]
                    .getElementsByClassName("miron")[0]
                    .innerText.replace(".", "")
                );
                let merchants = parseInt(
                  table_production[i].querySelector("a[href*='market']")
                    .innerText
                );
                let merchants_total = 500;
                let capacity = parseInt(
                  table_production[i].getElementsByClassName("ressources")[0]
                    .parentElement.innerText
                );
                let points = parseInt(
                  table_production[
                    i
                  ].previousElementSibling.children[1].innerText.replace(
                    ".",
                    ""
                  )
                );
                let farm_current_pop = parseInt(
                  table_production[i]
                    .getElementsByClassName("population")[0]
                    .parentElement.innerText.split("/")[0]
                );
                let farm_total_pop = parseInt(
                  table_production[i]
                    .getElementsByClassName("population")[0]
                    .parentElement.innerText.split("/")[1]
                );
                let farm_usage = farm_current_pop / farm_total_pop;

                let obj = {
                  coord: coord,
                  id: id,
                  wood: wood,
                  stone: stone,
                  iron: iron,
                  name: name,
                  merchants: merchants,
                  merchants_total: merchants_total,
                  capacity: capacity,
                  points: points,
                };
                map_production.set(coord, obj);
              }
            }

            let stop_ajax = new Date().getTime();
            let diff = stop_ajax - start_ajax;
            console.log("wait: " + diff);
            window.setTimeout(function () {
              ajaxRequest(list_pages);
              UI.SuccessMessage("get production page: " + urls.length);
            }, 200 - diff);
          },
          error: (err) => {
            reject(err);
          },
        });
      } else {
        UI.SuccessMessage("done");
        resolve(map_production);
        // console.log(list_production)
      }
    }
    ajaxRequest(list_pages);
  });
}

function calcDistance(coord1, coord2) {
  let x1 = parseInt(coord1.split("|")[0]);
  let y1 = parseInt(coord1.split("|")[1]);
  let x2 = parseInt(coord2.split("|")[0]);
  let y2 = parseInt(coord2.split("|")[1]);

  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function getInfoVIllages() {
  return new Promise((resolve, reject) => {
    console.log("get info VIllages");
    var mapVillage = new Map();
    let obj = {};
    let server_date = document
      .getElementById("serverDate")
      .innerText.split("/");
    let server_time = document.getElementById("serverTime").innerText;
    let current_date = new Date(
      server_date[1] +
        "/" +
        server_date[0] +
        "/" +
        server_date[2] +
        " " +
        server_time
    );
    let url = window.location.href.split("/game.php")[0];

    if (localStorage.getItem(game_data.world + "inno_coords") == null) {
      let dataVillage = httpGet(url + "/map/village.txt").split(/\r?\n/);

      for (let i = 0; i < dataVillage.length; i++) {
        let coord =
          dataVillage[i].split(",")[2] + "|" + dataVillage[i].split(",")[3];
        let id = dataVillage[i].split(",")[0];
        mapVillage.set(coord, id);
      }
      obj.datetime = current_date;
      obj.data = Array.from(mapVillage.entries());

      var data = lzw_encode(JSON.stringify(obj));
      localStorage.setItem(game_data.world + "inno_coords", data);
    } else {
      let inno_db = JSON.parse(
        lzw_decode(localStorage.getItem(game_data.world + "inno_coords"))
      );
      let db_date = inno_db.datetime;
      mapVillage = new Map(inno_db.data);
      // console.log(mapVillage)
      if (new Date(current_date).getTime() - new Date(db_date) > 3600 * 1000) {
        let dataVillage = httpGet(url + "/map/village.txt").split(/\r?\n/);

        for (let i = 0; i < dataVillage.length; i++) {
          let coord =
            dataVillage[i].split(",")[2] + "|" + dataVillage[i].split(",")[3];
          let id = dataVillage[i].split(",")[0];
          mapVillage.set(coord, id);
        }
        obj.datetime = current_date;
        obj.data = Array.from(mapVillage.entries());

        var data = lzw_encode(JSON.stringify(obj));
        localStorage.setItem(game_data.world + "inno_coords", data);

        console.log("upload new data");
      } else {
        console.log("already exist");
      }
    }
    resolve(mapVillage);
  });
}

////////////////////////////////////////////////data compression////////////////////////////////////////////////////////////////////////////

function lzw_encode(s) {
  if (!s) return s;
  var dict = new Map(); // Use a Map!
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  for (var i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict.has(phrase + currChar)) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict.get(phrase) : phrase.codePointAt(0));
      dict.set(phrase + currChar, code);
      code++;
      if (code === 0xd800) {
        code = 0xe000;
      }
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict.get(phrase) : phrase.codePointAt(0));
  for (var i = 0; i < out.length; i++) {
    out[i] = String.fromCodePoint(out[i]);
  }
  //console.log ("LZW MAP SIZE", dict.size, out.slice (-50), out.length, out.join("").length);
  return out.join("");
}
////////////////////////////////////////////////data decompression////////////////////////////////////////////////////////////////////////////
function lzw_decode(s) {
  var dict = new Map(); // Use a Map!
  var data = Array.from(s + "");
  //var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;
  for (var i = 1; i < data.length; i++) {
    var currCode = data[i].codePointAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict.has(currCode) ? dict.get(currCode) : oldPhrase + currChar;
    }
    out.push(phrase);
    var cp = phrase.codePointAt(0);
    currChar = String.fromCodePoint(cp); //phrase.charAt(0);
    dict.set(code, oldPhrase + currChar);
    code++;
    if (code === 0xd800) {
      code = 0xe000;
    }
    oldPhrase = phrase;
  }
  return out.join("");
}

////////////////////////////////////////////////////////////////////table send resources/////////////////////////////////////////////////////////////////////
async function createTable(list_launches, map_launches_mass) {
  let html_prod_table = `
        <table  class="scriptTableAlternate" >
        <tr>
            <td>nr</td>
            <td>target</td>
            <td>max distance</td>
            <td><a href="#" id="sort_total"><font color=${textColor}>total send</font></a></td>
            <td class="hideMobile"><a href="#" id="sort_wood"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></a></td>
            <td class="hideMobile"><a href="#" id="sort_stone"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/></a></td>
            <td class="hideMobile"><a href="#" id="sort_iron"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/></a></td>
            <td>send</td>             
        </tr>`;

  let counter = 0;
  let map_total_send = new Map();

  for (let i = 0; i < list_launches.length; i++) {
    let target_id,
      origin_id,
      coord_target,
      wood,
      stone,
      iron,
      id_origin,
      data,
      distance,
      total_send;
    let hasInfo = true;

    if (list_launches[i].own_village == false) {
      target_id = list_launches[i].id_target;
      origin_id = list_launches[i].id_origin;

      coord_target = list_launches[i].coord_target;
      wood = list_launches[i].wood;
      stone = list_launches[i].stone;
      iron = list_launches[i].iron;
      id_origin = list_launches[i].id_origin;
      distance = list_launches[i].distance;
      total_send = list_launches[i].total_send;
    } else {
      let obj = map_launches_mass.get(list_launches[i].id_target);
      if (obj == undefined) hasInfo = false;
      else {
        target_id = obj.target_id;
        coord_target = obj.coord_target;
        wood = obj.total_wood;
        stone = obj.total_stone;
        iron = obj.total_iron;
        data = JSON.stringify(obj.send_resources);
        distance = obj.distance;
        total_send = obj.total_send;

        map_launches_mass.delete(list_launches[i].id_target);
      }
    }

    if (hasInfo == true) {
      counter++;

      html_prod_table += `
                <tr id="delete_row" >
                    <td>${counter}</td>            
                    <td><a href="${
                      game_data.link_base_pure
                    }info_village&id=${target_id}"><center><font color="${textColor}">${coord_target}</font></center></a></td>            
                    <td>${distance.toFixed(1)}</td>            
                    <td>${formatNumber(total_send)}</td>            
                    <td class="hideMobile">${formatNumber(
                      wood
                    )}</td>            
                    <td class="hideMobile">${formatNumber(stone)}</td> 
                    <td class="hideMobile">${formatNumber(iron)}</td> `;

      if (list_launches[i].own_village == false) {
        html_prod_table += `<td ><input class="btn evt-confirm-btn btn-confirm-yes btn_send" target_id="${target_id}" origin_id="${origin_id}" wood="${wood}" stone="${stone}" iron="${iron}"  type="button" value="send"></td>
                </tr>`;
      } else {
        html_prod_table += `<td><input class="btn evt-confirm-btn btn-confirm-yes btn_send" target_id="${target_id}" data='${data}'  type="button" value="send"></td>
                </tr>`;
      }
    }

    //calculate total send to each village
    if (map_total_send.has(target_id)) {
      let obj_update = map_total_send.get(target_id);
      obj_update.wood += wood;
      obj_update.stone += stone;
      obj_update.iron += iron;
      obj_update.total += wood + stone + iron;
      map_total_send.set(target_id, obj_update);
    } else {
      if (target_id != undefined) {
        map_total_send.set(target_id, {
          coord_target: coord_target,
          wood: wood,
          stone: stone,
          iron: iron,
          total: wood + stone + iron,
          coord: coord_target,
        });
      }
    }
  }
  console.log(map_total_send);

  html_prod_table += `</table>`;

  document.getElementById("table_view").innerHTML = html_prod_table;
  $("#table_view").show();

  if (game_data.device != "desktop") {
    $(".hideMobile").hide();
  }

  //////////////////////////////////////////////////////////////final results///////////////////////////////////////////////////////////////////

  let html_end_result = `
    <center><div id="table_results" style="height:800px;width:600px;overflow:auto">
    <table id="table_stats" class="scriptTableAlternate">
    <tr>
        <td>nr</td>
        <td>coord</td>
        <td>total</td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/</td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/</td>
    </tr>`;

  Array.from(map_total_send.keys()).forEach((key, index) => {
    let obj = map_total_send.get(key);

    html_end_result += `
        <tr >
            <td>${index + 1}</td>
            <td>${obj.coord}</td>
            <td>${formatNumber(obj.total)}</td>
            <td>${formatNumber(obj.wood)}</td>
            <td>${formatNumber(obj.stone)}</td>
            <td>${formatNumber(obj.iron)}</td>

 
        </tr>
        `;
  });
  html_end_result += `
    </table>
    </div></center>
    `;

  $(".active div input").off("click");
  $(".active div input").on("click", () => {
    Dialog.show("content", html_end_result);
  });
  $(".active div").show();

  ///////////////////////////////////////////////////////////////////add event for each button send//////////////////////////////////////////////
  $(".btn_send").on("click", async (event) => {
    if ($(event.target).is(":disabled") == false) {
      let target_id = $(event.target).attr("target_id");
      let origin_id = $(event.target).attr("origin_id");
      let wood = $(event.target).attr("wood");
      let stone = $(event.target).attr("stone");
      let iron = $(event.target).attr("iron");
      console.log("target_id", target_id);
      console.log("origin_id", origin_id);
      console.log("wood", wood);
      console.log("stone", stone);
      console.log("iron", iron);

      // console.log(target_id,data)

      $(".btn_send").attr("disabled", true);

      let start = new Date().getTime();

      if (origin_id != undefined) {
        console.log("send res from individual village");
        sendResources(target_id, origin_id, wood, stone, iron);
      } else {
        let data = JSON.parse($(event.target).attr("data"));
        console.log("mass send res");
        console.log("data", data);

        massSendResources(target_id, data);
      }
      let stop = new Date().getTime();
      let diff_time = stop - start;
      // console.log("ajax time: "+(diff_time))

      window.setTimeout(() => {
        $(event.target).closest("#delete_row").remove();
        $(".btn_send").attr("disabled", false);
      }, 200 - diff_time);
    }
  });

  window.onkeydown = function (e) {
    // console.log(e.which)
    if (e.which == 13) {
      if (document.getElementsByClassName("btn_send").length > 0) {
        document.getElementsByClassName("btn_send")[0].click();
      }
    }
    // e.preventDefault()
  };
}

function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

function massSendResources(target_id, data) {
  let options = {
    village: target_id,
    ajaxaction: "call",
    h: window.csrf_token,
  };

  TribalWars.post(
    "market",
    options,
    data,
    function (response) {
      console.log(response);
      UI.SuccessMessage(response.success, 1000);
    },
    function (error) {
      console.log(error);
    }
  );
}

function sendResources(target_id, origin_id, wood, stone, iron) {
  var form = {
    target_id: target_id,
    wood: wood,
    stone: stone,
    iron: iron,
  };
  TribalWars.post(
    "market",
    {
      ajaxaction: "map_send",
      village: origin_id,
    },
    form,
    function (data) {
      UI.SuccessMessage(data.message, 1000);
      console.log(
        `from:${target_id} to ${origin_id} --> wood:${wood}, stone:${stone}, iron:${iron}`
      );
    },
    false
  );
}

function hitCountApi() {
  $.getJSON(
    `https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}/up`,
    (response) => {
      console.log(`This script has been run: ${response.count} times`);
    }
  );
  if (game_data.device != "desktop") {
    $.getJSON(
      `https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_phone/up`,
      (response) => {
        console.log(
          `This script has been run on mobile: ${response.count} times`
        );
      }
    );
  }

  $.getJSON(
    `https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_id2${game_data.player.id}/up`,
    (response) => {
      if (response.count == 1) {
        $.getJSON(
          `https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers/up`,
          (response) => {}
        );
      }
    }
  );

  try {
    $.getJSON(
      `https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers`,
      (response) => {
        console.log(`Total number of users: ${response.count}`);
      }
    );
  } catch (error) {}
}

function getGroups() {
  return new Promise((resolve, reject) => {
    let urlSnobPage =
      game_data.link_base_pure +
      "overview_villages&mode=groups&type=static&group=0";
    let dataPage = httpGet(urlSnobPage);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(dataPage, "text/html");
    console.log(htmlDoc);
    let listGroups = [];
    if (game_data.device == "desktop") {
      listGroups = Array.from($(htmlDoc).find(".group-menu-item")).map((e) => ({
        href:
          game_data.link_base_pure +
          `overview_villages&mode=combined&group=${e.getAttribute(
            "data-group-id"
          )}&page=-1`,
        groupName: e.innerText
          .trim()
          .replace("[", "")
          .replace("]", "")
          .replace("<", "")
          .replace(">", ""),
      }));
    } else {
      listGroups = Array.from(
        $(htmlDoc).find(".vis_item").find("select").find("option")
      ).map((e) => ({
        href: `${e.value}&page=-1`,
        groupName: e.innerText
          .trim()
          .replace("[", "")
          .replace("]", "")
          .replace("<", "")
          .replace(">", ""),
      }));
    }
    resolve(listGroups);
  });
}

function getGroupCoords(url) {
  return new Promise((resolve, reject) => {
    let dataPage = httpGet(url);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(dataPage, "text/html");

    let listCoords = [];
    if (game_data.device == "desktop")
      listCoords = Array.from($(htmlDoc).find(".row_a, .row_b")).map(
        (e) => e.children[1].innerText.match(/\d+\|\d+/)[0]
      );
    else
      listCoords = Array.from($(htmlDoc).find(".quickedit-vn")).map(
        (e) => e.innerText.match(/\d+\|\d+/)[0]
      );

    resolve(listCoords.join(" "));
  });
}

async function insertCoordsFromGroups(index) {
  let idPanel = "#" + $(".active").attr("rel");
  let hrefs = Array.from($(idPanel).find("select")).map((e) => e.value);
  let inputCoords = Array.from($(idPanel).find("textarea"));
  let paragraphCoords = Array.from($(idPanel).find("p"));
  //origin
  if (hrefs[index] != "none" && index == 0) {
    let coords = await getGroupCoords(hrefs[index]);
    inputCoords[index].value = coords;
    paragraphCoords[index].innerText =
      "origin coords: " + coords.split(" ").length;
  }
  //target
  if (hrefs[index] != "none" && index == 1) {
    let coords = await getGroupCoords(hrefs[index]);
    inputCoords[index].value = coords;
    paragraphCoords[index].innerText =
      "target coords: " + coords.split(" ").length;
  }
}

function getDataIncoming() {
  return new Promise((resolve, reject) => {
    let link_combined_production =
      game_data.link_base_pure + "overview_villages&mode=trader&type=inc";
    let dataPage = httpGet(link_combined_production);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(dataPage, "text/html");

    //get pages for all incoming
    let list_pages = [];

    if ($(htmlDoc).find(".paged-nav-item").parent().find("select").length > 0) {
      Array.from(
        $(htmlDoc)
          .find(".paged-nav-item")
          .parent()
          .find("select")
          .find("option")
      ).forEach(function (item) {
        list_pages.push(item.value);
      });
      list_pages.pop();
    } else if (htmlDoc.getElementsByClassName("paged-nav-item").length > 0) {
      //all pages from the current folder
      let nr = 0;
      Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(
        function (item) {
          let current = item.href;
          current = current.split("page=")[0] + "page=" + nr;
          nr++;
          list_pages.push(current);
        }
      );
    } else {
      list_pages.push(link_combined_production);
    }
    list_pages = list_pages.reverse();

    // go to every page and get incoming
    let map_incoming = new Map();
    function ajaxRequest(urls) {
      let current_url;
      if (urls.length > 0) {
        current_url = urls.pop();
      } else {
        current_url = "stop";
      }
      console.log(current_url);
      let start_ajax = new Date().getTime();
      if (urls.length >= 0 && current_url != "stop") {
        $.ajax({
          url: current_url,
          method: "get",
          success: (data) => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, "text/html");
            let table_incoming = Array.from($(htmlDoc).find(".row_a, .row_b"));

            for (let i = 0; i < table_incoming.length; i++) {
              let coord = "";
              if (game_data.device == "desktop") {
                coord =
                  table_incoming[i].children[4].innerText.match(
                    /[0-9]{3}\|[0-9]{3}/
                  )[0];
              } else {
                coord =
                  table_incoming[i].children[3].innerText.match(
                    /[0-9]{3}\|[0-9]{3}/g
                  )[1];
              }

              let wood = parseInt(
                $(table_incoming[i])
                  .find(".wood")
                  .parent()
                  .text()
                  .replace(".", "")
              );
              let stone = parseInt(
                $(table_incoming[i])
                  .find(".stone")
                  .parent()
                  .text()
                  .replace(".", "")
              );
              let iron = parseInt(
                $(table_incoming[i])
                  .find(".iron")
                  .parent()
                  .text()
                  .replace(".", "")
              );
              wood = Number.isNaN(wood) == true ? 0 : wood;
              stone = Number.isNaN(stone) == true ? 0 : stone;
              iron = Number.isNaN(iron) == true ? 0 : iron;

              let obj = {
                wood: wood,
                stone: stone,
                iron: iron,
              };
              if (map_incoming.has(coord)) {
                let obj_update = map_incoming.get(coord);
                obj_update.wood += wood;
                obj_update.stone += stone;
                obj_update.iron += iron;
                map_incoming.set(coord, obj_update);
              } else {
                map_incoming.set(coord, obj);
              }
            }
            let stop_ajax = new Date().getTime();
            let diff = stop_ajax - start_ajax;
            console.log("wait: " + diff);
            window.setTimeout(function () {
              ajaxRequest(list_pages);
              UI.SuccessMessage("get incoming page: " + urls.length);
            }, 200 - diff);
          },
          error: (err) => {
            reject(err);
          },
        });
      } else {
        UI.SuccessMessage("done");
        // console.log(map_incoming)
        resolve(map_incoming);
      }
    }
    ajaxRequest(list_pages);
  });
}
