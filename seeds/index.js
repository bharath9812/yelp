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
    for (let i = 0; i < 300; i++)
    {
        const random1k = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new CampGround({
            author: '65ede4796cb5b6fda3113e20',
            location: `${cities[random1k].city},${cities[random1k].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1k].longitude,
                    cities[random1k].latitude,
                ]
            },
            images: [
                  {
                    url: 'https://res.cloudinary.com/dgbzkix4o/image/upload/v1710164904/YelpCamp/kfto6ueggd7edh38ivpq.jpg',
                    filename: 'YelpCamp/kfto6ueggd7edh38ivpq'
                  },
                  {
                    url: 'https://res.cloudinary.com/dgbzkix4o/image/upload/v1710164899/YelpCamp/usf4tc09ag2ubozmuokc.jpg',
                    filename: 'YelpCamp/usf4tc09ag2ubozmuokc'
                    }   
                ]
        })
        await camp.save();
    }
}          

seedDB()
    .then(() => {
        mongoose.connection.close(); 
    });

