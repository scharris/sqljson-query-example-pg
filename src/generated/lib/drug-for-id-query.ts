

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResource = "drug-for-id-query.sql";


// query parameters


// Below are types representing the result data for the generated query, with top-level type first.
export interface Drug
{
  id: number;
  name: string;
  description: string | null;
  category: string;
  meshId: string | null;
  cid: number | null;
  registered: string | null;
  marketEntryDate: string | null;
  therapeuticIndications: string | null;
  cidPlus1000: number | null;
  registeredByAnalyst: Analyst;
  compound: Compound;
  prioritizedReferences: DrugReference[];
  brands: Brand[];
  advisories: Advisory[];
  functionalCategories: DrugFunctionalCategory[];
}

export interface Analyst
{
  id: number;
  shortName: string;
}

export interface Compound
{
  displayName: string | null;
  nctrIsisId: string | null;
  cas: string | null;
  entered: string | null;
  enteredByAnalyst: Analyst;
  approvedByAnalyst: Analyst | null;
}

export interface DrugReference
{
  priority: number | null;
  publication: string;
}

export interface Brand
{
  brandName: string;
  manufacturer: string | null;
}

export interface Advisory
{
  advisoryText: string;
  advisoryType: string;
  exprYieldingTwo: number;
  authorityName: string;
  authorityUrl: string | null;
  authorityDescription: string | null;
}

export interface DrugFunctionalCategory
{
  categoryName: string;
  description: string | null;
  authorityName: string;
  authorityUrl: string | null;
  authorityDescription: string | null;
}
