DROP TABLE IF EXISTS todo_table;

CREATE TABLE todo_table(
    id SERIAL PRIMARY KEY,
    name TEXT,
    title TEXT,
    modified DATE,
    start varchar(19),
    "end" varchar(19),
    start_time TEXT,
    end_time TEXT
);

INSERT INTO todo_table (name, title, start, "end", start_time,end_time)
VALUES 
('Store', 'Pick up milk', '2023-02-13T09:00:00','','08','13'),
('Homework','Calculus', '2023-02-27',null,'14',null),
('Project', 'React MVP', '2023-02-24T03:00:00','2023-02-28T14:00:00','08','13'),
('Home', 'Make dinner', '2023-02-15T03:00:00','','08','13'),
('Stuff', 'More stuff', '2023-02-28T03:00:00','','08','13');