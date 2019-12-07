const app = require('./app');
const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(port, () => console.log(`Listening on ${ port }`))