TribalWars.post(
  "api",
  {
    ajaxaction: "skip_confirmation",
  },
  n,
  function (e) {
    o.updateFromServerData(e.preferences, e.preferences_hash),
      "function" == typeof i && i();
  }
);
TribalWars.post(
  "api",
  {
    ajaxaction: "set_premium_prompt",
    feature: e,
    preference: a,
  },
  {},
  function () {
    t();
  }
);
TribalWars.post(
  "premium",
  {
    ajaxaction: "auto_renew",
    feature: e.value,
    active: e.checked ? 1 : 0,
  },
  null,
  function (e) {
    var a = e.active
      ? _("bb9e8c9104f8b9774720ead1131053b6")
      : _("152f3ed78e900e646348d6118807acd7");
    e.extended_now
      ? ((a += _("bfcb588125f265c36b977867e7bc845c")),
        document.location.reload(),
        $.cookie("success_message", a))
      : UI.SuccessMessage(a);
  }
);
TribalWars.post(
  "premium",
  {
    ajaxaction: "accept",
  },
  e,
  function (e) {
    e.hasOwnProperty("feature_was_activated")
      ? window.location.reload()
      : e.hasOwnProperty("redirect")
      ? (window.location = e.redirect)
      : (UI.SuccessMessage(e.success), Dialog.close());
  }
);
TribalWars.post(
  "api",
  {
    ajaxaction: "quest_complete",
    quest: n,
    skip: e,
  },
  null,
  function (e) {
    if (
      (e.reward
        ? UI.SuccessMessage(
            _("b6d49ae1eaf9aada42e9a800556eca8a") + "<br /><br />" + e.reward,
            3000
          )
        : UI.SuccessMessage(_("0bfb250526c8e5118112b06f9dedb0a1"), 3000),
      i.destroy(),
      mobile)
    )
      $("#quest-container").hide();
    else {
      var s = e.detailed;
      $.each(s, function (e, t) {
        t.hasOwnProperty("resources") &&
          $.each(t.resources, function (e, t) {
            TribalWars.showResourceIncrease(e, t);
          });
      });
    }
    Quests.notifyQuestCompleted(n),
      null != t &&
        setTimeout(function () {
          t(e);
        }, 2500);
  }
);
TribalWars.post(
  "settings",
  {
    ajaxaction: "toggle_setting",
  },
  {
    setting: a,
    value: e ? 1 : 0,
  },
  function (a) {
    (TribalWars._settings = $.extend(TribalWars._settings, a)), t && t();
  }
);
TribalWars.post(
  "settings",
  {
    ajaxaction: "suppress_hint",
  },
  {
    hint: a,
  },
  function (a) {
    e && e();
  }
);
TribalWars.post(
  "tracking",
  {
    ajaxaction: "track",
  },
  {
    event: a,
    params: e,
  },
  null,
  null,
  !0
);
TribalWars.post(
  "groups",
  {
    ajaxaction: "create_group",
  },
  {
    group_name: e,
  },
  function (e) {
    $("#add_new_group_name").val(""), VillageGroups.reloadOverviewPage();
  }
);
TribalWars.post(
  "groups",
  {
    ajaxaction: "delete_group",
  },
  {
    group_id: e,
  },
  function (e) {
    VillageGroups.reloadOverviewPage();
  }
);
TribalWars.post(
  "groups",
  {
    ajaxaction: "rename_group",
  },
  {
    group_name: t,
    group_id: e,
  },
  function (e) {
    VillageGroups.reloadOverviewPage();
  }
);
TribalWars.post(
  "overview_villages",
  {
    mode: "groups",
    ajaxaction: "order_menu",
  },
  $("#menu_items").sortable("serialize"),
  function () {}
);
TribalWars.post(
  "overview_villages",
  {
    mode: "groups",
    ajaxaction: "create_menu_separator",
  },
  null,
  function () {
    partialReload();
  }
);
TribalWars.post(
  "overview_villages",
  {
    mode: "groups",
    ajaxaction: "remove_menu_separator",
  },
  {
    item_id: e,
  },
  function () {
    partialReload();
  }
);
TribalWars.post(
  "crm",
  {
    ajaxaction: "view",
  },
  {
    content_id: e,
    target_id: t,
    cdp: a,
  },
  function (r) {
    if ((Crm.hideFader(), !r.offer_no_longer_available)) {
      var i = r.interstitial;
      if (i.hasOwnProperty("html")) c = i.html;
      else {
        window.mobile && (i.width = i.height = window.outerWidth - 50);
        var c,
          n = s(
            '<img src="%1" style="width: %2px; height: %3px; cursor: pointer; vertical-align: middle" class="campaign-image" />',
            i.url,
            i.width,
            i.height
          );
        c =
          r.cta && "uri" === r.cta.type
            ? s(
                '<a href="%1" target="_blank">%2</a>',
                TribalWars.buildURL("GET", "crm", {
                  action: "follow_campaign",
                  content_id: e,
                  target_id: t,
                  cdp: a,
                }),
                n
              )
            : n;
      }
      Dialog.show(
        "crm",
        c,
        function (r) {
          r && Crm.ignoreContent(e, t, a);
        },
        {
          class_name: "slim",
          close_from_fader: !1,
          priority: Dialog.PRIORITY_IMPORTANT,
        }
      ),
        $("#popup_box_crm a[target=_blank]").on("click", function () {
          Dialog.close(!1);
        }),
        (r.cta && "uri" === r.cta.type) ||
          $("#popup_box_crm")
            .find(".campaign-image")
            .on("click", function () {
              Crm.acceptContent(e, t, a);
            }),
        $("#popup_box_crm").on("click", ".btn-crm", function () {
          Dialog.close(!1);
          var r = $(this),
            i = {
              type: r.data("cta"),
              value: r.data["cta-value"],
            };
          return (
            "ignore" === i.type
              ? Crm.ignoreContent(e, t, a)
              : Crm.acceptContent(e, t, a, function (e, t) {
                  (e.cta = i), Crm.handleAcceptedContent(e, t);
                }),
            !1
          );
        });
    }
  },
  function () {
    Crm.hideFader();
  }
);
TribalWars.post(
  "crm",
  {
    ajaxaction: "accept",
  },
  {
    content_id: e,
    target_id: t,
    cdp: a,
  },
  function (e) {
    r ? r(e, t) : Crm.handleAcceptedContent(e, t);
  },
  function () {
    Dialog.close();
  }
);
TribalWars.post(
  "crm",
  {
    ajaxaction: "ignore",
  },
  {
    content_id: e,
    target_id: t,
    cdp: a,
  },
  function () {}
);
TribalWars.post(
  "crm",
  {
    ajaxaction: "ignore",
  },
  {
    content_id: e,
    target_id: t,
    cdp: a,
  },
  function () {}
);
TribalWars.post(
  "place",
  {
    ajaxaction: "cancel",
  },
  {
    id: a,
    village: n,
  },
  function () {
    var a = t.parents(".commands-container"),
      n = parseInt(a.data("commands")) - 1;
    a.data("commands", n),
      a.find(".commands-command-count").text("(" + n + ")"),
      t.parents("tr").eq(0).remove();
  },
  function () {
    t.html(e);
  }
);
TribalWars.post(
  "api",
  {
    ajaxaction: "guest_register",
  },
  e,
  function () {
    TribalWars.redirect("overview");
  }
);
TribalWars.post(
  "botcheck",
  {
    ajaxaction: "verify",
  },
  {
    response: e,
  },
  function (e) {
    e.success
      ? BotProtect.forced
        ? window.location.reload()
        : (Dialog.close(),
          $("#botprotection_quest").remove(),
          $("#bot_check").remove())
      : (UI.ErrorMessage(_("82e50c727674f251464fc7520f5bde26")),
        hcaptcha.reset());
  }
);
TribalWars.post(
  "daily_bonus",
  {
    ajaxaction: "open",
  },
  {
    day: e,
    from_screen: this.screen_location,
  },
  function (t) {
    DailyBonus.handleChestOpened(t.cycle, e);
  }
);
TribalWars.post(
  "daily_bonus",
  {
    ajaxaction: "unlock",
  },
  {
    day: e,
    from_screen: this.screen_location,
  },
  function (t) {
    DailyBonus.handleChestOpened(t.cycle, e);
  }
);
TribalWars.post(
  "gift_calendar",
  {
    ajaxaction: "collect_reward",
  },
  {
    field_id: a.data("id"),
  },
  function (e) {
    i = $(
      '<div class="popup_box_container sub-dialog" id="reward-subdialog"></div>'
    ).css("z-index", 14002);
    var t = $('<div class="popup_box show"></div>')
        .css("z-index", 14003)
        .appendTo(i),
      n = $('<div class="fader"></div>').css("z-index", 14001).appendTo(i),
      l =
        ($('<div class="popup_box_content"></div>')
          .css("max-width", 400)
          .html(e.dialog)
          .appendTo(t),
        !mobile && HotKeys.enabled
          ? " :: " + _("28926ff7e8e5f5e52b3e35f5cc7ad99b") + " <b>Esc</b>"
          : ""),
      d = mobile ? "" : "tooltip-delayed",
      o = $(
        '<a class="popup_box_close ' +
          d +
          '" title="' +
          _("d3d2e617335f08df83599665eef8a418") +
          l +
          '" href="#">&nbsp;</a>'
      ).prependTo(t);
    if (
      (UI.ToolTip(o, {
        delay: 400,
      }),
      $(".gift-calendar-timer-container").html(e.timer_html),
      GiftCalendar.setupTimer(),
      n.on("click", function () {
        i.remove(),
          (i = null),
          e.finished &&
            ($("#calendar_field_container").toggleClass(
              "gift-calendar-finished",
              !0
            ),
            $(".gift-calendar-footer").toggleClass(
              "gift-calendar-finished",
              !0
            ));
      }),
      o.on("click", function () {
        i.remove(),
          (i = null),
          e.finished &&
            ($("#calendar_field_container").toggleClass(
              "gift-calendar-finished",
              !0
            ),
            $(".gift-calendar-footer").toggleClass(
              "gift-calendar-finished",
              !0
            ));
      }),
      e.opened)
    )
      $("body").append(i);
    else {
      a.find(".gift-calendar-position").remove(),
        a.append('<img class="gift-calendar-tile-img" src="' + e.img + '">');
      var r = GiftCalendar.addDoorAnimation(a);
      r.addEventListener("ended", (e) => {
        r.remove(),
          $("body").append(i),
          UI.SuccessMessage(_("e0df8f32de74984d15fb2313ba1c06dd")),
          a.addClass("field-opened").removeClass("field-closed"),
          mobile || a.removeTooltip();
      });
    }
    GiftCalendar.setNewLabel(e.new_reward);
  }
);
TribalWars.post(
  "api",
  {
    ajaxaction: "two_factor",
  },
  {
    code: o,
  },
  function () {
    $("#two_factor_form input[type=submit]").prop("disabled", !1),
      (t.completed = !0),
      Dialog.close(),
      UI.SuccessMessage(_("9154e256b98593684452602f9c5e0652"));
  },
  function () {
    $("#two_factor_form input[type=submit]").prop("disabled", !1);
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "rename_thread",
  },
  s,
  function (n) {
    e.updateConversationName(t, a, i);
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "create_group_chat",
  },
  {
    player_names: e,
  },
  function (e) {
    e.hasOwnProperty("problems")
      ? $("#popup_box_create_group_chat .error").html(e.problems).show()
      : (TribalWars._chat.requestContacts(),
        TribalWars._chat.newConversation(e.head_id, 0, !1, !0),
        Dialog.close());
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "thread_add_member",
  },
  {
    head_id: e,
    player_name: a,
  },
  function () {
    UI.SuccessMessage(_("0d0cec22698e3d28ded47e7748563cfe")),
      Dialog.close(),
      GroupChat.openGroupMembers(e);
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "thread_remove_member",
  },
  {
    head_id: e,
    player_id: a,
  },
  function () {
    UI.SuccessMessage(_("f0946c8625b7d7bb68ca3e160b2b893d")),
      Dialog.close(),
      GroupChat.openGroupMembers(e);
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "thread_leave",
  },
  {
    head_id: e,
  },
  function () {
    Dialog.close(),
      TribalWars._chat.removeConversation(e, !1),
      TribalWars._chat.requestContacts();
  }
);
TribalWars.post(
  "chat",
  {
    ajaxaction: "thread_delete",
  },
  {
    head_id: e,
  },
  function () {
    Dialog.close(),
      TribalWars._chat.removeConversation(e, !1),
      TribalWars._chat.requestContacts();
  }
);

UI.AutoComplete.url =
  "/game.php?village=2686&screen=api&ajaxaction=autocomplete&h=29cafac4";
VillageContext._urls.fav =
  "/game.php?village=2686&screen=info_village&id=__village__&ajaxaction=add_target&json=1&h=29cafac4";
VillageContext._urls.unfav =
  "/game.php?village=2686&screen=info_village&id=__village__&ajaxaction=del_target&json=1&h=29cafac4";
VillageContext._urls.claim =
  "/game.php?village=2686&screen=info_village&id=__village__&ajaxaction=toggle_reserve_village&json=1&h=29cafac4";
villageDock.saveLink =
  "/game.php?village=2686&screen=overview&ajaxaction=dockVillagelist&h=29cafac4";

ScriptAPI.url = "/game.php?village=2686&screen=api&ajax=save_script";
villageDock.loadLink =
  "/game.php?village=2686&screen=groups&mode=overview&ajax=load_group_menu";
<input
  type="hidden"
  value="/game.php?village=2686&screen=groups&ajax=load_villages_from_group&mode=overview"
  id="show_groups_villages_link"
/>;
WorldSwitch.worldsURL = "/game.php?village=2686&screen=api&ajax=world_switch";
