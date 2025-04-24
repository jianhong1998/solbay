import { AppHero } from '@/components/ui/ui-layout';
import { PageContext } from '@/types/page-context.type';
import { NextPage } from 'next';

const SellerPage: NextPage<PageContext> = () => {
  return (
    <div>
      <AppHero
        title="Seller"
        subtitle=""
      />
    </div>
  );
};

export default SellerPage;
