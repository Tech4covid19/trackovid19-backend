--Current DB Tables:
--  user_status : list of all possible user status
--  symptoms : list of all possible symptoms
--  confinement_states:  list of all possible confinement states
--  users : list of all users and their basic info
--  history : all historic of registered user health status
--  user_symptoms: list of symptoms for a given user
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
    status varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_status_id0 ON user_status (id);
DELETE FROM user_status;
INSERT INTO user_status(status) values('Infeção confirmada');
INSERT INTO user_status(status) values('Caso suspeito');
INSERT INTO user_status(status) values('Recuperado');
INSERT INTO user_status(status) values('Presumo que não');
--DROP TABLE IF EXISTS user_status CASCADE;

--Possible Symptoms:
CREATE TABLE IF NOT EXISTS symptoms (
    id serial,
    symptom varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS symptoms_id0 ON symptoms (id);
DELETE FROM symptoms;
INSERT INTO symptoms(symptom) values('Sem sintomas');
INSERT INTO symptoms(symptom) values('Tosse seca');
INSERT INTO symptoms(symptom) values('Tosse com expectoração');
INSERT INTO symptoms(symptom) values('Febre (acima de 37.5º)');
INSERT INTO symptoms(symptom) values('Dores musculares');
INSERT INTO symptoms(symptom) values('Arrepios/calafrios');
INSERT INTO symptoms(symptom) values('Dores de cabeça');
INSERT INTO symptoms(symptom) values('Dificuldade em respirar');
INSERT INTO symptoms(symptom) values('Náuseas, vómitos ou diarreia');
--DROP TABLE IF EXISTS symptoms CASCADE;

--Possible Confinement state For A Given User:
CREATE TABLE IF NOT EXISTS confinement_states (
    id serial,
    state varchar(100),
    description varchar(500)
);
CREATE UNIQUE INDEX IF NOT EXISTS confinement_states_id0 ON confinement_states (id);
DELETE FROM confinement_states;
INSERT INTO confinement_states(state, description) values('Afastamento social', 'Presumo estar saudável e estou por opção em casa em prevenção');
INSERT INTO confinement_states(state, description) values('Isolamento obrigatório', 'Estou doente e isolado através do afastamento social não contagiando outros cidadãos');
INSERT INTO confinement_states(state, description) values('Quarentena', 'Sou um caso suspeito e estou isolado através do afastamento social não contagiando outros cidadãos');
INSERT INTO confinement_states(state, description) values('Vida normal', 'Faço a minha rotina habitual');
--DROP TABLE IF EXISTS confinement_states CASCADE;

--Table Users With All User Info:
CREATE TABLE IF NOT EXISTS users (
    id varchar(16) primary key,
    hash bytea,
    facebook_id bytea,
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
CREATE INDEX IF NOT EXISTS users_id1 ON users (facebook_id);
--DROP TABLE IF EXISTS users CASCADE;

--Table History With The Whole User Health History:
CREATE TABLE IF NOT EXISTS history (
    id serial primary key,
    user_id varchar(16) references users(id),
    status integer references user_status(id),
    confinement_state integer references confinement_states(id),
    latitude numeric,
    longitude numeric,
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS history_id0 ON history (user_id, timestamp);
--DROP TABLE IF EXISTS history CASCADE;

--Symptoms For A Given User:
CREATE TABLE IF NOT EXISTS user_symptoms (
    id serial,
    history_id integer references history(id),
    symptom_id integer references symptoms(id),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);

CREATE UNIQUE INDEX IF NOT EXISTS user_symptoms_id0 ON user_symptoms (id);
DELETE FROM user_symptoms;
--DROP TABLE IF EXISTS user_symptoms CASCADE;

--Table Network With The Whole Users Network/Connections:
CREATE TABLE IF NOT EXISTS network (
    id serial,
    user_id varchar(16),
    met_with varchar(16),
    facebook_id bytea,
    latitude numeric,
    longitude numeric,
    info varchar(500),
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_ts int default extract(epoch from now())
);
CREATE INDEX IF NOT EXISTS network_id0 ON network (user_id);
CREATE INDEX IF NOT EXISTS network_id1 ON network (met_with);
CREATE INDEX IF NOT EXISTS network_id2 ON network (facebook_id);
--DROP TABLE IF EXISTS network CASCADE;

--View To Easily Get Latest User Health Status For Each User:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'latest_status') THEN
        CREATE VIEW latest_status AS
            SELECT a.user_id, a.status, a.confinement_state, a.timestamp
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
            SELECT b.user_id, b.met_with, c.status, c.confinement_state, c.timestamp
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
INSERT INTO users(id, hash, year, postalcode, ip, info) values('1', '1', 1, '1000-100', null, null);
INSERT INTO users(id, hash, year, postalcode, ip, info) values('2', '2', 1, '1000-100', null, null);
INSERT INTO users(id, hash, year, postalcode, ip, info) values('3', '3', 1, '1000-100', null, null);
INSERT INTO history(user_id, status, confinement_state) values('1', 1, 1);
INSERT INTO history(user_id, status, confinement_state) values('1', 3, 2);
INSERT INTO history(user_id, status, confinement_state) values('1', 4, 3);
INSERT INTO history(user_id, status, confinement_state) values('2', 1, 3);
INSERT INTO history(user_id, status, confinement_state) values('2', 3, 1);
INSERT INTO history(user_id, status, confinement_state) values('3', 1, 2);
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
    texto varchar(16),
    list_of_3_ints integer[3],
    list_of_ints integer[],
    authorized bool default False,
    timestamp timestamp without time zone default (now() at time zone 'utc'),
    unix_timestamp int default extract(epoch from now())
);
--DROP TABLE IF EXISTS examples CASCADE;