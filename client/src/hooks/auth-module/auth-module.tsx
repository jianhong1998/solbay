'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ButtonHTMLAttributes, forwardRef, useEffect, useState } from 'react';

import { useLogin } from '@/hooks/queries/auth/login';
import { useLogout } from '@/hooks/queries/auth/logout';
import { useVerifyToken } from '@/hooks/queries/auth/verify-token';

type AuthButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

type LoginButtonProps = AuthButtonProps & {
  loginHandler: () => Promise<void>;
  isLoading: boolean;
};

type LogoutButtonProps = AuthButtonProps & {
  logoutHandler: () => Promise<void>;
  isLoading: boolean;
};

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ className, loginHandler, isLoading, ...props }, ref) => {
    const disabledClassName = isLoading ? 'btn-disabled' : '';

    return (
      <button
        {...props}
        ref={ref}
        className={['btn btn-primary', className, disabledClassName].join(' ')}
        onClick={loginHandler}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Login
      </button>
    );
  },
);

const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ logoutHandler, className, isLoading, ...props }, ref) => {
    const disabledClassName = isLoading ? 'btn-disabled' : '';

    return (
      <button
        {...props}
        ref={ref}
        className={[
          'btn btn-error btn-outline',
          className,
          disabledClassName,
        ].join(' ')}
        onClick={logoutHandler}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Logout
      </button>
    );
  },
);

export const useAuthModule = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const { connected, disconnect } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const { mutateAsync: loginFn, isPending: isLoginPending } = useLogin();
  const { mutateAsync: logoutFn, isPending: isLogoutPending } = useLogout();
  const { data: verifyTokenData, isPending: isVerifyTokenPending } =
    useVerifyToken();

  const isLoading = isLoginPending || isLogoutPending;

  const loginHander = async () => {
    if (!connected) {
      setWalletModalVisible(true);
    }
  };

  const logoutHandler = async () => {
    await logoutFn();
    await disconnect();
    setIsLogin(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (isVerifyTokenPending) return;

    if (verifyTokenData) {
      setIsLogin(true);
      return;
    }

    loginFn().then(() => {
      setIsLogin(true);
    });
  }, [connected, verifyTokenData, isVerifyTokenPending, loginFn]);

  const loginButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ ...props }, ref) => {
      return (
        <LogoutButton
          {...props}
          logoutHandler={logoutHandler}
          isLoading={isLoading}
          ref={ref}
        />
      );
    },
  );

  const logoutButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ ...props }, ref) => {
      return (
        <LoginButton
          {...props}
          loginHandler={loginHander}
          isLoading={isLoading}
          ref={ref}
        />
      );
    },
  );

  return {
    isUserLoggedIn: isLogin,
    Button: isLogin ? loginButton : logoutButton,
  };
};
