import styles from "./UserProfile.module.css";
/* import List from "./List"; */
import { TextField } from "@material-ui/core";
import { useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

const UserProfile = (props) => {
  const user = props.user;
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [isChanged, setIsChanged] = useState(false);

  const firstNameChangeHandler = (e) => {
    setFirstName(e.target.value);
  };
  const lastNameChangeHandler = (e) => {
    setLastName(e.target.value);
  };

  const updateHandler = (e) => {
    e.preventDefault();
    updateUser(dispatch, { firstName, lastName, id });
    setIsChanged(false);
  };

  const formHandler = (e) => {
    e.preventDefault();
    setIsChanged(true);
  };
  const url = user?.image;
  return (
    <div className={styles.single}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h1 className={styles.title}>Siparişler</h1>
          {/*   <List /> */}
        </div>
        <div className={styles.right}>
          <h1 className={styles.title}>Kullanıcı Bilgileri</h1>
          <div className={styles.item}>
            <img
              lazyOnload
              src={url || ""}
              alt=""
              className={styles.itemImg}
              width="200px"
              height="200px"
            />
            <form className={styles.details} onChange={formHandler}>
              <TextField
                className={styles.itemTitle}
                helperText="Adınız"
                value={firstName}
                onChange={firstNameChangeHandler}
              />
              <TextField
                className={styles.itemTitle}
                helperText="Soyadınız"
                value={lastName}
                onChange={lastNameChangeHandler}
              />
              <TextField
                className={styles.email}
                helperText="Email"
                value={user?.email}
                disabled
              />
              <button
                disabled={!isChanged}
                className={styles.button}
                onClick={updateHandler}
                type="submit"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
