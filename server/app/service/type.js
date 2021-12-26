"use strict";

const Service = require("egg").Service;

class TypeService extends Service { 
    async list(id) {
        const { ctx, app } = this;
        let sql = 'select * from type';
        try {
          const result = await app.mysql.query(sql);
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
}

module.exports = TypeService