"use strict";

const Controller = require("egg").Controller;

class TypeController extends Controller {
  async list() {
    const { ctx, app } = this;
    try {
      const token = ctx.request.header.authorization;
      const userInfo = app.jwt.verify(token, app.config.jwt.secret);
      if (!userInfo) throw new Error("token解析失败！");
      const list = await ctx.service.type.list();
      // 返回数据
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: list
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }
}

module.exports = TypeController;
