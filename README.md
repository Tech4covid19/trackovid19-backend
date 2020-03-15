# trackovid19-backend

# Install dependencies

```
$ yarn install
```

# Start server

```
$ yarn start
```

:warning: Change `.env.local`to `.env`


# Serverless usage

In dev, use:


```js
// Start the server -> Dev
app.listen(port);
// Deploy the server -> Serverless
//module.exports.handler = serverless(app);

```


For dev deploy, use:

```js
// Start the server -> Dev
// app.listen(port);
// Deploy the server -> Serverless
module.exports.handler = serverless(app);

```

Credentials were given before, use 'lambda' user.

```sh
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_PROFILE="default"
```

```sh
touch ~/.aws/config
```

Paste it inside:

```sh
[default]
region=eu-west-1
```

Run it:

```sh
sls deploy
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
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.

```

# Debug

```sh
sls logs -f server
```

# Misc
Copy `.env.local` to `.env` and set something in the `APP_SESSION_SALT` env var
(for example, `covid-19`). If you want to run the mock API, also set
`MOCK_SERVICES=true`.

Having the `.env` file correctly setup, the following should start the server
locally. This will reload your files.

```
$ yarn start:dev
```
