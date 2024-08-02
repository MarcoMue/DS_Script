function openFakeAttackPopup() {
  var targetHtml = `<textarea id="fake-attack-coordinates" class="flex-grow-1" placeholder="111|111,222|222, ..." style="margin:5px 5px 5px 15px"></textarea>`;
  var villageListOuterHTML = document.getElementById('villages_list')?.outerHTML;
  var targetUsername = document.querySelector('#player_info > tbody > tr:nth-child(1) > th')?.innerText.trim();
  var queryParams = new URLSearchParams(location.search);
  var isInfoPlayerScreen = queryParams.get('screen') === 'info_player';
  var canOpenVillageList = isInfoPlayerScreen && targetUsername !== undefined && villageListOuterHTML;
  if (canOpenVillageList) {
    targetHtml = `<div id="ss-villages_list" class="flex-grow-1" style="overflow-y:scroll;padding-top:2px">${villageListOuterHTML}</div>`;
  }
  var popup = document.createElement('div');
  popup.className = 'popup_box_container';
  popup.innerHTML = `
    <div class="popup_box_container ss-popup_box_container">
      <div class="popup_box show" id="popup_box_fake_attack" style="width: 700px;">
        <div class="popup_box_content">
            <a class="popup_box_close tooltip-delayed" href="javascript:void(0)" onclick="closeSSPopup();return false;">&nbsp;</a>
            <h3>Fake Attack</h3>
            <div class="d-flex flex-direction-row" style="max-height:300px">
              <div>
                <table id="fake-attack-units">
                    <tbody>
                      <tr>
                          <td valign="top">
                            <table class="vis" width="100%">
                                <tbody>
                                  <tr>
                                      <th>Infantry</th>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_spear@2x.png" title="Spear"></a> <input id="unit_input_spear" name="spear" type="text" tabindex="1" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_sword@2x.png" title="Sword"></a> <input id="unit_input_sword" name="sword" type="text" tabindex="2" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_axe@2x.png" title="Axe"></a> <input id="unit_input_axe" name="axe" type="text" tabindex="3" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_archer@2x.png" title="Archer"></a> <input id="unit_input_archer" name="archer" type="text" tabindex="4" class="unitsInput"></td>
                                  </tr>
                                </tbody>
                            </table>
                          </td>
                          <td valign="top">
                            <table class="vis" width="100%">
                                <tbody>
                                  <tr>
                                      <th>Cavalry</th>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_spy@2x.png" title="Spy"></a> <input id="unit_input_spy" name="spy" type="text" tabindex="5" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_light@2x.png" title="Light"></a> <input id="unit_input_light" name="light" type="text" tabindex="6" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_marcher@2x.png" title="Marcher"></a> <input id="unit_input_marcher" name="marcher" type="text" tabindex="7" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_heavy@2x.png" title="Heavy"></a> <input id="unit_input_heavy" name="heavy" type="text" tabindex="8" class="unitsInput"></td>
                                  </tr>
                                </tbody>
                            </table>
                          </td>
                          <td valign="top">
                            <table class="vis" width="100%">
                                <tbody>
                                  <tr>
                                      <th>Siege weapons</th>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_ram@2x.png" title="Ram"></a> <input id="unit_input_ram" name="ram" type="text" tabindex="9" class="unitsInput"></td>
                                  </tr>
                                  <tr>
                                      <td class="nowrap"><a class="unit_link"><img src="https://dstr.innogamescdn.com/asset/a9e85669/graphic/unit/unit_catapult@2x.png" title="Catapult"></a> <input id="unit_input_catapult" name="catapult" type="text" tabindex="10" class="unitsInput"></td>
                                  </tr>
                                </tbody>
                            </table>
                          </td>
                      </tr>
                    </tbody>
                </table>
                <div id="command_target" class="target-select">
                <div id="fake-attack-show-options" class="vis moveable widget ">
                    <h4 class="head with-button ui-sortable-handle">
                      <img class="widget-button" onclick="return VillageOverview.toggleWidget( 'fake-attack-show-options', this );" src="graphic/minus.png">		Options
                    </h4>
                    <div class="widget_content" style="display: block;">
                      <table style="width: 100%">
                          <tbody>
                            <tr>
                                <td class="village_overview_effect ">
                                  <div class="d-flex flex-direction-row align-items-center"><input id="single-fake-attack" type="checkbox" class="mr-5" />Make a single attack</div>
                                </td>
                            </tr>
                          </tbody>
                      </table>
                    </div>
                </div>
              <div>
                  <input id="start_attack" tabindex="15" class="attack btn btn-attack btn-target-action" name="attack" type="submit" value="Attack" onclick="startAttack(); return false;" />
                  <input id="start_support" tabindex="16" class="support btn btn-support btn-target-action d-none" name="support" type="submit" value="Support" />
              </div>
              <div id="fake-attack-error-text" style="padding:2px;color:red;"></div>
                </div>
              </div>
              ${targetHtml}
            </div>            
        </div>
      </div>
      <div class="fader ss-fader"></div>
    </div>`;
  document.body.appendChild(popup);
  var timeOut = 0;
  if (canOpenVillageList && villageListOuterHTML.indexOf('Player.getAllVillages') > -1) {
    document.querySelector('#ss-villages_list > table > tbody > tr > td > a').click();
    timeOut = 300;
  }
  setTimeout(() => {
    var villageList = document.querySelector('#ss-villages_list > table > thead > tr');
    if (villageList) {
      var checkboxHeader = document.createElement('th');
      checkboxHeader.innerHTML = `<input id="fake-select-all-village" type="checkbox" />`;
      document.querySelector('#ss-villages_list > table > thead > tr').prepend(checkboxHeader);

      [...document.querySelectorAll('#ss-villages_list > table > tbody > tr')].forEach(item => {
        item.querySelector('a.ctx').remove();
        var tdElement = document.createElement('td');
        const coordinate = item.children[item.children.length - 2].innerHTML;
        tdElement.innerHTML = `<input type='checkbox' coordinate="${coordinate}" villageId=${item.querySelector('span[data-id]').getAttribute('data-id')} />`;
        item.prepend(tdElement);
      });

      document.getElementById('fake-select-all-village').addEventListener("change", function (event) {
        [...document.querySelectorAll('#ss-villages_list > table > tbody > tr input[type=checkbox]')].map(x => x.checked = event.target.checked);
      });
    }
  }, timeOut);

  $("#popup_box_fake_attack table.vis input[type='text']").keypress(function (e) {
    var charCode = (e.which) ? e.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  });
}

function startAttack() {
  try {
    var queryParams = new URLSearchParams(location.search);
    let isUnitSelected = false;
    var units = [...$('#fake-attack-units input')].map((item) => {
      var inpt = $(item).attr("name");
      const val = $(item).val() ? $(item).val() : "0";
      if (val !== '0') isUnitSelected = true;
      return {
        [inpt]: val
      }
    });

    if (!isUnitSelected) {
      $('#fake-attack-error-text').text('Select Unit!');
      return;
    }

    var selectedVillages;
    var coordinateTextArea = document.getElementById('fake-attack-coordinates');
    if (coordinateTextArea) {
      var coordinates = coordinateTextArea.value;
      if (coordinates.length < 7) {
        $('#fake-attack-error-text').text(`Invalid coordinates!`);
        return;
      }
      var c = coordinates.split(',').filter(x => x !== '');
      for (var i = 0; i < c.length; i++) {
        if (!/\d{3}\|\d{3}/.test(c[i])) {
          $('#fake-attack-error-text').text(`Invalid coordinates! ${c[i]}`);
          return;
        }
      }
      selectedVillages = c.map(x => ({
        targetX: x.split('|')[0],
        targetY: x.split('|')[1]
      }));
    } else {
      var checkedVillages = [...document.querySelectorAll('#villages_list input[villageId]:checked')];
      if (checkedVillages.length === 0) {
        $('#fake-attack-error-text').text(`Select village!`);
        return;
      }
      selectedVillages = checkedVillages.map(x => ({
        targetX: x.getAttribute("coordinate").split('|')[0],
        targetY: x.getAttribute("coordinate").split('|')[1],
        targetVillageId: x.getAttribute("villageId")
      }));
    }

    if ((selectedVillages?.length || null) < 1) {
      $('#fake-attack-error-text').text('No selected village!');
      return;
    }

    document.getElementById('start_attack').disabled = true;
    var index = 0;
    selectedVillages.map(x => {
      setTimeout(() => {
        var confirms = [], hasError = false;
        var attackCount = document.getElementById('single-fake-attack').checked ? 1 : 4;
        var targetVillageId = x.targetVillageId;
        if (!targetVillageId) targetVillageId = getTargetVillageIdFromCoordinate(`${x.targetX}|${x.targetY}`);
        for (var i = 0; i < attackCount; i++) {
          if (hasError === false) {
            var confirmAction = sendAttack(queryParams.get('village'), targetVillageId, x.targetX, x.targetY, units, (msg) => {
              hasError = true; $('#fake-attack-error-text').text(`* ${msg}`)
            });
            if (confirmAction)
              confirms.push(confirmAction);
          }
        }
        if (hasError === false) {
          confirms.map(x => x());
          $('#fake-attack-error-text').text('Done..');
        }
        document.getElementById('start_attack').disabled = false;
        index++;
      }, index * 1500);
    });
  } catch (error) {
    console.log(error);
    document.getElementById('start_attack').disabled = false;
  }
}

function getTargetVillageIdFromCoordinate(coordinate) {
  var queryParams = new URLSearchParams(location.search);
  var response;
  $.ajax({
    url: `${location.origin}/game.php?village=${queryParams.get('village')}&screen=api&ajax=target_selection&input=${coordinate}&type=coord&request_id=1&limit=5&offset=0`,
    method: 'GET',
    async: false,
    success: function (resp) {
      response = resp.villages[0]?.id
    }
  });
  return response;
}