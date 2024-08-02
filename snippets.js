// https://de221.die-staemme.de/guest.php?screen=info_player&ajax=fetch_villages&player_id=1577168517
// https://zz2.tribalwars.works/game.php?screen=info_player&ajax=fetch_villages&player_id=1483900
jQuery
  .ajax(`/game.php?screen=info_player&ajax=fetch_villages&player_id=1577303441`)
  .done((response) => {
    const { no_authorization } = response;

    if (no_authorization) {
      console.error(`Error:`, data);
    } else {
      console.log(response);
    }
  })
  .fail((textStatus, errorThrown) => {
    console.error(`Request failed: ${textStatus}, ${errorThrown}`);
  });
