# End-to-end tests for the Impresso Web Application

This repository contains end-to-end tests for the Impresso web application. We use [Cypress](https://www.cypress.io/) as the testing framework. All tests are located in the `cypress/e2e` directory.

# Running the tests

Clone this repository and install the dependencies:

```bash
npm install
```

Add user credentials to the `.env` file:
 1. copy the `.env.example` file to `.env`
 2. set the `USER_EMAIL` and `USER_PASSWORD` variables to the email and password of a valid Impresso user.

By default the tests run against the development environment ([https://dev.impresso-project.ch/app](https://dev.impresso-project.ch/app)). To run the tests against a different environment, set the `BASE_URL` variable in the `.env` file to the location of the app (e.g. `https://impresso-project.ch/app` for the production environment).

To open the Cypress test runner, execute the following command:

```bash
npm run cypress
```
