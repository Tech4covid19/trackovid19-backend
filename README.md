# Trackovid19-Backend
### Guidelines:
- YARN as PKG Manager
- ASYNC/AWAIT Promise Style
- DB is PostgreSQL
- Sequelize as ORM using ASYNC Client
- FASTIFY as base framework (we need something simple yet speedy)
- FASTIFY based scaffolding (with some minor adjustments)
- JWT as Authentication and Authorization System
- JSON requests & responses
- This is to be run at AWS Lambda (via wrapper):
--> Your code is running in a serverless environment. You cannot rely on your server being 'up' in the sense that you can/should not use in-memory sessions, web sockets, etc. You are also subject to provider specific restrictions on request/response size, duration, etc.
### Installation
You will need atleast nodejs version 12 LTS to run this server.
### 1 - Generate Private and Public keys to be used with JWT:
```sh
$ openssl genrsa -out private.key 2048
$ openssl rsa -in private.pem -outform PEM -pubout -out public.key
$ mv private.pem public.key plugins/certs
```
### 2 - Install the dependencies and devDependencies and start the server:
```sh
$ yarn
$ yarn start
```
### 3 - Generate DB Models from Remote deployed PGSQL DB at AWS:
(Yeah yeah magic stuff, but keep in mind you need to do step 2 first)
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

### Documentation
To create a new case:
```sh
curl --request POST \
  --url http://localhost:3000/api/v1/case \
  --header 'content-type: application/json' \
  --data '{
	"postalCode": "4610-670",
	"geo": {
		"lat": 31.5812858,
		"lon": 54.0828852
	},
	"condition": "infected",
	"symptoms": true,
	"timestamp": "2012-04-23T18:25:43.511Z"
}'
```
To get a case by Id:
```sh
curl --request GET \
  --url http://localhost:3000/api/v1/case/27
```

### Authors
Special thanks to @victorfern91 @hugoduraes @ludwig801 @palminha @lcfb91 @zepcp @jcazevedo @cchostak for the work and efforts to bootstrap this service!
Feel free to change / improve / delete everything you want!