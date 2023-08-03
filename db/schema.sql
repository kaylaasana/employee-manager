-- create database
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- access database
USE employee_db;

-- create table for departments
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    -- selecting the key of id to be accessible in other tables
    PRIMARY KEY (id)
);

-- create table for roles
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    PRIMARY KEY(id),
    department_id INT NOT NULL,
    -- accessing the id key in departments to be referenced in roles table
    FOREIGN KEY (department_id) 
    REFERENCES departments(department_id)
);

-- create table for employees
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id),
    manager_id  INT,
    FOREIGN KEY (id)
    REFERENCES roles(manager_id)
);