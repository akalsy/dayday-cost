"use strict";

const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const moment = require("moment");

const Controller = require("egg").Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    let file = ctx.request.files[0];
    let uploadDir = "";
    try {
      let f = fs.readFileSync(file.filepath);
      // 1.获取当前日期
      let day = moment(new Date()).format("YYYYMMDD");
      // 2.创建图片保存的路径
      let dir = path.join(this.config.uploadDir, day);
      let date = Date.now(); // 毫秒数
      await mkdirp(dir); // 不存在就创建目录
      // 返回图片保存的路径
      uploadDir = path.join(dir, date + path.extname(file.filename));
      console.log(uploadDir.replace(/\\/g, "/"));
      // 写入文件夹
      fs.writeFileSync(uploadDir, f);
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: "上传失败",
        data: null,
      };
      return;
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }
    ctx.body = {
      code: 200,
      msg: "上传成功",
      data: uploadDir.replace(/app/g, "").replace(/\\/g, "/"),
    };
  }
}

module.exports = UploadController;
