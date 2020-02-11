const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//Constant Variable used to contain the Database connection issue.
const connection = mysql.createConnection({
  host: 'noynaert.cs.missouriwestern.edu',
  user: 'sga',
  password: 'sgaPassword',
  database: 'sga',
  multipleStatements: true
});

//Connecting to the database and returning an error if unsuccessful.
connection.connect(function(err){
  if (err) {
    console.log(err.stack);
  } else {
    console.log('Successfully connected!')
  }
});

//fetch and render the Index page where users login
router.get("/", (req, res) => {
  res.render("index.html")
});

//Fetch and render the admin Dashboard page
router.get("/sga", (req, res) => {
  res.render('admindashboard.html')
});

//Fetch and render the item search page
router.get("/sga/itemsearch.html", (req, res) => {
  res.render('itemsearch.html')
});

//Fetch and render the add item page
router.get("/sga/additem.html", (req, res) => {
  res.render('additem.html')
});

//Fetch and render the add item page
router.get('/sga/updateinventory.html', (req, res) => {
  res.render('updateinventory.html')
});
//Fetch and Render Update RSO page
router.get('/sga/updaterso.html', (req, res) => {
  res.render('updaterso.html')
});
//Fetch and render add RSO page
router.get('/sga/addrso.html', (req, res) => {
  res.render('addrso.html')
});
//Fetch and render Search RSO page
router.get('/sga/searchrso.html', (req, res) => {
  res.render('searchrso.html')
});

//Fetch and render the name of RSO's so they can be searched by name
router.get("/sga/rso_names", (req, res) => {
  
  connection.query("SELECT RSO_NAME FROM RSO", (err, results, fields) => {
    if (err) {
      console.log('error')
    } else {
      var tbl = [];

      for (i in results){
        tbl[i] = results[i].RSO_NAME
      }
      
      res.send(JSON.stringify(tbl))
    }
  })
});

//Fetch and render RSO Information for Update RSO So it pulls the other RSO fields
router.get("/sga/rso_information", (req, res) => {
  console.log(req.query['RSO_NAME'])

  var sql = "SELECT RSO_ADVISOR, ADVISOR_PHONE, ADVISOR_EMAIL, RSO_NOTES, ACTIVE FROM RSO WHERE RSO_NAME = ?"
  var inserts = [req.query['RSO_NAME']];
  sql = mysql.format(sql, inserts);
  connection.query(sql,(err, results, fields) => {
    if (err) {
      console.log('error');
    } else {
      console.log(results);
      var tbl = [results[0].RSO_ADVISOR, results[0].ADVISOR_PHONE, results[0].ADVISOR_EMAIL, results[0].RSO_NOTES, results[0].ACTIVE];
      res.send(JSON.stringify(tbl));
      console.log(tbl);
    }
  })
});

//Function to Update an RSO
router.post("/sga/updaterso.html", (req, res) => {

  //SQL Statment to update all fields
  var sql = "UPDATE RSO SET RSO_ADVISOR = ?, ADVISOR_PHONE = ?, ADVISOR_EMAIL = ?, RSO_NOTES =?, ACTIVE = ? WHERE RSO_NAME = ? ";
  var insertName = req.fields['RSO_NAME_HIDDEN'];
  var insertAdvisor = req.fields['RSO_ADVISOR'];
  var insertPhone = req.fields['ADVISOR_PHONE'];
  var insertEmail = req.fields['ADVISOR_EMAIL'];
  var insertNote = req.fields['RSO_NOTES'];
  var insertActive = req.fields['ARCHIVE_YES'];

  var insert =[insertAdvisor, insertPhone, insertEmail, insertNote, insertActive, insertName];

  sql = mysql.format(sql, insert);

  connection.query(sql,(err) => {
    if (err) {
      res.send(JSON.stringify({body: 'Error: ' + err.stack}));
    } else {
      res.send(JSON.stringify({body: 'The RSO has been updated.'}));
    }
  });
});
router.post("/login", (req, res) => {
  res.render('admindashboard.html')
});

//Function to search for RSO
router.post("/sga/searchrso.html", (req, res) => {

  var tbl = [];

  tbl ['RSO_NAME'] = 'r.RSO_NAME';
  tbl ['RSO_ADVISOR'] = 'r.RSO_ADVISOR';

  var sql = "SELECT r.RSO_NAME, r.RSO_ADVISOR, i.ITEM_NAME, i.TAG_NUM FROM RSO r LEFT JOIN INVENTORY i ON r.RSO_NAME = i.RSO_NAME WHERE ";
  for (i in req.fields){
    if (req.fields[i] !== ''){
      sql += (tbl[i] + " = " + mysql.escape(req.fields[i]))

    }
  }
  connection.query(sql, (err, results, fields) => {
    if (err) {
      if (err.code !== 'ER_PARSE_ERROR'){
        for (i in err)
          console.log(i, err[i]);


        res.send(JSON.stringify({body: "Error"}))
      } else res.send(JSON.stringify({body: "No valid input"}))
    } else {
      var tbl = [];

      //Results and what to display
      for (i in results){
        tbl[i] = [results[i].RSO_NAME, results[i].RSO_ADVISOR, results[i].ITEM_NAME, results[i].TAG_NUM]
      }

      res.send(JSON.stringify({body: tbl}))
    }
  })
});



//Function to search for items
router.post("/sga/itemsearch.html", (req, res) => {

  var tbl = [];

  tbl['tnum'] = 'i.TAG_NUM';
  tbl['itemname'] = 'i.ITEM_NAME';
  tbl['RSO'] = 'i.RSO_NAME';

  var sql = "SELECT i.TAG_NUM, i.ITEM_NAME, i.RSO_NAME, r.RSO_ADVISOR FROM INVENTORY i LEFT JOIN RSO r on i.RSO_NAME = r.RSO_NAME WHERE ";
  for (i in req.fields){
    if (req.fields[i] !== ''){
      sql += (tbl[i] + " = " + mysql.escape(req.fields[i]))
    }
  }

  connection.query(sql, (err, results, fields) => {
    if (err) {
      if (err.code !== 'ER_PARSE_ERROR'){
        for (i in err)
          console.log(i, err[i]);
        
        res.send(JSON.stringify({body: "Error"}))
      } else res.send(JSON.stringify({body: "No valid input"}))
    } else {
      var tbl = [];

      for (i in results){
        tbl[i] = [results[i].TAG_NUM, results[i].ITEM_NAME, results[i].RSO_NAME, results[i].RSO_ADVISOR]
      }
      
      res.send(JSON.stringify({body: tbl}))
    }
  })
});

//Function to gather all the information held within the fields of Add Item
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

  //A variable to hold all the information gathered from the method above
  var tbl = [
    [picture,number,noanum,name,desc,manuname,modnum,sernum,condition,sellname,purdate,purprice,warr,warrenddate,foccategory,storloc,rso]
  ];
    //Variable to hold the SQL statement necessary to insert an item into the Database
  var sql = "INSERT INTO INVENTORY(ITEM_PIC, TAG_NUM, NOA_NUM, ITEM_NAME, ITEM_DESC, MANUFACT_NAME, MODEL_NUM, SERIAL_NUM, ITEM_COND, SELLER_NAME, PUR_DATE, PUR_PRICE, WARRANTY, WAR_END_DATE, FOC_CAT, STORE_LOCAL, RSO_NAME) VALUES ?";

  //Inserting the value into the table.
  connection.query(sql, [tbl], (err) => {
    if (err) {
      res.send(JSON.stringify({body: 'Error: ' + err.stack}))
    } else {
      res.send(JSON.stringify({body: 'Inserted item into item table'}))
    } 
  });
});

//Function to handle add RSO
//Grab fields entries
router.post("/sga/addrso.html", (req, res) => {
  var name = req.fields["rsoname"];
  var advisor = req.fields["rsoadvisor"];
  var number = req.fields["phonenum"];
  var email = req.fields["rsoemail"];
  var notes = req.fields["rsonotes"];
  var active = 'Y';


  //Variable to hold all the information gathered.
  var tbl =[[name, advisor, number, email, notes, active]];

  //Variable to hold the SQL Statement to insert an RSO
  var sql = "INSERT INTO RSO(RSO_NAME, RSO_ADVISOR, ADVISOR_PHONE, ADVISOR_EMAIL, RSO_NOTES, ACTIVE) VALUES ?";

  //Connecting to the database and supplying the query
  connection.query(sql, [tbl], (err) => {
    if (err) {
      res.send(JSON.stringify({body: 'Error: ' + err.stack}))
    } else {
      res.send(JSON.stringify({body: 'Inserted item into rso table'}))
    }
  });
});
  module.exports = router;