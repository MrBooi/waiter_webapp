drop table if exists waiterDB, weekdays,shifts;

create table waiterDB(
id serial not null primary key,
username text not null,
full_name text not null,
position text not null
);

CREATE TABLE weekdays(
 id serial not null PRIMARY KEY ,
  dayName VARCHAR(20)
);

CREATE TABLE shifts(
id serial not NULL PRIMARY key,
waiter_id  int not null 
 foreign key (waiter_id) references waiterDB(id),
weekday_id int not null 
foreign key (weekday_id) references weekdays(id)
);


--  INSERT data into waiter
INSERT INTO waiterDB (username,full_name,position) VALUES ('Av','Aviwe boss','waiter');
INSERT INTO waiterDB (username,full_name,position) VALUES ('Mrsono','Luvuyo sono','waiter');
INSERT INTO waiterDB (username,full_name,position) VALUES ('Mrbooi','Ayabonga Booi','Admin');
-- INSERT WEEKDAYS
INSERT INTO weekdays (dayName) VALUES ('Sunday');
INSERT INTO weekdays (dayName) VALUES ('Monday');
INSERT INTO weekdays (dayName) VALUES ('Tuesday');
INSERT INTO weekdays (dayName) VALUES ('Wednesday');
INSERT INTO weekdays (dayName) VALUES ('Thursday');
INSERT INTO weekdays (dayName) VALUES ('Friday');
INSERT INTO weekdays (dayName) VALUES ('Saturday');


