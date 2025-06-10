'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes, forwardRef, useEffect, useState } from 'react';

import DangerButton from '@/components/ui/buttons/danger-button';
import PrimaryButton from '@/components/ui/buttons/primary-button';
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
    return (
      <PrimaryButton
        {...props}
        ref={ref}
        className={className}
        onClick={loginHandler}
        loading={isLoading}
      >
        Login
      </PrimaryButton>
    );
  },
);

const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ logoutHandler, className, isLoading, ...props }, ref) => {
    return (
      <DangerButton
        {...props}
        ref={ref}
        className={className}
        onClick={logoutHandler}
        loading={isLoading}
      >
        Logout
      </DangerButton>
    );
  },
);

export const useAuthModule = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const router = useRouter();

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
    if (!connected || isVerifyTokenPending) return;

    if (verifyTokenData) {
      setIsLogin(true);
      return;
    }

    loginFn().then(() => {
      setIsLogin(true);
    });
  }, [connected, verifyTokenData, isVerifyTokenPending, loginFn, router]);

  useEffect(() => {
    router.refresh();
  }, [isLogin, router]);

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
