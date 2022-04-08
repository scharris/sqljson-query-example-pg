import {promises as fs} from 'fs'; // for some older node versions (e.g. v10)
import * as path from 'path';
import * as dotenv from 'dotenv';
import {Client as PgClient, QueryResult} from 'pg';
import {verifiedFieldNames, verifiedTableName} from './tables-fields-verification';
import {Schema_drugs as drugsSchema} from './generated/lib/relations-metadata';
import * as DrugsQuery from './generated/lib/drugs-query';
import * as DrugForIdQuery from './generated/lib/drug-for-id-query';

// Example run: node dist/app.js dist/generated/sql db/pg-conn.env

const generatedSqlsDir = process.argv[2];
const envFile = process.argv.length === 4 ? process.argv[3] : null;

if (envFile)
  dotenv.config({ path: envFile });

// Run examples.
requireDirExists(generatedSqlsDir, "Generated SQLs directory not found.")
  .then(runAll)
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

async function runAll(): Promise<void>
{
  const pgClient = new PgClient();
  await pgClient.connect();

  try
  {
    await runExampleQueries(pgClient);

    await runExampleModifications(pgClient);

    console.log('\nAll statements executed successfully, detailed results are printed above.\n');
  }
  finally
  {
    await pgClient.end();
  }
}

export async function runExampleQueries(pgClient: PgClient): Promise<void>
{
  const allDrugsRes = await execSqlResource(DrugsQuery.sqlResource, ['%'], pgClient);
  const allDrugs = allDrugsRes.rows.map((r: any) => r.json as DrugsQuery.Drug);
  console.log("All Drugs:\n%s\n", JSON.stringify(allDrugs, null, 2));

  const drugs2Res = await execSqlResource(DrugsQuery.sqlResource, ['%2%'], pgClient);
  const drugs2 = drugs2Res.rows.map((r: any) => r.json as DrugsQuery.Drug);
  console.log("Drugs matching pattern '%2%':\n%s\n", JSON.stringify(drugs2, null, 2));

  const drug3Res = await execSqlResource(DrugForIdQuery.sqlResource, [3], pgClient);
  const drug3 = drug3Res.rows.map((r: any) => r.json as DrugForIdQuery.Drug)[0] || null;
  console.log("Drug 3", JSON.stringify(drug3, null, 2));
}

async function runExampleModifications(pgClient: PgClient): Promise<void>
{
  await pgClient.query('BEGIN');

  try
  {
    const newDrugData = {id: 101, name: 'Orig Name', compoundId: 1, category: 'A', description: 'example inserted drug'};
    await createDrug(newDrugData, pgClient);
    console.log('\nInserted 1 new drug with id 101.\n');

    const modifiedDrugData = {id: 101, name: 'Mod Name', compoundId: 2, category: 'B', description: 'example inserted drug'}
    await updateDrug(101, modifiedDrugData, pgClient);
    console.log('Updated drug with id 101.\n');

    await deleteDrug(101, pgClient);
    console.log('Deleted drug with id 101.\n');
  }
  finally
  {
    await pgClient.query('ROLLBACK');
    console.log("All modifications rolled back successfully.");
  }
}

async function createDrug(data: DrugData, pgClient: PgClient): Promise<void>
{
  // Check at compile time the table and field names to be used against database schema information.
  const drug = verifiedTableName(drugsSchema, "drug");
  const { id, name, compound_id, category_code, descr, registered_by } = verifiedFieldNames(drugsSchema.drug);

  const res = await pgClient.query(
    `insert into ${drug}(${id}, ${name}, ${compound_id}, ${category_code}, ${descr}, ${registered_by}) ` +
    "values($1, $2, $3, $4, $5, 1)",
    [data.id, data.name, data.compoundId, data.category, data.description]
  );

  if (res.rowCount !== 1)
    throw new Error('Expected one row to be modified when creating drug.');
}

async function updateDrug(drugId: number, drugData: DrugData, pgClient: PgClient): Promise<void>
{
  if (drugData.id !== drugId)
    throw new Error("Cannot change drug id field via update.");

  // Check at compile time the table and field names to be used against database schema information.
  const drug = verifiedTableName(drugsSchema, "drug");
  const { id, name, category_code, descr } = verifiedFieldNames(drugsSchema.drug);
  const res = await pgClient.query(
    `update ${drug} set ${name} = $1, ${category_code} = $2, ${descr} = $3 where ${id} = $4`,
    [drugData.name, drugData.category, drugData.description, drugId]
  );

  if (res.rowCount !== 1)
    throw new Error('Expected one row to be modified when updating a drug, instead modified ' + res.rowCount + ".");
}

async function deleteDrug(drugId: number, pgClient: PgClient): Promise<void>
{
  const drug = verifiedTableName(drugsSchema, "drug");
  const { id } = verifiedFieldNames(drugsSchema.drug);
  const res = await pgClient.query(`delete from ${drug} where ${id} = $1`, [drugId]);

  if (res.rowCount !== 1)
    throw new Error('Expected one row to be modified when deleting a foo, instead modified ' + res.rowCount + ".");
}

interface DrugData
{
  id: number;
  name: string;
  compoundId: number;
  category: string;
  description: string | null;
}

async function execSqlResource(resourceName: string, params: any[], pgClient: PgClient): Promise<QueryResult>
{
  const sql = await fs.readFile(path.join(generatedSqlsDir, resourceName), "utf-8");
  return pgClient.query(sql, params);
}

async function requireDirExists(path: string, errMsg: string): Promise<void>
{
  try
  {
    const isDir = (await fs.stat(path)).isDirectory();
    if (!isDir) throw new Error(errMsg);
  }
  catch (e) { throw new Error(errMsg); }
}
