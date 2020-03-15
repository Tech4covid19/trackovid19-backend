--Current DB Tables:
--  user_status : list of all possible user status
--  user_symptoms : list of all possible symptoms
--  users : list of all users and their basic info
--  history : all historic of registered user health status
--  network : user network info (facebook_id, name, email, ..)
--  user_network : all user connections with his network

--Current DB Views:
--  latest_status : easily access any user current status
--  network_status : easily access current status of users in your network

--Useful Commands:
--\list : list all databases
--\d : list all tables & views
--\dt : list all tables
--\dv : list all views
--\d <table> : get <table> info
--\d <view> : get <view> info

--Possible Status For A Given User:
CREATE TABLE IF NOT EXISTS user_status (
    id serial,
    status varchar(30)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_status_id0 ON user_status (id);
DELETE FROM user_status;
INSERT INTO user_status(status) values('normal');
INSERT INTO user_status(status) values('self quarentine');
INSERT INTO user_status(status) values('quarentine');
INSERT INTO user_status(status) values('infected');
INSERT INTO user_status(status) values('recovered');
--DROP TABLE IF EXISTS user_status CASCADE;

--Possible Symptoms For A Given User:
CREATE TABLE IF NOT EXISTS user_symptoms (
    id serial,
    symptoms varchar(30)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_symptoms_id0 ON user_symptoms (id);
DELETE FROM user_symptoms;
INSERT INTO user_symptoms(symptoms) values('with symptoms');
INSERT INTO user_symptoms(symptoms) values('without symptoms');
--DROP TABLE IF EXISTS user_symptoms CASCADE;

--Table Users With All User Info:
CREATE TABLE IF NOT EXISTS users (
    id varchar(16) primary key,
    hash bytea,
    year integer,
    postalcode varchar(8),
    ip varchar(20),
    latitude numeric,
    longitude numeric,
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE UNIQUE INDEX IF NOT EXISTS users_id0 ON users (id);
--DROP TABLE IF EXISTS users CASCADE;

--Table History With The Whole User Health History:
CREATE TABLE IF NOT EXISTS history (
    id serial,
    user_id varchar(16) references users(id),
    status integer,
    symptoms integer,
    latitude numeric,
    longitude numeric,
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS history_id0 ON history (user_id, timestamp);
--DROP TABLE IF EXISTS history CASCADE;

--Table Network With The User Network Info:
CREATE TABLE IF NOT EXISTS network (
    id serial,
    user_id varchar(16),
    facebook_id varchar(16),
    name varchar(100),
    email varchar(100),
    url varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS network_id0 ON network (user_id);
CREATE INDEX IF NOT EXISTS network_id1 ON network (facebook_id);
--DROP TABLE IF EXISTS network CASCADE;

--Table Network With The Whole Users Network/Connections:
CREATE TABLE IF NOT EXISTS user_network (
    id serial,
    facebook_id varchar(16),
    met_with varchar(16),
    latitude numeric,
    longitude numeric,
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS user_network_id0 ON user_network (facebook_id);
CREATE INDEX IF NOT EXISTS user_network_id1 ON user_network (met_with);
--DROP TABLE IF EXISTS network CASCADE;

--View To Easily Get Latest User Health Status For Each User:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'latest_status') THEN
        CREATE VIEW latest_status AS
            SELECT a.user_id, a.status, a.symptoms, a.timestamp
            FROM history a WHERE NOT EXISTS (
                SELECT 1 FROM history b
                WHERE a.user_id = b.user_id
                  AND a.timestamp < b.timestamp);
    END IF;
END$$;
--DROP VIEW latest_status;

--Dummy Data For Test Proposes
DELETE FROM users where id in ('1','2','3');
DELETE FROM history where user_id in ('1','2','3');
DELETE FROM network where user_id in ('1','2','3');
INSERT INTO users(id, hash, year, postalcode, ip, info) values('1', '1', 1, '1000-100', null, null);
INSERT INTO users(id, hash, year, postalcode, ip, info) values('2', '2', 1, '1000-100', null, null);
INSERT INTO users(id, hash, year, postalcode, ip, info) values('3', '3', 1, '1000-100', null, null);
INSERT INTO network(user_id, facebook_id, name, email, url) values('1', '1', 'name1', 'email1@email.com', 'http://url1.com');
INSERT INTO network(user_id, facebook_id, name, email, url) values('2', '2', 'name2', 'email2@email.com', 'http://url2.com');
INSERT INTO network(user_id, facebook_id, name, email, url) values('3', '3', 'name3', 'email3@email.com', 'http://url3.com');
INSERT INTO history(user_id, status, symptoms) values('1', 'normal', False);
INSERT INTO history(user_id, status, symptoms) values('1', 'infected', True);
INSERT INTO history(user_id, status, symptoms) values('1', 'recovered', False);
INSERT INTO history(user_id, status, symptoms) values('2', 'normal', False);
INSERT INTO history(user_id, status, symptoms) values('2', 'infected', True);
INSERT INTO history(user_id, status, symptoms) values('3', 'normal', False);
INSERT INTO user_network(facebook_id, met_with) values('1', '2');
INSERT INTO user_network(facebook_id, met_with) values('1', '3');
INSERT INTO user_network(facebook_id, met_with) values('2', '1');
INSERT INTO user_network(facebook_id, met_with) values('2', '3');
INSERT INTO user_network(facebook_id, met_with) values('3', '1');
INSERT INTO user_network(facebook_id, met_with) values('3', '2');

--Get Current Status Count:
SELECT status, count(1) FROM latest_status GROUP BY status;

--Dummy Table With Column Type Examples
CREATE TABLE IF NOT EXISTS example (
    user_id varchar(16) references users(id),
    inteiro integer,
    numerico numeric,
    bytes bytea not null,
    texto varchar(16),
    list_of_3_ints integer[3],
    list_of_ints integer[],
    authorized bool default False,
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_timestamp int default extract(epoch from now())
);
--DROP TABLE IF EXISTS examples CASCADE;
