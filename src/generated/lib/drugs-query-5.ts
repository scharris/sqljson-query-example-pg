

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResource = "drugs-query-5.sql";


// query parameters
export const catCodeParam = 'catCode';

// Below are types representing the result data for the generated query, with top-level type first.
export interface Drug
{
  drugName: string;
  categoryCode: string;
  registeredByAnalyst: string;
  primaryCompound: Compound;
  advisories: Advisory[];
}

export interface Compound
{
  compoundId: number;
  compoundDisplayName: string | null;
  enteredByAnalyst: string;
  approvedByAnalyst: string | null;
}

export interface Advisory
{
  advisoryTypeId: number;
  advisoryText: string;
  advisoryTypeName: string;
  advisoryTypeAuthorityName: string;
}
