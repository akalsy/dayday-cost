"use strict";

const Controller = require("egg").Controller;

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    // 判空操作
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: "账号密码不能为空",
        data: null,
      };
      return;
    }

    // 判断是否已经存在
    const userInfo = await ctx.service.user.getUserByName(username); // 获取用户信息
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账户名已被注册，请重新输入",
        data: null,
      };
      return;
    }

    const defaultAvatar =
      "http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png";
    // 调用 service 方法，将数据存入数据库。
    const result = await ctx.service.user.register({
      username,
      password,
      signature: "世界和平。",
      ctime: new Date().getTime(),
      avatar: defaultAvatar,
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "注册失败",
        data: null,
      };
    }
  }

  async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账号不存在",
        data: null,
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: "账号密码错误",
        data: null,
      };
      return;
    }

    // 生成 token 加盐
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
      },
      app.config.jwt.secret
    );

    ctx.body = {
      code: 200,
      message: "登录成功",
      data: {
        token,
      },
    };
  }

  async deleteUserById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.service.user.deleteUserById({
      id,
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: "删除成功",
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "删除失败",
        data: null,
      };
    }
  }

  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const user = app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(user.username);
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: userInfo,
    };
  }

  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = "", avatar = "" } = ctx.request.body;
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const user = app.jwt.verify(token, app.config.jwt.secret);
      if (!user) {
        return;
      }
      user_id = user.id;
      const userInfo = await ctx.service.user.getUserByName(user.username);
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      console.log(result);

      if (result) {
        ctx.body = {
          code: 200,
          msg: "修改成功",
          data: {
            id: user_id,
            signature,
            username: userInfo.username,
            avatar,
          },
        };
      } else {
        ctx.body = {
          code: 500,
          msg: "请求失败",
          data: null,
        };
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: "请求失败",
        data: err,
      };
      console.log(err);
    }
  }

  async modifyPass() {
    const { ctx, app } = this;
    const { old_pass, new_pass, new_passcf } = ctx.request.body;
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const user = app.jwt.verify(token, app.config.jwt.secret);
      user_id = user.id;
      const userInfo = await ctx.service.user.getUserByName(user.username);
      console.log(user,old_pass)
      if (old_pass !== userInfo.password) {
        ctx.body = {
          code: 500,
          msg: "原密码错误",
          data: null,
        };
        return;
      }

      if (new_pass !== new_passcf) {
        ctx.body = {
          code: 500,
          msg: "输入的密码不一致",
          data: null,
        };
        return;
      }
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        password: new_pass,
      });

      if (result) {
        ctx.body = {
          code: 200,
          msg: "修改成功",
          data: null
        };
      } else {
        ctx.body = {
          code: 500,
          msg: "请求失败",
          data: null,
        };
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        code: 500,
        msg: "请求失败",
        data: err,
      };
      console.log(err);
    }
  }
}

module.exports = UserController;
