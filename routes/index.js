const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'noynaert.cs.missouriwestern.edu',
  user: 'sga',
  password: 'sgaPassword',
  database: 'sga',
  multipleStatements: true
})

connection.connect(function(err){
  if (err) {
    console.log(err.stack);
  } else {
    console.log('Successfully connected!')
  }
});

router.get("/", (req, res) => {
  res.render("index.html")
})

router.get("/sga", (req, res) => {
  res.render('admindashboard.html')
})

router.get("/sga/itemsearch.html", (req, res) => {
  res.render('itemsearch.html')
})

router.get("/sga/additem.html", (req, res) => {
  res.render('additem.html')
});

router.get('/sga/updateinventory.html', (req, res) => {
  res.render('updateinventory.html')
})

router.get("/sga/rso_names", (req, res) => {
  
  connection.query("SELECT RSO_NAME FROM RSO", (err, results, fields) => {
    if (err) {
      console.log('error')
    } else {
      var tbl = []

      for (i in results){
        tbl[i] = results[i].RSO_NAME
      }
      
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(JSON.stringify(tbl))
    }
  })

})

router.post("/sga/itemsearch.html", (req, res) => {
  
  var tbl = []

  tbl['tnum'] = 'TAG_NUM'
  tbl['itemname'] = 'ITEM_NAME'
  tbl['RSO'] = 'RSO_NAME'

  var sql = "SELECT TAG_NUM, ITEM_NAME FROM INVENTORY WHERE ";
  for (i in req.fields){
    if (req.fields[i] !== ''){
      sql += (tbl[i] + " = " + mysql.escape(req.fields[i]))
    }
  }

  connection.query(sql, (err, results, fields) => {
    if (err) {
      if (err.code !== 'ER_PARSE_ERROR'){
        for (i in err)
          console.log(i, err[i])
        
        res.send(JSON.stringify({body: "Error"}))
      } else res.send(JSON.stringify({body: "No valid input"}))
    } else {
      var tbl = []

      for (i in results){
        tbl[i] = [results[i].TAG_NUM, results[i].ITEM_NAME]
      }
      
      res.send(JSON.stringify({body: tbl}))
    }
  })
})

router.post("/sga/additem.html", (req, res) => { 
  var picture = req.files["itempicture"];
  var number = req.fields["tagnum"];
  var noanum = req.fields["noanum"];
  var name = req.fields["itemname"];
  var desc = req.fields["itemdescription"];
  var manuname = req.fields["manufacturername"];
  var modnum = req.fields["modnum"];
  var sernum = req.fields["sernumber"];
  var sellname = req.fields["sellername"];
  var purdate = req.fields["purchasedate"];
  var purprice = req.fields["purprice"];
  var warr = req.fields["warranty"];
  var warrenddate = req.fields["warrantyenddate"];
  var storloc = req.fields["storageloaction"];
  var condition = req.fields["condition"];
  var foccategory = req.fields["foccategory"];
  var rso = req.fields["RSO"];

  var tbl = [
    [picture,number,noanum,name,desc,manuname,modnum,sernum,condition,sellname,purdate,purprice,warr,warrenddate,foccategory,storloc,rso]
  ]

  var sql = "INSERT INTO INVENTORY(ITEM_PIC, TAG_NUM, NOA_NUM, ITEM_NAME, ITEM_DESC, MANUFACT_NAME, MODEL_NUM, SERIAL_NUM, ITEM_COND, SELLER_NAME, PUR_DATE, PUR_PRICE, WARRANTY, WAR_END_DATE, FOC_CAT, STORE_LOCAL, RSO_NAME) VALUES ?";

  connection.query(sql, [tbl], (err) => {
    if (err) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(JSON.stringify({body: 'Error: ' + err.stack}))
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(JSON.stringify({body: 'Inserted item into item table'}))
    } 
  });
});

module.exports = router;