
-- Department seeds --
INSERT INTO department(department_name)
VALUES ('Management'), ('Finance'), ('Engineering'), ('Sales');


-- Role seeds --
INSERT INTO role(title, salary, department_id)
VALUES ('Regional Manager', 120000, 1),
('Accountant', 95000,2),
('Software Engineer', 100000, 3),
('Lead Enginee', 140000, 3),
('Salesperson', 75000, 4),
('Sales Lead', 100000, 4);


-- Employee seeds --
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Jim', 'Hudson', 1, null),
('Chris', 'Patric', 1, 2),
('Tom', 'Cole', 3, null),
('Sofi', 'Chaz', 4, 1),
('Martin', 'Beesly', 3, null),
('Jason', 'Dant', 4, 1),
("Mia","Lam", 3, 1);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;