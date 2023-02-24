const els = {
  openBtn: document.querySelector('[data-open-close-btn]'),
  dropMenu: document.querySelector('[data-nav]'),
};

els.openBtn.addEventListener('click', () => {
  els.dropMenu.classList.toggle('is-hidden');
});
s;
