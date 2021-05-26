const inquirer = require("inquirer");
const mysql = require("mysql");

const allEmployeeQuery =
  "SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

const roleQuery =
  "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;";

const departmentQuery =
  "SELECT employee.first_name, employee.last_name, department_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeTrackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  start();
});

const start = () => {
  inquirer
    .prompt({
      type: "list",
      name: "choices",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by role",
        "View all employees by department",
        // "View all employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        // "Update employee manager",
        // "Delete employee",
        // "Delete role",
        // "Delete department",
        // "View department budgets",
      ],
    })
    .then((response) => {
      switch (response.choices) {
        case "View all employees":
          viewAllEmployee();
          break;
        case "View all employees by role":
          viewAllEmployeeByRole();
          break;
        case "View all employees by department":
          viewAllEmployeeByDepartment();
          break;
        // "View all employees by manager",
        case "Add employee":
          addEmployee();
          break;
        case "Add role":
          addRole();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        // "Update employee manager",
        // "Delete employee",
        // "Delete role",
        // "Delete department",
        // "View department budgets",
      }
    });
};

const viewAllEmployee = () => {
  connection.query(allEmployeeQuery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllEmployeeByRole = () => {
  connection.query(roleQuery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};
const viewAllEmployeeByDepartment = () => {
  connection.query(departmentQuery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

// const addEmployee = () => {};
// const addRole = () => {};
// const addDepartment = () => {};
// const updateEmployeeRole = () => {};
