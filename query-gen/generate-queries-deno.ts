// Example as run from project directory (..):
//
//   deno run --allow-read=query-gen,src/generated --allow-write=src/generated --unstable query-gen/generate-queries-deno.ts
//
import * as path from 'https://deno.land/std@0.97.0/path/mod.ts';
import {
  generateQueries, generateRelationsMetadataSource, QueryGroupSpec, QuerySpec, RecordCondition, SourceGenerationOptions
} from 'https://raw.githubusercontent.com/scharris/sqljson-query/deno/src/mod.ts';

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
        { field: "descr", jsonProperty: "description" },
        { field: "category_code", jsonProperty: "category" },
        "mesh_id",
        "cid",
        "registered",
        "market_entry_date",
        "therapeutic_indications",
        { expression: "$$.cid + 1000",
          jsonProperty: "cidPlus1000",
          fieldTypeInGeneratedSource: {"TS": "number | null", "Java": "@Nullable Long"} },
      ],
      childTables: [
        {
          collectionName: "brands",
          tableJson: {
            table: "brand",
            fieldExpressions: ["brand_name"],
            parentTables: [
              {
                tableJson: {
                  table: "manufacturer",
                  fieldExpressions: [{ field: "name", jsonProperty: "manufacturer" }]
                }
              }
            ]
          }
        },
        {
          collectionName: "advisories",
          tableJson: {
            table: "advisory",
            fieldExpressions: [{ field: "text", jsonProperty: "advisoryText" }],
            parentTables: [
              {
                tableJson: {
                  table: "advisory_type",
                  fieldExpressions: [
                    { field: "name", jsonProperty: "advisoryType" },
                    { expression: "(1 + 1)",
                      jsonProperty: "exprYieldingTwo",
                      fieldTypeInGeneratedSource: {"TS": "number", "Java" : "int"} },
                  ],
                  parentTables: [
                    {
                      tableJson: {
                        table: "authority",
                        fieldExpressions: [
                          { field: "name", jsonProperty: "authorityName" },
                          { field: "url", jsonProperty: "authorityUrl" },
                          { field: "description", jsonProperty: "authorityDescription" },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          collectionName: "functionalCategories",
          tableJson: {
            table: "drug_functional_category",
            parentTables: [
              {
                tableJson: {
                  table: "functional_category",
                  fieldExpressions: [
                    { field: "name", jsonProperty: "categoryName" },
                    "description",
                  ]
                }
              },
              {
                tableJson: {
                  table: "authority",
                  fieldExpressions: [
                    { field: "name", jsonProperty: "authorityName" },
                    { field: "url", jsonProperty: "authorityUrl" },
                    { field: "description", jsonProperty: "authorityDescription" },
                  ]
                }
              }
            ]
          }
        }
      ],
      parentTables: [
        {
          referenceName: "registeredByAnalyst",
          tableJson: {
            table: "analyst",
            fieldExpressions: ["id", "short_name"]
          }
        },
        {
          referenceName: "compound",
          viaForeignKeyFields: [
            "compound_id"
          ],
          tableJson: {
            table: "compound",
            fieldExpressions: ["display_name", "nctr_isis_id", "cas", "entered"],
            parentTables: [
              {
                referenceName: "enteredByAnalyst",
                tableJson: {
                  table: "analyst",
                  fieldExpressions: ["id", "short_name"]
                },
                viaForeignKeyFields: ["entered_by"]
              },
              {
                referenceName: "approvedByAnalyst",
                tableJson: {
                  table: "analyst",
                  fieldExpressions: ["id", "short_name"]
                },
                viaForeignKeyFields: ["approved_by"]
              }
            ]
          }
        }
      ],
      recordCondition: drugCond
    },
    orderBy: "$$.name"
  };
}

const queryGroupSpec: QueryGroupSpec = {
  defaultSchema: "drugs",
  generateUnqualifiedNamesForSchemas: ["drugs"],
  propertyNameDefault: "CAMELCASE",
  querySpecs: [
    drugQuery("drugs query", { sql: "$$.name ilike $1" }),
    drugQuery("drug for id query", { sql: "$$.id = $1" }),
  ]
};

const scriptDir = path.dirname(path.fromFileUrl(import.meta.url));
const dbmdPath = path.join(scriptDir, 'dbmd.json');

const outputBase = path.join(path.dirname(scriptDir), 'src', 'generated');
const srcOutputDir = path.join(outputBase, 'lib');
const sqlOutputDir = path.join(outputBase, 'sql');

const opts: SourceGenerationOptions = {
  sourceLanguage: 'TS',
  typesHeaderFile: path.join(scriptDir, 'types-header-ts')
};

console.log('generate-queries-deno.ts: Generating SQL and TS source code for SQL/JSON queries.');
console.log(`Using database metadata from '${dbmdPath}'.`);
console.log(`Writing TypeScript source to '${srcOutputDir}'.`);
console.log(`Writing SQL to '${sqlOutputDir}'.`);

await generateQueries(queryGroupSpec, dbmdPath, srcOutputDir, sqlOutputDir, opts);
await generateRelationsMetadataSource(dbmdPath, srcOutputDir, 'TS');
await generateRelationsMetadataSource(dbmdPath, path.join(srcOutputDir, 'javapkg'), 'Java', 'javapkg');

console.log(`Completing queries generation.`);
