const refs = {
  openBtn: document.querySelector('[data-open-close-btn]'),
  dropMenu: document.querySelector('[data-nav]'),
};

refs.openBtn.addEventListener('click', () => {
  refs.dropMenu.classList.toggle('is-hidden');
});
