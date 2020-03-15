--Current DB Tables:
--  users : list of all users and their basic info
--  history : all historic of registered user health status
--  network : all user networks with other users

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

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustype') THEN
        CREATE TYPE statustype as ENUM ('infected', 'recovered', 'normal', 'quarentine');
        ALTER TYPE statustype ADD VALUE 'self quarentine';
    END IF;
END$$;
--DROP TYPE IF EXISTS statustype CASCADE;

--Table Users With All User Info:
CREATE TABLE IF NOT EXISTS users (
    id varchar(16) primary key,
    hash bytea,
    age integer,
    city varchar(20),
    ip varchar(20),
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS users_id0 ON users (id);
--DROP TABLE IF EXISTS users CASCADE;

--Table History With The Whole User Health History:
CREATE TABLE IF NOT EXISTS history (
    user_id varchar(16) references users(id),
    status statustype,
    symptoms bool,
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS history_id0 ON history (user_id, timestamp);
--DROP TABLE IF EXISTS history CASCADE;

--Table Network With The Whole Users Network/Connections:
CREATE TABLE IF NOT EXISTS network (
    user_id varchar(16) references users(id),
    met_with varchar(16) references users(id),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS network_id0 ON network (user_id);
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

--View To Easily Get Latest Network Health Status For Each User:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'network_status') THEN
        CREATE VIEW network_status AS
            SELECT b.user_id, b.met_with, c.status, c.symptoms, c.timestamp
            FROM users a
            INNER JOIN network b ON a.id = b.user_id
            INNER JOIN latest_status c ON b.met_with = c.user_id;
    END IF;
END$$;
--DROP VIEW network_status;

--Dummy Data For Test Proposes
DELETE FROM users where id in ('1','2','3');
DELETE FROM history where user_id in ('1','2','3');
DELETE FROM network where user_id in ('1','2','3');
INSERT INTO users(id, hash, age, city, ip, info) values('1', '1', 1, 'Lisboa', null, null);
INSERT INTO users(id, hash, age, city, ip, info) values('2', '2', 1, 'Lisboa', null, null);
INSERT INTO users(id, hash, age, city, ip, info) values('3', '3', 1, 'Lisboa', null, null);
INSERT INTO history(user_id, status, symptoms) values('1', 'normal', False);
INSERT INTO history(user_id, status, symptoms) values('1', 'infected', True);
INSERT INTO history(user_id, status, symptoms) values('1', 'recovered', False);
INSERT INTO history(user_id, status, symptoms) values('2', 'normal', False);
INSERT INTO history(user_id, status, symptoms) values('2', 'infected', True);
INSERT INTO history(user_id, status, symptoms) values('3', 'normal', False);
INSERT INTO network(user_id, met_with) values('1', '2');
INSERT INTO network(user_id, met_with) values('1', '3');
INSERT INTO network(user_id, met_with) values('2', '1');
INSERT INTO network(user_id, met_with) values('2', '3');
INSERT INTO network(user_id, met_with) values('3', '1');
INSERT INTO network(user_id, met_with) values('3', '2');

--Get Current Status Count:
SELECT status, count(1) FROM latest_status GROUP BY status;

--Get Current Network Status Count For User '1':
SELECT status, count(1) FROM network_status WHERE user_id='1' GROUP BY status;

--Dummy Table With Column Type Examples
CREATE TABLE IF NOT EXISTS example (
    user_id varchar(16) references users(id),
    inteiro integer,
    numerico numeric,
    bytes bytea not null,
    status statustype,
    texto varchar(16),
    list_of_3_ints integer[3],
    list_of_ints integer[],
    authorized bool default False,
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_timestamp int default extract(epoch from now())
);
--DROP TABLE IF EXISTS examples CASCADE;
