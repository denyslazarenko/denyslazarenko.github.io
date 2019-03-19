---
title: How to configure PostgreSQL
layout: post
use_toc: true
excerpt: Here is a brief summary of how I configured PostgreSQL database.
---

#### How to compile TPC-H dataset 
- http://myfpgablog.blogspot.com/2016/08/tpc-h-queries-on-postgresql.html

As the default configuration of Postgres is, a user called postgres is made on and the user postgres has full 
superadmin access to entire PostgreSQL instance running on your OS.   
```sudo -u postgres psql```
#### Creating user
```sudo -u postgres createuser <username>```
#### Creating Database
```sudo -u postgres createdb <dbname>```
#### Giving the user a password
```sudo -u postgres psql
psql=# alter user <username> with encrypted password '<password>';
```
#### Granting privileges on database
```psql=# grant all privileges on database <dbname> to <username> ;```

#### Postgres login commands
- If you are logged into the same computer that Postgres is running on you can use the following psql login command, specifying the database (mydb) and username (myuser):
```psql -d mydb -U myuser```
- If you need to log into a Postgres database on a server named myhost, you can use this Postgres login command:
```psql -h myhost -d mydb -U myuser -W``` (when u were not asked password -W explicitly call for psw)
- The previous example doest work because we are trying to login not through tcp protocol rather through system one, this way we explicitly tell that we want tcp and it will promt to us the login form
```psql -d tpch -h localhost -U denys```
- This command can be helpful to determine the actual port:
```sudo netstat -plunt |grep postgres```
#### Make different ussers login through linux system 
```SET ROLE```
#### List Postgesql databases
```\l```
#### List database users
```\du```
#### Execute sql from file 
```\i datasets/sql/postgres_load.sql```
#### Analize table 
```\d+ orders```
#### Configure config file
```/etc/postgresql/9.5/main/postgresql.conf```   
- https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server   
![image](https://user-images.githubusercontent.com/13698885/50280473-ed7e1700-044c-11e9-9c31-c8fa6de27dee.png)   
**Work_mem**- this parameter specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. If a lot of complex sorts are happening, and you have enough memory, then increasing the work_mem parameter allows PostgreSQL to do larger in-memory sorts which will be faster than disk based equivalents.
#### Restart postgres service
```sudo service postgresql restart```

