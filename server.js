var bodyParser = require('body-parser');
const firebase = require('firebase');
var cors = require('cors');
const express = require('express');

var firebaseConfig = {
  apiKey: "AIzaSyC8S4Dn8KSssDkT1JpWSRnbC3Vetz5LXho",
  authDomain: "mvp-app-9a3e0.firebaseapp.com",
  databaseURL: "https://mvp-app-9a3e0.firebaseio.com",
  projectId: "mvp-app-9a3e0",
  storageBucket: "mvp-app-9a3e0.appspot.com",
  messagingSenderId: "529535335456",
  appId: "1: 529535335456: web: 3884fe50c207ee72"
};

firebase.initializeApp(firebaseConfig)

const database = firebase.database()


var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())


app.get('/device/:deviceId/cart', (req, res) => {
  const deviceId = req.params.deviceId

  const dbRef = database.ref(`/devices/${deviceId}`)
  dbRef.once('value')
    .then((snapshot) => {
      const output = []
      if(snapshot.val()){
        Object.keys(snapshot.val()).forEach((key)=> {
          const item = snapshot.val()[key]
          item.name = key;
          output.push(item)
        })
        return res.json({
          cart: output
        })
      }
    })
    .catch((error) => {
      return res.statusCode(400).json({
        error: error.message
      })
    })

})

app.post('/device/:deviceId/add_cart', (req, res) => {

  const deviceId = req.params.deviceId
  console.log("====deviceId", deviceId)
  const { cart } = req.body;
  const output = { }

  cart.forEach((item)=> {
    output[item.name] = item
  })
  const dbRef = database.ref(`/devices/${deviceId}`)
  dbRef.set(output)
  .then(()=> {
    return res.json({
      success: true
    })
  })
  .catch((error)=> {
    return res.statusCode(400).json({
      error: error.message
    })
  })
});

app.put('/device/:deviceId/update_cart', (req, res) => {
  const deviceId = req.params.deviceId
  console.log("====deviceId", deviceId)
  const { item } = req.body;

  const dbRef = database.ref(`/devices/${deviceId}`)
  dbRef.once('value')
    .then((snapshot) => {
        if(snapshot.val()){
          const output = {...snapshot.val()}
          console.log("====outyput", output)
          output[item.name] = item;


          dbRef.set(output)
          .then(()=> {
            return res.json({
              success: true
            })
          })
          .catch((error)=> {
            throw error.message
          })

        }
      })
      .catch((error)=> {
        return res.statusCode(400).json({
          error: error.message
        })
      })
});

app.delete('/device/:deviceId/remove_cart/:item_name', (req, res) => {
  const deviceId = req.params.deviceId
  const itemName = req.params.item_name


  const dbRef = database.ref(`/devices/${deviceId}`)
  dbRef.once('value')
    .then((snapshot) => {
        if(snapshot.val()){
          const output = {...snapshot.val()}
          delete output[itemName]


          dbRef.set(output)
          .then(()=> {
            return res.json({
              success: true
            })
          })
          .catch((error)=> {
            throw error.message
          })

        }
      })
      .catch((error)=> {
        return res.statusCode(400).json({
          error: error.message
        })
      })
});

var port = process.env.PORT || 3002;

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening to port ${port}`)
})
