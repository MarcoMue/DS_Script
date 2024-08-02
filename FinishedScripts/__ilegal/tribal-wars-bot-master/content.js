var timeout = 0;
var showAllVillage = document.querySelector('#villages_list > tbody > tr > td > a');
if (showAllVillage !== null) {
  showAllVillage.click();
  timeout = 200;
}

setTimeout(() => {
  try {
    var targetUserName = document.querySelector('#player_info > tbody > tr:nth-child(1) > th')?.innerText.trim();
    if (targetUserName === undefined) return;

    var villages = [...document.querySelectorAll('#villages_list>tbody>tr')].map((item) => {
      var hasExtraColumn = item.cells.length > 3;
      return {
        village: item.cells[0].innerText.trim(),
        villageId: item.cells[0].querySelector('table table > tbody > tr > td:nth-child(1) > span').getAttribute("data-id"),
        coordinate: item.cells[hasExtraColumn ? 2 : 1].innerText.trim(),
        score: item.cells[hasExtraColumn ? 3 : 2].innerText.trim()
      };
    });

    chrome.runtime.sendMessage({
      targetUserName,
      villages,
      csrf: document.head.innerHTML.substring(document.head.innerHTML.indexOf('csrf_token = \'') + 14).split('\'')[0],
      docCookie: document.cookie
    });
  } catch (error) {
    console.log(error);
  }
}, timeout);
