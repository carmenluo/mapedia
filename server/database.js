const db = require('../lib/db')

const getPin = function (id) {
  const values = [`${id}`]
  return db.query(`
  SELECT *
  FROM pins
  WHERE pins.id = $1;
  `, values)
    .then(res => res.rows[0]);
}
exports.getPin = getPin;
