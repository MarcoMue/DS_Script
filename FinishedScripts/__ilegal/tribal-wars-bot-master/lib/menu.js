var menu = document.createElement('td');
menu.className = 'menu-item';
menu.innerHTML = `
  <a href="#">Super Script</a>
  <table cellspacing="0" class="menu_column">
    <tbody>
      <tr><td class="menu-column-item"><a href="javascript:void(0)" onclick="openFakeAttackPopup();return false;">Fake Attack</a></td></tr>
      <tr><td class="menu-column-item"><a href="javascript:void(0)" onclick="showUnderDevelopmentAlert();return false;">Support Between Missionary</a></td></tr>
      <tr><td class="menu-column-item"><a href="javascript:void(0)" onclick="showUnderDevelopmentAlert();return false;">Auto Loot</a></td></tr>

      <tr><td class="bottom"><div class="corner"></div><div class="decoration"></div></td></tr>
    </tbody>
  </table>
  `;
document.querySelector('tr#menu_row')?.prepend(menu);