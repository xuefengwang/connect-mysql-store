# connect-mysql-store

A simple and minimal MySQL session store for [Express session](https://github.com/expressjs/session)

[![npm version](https://img.shields.io/npm/v/connect-mysql-store.svg)](https://www.npmjs.com/package/connect-mysql-store)
[![Build Status](https://travis-ci.org/xuefengwang/connect-mysql-store.svg?branch=master)](https://travis-ci.org/xuefengwang/connect-mysql-store)

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

See more detailed explanation at [Express session](https://github.com/expressjs/session). 

```
app.use(session({
  secret: 'super secret!',
  resave: true,
  saveUninitialized: false,
  store: new MySQLStore({
    url: dbUrl
  })
}));
```

# Options

  - url: (required). MySQL database connction string.
  - table: (optional). Table name to save the sessions data. By default, name is 'sessions'. 
  
# License

MIT License
