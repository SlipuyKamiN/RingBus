import { getRingRoutesList } from './handle-sheets';

const refs = {
  backdrop: document.querySelector('[data-modal-backdrop]'),
  modalOpenBtn: document.querySelector('[data-modal-open]'),
  modalCancelBtn: document.querySelector('[data-modal-cancel]'),
  modalForm: document.querySelector('[data-modal-form]'),
  phoneLink: document.querySelector('[data-phone-link]'),
  viberLink: document.querySelector('[data-viber-link]'),
  telegramLink: document.querySelector('[data-telegram-link]'),
  whatsappLink: document.querySelector('[data-whatsapp-link]'),
  instagramLink: document.querySelector('[data-instagram-link]'),
};

export const handleCardClick = event => {
  const selectBtn = event.currentTarget.querySelector('[data-modal-open]');
  if (event.target !== selectBtn) {
    return;
  }

  setContactsInfo(event.currentTarget);
  renderModalRouteInfo(event.currentTarget);
  toggleBackdrop(event);
};
const renderModalRouteInfo = card => {
  const modalTable = document.querySelector('[data-modal-table]');
  const routeId = card.querySelector('.routes__id');
  const routeBeginCity = card.querySelector('.schedule__city');
  const routeEndCity = card.querySelector('.schedule__city--right');
  const routeBeginDate = card.querySelector('.schedule__date');
  const routeEndDate = card.querySelector('.schedule__date--right');
  const markup = `
  <tr>
  <th>Ваш маршрут</th>
  <th class="modal__route-id">${routeId.textContent}</th>
</tr>
<tr>
  <td>${routeBeginCity.textContent}</td>
  <td>${routeBeginDate.textContent}</td>
</tr>
<tr>
  <td>${routeEndCity.textContent}</td>
  <td>${routeEndDate.textContent}</td>
</tr>
  `;
  modalTable.innerHTML = markup;
};
const toggleBackdrop = event => {
  if (event.target === refs.modalCancelBtn) {
    event.preventDefault();
  }

  refs.backdrop.classList.toggle('is-hidden');
};
const setContactsInfo = async card => {
  const routeId = card.querySelector('.routes__id');
  const selectedRow = (await getRingRoutesList()).find(
    bus => bus.RingBus_ID === routeId.textContent
  );

  refs.phoneLink.href = `tel:+${selectedRow.viber}`;
  refs.viberLink.href = `viber://chat?number=+${selectedRow.viber}`;
  refs.telegramLink.href = `https://t.me/+${selectedRow.telegram}`;
  refs.whatsappLink.href = `https://wa.me/+${selectedRow.whatsapp}`;
  refs.instagramLink.href = `https://instagram.com/${selectedRow.instagram}`;
  refs.phoneLink.title = `+${selectedRow.viber}`;
  refs.viberLink.title = `+${selectedRow.viber}`;
  refs.telegramLink.title = `+${selectedRow.telegram}`;
  refs.whatsappLink.title = `+${selectedRow.whatsapp}`;
  refs.instagramLink.title = `https://instagram.com/${selectedRow.instagram}`;
};

// refs.modalOpenBtn.addEventListener('click', toggleBackdrop);
refs.modalCancelBtn.addEventListener('click', toggleBackdrop);
// refs.modalForm.addEventListener('submit', toggleBackdrop);
