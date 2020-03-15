# trackovid19-backend

# Install dependencies

```
$ yarn install
```

# Start server in production mode

```
$ yarn start
```

# Start server in dev mode

Copy `.env.local` to `.env` and set something in the `APP_SESSION_SALT` env var
(for example, `covid-19`). If you want to run the mock API, also set
`MOCK_SERVICES=true`.

Having the `.env` file correctly setup, the following should start the server
locally. This will reload your files.

```
$ yarn start:dev
```
