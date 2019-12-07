const express = require('express');
const routes = require('./routes/index');
const app = express();
const formidable = require('express-formidable');

app.use(formidable())
app.use('/', routes)

module.exports = app;