const { Pool } = require('pg');
// const path = require('path');
// const multer = require('multer');
// const cloudinary = require('cloudinary');
const NodeGeocoder = require('node-geocoder');


const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

// cloudinary.config({
//   cloud_name: 'eleerogers',
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);


const getCampgrounds = (request, response) => {
  pool.query('SELECT * FROM campgrounds ORDER BY id ASC', (error, results) => {
    if (error) {
      response.status(404).send('uh oh');
      return;
    }
    response.status(200).json(results.rows);
  });
};


const getCampgroundsByUser = (request, response) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM campgrounds WHERE user_id = $1 ORDER BY id ASC', [id], (error, results) => {
    if (error) {
      throw new Error(error);
    }
    response.status(200).json(results.rows);
  });
};


const getCampgroundById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM campgrounds WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename(req, file, cb) {
//     cb(null, `IMAGE-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 1000000 },
// }).single('image');

// const createCampground = (request, response) => {
//   upload(request, response, (err) => {
//     const {
//       name,
//       description,
//       user_id,
//       price,
//       campLocation,
//     } = request.body;

//     geocoder.geocode(campLocation, (error, data) => {
//       if (error) {
//         console.log(error);
//       }
//       const lat = data[0].latitude;
//       const lng = data[0].longitude;
//       const location = data[0].formattedAddress;

//       cloudinary.uploader.upload(request.file.path, (result) => {
//         const image = result.secure_url;
//         console.log('user: ', user_id);

//         pool.query('INSERT INTO campgrounds (name, image, description, user_id, price, lat, lng, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [name, image, description, user_id, price, lat, lng, location], (error, results) => {
//           if (error) {
//             throw error;
//           }
//           response.status(201).send(`Campground added with ID: ${results.rows[0].id}`);
//         });
//       });
//     });
//   });
// };

const createCampground = (request, response) => {
  const {
    name,
    image,
    image_id,
    description,
    user_id,
    price,
    campLocation,
  } = request.body;

  geocoder.geocode(campLocation, (error, data) => {
    if (error) {
      console.log(error);
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;

    pool.query('INSERT INTO campgrounds (name, image, image_id, description, user_id, price, lat, lng, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id', [name, image, image_id, description, user_id, price, lat, lng, location], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Campground added with ID: ${results.rows[0].id}`);
    });
  });
};

const updateCampground = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const {
    name, image, image_id, description, price, campLocation
  } = request.body;
  geocoder.geocode(campLocation, (err, data) => {
    if (err) {
      console.log(err);
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    pool.query(
      'UPDATE campgrounds SET name = $1, image = $2, image_id = $3, description = $4, price = $5, lat = $6, lng = $7, location = $8 WHERE id = $9 RETURNING *',
      [name, image, image_id, description, price, lat, lng, location, id],
      (error, results) => {
        if (error) {
          console.log('ERROR: ', error);
          throw error;
        }
        response.status(200).json(results.rows[0]);
      }
    );
  });
};


const deleteCampground = (request, response) => {
  const id = parseInt(request.params.id, 10);
  pool.query('DELETE FROM campgrounds WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Campground deleted with ID: ${id}`);
  });
};


module.exports = {
  getCampgrounds,
  getCampgroundsByUser,
  getCampgroundById,
  createCampground,
  updateCampground,
  deleteCampground,
};
