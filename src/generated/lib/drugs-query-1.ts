

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResource = "drugs-query-1.sql";


// query parameters
export const catCodeParam = 'catCode';

// Below are types representing the result data for the generated query, with top-level type first.
export interface Drug
{
  drugName: string;
  categoryCode: string;
  cidPlus1000: number | null;
}
