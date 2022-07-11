// Packages and Dependencies
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
// Components
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
// Cookies
import Cookies from "js-cookie";
import { Store } from "../../redux/store";

const Hesap = () => {
  const [userToken, setUserToken] = useState(null);
  const [userOrders, setUserOrders] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setUserToken(user?.token);
    }
  }, []);

  useEffect(() => {
    const getUserOrders = async () => {
      setIsFetching(true);
      try {
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userId,
          },
          { headers: { authorization: `Bearer ${userToken}` } }
        );
        setUserOrders(userOrder?.data?.order);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };

    getUserOrders();
  }, [userId, userToken]);

  return (
    <div>
      <Nav color={"#c9184a"} />
      <div>
        <UserProfile
          orders={userOrders}
          isFetching={isFetching}
          bookings={userInfo?.bookings}
          user={userInfo}
        />
      </div>
    </div>
  );
};

export default Hesap;
