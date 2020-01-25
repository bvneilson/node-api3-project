const knex = require('knex');

const environment = 'development'
const knexConfig = require('../knexfile.js');

module.exports = knex(knexConfig[environment]);
