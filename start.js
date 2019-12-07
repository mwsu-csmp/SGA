const app = require('./app');
const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.listen(port,() => {
  console.log(`Express is running on port ${server.address().port}`);
});