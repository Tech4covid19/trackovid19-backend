# trackovid19-backend



# Install dependencies

```
npm install
```

# Start server

```
node server.js
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

# Debug

```sh
sls logs -f server
```