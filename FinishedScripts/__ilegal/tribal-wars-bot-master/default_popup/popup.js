chrome.runtime.sendMessage({ open: true });

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
	var url = tabs[0].url;
	if (url) {
		try {
			document.getElementById('requestUrl').value = url.split("/game.php")[0];
			document.getElementById('sourceVillage').value = url.split("village=")[1].split('&')[0];
		} catch {
			//ignored
		}
	}
});

chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		document.querySelector('#targetUserName').innerText = request.targetUserName;
		document.querySelector('#villageCount').innerText = request.villages.length;
		document.querySelector('#villages').innerHTML = generateVillageHtml(request.villages);
		document.getElementById("csrf").value = request.csrf;

		request.docCookie.split(';').map(x => document.cookie = x);
	}
);

const generateVillageHtml = (villages) => {
	return villages.map((item, index) => `<tr key=${index}><td class="selectVillage"><input type="checkbox" coordinate="${item.coordinate}" villageId="${item.villageId}" /></td><td><table width="100%"><tbody><tr><td style="padding:0;"><span class="village_anchor contexted"><a href="#">${item.village}</a><a class="ctx" href="#"></a></span></td><td style="padding:0;"><img src="https://dstr.innogamescdn.com/asset/8edf6f3/graphic/map/reserved_player.png" id="reservation_7495" style="display: none; float:right;" class=""/></td></tr></tbody></table></td><td>${item.coordinate}</td><td>${item.score}</td></tr>`).join('');
};

function sendAttack(targetVillage, targetX, targetY, errorCallBack = null) {
	var sourceVillage = document.getElementById('sourceVillage').value;
	var csrf = document.getElementById("csrf").value;
	var requestUrl = document.getElementById('requestUrl').value;

	if (!requestUrl) {
		console.log("Url could not be read");
		return null;
	}

	var units = [...$('#tblUnits input')].map((item) => {
		var inpt = $(item).attr("name");
		return {
			[inpt]: $(item).val() ? $(item).val() : "0"
		}
	});

	var confirmAction = null;
	$.ajax({
		type: "GET",
		url: `${requestUrl}/game.php?village=${sourceVillage}&screen=place&ajax=command&target=${targetVillage}`,
		async: false,
		success: function (response) {
			var hidden = $(response.dialog).find('input[type=hidden]')[0];
			$.ajax({
				type: "POST",
				url: `${requestUrl}/game.php?village=${sourceVillage}&screen=place&ajax=confirm`,
				async: false,
				data: Object.assign({
					[hidden.name]: hidden.value,
					"template_id": "",
					"source_village": sourceVillage,
					"x": targetX,
					"y": targetY,
					"input": "",
					"attack": "l",
					"h": csrf
				}, ...units),
				success: function (rsp) {
					const _error = rsp.error;
					if (_error !== undefined) {
						var message = "";
						if (Array.isArray(_error))
							message = _error[0];
						else
							message = _error;

						if (errorCallBack != null)
							errorCallBack(message);

						return;
					}

					confirmAction = () => {
						$.post(`${requestUrl}/game.php?village=${sourceVillage}&screen=place&ajaxaction=popup_command`, Object.assign({
							"attack": true,
							"ch": $(rsp.dialog).find("input[name=ch]")[0].value,
							"x": targetX,
							"y": targetY,
							"source_village": sourceVillage,
							"village": sourceVillage,
							"building": "main",
							"h": csrf,
							"h": csrf
						}, ...units), function (rsp2) {
							console.log(rsp2);
						});
					};
				}
			});
		}
	});
	return confirmAction;
}

window.onload = function () {
	document.getElementById('start_attack')
		.addEventListener("click", function () {
			$('#errorMessage').text('');
			try {
				var selectedVillages = [...document.querySelectorAll('#villages_list input[villageId]:checked')];
				if (selectedVillages.length === 0) {
					$('#errorMessage').text(`Köy seçin`);
					return;
				}

				document.getElementById('start_attack').disabled = true;

				var index = 0;
				selectedVillages.map(x => {
					setTimeout(() => {
						var targetVillage = x.getAttribute("villageId");
						var targetX = x.getAttribute("coordinate").split('|')[0];
						var targetY = x.getAttribute("coordinate").split('|')[1];

						var confirms = [], hasError = false;
						var attackCount = document.getElementById('singleAttack').checked ? 1 : 4;
						for (var i = 0; i < attackCount; i++) {
							if (hasError === false) {
								var confirmAction = sendAttack(targetVillage, targetX, targetY, (msg) => { hasError = true; $('#errorMessage').text(`* ${msg}`) });
								if (confirmAction)
									confirms.push(confirmAction);
							}
						}
						if (hasError === false) {
							confirms.map(x => x());
							$('#errorMessage').text('Tamamlandı..');
						}
						document.getElementById('start_attack').disabled = false;
						index++;
					}, index * 1000);
				});
			} catch (error) {
				console.log(error);
				document.getElementById('start_attack').disabled = false;
			}
		});

	document.getElementById('selectAll').addEventListener("change", function (event) {
		[...document.querySelectorAll('td.selectVillage input')].map(x => x.checked = event.target.checked);
	});

	$("#tblUnits input").keypress(function (e) {
		var charCode = (e.which) ? e.which : event.keyCode;
		if (charCode != 46 && charCode > 31
			&& (charCode < 48 || charCode > 57))
			return false;

		return true;
	});
}