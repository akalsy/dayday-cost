import React, { useState, useEffect } from "react";

import s from "./style.module.less";
import Header from "../../components/Header";
import { get, post, imgUrlTrans } from "utils";
import { FilePicker, Button, Input, Toast } from "zarm";
import { useHistory } from "react-router-dom";

const UserInfo = () => {
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(""); // 头像
  const [signature, setSignature] = useState(""); // 个签
  const history = useHistory();

  useEffect(() => {
    getUserInfo(); // 初始化请求
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get("/api/user/getUserInfo");
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar));
    setSignature(data.signature);
  };

  const handleSelect = (file) => {
    console.log("file.file", file.file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show("上传头像不得超过 200 KB！！");
      return;
    }
    let formData = new FormData();
    formData.append("file", file.file);
    post("/api/upload", formData, {
      "Content-Type": "multipart/form-data",
    }).then((res) => {
      // 返回图片地址
      setAvatar(imgUrlTrans(res.data));
    });
  };

  const save = async () => {
    const { data } = await post("/api/user/editUserInfo", {
      signature,
      avatar,
    });
    Toast.show("修改成功！");
    history.goBack();
  };
  return (
    <>
      <Header title="用户信息"></Header>
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker
                className={s.filePicker}
                onChange={handleSelect}
                accept="image/*"
              >
                <Button className={s.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => {
                setSignature(value);
              }}
            ></Input>
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
