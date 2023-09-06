# Auth Service Template

Auth Service Template is a microservice designed to provide authentication and role management for various applications. It offers a set of features and components that can be easily integrated into your projects.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Running the Service](#running-the-service)
  - [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Docker Support](#docker-support)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This template offers a structure and best practices for building microservices using Express.js, promoting consistency and maintainability.

## Getting Started

To create a new microservice using this template, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14+)
- [npm](https://www.npmjs.com/package/download) (version 9.6.0+)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [XAMPP](https://www.apachefriends.org/download.html) (For mysql or local env)

### Installation

1. Clone this repository: `git clone https://gitlab.com/docdz/templates/expressjs-microservice-template.git`
2. Navigate to the project directory: `cd auth-microservice-template`
3. Duplicate the project folder and rename it for your new microservice: `cp -r . ../example-auth-service`
4. Navigate to the new microservice directory: `cd ../example-auth-service`
5. Create a new repository for your microservice
6. Change the origin `git remote set-url origin https://github.com/new-repo-url.git`
7. Push the content to your new repo `git push --force origin main`
8. Navigate to the app folder `cd /app`
9. Install dependencies: `npm install` and start coding!

### Configuration

#### Local Setup

- Review and update  environment configuration files in the `config/config.js` ( mostly db_setups and jwt token secrets ).

- hosting variable can be either `local` or `docker` which decides which database setup to use in the next object db_setups
```
  hosting: 'local', // local or docker

  db_setups: {
      local: {
          username: 'root',
          password: '',
          database: 'local_db_name',
          host: 'localhost', 
      },
      docker: {
          username: 'root',
          password: 'db_pass',
          database: 'db_name',
          host: 'db', 
      }
  }
```
- Customize the `package.json` file with your microservice's information.

- After configuring your environment and installing the packages you navigate to the app directory in the terminal `cd /app` and then run `npm run dev` , you'll have your service running on the port `5555` you can change that in the configuration file `config/config.js` 

#### Docker Support

The service can also be containerized using Docker. Refer to Dockerfile for building the service image and docker-compose.yaml for orchestrating multiple services.

- In the `docker-compose.yaml` we defined 2 services `app` and `db` services , if you want to run with docker edit the port number exposed in `docker-compose.yaml` file according to your configuration in `config/config.js`

- There is a Dockerfile for each service we have , `app/Dockerfile` and `db/Dockerfile`, 
in the  `app/Dockerfile` all you need to edit is the port number in case you updated it in `config/config.js` as for the `db/Dockerfile` you need to configure the database information according to your configuration

- After setting up all the required configuration you can run on docker by typing in  the terminal: `docker-compose up`


### Folder Structure

- `config`: Store configuration files here (e.g., `config.js`) .

- `controllers`: Store controllers files here (e.g., `userController.js`): controllers are for intercepting the requests from routes and build up a response with the help of services. 

- `middlewares`: Define middleware functions here (e.g., `authMiddleware.js`): middlewares comes in the middle between the route and the controller , so before a request reaches the controller , the middleware receives it first and make some checks before either forwards it to the controller or reject it.

- `models`: Place your data models here (e.g., `models/user.js`): models are the entities definition of the database tables using the sequelize js framework.

- `routes`: Define your Express.js routes here (e.g., `routes/userRoutes.js`): routes are the api calls that can trigger each controller function.

- `services`: Implement your microservice's business logic here (e.g., `services/userServices.js`): the services comes between the controllers and the database , and database operation is defined inside the service , and the controller can call those functions.

- `test`: Implement your microservice's tests here logic here.



### API

#### Users
- Register new user `POST /api/users/register , payload:{ username , email , password }`
- Login user `POST /api/users/login , payload:{ username , password }` , returns `{token, refresh}`
- Token Refresh: `GET api/users/token/refresh , requires Authorization Header `, returns `{token, refresh}`
- Logout User `GET api/users/logout , requires Authorization Header`
- Logout a User's specific session : `POST api/users/logoutSession , requires Authorization Header , payload: { session }`
- Logout All User's sessions except the one logged in with: `GET api/users/logoutEverywhere , requires Authorization Header`
- Request Password Reset Token `POST api/users/requestResetPassword , payload: { email }`, returns `{ token }`
- Reset Forgotten Password: `POST api/users/forgotPassword , requires Authorization Header , payload: { new_password }`
- Reset Password `POST api/users/resetpassword , requires Authorization Header , payload: { current_password , new_password } ` 
- Request Email Verification Token `GET api/users/requestEmailVerification , requires Authorization Header`
- Verify Email `GET api/users/verifyEmail/:token ,  requires Authorization Header`
- Update User Profile `POST api/users/update , requires Authorization Header , payload:{ fname, lname, dob, gender, mobile, profilePicture}`
- Deactivate Account `GET api/users/deactivate , requires Authorization Header `
- Delete Account `GET api/users/deleteAccount , requires Authorization Header `
#### Roles


## Contributing

Encourage team members to contribute:

- Submit improvements and bug fixes via pull requests.
- Share suggestions and feedback through issues.

## License

This template is open-sourced and available under the [MIT License](LICENSE).

---

By leveraging this template, you're equipped to build well-organized authentication microservices. Happy coding!