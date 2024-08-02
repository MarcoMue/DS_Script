ScriptAPI.register(
  "ConfirmEnhancer",
  true,
  "Warre",
  "nl.tribalwars@coma.innogames.de"
);

/* @name: ConfirmEnhancer @author: Warre @description: Enhance the confirm page */

function formatTimes(e) {
  function t(e) {
    for (var t = "" + e; t.length < 2; ) t = "0" + t;
    return t;
  }
  var n = new Date(1e3 * e);
  return (
    t(n.getDate()) +
    "." +
    t(n.getMonth() + 1) +
    " " +
    t(n.getHours()) +
    ":" +
    t(n.getMinutes()) +
    ":" +
    t(n.getSeconds())
  );
}
if (
  (game_data.screen == "map" || game_data.screen == "place") &&
  $("#place_confirm_units").length > 0 &&
  $(".sendTime").length == 0
) {
  $.get(
    $(".village_anchor").first().find("a").first().attr("href"),
    function (html) {
      var $cc = $(html).find(".commands-container");
      if ($cc.length > 0) {
        var w =
          game_data.screen == "map"
            ? "100%"
            : $("#content_value").width() -
              $('form[action*="action=command"]')
                .find("table")
                .first()
                .width() -
              10 +
              "px";
        $('form[action*="action=command"]')
          .find("table")
          .first()
          .css("float", "left")
          .find("tr")
          .last()
          .after('<tr><td>Verstuur:</td><td class="sendTime">-</td>')
          .closest("table")
          .after(
            $cc.find("table").parent().html() +
              '<br><div style="clear:both;"></div>'
          )
          .next()
          .css({
            float: "right",
            width: w,
            display: "block",
            "max-height": $('form[action*="action=command"]')
              .find("table")
              .first()
              .height(),
            overflow: "scroll",
          })
          .find("tr.command-row")
          .on("click", function () {
            var $this = $(this),
              duration = $('form[action*="action=command"]')
                .find("table")
                .find('td:contains("Duur:")')
                .next()
                .text()
                .trim()
                .split(":"),
              sendTime =
                parseInt($this.find("span.timer").data("endtime")) -
                (parseInt(duration[0]) * 3600 +
                  parseInt(duration[1]) * 60 +
                  parseInt(duration[2]));
            $this.closest("table").find("td").css("background-color", "");
            $this.find("td").css("background-color", "#FFF68F");
            $(".sendTime").html(
              formatTimes(sendTime) +
                ' (<span class="sendTimer" data-endtime="' +
                sendTime +
                '"></span>)'
            );
            Timing.tickHandlers.timers.initTimers("sendTimer");
            document.title = formatTimes(sendTime);
          })
          .filter(function () {
            return (
              $('img[src*="/return_"], img[src*="/back.png"]', this).length > 0
            );
          })
          .remove();
        $(".widget-command-timer").addClass("timer");
        Timing.tickHandlers.timers.initTimers("widget-command-timer");
      } else {
        UI.ErrorMessage("Geen bevelen gevonden");
      }
    }
  );
}
