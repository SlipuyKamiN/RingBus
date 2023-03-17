import { refs } from './elements';

// const refs = {
//   openCloseDropMenuBtn: document.querySelector('[data-open-close-btn]'),
//   dropMenu: document.querySelector('[data-nav]'),
// };

refs.openCloseDropMenuBtn.addEventListener('click', event => {
  event.preventDefault();
  refs.dropMenu.classList.toggle('is-hidden');
});
