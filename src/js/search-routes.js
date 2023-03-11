const refs = {
  routesSearchForm: document.querySelector('[data-routes-search-form]'),
  routesList: document.querySelector('[data-routes-list]'),
};

const toggleRoutesList = event => {
  event.preventDefault();
  refs.routesList.classList.toggle('is-hidden');
};

refs.routesSearchForm.addEventListener('submit', toggleRoutesList);
