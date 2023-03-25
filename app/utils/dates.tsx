import type { TaxedIncome } from '@prisma/client';

const LAST_SUPPORTED_YEAR = 2000;

export const getAvailableYears = () =>
  [...Array(new Date().getFullYear() - LAST_SUPPORTED_YEAR + 1).keys()]
    .map((x) => x + LAST_SUPPORTED_YEAR)
    .reverse();

export const formatTaxedIncomeModelDate = ({ day, month, year }: TaxedIncome) =>
  `${day}.${month}.${year}`;
