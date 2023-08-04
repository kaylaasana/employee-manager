//import statements
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the employees_db database`)
);

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
      ]
    }
  ];

function init(){
    inquirer.prompt(questions)
    .then(response => {
        switch(response.action){
            case "View all departments":
                viewDepartments()
                break;
            case "View all roles":
                viewRoles()
                break;
            case "View all employees":
                viewEmployees() 
                break;
            case "Add a department":
                addDept()
                break;
            case "Add a role":
                addRole()
                break;
            case "Add an employee":
                addEmployee()
                break;
            case "Update an employee role":
                updateEmpRole()
                break;
        }
    })
}

function viewDepartments() {

    db.query('SELECT * FROM departments', function(err, results) {
        if(err){
            console.log(err)
        }
        console.table(results)
        init()
    })
}

function viewRoles() {

    db.query('SELECT roles.title, roles.id, departments.name FROM (departments INNER JOIN roles ON roles.department_id = departments.id)', function(err, results) {
        if(err){
            console.log(err)
        }
        console.table(results)
        init()
    })
}

function viewEmployees() {

    db.query('SELECT * FROM ((departments INNER JOIN roles ON roles.department_id = departments.id) INNER JOIN employees ON employees.role_id = roles.id)', function(err, results) {
        if(err){
            console.log(err)
        }
        console.table(results)
        init()
    })
}



function addDept() {
    const deptQuestions = [
        {
            type: 'input',
            message: 'What is the name of the new Department?',
            name: 'newDeptName'
        }
    ]

    inquirer.prompt(deptQuestions)
    .then(response => {
        db.query('INSERT INTO departments (name) VALUES (?)', response.newDeptName, function(err, results) {
        if(err){
            console.log(err)
        }
        console.log('New department added')
        init()
    })
    })

    
}


function addRole() {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        const depts = results.map((depts) => ({ name: depts.name, value: depts.id }));

        const roleQuestions = [
            {
                type: 'input',
                message: 'What role would you like to add?',
                name: 'newRoleName'
            },
            {
                type: 'input',
                message: 'What is the salary for this new position?',
                name: 'newSalary'
            },
            {
                type: 'list',
                message: 'What department is this new role a part of',
                name: 'departmentId',
                choices: depts.map((depts) => depts.name)
            }
        ];

        inquirer.prompt(roleQuestions)
        .then((response) => {
            const departmentId = depts.find((depts) => depts.name === response.departmentId).value;
            db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [response.newRoleName, response.newSalary, departmentId], function(err) {
                if(err){
                    console.log(err)
                }
                console.log('New department added')
                init()
        })
    });
})}

//     const addNewEmployee = () ={
// }

// const addNewRole=()=>{
//     //add the name of the role
//     //ask the salary
//     //query departments
//         //ask department with list of choices
//         //write new data to db
//     //return confirmation message
//     //return to main menu
// }
init()
