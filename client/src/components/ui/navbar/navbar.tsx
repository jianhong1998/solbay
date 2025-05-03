'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useMemo } from 'react';

import { useAuthModule } from '@/hooks/auth-module/auth-module';

import NavbarTriggerButton from '../buttons/nav-button/navbar-button';

type NavBarProviderProps = {
  links: Array<{ label: string; path: string }>;
  children: ReactNode;
};

const NavBarProvider: FC<NavBarProviderProps> = ({ links, children }) => {
  const pathname = usePathname();
  const { Button: AuthButton } = useAuthModule();

  const toggleCheckBoxId = useMemo(() => 'navbar-drawer-toggle', []);

  return (
    <div className="drawer">
      <input
        id={toggleCheckBoxId}
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        <div className="flex navbar bg-base-300 dark:text-neutral-content w-full lg:px-3 sticky top-0 z-10">
          <div className="flex-1">
            <NavbarTriggerButton labelHtmlFor={toggleCheckBoxId} />
            <Link
              className="btn btn-ghost normal-case text-xl"
              href="/"
            >
              Solbay
            </Link>
            <ul className="menu menu-horizontal px-1 space-x-2 hidden lg:flex">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={pathname.startsWith(path) ? 'active' : ''}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-none space-x-2">
            <AuthButton />
          </div>
        </div>
        {/* Page content */}
        {children}
      </div>

      {/* [Mobile only] Side bar */}
      <div className="drawer-side z-20">
        <label
          htmlFor={toggleCheckBoxId}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-60 p4 pt-6">
          <li>
            <Link
              className={pathname === '/' ? 'active' : ''}
              href="/"
            >
              Home
            </Link>
          </li>
          {links.map(({ label, path }) => (
            <li key={path}>
              <Link
                className={pathname.startsWith(path) ? 'active' : ''}
                href={path}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavBarProvider;
