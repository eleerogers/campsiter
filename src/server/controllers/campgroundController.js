const { Pool } = require('pg');
const NodeGeocoder = require('node-geocoder');


const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});


const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);


const getCampgrounds = (request, response, next) => {
  pool.query('SELECT * FROM campgrounds ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).send();
    }
    response.locals.campgrounds = results.rows;
    next();
  });
};


const getCampgroundsByUser = (request, response, next) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM campgrounds WHERE user_id = $1 ORDER BY id ASC', [id], (error, results) => {
    if (error) {
      console.error(error);
      throw new Error(error);
    }
    response.locals.campgrounds = results.rows;
    next();
  });
};


const getCampgroundById = (request, response, next) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM campgrounds WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    response.locals.campground = results.rows;
    next();
  });
};


const createCampground = async (request, response, next) => {
  const {
    name,
    image,
    imageId,
    description,
    userId,
    price,
    campLocation,
  } = request.body;

  try {
    const [{
      latitude,
      longitude,
      formattedAddress
    }] = await geocoder.geocode(campLocation);

    await pool.query(
      'INSERT INTO campgrounds (name, image, image_id, description, user_id, price, lat, lng, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [name, image, imageId, description, userId, price, latitude, longitude, formattedAddress]
    );
    next();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateCampground = async (request, response, next) => {
  const id = parseInt(request.params.id, 10);
  const {
    name, image, imageId, description, price, campLocation
  } = request.body;

  try {
    const [{
      latitude,
      longitude,
      formattedAddress
    }] = await geocoder.geocode(campLocation);
    const { rows: [campground] } = await pool.query(
      'UPDATE campgrounds SET name = $1, image = $2, image_id = $3, description = $4, price = $5, lat = $6, lng = $7, location = $8 WHERE id = $9 RETURNING *',
      [name, image, imageId, description, price, latitude, longitude, formattedAddress, id]
    );
    response.locals.campground = campground;
    next();
  } catch (err) {
    console.error(err);
    throw err;
  }

  // geocoder.geocode(campLocation, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //   }
  //   const lat = data[0].latitude;
  //   const lng = data[0].longitude;
  //   const location = data[0].formattedAddress;
  //   pool.query(
  //     'UPDATE campgrounds SET name = $1, image = $2, image_id = $3, description = $4, price = $5, lat = $6, lng = $7, location = $8 WHERE id = $9 RETURNING *',
  //     [name, image, imageId, description, price, lat, lng, location, id],
  //     (error, results) => {
  //       if (error) {
  //         console.error(error);
  //         throw error;
  //       }
  //       const [campground] = results.rows;
  //       response.locals.campground = campground;
  //       next();
  //     }
  //   );
  // });
};


const deleteCampground = (request, response, next) => {
  const id = parseInt(request.params.id, 10);
  pool.query('DELETE FROM campgrounds WHERE id = $1', [id], (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
    next();
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
