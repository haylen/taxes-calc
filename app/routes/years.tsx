import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from '@remix-run/react';
import { useRef } from 'react';

import type { AuthenticatedUser } from '~/services/auth.server';
import Layout from '~/components/Layout';
import { authenticator } from '~/services/auth.server';
import {
  CURRENCY_USD,
  fetchExchangeRatesForToday,
} from '~/services/gateways/privatbank';
import { getAvailableYears } from '~/utils/dates';

type LoaderData = {
  currentUser: AuthenticatedUser;
  exchangeRateUsdNbu?: number;
  exchangeRateUsdPrivat?: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const currentUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  if (
    !params.year ||
    !params.quarter ||
    !Number.isInteger(Number(params.year)) ||
    !Number.isInteger(Number(params.quarter))
  ) {
    return redirect('/');
  }

  const { exchangeRate } = await fetchExchangeRatesForToday();
  const usdRates = exchangeRate.find((rate) => rate.currency === CURRENCY_USD);

  const data: LoaderData = {
    currentUser,
    exchangeRateUsdNbu: usdRates?.purchaseRateNB,
    exchangeRateUsdPrivat: usdRates?.purchaseRate,
  };

  return data;
};

const Years = () => {
  const navigate = useNavigate();
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const dropdown = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('ua');

  const getYearChangeHandler = (selectedYear: number) => () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    navigate(`/years/${selectedYear}/quarters/${params.quarter}`);
  };

  return (
    <Layout
      avatarSrc={data.currentUser.googleProfile._json.picture}
      email={data.currentUser.record?.email}
    >
      <div className="w-72 bg-neutral rounded-md mb-4 p-5">
        <p className="mb-2 text-neutral-focus text-sm font-semibold">
          USD buy rates for <span className="text-neutral-focus">{today}</span>
        </p>
        <div className="mb-1 flex align-center">
          <p className="w-32 text-neutral-content shrink-0">Privat bank</p>
          <p className="font-bold">{data.exchangeRateUsdPrivat}</p>
        </div>
        <div className="flex align-center">
          <p className="w-32 text-neutral-content shrink-0">NBU</p>
          <p className="font-bold">{data.exchangeRateUsdNbu}</p>
        </div>
      </div>

      <div ref={dropdown} className="dropdown dropdown-bottom mb-2">
        <label tabIndex={0} className="btn w-72">
          Year: {Number(params.year)}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 max-h-64 flex-nowrap overflow-y-auto"
        >
          {getAvailableYears().map((year) => (
            <li key={year}>
              <button
                className="btn btn-ghost"
                onClick={getYearChangeHandler(year)}
              >
                {year}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Outlet />
    </Layout>
  );
};

export default Years;
