"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get("user", { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 注册
  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert("user", params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 删除用户
  async deleteUserById(params) {
    const { app } = this;
    try {
      const result = await app.mysql.delete("user", params);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //   编辑用户
  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update("user", params);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
module.exports = UserService;
