import React from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';

import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';

import PageContainer from '../../../components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';

import GeneralCard from 'src/components/apps/ecommerce/productAdd/GeneralCard';
import MediaCard from 'src/components/apps/ecommerce/productAdd/Media';
import VariationCard from 'src/components/apps/ecommerce/productAdd/VariationCard';
import PricingCard from 'src/components/apps/ecommerce/productAdd/Pricing';
import Thumbnail from 'src/components/apps/ecommerce/productAdd/Thumbnail';
import StatusCard from 'src/components/apps/ecommerce/productAdd/Status';
import ProductDetails from 'src/components/apps/ecommerce/productAdd/ProductDetails';
import ProductTemplate from 'src/components/apps/ecommerce/productAdd/ProductTemplate';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Add Product',
  },
];
const EcommerceAddProduct = () => {
  return (
    <PageContainer title="Add Product" description="this is Add Product page">
      {/* breadcrumb */}
      <Breadcrumb title="Add Product" items={BCrumb} />
      <form>
        <Grid container spacing={3}>
          <Grid item lg={8}>
            <Stack spacing={3}>
              <BlankCard>
                <GeneralCard />
              </BlankCard>

              <BlankCard>
                <MediaCard />
              </BlankCard>

              <BlankCard>
                <VariationCard />
              </BlankCard>

              <BlankCard>
                <PricingCard />
              </BlankCard>
            </Stack>


          </Grid>

          <Grid item lg={4}>
            <Stack spacing={3}>
              <BlankCard>
                <Thumbnail />
              </BlankCard>

              <BlankCard>
                <StatusCard />
              </BlankCard>

              <BlankCard>
                <ProductDetails />
              </BlankCard>

              <BlankCard>
                <ProductTemplate />
              </BlankCard>
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" color="primary">Save Changes</Button>
          <Button variant="outlined" color="error">Cancel</Button>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default EcommerceAddProduct;
