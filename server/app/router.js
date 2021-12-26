"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串
  router.get("/", controller.home.index);
  router.post("/api/upload", controller.upload.upload); //文件上传接口
  router.post("/api/user/register", controller.user.register);
  router.post("/api/user/login", controller.user.login);
  router.get("/api/user/getUserInfo", controller.user.getUserInfo);
  router.post("/api/user/deleteUserById", controller.user.deleteUserById); // 放入第二个参数，作为中间件过滤项
  router.post("/api/bill/add", _jwt, controller.bill.add); // 添加账单
  router.get("/api/bill/list", _jwt, controller.bill.list); // 获取账单列表
  router.get("/api/bill/detail", _jwt, controller.bill.detail); // 获取账单信息
  router.post("/api/bill/update", _jwt, controller.bill.update); // 账单更新
  router.post("/api/bill/delete", _jwt, controller.bill.delete); // 账单删除
  router.get("/api/bill/statistics", _jwt, controller.bill.statistics); // 月度账单
  router.get("/api/type/list", _jwt, controller.type.list); // 月度账单
  router.post('/api/user/editUserInfo',_jwt,controller.user.editUserInfo) //编辑用户信息
  router.post('/api/user/modifyPass',controller.user.modifyPass) //编辑用户信息
};
