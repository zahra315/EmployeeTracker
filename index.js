const inquirer = require("inquirer");
const mysql = requirer("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "zahra",
  database: "employeeTrakerDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  start();
});
