const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");

router.use(
  cookieSession({
    name: "user_id",
    keys: ["id"]
  })
);

module.exports = db => {
  router.get("/", (req, res) => {
    db.query(`
    SELECT * FROM maps
    order by id DESC;
    `)
      .then(data => {
        console.log(data)
        const maps = data.rows;
        // console.log(maps);
        if (req.session.user_id) {
          res.json({ maps, logined: true });
        } else {
          res.json({ maps, logined: '' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/getfavorites", (req, res) => {
    values = [req.session.user_id];
    db.query(`
    SELECT maps.* FROM maps join favorites on maps.id = favorites.map_id
    join users on favorites.user_id = users.id
    where favorites.user_id =$1;
    `, values)
      .then(data => {
        // console.log(data)
        const maps = data.rows;
        // console.log(maps);
        if (req.session.user_id) {
          res.json({ maps, logined: true });
        } else {
          res.json({ maps, logined: '' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/mapsupdate", (req, res) => {
    console.log(req.body);
    let mapID = req.body.mapID;
    let url = req.body.mapString;
    let coordsString = req.body.coordsString;
    console.log("coordstring:" + coordsString);
    if (coordsString) {
      let coordsArray = coordsString.split(',');
      let coords = [];
      for (let i = 0; i < coordsArray.length - 1; i++) {
        coords.push({ latitude: Number(coordsArray[i]), longitude: Number(coordsArray[i + 1]) });
        i++;
      }

      db.query(`
        UPDATE maps SET url = $1 where id = $2
        `, [`${url}`, `${mapID}`]).then(data => {
        for (coord of coords) {
          const values = [`${coord.latitude}`, `${coord.longitude}`, mapID];
          db.query(
            `
            INSERT INTO pins (latitude, longitude, map_id)
            VALUES ($1, $2, $3)
            RETURNING *;
          `,
            values
          ).then(data => {
            res.render('homepage', { name: "fixmeinsubmission", user: req.session.user_id, error: '' });
            // res.json('get it');
          });
        }
      })
    }
    res.redirect("/");
  })

  router.post("/mapsubmission", (req, res) => {

    let textArea = req.body.textsubmit;
    let dropMenu = req.body.dropdown;
    let userID = req.session.user_id;
    let url = req.body.mapString;
    let coordsString = req.body.coordsString;
    let coordsArray = coordsString.split(',');
    let coords = [];
    for (let i = 0; i < coordsArray.length - 1; i++) {
      coords.push({ latitude: Number(coordsArray[i]), longitude: Number(coordsArray[i + 1]) });
      i++;
    }
    let img = req.body.img;
    const values = [userID, textArea, url, dropMenu];
    /*
    1. Insert map
    2. get map_id associate with the pins
    3. insert Pins with map_id
    */
    db.query(`
    INSERT INTO maps (owner_id, description, url, category)
    VALUES ($1, $2, $3 ,$4);
    `, values)
      .then(data => {
        // res.json({ data })
        db.query(`
        SELECT * FROM maps order by id DESC;
        `).then(data => {
          for (coord of coords) {
            // console.log("coord: ", coord);
            const values = [`${coord.latitude}`, `${coord.longitude}`, data.rows[0].id];
            db.query(
              `
            INSERT INTO pins (latitude, longitude, map_id)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
              values
            ).then(data => {
              res.redirect("/");
              // res.json('get it');
            });
          }
        });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  })
  return router;
};
