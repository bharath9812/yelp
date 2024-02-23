// npm i express mongoose ejs

const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

//getting the model
const CampGround = require('./models/campground')

main()

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp')
        .then(() => {
            console.log('MONGO connection is open') 
        })
        .catch(err => {
            console.log('MONGO connection error', err);
    })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
} 


// ====================================================================================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

//test route
app.get('/makecampground', async (req, res) => {
    const camp = new CampGround({ title: 'Backyad',description:'cheap'})
    await camp.save();
    res.send('camo');
})

app.listen(3000, () => {
    console.log('Working on port 3K');
})