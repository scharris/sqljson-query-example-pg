import * as minimist from 'minimist';
import * as path from 'path';
import { promises as fs } from 'fs';
import { spawnSync } from 'child_process';
import { parseArgs } from './utils';
import { generateRelationsMetadata } from './gen-relsmd-lib';

async function generateDatabaseMetadata(parsedArgs: minimist.ParsedArgs)
{
  const internalDbmdDir = path.join(__dirname, '..', 'dbmd');
  const dbmdPath = parsedArgs['dbmd'] || path.join(internalDbmdDir, 'dbmd.json');
  const pomPath = path.join(internalDbmdDir, 'pom.xml');
  const projectDir = path.join(__dirname, '..', '..');
  const jdbcPropsFile = parsedArgs['jdbcProps'];
  const dbType = parsedArgs['db'];
  const include = parsedArgs['include'] || '.*';
  const exclude = parsedArgs['exclude'] || '^$';

  console.log(`Generating database metadata to file ${dbmdPath}.`);
  console.log(`Including table/view pattern: '${include}'.`)
  console.log(`Excluding table/view pattern: '${exclude}'.`)

  try { await fs.stat(jdbcPropsFile); }
  catch { throw new Error(`JDBC properties file was not found at '${jdbcPropsFile}'.`); }

  const mvnProc = spawnSync(
    'mvn',
    ['-f', pomPath, 'compile', 'exec:java',
     `-DjdbcProps=${jdbcPropsFile}`, `-Ddb=${dbType}`,
     `-Ddbmd.include.regex=${include}`, `-Ddbmd.exclude.regex=${exclude}`],
    { cwd: projectDir, env: process.env, encoding: 'utf8' }
  );

  if (mvnProc.status !== 0)
  {
    console.error('Maven command to generate database metadata failed:');
    console.error(mvnProc);
    throw new Error('Database metadata generation failed.');
  }

  await generateRelationsMetadata({ dbmd: dbmdPath, tsRelsMdDir: internalDbmdDir, _: [] });
}

//////////////////////////////////////////////////////////////////////////////////////
// Run
//////////////////////////////////////////////////////////////////////////////////////

const requiredParams = [
  'jdbcProps',
  'db', // database type: pg | mysql | ora ...
]
const optionNames = [
  'dbmd',
  'include',
  'exclude',
];
const parsedArgs = parseArgs(process.argv, requiredParams, optionNames, 0);

if ( typeof parsedArgs === 'string' ) // arg parsing error
{
  console.error(`Error: ${parsedArgs}`);
  process.exit(1);
}
else
{
  generateDatabaseMetadata(parsedArgs)
  .then(() => { console.log("Database metadata generation completed."); })
  .catch((e) => {
    console.error(e);
    console.error("Database metadata generation failed due to error - see error detail above.");
    process.exit(1);
  });
}
