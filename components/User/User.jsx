// Packages and Dependencies
import List from "./List";
import { TextField } from "@material-ui/core";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Loading } from "@nextui-org/react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
// Styles
import styles from "./User.module.css";

const User = ({ orders, isFetching }) => {
  let profile;
  if (Cookies.get("userInfo")) {
    profile = JSON.parse(Cookies.get("userInfo"));
  }
  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [isChanged, setIsChanged] = useState(false);
  const firstNameChangeHandler = (e) => {
    setFirstName(e.target.value);
  };
  const lastNameChangeHandler = (e) => {
    setLastName(e.target.value);
  };

  const updateHandler = async (e) => {
    setIsChanged(false);
    e.preventDefault();
    const user = await axios.patch(
      "/api/users/" + profile.id + "/update",
      {
        firstName,
        lastName,
        id: profile.id,
      },
      {
        headers: { authorization: `Bearer ${profile.token}` },
      }
    );
    Cookies.remove("userInfo");

    Cookies.set("userInfo", JSON.stringify(user.data));
  };

  const formHandler = (e) => {
    e.preventDefault();
    setIsChanged(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>Kullanıcı Bilgileri</h1>
        <form className={styles.details} onChange={formHandler}>
          <img
            src="https://img.icons8.com/external-flaticons-flat-flat-icons/452/external-user-web-flaticons-flat-flat-icons-2.png"
            className={styles.img}
          />
          <div className={styles.inputs}>
            <div className={styles.names}>
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
            </div>
            <TextField
              className={styles.email}
              helperText="Email"
              value={profile?.email}
              disabled
            />
          </div>
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

      <div className={styles.right}>
        <h1 className={styles.title}>Siparişler</h1>
        {!isFetching && orders?.length > 0 ? (
          orders?.filter((order) => order?.quantity.length > 1)?.length > 0 ? (
            <List orders={orders} style={{ height: "12rem" }} />
          ) : (
            <h6 className={styles.notFound}>Sipariş bulunamadı.</h6>
          )
        ) : (
          <Stack spacing={1} width={"100%"}>
            <Skeleton width={"100%"} height={200} />
          </Stack>
        )}
      </div>
    </div>
  );
};

export default User;
