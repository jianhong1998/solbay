import { FC } from 'react';

import { GeneralClassName } from '@/constants/class-name.constant';

import Loading from './loading';

const FullPageLoading: FC = () => {
  return (
    <div className={GeneralClassName.FIXED_CENTER}>
      <Loading
        size="lg"
        loadingStyle="spinner"
      />
    </div>
  );
};

export default FullPageLoading;
