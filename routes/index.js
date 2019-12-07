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

router.get("/sga/additem.html", (req, res) => {
  
  var tbl = []

  connection.query("SELECT RSO_NAME FROM RSO", (err, results, fields) => {
    if (err) {
      console.log('error')
    } else {
      for (i in results){
        tbl[i] = results[i].RSO_NAME
      }
    }
  })

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(tbl))
})

router.post("/sga/additem.html", (req, res) => {
  var host = req.get('host');
  console.log(host);

  for (i in req.fields)
    console.log(i, req.fields[i])

  for (i in req.files)
    console.log(req.files[i].size)
 
  var picture = req.files["itempicture"];
  var number = req.files["tagnumber"];
  var name = req.fields["itemname"];
  var desc = req.fields["itemdescription"];
  var manuname = req.fields["manufacturername"];
  var modnum = req.fields["modelnumber"];
  var sernum = req.fields["serialnumber"];
  var sellname = req.fields["sellername"];
  var purdate = req.fields["purchasedate"];
  var purprice = req.fields["purchaseprice"];
  var warr = req.fields["warranty"];
  var warrenddate = req.fields["warrantyenddate"];
  var storloc = req.fields["storageloaction"];
  var condition = req.fields["condition"];
  var foccategory = req.fields["foccategory"];
  var rso = req.fields["RSO"];

  var tbl = [
    [number,name,desc,manuname,modnum,sernum,condition,sellname,purdate,purprice,warr,warrenddate,foccategory,storloc,rso]
  ]

  console.log(tbl)

  var sql = "INSERT INTO INVENTORY(TAG_NUM, ITEM_NAME, ITEM_DESC, MANUFACT_NAME, MODEL_NUM, SERIAL_NUM, ITEM_COND, SELLER_NAME, PUR_DATE, PUR_PRICE, WARRANTY, WAR_END_DATE, FOC_CAT, STORE_LOCAL, RSO_NAME) VALUES ?";

  connection.query(sql, [tbl], (err) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('Inserted new item!');
    } 
  });

  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify({message: 'Inserted'}))
});

module.exports = router;