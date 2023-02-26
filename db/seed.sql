DROP TABLE IF EXISTS todo_table;

CREATE TABLE todo_table(
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    created DATE,
    due_date DATE
);

INSERT INTO todo_table (name, description, due_date)
VALUES 
('Store', 'Pick up milk', '1/2/3'),
('Homework','Calculus', '2/3/4');