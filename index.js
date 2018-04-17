var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

module.exports = function(connConfig) {
    function connect(callback) {
        var conn = new Connection(connConfig);
        conn.on('connect', function(err) {
            if (err) {
                console.log(err)
            } else {
                callback(conn);
            }
        });
    }

    this.sprocToJson = function(sproc, params, callback) {
        var arr = [];
        connect(conn => {
            var request = new Request(sproc, (err, count, rows) => {
                console.log(`${count} rows returned`);
                conn.close();
                callback(arr, err);
            });

            if (params) {
                for (p in params) {
                    request.addParameter(p, TYPES.VarChar, params[p]);
                }
            }

            request.on('row', cols => {
                var obj = {};
                cols.forEach(col => {
                    obj[col.metadata.colName] = col.value;
                });
                arr.push(obj);
            });

            conn.callProcedure(request);
        });
    };

    this.sqlToJson = function(sql, params, callback) {
        var arr = [];
        connect(conn => {
            var request = new Request(sql, (err, count, rows) => {
                console.log(`${count} rows returned`);
                conn.close();
                callback(arr, err);
            });

            if (params) {
                for (p in params) {
                    request.addParameter(p, TYPES.VarChar, params[p]);
                }
            }

            request.on('row', cols => {
                var obj = {};
                cols.forEach(col => {
                    obj[col.metadata.colName] = col.value;
                });
                arr.push(obj);
            });

            conn.execSql(request);
        });
    };
};