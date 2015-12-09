'use strict';

var assert = require('assert');
var session = require('express-session');
var MySQLStore = require('../lib/connect-mysql')(session);

describe('Session', function() {
    describe('#options', function () {
        it('should return store object with database connected', function (done) {
            var store = new MySQLStore({
                url: 'mysql://travis@localhost/connect_mysql_test'
            });
            store.on('connected', function () {
                assert(store instanceof MySQLStore);
                done();
            });
        });
        it('should emit error with bad db url', function (done) {
            var store = new MySQLStore({
                url: 'mysql://travis@localhost/unknown'
            });
            store.on('error', function (err) {
                assert(err !== null);
                done();
            });
        });
    });
});