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
      // console.log("!!!!!!", menuResponse)
    }
  });
};


// MENU FUNCTIONALITY
// COMPLETE
const viewDepartments = () => {
  db.query(`SELECT * FROM departments`,
    (err, rows) => {
      if (err) {
        throw err;
      }
      console.table(rows);
      displayMenu();
    }
  );
};

// ==============================================================================
// COMPLETE
const viewRoles = () => {
  db.query(
    `SELECT roles.id, roles.title, departments.dept_name AS department, roles.salary
      FROM roles 
      LEFT JOIN departments
      ON roles.department_id=departments.id`,
    (err, rows) => {
      if (err) {
        throw err;
      }
      console.table(rows);
      displayMenu();
    }
  );
};

// ==============================================================================
// COMPLETE
const viewEmployees = () => {
  db.query(
    `SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title AS role,
      r.salary AS salary,
      d.dept_name AS department,
      CONCAT (m.first_name, " " ,m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles r
      ON e.role_id = r.id
      LEFT JOIN departments d
      ON r.department_id = d.id
      LEFT JOIN employees m
      ON e.manager_id = m.id`,
    (err, results) => {
      if (err) {
        throw err;
      }
      console.table(results);
      displayMenu();
    }
  );
};

// ==============================================================================
// COMPLETE
const addDepartment = () => {
  inquirer.prompt(
    [{
      type: 'input',
      name: 'dept_name',
      message: 'What is the name of the department?',
      validate: (dept_name) => {
        if (dept_name) {
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
        `INSERT INTO departments (dept_name) VALUES (?)`,
        newDepartment.dept_name,
        (err, rows) => {
          if (err) {
            throw err;
          }
          console.log('Success! The department has been added to database!');
          displayMenu();
        }
      );
    })
};

// ==============================================================================
// COMPLETE
const addRole = () => {
  db.query("SELECT * FROM departments", function (err, rows) {
    if (err) {
      throw err;
    }
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
        // USER MUST INPUT DEPARTMENT ID
        // {
        //   type: 'input',
        //   name: 'department',
        //   message: "Enter the ID of the department the role belongs to.",
        //   validate: (department) => {
        //     if (department) {
        //       return true;
        //     } else {
        //       console.log("You must enter a department ID for the role!");
        //       return false;
        //     }
        //   }
        // },
        {
          // USER CAN SELECT A DEPEARTMEMT FROM A LIST
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: function () {
            // loop through department table to generate list of department names as choices
            const departmentChoices = [];
            for (let i = 0; i < rows.length; i++) {
              departmentChoices.push(rows[i].dept_name);
            }
            return departmentChoices;
          }
        }
      ]
    )
      .then((newRole) => {
        let departmentSelection;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].dept_name == newRole.department) {
            departmentSelection = rows[i].id;
          }
        }
        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: newRole.title,
            salary: newRole.salary,
            department_id: departmentSelection
          },
          (err, rows) => {
            if (err) {
              throw err;
            }
            console.log('Success! The role has been added to database.');
            displayMenu();
          }
        );
      })
  });
}

// ==============================================================================
// COMPLETE
const addEmployee = () => {
  db.query("SELECT * FROM roles", function (err, rows) {
    if (err) {
      throw err;
    }
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
        // USER MUST INPUT ROLE ID
        // {
        //   type: 'input',
        //   name: 'role',
        //   message: "Enter the ID of the employee's role",
        //   validate: (role) => {
        //     if (role) {
        //       return true;
        //     } else {
        //       console.log("You must enter a role ID for the employee!");
        //       return false;
        //     }
        //   }
        // },
        {
          // USER CAN SELECT A ROLE FROM A LIST
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: function () {
            const roleChoices = [];
            for (let i = 0; i < rows.length; i++) {
              roleChoices.push(rows[i].title);
            }
            return roleChoices;
          }
        },
        {
          type: 'input',
          name: 'manager',
          message: "Enter the ID of the employee's manager.",
          // validate: (manager) => {
          //   if (manager) {
          //     return true;
          //   } else {
          //     console.log("You must enter a manager ID for the employee!");
          //     return false;
          //   }
          // }
        }
      ]
    )
      .then((newEmployee) => {
        let roleSelection;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].title == newEmployee.role) {
            roleSelection = rows[i].id;
          }
        }
        db.query(
          `INSERT INTO employees SET ?`,
          {
            first_name: newEmployee.firstName,
            last_name: newEmployee.lastName,
            role_id: roleSelection,
            manager_id: newEmployee.manager
          },
          (err, rows) => {
            if (err) {
              throw err;
            }
            console.log('Success! The employee has been added to database.');
            displayMenu();
          }
        );
      })
  });
};

  // ==============================================================================
  // FIX: MAKE ROLES APPEAR AS A LIST OF CHOICES 
  const updateEmployee = () => {
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'employee',
          message: "Enter the ID of the employee you would like to update.",
          validate: (employee) => {
            if (employee) {
              return true;
            } else {
              console.log("You must enter an employee ID!");
              return false;
            }
          }
        },
        {
          type: 'input',
          name: 'role',
          message: "Enter the ID of the employee's new role.",
          validate: (role) => {
            if (role) {
              return true;
            } else {
              console.log("You must enter the new role ID for the employee!");
              return false;
            }
          }
        },
      ]
    )
      .then((updatedEmployeeInfo) => {
        db.query(
          `UPDATE employees SET ? WHERE ?`,
          [{
            role_id: updatedEmployeeInfo.role
          },
          {
            id: updatedEmployeeInfo.employee
          }],
          (err, rows) => {
            if (err) {
              throw err;
            }
            console.log('Success! The employee has been added to database.');
            displayMenu();
          }
        );
      })
  };



  displayMenu();