const mysql = require('mysql2');


// CONNECT TO DATABASE
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'employee_tracker'
  },
  console.log('Connected to employee_tracker database!')
);


module.exports = db;