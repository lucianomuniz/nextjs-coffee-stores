const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const getMinified = (record) => {
  return { recordId: record.id, ...record.fields };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinified(record));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

const updateCoffeeStore = async (recordId, fields) => {
  const records = await table.update([
    {
      id: recordId,
      fields,
    },
  ]);

  if (records) {
    return getMinifiedRecords(records);
  }

  return [];
};

export { table, getMinifiedRecords, findRecordByFilter, updateCoffeeStore };
