
// This section is from the "types-header" file where you can optionally define and/or import
// custom types. Custom types for result properties can be specified either directly in the
// query specs via "fieldTypeInGeneratedSource" in field expressions, or by specifying the
// customPropertyTypeFn in the SourceGenerationOptions structure passed to generateQueries().
type TimestampTZ = string;
type CategoryCode = 'A' | 'B';
//



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
  authorityName: string;
  authorityUrl: string | null;
  authorityDescription: string | null;
  exprYieldingTwo: number;
}

export interface DrugFunctionalCategory
{
  categoryName: string;
  description: string | null;
  authorityName: string;
  authorityUrl: string | null;
  authorityDescription: string | null;
}
