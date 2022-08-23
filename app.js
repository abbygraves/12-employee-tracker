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
  inquirer
  db.query(`INSERT INTO departments`, (err, rows) => {
    console.table(rows);
    displayMenu();
  });
};



displayMenu();