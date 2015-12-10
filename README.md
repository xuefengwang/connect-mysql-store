# connect-mysql-store

A simple and minimal MySQL session store for [Express session](https://github.com/expressjs/session)

[![npm version](https://badge.fury.io/js/connect-mysql-store.svg)](http://badge.fury.io/js/connect-mongo-store)
[![Build Status](https://travis-ci.org/xuefengwang/connect-mysql.svg?branch=master)](https://travis-ci.org/xuefengwang/connect-mysql)

# Installation

```
npm install connect-mysql-store
```

# Prerequisite

The database table to save the session data must exist. Following is the expected table schema.

```
CREATE TABLE sessions (
    sid varchar(255) NOT NULL,
    session varchar(2048) NOT NULL DEFAULT '',
    updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (sid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

# Usage



# Options



# License

MIT License
