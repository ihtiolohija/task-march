# task-march
Prerequisites:
- install node, install sqlite3
- create sqlite3 database (test-task.db is used) with the following command: sqlite3 test-task.db
- create 3 tables by running the following commands:
  * `create table affiliate(id integer primary key autoincrement, word varchar(200) not null, score varchar(200) not null, tags varchar(200) not null);`
  * `create table marketing(id integer primary key autoincrement, word varchar(200) not null, score varchar(200) not null, tags varchar(200) not null);`
  * `create table influencer(id integer primary key autoincrement, word varchar(200) not null, score varchar(200) not null, tags varchar(200) not null);`
- make sure sqlite3 process is running (start process by typing sqlite3 in the command line)
- run npm install
- npm start to run application
