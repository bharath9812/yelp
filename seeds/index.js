const mongoose = require('mongoose');

//getting the model
const CampGround = require('../models/campground')

// importing cities
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

main()

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp')
        .then(() => {
            console.log('MONGO connection is open') 
        })
        .catch(err => {
            console.log('MONGO connection error', err);
    })
} 


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await CampGround.deleteMany({});
    for (let i = 0; i < 50; i++)
    {
        const random1k = Math.floor(Math.random() * 1000);

        const camp = new CampGround({
            location: `${cities[random1k].city},${cities[random1k].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}          

seedDB()
    .then(() => {
        mongoose.connection.close(); 
    });

