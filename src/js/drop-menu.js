import { refs } from './elements';

const toggleDropMenu = event => {
  refs.dropMenu.classList.toggle('is-hidden');
};

refs.toggleDropMenuBtns.forEach(btn => {
  btn.addEventListener('click', toggleDropMenu);
});
