import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { getRingRoutesList, getRingRoutesReverseList } from './handle-sheets';
import _debounce from 'lodash.debounce';
import { refs } from './elements';

refs.dateForm.disabled = true;

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
const dateSelector = flatpickr(refs.dateForm, dateOptions);
const UACityIndex = 4;
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
  refs.dateForm.disabled = true;
  dateSelector.clear();

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

  dateSelector.set('enable', availableDays);
  refs.dateForm.disabled = false;
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
const handleFormActions = event => {
  handleServiceType();

  if (event.target === refs.seatRadioBtn[0]) {
    refs.routesSearchForm.reset();
    refs.dateForm.disabled = true;
  }

  if (event.target !== refs.startCity && event.target !== refs.endCity) {
    return;
  }

  const debouncedSetDate = _debounce(setAvailableDate, 3000);
  debouncedSetDate();
};

refs.routesSearchForm.addEventListener('input', handleFormActions);
