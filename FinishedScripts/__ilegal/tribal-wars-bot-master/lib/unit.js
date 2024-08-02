function getUnitCount(villageId = 15958) {
  $.ajax({
    type: "GET",
    url: `${location.origin}/game.php?village=${villageId}`,
    async: false,
    success: function (response) {
      const units = [...$(response).find('strong[data-count]')].map((item, index) => {
        const key = $(item).attr('data-count');
        return(item ? {[key]: parseInt(item.innerHTML)} : null);
      });
    }
  });
}