import React, { useState, useEffect, useRef } from "react";

import CustomIcon from "../../components//CustomIcon";
import { Pull } from "zarm";
import BillItem from "../../components/BillItem";
import { get, REFRESH_STATE, LOAD_STATE } from "utils"; // Pull 组件需要的一些常量
import dayjs from "dayjs";
import s from "./style.module.less";
import PopupType from "../../components/PopupType";
import PopupDate from "../../components/PopupDate";
import PopupAddBill from "../../components/PopupAddBill";


const Home = () => {
  const typeRef = useRef();
  const dateRef = useRef();
  const addRef = useRef();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(LOAD_STATE.normal); //上拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态

  const [currentSelect, SetCurrentSelect] = useState({});
  const [currentSelectDate, SetCurrentSelectDate] = useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  useEffect(() => {
    getBilllList(); //初始化
  }, [page, currentSelect, currentSelectDate]);

  const getBilllList = async () => {
    const { data } = await get(
      `api/bill/list?page=${page}&page_size=5&date=${currentSelectDate}&type_id=${
        currentSelect.id || "all"
      }`
    );
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalPage(data.totalPage);
    //上滑加载
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBilllList();
    }
  };

  const loadData = () => {
    console.log("load");
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };

  const select = (item) => {
    if (item.id !== currentSelect.id) {
      setRefreshing(REFRESH_STATE.loading);
      setPage(1);
      SetCurrentSelect(item);
    }
  };

  const selectDate = (item) => {
    if (item !== currentSelectDate) {
      setRefreshing(REFRESH_STATE.loading);
      setPage(1);
      SetCurrentSelectDate(item);
    }
  };

  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };

  const toggleDate = () => {
    dateRef.current && dateRef.current.show();
  };

  const addToggle = () => {
    addRef.current && addRef.current.show();
  };

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>${totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入：<b>${totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={toggle}>
            <span className={s.title}>
              {currentSelect.name || "全部类型"}
              <CustomIcon
                className={s.arrow}
                type="icon-xiajiantou"
              ></CustomIcon>
            </span>
          </div>
          <div className={s.right} onClick={toggleDate}>
            <span className={s.title}>
              {currentSelectDate || dayjs(new Date()).format("YYYY-MM")}
              <CustomIcon
                className={s.arrow}
                type="icon-xiajiantou"
              ></CustomIcon>
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => {
              return <BillItem key={index} bill={item} />;
            })}
          </Pull>
        ) : null}
      </div>
      <PopupType ref={typeRef} onSelect={select}></PopupType>
      <PopupDate ref={dateRef} mode="month" onSelect={selectDate}></PopupDate>
      <PopupAddBill ref={addRef} onReload={refreshData}></PopupAddBill>
      <div className={s.add} onClick={addToggle}>
        <CustomIcon type="icon-tianjiajihua"></CustomIcon>
      </div>
    </div>
  );
};

export default Home;
