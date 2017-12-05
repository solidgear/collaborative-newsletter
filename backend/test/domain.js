/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var db_tools = require('../db/db_tools');

describe('Domain', function() {

    before(function(done) {
        //create db conection
        db_tools.getDBConexion()
        .then(db => {
            done();
        });
    });


    describe("Domain tests", function() {
        require("./domain/users/users");
        require("./domain/auth/refreshTokens");
        require("./domain/feeds/feeds");
        require("./domain/feeds/items");
    })
});
