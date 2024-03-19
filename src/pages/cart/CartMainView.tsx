import React from "react";
import WrapperContainer from "components/WrapperContainer";
import CartSection from "./CartSection";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  IBooking,
  IBookingData,
  ILabelValue,
  ICustomerInput,
  IPaymentMethod,
  IVoucher,
} from "pages/interface";
import { useAppDispatch } from "app/hooks";
import { handleLoading } from "app/globalSlice";
import CInput from "components/CInput";
import {
  FormControl,
  FormGroup,
  InputLabel,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import CButton from "components/CButton";
import { formatPrice } from "utils/helpers/formatPrice";
import moment from "moment";
import { addBooking, approvePaypalOrder, createPaypalOrder } from "./cartSlice";
import customToast, { ToastType } from "components/CustomToast/customToast";
import { PageUrl } from "configuration/enum";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { OnApproveData } from "@paypal/paypal-js";
import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";

interface Props {
  passengersInput: ICustomerInput[];
  paymentMethod: number;
  handleSelectPaymentMethod: (value: number) => void;
  paymentMethodData: IPaymentMethod[];
  billData: ILabelValue[];
  voucherData: IVoucher;
}

const defaultValues: IBooking = {
  email: "",
  firstname: "",
  lastname: "",
  paymentMethod: 0,
  phone: "",
  checked_in_luggage: "no",
};

const CartMainView = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    passengersInput,
    handleSelectPaymentMethod,
    paymentMethod,
    paymentMethodData,
    billData,
    voucherData,
  } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<IBooking>({ defaultValues });
  const submitFormHandler: SubmitHandler<IBooking> = async (data) => {
    dispatch(handleLoading(true));
    const { checked_in_luggage, ...restData } = data;
    const bookingData: IBookingData = {
      ...restData,
      luggage: checked_in_luggage === "no" ? false : true,
      ticketId: voucherData.id,
    };

    const res: any = await dispatch(addBooking(bookingData)).unwrap();
    const { success, message } = res;
    if (success) {
      customToast(ToastType.SUCCESS, message);
      navigate(`/${PageUrl.ACCOUNT}`);
    } else {
      customToast(ToastType.ERROR, message);
    }
    dispatch(handleLoading(false));
  };
  const errorFormHandler: SubmitErrorHandler<IBooking> = (_, event) => {
    event?.target.classList.add("wasvalidated");
  };
  const {
    id,
    voucherCode,
    expirationDate,
    numberOfProduct,
    status,
    originalPrice,
    salePrice,
    category,
    brand,
    location,
    description,
    image,
  } = voucherData;
  const isPaidWithPaypal = watch("paymentMethod") === 4;

  const createOrder = async () => {
    try {
      const paypalData = {
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: billData[3].value,
            },
          },
        ],
        intent: "CAPTURE",
      };
      const response: any = await dispatch(
        createPaypalOrder(paypalData)
      ).unwrap();

      return response.id;
    } catch (err) {
      console.error(err);
    }
  };

  const onApprove = async (data: OnApproveData) => {
    try {
      const paypalData: { orderId: string } = {
        orderId: data.orderID,
      };
      const response: any = await dispatch(
        approvePaypalOrder(paypalData)
      ).unwrap();

      if (response && response.status === "COMPLETED") {
        const data = getValues();
        submitFormHandler(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='cart'>
      <WrapperContainer>
        <p
          className='d-flex align-items-center gap-2 mb-3'
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon />
          Back
        </p>
        <form
          action='#'
          noValidate
          method='POST'
          className='row m-0'
          onSubmit={handleSubmit(submitFormHandler, errorFormHandler)}
        >
          <div className='col-9 p-0 pe-3'>
            <div className='cart-detail'>
              <CartSection title='Customer Information' order={1}>
                <div
                  className='row m-0 justify-content-between'
                  style={{ gap: "16px 0" }}
                >
                  {passengersInput.map((input) => {
                    const { label, name, required } = input;

                    return (
                      <FormControl key={name} className='passenger-input'>
                        <Controller
                          control={control}
                          name={name}
                          rules={
                            required
                              ? {
                                  required: {
                                    value: true,
                                    message: "This field is required",
                                  },
                                }
                              : {}
                          }
                          render={({ field }) => (
                            <FormGroup className='passenger-group'>
                              <InputLabel htmlFor={name}>
                                <span>
                                  {label} ({required ? "Required" : "Optional"})
                                </span>
                              </InputLabel>
                              <CInput
                                {...field}
                                size='small'
                                id={name}
                                valid={!errors[name]}
                              />
                            </FormGroup>
                          )}
                        />
                        {!!errors[name] && (
                          <FormHelperText className='ms-0' error>
                            {errors[name]?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  })}
                </div>
              </CartSection>

              <CartSection title='Your Item' order={3}>
                <Card
                  variant='outlined'
                  orientation='horizontal'
                  sx={{
                    width: "500px",
                    "&:hover": {
                      boxShadow: "md",
                      borderColor: "neutral.outlinedHoverBorder",
                    },
                  }}
                >
                  <AspectRatio ratio='1' sx={{ width: 90 }}>
                    <img src={image} loading='lazy' alt='' />
                  </AspectRatio>
                  <CardContent>
                    <Typography level='title-lg' id='card-description'>
                      {brand}
                    </Typography>
                    <Typography
                      level='body-sm'
                      aria-describedby='card-description'
                      mb={1}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Link
                        overlay
                        underline='none'
                        href='#interactive-card'
                        sx={{ color: "text.tertiary" }}
                      >
                        Location: {location}
                      </Link>
                      <Link
                        overlay
                        underline='none'
                        href='#interactive-card'
                        sx={{ color: "text.tertiary" }}
                      >
                        Category: {category}
                      </Link>
                    </Typography>
                    <Chip
                      variant='outlined'
                      color={status == "inactive" ? "danger" : "primary"}
                      size='sm'
                      sx={{ pointerEvents: "none" }}
                    >
                      {status == "inactive"
                        ? "the voucher was sold out"
                        : `the voucher will be expired in ${expirationDate}`}
                    </Chip>
                  </CardContent>
                </Card>
              </CartSection>

              <CartSection title='Payment' order={4}>
                <div className='payment-wrapper'>
                  {paymentMethodData.map((data, idx) => (
                    <div
                      className='payment-method'
                      key={data.name}
                      aria-selected={idx === paymentMethod}
                      onClick={() => {
                        handleSelectPaymentMethod(idx);
                        setValue("paymentMethod", idx);
                      }}
                    >
                      <span>{data.name}</span>
                      {data.icon}
                    </div>
                  ))}
                </div>
              </CartSection>
            </div>
          </div>
          <div className='col p-0'>
            <div className='cart-overview'>
              <section className='cart-bill'>
                <h4>Your Bill</h4>
                <div className='cart-bill__detail mb-3'>
                  {billData.map((data, idx) => (
                    <div className='bill-price' key={data.label}>
                      <span className='bill-price--label'>{data.label}</span>
                      <span
                        className={`bill-price--value ${
                          idx === 3 ? "red-value" : ""
                        }`}
                      >
                        {idx === 2 ? "-" : ""}${formatPrice(data.value)}
                      </span>
                    </div>
                  ))}
                </div>
                {isPaidWithPaypal ? (
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
                    }}
                  >
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <CButton type='submit' className='w-100'>
                    Proceed Payment
                  </CButton>
                )}
              </section>
            </div>
          </div>
        </form>
      </WrapperContainer>
    </main>
  );
};

export default CartMainView;
