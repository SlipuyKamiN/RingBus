import { refs } from './elements';

refs.openCloseDropMenuBtn.addEventListener('click', event => {
  event.preventDefault();
  refs.dropMenu.classList.toggle('is-hidden');
});
