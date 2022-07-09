// Packages and Dependencies
import React, { useState, useEffect } from "react";
import moment from "moment";
// Styles
import styles from "./OrderNav.module.css";
// Translation
import useTranslation from "next-translate/useTranslation";

const OrderNav = (props) => {
  const [favs, setFavs] = useState(
    props.orders?.map((o) => o.cartItems.map((a) => a.name).toString())
  );
  let momentNow = moment();
  momentNow.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const [today, setToday] = useState(
    props.orders.filter((o) => momentNow.isSame(o.createdAt, "day"))
  );

  useEffect(() => {
    setToday(props.orders.filter((o) => momentNow.isSame(o.createdAt, "day")));
  }, [props?.orders]);

  const monday = moment().startOf("week");
  monday.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const [week, setWeek] = useState(
    props.orders.filter(
      (o) =>
        moment(monday).diff(o.createdAt, "day") < 0 &&
        moment(monday).diff(o.createdAt, "day") > -7
    )
  );
  useEffect(() => {
    setWeek(
      props.orders.filter(
        (o) =>
          moment(monday).diff(o.createdAt, "day") < 0 &&
          moment(monday).diff(o.createdAt, "day") > -7
      )
    );
  }, [props?.orders]);

  const firstDay = moment().startOf("month");
  firstDay.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const [month, setMonth] = useState(
    props.orders.filter((o) => moment(firstDay).isSame(o.createdAt, "month"))
  );

  useEffect(() => {
    setMonth(
      props.orders.filter((o) => moment(firstDay).isSame(o.createdAt, "month"))
    );
  }, [props?.orders]);

  const [favItemCount, setFavItemCount] = useState(null);
  let m = 0;
  const [favItem, setFavItem] = useState("");
  // Translation
  const { t } = useTranslation();

  function setFavItems() {
    for (let i = 0; i < favs.length; i++) {
      for (let j = i; j < favs.length; j++) {
        if (favs[i] == favs[j]) m++;
        if (favItemCount < m) {
          favItemCount = m;
          setFavItem(favs[i]);
          setFavItemCount(favItemCount);
        }
      }

      m = 0;
    }
  }
  useEffect(() => {
    setFavItems();
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        {props?.storeLogo ? (
          <img src={props?.storeLogo} alt="Logo" className={styles.storeLogo} />
        ) : (
          <h4>{props?.storeName.toUpperCase()}</h4>
        )}
      </div>
      <div className={styles.favs}>
        <h3 className={styles.header}>{t("panel:favs")}</h3>
        <div className={styles.periods}>
          <span>
            {(favItem && favItem + " " + `(${favItemCount})`) ||
              t("common:notFound")}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <h5 className={styles.header}>{t("panel:orders")}</h5>
        <div className={styles.orders}>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:today")}</h6>
            <span>{today.length}</span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:week")}</h6>
            <span>{week.length || 0}</span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:month")}</h6>
            <span>{month.length || 0}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OrderNav;
