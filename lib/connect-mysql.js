var debug = require('debug')('connect:mysql');
var mysql = require('mysql');

/**
 * CREATE TABLE `sessions` (
 *  `sid` varchar(255) NOT NULL,
 *  `session` varchar(2048) NOT NULL DEFAULT '',
 *  PRIMARY KEY (`sid`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * @param session
 * @returns {MySQLStore}
 */
module.exports = function (session) {

    // express's session store
    var Store = session.Store;

    function MySQLStore(options) {
        if (!(this instanceof MySQLStore)) {
            throw new TypeError('Cannot call MySQLStore constructor as a function');
        }

        var self = this;

        options = options || {};
        Store.call(this, options);

        if (options.url) {
            debug("connect to database via url");
            var db = mysql.createConnection(options.url);
            db.connect(function (err) {
                if (err) {
                    debug("cannot connect to " + options.url, err);
                    self.emit("disconnected");
                    throw err;
                }
            });

            this.db = db;
        }
    }

    MySQLStore.prototype.__proto__ = Store.prototype;

    MySQLStore.prototype.get = function (sid, cb) {
        debug("get store");
        this.db.query("SELECT session FROM sessions WHERE sid = ?", [sid], function (err, rows) {
            if (err) return cb(err);

            if (rows.length > 0) {
                cb(null, JSON.parse(rows[0].session));
            } else {
                cb(null, null);
            }
        });
    };

    MySQLStore.prototype.set = function (sid, sess, cb) {
        debug("set store");
        try {
            var jsess = JSON.stringify(sess);
        } catch (e) {
            return cb(e);
        }
        try {
            this.db.query("INSERT INTO sessions (sid, session) VALUES(?, ?) ON DUPLICATE KEY UPDATE session = ?", [sid, jsess, jsess],
                function (err, result) {
                    cb(err);
                }
            );
        } catch (e) {
            return cb(e);
        }
    };

    MySQLStore.prototype.destroy = function (sid, cb) {
        debug("destroy store");
        this.db.query("DELETE FROM sessions WHERE sid = ?", [sid], function (err) {
            cb(err);
        });
    };

    //MySQLStore.prototype.touch = function (sid, sess, cb) {
    //    sess.cookie.expires = new Date(new Date().getTime() + sess.cookie.originalMaxAge);
    //    try {
    //        var jsess = JSON.stringify(sess);
    //    } catch (e) {
    //        return cb(e);
    //    }
    //
    //    this.db.query("UPDATE sessions SET session = ? WHERE sid = ?", [jsess, sid], function (err) {
    //        cb(err);
    //    });
    //};

    MySQLStore.prototype.clear = function (cb) {
        debug("clear store");
        this.db.query("TRUNCATE TABLE sessions", function (err) {
            cb(err);
        });
    };

    return MySQLStore;
};
