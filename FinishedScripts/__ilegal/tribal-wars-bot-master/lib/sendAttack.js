function sendAttack(
  sourceVillageId,
  targetVillageId,
  targetX,
  targetY,
  units = [],
  errorCallBack = null
) {
  if (units.length === 0) return;
  var csrf = window.csrf_token;
  var confirmAction = null;
  $.ajax({
    type: "GET",
    url: `${location.origin}/game.php?village=${sourceVillageId}&screen=place&ajax=command&target=${targetVillageId}`,
    async: false,
    success: function (response) {
      var hidden = $(response.dialog).find("input[type=hidden]")[0];
      $.ajax({
        type: "POST",
        url: `${location.origin}/game.php?village=${sourceVillageId}&screen=place&ajax=confirm`,
        async: false,
        data: Object.assign(
          {
            [hidden.name]: hidden.value,
            template_id: "",
            source_village: sourceVillageId,
            x: targetX,
            y: targetY,
            input: "",
            attack: "l",
            h: csrf,
          },
          ...units
        ),
        success: function (rsp) {
          const _error = rsp.error;
          if (_error !== undefined) {
            var message = "";
            if (Array.isArray(_error)) message = _error[0];
            else message = _error;

            if (errorCallBack != null) errorCallBack(message);

            return;
          }

          confirmAction = () => {
            $.post(
              `${location.origin}/game.php?village=${sourceVillageId}&screen=place&ajaxaction=popup_command`,
              Object.assign(
                {
                  attack: true,
                  ch: $(rsp.dialog).find("input[name=ch]")[0].value,
                  x: targetX,
                  y: targetY,
                  source_village: sourceVillageId,
                  village: sourceVillageId,
                  building: "main",
                  h: csrf,
                  h: csrf,
                },
                ...units
              ),
              function (rsp2) {
                console.log(rsp2);
              }
            );
          };
        },
      });
    },
  });
  return confirmAction;
}
