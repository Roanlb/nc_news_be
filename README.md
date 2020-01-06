## Roan NC News Server

This is an application programming environment for serving news items, and my backend project for Northcoders.

### Prerequisites

The programs needed for this program to run are chai, chai sorted, supertest, mocha, express, knex, and postgreSQL.

These can be installed as appropriate with the following commands:

npm i mocha chai chai-sorted mocha supertest -D
npm i express knex express pg

### Tests

The tests written in the server spec file test each available endpoint and method which is availabe for the endpoints. Available query functionality is also tested, as well as possible errors.

### Heroku host

This api is hosted on Heroku at https://roanncnewsserver.herokuapp.com/api
