'use strict';

var assert = require('assert');
var session = require('express-session');
var MySQLStore = require('../lib/connect-mysql')(session);

describe('Session', function() {
    describe('#options', function () {
        it('should return store object with database connected', function () {
            var store = new MySQLStore({
                url: 'mysql://travis@localhost/connect_mysql_test'
            });
            assert.equal(store instanceof MySQLStore, true);
        });
    });
});