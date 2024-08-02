function showUnderDevelopmentAlert() {
  alert('The feature is under development');
}
function closeSSPopup() {
  document.querySelector('.ss-popup_box_container').remove();
}
document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('ss-fader')) {
    closeSSPopup();
  }
});