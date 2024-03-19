import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import CButton from "components/CButton";
import { IVoucherDisplay } from "pages/interface";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";

interface Props {
  data: IVoucherDisplay;
  open: boolean;
  handleClose: () => void;
  handleContinue: (id: string) => Promise<void>;
}

const TicketDetail = (props: Props) => {
  const { data, handleClose, handleContinue, open } = props;
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
  } = data;

  const ticketData = [
    { label: "Experiation Date", value: expirationDate },
    { label: "Amount", value: numberOfProduct },
    { label: "Location", value: location },
    { label: "Status", value: status },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth='xl'
      className='ticket-dialog'
    >
      <DialogTitle className='ticket-dialog-title' id='alert-dialog-title'>
        <div className='ticket-overview'>
          <div className='ticket-date'>{brand}</div>
          <div className='ticket-extra'>
            <TypeSpecimenIcon />
            Category: {category}
          </div>
        </div>
        <IconButton
          className='dialog-title__close p-0'
          disableRipple
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className='ticket-dialog-content'>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={8}>
            <Box
              component='img'
              alt='image relating to voucher'
              src={image}
              sx={{
                width: "100%",
                height: "250px",
                borderRadius: "3%",
              }}
            ></Box>
          </Grid>
          <Grid item xs={4}>
            <div className='ticket-detail'>
              <div className='d-flex flex-column gap-4 my-4'>
                {ticketData.map((data) => (
                  <div key={data.label} className='ticket-detail__info'>
                    <span className='info-label'>{data.label}:</span>
                    <span className='info-value'>{data.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={8}>
            <Rating name='read-only' value={2} readOnly sx={{ m: 2 }} />
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ textAlign: "justify" }}
            >
              <span>Description: </span>
              {description}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={4}>
                <Typography
                  sx={{ textDecoration: "line-through" }}
                  variant='h6'
                  color='text.disabled'
                  alignSelf='center'
                >
                  ${originalPrice}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant='h4'
                  color='success.main'
                  alignSelf='center'
                >
                  ${salePrice}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='ticket-dialog-actions'>
        <CButton
          className='d-flex align-items-center gap-1'
          onClick={() => handleContinue(id)}
          sx={{ paddingX: "14px !important" }}
        >
          Continue <ChevronRightIcon />
        </CButton>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetail;
