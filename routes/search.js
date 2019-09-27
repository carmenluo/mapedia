const express = require("express");
const router = express.Router();
//

module.exports = db => {
  router.get("/", (req, res) => {
    let userSearch = req.query;
    console.log(req.query)
    console.log(req.body)
    console.log(userSearch.search);
    const values = [`%${userSearch.search}%`];
    db.query(
      `
    SELECT *
    FROM maps
    WHERE lower(description) LIKE $1 OR lower(category) LIKE $1;
    `,
      values
    )
      .then(data => {
        console.log(data.rows)
        res.send({ maps: data.rows });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
