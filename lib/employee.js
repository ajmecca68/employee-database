const inquirer = require('inquirer');
const { getRoles } = require('./roles');

function viewAllEmployees(connection, callback) {
    const query =   `
            SELECT
            employees.employee_id,
            employees.first_name,
            employees.last_name,
            roles.job_title AS role_name,
            departments.department_name,
            CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.role_id
            LEFT JOIN departments ON employees.department_id = departments.department_id
            LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id
        `;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving employees:', err);
      } else {
        console.log('\nAll Employees:\n');
        console.table(results);
      }
      callback(connection); // Call the provided callback function to return to the main menu
    });
  }
  

 

function addEmployee(connection, departmentChoices, roleChoices, managerChoices, callback) {  
      getRoles(connection, (roleChoices) => {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: "Enter the employee's first name:",
            },
            {
              type: 'input',
              name: 'last_name',
              message: "Enter the employee's last name:",
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Select the manager for the employee (if applicable):',
              choices: [{ name: 'None', value: null }, ...managerChoices],
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'Select the role for the employee:',
              choices: roleChoices,
            },
            {
              type: 'list',
              name: 'department_id',
              message: 'Select the department for the employee:',
              choices: departmentChoices,
            },
          ])
          .then((employeeAnswers) => {
            const query =
              'INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id) VALUES (?, ?, ?, ?, ?)';
            const values = [
              employeeAnswers.first_name,
              employeeAnswers.last_name,
              employeeAnswers.role_id,
              employeeAnswers.department_id,
              employeeAnswers.manager_id,
            ];
  
            connection.query(query, values, (err, result) => {
              if (err) {
                console.error('Error adding employee:', err);
              } else {
                console.log(`Employee ${employeeAnswers.first_name} ${employeeAnswers.last_name} added successfully!`);
              }
              callback(); // Return to the main menu
            });
          });
        });
  }

  function updateEmployeeRole(connection, managerChoices, callback) {
    // Create an array of choices for the user to select an employee to update
    // const employeeChoices = employees.map((employee) => ({
    //   name: `${employee.first_name} ${employee.last_name}`,
    //   value: employee.employee_id,
    // }));
  
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select an employee to update their role:',
          choices: managerChoices,
        },
        {
          type: 'input',
          name: 'new_role_id',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answers) => {
        // Update the employee's role in the database
        const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';
        const values = [answers.new_role_id, answers.employee_id];
  
        connection.query(query, values, (err, result) => {
          if (err) {
            console.error('Error updating employee role:', err);
          } else {
            console.log('Employee role updated successfully!');
          }
          callback();
        });
      });
  }
  
  function viewEmployeesByDepartment(connection, departmentId, callback) {
    // Query the database to retrieve employees in the specified department
    const query = `
    SELECT
      employees.employee_id,
      employees.first_name,
      employees.last_name,
      roles.job_title AS role_name,
      departments.department_name,
      CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.role_id
    LEFT JOIN departments ON employees.department_id = departments.department_id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id
    WHERE employees.department_id = ?
  `;
    const values = [departmentId];
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error retrieving employees by department:', err);
      } else {
        console.log(`Employees in the selected department:\n`);
        console.table(results);
      }
  
      // Invoke the provided callback function (e.g., start) to return to the main menu
      callback(connection);
    });
  }
  
  function getEmployees(connection, callback) {
    const query = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving employees:', err);
            callback([]);
        } else {
            // Extract the employee choices from the query results
            const employeeChoices = results.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.employee_id,
            }));
            callback(employeeChoices);
        }
    });
}


  function getManagers(connection, callback) {
    const query = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS manager_name FROM employees';
    // const query = 'SELECT CONCAT(first_name, " ", last_name) AS employee_name FROM employees';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving managers:', err);
        callback([]); // Return an empty array in case of an error
      } else {
        // Extract the manager choices from the query results
        const managerChoices = results.map((manager) => ({
          name: manager.manager_name,
          value: manager.employee_id,
        }));
        callback(managerChoices);
      }
    });
}
  
  module.exports = { viewAllEmployees, updateEmployeeRole, addEmployee, viewEmployeesByDepartment, getEmployees, getManagers };