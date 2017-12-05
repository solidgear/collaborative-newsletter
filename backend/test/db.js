var db_tools = require('../db/db_tools');

describe('DB', function() {

    before(function(done) {
        //create db conection
        db_tools.getDBConexion()
        .then(db => {
            done();
        });
    });


    describe("DB tests", function() {
        require("./db/users/users");
        require("./db/auth/refreshTokens");
    })
});
