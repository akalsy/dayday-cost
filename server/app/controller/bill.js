"use strict";

const moment = require("moment");
const Controller = require("egg").Controller;

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    // 获取请求中携带的参数
    const {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = "",
    } = ctx.request.body;

    // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: null,
      };
    }
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      let user = app.jwt.verify(token, app.config.jwt.secret);
      user_id = user.id;
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: "添加成功",
        data: null,
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      };
    }
  }

  async list() {
    const { ctx, app } = this;
    const { date, pageNum = 1, pageSize = 5, type_id } = ctx.query;
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const userInfo = app.jwt.verify(token, app.config.jwt.secret);
      if (!userInfo) throw new Error("token解析失败！");
      user_id = userInfo.id;

      // 拿出当前用的账单列表
      const list = await ctx.service.bill.list(user_id);
      // 根据日期和类型进行筛选
      const _list = list.filter((item) => {
        if (type_id != "all") {
          return (
            moment(Number(item.date)).format("YYYY-MM") === date &&
            item.type_id == type_id
          );
        }
        return moment(Number(item.date)).format("YYYY-MM") == date;
      });

      // 将数据进行封装
      let listMap = _list
        .reduce((curr, item) => {
          // curr 默认初始值是一个空数组 []
          // 把第一个账单项的时间格式化为 YYYY-MM-DD
          const date = moment(Number(item.date)).format("YYYY-MM");

          // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            });
          }
          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          else if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) == -1
          ) {
            curr.push({
              date,
              bills: [item],
            });
          }
          // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
          else if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date == date) > -1
          ) {
            const index = curr.findIndex((item) => item.date == date);
            curr[index].bills.push(item);
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date));

      // 分页处理，listMap 为我们格式化后的全部数据，还未分页。
      const filterListMap = listMap.slice(
        (pageNum - 1) * pageSize,
        pageNum * pageSize
      );

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      let __list = list.filter(
        (item) => moment(Number(item.date)).format("YYYY-MM") == date
      );
      // 累加计算支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 累加计算收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 返回数据
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: list.length, // 总分页
          list: filterListMap || [], // 格式化后，并且经过分页处理的数据
        },
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

  async detail() {
    const { ctx, app } = this;
    const { id = "" } = ctx.query;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: "账单id不能为空！",
        data: null,
      };
      return;
    }
    let user_id;
    const token = ctx.request.header.authorization;
    const userinfo = await app.jwt.verify(token, app.config.jwt.secret);
    if (!userinfo) {
      return;
    }
    user_id = userinfo.id;

    try {
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统服务错误",
        data: null,
      };
    }
  }

  async update() {
    const { ctx, app } = this;
    const {
      id,
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = "",
    } = ctx.request.body;
    const token = ctx.request.header.authorization;
    const userinfo = await app.jwt.verify(token, app.config.jwt.secret);
    // 判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 500,
        msg: "参数错误",
        data: null,
      };
      return;
    }
    if (!userinfo) {
      return;
    }
    let user_id = userinfo.id;
    try {
      const result = await ctx.service.bill.update({
        id, // 账单 id
        amount, // 金额
        type_id, // 消费类型 id
        type_name, // 消费类型名称
        date, // 日期
        pay_type, // 消费类型
        remark, // 备注
        user_id, // 用户 id
      });
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "服务错误",
        data: null,
      };
    }
  }

  async delete() {
    const { ctx, app } = this;
    const billId = ctx.request.body.id;
    let user_id;
    const token = ctx.request.header.authorization;
    const userinfo = await app.jwt.verify(token, app.config.jwt.secret);
    if (!userinfo) {
      return;
    }
    user_id = userinfo.id;
    try {
      let result = await ctx.service.bill.delete(billId, user_id);
      ctx.body = {
        code: 200,
        msg: "删除成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "服务错误",
        data: null,
      };
    }
  }

  async statistics() {
    const { ctx, app } = this;
    const { date = "" } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const userinfo = await app.jwt.verify(token, app.config.jwt.secret);
      let user_id;
      if (!userinfo) {
        throw new Error("请求未携带token");
      }
      user_id = userinfo.id;
      const result = await ctx.service.bill.list(user_id);
      let mouthStart = moment(date).startOf("month").unix() * 1000;
      let mouthEnd = moment(date).endOf("month").unix() * 1000;
      const statistics = result.filter((item) => {
        return Number(item.date) > mouthStart && Number(item.date) < mouthEnd;
      });
      // 计算总支出
      const total_expense = statistics.reduce((total, cur) => {
        if (cur.pay_type == 1) {
          total += Number(cur.amount);
        }
        return total;
      }, 0);
      // 计算总输入
      const total_income = statistics.reduce((total, cur) => {
        if (cur.pay_type == 2) {
          total += Number(cur.amount);
        }
        return total;
      }, 0);
      // 计算各类型账单list
      let billTypeList = statistics.reduce((arr, cur) => {
        const index = arr.findIndex((item) => {
          return item.type_id == cur.type_id;
        });
        if (index == -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount),
          });
        } else {
          arr[index].number += Number(cur.amount);
        }
        return arr;
      }, []);

      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          total_expense: total_expense,
          total_income: total_income,
          billList: billTypeList,
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "请求失败",
        data: error,
      };
    }
  }
}
module.exports = BillController;
