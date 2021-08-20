import {QueryGroupSpec, QuerySpec, RecordCondition} from 'sqljson-query';

function drugQuery
   (
      name: string,
      drugCond: RecordCondition | undefined
   )
   : QuerySpec
{
   return {
      queryName: name,
      resultRepresentations: ["JSON_OBJECT_ROWS"],
      generateResultTypes: true,
      tableJson: {
         table: "drug",
         fieldExpressions: [
            "id",
            "name",
            {field: "descr", jsonProperty: "description"},
            {field: "category_code", jsonProperty: "category"},
            "mesh_id",
            "cid",
            "registered",
            "market_entry_date",
            "therapeutic_indications",
            {
               expression: "$$.cid + 1000",
               jsonProperty: "cidPlus1000",
               fieldTypeInGeneratedSource: {"TS": "number | null", "Java": "@Nullable Long"}
            },
         ],
         childTables: [
            {
               collectionName: "brands",
               table: "brand",
               fieldExpressions: ["brand_name"],
               parentTables: [
                  {
                     table: "manufacturer",
                     fieldExpressions: [{field: "name", jsonProperty: "manufacturer"}]
                  }
               ]
            },
            {
               collectionName: "advisories",
               table: "advisory",
               fieldExpressions: [{field: "text", jsonProperty: "advisoryText"}],
               parentTables: [
                  {
                     table: "advisory_type",
                     fieldExpressions: [
                        {field: "name", jsonProperty: "advisoryType"},
                        {
                           expression: "(1 + 1)",
                           jsonProperty: "exprYieldingTwo",
                           fieldTypeInGeneratedSource: {"TS": "number", "Java": "int"}
                        },
                     ],
                     parentTables: [
                        {
                           table: "authority",
                           fieldExpressions: [
                              {field: "name", jsonProperty: "authorityName"},
                              {field: "url", jsonProperty: "authorityUrl"},
                              {field: "description", jsonProperty: "authorityDescription"},
                           ]
                        }
                     ]
                  }
               ]
            },
            {
               collectionName: "functionalCategories",
               table: "drug_functional_category",
               parentTables: [
                  {
                     table: "functional_category",
                     fieldExpressions: [
                        {field: "name", jsonProperty: "categoryName"},
                        "description",
                     ]
                  },
                  {
                     table: "authority",
                     fieldExpressions: [
                        {field: "name", jsonProperty: "authorityName"},
                        {field: "url", jsonProperty: "authorityUrl"},
                        {field: "description", jsonProperty: "authorityDescription"},
                     ]
                  }
               ]
            }
         ],
         parentTables: [
            {
               referenceName: "registeredByAnalyst",
               table: "analyst",
               fieldExpressions: ["id", "short_name"]
            },
            {
               referenceName: "compound",
               viaForeignKeyFields: [
                  "compound_id"
               ],
               table: "compound",
               fieldExpressions: ["display_name", "nctr_isis_id", "cas", "entered"],
               parentTables: [
                  {
                     referenceName: "enteredByAnalyst",
                     table: "analyst",
                     fieldExpressions: ["id", "short_name"],
                     viaForeignKeyFields: ["entered_by"]
                  },
                  {
                     referenceName: "approvedByAnalyst",
                     table: "analyst",
                     fieldExpressions: ["id", "short_name"],
                     viaForeignKeyFields: ["approved_by"]
                  }
               ]
            }
         ],
         recordCondition: drugCond
      },
      orderBy: "$$.name"
   };
}

export const queryGroupSpec: QueryGroupSpec = {
   defaultSchema: "drugs",
   generateUnqualifiedNamesForSchemas: ["drugs"],
   propertyNameDefault: "CAMELCASE",
   querySpecs: [
      drugQuery("drugs query", { sql: "$$.name ilike $1" }),
      drugQuery("drug for id query", { sql: "$$.id = $1" }),
   ]
};
