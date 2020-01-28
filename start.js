const app = require('./app');
const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port,() => {
  console.log(`Express is running on port ${port}`);
});