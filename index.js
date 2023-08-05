//import statements
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employees_db database`)
);

// questions to prompt the user for actions they can take
const questions = [
  {
    type: "list",
    message: "What would you like to view?",
    name: "action",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role"
    ],
  },
];

// initiate the inquirer prompt questions
function init() {
  inquirer.prompt(questions).then((response) => {
    switch (response.action) {
      case "View all departments":
        viewDepartments();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a department":
        addDept();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmpRole();
        break;
    }
  });
}

// display the departments as a table
function viewDepartments() {
  db.query("SELECT * FROM departments", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.table(results);
    init();
  });
}

// display roles as a table
function viewRoles() {
  db.query(
    "SELECT roles.title, roles.id, departments.name FROM (departments INNER JOIN roles ON roles.department_id = departments.id)",
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
      init();
    }
  );
}

// display employees as a table
function viewEmployees() {
  db.query(
    "SELECT * FROM ((departments INNER JOIN roles ON roles.department_id = departments.id) INNER JOIN employees ON employees.role_id = roles.id)",
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
      init();
    }
  );
}

// add new department
function addDept() {
  const deptQuestions = [
    {
      type: "input",
      message: "What is the name of the new Department?",
      name: "newDeptName",
    },
  ];

  inquirer.prompt(deptQuestions).then((response) => {
    db.query(
      "INSERT INTO departments (name) VALUES (?)",
      response.newDeptName,
      function (err, results) {
        if (err) {
          console.log(err);
        }
        console.log("New department added");
        init();
      }
    );
  });
}

// add new role
function addRole() {
  db.query("SELECT * FROM departments", function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    const depts = results.map((depts) => ({
      name: depts.name,
      value: depts.id,
    }));

    const roleQuestions = [
      {
        type: "input",
        message: "What role would you like to add?",
        name: "newRoleName",
      },
      {
        type: "input",
        message: "What is the salary for this new position?",
        name: "newSalary",
      },
      {
        type: "list",
        message: "What department is this new role a part of?",
        name: "departmentId",
        choices: depts.map((depts) => depts.name),
      },
    ];

    inquirer.prompt(roleQuestions).then((response) => {
      const departmentId = depts.find(
        (depts) => depts.name === response.departmentId
      ).value;
      db.query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [response.newRoleName, response.newSalary, departmentId],
        function (err) {
          if (err) {
            console.log(err);
          }
          console.log("New role added");
          init();
        }
      );
    });
  });
}

// add new employee
function addEmployee() {
  db.query("SELECT * FROM departments", function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    const depts = results.map((dept) => dept.name);

    db.query("SELECT * FROM roles", function (err, results) {
      if (err) {
        console.log(err);
        return;
      }
      const roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      db.query("SELECT * FROM employees", function (err, results) {
        if (err) {
          console.log(err);
          return;
        }
        const employees = results.map((emp) => ({
          name: emp.first_name + " " + emp.last_name,
          value: emp.id,
        }));

        const employeeQuestions = [
          {
            type: "input",
            message: "What is the first name of the new employee?",
            name: "empFirstName",
          },
          {
            type: "input",
            message: "What is the last name of the new employee?",
            name: "empLastName",
          },
          {
            type: "list",
            message: "What department is the new employee part of?",
            name: "departmentId",
            choices: depts,
          },
          {
            type: "list",
            message: "What role is this new employee taking?",
            name: "roleID",
            choices: roles,
          },
          {
            type: "list",
            message: "Who is the manager of the new employee?",
            name: "managerID",
            choices: employees,
          },
        ];

        inquirer.prompt(employeeQuestions).then((response) => {
          const managerIdValue = response.managerID;

          db.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [
              response.empFirstName,
              response.empLastName,
              response.roleID,
              managerIdValue,
            ],
            function (err) {
              if (err) {
                console.log(err);
              }
              console.log("New employee added");
              init();
            }
          );
        });
      });
    });
  });
}

// update employee role
function updateEmpRole() {
  
    db.query("SELECT * FROM roles", function (err, results) {
      if (err) {
        console.log(err);
        return;
      }
      const roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      db.query("SELECT * FROM employees", function (err, results) {
        if (err) {
          console.log(err);
          return;
        }
        const employees = results.map((emp) => ({
          name: emp.first_name + " " + emp.last_name,
          value: emp.id,
        }));

        const updateQuestions = [
          {
            type: "list",
            message: "Who is the employee that will be updated?",
            name: "employeeID",
            choices: employees,
          },
          {
            type: "list",
            message: "What role is this changing employee to?",
            name: "roleID",
            choices: roles,
          },
        ];

        inquirer.prompt(updateQuestions).then((response) => {
         
          db.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
          [response.roleID, response.employeeID],
            function (err) {
              if (err) {
                console.log(err);
              }
              console.log("Employee updated");
              init();
            }
          );
        });
      });
    });
}

init();