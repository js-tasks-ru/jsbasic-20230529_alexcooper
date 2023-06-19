function hideSelf() {
  const buttonEl = document.querySelector('.hide-self-button');
  buttonEl.addEventListener('click', event => event.target.hidden = true);
}
