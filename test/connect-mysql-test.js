'use strict';

var assert = require('assert');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('../lib/connect-mysql')(session);

describe('Session store create', function() {
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

describe('Session store methods', function (done) {

    var url = 'mysql://travis@localhost/connect_mysql_test';
    var store = new MySQLStore({ url: url });
    var conn = mysql.createConnection(url);
    var sid = 'test-session-sid';

    before(function (done) {
        conn.query("CREATE TABLE IF NOT EXISTS connect_mysql_test.sessions " +
            "(sid varchar(255) NOT NULL, session varchar(2048) NOT NULL DEFAULT '', PRIMARY KEY (sid)) " +
            "ENGINE=InnoDB DEFAULT CHARSET=utf8", function (err) {
            done(err);
        });
    });

    describe('#set()', function () {
        it('should create session record', function (done) {
            store.set(sid, {test: 'a'}, function (err) {
                assert(!err);
                done();
            });
        });
    });

    after(function () {
        conn.query("DROP TABLE connect_mysql_test.sessions");
    })
});