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
  password: "zahra",
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

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee First Name: ",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee Last Name: ",
      },
      {
        type: "list",
        name: "role",
        message: "Enter the employee Role: ",
        choices: role(),
      },
      {
        type: "list",
        name: "manager",
        message: "Enter managers Name: ",
        choices: manager(),
      },
    ])
    .then((response) => {
      connection.query(
        `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                (SELECT id FROM role WHERE title = ? ), 
                (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS temptable))`,
        [response.firstName, response.lastName, response.role, response.manager]
      );
      start();
    });
};

const listOfRole = [];
const role = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      listOfRole.push(res[i].title);
    }
  });
  return listOfRole;
};

const listOfManagers = [];
const manager = () => {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        listOfManagers.push(res[i].first_name);
      }
    }
  );
  return listOfManagers;
};

const addRole = () => {
  connection.query(
    "SELECT role.title AS Title, role.salary AS Salary FROM role",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the Role Title?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the Salary?",
          },
        ])
        .then((res) => {
          connection.query(
            `INSERT INTO role(role.title,role.salary) VALUES (?,?)`,
            [res.title, res.salary]
          );
          start();
        });
    }
  );
};

const addDepartment = () => {
  connection.query(
    `SELECT department_name AS 'Department' FROM department`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "department",
            message: "What Department would you like to add?",
          },
        ])
        .then((res) => {
          connection.query(
            `INSERT INTO department(department_name) VALUES(?)`,
            [res.department]
          );
          start();
        });
    }
  );
};

const updateEmployeeRole = () => {
  connection.query(
    "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id",
    (err, res) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            name: "emLastName",
            message: "What is the Employee's last name? ",
            choices: function () {
              let lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
          },
          {
            type: "list",
            name: "newRole",
            message: "What is the Employees new title? ",
            choices: role(),
          },
        ])
        .then((res) => {
          connection.query(
            `UPDATE employee 
            SET role_id = (SELECT id FROM role WHERE title = ? ) 
            WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE last_name = ?) AS temptable)`,
            [res.newRole, res.emLastName],
            (err, res) => {
              if (err) throw err;
              start();
            }
          );
        });
    }
  );
};
