'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const result = await ctx.service.home.user();
    console.log(ctx.service.home.user());
    ctx.body = '2';
  }
}

module.exports = HomeController;
