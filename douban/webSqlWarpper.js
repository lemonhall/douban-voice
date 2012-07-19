/*
 * webSqlWarpper.js - Warpper WebSql into LocalStorage API
 * 
 * Author: Lemon Hall ( http://www.douban.com/people/lemonhall2012 )
 * Version: 0.1  (2012-07-19)
 * License: MIT License
 */
(function(){
var webdb=(function(){
  var myself=this;

  var open = function() {
    var dbSize = 50 * 1024 * 1024; // 5MB
    myself.db = openDatabase("VoiceCache", "1.0", "Voice Cache", dbSize);
  },
  createTable = function() {
    var db = myself.db;
        db.transaction(function(tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS VoiceCache(ID INTEGER PRIMARY KEY ASC,sid TEXT, base64 TEXT)", []);
        });
  },
  setFile = function(sid,base64) {
  var db = myself.db;
  var deferred = $.Deferred(); 
  var promise = deferred.promise();
    db.transaction(function(tx){
    tx.executeSql("INSERT INTO VoiceCache(sid,base64) VALUES (?,?)",
          [sid,base64],
          (function(tx, r){
                  var result=rs.rows.item(0);
                  deferred.resolve(tx);
          }),
          (function(tx, e){
                  deferred.reject();
          })
          );//END OF executeSql
     });//END OF transaction

    return promise;
  },
  getFile = function(sid) {
    var db = myself.db;
    var deferred = $.Deferred(); 
    var promise = deferred.promise();

    db.transaction(function(tx){
      tx.executeSql("SELECT base64 FROM VoiceCache"+
                    "WHERE sid=?"
        , [sid],
          (function(tx, r){
                  var result=rs.rows.item(0);
                  deferred.resolve(tx);
          }),
          (function(tx, e){
                  deferred.reject();
          })
          );//END OF executeSql
     });//END OF transaction

    return promise;
  };

    return {
      init: function(){
          myself.db = null;
          myself.open();
          myself.createTable();
      },
      getCache: function(sid){
          return getFile(sid);
      },
      setCache: function(sid,base64){
          return setFile(sid,base64);
      }
    };
  })();

  // register webdb at VoiceCache object
  if(!VoiceCache){
    VoiceCache = webdb;
  }
  // and initialize it
  webdb.init();
})();