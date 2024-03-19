import CButton from "components/CButton";
import CSelect from "components/CSelect";
import WrapperContainer from "components/WrapperContainer";
import { ILogo, ITicketData } from "pages/interface";
import { useForm, Controller } from "react-hook-form";
import { Autoplay, Pagination, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { SelectDataType } from "utils/base/model";
import SearchIcon from "@mui/icons-material/Search";
import GroupInput, { GroupInputProps } from "components/GroupInput/GroupInput";
import moment from "moment";
import { FormControl } from "@mui/material";
import CCardList from "components/CCardList";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

interface Props {
  bannerList: string[];
  airlinesLogo: ILogo[];
  ticketType: SelectDataType[];
  ticketData: SelectDataType[];
  searchTicket: (data: ITicketData) => Promise<void>;
  flightListData: any[];
  handleSelectedTicket: (id: string) => void;
  handleTicketContinue: (id: string) => Promise<void>;
}

interface ISelectTicket {
  name: keyof ITicketData;
  options: SelectDataType[];
}

const HomeMainView = (props: Props) => {
  const {
    bannerList,
    ticketData,
    ticketType,
    searchTicket,
    airlinesLogo,
    handleSelectedTicket,
    flightListData: voucherList,
    handleTicketContinue,
  } = props;
  const defaultValues: ITicketData = {
    type: ticketType[0].id,
    classType: ticketData[0].id,
    fromLocation: "",
    toLocation: "",
    startDate: moment(new Date()),
    endDate: moment(new Date()),
  };
  const { control, handleSubmit } = useForm({ defaultValues });
  const selectTicket: ISelectTicket[] = [
    { name: "type", options: ticketType },
    { name: "classType", options: ticketData },
  ];
  const filterTicket: GroupInputProps[] = [
    {
      label: "Brand",
      type: "text",
      groupInputData: [{ name: "fromLocation", placeholder: "Brand" }],
      control,
    },
    {
      label: "Store Location",
      type: "text",
      groupInputData: [{ name: "fromLocation", placeholder: "Store location" }],
      control,
    },
    {
      label: "Expiration Date",
      type: "date",
      groupInputData: [
        { name: "startDate", placeholder: "From Date" },
        { name: "endDate", placeholder: "To Date" },
      ],
      control,
    },
  ];

  return (
    <div className='home'>
      <div className='home-banner'>
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay, EffectFade]}
        >
          {bannerList.map((value, idx) => (
            <SwiperSlide key={idx}>
              <img src={value} alt='' />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='home-banner__content'>
          <p>Unlock Savings, Gift Happiness: Voucher Power!</p>
          <h1>Gift Vouchers: Your Passport to Savings and Smiles!</h1>
        </div>

        <div className='home-banner__search'>
          <div className='search-wrapper'>
            <form
              action='#'
              method='POST'
              noValidate
              onSubmit={handleSubmit(searchTicket)}
            >
              <div className='d-flex align-items-center gap-3 mb-4'>
                {selectTicket.map((value) => (
                  <FormControl className='select-form-control' key={value.name}>
                    <Controller
                      key={value.name}
                      name={value.name}
                      control={control}
                      render={({ field }) => (
                        <CSelect {...field} options={value.options} />
                      )}
                    />
                  </FormControl>
                ))}
              </div>

              <div
                className='d-flex align-items-center gap-3'
                style={{ height: "48px" }}
              >
                {filterTicket.map((data, idx) => (
                  <GroupInput key={idx} {...data} />
                ))}
                <CButton
                  sx={{ height: "48px" }}
                  className='d-flex align-items-center gap-1'
                >
                  <SearchIcon />
                  Search
                </CButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      <main>
        <section className='home-logos'>
          <WrapperContainer>
            <div className='logo-list'>
              <CardGiftcardIcon />
              <FavoriteIcon />
              <LoyaltyIcon />
              <CheckroomIcon />
              <AutoStoriesIcon />
              <SmartphoneIcon />
            </div>
          </WrapperContainer>
        </section>

        <WrapperContainer>
          <section className='home-flight'>
            <h4 className='mb-4'>Offers for Trending Voucher</h4>

            <div className='home-flight-list'>
              <CCardList
                data={voucherList}
                handleDetailClick={handleSelectedTicket}
                handleBuyClick={handleTicketContinue}
              />
            </div>
            <div className='home-flight--support mt-4'>
              <span>
                *Fares displayed have been collected within the last 12shrs and
                may no longer be available at time of doing transaction.
              </span>
            </div>
          </section>
        </WrapperContainer>
      </main>
    </div>
  );
};

export default HomeMainView;
