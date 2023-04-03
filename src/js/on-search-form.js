import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/dark.css';
import { getRingRoutesList, getRingRoutesReverseList } from './handle-sheets';
import _debounce from 'lodash.debounce';
import { refs } from './elements';
import { Notify } from 'notiflix';

let dateOptions = {
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  minDate: 'today',
  maxDate: new Date().fp_incr(28),
  locale: {
    firstDayOfWeek: 1,
  },
  enable: [],
};
const calendar = flatpickr(refs.dateSelector, dateOptions);
const UACityIndex = 10;
const filterDirections = {
  options: refs.endCity.querySelectorAll('option'),
  reset() {
    for (let i = 1; i < this.options.length; i += 1) {
      const el = this.options[i];
      this.showElement(el);
    }
    const emptyOptions = refs.routesSearchForm.querySelectorAll(
      'option[value=Empty]'
    );
    emptyOptions.forEach(o => {
      this.hideElement(o);
    });

    if (refs.startCity.value === refs.endCity.value) {
      refs.endCity.selectedIndex = this.options.length - 1;
    }
  },
  seatToUkraine() {
    for (let i = 1; i < this.options.length; i += 1) {
      const el = this.options[i];
      this.showElement(el);
    }
    refs.novaPoshtaOption.removeAttribute('selected');
    this.hideElement(refs.novaPoshtaOption);
  },
  seatFromUkraine() {
    for (let i = 0; i <= UACityIndex + 1; i += 1) {
      const el = this.options[i];
      this.hideElement(el);
    }
    refs.novaPoshtaOption.removeAttribute('selected');
    this.hideElement(refs.novaPoshtaOption);
    return;
  },
  parcelToUkraine() {
    for (let i = 0; i < this.options.length; i += 1) {
      const el = this.options[i];
      this.showElement(el);
    }
    this.showElement(refs.novaPoshtaOption);
    refs.novaPoshtaOption.setAttribute('selected', 'true');
    return;
  },
  parcelFromUkraine() {
    for (let i = 0; i <= UACityIndex + 1; i += 1) {
      const el = this.options[i];
      this.hideElement(el);
    }

    refs.novaPoshtaOption.removeAttribute('selected');
    this.hideElement(refs.novaPoshtaOption);
    return;
  },
  hideEqualCity() {
    const emptyOptions = refs.routesSearchForm.querySelectorAll(
      'option[value=Empty]'
    );
    emptyOptions.forEach(o => this.hideElement(o));

    this.options.forEach(option => {
      if (option.value === refs.startCity.value) {
        refs.endCity.querySelector('option[value=Empty]').selected;

        this.hideElement(option);
        return;
      }
    });
  },
  hideElement(element) {
    element.setAttribute('hidden', 'hidden');
    element.setAttribute('disabled', 'disabled');
  },
  showElement(element) {
    element.removeAttribute('hidden');
    element.removeAttribute('disabled');
  },
};
const dateSelector = {
  dateSelector: refs.dateSelector,
  disabled() {
    this.dateSelector.disabled = true;
    this.dateSelector.placeholder = 'Вкажіть маршрут';
    refs.loadingBlinker.classList.toggle('is-hidden');
  },
  onLoading() {
    this.dateSelector.disabled = true;
    this.dateSelector.placeholder = '';
    refs.loadingBlinker.classList.toggle('is-hidden');
  },
  loadedSuccess() {
    this.dateSelector.disabled = false;
    this.dateSelector.placeholder = 'Виберіть доступну дату';
    refs.loadingBlinker.classList.toggle('is-hidden');
  },
  loadedFailure() {
    this.dateSelector.disabled = true;
    this.dateSelector.placeholder = 'Вкажіть маршрут';
    refs.loadingBlinker.classList.toggle('is-hidden');
  },
};

const handleServiceType = () => {
  let selectedRadioInput = document.querySelector(
    'input[type = radio]:checked'
  );

  filterDirections.reset();

  if (
    selectedRadioInput.value === 'parcel' &&
    refs.startCity.selectedIndex > UACityIndex
  ) {
    filterDirections.parcelToUkraine();
  }

  if (
    selectedRadioInput.value === 'parcel' &&
    refs.startCity.selectedIndex <= UACityIndex
  ) {
    filterDirections.parcelFromUkraine();
  }

  if (
    (selectedRadioInput.value === 'seat' && refs.novaPoshtaOption.selected) ||
    refs.startCity.selectedIndex <= UACityIndex
  ) {
    filterDirections.seatFromUkraine();
  }
  if (
    selectedRadioInput.value === 'seat' &&
    refs.startCity.selectedIndex > UACityIndex
  ) {
    filterDirections.seatToUkraine();
  }

  filterDirections.hideEqualCity();
};
const getAvailableDate = async listType => {
  dateSelector.onLoading();
  calendar.clear();

  let ringBuseslist = await listType();
  let availableDays = [];

  ringBuseslist.map(bus => {
    let startCityTime = eval(`bus.in_${refs.startCity.value}`);
    let endCityTime = eval(`bus.in_${refs.endCity.value}`);

    if (startCityTime && endCityTime && bus.start_day) {
      availableDays.push(function (date) {
        return date.getDay() === Number(bus.start_day);
      });
    }
  });

  if (availableDays.length === 0) {
    Notify.info(
      'На жаль, немає доступних дат з таким сполученням міст. Будь ласка, оберіть інший маршрут.'
    );
    dateSelector.loadedFailure();
    return;
  }

  calendar.set('enable', availableDays);
  dateSelector.loadedSuccess();
};
const setAvailableDate = () => {
  if (refs.startCity.value === 'Empty' || refs.endCity.value === 'Empty') {
    return;
  }

  if (refs.startCity.selectedIndex > refs.endCity.selectedIndex) {
    getAvailableDate(getRingRoutesReverseList);
    return;
  }

  getAvailableDate(getRingRoutesList);
};
const debouncedSetDate = _debounce(setAvailableDate, 3000);
const handleFormActions = event => {
  handleServiceType();

  if (event.target === refs.seatRadioBtn[0]) {
    refs.routesSearchForm.reset();
    dateSelector.disabled();
  }

  if (event.target !== refs.startCity && event.target !== refs.endCity) {
    return;
  }

  debouncedSetDate();
};

refs.routesSearchForm.addEventListener('input', handleFormActions);
