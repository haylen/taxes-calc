import { Form, Link } from '@remix-run/react';

type Props = {
  avatarSrc: string;
  email: string;
  children: JSX.Element | JSX.Element[];
};

const Layout = ({ avatarSrc, email, children }: Props) => (
  <div className="bg-base-100">
    <div className="navbar bg-base-100 drop-shadow-md">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost normal-case text-xl text-accent-focus"
          >
            Shalfeii
          </Link>
        </div>
        <div className="flex items-center flex-none gap-2">
          <span className="hidden sm:block text-accent font-medium text-sm">
            {email}
          </span>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src={avatarSrc}
                  referrerPolicy="no-referrer"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
            >
              <li>
                <Form action="/logout" method="post">
                  <button type="submit" className="w-full h-full text-left">
                    Logout
                  </button>
                </Form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto py-10 px-5">{children}</div>
  </div>
);

export default Layout;
