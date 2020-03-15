CREATE TYPE statustype as ENUM ('infected', 'recovered', 'normal');
ALTER TYPE statustype ADD VALUE 'quarentine';
--DROP TYPE IF EXISTS statustype CASCADE;

CREATE TABLE users (
    id varchar(16) primary key,
    hash bytea,
    age integer,
    city varchar(20),
    ip varchar(20),
    info varchar(500),
    timestamp int default extract(epoch from now())
);
CREATE UNIQUE INDEX users_id0 ON users (id);
--DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE history (
    user_id varchar(16) references users(id),
    status statustype,
    symptoms bool,
    timestamp int default extract(epoch from now())
);
CREATE INDEX history_id0 ON history (user_id, timestamp);
--DROP TABLE IF EXISTS history CASCADE;

CREATE TABLE network (
    user_id varchar(16) references users(id),
    met_with varchar(16) references users(id),
    timestamp int default extract(epoch from now())
);
CREATE INDEX network_id0 ON network (user_id);
--DROP TABLE IF EXISTS network CASCADE;

CREATE VIEW latest_status AS
    SELECT a.user_id, a.status, a.symptoms, a.timestamp
    FROM history a WHERE NOT EXISTS (
        SELECT 1 FROM history b
        WHERE a.user_id = b.user_id
          AND a.timestamp < b.timestamp);

CREATE VIEW network_status AS
    SELECT b.user_id, b.met_with, c.status, c.symptoms, c.timestamp
    FROM users a
    INNER JOIN network b ON a.id = b.user_id
    INNER JOIN latest_status c ON b.met_with = c.user_id;

--DUMMY DATA
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

--QUERY EXAMPLES
SELECT status, count(1) FROM latest_status GROUP BY status;
SELECT status, count(1) FROM network_status WHERE user_id='1' GROUP BY status;

--CREATE TABLE examples (
--    user_id varchar(16) references users(id),
--    inteiro integer,
--    numerico numeric,
--    bytes bytea not null,
--    status statustype,
--    texto varchar(16),
--    list_of_3_ints integer[3],
--    list_of_ints integer[],
--    authorized bool default False,
--    timestamp timestamp without time zone default (now() at time zone 'utc'),
--    unix_timestamp int default extract(epoch from now())
--);
--DROP TABLE IF EXISTS examples CASCADE;
