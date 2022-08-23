//  WORK IN PROGRESS

const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const mysql = require('mysql2');
const { promise } = require("./db/connection");


// MAIN MENU
const displayMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        new inquirer.Separator(),
        'Exit Application',
        new inquirer.Separator(),
      ]
    }
  ]).then(menuResponse => {
    switch (menuResponse.mainMenu) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee Role':
        updateEmployee();
        break;
      case 'Exit Application':
        console.log('Goodbye!')
      default:
        process.exit();
      // default:
      // console.log("heyyyyyy", menuResponse)
    }
  });
};

const viewDepartments = () => {
  db.query(`SELECT * FROM departments`, (err, rows) => {
    console.table(rows);
    displayMenu();
  });
};

const viewRoles = () => {
  db.query(
    `SELECT roles.id, roles.title, departments.name AS department, roles.salary
      FROM roles 
      LEFT JOIN departments
      ON roles.department_id=departments.id`,
    (err, rows) => {
      console.table(rows);
      displayMenu();
    }
  );
};

const viewEmployees = () => {
  db.query(
    `SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title AS role,
      r.salary AS salary,
      d.name AS department,
      CONCAT (m.first_name, " " ,m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles r
      ON e.role_id = r.id
      LEFT JOIN departments d
      ON r.department_id = d.id
      LEFT JOIN employees m
      ON e.manager_id = m.id`,
    (err, results) => {
      console.table(results);
      displayMenu();
    }
  );
};

const addDepartment = () => {
  inquirer.prompt(
    [{
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
      validate: (name) => {
        if (name) {
          return true;
        } else {
          console.log("You must enter a name for the department!");
          return false;
        }
      }
    }]
  )
    .then((newDepartment) => {
      db.query(
        `INSERT INTO departments (name) VALUES (?)`,
        newDepartment.name,
        (err, rows) => {
          console.log('Success! The department has been added to database!');
          displayMenu();
        }
      );
    })
};


const addRole = () => {
  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?',
        validate: (title) => {
          if (title) {
            return true;
          } else {
            console.log("You must enter a name for the role!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for the role?',
        validate: (salary) => {
          if (salary) {
            return true;
          } else {
            console.log("You must enter a salary for the role!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'department',
        message: "Enter the ID of the department the role belongs to.",
        validate: (department) => {
          if (department) {
            return true;
          } else {
            console.log("You must enter a department ID for the role!");
            return false;
          }
        }
      },
    ]
  )
    .then((newRole) => {
      db.query(
        `INSERT INTO roles SET ?`,
        {
          title: newRole.title,
          salary: newRole.salary,
          department_id: newRole.department,
        },
        (err, rows) => {
          console.log('Success! The role has been added to database.');
          displayMenu();
        }
      );
    })
};



const addEmployee = () => {
  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("You must enter a first name for the employee!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: (lastName) => {
          if (lastName) {
            return true;
          } else {
            console.log("You must enter a last name for the employee!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'role',
        message: "Enter the ID of the employee's role",
        validate: (role) => {
          if (role) {
            return true;
          } else {
            console.log("You must enter a role ID for the employee!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'manager',
        message: "Enter the ID of the employee's manager. If this does not apply please press enter.",
        validate: (manager) => {
          if (manager) {
            return true;
          } else {
            console.log("You must enter a manager ID for the employee!");
            return false;
          }
        }
      },
    ]
  )
    .then((newEmployee) => {
      db.query(
        `INSERT INTO employees SET ?`,
        {
          first_name: newEmployee.firstName,
          last_name: newEmployee.lastName,
          role_id: newEmployee.role,
          manager_id: newEmployee.manager
        },
        (err, rows) => {
          console.log('Success! The employee has been added to database.');
          displayMenu();
        }
      );
    })
};





displayMenu();