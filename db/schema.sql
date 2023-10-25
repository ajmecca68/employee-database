-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_db;

-- Use the database
USE employee_db;

-- Create the departments table
CREATE TABLE IF NOT EXISTS departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL UNIQUE
);

-- Insert departments
INSERT INTO departments (department_name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(255) NOT NULL UNIQUE,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Insert roles
INSERT INTO roles (job_title, salary, department_id) VALUES
('Sales Lead', 75000.00, 4),
('Salesperson', 50000.00, 4),
('Lead Engineer', 95000.00, 1),
('Account Manager', 75000.00, 3),
('Software Engineer', 80000.00, 1),
('Accountant', 65000.00, 2),
('Legal Team Lead', 85000.00, 3),
('Lawyer', 90000.00, 3);

CREATE TABLE IF NOT EXISTS employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT,
  department_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);
