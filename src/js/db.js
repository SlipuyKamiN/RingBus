import { GoogleSpreadsheet } from 'google-spreadsheet';
import keys from '../../credentials.json';
const doc = new GoogleSpreadsheet(
  '1s1Ap9gORGsVw-An5TJGBEaXroJ3n0yBhluvtRM85D6M'
);

// Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
const foo = async () => {
  await doc.useServiceAccountAuth({
    client_email: keys.client_email,
    private_key: keys.private_key,
  });

  await doc.loadInfo(); // loads sheets
  const sheet = doc.sheetsByIndex[0]; // the first sheet

  const rows = await sheet.getRows();

  console.log(rows[0].end_city);
  console.log(rows[0].in_lviv);
  console.log(rows[0].in_berlin);

  rows[0].in_lviv = '20:30';
  rows[0].save();
};

foo();
// adding / removing sheets
//   const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
//   await newSheet.delete();
