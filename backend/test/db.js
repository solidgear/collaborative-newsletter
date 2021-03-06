/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

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
