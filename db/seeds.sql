-- adding keys to departments table
INSERT INTO departments (name)
VALUES ("Research"),
       ("Cheese"),
       ("Software"),
       ("Cows"),
       ("Sleep")

-- adding keys to roles table
INSERT INTO roles (title, salary, department_id)
VALUES ("Head of Cheese", 100000, 2),
       ("Top Cow", 150000, 4),
       ("Research Assistant", 200000, 1),
       ("Nap Taker", 1000000, 5),
       ("Developer", 100000000, 3),
       ("Intern", 10000000000, 1)
       ("Cheese Taster", 10000000000000, 2)

-- adding keys to employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Sef", 1, null),
       ("Tina", "Belcher", 2, null),
       ("Jose", "Calderone", 3, null),
       ("Michael", "Jordan", 5, null),
       ("Fred", "Flinstone", 4, null),
       ("Pooh", "Bear", 7, 1),
       ("Karen", "Smith", 6, 3),
       ("Sasha", "Braus", 7, 1),
       ("Barb", "Ra", 6, 3),