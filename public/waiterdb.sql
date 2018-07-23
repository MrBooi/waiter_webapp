drop table if exists waiterDB, availableDays  ;

create table waiterDB(
id serial not null primary key,
username text not null,
full_name text not null,
position text not null
);

CREATE TABLE Wednesdays(
 id serial not null PRIMARY KEY ,
  dayName VARCHAR(20)
);

CREATE TABLE shifts(
id serial not NULL PRIMARY key,
waiter_id  int not null 
 foreign key (waiter_id) references waiterDB(id),
weekday_id int not null 
foreign key (weekday_id) references Wednesdays(id)
);



--  INSERT data into waiter
INSERT INTO waiterDB (username,full_name,position) VALUES ('Av','Aviwe boss','waiter');
INSERT INTO waiterDB (username,full_name,position) VALUES ('Mrsono','Luvuyo sono','waiter');
INSERT INTO waiterDB (username,full_name,position) VALUES ('Mrbooi','Ayabonga Booi','Admin');
-- seleting shift days




-- INSERT into waiters 
