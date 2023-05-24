import { Request, Response, NextFunction } from 'express';
import pool from '../pool';
import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
});


export const getCampgrounds = (request: Request, response: Response, next: NextFunction) => {
  pool.query('SELECT campgrounds.id, campgrounds.name, campgrounds.image, campgrounds.description, campgrounds.user_id, campgrounds.price, campgrounds.location, campgrounds.lat, campgrounds.lng, campgrounds.rating, campgrounds.created_at, campgrounds.image_id, ycusers.username FROM campgrounds LEFT OUTER JOIN ycusers ON campgrounds.user_id = ycusers.id ORDER BY campgrounds.id DESC', (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).send('Problem fetching campgrounds');
    } else {
      response.locals.campgrounds = results.rows;
      next();
    }
  });
};


export const getCampgroundsByUser = (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT campgrounds.id, campgrounds.name, campgrounds.image, campgrounds.description, campgrounds.user_id, campgrounds.price, campgrounds.location, campgrounds.lat, campgrounds.lng, campgrounds.rating, campgrounds.created_at, campgrounds.image_id, ycusers.username FROM campgrounds LEFT OUTER JOIN ycusers ON campgrounds.user_id = ycusers.id WHERE user_id = $1 ORDER BY campgrounds.id ASC', [id], (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).send('Problem fetching campgrounds');
      return;
    }
    response.locals.campgrounds = results.rows;
    next();
  });
};


export const getCampgroundById = (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT campgrounds.id, campgrounds.name, campgrounds.image, campgrounds.description, campgrounds.user_id, campgrounds.price, campgrounds.location, campgrounds.lat, campgrounds.lng, campgrounds.rating, campgrounds.created_at, campgrounds.image_id, ycusers.username FROM campgrounds LEFT OUTER JOIN ycusers ON campgrounds.user_id = ycusers.id WHERE campgrounds.id = $1', [id], (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).send('Problem fetching campground');
      return;
    }
    response.locals.campground = results.rows[0];
    next();
  });
};


export const createCampground = async (request: Request, response: Response, next: NextFunction) => {
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
    const [geoResult] = await geocoder.geocode(campLocation);
    let latitude = 0;
    let longitude = 0;
    let formattedAddress = '';
    if (geoResult) {
      if (geoResult.latitude) {
        latitude = geoResult.latitude;
      }
      if (geoResult.longitude) {
        longitude = geoResult.longitude;
      }
      if (geoResult.formattedAddress) {
        formattedAddress = geoResult.formattedAddress;
      }
    }

    const { rows: [{id}] } = await pool.query(
      'INSERT INTO campgrounds (name, image, image_id, description, user_id, price, lat, lng, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [name, image, imageId, description, userId, price, latitude, longitude, formattedAddress]
    );
    response.locals.id = id;
    next();
  } catch (err) {
    console.error(err);
    response.status(404).send('Problem creating campground');
  }
};


export const updateCampground = async (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id, 10);
  const {
    name, image, imageId, description, price, campLocation, rating
  } = request.body;

  try {
    const [{
      latitude,
      longitude,
      formattedAddress
    }] = await geocoder.geocode(campLocation);
    const { rows: [campground] } = await pool.query(
      'WITH updated AS (UPDATE campgrounds SET name = $1, image = $2, image_id = $3, description = $4, price = $5, lat = $6, lng = $7, location = $8, rating = $9 WHERE id = $10 RETURNING *) SELECT updated.*, ycusers.username FROM updated, ycusers WHERE updated.user_id = ycusers.id',
      [name, image, imageId, description, price, latitude, longitude, formattedAddress, rating, id]
    );
    response.locals.campground = campground;
    next();
  } catch (err) {
    console.error(err);
    response.status(404).send('Problem updating campground');
  }
};

export const updateCampgroundRating = async (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id, 10);
  let { rating } = request.body;
  try {
    
    const { rows: [campground] } = await pool.query(
      'UPDATE campgrounds SET rating = $1 WHERE id = $2 RETURNING *',
      [rating, id]
    );
    response.locals.campground = campground;
    next();
  } catch (err) {
    console.error(err);
    response.status(404).send('Problem updating rating');
  }
};


export const deleteCampground = (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id, 10);
  pool.query('DELETE FROM campgrounds WHERE id = $1', [id], (error) => {
    if (error) {
      console.error(error);
      response.status(404).send('Problem deleting campground');
    }
    next();
  });
};
