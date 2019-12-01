var mysql = require('mysql');

function getConnection(){
    var con = mysql.createConnection({host: "noynaert.cs.missouriwestern.edu", user: "sga", password: "sgaPassword"});
    
    con.connect(function(err){
        if (err) throw err;
        console.log("Connected!");
    });
    return con;
}

function disconnect(con){
    con.end();
}

function add_item(){
    var picture = document.getElementById("itempicture");
    var number = document.getElementById("itemnumber");
    var name = document.getElementById("itemname");
    var desc = document.getElementById("itemdesc");
    var manuname = document.getElementById("manuname");
    var modnum = document.getElementById("modnum");
    var sernum = document.getElementById("sernum");
    var sellname = document.getElementById("sellname");
    var purdate = document.getElementById("purdate");
    var purprice = document.getElementById("purprice");
    var warr = document.getElementById("warr");
    var warrenddate = document.getElementById("warrenddate");
    var foccat = document.getElementById("foccat");
    var storloc = document.getElementById("storloc");
    var condition = document.getElementById("condition");
    var foccategory = document.getElementById("foccategory");
    var brow = document.getElementById("brow");

    var con = getConnection();

    

    disconnect(con);
}