import { NextPage } from 'next';
import React from 'react';

import BuyerProductDetailsDashboard from '@/components/dashboard/buyer/product-details-dashboard/buyer-product-details-dashboard';
import { PageContext } from '@/types/page-context.type';

type BuyerProductDetailsPageProps = {
  id: string;
};

const BuyerProductDetailsPage: NextPage<
  PageContext<BuyerProductDetailsPageProps>
> = async ({ params }) => {
  const { id } = await params;

  return <BuyerProductDetailsDashboard productId={id} />;
};

export default BuyerProductDetailsPage;
