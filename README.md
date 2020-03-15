# trackovid19-backend

# Install dependencies

```
$ npm install

OR

$ yarn install
```

# Start server locally

Copy `.env.local` to `.env` and set something in the `APP_SESSION_SALT` env var
(for example, `covid-19`). If you want to run the mock API, also set
`MOCK_SERVICES=true`.

Having the `.env` file correctly setup, the following should start the server
locally:

```
$ npm start dev
```
