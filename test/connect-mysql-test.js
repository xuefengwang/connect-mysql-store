'use strict';

var assert = require('assert');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('../lib/connect-mysql')(session);
var _ = require('lodash');

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
    var sessionTestData = {test: 'a'};

    before(function (done) {
        conn.query("CREATE TABLE IF NOT EXISTS connect_mysql_test.sessions " +
            "(sid varchar(255) NOT NULL, session varchar(2048) NOT NULL DEFAULT '', " +
            "updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
            "PRIMARY KEY (sid)) " +
            "ENGINE=InnoDB DEFAULT CHARSET=utf8", function (err) {
            done(err);
        });
    });

    describe('#set()', function () {
        it('should create session record', function (done) {
            store.set(sid, sessionTestData, function (err) {
                assert(!err);
                done();
            });
        });
    });

    describe('#get()', function () {
        it('should get session record', function (done) {
            store.get(sid, function (err, session) {
                assert(!err);
                assert(_.isEqual(session, sessionTestData));
                done();
            });
        });
    });

    describe('#destory()', function () {
        it('should remove specified session', function (done) {
            store.destroy(sid, function (err) {
                assert(!err);
                store.get(sid, function (err, session) {
                    assert(!err);
                    assert.equal(session, null);
                    done();
                })
            });
        });
    });

    describe('#clear()', function () {
        it('should remove all sessions', function (done) {
            store.set(sid, sessionTestData, function (err) {
                assert(!err);
                store.set(sid + '1', sessionTestData, function (err) {
                    assert(!err);
                    store.clear(function (err) {
                        assert(!err);
                        conn.query('SELECT count(*) total FROM sessions', function (err, result) {
                            assert(!err);
                            assert.equal(result.length, 1);
                            assert.equal(result[0].total, 0);
                            done();
                        });
                    });
                })
            })
        });
    });

    after(function () {
        conn.query("DROP TABLE IF EXISTS connect_mysql_test.sessions");
    })
});