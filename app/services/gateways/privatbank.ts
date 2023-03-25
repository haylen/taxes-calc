const BASE_URL = 'https://api.privatbank.ua/p24api/';

export const CURRENCY_USD = 'USD';

export type PrivatBankExchangeRate = {
  baseCurrency: string;
  currency?: string;
  saleRate?: number;
  saleRateNB?: number;
  purchaseRate: number;
  purchaseRateNB: number;
};

export type PrivatBankExchangeRatesResponse = {
  date: string;
  bank: string;
  baseCurrency: number;
  baseCurrencyLit: string;
  exchangeRate: PrivatBankExchangeRate[];
};

export const fetchExchangeRatesForToday =
  (): Promise<PrivatBankExchangeRatesResponse> => {
    /*
     * "today" will have a date in DD/MM/YYYY format
     * "formattedToday" - DD.MM.YYYY
     */
    const today = new Date().toLocaleDateString('ua');
    const formattedToday = today.replaceAll('/', '.');

    return fetchExchangeRatesForDate(formattedToday);
  };

export const fetchExchangeRatesForDate = async (
  date: string,
): Promise<PrivatBankExchangeRatesResponse> => {
  const bankResponse = await fetch(
    `${BASE_URL}exchange_rates?json&date=${date}`,
    { cache: 'force-cache' },
  );

  // return Promise.resolve({
  //   exchangeRate: [
  //     {
  //       currency: CURRENCY_USD,
  //       purchaseRateNB: 100,
  //       purchaseRate: 150,
  //     },
  //   ],
  // });

  return bankResponse.json();
};
