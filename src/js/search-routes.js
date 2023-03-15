// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
// import { getRingRoutesList, getRingRoutesReverseList } from './handle-sheets';

// const refs = {
//   startCity: document.querySelector('#start-route'),
//   dateForm: document.querySelector('[data-date-selector]'),
//   routesSearchForm: document.querySelector('[data-routes-search-form]'),
//   routesList: document.querySelector('[data-routes-list]'),
// };

// let dateOptions = {
//   time_24hr: true,
//   defaultDate: new Date(),
//   minuteIncrement: 1,
//   minDate: 'today',
//   maxDate: new Date().fp_incr(28),
//   locale: {
//     firstDayOfWeek: 1,
//   },
//   enable: [
//     function (date) {
//       return date.getDay() === 4;
//     },
//   ],
// };

// const dateSelector = flatpickr(refs.dateForm, dateOptions);

// const setAvailableDateByStartCity = async startCity => {
//   let ringBuseslist = await getRingRoutesList();
//   let availableDays = [];

//   ringBuseslist.map(bus => {
//     let startCityTime = eval(`bus.in_${startCity}`);

//     if (startCityTime) {
//       availableDays.push(function (date) {
//         return date.getDay() === Number(bus.start_day);
//       });
//     }
//   });

//   dateSelector.set('enable', availableDays);
// };

// setAvailableDateByStartCity(refs.startCity.value);

// refs.startCity.addEventListener('input', e => {
//   dateSelector.clear();

//   setAvailableDateByStartCity(e.target.value);
// });
