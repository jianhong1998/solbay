import { FC } from 'react';

const LoginRequired: FC = () => {
  return (
    <div className="text-lg text-center font-bold text-red-500 mt-5">
      Please login to view order history
    </div>
  );
};

export default LoginRequired;
