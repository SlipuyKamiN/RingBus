import { getRingRoutesList, getOrdersList } from './handle-sheets';
import { refs } from './elements';
import _throttle from 'lodash.throttle';

// const refs = {
//   backdrop: document.querySelector('[data-modal-backdrop]'),
//   modalOpenBtn: document.querySelector('[data-modal-open]'),
//   modalCancelBtn: document.querySelector('[data-modal-cancel]'),
//   modalForm: document.querySelector('[data-modal-form]'),
//   modalPhoneLink: document.querySelector('[data-phone-link]'),
//   modalViberLink: document.querySelector('[data-viber-link]'),
//   modalTelegramLink: document.querySelector('[data-telegram-link]'),
//   modalWhatsappLink: document.querySelector('[data-whatsapp-link]'),
//   modalInstagramLink: document.querySelector('[data-instagram-link]'),
// };

let orderInfo = {
  customerName: '',
  customerPhone: '',
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
  orderInfo.routeId = card.querySelector('.routes__id').textContent;
  orderInfo.routeBeginCity = card.querySelector('.schedule__city').textContent;
  orderInfo.routeEndCity = card.querySelector(
    '.schedule__city--right'
  ).textContent;
  orderInfo.routeBeginDate = card.querySelector('.schedule__date').textContent;
  orderInfo.routeEndDate = card.querySelector(
    '.schedule__date--right'
  ).textContent;
  const markup = `
  <tr>
  <th>Ваш маршрут</th>
  <th class="modal__route-id">${orderInfo.routeId}</th>
</tr>
<tr>
  <td>${orderInfo.routeBeginCity}</td>
  <td>${orderInfo.routeBeginDate}</td>
</tr>
<tr>
  <td>${orderInfo.routeEndCity}</td>
  <td>${orderInfo.routeEndDate}</td>
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

  refs.modalPhoneLink.href = `tel:+${selectedRow.viber}`;
  refs.modalViberLink.href = `viber://chat?number=+${selectedRow.viber}`;
  refs.modalTelegramLink.href = `https://t.me/+${selectedRow.telegram}`;
  refs.modalWhatsappLink.href = `https://wa.me/+${selectedRow.whatsapp}`;
  refs.modalInstagramLink.href = `https://instagram.com/${selectedRow.instagram}`;
  refs.modalPhoneLink.title = `+${selectedRow.viber}`;
  refs.modalViberLink.title = `+${selectedRow.viber}`;
  refs.modalTelegramLink.title = `+${selectedRow.telegram}`;
  refs.modalWhatsappLink.title = `+${selectedRow.whatsapp}`;
  refs.modalInstagramLink.title = `https://instagram.com/${selectedRow.instagram}`;
};
const handleFormSubmit = async event => {
  event.preventDefault();
  refs.modalSubmitBtn.disabled = true;
  try {
    await updateOrderList();
    refs.modalForm.reset();
    refs.routesSearchForm.reset();
    refs.routesList.innerHTML = '';
    orderInfo = {};
    toggleBackdrop(event);
    refs.modalSubmitBtn.disabled = false;
  } catch (error) {
    console.log(error);
  }
};
const updateOrderInfo = () => {
  const { name, tel, comment } = refs.modalForm.elements;

  orderInfo.customerName = name.value;
  orderInfo.customerPhone = tel.value;
  orderInfo.customerComment = comment.value;
};
const updateOrderList = async () => {
  const sundar = await getOrdersList();
  await sundar.addRow({ ...orderInfo });
};

refs.modalForm.addEventListener('input', _throttle(updateOrderInfo, 500));
refs.modalCancelBtn.addEventListener('click', toggleBackdrop);
refs.modalForm.addEventListener('submit', handleFormSubmit);
