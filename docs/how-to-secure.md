# How-to - Security

## Dependencies to install

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv)

```bash
npm i bcrypt jsonwebtoken dotenv
```

## Declaring the environment variables

Create a `.env` file in the root of your project and add the following variables:

```env
JWT_SECRET=your_secret_key
BCRYPT_SALT_ROUNDS=10
```

NEVER commit your `.env` file to your repository. This file should be added to your `.gitignore` file.

On your app.js file, import the `dotenv` package and call the `config` method:

```javascript
// Should be placed at the top of your file
import 'dotenv/config'
```

After that you will retrieve in `process.env` the variables declared in your `.env` file.

## Create a register route

- Add in user controller, router and service a route `/register` that will handle the registration of a user. It will be a `POST` request that will receive the following body:

```json
{
    "username": "",
    "password": ""
}
```
- In the service, hash the password using `bcrypt` before saving it to the database.
- The user should be saved to the database ONLY with the hashed password.
- Add the route to your OpenAPI documentation
- Catch the needed errors and return the appropriate status code and message

## Create a login route

- Add in user controller, router and service a route `/login` that will handle the login of a user. It will be a `POST` request that will receive the following body:

```json
{
    "username": "",
    "password": ""
}
```
- As we are an API, this route will return a JWT token that will be used to authenticate the user in the next requests.
- The token should be generated using the `jsonwebtoken` package on the service when the user is successfully authenticated.
- Use bcrypt to compare the hashed password stored in the database with the password sent in the request.
- The expiration time of the token should be 1 hour or less. In best practices, the token should be short-lived.
- Add the route to your OpenAPI documentation
- Catch the needed errors and return the appropriate status code and message (should we return a 404, 401, 403 when password is incorrect ? doesn't indicates that the account exists ?)
- Should the token needed to be stored ? If yes, where, in db ? in cache ?

## Create a middleware to authenticate the user and protect a route

- Create a middleware that will be used to authenticate the user before accessing a protected route.
- The middleware should check if the token is valid and if it is not expired.
- If the token is valid, the user should be added to the request object and the request should be passed to the next middleware.
- If the token is invalid, the middleware should return a 401 status code.
- Add the middleware to a protected route and test it using Postman.
- To add the middleware you can define it on the route, or on the router or on the app level. For best practices it's recommended to create a `middlewares/token.js` file and export the middleware from there, and use it on the route level.