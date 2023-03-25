import type { TaxedIncome } from '@prisma/client';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, Outlet, Link, useLoaderData, useParams } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { formatTaxedIncomeModelDate } from '~/utils/dates';
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
    where: {
      userId: authenticated?.record?.id,
      year: Number(params.year),
      taxablePeriod: Number(params.quarter),
    },
  });

  return { taxedIncomes };
};

export const action: ActionFunction = async ({ request }) => {
  const authenticated = await authenticator.isAuthenticated(request, {
    failureRedirect: '/failure',
  });

  const form = await request.formData();
  const taxedIncomeId = form.get('taxedIncomeId');

  if (taxedIncomeId) {
    await db.taxedIncome.delete({
      where: {
        id: taxedIncomeId,
      },
    });
  }

  return null;
};

export default function Quarter() {
  const params = useParams();
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      {data.taxedIncomes.map((taxedIncome) => (
        <div key={taxedIncome.id}>
          {taxedIncome.amount} - {formatTaxedIncomeModelDate(taxedIncome)}
          <Form method="post">
            <input type="hidden" name="taxedIncomeId" value={taxedIncome.id} />
            <button className="btn btn-wide btn-outline">Delete</button>
          </Form>
          <br />
        </div>
      ))}

      <Link to="new">New</Link>

      <Outlet />
    </div>
  );
}
