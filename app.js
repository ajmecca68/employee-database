const mysql = require('mysql2');
const inquirer = require('inquirer');
const { start } = require('./lib/main');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Starhawk68!',
  database: 'employee_db',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL2:', err);
    } else {
      console.log('Connected to MySQL2 database');
      start(connection);
    }
  });
