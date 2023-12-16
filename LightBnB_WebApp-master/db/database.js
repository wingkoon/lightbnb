const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

/// Users
const pool = new Pool({
  // change user to 'vagrant' if using vagrant
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email LIKE $1`, [email])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
    return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      console.log(result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;

  return pool
    .query(`
    INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [`${user.name}`, `${user.email}`, `${user.password}`])
    .then((result) => {
      if (result) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const query = `
  SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
`;
return pool.query(query, [guest_id, limit])
  .then(result => result.rows)
  .catch(error => {
    console.error('Error retrieving reservations:', error);
    return null;
  });
};


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
/*
const getAllProperties = function (options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
};

const getAllProperties = (options, limit = 10) => {

  return pool
  .query(`SELECT * FROM properties LIMIT $1`, [limit])
  .then((result) => {
    console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
*/
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // Check if any filtering options are provided
  if (options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night || options.minimum_rating) {
    queryString += 'WHERE ';

    // Filter by city
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `city LIKE $${queryParams.length} AND `;
    }

    // Filter by owner_id
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `owner_id = $${queryParams.length} AND `;
    }

    // Filter by price range
    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night);
      queryString += `cost_per_night >= $${queryParams.length} AND `;
    }
    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night);
      queryString += `cost_per_night <= $${queryParams.length} AND `;
    }

    // Filter by minimum_rating
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `property_reviews.rating >= $${queryParams.length} AND `;
    }

    // Remove the trailing 'AND' if present
    queryString = queryString.slice(0, -5);
  }

  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch(error => {
      console.error('Error retrieving properties:', error);
      return null;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
/*
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
*/
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];

  /**
   * SQL query to insert a new property into the properties table.
   * @type {string}
   */
  const queryString = `
    INSERT INTO properties (
      owner_id, title, description, thumbnail_photo_url, cover_photo_url,
      cost_per_night, street, city, province, post_code, country,
      parking_spaces, number_of_bathrooms, number_of_bedrooms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(error => {
      console.error('Error adding property:', error);
      return null;
    });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
