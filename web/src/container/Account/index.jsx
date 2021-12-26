import React from "react";
import { Button, Cell, Input, Toast } from "zarm";
import Header from "../../components/Header";
import { createForm } from "rc-form";

import s from "./style.module.less";
import { post } from "../../../utils";

const Account = (props) => {
  const { getFieldProps, getFieldError } = props.form;

  const submit = () => {
    props.form.validateFields(async (err, value) => {
      if (!err) {
        if (value.newpass != value.newpassCf) {
          Toast.show("新密码2次输入不一致！");
          return;
        }

        await post("/api/user/modifyPass", {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_passcf: value.newpassCf,
        });

        Toast.show("修改成功");
      }
    });
  };

  return (
    <>
      <Header title="重置密码"></Header>
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input
              clearable
              type="text"
              placeholder="请输入原密码"
              {...getFieldProps("oldpass", { rules: [{ required: true }] })}
            ></Input>
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type="text"
              placeholder="请输入新密码"
              {...getFieldProps("newpass", { rules: [{ required: true }] })}
            ></Input>
          </Cell>
          <Cell title="确认密码">
            <Input
              clearable
              type="text"
              placeholder="请再次输入新密码"
              {...getFieldProps("newpassCf", { rules: [{ required: true }] })}
            ></Input>
          </Cell>
        </div>
      </div>
      <Button className={s.btn} block theme="primary" onClick={submit}>提交</Button>
    </>
  );
};

export default createForm()(Account);
