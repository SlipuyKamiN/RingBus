export const refs = {
  toggleDropMenuBtns: document.querySelectorAll('[data-open-close-btn]'),
  dropMenu: document.querySelector('[data-nav]'),
  backdrop: document.querySelector('[data-modal-backdrop]'),
  modalOpenBtn: document.querySelector('[data-modal-open]'),
  modalCancelBtn: document.querySelector('[data-modal-cancel]'),
  modalSubmitBtn: document.querySelector('[data-modal-submit]'),
  modalForm: document.querySelector('[data-modal-form]'),
  modalPhoneLink: document.querySelector('[data-phone-link]'),
  modalViberLink: document.querySelector('[data-viber-link]'),
  modalTelegramLink: document.querySelector('[data-telegram-link]'),
  modalWhatsappLink: document.querySelector('[data-whatsapp-link]'),
  modalInstagramLink: document.querySelector('[data-instagram-link]'),
  startCity: document.querySelector('[data-start-route-select]'),
  endCity: document.querySelector('[data-end-route-select]'),
  dateSelector: document.querySelector('[data-date-selector]'),
  loadingBlinker: document.querySelector('.loading'),
  routesSearchForm: document.querySelector('[data-routes-search-form]'),
  routesList: document.querySelector('[data-routes-list]'),
  searchBtn: document.querySelector('[data-routes-search-btn]'),
  novaPoshtaOption: document.querySelector('option[value=NovaPoshta]'),
  parcelRadioBtn: document.querySelectorAll('#parcel'),
  seatRadioBtn: document.querySelectorAll('#seat'),
  routeCards: [],
};
