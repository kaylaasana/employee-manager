//import statements
const express = require('express')
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database`)
);

app.get('/api/departments', (req, res) => {
    
    db.query('SELECT * FROM departments', function(err, results) {
        if(err){
            console.log(err)
        }
        console.log(results)
        res.json(results)
    })    
});

app.get('/api/roles', (req, res) => {
    
    db.query('SELECT * FROM roles', function(err, results) {
        if(err){
            console.log(err)
        }
        console.log(results)
        res.json(results)
    })    
});

app.get('/api/employees', (req, res) => {
    
    db.query('SELECT * FROM employees', function(err, results) {
        if(err){
            console.log(err)
        }
        console.log(results)
        res.json(results)
    })    
});

//create inquirer questions
//switch statement

// const viewAllEmployees=()=>{
//     //query database
//     //display results
//     //return to main menu
// }
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