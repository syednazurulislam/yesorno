

var http = require('http');
var express = require('express');

var app = express();
var fs=require('fs');
var url = require('url');
var querystring = require('querystring');
var cors = require('cors');
const bodyParser = require("body-parser");
const assert = require('assert');
var state = {};
var array=[];
var data=[];
var you;
var qdata="";
var number="0";
var ok="notok";
app.set('view engine','ejs');

app.use('/loginuser', express.static(__dirname + '/views/loginwebuser.html'));


app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(cors());
let multichain = require("multichain-node")({
  port:  5778,
   host: '34.221.20.244',
   user: "multichainrpc",
   pass: "Hb6T6oWUwUzjQxPSMuZ5uTzXsimgwLF1BxZB25EQcXm7"
});

multichain.getInfo((err, info) => {
  if(err){
      throw err;
  }
  console.log(info);
})





       










app.post('/loginweb',function(req,res){
  var  phonenumber =req.body.phonenumber;
  var  password =req.body.password;
  
    var up={
      'phonenumber':phonenumber,
      'password':password
    }
  console.log(up);
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("user_crud1");
    dbo.collection("registerusers").findOne(up, function(err, result) {
      if (result){
      console.log('valid');
  
      var resup=result;
      var validaddrss1=result.blockchainaddress1;
      var validaddrss2=result.blockchainaddress2;
      var validaddrss3=result.blockchainaddress3;
      var city=result.Branchname;

      console.log(validaddrss1);
      if(resup){
        var s = {
          status: 'valid',
          validAddress:validaddrss1,
          retunAddress:validaddrss2,
          endAddress:validaddrss3,
          city:city
  };
  multichain.getAddressBalances({
    address : validaddrss1
  }).then(assertraw=>{
    console.log(assertraw);
    console.log(s)
    res.render('asset3.ejs', {assertrawb:assertraw,userdetailss:s});
  
  })
  

      }
    }else{
      console.log('failed');
      console.log("invalid password or phone number");
      res.redirect('/loginuser');
    }
      db.close();
    });
  });


})








 app.post('/api/checksum',function(req,res){
   console.log('checksum hits');
   var response= 'sucess';
   res.json(response);
 })

 















app.post('/api/register',function(req,res){
  var userdata = req.body;

console.log(userdata);


console.log("TEST: GET NEW ADDRESS");
multichain.getNewAddress()
.then(address => {
    assert(address, "Could not get new address")
   console.log(address);
    state.address1 = address;
    console.log(state.address1);
multichain.getNewAddress()

   if(state.address1){

    multichain.grant({
      addresses: state.address1,
      permissions: "send,receive,create,issue"
      })

     





      var MongoClient = require('mongodb').MongoClient;
var link5 = "mongodb://localhost:27017/";

MongoClient.connect(link5, function(err, db) {
  if (err) throw err;

var a={'username':userdata.username,'companyname':userdata.companyname,'emailid':userdata.mailid,'phonenumber':userdata.phonenumber,'password':userdata.password,'blockchainaddress1':state.address1 }
console.log(a);
  var dbo = db.db("yesorno");
  
  dbo.collection("registerusers").insertOne(a, function(err, result) {
    if (err) throw err;
var u = result;
if(u){
  console.log("inserted");
  
  var s = {
                 status: 'inserted',
        };
       return res.json(s);
}
    console.log("1 document inserted");
    


    db.close();
  });
});
    
   }else{
     console.log("address not came..")
   }
    return multichain.validateAddress({address: state.address1})
})

});







app.post('/api/login',function(req, res){

  var logindata = req.body;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("yesorno");
  dbo.collection("registerusers").findOne(logindata, function(err, result) {
    if (result) {
    console.log('valid');

    var resup=result;
    var validaddrss1=result.blockchainaddress1;

    console.log(validaddrss1);
    if(resup){
      var s = {
        status: 'valid',
        validAddress:validaddrss1,
       
};
return res.json(s);
    }
  }
    else{
      var s = {
        status: 'invaliddatafromregiter',
};
return res.json(s);
    }

    db.close();
  });
});
})



app.post('/api/userscan',function(req,res){

  console.log("im in me userscan");
  
  var cope = req.body;
  console.log(cope);
  


  var uid=cope.tagid;
  console.log(uid);



multichain.listAssets({asset:uid}).then(res789=>{
  console.log(res789);
  if(res789){
    var details1=res789[0].details
    console.log("verifyed with blockchain");
    console.log("it is valid");
    var s = {
      message: 'blockchainrecordfound',
      details : details1
};
return res.json(s);


    }

}).catch(err => {
  console.log("this is from catch");

  console.log(err);
  if(err.code === -708){
    console.log("it is not a valid record in blockchain");
    var s = {
      message: 'blockchainrecordnotfound'
};
return res.json(s);

  }

})
    
})






app.post('/api/multichaindata', function(req, res){
  console.log("im in multichaindata method");
  console.log(JSON.stringify(req.body));
  var mcdi = req.body;
  console.log(mcdi);
  var t=mcdi;
  var uid=mcdi.tagdata;
  var barcode=mcdi.barcodedata;
  var parentaddress=mcdi.validaddress;
  console.log("==================================> "+uid);
  console.log("==================================> "+parentaddress);

 var numberr=1;
 
     multichain.issue({address: parentaddress, asset: uid, qty: numberr,units:numberr,
     details: t}, (err, res89) => {
      console.log("is this undefine from err "+JSON.stringify(err));
         console.log("is this undefine from res89 "+res89);
         if(res89){
           console.log("is this same from res89 "+res89);
          var MongoClients = require('mongodb').MongoClient;
 var link4 = "mongodb://localhost:27017/";
 
 MongoClients.connect(link4, function(err, db) {
   if (err) throw err;
   var dbo = db.db("yesorno");
   dbo.collection("productdata").insertOne(t, function(err, res55) {
     if (err) throw err;
     console.log("1 document inserted in mongo db"); 
     var s={ status: 'productdatainserted'};
     return res.json(s);
     db.close();
    });
  });

         console.log("sucessfully asset created in blockchain");
        multichain.subscribe({"asset":uid}).then(res23=>{
console.log(res23+'4658');
if(res23==null){
  console.log("im in subscribe method");
  
 
}
        }).catch(err=>{
          console.log(err);   
        });
      }else{
        var s={ status: 'productexists'};
        return res.json(s);
      }

     });


   
 
});



app.listen(8091);
