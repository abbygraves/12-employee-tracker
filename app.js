//  WORK IN PROGRESS

const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const mysql = require('mysql2');


// MAIN MENU
const displayMenu = () => {
  console.log(`
  ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
  ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
  █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
  ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
  ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
  ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                      
       ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗         
       ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗        
          ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝        
          ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗        
          ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║        
          ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝                                      
  `)
  return inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'Welcome to Employee Tracker. What would you like to do?',
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
    switch (menuResponse.menu) {
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
      // case 'Exit Application':
      //   default:
      //   process.exit();
    }
  });
};

const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, results) => {
    console.table(results);
    displayMenu();
  });
};



displayMenu();