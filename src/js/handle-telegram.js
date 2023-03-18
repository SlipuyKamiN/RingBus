const setToken = async () => {
  const adminArray = await fetch(
    'https://641201246e3ca3175304119e.mockapi.io/api/auth/admin'
  );
  const array = await adminArray.json();
  return await array[0].tg_tok;
};

const telegramOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;',
  },
};

export const sendOrderToTelegram = async ({
  customerName,
  customerPhone,
  routeBeginCity,
  routeEndCity,
  routeBeginDate,
  customerComment,
  driverTelegramID,
  serviceType,
}) => {
  const heading =
    serviceType === 'parcel'
      ? `Клієнт хоче відправити посилку:`
      : `У вас новий пасажир:`;
  const TOKEN = await setToken();
  // const TEXT = `${heading}
  // ${'__'}A Iм'я: ${customerName}${'__'}
  // ${'`'}A Номер телефону: ${customerPhone},${'`'}
  // ${'`'}A Місто відправлення: ${routeBeginCity},${'`'}
  // ${'`'}A Місто прибуття: ${routeEndCity},${'`'}
  // ${'`'}A Дата відправлення: ${routeBeginDate},${'`'}
  // ${'`'}A Коментар пасажира: ${customerComment || 'Без коментаря'}${'`'}`;
  const TEXT =
    heading +
    "  <b>Iм'я:</b>  " +
    '<u>' +
    customerName +
    '</u>' +
    '  <b>Номер телефону:</b>  ' +
    '<u href="tel:+' +
    customerPhone +
    '">' +
    '+' +
    customerPhone +
    '</u>' +
    '  <b>Місто відправлення:</b>  ' +
    '<u>' +
    routeBeginCity +
    '</u>' +
    '  <b>Місто прибуття:</b>  ' +
    '<u>' +
    routeEndCity +
    '</u>' +
    '  <b>Дата відправлення:</b>  ' +
    '<u>' +
    routeBeginDate +
    '</u>' +
    '  <b>Коментар пасажира:</b>  ' +
    '<u>' +
    customerComment +
    '</u>';

  fetch(
    `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${driverTelegramID}&parse_mode=HTML&text=${TEXT}`,
    telegramOptions
  )
    .then(response => response.json())
    .then(post => console.log(post))
    .catch(error => console.log(error));
};
