DROP TABLE IF EXISTS todo_table;

CREATE TABLE todo_table(
    id SERIAL PRIMARY KEY,
    name TEXT,
    title TEXT,
    created DATE,
    start varchar(19),
    "end" varchar(19),
    start_time TEXT,
    end_time TEXT,
    selectable BOOLEAN
);

INSERT INTO todo_table (name, title, start, "end", start_time,end_time,selectable)
VALUES 
('Store', 'Pick up milk', '2023-02-26T03:00:00','2023-02-27T14:00:00','08','13',true),
('Homework','Calculus', '2023-02-27',null,'14',null,true);