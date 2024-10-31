const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reservations_db',
  password: 'testing187',
  port: 5432,
});

//einloggen am laptop
const poolLaptop = new Pool({
  user: 'myuser',          // Dein Benutzername
  host: 'localhost',
  database: 'reservations_db',
  password: 'mypassword',  // Dein Passwort
  port: 5432,
});

//hier muss das jeweilige auskommentiert werden
// module.exports = pool;
module.exports = poolLaptop;