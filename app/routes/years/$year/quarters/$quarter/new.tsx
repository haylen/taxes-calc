import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useParams } from '@remix-run/react';
import { useRef, useState } from 'react';
import { authenticator } from '~/services/auth.server';
import { db } from '~/utils/db.server';

const TAX_RATE = 0.05;

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const respond = (data: ActionData) => json(data, { status: 200 });

export const action: ActionFunction = async ({ request, params }) => {
  const authenticated = await authenticator.isAuthenticated(request, {
    failureRedirect: '/failure',
  });

  const form = await request.formData();
  const method = form.get('method');

  switch (method) {
    case 'updateDate': {
      let date = form.get('date');

      if (date) {
        console.error('date1', date);
        // date = date.replaceAll('-', '');
        date = `${date.split('-')[2]}.${date.split('-')[1]}.${
          date.split('-')[0]
        }`;
        console.error('date2', date);
      }

      const url = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${date}`;
      // const url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${date}&json`;
      const res = await fetch(url);
      console.error('res', res);
      const json = await res.json();
      console.error('json', json);

      const rate = json?.date
        ? json.exchangeRate.find((rate) => rate.currency === 'USD')?.saleRateNB
        : 'ERROR';

      return respond({ exchangeRate: rate });
    }
    case 'create': {
      const amount = form.get('amount');
      const date = form.get('date');

      const taxedIncome = await db.taxedIncome.create({
        data: {
          amount: amount,
          taxRate: TAX_RATE,
          currencyCode: 'usd',
          currencyExchangeProviderBank: 'nbu',
          day: Number(date.split('-')[2]),
          month: Number(date.split('-')[1]),
          year: Number(date.split('-')[0]),
          taxablePeriod: +params.quarter,
          userId: authenticated.record.id,
        },
      });

      return null;
    }
    default:
      return null;
  }
};

export default function Years() {
  const dateFormSubmitRef = useRef();
  const amountInputRef = useRef();
  const params = useParams();

  const [date, setDate] = useState('');

  const actionData = useActionData<ActionData>();

  const [totalTaxData, setTotalTaxData] = useState({});

  const recalculateTotalTaxData = () => {
    const ceil = (number) => Math.ceil(number * 100) / 100;

    const totalUah = amountInputRef.current.value * actionData.exchangeRate;
    const totalUahTax = totalUah * TAX_RATE;

    setTotalTaxData({
      totalUah: ceil(totalUah),
      totalUahTax: ceil(totalUahTax),
    });
  };

  const handleDateInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    let input = event.currentTarget; // get the input
    let value = input.value;

    if (value) {
      setDate(value);
      console.error('value', value);
      dateFormSubmitRef.current.click();
    }
  };

  const handleAmountInputChange = (event) => {
    if (event) recalculateTotalTaxData();
  };

  return (
    <div>
      This is NEW for {params.year} year
      <Form method="post">
        <input type="hidden" name="method" value="updateDate" />

        <div>
          <label>
            Name:{' '}
            <input
              type="date"
              name="date"
              defaultValue={undefined}
              aria-invalid={undefined}
              aria-errormessage={undefined}
              onChange={handleDateInputBlur}
            />
          </label>

          <input
            type="submit"
            style={{ display: 'none' }}
            ref={dateFormSubmitRef}
          />
        </div>
      </Form>
      <Form method="post">
        <input type="hidden" name="method" value="create" />
        <input type="hidden" name="date" value={date} />

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">What is your name?</span>
            <span className="label-text-alt">Alt label</span>
          </label>
          <input
            ref={amountInputRef}
            type="number"
            name="amount"
            min="1"
            max="999999999"
            placeholder="Amount"
            defaultValue={undefined}
            aria-invalid={undefined}
            aria-errormessage={undefined}
            disabled={!actionData?.exchangeRate}
            onChange={handleAmountInputChange}
            className="input input-bordered w-full max-w-xs"
          />
          <label className="label">
            <span className="label-text-alt">Alt label</span>
            <span className="label-text-alt">Alt label</span>
          </label>
        </div>

        <button type="submit">Save</button>
      </Form>
      {actionData?.exchangeRate
        ? `exchangeRate: ${actionData.exchangeRate}`
        : 'Not provided'}
      <br />
      Total in UAH: {totalTaxData.totalUah}
      <br />
      Total tax in UAH: {totalTaxData.totalUahTax}
    </div>
  );
}
