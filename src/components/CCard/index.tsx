import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Grid } from "@mui/material";

interface DataProps {
  id: string;
  voucherCode: string;
  expirationDate: string;
  numberOfVoucher: number;
  status: string;
  originalPrice: number;
  salePrice: number;
  category: string;
  brand: string;
  location: string;
  description: string;
  image: string;
}

interface Props {
  data: DataProps;
  handleDetailClick?: (id: string) => void;
  handleBuyClick?: (id: string) => void;
}

export default function CCard({
  data,
  handleDetailClick,
  handleBuyClick,
}: Props) {
  const {
    id,
    voucherCode,
    expirationDate,
    numberOfVoucher,
    status,
    originalPrice,
    salePrice,
    category,
    brand,
    location,
    description,
    image,
  } = data;
  return (
    <Card sx={{ maxWidth: 345, minHeight: 450 }}>
      <CardMedia sx={{ height: 140 }} image={image} title='green iguana' />
      <CardContent>
        <Typography gutterBottom variant='h6' component='div' height={70}>
          {brand}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Category: {category}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Location: {location}
        </Typography>
        <Box sx={{ m: 3 }} />
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={4}>
            <Typography
              sx={{ textDecoration: "line-through" }}
              variant='h6'
              color='text.disabled'
            >
              ${originalPrice}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h4' color='success.main'>
              ${salePrice}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          size='small'
          onClick={() => handleBuyClick && handleBuyClick(id)}
        >
          Buy
        </Button>
        <Button
          size='small'
          onClick={() => handleDetailClick && handleDetailClick(id)}
        >
          Show More
        </Button>
      </CardActions>
    </Card>
  );
}
