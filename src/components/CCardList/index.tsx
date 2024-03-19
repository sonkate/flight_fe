import Grid from '@mui/material/Grid';
import CCard from 'components/CCard';
import React from 'react';

interface Props {
  data: any[];
  handleDetailClick?: (id: string) => void;
  handleBuyClick?: (id: string) => Promise<void>;
}

const CCardList = ({ data, handleBuyClick, handleDetailClick }: Props) => {
  return (
    <div>
      <Grid container spacing={2} columns={12}>
        {data.map((element) => {
          return (
            <Grid item xs={3}>
              <CCard
                data={element}
                handleBuyClick={handleBuyClick}
                handleDetailClick={handleDetailClick}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default CCardList;
