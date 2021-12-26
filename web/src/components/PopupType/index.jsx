import React, { forwardRef, useState, useEffect } from "react";

import { Popup, Icon } from "zarm";
import { get } from "utils";
import PropTypes from "prop-types";

import s from "./style.module.less";

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [active, setActive] = useState("all");

  useEffect(async () => {
    const data = await get("/api/type/list");
    let list = data.data;
    setExpense(list.filter((i) => i.type == 1));
    setIncome(list.filter((i) => i.type == 2));
  }, []);

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  const closeType = (item) => {
    setActive(item.id);
    setShow(false);
    onSelect(item);
  };
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          ></Icon>
        </div>
        <div className={s.content}>
          <div
            onClick={() => closeType({ id: "all" })}
            className={active == "all" ? s.allActive : s.all}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => closeType(item)}
                className={item.id == active ? s.active : ""}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => closeType(item)}
                className={item.id == active ? s.active : ""}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};
export default PopupType;
