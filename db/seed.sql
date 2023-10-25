-- Insert sample departments
INSERT IGNORE INTO departments (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

-- Insert sample roles
INSERT IGNORE INTO roles (job_title, salary, department_id)
VALUES
    ('Sales Lead', 60000, 1),
    ('Salesperson', 40000, 1),
    ('Lead Engineer', 70000, 2),
    ('Software Engineer', 60000, 2),
    ('Accountant', 50000, 3),
    ('Legal Team Lead', 75000, 4),
    ('Lawyer', 80000, 4);

-- Insert sample employees
INSERT IGNORE INTO employees (first_name, last_name, role_id, manager_id, department_id)
VALUES
    ('John', 'Doe', 1, NULL, 1),
    ('Jane', 'Smith', 2, 1, 1),
    ('Bob', 'Johnson', 3, NULL, 2),
    ('Alice', 'Williams', 4, 3, 2),
    ('Charlie', 'Brown', 5, NULL, 3),
    ('Ella', 'Davis', 6, 5, 4),
    ('Frank', 'Wilson', 7, NULL, 4);
