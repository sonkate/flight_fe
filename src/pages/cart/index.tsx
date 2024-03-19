import React, { useState } from "react";
import CartMainView from "./CartMainView";
import {
  ILabelValue,
  ICustomerInput,
  IPaymentMethod,
  IVoucher,
} from "pages/interface";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Paypal } from "assets";
import { useAppSelector } from "app/hooks";
import { cartSelector } from "app/selectors";

const Cart = () => {
  const cart = useAppSelector(cartSelector);
  const voucherData = cart.voucherData as IVoucher;
  const customerInputs: ICustomerInput[] = [
    {
      name: "firstname",
      required: true,
      label: "First name",
    },
    {
      name: "lastname",
      required: true,
      label: "Last name",
    },
    {
      name: "email",
      required: true,
      label: "Email",
    },
    {
      name: "phone",
      required: true,
      label: "Phone number",
    },
  ];
  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const handleSelectPaymentMethod = (value: number) => setPaymentMethod(value);

  const paymentMethodData: IPaymentMethod[] = [
    { icon: <LocalAtmIcon />, name: "Cash" },
    { icon: <AccountBalanceIcon />, name: "Internet Banking" },
    { icon: <CreditCardIcon />, name: "Credit / Debit card" },
    { icon: <Paypal />, name: "Paypal" },
  ];

  const billData: ILabelValue[] = [
    { label: "Tickets' price", value: voucherData?.salePrice },
    { label: "Service fee", value: 3.65 },
    { label: "Discount", value: 0 },
    { label: "Total", value: voucherData?.salePrice + 3.65 },
  ];

  return (
    <CartMainView
      passengersInput={customerInputs}
      paymentMethod={paymentMethod}
      handleSelectPaymentMethod={handleSelectPaymentMethod}
      paymentMethodData={paymentMethodData}
      billData={billData}
      voucherData={voucherData}
    />
  );
};

export default Cart;
