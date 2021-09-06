
// This section is from the "types-header" file where you can optionally define and/or import
// custom types. Custom types for result properties can be specified either directly in the
// query specs via "fieldTypeInGeneratedSource" in field expressions, or by specifying the
// customPropertyTypeFn in the SourceGenerationOptions structure passed to generateQueries().
type TimestampTZ = string;
type CategoryCode = 'A' | 'B';
//



// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResource = "drugs-query-5.sql";


// query parameters
export const catCodeParam = 'catCode';

// Below are types representing the result data for the generated query, with top-level type first.
export interface Drug
{
  drugName: string;
  categoryCode: string;
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
