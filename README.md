
<h1 align="center">Covidografia-Backend</h1>

<div align="center">
<a href="[https://tech4covid19.org/](https://tech4covid19.org/)" target="_blank"><img src="https://ucarecdn.com/e2cfb782-1524-496a-a48f-f97b75440d56/"></a>
</div>
<div align="center">
  <strong>Covidografia-Backend</strong>
</div>
<div align="center">
  Covidografia API
</div>
<br />

<div align="center">
  <h3>
    <a href="https://tech4covid19.org">
      Website
    </a>
    <span> | </span>
    <a href="https://join.slack.com/t/tech4covid19/shared_invite/zt-csmcdobq-Qbn8fwG52JssqhrIwfv4Yg">
      Community
    </a>
  </h3>
</div>

<div align="center">
  <sub>Built with ❤︎ by the
  <a href="https://tech4covid19.org">tech4covid19.org</a> community
</div>

## Table of Contents
- [Guideline](#guidelines)
- [Instalation](#instalation)
- [Documentation](#documentation)
- [Serverless Usage](#serverless-usage)
- [See Also](#see-also)
- [Authors](#authors)
- [License](#licence)

## Guidelines
- __YARN__ as Package Manager
- __ASYNC/AWAIT__ Promise Style
- Database is __PostgreSQL__
- __Sequelize__ as ORM using ASYNC Client
- __FASTIFY__ as base framework (we need something simple yet speedy)
- __JWT__ as Authentication and Authorization System
- __JSON__ requests & responses

> This code is running in a serverless environment. You cannot rely on your server being 'up' in the sense that you can/should not use in-memory sessions, web sockets, etc. You are also subject to provider specific restrictions on request/response size, duration, etc.


## Instalation

> You will need atleast nodejs version 12 LTS to run this server.

###  Please don't forget to set JWT_SECRET environment variable

###  Install the dependencies and devDependencies and start the server:

```sh
$ yarn
$ yarn start
```

### Generate DB Models from Remote deployed PGSQL DB at AWS:

```sh
$ yarn generate-db
```

After the task is done, you will see the models inside models folder with the current definition from the remote DB.

### Side Notes

You will see a weird snippet inside package.json:

```json
"peerDependencies": {
	"sequelize": "^5.21.5"
}
```
This is to handle external dependencies for 3rd party modules, otherwise we will receive security warnings from deprecated / insecure modules.

## Documentation

1. Login using your facebook account on: http://localhost:3000/login/facebook;
2. You will receive a JWT token, use it as a Bearer Token in all the authenticated requests;
3. Please load the `insomnia.json` file into your Insomnia Rest Client and call the routes or consult https://trackcovid19.docs.apiary.io;

> Do not forget to set the Bearer token on insomnia environment and check other variables!

## Serverless Usage

Install the framework:
```sh
$ npm install -g serverless
$ serverless plugin install --name serverless-stage-manager
```

Verify its installation:
```sh
$ serverless --version
```
In dev, use:
```sh
$ yarn start
```

Configure your environment:
Credentials were given before, use 'lambda' user.
```sh
$ export AWS_ACCESS_KEY_ID=
$ export AWS_SECRET_ACCESS_KEY=
$ export AWS_PROFILE="default"
```

```sh
$ touch ~/.aws/config
```

Paste inside `~/.aws/config`:
```sh
[default]
region=eu-west-1
```

For dev deploy, use:
```sh
$ sls deploy --stage dev --db_pass 'PASSWORD'
```

For prd deploy, use:
```sh
$ sls deploy --stage prd --db_pass 'PASSWORD'
```

You should see
```sh
Serverless: Uploading artifacts...
Serverless: Uploading service trackovid19-backend.zip file to S3 (2.78 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............

Serverless: Stack update finished...
Service Information
service: trackovid19-backend
stage: dev
region: eu-west-1
stack: trackovid19-backend-dev
resources: 12
api keys:
None
endpoints:
ANY - https://2ceesuwr5l.execute-api.eu-west-1.amazonaws.com/dev/
ANY - https://2ceesuwr5l.execute-api.eu-west-1.amazonaws.com/dev/{proxy+}
functions:
server: trackovid19-backend-dev-server
layers:
None
Serverless: Removing old service artifacts from S3...
Serverless: Run the "serverless"  command to setup monitoring, troubleshooting and testing.
```

### Debug

  

```sh
$ sls logs --stage prd -f app -t
$ sls logs --stage dev -f app -t
```

## Local Development

A docker compose yml file was added for launching a local postgres database and a web based admin app (adminer).

You can check/change all db parameters by editing the docker compose file:
```sh
$ docker/database/tracovid.yml
```

You can use the convenience start/stop scripts for starting/stopping the database, but first you need to add execute permissions:

```sh
$ chmod +x docker/database/*.sh
```

Then for starting the local database:
```sh
$ docker/database/start.sh
```

You can then go to your browser and access the database via adminer at http://localhost:8080

Stopping the local database:
```sh
$ docker/database/stop.sh
```

## See also

- [trackovid19-web](https://github.com/Tech4covid19/trackovid19-web) - Frontend for this project


## Authors

Special thanks to @victorfern91 @hugoduraes @ludwig801 @palminha @lcfb91 @zepcp @jcazevedo @cchostak for the work and efforts to bootstrap this service!

Feel free to change / improve / delete everything you want!


## License
[MIT](https://tldrlegal.com/license/mit-license)
