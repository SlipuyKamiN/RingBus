const refs = {
  backdrop: document.querySelector('[data-modal-backdrop]'),
  modalOpenBtn: document.querySelector('[data-modal-open]'),
  modalCancelBtn: document.querySelector('[data-modal-cancel]'),
  modalForm: document.querySelector('[data-modal-form]'),
};

const toggleBackdrop = event => {
  event.preventDefault();
  refs.backdrop.classList.toggle('is-hidden');
};

// refs.modalOpenBtn.addEventListener('click', toggleBackdrop);
refs.modalCancelBtn.addEventListener('click', toggleBackdrop);
refs.modalForm.addEventListener('submit', toggleBackdrop);
