import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { getRingRoutesList, getRingRoutesReverseList } from './handle-sheets';
import _debounce from 'lodash.debounce';

const refs = {
  startCity: document.querySelector('[data-start-route-select]'),
  endCity: document.querySelector('[data-end-route-select]'),
  dateForm: document.querySelector('[data-date-selector]'),
  routesSearchForm: document.querySelector('[data-routes-search-form]'),
  routesList: document.querySelector('[data-routes-list]'),
  searchBtn: document.querySelector('[data-routes-search-btn]'),
  novaPoshtaOption: document.querySelector('option[value=NovaPoshta]'),
  parcelRadioBtn: document.querySelectorAll('#parcel'),
  seatRadioBtn: document.querySelectorAll('#seat'),
};

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
const UACityIndex = 2;
const filterDirections = {
  options: refs.endCity.querySelectorAll('option'),
  reset() {
    for (let i = 1; i < this.options.length; i += 1) {
      const el = this.options[i];
      el.classList.remove('is-hidden');
    }
    const emptyOptions = refs.routesSearchForm.querySelectorAll(
      'option[value=Empty]'
    );
    emptyOptions.forEach(o => o.classList.add('is-hidden'));

    if (refs.startCity.value === refs.endCity.value) {
      refs.endCity.selectedIndex = this.options.length - 1;
    }
  },
  seatToUkraine() {
    for (let i = 1; i < this.options.length; i += 1) {
      const el = this.options[i];
      el.classList.remove('is-hidden');
    }
    refs.novaPoshtaOption.removeAttribute('selected');
    refs.novaPoshtaOption.classList.add('is-hidden');
  },
  seatFromUkraine() {
    for (let i = 0; i <= UACityIndex + 1; i += 1) {
      const el = this.options[i];
      el.classList.add('is-hidden');
    }
    refs.novaPoshtaOption.removeAttribute('selected');
    refs.novaPoshtaOption.classList.add('is-hidden');
    return;
  },
  parcelToUkraine() {
    for (let i = 0; i < this.options.length; i += 1) {
      const el = this.options[i];
      el.classList.remove('is-hidden');
    }

    refs.novaPoshtaOption.setAttribute('selected', 'true');
    refs.novaPoshtaOption.classList.remove('is-hidden');
    return;
  },
  parcelFromUkraine() {
    for (let i = 0; i <= UACityIndex + 1; i += 1) {
      const el = this.options[i];
      el.classList.add('is-hidden');
    }

    refs.novaPoshtaOption.removeAttribute('selected');
    refs.novaPoshtaOption.classList.add('is-hidden');
    return;
  },
  hideEqualCity() {
    const emptyOptions = refs.routesSearchForm.querySelectorAll(
      'option[value=Empty]'
    );
    emptyOptions.forEach(o => o.classList.add('is-hidden'));

    this.options.forEach(option => {
      if (option.value === refs.startCity.value) {
        refs.endCity.querySelector('option[value=Empty]').selected;

        option.classList.add('is-hidden');
        return;
      }
    });
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
  let ringBuseslist = await listType();
  let availableDays = [];

  ringBuseslist.map(bus => {
    let startCityTime = eval(`bus.in_${refs.startCity.value}`);
    let endCityTime = eval(`bus.in_${refs.endCity.value}`);

    if (startCityTime && endCityTime) {
      availableDays.push(function (date) {
        return date.getDay() === Number(bus.start_day);
      });
    }
  });

  dateSelector.set('enable', availableDays);
  refs.dateForm.disabled = false;
};
const setAvailableDate = () => {
  refs.dateForm.disabled = true;
  dateSelector.clear();

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

  if (event.target === refs.seatRadioBtn) {
    refs.endCity.selectedIndex = this.options.length - 1;
  }

  if (event.target !== refs.startCity && event.target !== refs.endCity) {
    return;
  }

  const debouncedSetDate = _debounce(setAvailableDate, 3000);
  debouncedSetDate();
};

refs.routesSearchForm.addEventListener('input', handleFormActions);
