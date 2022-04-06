import { QueryGroupSpec, QuerySpec, RecordCondition, generateQueriesWithArgvOptions } from 'sqljson-query';
import { Schema_drugs as drugs, verifiedFieldNames } from './relations-metadata';

const drugAdvisoriesReferencesQuery: QuerySpec = {
  queryName: 'drug advisories references query',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
        parentTables: [
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
            ],
            viaForeignKeyFields: ['entered_by'] // <- select on of two foreign keys to analyst
          },
        ]
      },
    ],
    childTables: [
      {
        collectionName: 'advisories',
        table: 'advisory',
        fieldExpressions: [
          'advisory_type_id',
          { field: 'text', jsonProperty: 'advisoryText' },
        ],
        parentTables: [
          {
            table: 'advisory_type',
            fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeName' } ],
            parentTables: [
              {
                table: 'authority',
                fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeAuthorityName' } ]
              }
            ]
          }
        ]
      },
      {
        collectionName: 'prioritizedReferences',
        table: 'drug_reference',
        fieldExpressions: [ 'priority' ],
        parentTables: [
          {
            table: "reference",
            fieldExpressions: [ 'publication' ]
          }
        ],
        orderBy: 'priority asc'
      }
    ]
  }
};

const drugsQuery1: QuerySpec = {
  queryName: 'drugs query 1',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code', // short for: { field: 'category_code', jsonProperty: 'categoryCode' }
      { expression: '$$.cid + 1000',
        jsonProperty: 'cidPlus1000',
        fieldTypeInGeneratedSource: {TS: 'number | null', Java: '@Nullable Long'} },
    ],
  }
};

// Add compound parent table.
const drugsQuery2: QuerySpec = {
  queryName: 'drugs query 2',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    // (Added) -->
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
      },
      {
        table: 'analyst',
        fieldExpressions: [
          { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
        ],
      }
    ],
    // <- (Added)
  }
};

// Add employee entered-by/approved-by information from parent 'analyst' tables of compound.
const drugsQuery3: QuerySpec = {
  queryName: 'drugs query 3',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
        // (Added) -->
        parentTables: [
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
            ],
            viaForeignKeyFields: ['entered_by'] // <- select on of two foreign keys to analyst
          },
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'approvedByAnalyst' }
            ],
            viaForeignKeyFields: ['approved_by'] // <- select one of two foreign keys to analyst
          }
        ]
        // <-- (Added)
      },
      {
        table: 'analyst',
        fieldExpressions: [
          { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
        ],
      }
    ],
  }
};

// Add advisories child collection.
const drugsQuery4: QuerySpec = {
  queryName: 'drugs query 4',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
        parentTables: [
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
            ],
            viaForeignKeyFields: ['entered_by'] // <- select on of two foreign keys to analyst
          },
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'approvedByAnalyst' }
            ],
            viaForeignKeyFields: ['approved_by'] // <- select one of two foreign keys to analyst
          }
        ]
      },
      {
        table: 'analyst',
        fieldExpressions: [
          { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
        ],
      }
    ],
    // (Added) -->
    childTables: [
      {
        collectionName: 'advisories',
        table: 'advisory',
        fieldExpressions: [
          'advisory_type_id',
          { field: 'text', jsonProperty: 'advisoryText' },
        ]
      }
    ],
    // <-- (Added)
  }
};


// + Add advisory type and authority information via advisory parent and grandparent.
const drugsQuery5: QuerySpec = {
  queryName: 'drugs query 5',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
        parentTables: [
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
            ],
            viaForeignKeyFields: ['entered_by']
          },
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'approvedByAnalyst' }
            ],
            viaForeignKeyFields: ['approved_by']
          }
        ]
      },
      {
        table: 'analyst',
        fieldExpressions: [
          { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
        ],
      }
    ],
    childTables: [
      {
        collectionName: 'advisories',
        table: 'advisory',
        fieldExpressions: [
          'advisory_type_id',
          { field: 'text', jsonProperty: 'advisoryText' },
        ],
        // (Added) -->
        parentTables: [
          {
            table: 'advisory_type',
            fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeName' } ],
            parentTables: [
              {
                table: 'authority',
                fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeAuthorityName' } ]
              }
            ]
          }
        ]
        // <-- (Added)
      }
    ]
  }
};

// Add references from far side of a many-many relationship.
const drugsQuery6: QuerySpec = {
  queryName: 'drugs query 6',
  tableJson: {
    table: 'drug',
    recordCondition: { sql: 'category_code = :catCode', paramNames: ['catCode'] },
    fieldExpressions: [
      { field: 'name', jsonProperty: 'drugName' },
      'category_code',
    ],
    parentTables: [
      {
        referenceName: 'primaryCompound',
        table: 'compound',
        fieldExpressions: [
          { field: 'id', jsonProperty: 'compoundId' },
          { field: 'display_name', jsonProperty: 'compoundDisplayName' },
        ],
        parentTables: [
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
            ],
            viaForeignKeyFields: ['entered_by'] // <- select on of two foreign keys to analyst
          },
          {
            table: 'analyst',
            fieldExpressions: [
              { field: 'short_name', jsonProperty: 'approvedByAnalyst' }
            ],
            viaForeignKeyFields: ['approved_by'] // <- select one of two foreign keys to analyst
          }
        ]
      },
      {
        table: 'analyst',
        fieldExpressions: [
          { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
        ],
      }
    ],
    childTables: [
      {
        collectionName: 'advisories',
        table: 'advisory',
        fieldExpressions: [
          'advisory_type_id',
          { field: 'text', jsonProperty: 'advisoryText' },
        ],
        parentTables: [
          {
            table: 'advisory_type',
            fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeName' } ],
            parentTables: [
              {
                table: 'authority',
                fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeAuthorityName' } ]
              }
            ]
          }
        ]
      },
      // (Added) -->
      {
        collectionName: 'prioritizedReferences',
        table: 'drug_reference',
        fieldExpressions: [ 'priority' ],
        parentTables: [
          {
            table: "reference",
            fieldExpressions: [ 'publication' ]
          }
        ],
        orderBy: 'priority asc'
      }
      // <-- (Added)
    ]
  }
};

const {category_code} = verifiedFieldNames(drugs.drug); // category_code === 'category_code'

const drugsQuery7: QuerySpec = {
   queryName: 'drugs query 7',
   tableJson: {
      table: 'drug',
      // (Modified) -->
      recordCondition: { sql: `${category_code} = :catCode`, paramNames: ['catCode'] },
      // <-- (Modified)
      fieldExpressions: [
         { field: 'name', jsonProperty: 'drugName' },
         'category_code',
      ],
      parentTables: [
         {
            referenceName: 'primaryCompound',
            table: 'compound',
            fieldExpressions: [
               { field: 'id', jsonProperty: 'compoundId' },
               { field: 'display_name', jsonProperty: 'compoundDisplayName' },
            ],
            parentTables: [
               {
                  table: 'analyst',
                  fieldExpressions: [
                     { field: 'short_name', jsonProperty: 'enteredByAnalyst' }
                  ],
                  viaForeignKeyFields: ['entered_by'] // <- select on of two foreign keys to analyst
               },
               {
                  table: 'analyst',
                  fieldExpressions: [
                     { field: 'short_name', jsonProperty: 'approvedByAnalyst' }
                  ],
                  viaForeignKeyFields: ['approved_by'] // <- select one of two foreign keys to analyst
               }
            ]
         },
         {
            table: 'analyst',
            fieldExpressions: [
               { field: 'short_name', jsonProperty: 'registeredByAnalyst' },
            ],
         }
      ],
      childTables: [
         {
            collectionName: 'advisories',
            table: 'advisory',
            fieldExpressions: [
               'advisory_type_id',
               { field: 'text', jsonProperty: 'advisoryText' },
            ],
            parentTables: [
               {
                  table: 'advisory_type',
                  fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeName' } ],
                  parentTables: [
                     {
                        table: 'authority',
                        fieldExpressions: [ { field: 'name', jsonProperty: 'advisoryTypeAuthorityName' } ]
                     }
                  ]
               }
            ]
         },
         {
            collectionName: 'prioritizedReferences',
            table: 'drug_reference',
            fieldExpressions: [ 'priority' ],
            parentTables: [
               {
                  table: "reference",
                  fieldExpressions: [ 'publication' ]
               }
            ],
            // orderBy: 'priority asc' // Omit orderBy if using MySQL database - OK for pg / ora.
         }
      ]
   }
};

function fullDrugsQuery
  (
    name: string,
    drugCond: RecordCondition | undefined
  )
  : QuerySpec
{
  return {
    queryName: name,
    resultRepresentations: [ 'JSON_OBJECT_ROWS' ],
    generateResultTypes: true,
    tableJson: {
      table: 'drug',
      fieldExpressions: [
        'id',
        'name',
        { field: 'descr', jsonProperty: 'description' },
        { field: 'category_code', jsonProperty: 'category' },
        'mesh_id',
        'cid',
        'registered',
        'market_entry_date',
        'therapeutic_indications',
        {
          expression: '$$.cid + 1000',
          jsonProperty: 'cidPlus1000',
          fieldTypeInGeneratedSource: {TS: 'number | null', Java: '@Nullable Long'}
        },
      ],
      childTables: [
        {
          collectionName: 'prioritizedReferences',
          table: 'drug_reference',
          fieldExpressions: [ 'priority' ],
          parentTables: [
            {
              table: 'reference',
              fieldExpressions: [ 'publication' ]
            }
          ],
          orderBy: 'priority asc'
        },
        {
          collectionName: 'brands',
          table: 'brand',
          fieldExpressions: [ 'brand_name' ],
          parentTables: [
            {
              table: 'manufacturer',
              fieldExpressions: [{ field: 'name', jsonProperty: 'manufacturer' }]
            }
          ]
        },
        {
          collectionName: 'advisories',
          table: 'advisory',
          fieldExpressions: [{ field: 'text', jsonProperty: 'advisoryText' }],
          parentTables: [
            {
              table: 'advisory_type',
              fieldExpressions: [
                { field: 'name', jsonProperty: 'advisoryType' },
                {
                  expression: '(1 + 1)',
                  jsonProperty: 'exprYieldingTwo',
                  fieldTypeInGeneratedSource: {TS: 'number', Java: 'int'}
                },
              ],
              parentTables: [
                {
                  table: 'authority',
                  fieldExpressions: [
                    { field: 'name', jsonProperty: 'authorityName' },
                    { field: 'url', jsonProperty: 'authorityUrl' },
                    { field: 'description', jsonProperty: 'authorityDescription' },
                  ]
                }
              ]
            }
          ]
        },
        {
          collectionName: 'functionalCategories',
          table: 'drug_functional_category',
          parentTables: [
            {
              table: 'functional_category',
              fieldExpressions: [
                { field: 'name', jsonProperty: 'categoryName' },
                'description',
              ]
            },
            {
              table: 'authority',
              fieldExpressions: [
                { field: 'name', jsonProperty: 'authorityName' },
                { field: 'url', jsonProperty: 'authorityUrl' },
                { field: 'description', jsonProperty: 'authorityDescription' },
              ]
            }
          ]
        }
      ],
      parentTables: [
        {
          referenceName: 'registeredByAnalyst',
          table: 'analyst',
          fieldExpressions: [ 'id', 'short_name' ]
        },
        {
          referenceName: 'compound',
          viaForeignKeyFields: [
            'compound_id'
          ],
          table: 'compound',
          fieldExpressions: [ 'display_name', 'nctr_isis_id', 'cas', 'entered' ],
          parentTables: [
            {
              referenceName: 'enteredByAnalyst',
              table: 'analyst',
              fieldExpressions: [ 'id', 'short_name' ],
              viaForeignKeyFields: [ 'entered_by' ]
            },
            {
              referenceName: 'approvedByAnalyst',
              table: 'analyst',
              fieldExpressions: [ 'id', 'short_name' ],
              viaForeignKeyFields: [ 'approved_by' ]
            }
          ]
        }
      ],
      recordCondition: drugCond
    },
    orderBy: '$$.name'
  };
}

export const queryGroupSpec: QueryGroupSpec = {
  defaultSchema: 'drugs',
  generateUnqualifiedNamesForSchemas: [ 'drugs' ],
  propertyNameDefault: 'CAMELCASE',
  querySpecs: [
    drugAdvisoriesReferencesQuery,
    drugsQuery1,
    drugsQuery2,
    drugsQuery3,
    drugsQuery4,
    drugsQuery5,
    drugsQuery6,
    fullDrugsQuery('drugs query', { sql: '$$.name ilike $1' }),
    fullDrugsQuery('drug for id query', { sql: '$$.id = $1' }),
  ]
};

// Run the query generator with options specified in arguments to this script.

generateQueriesWithArgvOptions(queryGroupSpec, process.argv)
  .then(() => { console.log("Query generation completed."); })
  .catch((e) => {
    console.error(e);
    console.error("Query generation failed due to error - see error detail above.");
    process.exit(1);
  });