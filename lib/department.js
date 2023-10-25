const inquirer = require('inquirer');

function viewAllDepartments(connection, start) {
    const query = 'SELECT department_id, department_name FROM departments';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving departments:', err);
      } else {
        console.log('\nAll Departments:\n');
        console.table(results);
        start(connection); // Return to the main menu
      }
    });
  }
  
 function addDepartment(connection, start) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'department_name',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answers) => {
        // Insert the new department into the database
        const query = 'INSERT INTO departments (department_name) VALUES (?)';
        const values = [answers.department_name];
  
        connection.query(query, values, (err, result) => {
          if (err) {
            console.error('Error adding department:', err);
          } else {
            console.log('Department added successfully!');
            start(connection); // Return to the main menu
          }
        });
      });
  }
  
  function getDepartments(callback) {
    const query = 'SELECT department_id, department_name FROM departments';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving departments:', err);
        callback([]); // Return an empty array in case of an error
      } else {
        // Extract the department choices from the query results
        const departmentChoices = results.map((department) => ({
          name: department.department_name,
          value: department.department_id,
        }));
        callback(departmentChoices);
      }
    });
  }
  // Add more department-related functions as needed
  
  module.exports = { viewAllDepartments, addDepartment, getDepartments };