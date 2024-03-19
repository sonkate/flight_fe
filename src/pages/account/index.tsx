import { useAppDispatch, useAppSelector } from "app/hooks";
import { accountSelector } from "app/selectors";
import React, { useEffect, useMemo } from "react";
import { getBookingHistory } from "./accountSlice";
import { handleLoading } from "app/globalSlice";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { ITableHeadCell } from "pages/interface";
import CTable from "components/CTable";
import WrapperContainer from "components/WrapperContainer";
import moment from "moment";
import { formatPrice } from "utils/helpers/formatPrice";

const Account = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(accountSelector);
  const { data } = account;

  useEffect(() => {
    dispatch(handleLoading(true));
    try {
      const fetchData = async () => {
        await dispatch(getBookingHistory());
        dispatch(handleLoading(false));
      };

      fetchData();
    } catch (error) {
      dispatch(handleLoading(false));
    }
  }, []);

  const bookingHistoryHeadCells: ITableHeadCell[] = [
    {
      id: "order",
      label: "Order",
      align: "left",
      padding: "normal",
    },
    {
      id: "date",
      label: "Date",
      align: "left",
      padding: "normal",
    },
    {
      id: "passenger",
      label: "Passenger",
      align: "left",
      padding: "normal",
    },
    {
      id: "flight",
      label: "Flight",
      align: "left",
      padding: "normal",
    },
    {
      id: "tickets",
      label: "Tickets",
      align: "left",
      padding: "normal",
    },
    {
      id: "amount",
      label: "Amount",
      align: "left",
      padding: "normal",
    },
  ];
  const bookingHistoryData = useMemo(() => {
    const bookingData = data.map((value, idx) => {
      const { firstname, lastname, items, created_at } = value;
      const { type, classType, price, flightId } = items;

      return {
        order: idx + 1,
        date: moment(new Date(created_at)).format("DD/MM/YYYY HH:mm"),
        passenger: firstname + " " + lastname,
        flight: flightId,
        ticket: `${type} / ${classType}`,
        price: `$${formatPrice(price)}`,
      };
    });

    return bookingData;
  }, [data]);

  return (
    <div className="account">
      <WrapperContainer>
        <h1>
          <AirplanemodeActiveIcon />
          Booking History
        </h1>

        <CTable data={bookingHistoryData} headCells={bookingHistoryHeadCells} />
      </WrapperContainer>
    </div>
  );
};

export default Account;
