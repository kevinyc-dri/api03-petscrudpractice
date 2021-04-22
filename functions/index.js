const functions = require("firebase-functions")
const admin = require('firebase-admin')
const express = require('express')

const app = express()
const serviceAccount = require('./credentials.json');


let db;

function connectToFirebase() {
  if (!db) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    db = admin.firestore()
  }
}

app.get('/pets', (req, res) => { // this gets all
  connectToFirebase()
  db.collection('pets').get()
    .then(allPets => {
      const arrayOfPets = []
      allPets.forEach(pet => {
        arrayOfPets.push(pet.data())
        console.log('this is an array of pets ', arrayOfPets)
      })
    })
})

app.post('/addpet', (req, res) => {
  connectToFirebase()
  // console.log(req.body)
  const newPet = req.body
  db.collection('pets')
    .add(newPet)
    .then(() => console.log('new pet added', newPet))
    .catch(err => console.err(err))
})

app.get('/onepet/:petId', (req, res) => {
  connectToFirebase()
  const passedPetId = req.params.petId
  console.log(req.params)

  db.collection('pets')
    .doc(passedPetId)
    .get()
    .then(thePet => console.log(thePet.data()))
})

exports.app = functions.https.onRequest(app)

