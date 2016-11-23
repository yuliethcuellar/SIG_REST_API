var express = require('express');
var router = express.Router();

var pg = require('pg');

pg.defaults.ssl = true;
var conString = process.env.DATABASE_URL || "postgres://xdruizytkyrmpx:mW73aX0ai-3yM_qNG0ZrP3UirS@ec2-54-235-125-38.compute-1.amazonaws.com:5432/de499kjl0lbias"; // Cadena de conexión a la base de datos

// Set up your database query to display GeoJSON
var coffee_query = 'SELECT row_to_json(fc) FROM (	SELECT array_to_json(array_agg(f)) As features FROM (	SELECT ST_AsGeoJSON(lg.geom)::json As geometry,	row_to_json((gid, barrios_he)) As properties FROM public."puntos-accidentes" As lg) As f) As fc';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'puntos de accidentalidad'
  }
  );
});

router.get('/puntos', function (req, res, next) {
  res.render('puntos', {
    title: 'puntos de accidentalidad'
  }
  );
});

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query(coffee_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

/* GET Tabla */
router.get('/tabla', function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query(coffee_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    res.render('tabla', {
      title: 'Tabla de datos',
      datos: result.rows
    });
  });
});

module.exports = router;
