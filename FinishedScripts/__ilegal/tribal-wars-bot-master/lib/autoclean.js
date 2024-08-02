function lootVillage(villageId, optionId, spearCount) {
  $.ajax({
    url: `${location.origin}/game.php?village=${villageId}&screen=scavenge_api&ajaxaction=send_squads`,
    method: 'POST',
    async: false,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "tribalwars-ajax": "1",
    },
    data: `squad_requests[0][village_id]=${villageId}&squad_requests[0][candidate_squad][unit_counts][spear]=${spearCount}&squad_requests[0][candidate_squad][unit_counts][sword]=0&squad_requests[0][candidate_squad][unit_counts][axe]=0&squad_requests[0][candidate_squad][unit_counts][archer]=0&squad_requests[0][candidate_squad][unit_counts][light]=0&squad_requests[0][candidate_squad][unit_counts][marcher]=0&squad_requests[0][candidate_squad][unit_counts][heavy]=0&squad_requests[0][candidate_squad][unit_counts][knight]=0&squad_requests[0][candidate_squad][carry_max]=${spearCount * 25}&squad_requests[0][option_id]=${optionId}&squad_requests[0][use_premium]=false&h=${window.csrf_token}`,
  });
}

function startAutoLoot() {
  var queryParams = new URLSearchParams(location.search);
  var villageId = queryParams.get('village');
  $.ajax({
    type: "GET",
    url: `${location.origin}/game.php?village=${villageId}&screen=scavenge_api&ajax=villages&village_ids[]=${villageId}`,
    async: false,
    success: function (response) {
      if (typeof response !== 'object') return;
      
      for (const [key, value] of Object.entries(response.villages)) {
        if (!value.options['4'].is_locked && value.options['4'].scavenging_squad === null && value.unit_counts_home.spear >= 10) {
          lootVillage(key, 4, 10);
        }
        if (!value.options['3'].is_locked && value.options['3'].scavenging_squad === null && (value.unit_counts_home.spear - 10) >= 15) {
          lootVillage(key, 3, 15);
        }
        if (!value.options['2'].is_locked && value.options['2'].scavenging_squad === null && (value.unit_counts_home.spear - 10 - 15) >= 30) {
          lootVillage(key, 2, 30);
        }
        if (!value.options['1'].is_locked && value.options['1'].scavenging_squad === null && (value.unit_counts_home.spear - 10 - 15 - 30) >= 75) {
          lootVillage(key, 1, 75);
        }
      }
    }
  });
}

setTimeout(() => {
  startAutoLoot();
}, 10000);

setInterval(() => {
  startAutoLoot();
}, 1001 * 60 * 49);