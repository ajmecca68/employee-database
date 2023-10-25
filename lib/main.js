const inquirer = require('inquirer');
const {
  viewAllEmployees,
  addEmployee,
  updateEmployeeRole,
  viewEmployeesByDepartment,
  getEmployees, getManagers
} = require('./employee');
const { viewAllRoles, addRole, getRoles } = require('./roles'); // Import getRoles function
const { viewAllDepartments, addDepartment } = require('./department');

function start(connection, departmentChoices) {
  console.log('EMPLOYEE MANAGER\n');

  // Query the database to get the list of departments
  connection.query(
    'SELECT department_id, department_name FROM departments',
    (err, results) => {
      if (err) {
        console.error('Error retrieving departments:', err);
        return;
      }

      // Extract the department choices from the query results
      departmentChoices = results.map((department) => ({
        name: department.department_name,
        value: department.department_id,
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              'View All Employees',
              'View Employees by Department',
              'Add Employee',
              'Update Employee Role',
              'View All Roles',
              'Add Role',
              'View All Departments',
              'Add Department',
              'Exit',
            ],
          },
        ])
        .then((answers) => {
          switch (answers.action) {
            case 'View All Employees':
              viewAllEmployees(connection, () => start(connection, departmentChoices));
              break;
            case 'View Employees by Department':
              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select a department to view employees:',
                    choices: departmentChoices,
                  },
                ])
                .then((departmentAnswers) => {
                  viewEmployeesByDepartment(
                    connection,
                    departmentAnswers.department_id,
                    () => start(connection, departmentChoices)
                  );
                });
              break;
              case 'Add Employee':
                getRoles(connection, (roleChoices) => {
                  getManagers(connection, (managerChoices) => { // Pass managerChoices here
                    addEmployee(connection, departmentChoices, roleChoices, managerChoices, () =>
                      start(connection, departmentChoices)
                    );
                  });
                });
                break;
                case 'Update Employee Role':
                    getManagers(connection, (managerChoices) => {
                      updateEmployeeRole(connection, managerChoices, () =>
                        start(connection, departmentChoices)
                      );
                    });
                    break;
                  
            case 'View All Roles':
              viewAllRoles(connection, () => start(connection, departmentChoices));
              break;
            case 'Add Role':
              addRole(connection, departmentChoices, () => start(connection, departmentChoices));
              break;
            case 'View All Departments':
              viewAllDepartments(connection, () => start(connection, departmentChoices));
              break;
            case 'Add Department':
              addDepartment(connection, () => start(connection, departmentChoices));
              break;
            case 'Exit':
              connection.end();
              console.log('Goodbye!');
              break;
          }
        });
    }
  );
}

module.exports = { start };
