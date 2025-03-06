# Project Overview

This project is a comprehensive boilerplate designed to kickstart your nestjs projects effortlessly. This nestjs
boilerplate encompasses essential functionalities required for a wide array of nestjs applications. With a focus on
flexibility and configurability, our project aims to simplify the project initiation process.

- You can use any relational database with all the features working.
- You can enable or disable certain features without removing them.
- The caching feature is available with redis storage.
- Complete logs of each request are being stored.
- The basic security measures are in place and can be configured as well.

All of the required keys are listed in the `.env.example` file. You can also configure certain keys to customize the
features according to your requirement.

## Tools and Technologies:

### Development and Deployment Tools:

- **TypeScript:** Enables static type checking for enhanced code quality.
- **Dotenv:** Supports environment variables for better configuration management.
- **Swagger:** Generates interactive API documentation for improved developer experience.
- **Docker Compose:** Facilitates container orchestration for seamless deployment.
- **Linting and Formatting:** Implements ESLint and Prettier for consistent and clean code.
- **Commitlint:** Enforces conventional commits for a standardized commit message format.
- **Winston Logger:** Utilizes Winston Logger for efficient logging and debugging.
- **Git Hooks:** Integrates Husky for pre-commit, commit-msg, and pre-push Git hooks.
- **Migrations:** Implements TypeORM migrations for database schema management.
- **Caching:** Utilizes Redis as a cache storage solution for optimized performance.
- **Feature Flagging:** Using the GrowthBook to implement flags and feature toggling.

### Database and Storage:

- **TypeORM:** Utilizes TypeORM as the database ORM (Object-Relational Mapping).
- **Relation DB:** Incorporates relational database for efficient data management.
- **AWS Services Integration:** Integrates with AWS services such as SES (Simple Email Service), S3 Bucket, and
  CloudWatch for various functionalities.

### Authentication and Authorization:

- **JWT Authentication:** Implements JSON Web Tokens for secure user authentication.

### Security Measures:

- **Helmet:** Enhances security with secure HTTP headers.
- **XSS:** Input Sanitization and prevents stored xss attacks.
- **Rate Limiting:** Allows limited number of requests to prevent DOS attacks.
- **IP Filtering:** Blacklists or whitelists IPs to prevent access to malicious IPs.

# Features

## 1. Authentication

The following authentication are being handled,

- Register
- Login
- Forgot Password

**The following `env variables` should be set for the authentication feature:**

1. JWT_REFRESH_PRIVATE
2. JWT_PRIVATE
3. SENDER_EMAIL
4. MAILJET_SECRET
5. MAILJET_KEY
6. ACCESS_TOKEN_EXPIRE_DURATION
7. REFRESH_TOKEN_EXPIRE_DURATION
8. RESET_PASSWORD_LINK_EXPIRY
9. BASE_FORGOT_PASSWORD_LINK

## 2. Feature Flagging

The user can enable or disable a certain feature by creating the flags in their [GrowthBook](https://www.growthbook.io/)
dashboard.

## 3. Cache

All of the listing routes are being cached e.g. `GET /api/permissions`. The redis storage is being used for the cache.
The default expiration time for the cache is 1 day but it can be changed.

**The following `env variables` should be set for the cache feature:**

1. REDIS_TTL
2. REDIS_HOST
3. REDIS_PORT

## 4. IP Filtration

We also have a feature to filter the IP addresses, more details in the Application Security section below.

## 5. Rate Limiting

We also have a feature to limit the number of requests, more details in the Application Security section below.

## 6. Input Sanitization

We also have implemented a middleware to sanitize the user input, more you can find in the Application Security section
below.

## 7. Logging and Monitoring

### Service Level Logging

We are using the nestjs default logger to log any request inside our services, middlewares, or guards.

## 8. Crash Reporting

We are using the Sentry to report crashes that user may face in our application. We have implemented a custom Sentry
interceptor, which captures exceptions and errors that occur during the application's runtime. This interceptor not only
records the errors but also provides detailed context information, such as the HTTP method, URL, and sanitized request
body, facilitating efficient debugging and issue resolution.

## 9. Role and Permissions

We have also implemented the roles and permissions for the users. We can create, update or delete a certain role or
permission.
The permissions can be assigned to roles, the roles can be assigned to users. We can also directly assign permissions to
the a user.

## 10. Mailing Service

The mailing service is also implemented using the Mailjet and NodeMailer service. This mail service is being used in other services
like authentication.
You can create your email templates and configure the existing ones as well. You can also create mail services for any
service you want in the mailer folder.

# Getting Started

## Prerequisites

Ensure you have the following pre-requisites installed

- Node.js v18 or higher
- npm v10 or higher
- A Sentry.io account (optional)
- AWS account (optional)
- Mailjet account (required)
- Nodemailer account (required)
- Config Cat (optional for feature toggling)
- Redis (installed on local machine)
- Postgres (installed on local machine)

## 1. Postgres Installation

Follow these instructions to install PostgreSQL on your machine, based on your operating system.

- Visit this [download page](https://www.postgresql.org/download/).
- You can select the desired operating system.
- Just follow the instructions to install PostgreSQL on your machine.

## 2. Redis Installation

- Visit this [installation page](https://redis.io/docs/install/install-redis/).
- There are detailed instructions on how to install redis for each operating system.

Once you have installed Redis, you can start the redis server by running the following commands:

```
# Linux
$ sudo systemctl start redis

# Mac
$ brew services start redis

# Windows
$ sudo service redis-server start
```

## 3. Clone the repository

```
git clone https://github.com/pikessoft/nest-boilerplate.git
```

### Push on your new Repository

Follow these steps:

1. Navigate to the cloned project directory:

```bash
cd [name of the cloned project directory]

```

2. Delete the .git directory:

```bash
rm -rf .git
```

3. Create a new Git repository in the empty directory:

```bash
git init
```

4. Commit the changes to the new Git repository:

```bash
git commit -m "Initial commit"
```

5. Add your own Git repo link as the remote origin:

```bash
git remote add origin <your repo>
```

6. Push the changes to your own Git repo:

```bash
git push --all
```

## 4. Package Installations (Development)

```bash
$ npm install
```

## 5. ENV Configuration

- Create a .env using the following command.

```bash
$ cp .env.example .env
```

- The .env file will be created with following variables:

| Variable                       | Description                                             | Default Value                                     |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| PORT                           | Port for the application                                | 3001                                              |
| DATABASE_HOST                  | Database host address                                   | localhost                                         |
| DATABASE_TYPE                  | Database type                                           | postgres                                          |
| STRIPE_SECRET_KEY              | Stripe secret key                                       |                                                   |
| DATABASE_USER                  | Databse username                                        |                                                   |
| DATABASE_PASSWORD              | Databse password                                        |                                                   |
| DATABASE_NAME                  | Databse name                                            |                                                   |
| JWT_REFRESH_PRIVATE            | Private key for JWT refresh tokens                      |                                                   |
| PRIVATE_KEY                    | The RSA generated private key for authentication token. |                                                   |
| ACCESS_TOKEN_EXPIRE_DURATION   | Duration for access token expiry                        | 15m                                               |
| REFRESH_TOKEN_EXPIRE_DURATION  | Duration for refresh token expiry                       | 7d                                                |
| BASE_FORGOT_PASSWORD_LINK      | Base URL for forgot password link                       | http://localhost:3001/auth/reset-password         |
| RESET_PASSWORD_LINK_EXPIRY     | Time for the reset link expiry                          | 15m                                               |
| ADMIN_EMAIL                    | Admin email address for sending emails                  |                                                   |
| MAILJET_SECRET                 | Mailjet API secret key                                  |                                                   |
| MAILJET_KEY                    | Mailjet API key                                         |                                                   |
| DISABLE_WINSTON_LOGS           | Disable Winston logging                                 | false                                             |
| DISABLE_NEST_LOGS              | Disable NestJS logging                                  | false                                             |
| CONFIG_CAT_KEY                 | Key for configuration catalog service                   |                                                   |
| REDIS_TTL                      | Expiration time for the Redis keys                      | 86400000                                          |
| REDIS_HOST                     | Redis host address                                      | localhost                                         |
| REDIS_PORT                     | Port of the Redis address                               | 6379                                              |
| GET_REQ_LIMIT                  | Request limit for the GET method                        | 100                                               |
| GET_REQ_REFRESH_TIME           | Time after the limit will reset in seconds              | 60                                                |
| POST_REQ_LIMIT                 | Request limit for the POST method                       | 100                                               |
| POST_REQ_REFRESH_TIME          | Time after the limit will reset in seconds              | 60                                                |
| PUT_REQ_LIMIT                  | Request limit for the PUT method                        | 100                                               |
| PUT_REQ_REFRESH_TIME           | Time after the limit will reset in seconds              | 60                                                |
| PATCH_REQ_LIMIT                | Request limit for the PATCH method                      | 100                                               |
| PATCH_REQ_REFRESH_TIME         | Time after the limit will reset in seconds              | 60                                                |
| DELETE_REQ_LIMIT               | Request limit for the DELETE method                     | 100                                               |
| DELETE_REQ_REFRESH_TIME        | Time after the limit will reset in seconds              | 60                                                |
| ADMIN_ROLE_REQ_LIMIT           | Request limit for the Admin role                        | 110                                               |
| ADMIN_ROLE_REQ_REFRESH_TIME    | Time after the limit will reset in seconds              | 60                                                |
| STANDARD_ROLE_REQ_LIMIT        | Request limit for the Standard role                     | 100                                               |
| STANDARD_ROLE_REQ_REFRESH_TIME | Time after the limit will reset in seconds              | 60                                                |
| IP_REQ_LIMIT                   | Request limit for a certain IP                          | 100                                               |
| IP_REQ_REFRESH_TIME            | Time after the limit will reset in seconds              | 60                                                |
| IP_BLOCKED_TIME                | Time till IPs will be blacklisted in days               | 2                                                 |
| ENABLE_GRAPHQL_PLAYGROUND      | GraphQL playground                                      | true                                              |
| VERIFY_EMAIL_LINK              | The link to verify user email                           | http://localhost:3001/api/user/two/factor/?email= |
| OTP_FOR_LOGIN                  | The key to enable/disable otp for login                 | true                                              |

- **Note:** If your project requires sensitive information such as passwords or API keys, make sure to keep the .env
  file secure and do not share it publicly.
- **Note:** Do not use personal keys or keys from any other project.
- **Note:** Make sure you have the keys setup.
- Save the .env file and make sure it is included in the .gitignore file so that it is not pushed to version control.

## 6. Running Migrations

Running the following command will create tables in the database.

```bash
# run migrations
$ npm run migration:run
```

## 7. Running Seeders

Running the following command will add placeholder users, roles, and permissions to their respective tables. Roles will
be added to tables along with assigned permissions, and users will be inserted with their assigned roles.

```bash
# run seeders
$ npm run seed
```

## 8. Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Running with Docker

Alternatively, you can run the project using Docker, which simplifies the setup process. Make sure you have Docker
installed on your system and you are using it for development purpose. If you don't have it installed, you can download
and install it from the official website: [Docker](https://www.docker.com/).
To run the project with Docker, first make sure following things.
make sure your env has
DATABASE_HOST=postgres
DATABASE_PORT=5432
PORT=3000
REDIS_HOST=redis
REDIS_PORT=6379

For running Seeders in docker, please make sure you have added values in env against given variables:

- USERS_SEEDER_EMAIL
- USERS_SEEDER_PASSWORD

After that, run the following commands
$ make install

```bash
$ make start-dev
if you get error the docker-compose not install ,kindly first install it
To run seeder run the following command
$ make start-seed
To run the migrations ,run the following command
$ make start-migration

```

- **Note:** If you encounter any issues or want to customize the Docker configuration, you can modify
  the `docker-compose.builder.yml` file.
- **Note:** If you face `bind: address already in use`
  error, [click here](https://stackoverflow.com/a/58604402/22423442).

# Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Husky Configuration and Commit Standards

You must follow the Conventional Commits message format for our project. Each commit message should have the following
structure:
`[ticketNumber]: [commitDescription]`

- [ticketNumber] should be any integer written before colon (:)
- [commitDescription] should be a brief, concise summary of the changes made.

Before pushing your code to GitHub, the push command will automatically run all the tests. If all the tests pass
successfully, your code will be pushed without any issues. However, if any test cases fail, the push will be halted, and
you will be notified of the failed test cases

# API Documentation

## Swagger

Access the Swagger API documentation at

```bash
$ http://localhost/{port-where-your-project-is-running}/api.
```

## Postman Collection

```bash
$ http://localhost/{port-where-your-project-is-running}/api-json
```

## GraphQL

```bash
$ http://localhost/{port-where-your-project-is-running}/graphql
```

Note: GraphQL does not load property due to Content Security Policy Directive on CDN requests. You must
set `ENABLE_GRAPHQL_PLAYGROUND` true in env, it will disable Content Security Policy Directive on CDN requests to load
GraphQL playground.

# Generate SSL certificates

These keys are required for the jwt keys

1. Generate an RSA private key, of size 2048, and output it to a file named key.pem:

```bash
openssl genrsa -out private_key.pem 2048
```

```bash
# It needs be copied&pasted from terminal manually
awk 'NF {sub(/\r/, ""); printf"%s\\n",$0;}' private_key.pem
```

2. Extract the public key from the key pair, which can be used in a certificate:

```bash
openssl rsa -in private_key.pem -outform PEM -pubout -out public_key.pem
```

```bash
# It needs be copied&pasted from terminal manually
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' public_key.pem
```

# Formatting and Liting

We are using the [prettier](https://prettier.io/) to format our code. Run the following command to format the all the ts
files inside the src folder:

```
npm run format
```

We are using [eslint](https://www.npmjs.com/package/eslint_) for linting. Run the following command to fix all the
linting issues:

```
npm run lint
```

# Application Security

Ensuring the security of our application is of paramount importance. Here are the security measures we have implemented
to protect against various threats:

## 1. **Protection Against DoS Attacks:**

To mitigate the risk of Denial of Service (DoS) attacks, we have implemented rate limiting strategies that are provided
by the nestjs. Requests are limited based on the following criteria:

- **User IP:** We will block the user IP for a minute if the limit is reached, the specific IP can send 100 requests in
  a minute.
- **Request Method:** Each request method currently has 100 req/min limit. After the limit, the specific request method
  will block requests for a specified amount of time.
- **Role Based:** Users also have limits based on their roles, the admin can send 110 req/min, while others have 100
  req/min limit. In this scenario, the user is blocked by the id.

All of the requests limits and the refresh time of these limits are in the .env file which can be changed according to
the requirement.
These variables are being used in the `constants/rate-limiting-constant.ts` file.

```
GET_REQ_LIMIT
GET_REQ_REFRESH_TIME
POST_REQ_LIMIT
POST_REQ_REFRESH_TIME
PATCH_REQ_LIMIT
PATCH_REQ_REFRESH_TIME
PUT_REQ_LIMIT
PUT_REQ_REFRESH_TIME
DELETE_REQ_LIMIT
DELETE_REQ_REFRESH_TIME

ADMIN_ROLE_REQ_LIMIT
ADMIN_ROLE_REQ_REFRESH_TIME
STANDARD_ROLE_REQ_LIMIT
STANDARD_ROLE_REQ_REFRESH_TIME

IP_REQ_LIMIT
IP_REQ_REFRESH_TIME
```

## 2. **Content Security Policy (CSP) Policies:**

We have implemented [Helmet](https://helmetjs.github.io/) middleware to enforce Content Security Policy (CSP) policies.
CSP helps prevent various types of attacks, such as XSS, by specifying which content sources are approved. It restricts
the sources from which resources like scripts, styles, and images can be loaded, reducing the risk of malicious code
execution.

It is being used by our app in `main.ts` file. Other than the default config we have added the following headers as
well,

```
'object-src': 'none',
'base-uri': 'self',
'form-action': 'self',
```

## 3. **Input Sanitization and Protection Against XSS:**

We have employed input sanitization techniques and protection against Cross-Site Scripting (XSS) attacks. Cross-Site
Scripting occurs when untrusted data from user inputs is rendered in the browser, potentially executing malicious
scripts. To prevent this:

- **Input Sanitization:** User inputs are thoroughly validated and sanitized to remove any potentially harmful code or
  scripts.
- **Stored XSS Protection:** Special care is taken to sanitize and validate data before storing it in the database. This
  prevents stored XSS attacks where malicious scripts are injected into the application's database and later displayed
  to users.

We are using the `input-sanitization` middleware that rejects the user request if it contains any malicious script or
executable code.

## 3. **IP Filtration:**

We have implemented a manual IP filtration mechanisms to enhance security:

- **Blacklisting IPs:** Suspicious or malicious IPs can be blacklisted to block their access to the application.
  Blacklisting can be temporary or permanent. Temporary blacklisted IPs are automatically removed after the specified
  expiry period(currently 2 days). Upon expiry, an email notification is sent to the admin to inform them about the
  removal of blacklisted IPs.

- **Whitelisting IPs:** Trusted IPs can be whitelisted to ensure unrestricted access. Currently, whitelisted IPs are
  permanent and have continuous access to the application.

This filtration is manual and has to be done by the admin, the logs are available for all the rejected requests that can
help determine
the malicious IPs. The following env variables sets the time of blacklisting an IP,

```
IP_BLOCKED_TIME
```

# Project Maintenance

In our project, we value the stability and maintenance of our codebase. If you come across any packages that have been
deprecated or newer versions are available, we encourage you to proactively update them to the latest compatible
versions. Keeping our dependencies current not only ensures the continued functionality of our project but also guards
against potential security vulnerabilities and improves overall performance.
