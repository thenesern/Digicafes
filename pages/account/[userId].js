// Packages and Dependencies
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// Components
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
// Redux
import { Store } from "../../redux/store";

const Hesap = () => {
  const [userOrders, setUserOrders] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getUserOrders = async () => {
      setIsFetching(true);
      try {
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userInfo?.id,
          },
          { headers: { authorization: `Bearer ${userInfo?.token}` } }
        );
        setUserOrders(userOrder?.data?.order);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };

    getUserOrders();
  }, [userInfo?.id, userInfo?.token]);

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
