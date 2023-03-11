const refs = {
  openCloseBtn: document.querySelector('[data-open-close-btn]'),
  dropMenu: document.querySelector('[data-nav]'),
};

refs.openCloseBtn.addEventListener('click', event => {
  event.preventDefault();
  refs.dropMenu.classList.toggle('is-hidden');
});
