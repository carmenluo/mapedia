const { Pool } = require('pg')

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
