import type { TaxedIncome } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import {
  Outlet,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';

type LoaderData = {
  taxedIncomes: Array<TaxedIncome>;
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const authenticated = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const taxedIncomes = await db.taxedIncome.findMany({
    where: { userId: authenticated?.record?.id, year: Number(params.year) },
  });

  return { taxedIncomes };
};

const getAvailableQuarters = (selectedYear: number) => {
  const today = new Date();

  if (today.getFullYear() !== selectedYear) {
    return [1, 2, 3, 4];
  }

  const secondQuarterStart = new Date();
  secondQuarterStart.setMonth(3, 1);

  if (today < secondQuarterStart) {
    return [1];
  }

  const thirdQuarterStart = new Date();
  thirdQuarterStart.setMonth(6, 1);

  if (today < secondQuarterStart) {
    return [1, 2];
  }

  const fourthQuarterStart = new Date();
  fourthQuarterStart.setMonth(9, 1);

  if (today < fourthQuarterStart) {
    return [1, 2, 3];
  }

  return [1, 2, 3, 4];
};

export default function Years() {
  const navigate = useNavigate();

  const params = useParams();
  const data = useLoaderData<LoaderData>();

  const selectedQuarter = Number(params.quarter);
  const quarters = getAvailableQuarters(params.year);

  const handleQuarterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`${event.target.value}`);
  };

  return (
    <div>
      <div className="btn-group">
        {quarters.map((q) => (
          <input
            key={q}
            value={q}
            data-title={q}
            type="radio"
            name="options"
            className="btn"
            checked={selectedQuarter === q}
            onChange={handleQuarterChange}
          />
        ))}
      </div>

      <Outlet />
    </div>
  );
}
