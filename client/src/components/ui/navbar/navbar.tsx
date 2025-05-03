'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { useAuthModule } from '@/hooks/auth-module/auth-module';

type NavBarProps = {
  links: Array<{ label: string; path: string }>;
};

const NavBar: FC<NavBarProps> = ({ links }) => {
  const pathname = usePathname();
  const { Button: AuthButton } = useAuthModule();

  return (
    <>
      <div className="flex navbar bg-base-300 dark:text-neutral-content flex-row space-y-0">
        <div className="flex-1">
          <Link
            className="btn btn-ghost normal-case text-xl"
            href="/"
          >
            Solbay
          </Link>
          <ul className="menu menu-horizontal px-1 space-x-2">
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
    </>
  );
};

export default NavBar;
