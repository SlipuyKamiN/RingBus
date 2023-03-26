import { getRingRoutesList, getRingRoutesReverseList } from './handle-sheets';
import { handleCardClick } from './modal-form';
import { refs } from './elements';
import { Notify } from 'notiflix';

const calculateTripData = (endTime, startTime) => {
  let depart = null;
  let between = null;

  if (startTime.slice(0, -3) > 24) {
    let startTimeDayPlus = startTime.slice(0, -3) - 24;
    startTimeDayPlus += ':00';
    depart = new Date(`${refs.dateForm.value} ${startTimeDayPlus}`).getTime();
    depart += 86400000;
    between = endTime.slice(0, -3) - startTime.slice(0, -3);
  } else {
    depart = new Date(`${refs.dateForm.value} ${startTime}`).getTime();
    between = endTime.slice(0, -3) - startTime.slice(0, -3);
  }

  if (between < 0) {
    between += 24;
  }

  const arrive = depart + Number(between * 3600000);

  const departTime = new Date(depart).toLocaleString().slice(0, -3);
  const arriveTime = new Date(arrive).toLocaleString().slice(0, -3);

  return { departTime, arriveTime };
};
const handleSearchRoutes = async event => {
  event.preventDefault();
  if (!refs.dateForm.value) {
    Notify.info('Виберіть маршрут і дату поїздки');
    return;
  }

  refs.searchBtn.disabled = true;

  try {
    if (refs.startCity.selectedIndex > refs.endCity.selectedIndex) {
      await renderListMarkup(getRingRoutesReverseList);
    } else {
      await renderListMarkup(getRingRoutesList);
    }
  } catch (error) {
    Notify.failure('Щось пішло не так...');
    console.log(error);
  }
  refs.searchBtn.disabled = false;
};
const renderListMarkup = async listType => {
  let ringBuseslist = await listType();

  const markup = ringBuseslist.map(bus => {
    let startCityTime = eval(`bus.in_${refs.startCity.value}`);
    let endCityTime = eval(`bus.in_${refs.endCity.value}`);
    let selectedDay = new Date(refs.dateForm.value).getDay();

    if (
      startCityTime &&
      endCityTime &&
      bus.start_day &&
      selectedDay === Number(bus.start_day)
    ) {
      const { departTime, arriveTime } = calculateTripData(
        endCityTime,
        startCityTime
      );

      return `        <li class="routes__bus" data-route>
      <p class="routes__id">${bus.RingBus_ID}</p>
      <table class="schedule__table">
      <p class="schedule__warning">Зверніть увагу, що час прибуття може не співпадати, час подорожі залежить від завантаженості доріг, погодних умов та ситуації на кордоні.</p>
        <thead>
          <tr class="schedule__row">
            <th class="schedule__date">${departTime}</th>
            <th class="schedule__date schedule__date--right">${arriveTime}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="schedule__row">
            <td class="schedule__city">${refs.startCity.selectedOptions[0].text}</td>
            <td class="schedule__city schedule__city--right">${refs.endCity.selectedOptions[0].text}</td>
          </tr>
        </tbody>
      </table>
      <div class="routes__footer">
        <ul class="routes__addons">
          <li class="routes__add-on">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path d="M23.133 17.053c-0.242 0.001-0.475-0.090-0.653-0.253-1.77-1.585-4.063-2.462-6.44-2.462s-4.67 0.877-6.44 2.462c-0.098 0.088-0.212 0.155-0.336 0.199s-0.256 0.062-0.387 0.055c-0.131-0.007-0.26-0.041-0.378-0.098s-0.224-0.137-0.312-0.235c-0.172-0.201-0.259-0.462-0.241-0.726s0.138-0.511 0.335-0.688c2.13-1.917 4.894-2.978 7.76-2.978s5.63 1.061 7.76 2.978c0.197 0.177 0.317 0.423 0.335 0.688s-0.069 0.525-0.241 0.726c-0.097 0.104-0.215 0.187-0.346 0.245s-0.271 0.087-0.414 0.089z"></path>
          <path d="M26.667 13.333c-0.252-0.001-0.494-0.096-0.68-0.267-2.695-2.569-6.276-4.003-10-4.003s-7.305 1.433-10 4.003c-0.092 0.109-0.206 0.197-0.335 0.259s-0.269 0.095-0.412 0.097c-0.143 0.003-0.284-0.025-0.415-0.081s-0.248-0.14-0.344-0.246-0.168-0.23-0.212-0.366c-0.044-0.136-0.058-0.279-0.042-0.421s0.063-0.278 0.136-0.4c0.073-0.122 0.172-0.227 0.289-0.308 3.061-2.9 7.117-4.516 11.333-4.516s8.272 1.616 11.333 4.516c0.146 0.135 0.248 0.311 0.294 0.504s0.033 0.396-0.037 0.582-0.194 0.347-0.356 0.462c-0.162 0.115-0.355 0.18-0.553 0.185z"></path>
          <path d="M12.507 20.853c-0.155 0-0.308-0.036-0.447-0.106s-0.26-0.17-0.353-0.294c-0.081-0.104-0.139-0.224-0.173-0.351s-0.041-0.26-0.023-0.391c0.019-0.131 0.063-0.256 0.131-0.369s0.158-0.211 0.264-0.289c1.177-0.901 2.618-1.389 4.1-1.389s2.923 0.488 4.1 1.389c0.105 0.079 0.194 0.178 0.261 0.291s0.111 0.238 0.129 0.368c0.019 0.13 0.011 0.262-0.021 0.39s-0.090 0.247-0.169 0.352c-0.161 0.209-0.398 0.347-0.659 0.385s-0.527-0.029-0.741-0.185c-0.834-0.635-1.852-0.979-2.9-0.979s-2.067 0.344-2.9 0.979c-0.174 0.127-0.384 0.197-0.6 0.2z"></path>
          <path d="M16 25c-0.265 0-0.52-0.105-0.707-0.293s-0.293-0.442-0.293-0.707 0.105-0.52 0.293-0.707c0.187-0.188 0.442-0.293 0.707-0.293s0.52 0.105 0.707 0.293c0.188 0.187 0.293 0.442 0.293 0.707s-0.105 0.52-0.293 0.707c-0.187 0.188-0.442 0.293-0.707 0.293z"></path>
          </svg>
          </li>
          <li class="routes__add-on">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <title>charger</title>
          <path d="M4.874 7.276h-0.977c-0.279 0-0.505 0.226-0.505 0.505s0.226 0.505 0.505 0.505h0.977c0.279 0 0.505-0.226 0.505-0.505s-0.226-0.505-0.505-0.505z"></path>
          <path d="M29.814 5.617c0.279 0 0.505-0.226 0.505-0.505v-2.2c0-0.279-0.226-0.505-0.505-0.505h-0.887v-1.901c0-0.279-0.226-0.505-0.505-0.505s-0.505 0.226-0.505 0.505v1.901h-2.358v-1.901c0-0.279-0.226-0.505-0.505-0.505s-0.505 0.226-0.505 0.505v1.901h-0.887c-0.279 0-0.505 0.226-0.505 0.505v5.928c0 0.279 0.226 0.505 0.505 0.505h1.336v0.932c0 0.702 0.553 1.275 1.246 1.31v8.732c0 3.323-1.527 6.296-3.917 8.255 1.097-1.447 1.748-3.249 1.748-5.2 0-4.756-3.869-8.626-8.626-8.626s-8.626 3.869-8.626 8.626c0 1.697 0.493 3.282 1.343 4.618-2.011-1.942-3.263-4.663-3.263-7.672v-4.631h0.518c0.279 0 0.505-0.226 0.505-0.505v-1.233h0.218c0.535 0 0.971-0.436 0.971-0.971v-3.748c0-0.21-0.128-0.39-0.311-0.466v-2.054c0-0.474-0.385-0.859-0.859-0.859h-3.095c-0.474 0-0.859 0.385-0.859 0.859v2.053c-0.183 0.076-0.311 0.256-0.311 0.467v3.748c0 0.535 0.436 0.971 0.971 0.971h0.218v1.233c0 0.279 0.226 0.505 0.505 0.505h0.518v4.631c0 6.151 4.779 11.206 10.818 11.649 0.243 0.021 0.489 0.032 0.738 0.032 0.021 0 0.041-0.001 0.062-0.001s0.041 0.001 0.062 0.001c6.441 0 11.68-5.24 11.68-11.68v-8.734c0.682-0.046 1.224-0.615 1.224-1.309v-0.932h1.336c0.279 0 0.505-0.226 0.505-0.505v-2.224c0-0.279-0.226-0.505-0.505-0.505s-0.505 0.226-0.505 0.505v1.718h-5.142v-4.918h5.142v1.695c0 0.279 0.226 0.505 0.505 0.505zM3.003 6.864h2.792v1.863h-2.792v-1.863zM2.691 12.941v-3.203h3.414v3.203h-3.414zM3.88 14.678v-0.727h1.037v0.727h-1.037zM15.511 30.989c-0.243-0.001-0.484-0.011-0.722-0.028-3.891-0.336-6.955-3.61-6.955-7.586 0-4.199 3.416-7.615 7.615-7.615s7.615 3.416 7.615 7.615c0 4.178-3.383 7.581-7.553 7.614zM26.008 9.345h1.46v0.932c0 0.167-0.136 0.303-0.303 0.303h-0.853c-0.167 0-0.303-0.136-0.303-0.303v-0.932z"></path>
          </svg>
          </li>
          <li class="routes__add-on">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <title>sleeping-bed</title>
          <path d="M17.92 0v1.28h2.56l-2.56 2.56v1.28h4.48v-1.28h-2.88l2.56-2.56v-1.28zM10.24 6.4v1.28h3.52l-3.52 3.84v1.28h5.76v-1.28h-4.16l3.52-3.84v-1.28zM1.92 10.88c-1.058 0-1.92 0.863-1.92 1.92v19.2h3.84v-3.2h24.32v3.2h3.84v-7.68h-28.16v-11.52c0-1.058-0.862-1.92-1.92-1.92zM7.68 16.64c-1.765 0-3.2 1.435-3.2 3.2s1.435 3.2 3.2 3.2c1.765 0 3.2-1.435 3.2-3.2s-1.435-3.2-3.2-3.2zM12.16 16.64c-0.352 0-0.64 0.285-0.64 0.64v5.76h20.48v-3.2c0-1.765-1.435-3.2-3.2-3.2z"></path>
          </svg>
          </li>
        </ul>
        <button
          type="button"
          class="btn routes__choose-btn"
          data-modal-open
        >
          Вибрати
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <title>btn-arrow</title>
          <path d="M10.586 3.272c-0.375 0.375-0.586 0.884-0.586 1.414s0.211 1.039 0.586 1.414l9.9 9.9-9.9 9.9c-0.364 0.377-0.566 0.882-0.561 1.407s0.215 1.026 0.586 1.397 0.872 0.581 1.397 0.586c0.524 0.005 1.030-0.197 1.407-0.561l11.314-11.314c0.375-0.375 0.586-0.884 0.586-1.414s-0.211-1.039-0.586-1.414l-11.314-11.314c-0.375-0.375-0.884-0.586-1.414-0.586s-1.039 0.211-1.414 0.586z"></path>
          </svg>
        </button>
      </div>
    </li>`;
    }

    return;
  });

  refs.routesList.innerHTML = markup.join('');
  refs.routeCards = document.querySelectorAll('[data-route]');
  refs.routeCards.forEach(card => {
    card.addEventListener('click', handleCardClick);
  });
};

refs.routesSearchForm.addEventListener('submit', handleSearchRoutes);
