const { Pool } = require('pg');

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

const NodeGeocoder = require('node-geocoder');

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
      throw new Error(error);
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

const createCampground = (request, response) => {
  const {
    name,
    image,
    description,
    user,
    price,
    campLocation
  } = request.body;

  geocoder.geocode(campLocation, (err, data) => {
    if (err) {
      console.log(err);
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    pool.query('INSERT INTO campgrounds (name, image, description, user_id, price, lat, lng, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [name, image, description, user.id, price, lat, lng, location], (error, results) => {
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
    name, image, description, price, campLocation
  } = request.body;
  geocoder.geocode(campLocation, (err, data) => {
    if (err) {
      console.log(err);
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    pool.query(
      'UPDATE campgrounds SET name = $1, image = $2, description = $3, price = $4, lat = $5, lng = $6, location = $7 WHERE id = $8 RETURNING *',
      [name, image, description, price, lat, lng, location, id],
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
