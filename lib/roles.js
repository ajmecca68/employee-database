const inquirer = require('inquirer');

function viewAllRoles(connection, callback) {
    const query = 'SELECT DISTINCT job_title, role_id FROM roles';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving roles:', err);
      } else {
        // Extract the role choices from the query results

        // const roleChoices = results.map((role) => ({
        //   name: role.job_title,
        //   value: role.role_id,
        // }));
        console.log('\nAll Roles:\n');
        console.table(results);
        callback(connection); // Call the provided callback function with the role choices
      }
    });
}


  function addRole(connection, departments, start) {
    // Create an array of department choices for the user to select a department for the role
    if (!Array.isArray(departments)) {
        console.error('Departments is not an array:', departments);
        return;
      }
    
      const departmentChoices = departments.map((department) => ({
        name: department.department_name,
        value: department.department_id,
      }));
  
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the name of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department for the role:',
          choices: departments,
        },
      ])
      .then((answers) => {
        // Insert the new role into the database
        const query = 'INSERT INTO roles (job_title, salary, department_id) VALUES (?, ?, ?)';
        const values = [answers.title, answers.salary, answers.department_id];
  
        connection.query(query, values, (err, result) => {
          if (err) {
            console.error('Error adding role:', err);
          } else {
            console.log('Role added successfully!');
            start(connection); // Return to the main menu
          }
        });
      });
  }
  
  function getRoles(connection, callback) {
    const query = 'SELECT role_id, job_title FROM roles';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving roles:', err);
        callback([], err); // Pass an empty array and error to the callback in case of an error
      } else {
        const roleChoices = results.map((role) => ({
          name: role.job_title,
          value: role.role_id,
        }));
        callback(roleChoices, null); // Pass the role choices and null error to the callback
      }
    });
  }

//   function getRoles(connection, callback) {
//     const query = 'SELECT role_id, job_title FROM roles';
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error retrieving roles:', err);
//         } else {
//             // Extract the role choices from the query results
//             const roleChoices = results.map((role) => ({
//                 name: role.job_title,
//                 value: role.role_id,
//             }));

//             callback(roleChoices, results); // Call the provided callback function with the role choices
//         }
//     });
// }
  
  module.exports = { viewAllRoles, addRole, getRoles };