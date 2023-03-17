import { GoogleSpreadsheet } from 'google-spreadsheet';
// import keys from '../../credentials.json';

const SHEET_ID = '1s1Ap9gORGsVw-An5TJGBEaXroJ3n0yBhluvtRM85D6M';
const doc = new GoogleSpreadsheet(SHEET_ID);
let rows = [];

export const getRingRoutesList = async () => {
  const adminArray = await fetch(
    'https://641201246e3ca3175304119e.mockapi.io/api/auth/admin'
  );

  const array = await adminArray.json();
  await doc.useServiceAccountAuth({
    client_email: await array[0].em,
    private_key: await array[0].ky,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  rows = await sheet.getRows();

  return rows;
};

export const getRingRoutesReverseList = async () => {
  const adminArray = await fetch(
    'https://641201246e3ca3175304119e.mockapi.io/api/auth/admin'
  );

  const array = await adminArray.json();
  await doc.useServiceAccountAuth({
    client_email: await array[0].em,
    private_key: await array[0].ky,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[1];
  rows = await sheet.getRows();

  return rows;
};

export const getOrdersList = async () => {
  const adminArray = await fetch(
    'https://641201246e3ca3175304119e.mockapi.io/api/auth/admin'
  );

  const array = await adminArray.json();
  await doc.useServiceAccountAuth({
    client_email: await array[0].em,
    private_key: await array[0].ky,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[2];
  rows = await sheet.getRows();

  return sheet;
};

// export const getSheet = {
//   async getDoc(listNumber) {
//     const adminArray = await fetch(
//       'https://641201246e3ca3175304119e.mockapi.io/api/auth/admin'
//     );

//     const array = await adminArray.json();
//     await doc.useServiceAccountAuth({
//       client_email: await array[0].em,
//       private_key: await array[0].ky,
//     });

//     await doc.loadInfo();
//     const sheet = doc.sheetsByIndex[listNumber];
//     rows = await sheet.getRows();

//     return rows;
//   },
//   async RoutesList() {
//     return await this.getDoc(0);
//   },
//   async RoutesReverseList() {
//     return await this.getDoc(1);
//   },
//   async OrdersList() {
//     return await this.getDoc(2);
//   },
// };
