# How-to - Security

## Dependencies to install

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv) (optional because prisma already use it)

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
- To add the middleware you can define it on the route, or on the router or on the app level. For best practices it's recommended to create a `middlewares/auth.js` file and export the middleware from there, and use it on the route level.

Example of middleware:
```javascript
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    let token = req.headers?.authorization // Get the token from the headers
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' }) // Return 401 if no token is provided
    }

    token = token.replace('Bearer ', '') // Remove the Bearer part from the token (it's a convention)

    try {
        // Verify the token using the secret key, if it's invalid it will throw an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Add the user to the request object, to be used in the next controller
        req.user = decoded
    } catch {
        return res.status(401).json({ message: 'Invalid token' }) // Return 401 if the token is invalid
    }
    
    next()
}
```

### Add the middleware to the route level

- Select a route that you want to protect and add the middleware to it.

```javascript
// At top of the file
import authMiddleware from '../back/middlewares/auth.js'

// On a route that will match GET /users, will call getUsers method only if nothing returned by the middleware
router.get('/', authMiddleware, getUsers)
```

- On your controller, you can access the user object that was added to the request object by the middleware.

```javascript
console.log(req.user) // Will print the user object, containing your JWT user data decoded
```

## Adding a notion of roles to the authentication

- Add a notion of roles to the authentication. A user can have multiple roles. By default you can have 2 like user or admin.
- You can simply manage these roles by adding a `isAdmin` field to the user model. But you can do more complex things like having a `roles` field that will be an array of roles, and join a `roles` table to the user table.  

When using roles to gives access, it's called RBAC (Role Based Access Control). You can have a look at [this article](https://www.redhat.com/en/topics/security/what-is-role-based-access-control) to have a better understanding of it.

## Questions to answer

- Should we return a 404, 401, 403 when password is incorrect ? Doesn't indicates that the account exists ?
- Should the token needed to be stored ? If yes, where, in db ? in cache ?
- Should we check if user exists in database each time we receive a request ?
- Should the rights/roles be stored in the token ? Or should we check them in the database each time we receive a request ?


## Other authentication methods
- [OAuth](https://oauth.net/)
- [OpenID](https://openid.net/)
- [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language)
- [JWT](https://jwt.io/)
- [API Key](https://en.wikipedia.org/wiki/Application_programming_interface_key)

*For APIs, JWT is the most used authentication method. The API is rarely responsible of managing the user creation/login. Most of the times it's another API or micro-service that will handle this.*

*At iObeya, we have a dedicated "users service" to handle the RBAC, it consumes a JWT token generated from "keycloak" and stores the user data and aggregation in Elasticsearch documents. The database backend is a postgresql in case of elasticsearch failure. As we are using an API gateway, the JWT validation is done by the gateway directly cause' the gateway knows the private "JWKS" uri used to sign the JWT. The filter/middleware on the APIs is simpler, just need to decode the JWT without validating it.*
