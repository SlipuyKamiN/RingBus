import { getRingRoutesList, getOrdersList } from './handle-sheets';
import { refs } from './elements';
import _throttle from 'lodash.throttle';
import { sendOrderToTelegram } from './handle-telegram';

let orderInfo = {
  customerName: '',
  customerPhone: '',
  routeBeginCity: '',
  routeEndCity: '',
  routeBeginDate: '',
  customerComment: 'Немає',
  driverTelegramID: null,
};

export const handleCardClick = event => {
  const selectBtn = event.currentTarget.querySelector('[data-modal-open]');
  if (event.target !== selectBtn) {
    return;
  }

  selectBtn.disabled = true;
  setTimeout(() => {
    selectBtn.disabled = false;
  }, 1000);

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
  const { tg_id, viber, telegram, whatsapp, instagram } = (
    await getRingRoutesList()
  ).find(bus => bus.RingBus_ID === routeId.textContent);
  orderInfo.driverTelegramID = tg_id;

  refs.modalPhoneLink.href = `tel:+${viber}`;
  refs.modalViberLink.href = `viber://chat?number=+${viber}`;
  refs.modalTelegramLink.href = `https://t.me/+${telegram}`;
  refs.modalWhatsappLink.href = `https://wa.me/+${whatsapp}`;
  refs.modalInstagramLink.href = `https://instagram.com/${instagram}`;
  refs.modalPhoneLink.title = `+${viber}`;
  refs.modalViberLink.title = `+${viber}`;
  refs.modalTelegramLink.title = `+${telegram}`;
  refs.modalWhatsappLink.title = `+${whatsapp}`;
  refs.modalInstagramLink.title = `https://instagram.com/${instagram}`;
};
const handleFormSubmit = async event => {
  event.preventDefault();
  refs.modalSubmitBtn.disabled = true;
  try {
    await updateOrderList();
    await sendOrderToTelegram(orderInfo);

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

  orderInfo.serviceType = document.querySelector(
    'input[type = radio]:checked'
  ).value;
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
