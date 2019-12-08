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

<<<<<<< HEAD
router.post("")
=======
router.post('/login', (req, res) => {
  var user = req.fields["username"]
  var pass = req.fields["password"]
  if (user === "sga" && pass === "sgaPassword"){
    console.log("here")
    res.redirect('/sga')
  } else {
    res.render('/')
  }
});
>>>>>>> 25d2e6f98ab9c3985fdcd3e8fb504487f68f22aa

router.get("/sga", (req, res) => {
  res.render('admindashboard.html')
})

router.get("/sga/additem.html", (req, res) => {
  res.render('additem.html')
});

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