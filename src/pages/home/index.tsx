import { useEffect, useMemo, useState } from "react";
import HomeMainView from "./HomeMainView";
import {
  Bamboo,
  Banner1,
  Banner2,
  Banner3,
  Banner4,
  JetStar,
  VietJet,
  VietnamAirLine,
} from "assets";
import { SelectDataType } from "utils/base/model";
import { ILogo, ITicketData } from "pages/interface";
import TicketDetail from "./TicketDetail";
import { useNavigate } from "react-router-dom";
import { PageUrl } from "configuration/enum";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getAllVouchers } from "./homeSlice";
import { authSelector, homeSelector } from "app/selectors";
import { formatPrice } from "utils/helpers/formatPrice";
import {
  handleFormOpenChange,
  handleFormTypeChange,
  handleLoading,
} from "app/globalSlice";
import { addItemToCart, handleSaveTicketData } from "pages/cart/cartSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const home = useAppSelector(homeSelector);
  const auth = useAppSelector(authSelector);
  const { voucherList } = home;
  const { user } = auth;
  const homeBanners: string[] = [Banner1, Banner2, Banner3, Banner4];
  const airlinesLogo: ILogo[] = [
    { name: "Vietnam Airlines", img: VietnamAirLine },
    { name: "Vietjet", img: VietJet },
    { name: "Bamboo Airways", img: Bamboo },
    { name: "JetStar Pacific", img: JetStar },
  ];
  const ticketType: SelectDataType[] = [
    { id: "one", value: "active" },
    { id: "two", value: "inactive" },
  ];
  const ticketData: SelectDataType[] = [
    { id: "clothes", value: "Clothes" },
    { id: "book", value: "Books" },
    { id: "smartphone", value: "Smartphones" },
  ];

  const searchTicket = async (data: ITicketData) => {};

  // Ticket detail
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");

  const handleSelectedVoucher = (id: string) => {
    setSelectedVoucher(id);
  };
  const handleCloseVoucher = () => setSelectedVoucher("");
  const handleContinue = async (id: string) => {
    if (user === "") {
      dispatch(handleFormOpenChange(true));
      dispatch(handleFormTypeChange("signin"));
    } else {
      dispatch(handleLoading(true));
      const res: any = await dispatch(addItemToCart(id)).unwrap();
      const { success, data } = res;
      if (success) {
        dispatch(handleSaveTicketData(data));
      }
      dispatch(handleLoading(false));
      navigate(PageUrl.CHECKOUT);
    }
  };
  const handledVoucherList = voucherList.map((voucher) => {
    return {
      ...voucher,
      expirationDate: `${moment(voucher.expirationDate).format(
        "DD/MM/YYYY HH:mm"
      )}`,
    };
  });
  const selectedVoucherData = useMemo(() => {
    return handledVoucherList.find((ticket) => ticket.id === selectedVoucher);
  }, [selectedVoucher, handledVoucherList]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllVouchers());
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <HomeMainView
        bannerList={homeBanners}
        ticketData={ticketData}
        ticketType={ticketType}
        searchTicket={searchTicket}
        airlinesLogo={airlinesLogo}
        handleSelectedTicket={handleSelectedVoucher}
        flightListData={handledVoucherList}
        handleTicketContinue={handleContinue}
      />
      {selectedVoucherData && (
        <TicketDetail
          data={selectedVoucherData}
          handleClose={handleCloseVoucher}
          handleContinue={handleContinue}
          open={selectedVoucher !== ""}
        />
      )}
    </>
  );
};

export default Home;
