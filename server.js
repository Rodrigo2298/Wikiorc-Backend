var admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())
var serviceAccount = require("./servicio.json");

app.set("view engine", "ejs");
app.use(express.static("public"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wikiorc-f1e45-default-rtdb.firebaseio.com"
});
var refshops = admin.database().ref("Shops")

app.get("/api/get", async (req, res)=>{
  var response
  let shop=req.query.type
  let ref = admin.database().ref("Shops/"+shop)
  ref.on('value', (snapshot) => {
    response= snapshot.val()
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
  });
  res.send(response)
})

app.post("/addItem", (req, res) =>{
  refshops.child(req.body.class).child(req.body.name).set(req.body)
  res.send([])
});

app.get("/", function(req, res) {
  res.render("index", {
    data: "hola"
  });
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
