# Collaborative newsletter


This project is a complete solution to create a collaborative newsletter and a dynamically generated RSS



# Features!

  - Basic login + JWT authentication
  - Upload news through website
  - Generate automatically weekly newsletter through API call


# Tech

## Frontend
* [Angular] - HTML enhanced for web apps!

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.32.3.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Connecting to Collaborative Newsletter backend

Create /src/app/config.json file with the same structure than /src/app/config.sample.json

### Config variables
baseURL: Url to connect with the backend API
rssName: Name of the rss that will be created in the backend for this news


## Backend
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [MongoDB] - MongoDB stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time.


### Installation

Requires [Node.js](https://nodejs.org/) v6+ to run.

Clone repository and install dependencies

```sh
$ cd newsletter\backend
$ npm install -d
```

Modify users info in the file tools/users_init.json
Init the database with users and newsletter feed

```sh
$ node tools/db_init.js
```


### Configuration

Before launching the server, copy config_sample.json file into config.json file, and set the proper values to the configuration variables
  - db_config: Configuration of your instance of MongoDB 
  - app_name: The name you want for the project.
  - EXTERNAL_PROTOCOL, EXTERNAL_HOST, EXTERNAL_PORT: They will be used to generate dynamically the urls of several resources returned into the API methods. Besides, EXTERNAL_PORT will be the port where server will be listening por requests. It has to be configured in the frontend project configuration
  - secret: String used as key to encrypt and decrypt JWT tokens
  - sessionSecret: String used as key to encrypt and decrypt sessions info
  - i18n_path: Path where locales folder can be found. It has all translation files. 
  - MODULES: Both modules have to be active (true) to work properly
  - BASIC_AUTH_STRATEGY, JWT_STRATEGY: Both authentication strategies need to be active (true) to work properly.
  - TOKEN_LENGHT: Length of refresh token used to refresh JWT tokens
  - TOKEN_TIME: Life time of JWT tokens (in seconds).


### Run server

```sh
$ node server.js
```

## Docker

If you want to launch a demo fo this project you can use docker or docker-compose to test it.

From project root folder, execute:

```sh
docker-compose up -dt
```

It takes arround 5 minutes to be ready. Then you can open this url http://localhost:8080 and you will get the login page, where you can enter:

* user: owner  password: ownerpassword1
* user: user_1 password: userpassword1

### Development

Want to contribute? Great!

Create a Pull Request and send it. We will review it as soon as we can


### Tests

```sh
$ mocha
```

License
----

[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2017-present, Solid GEAR Projects S.L.




   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Angular]: <https://angular.io/>
   [MongoDB]: <https://www.mongodb.com>

