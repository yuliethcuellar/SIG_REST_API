var express = require('express');
var router = express.Router();

var pg = require('pg');

pg.defaults.ssl = process.env.DATABASE_URL != undefined;
var conString = process.env.DATABASE_URL || "postgres://postgres:root@localhost/proyecto_sig"; // Cadena de conexión a la base de datos

// Set up your database query to display GeoJSON
var coffee_query = "SELECT * FROM public.via-norte ORDER BY gid ASC";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Postgis & NodeJS'}
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
    res.json(result.rows);
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
