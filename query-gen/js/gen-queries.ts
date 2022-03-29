/* NOTE: Usually you won't need to change this file.
   It generates SQL, TS and/or Java sources for the queries specified in the query-specs.ts file,
   with options and output file locations as specified by the input arguments.
   Example usage generating SQL and both Java and TS source files:
      node generate-queries --sqlDir=../src/generated/sql --tsDir=../src/generated/lib --tsTypesHeader=result-types-header-ts --javaBaseDir=../src/generated/lib --javaQueriesPkg=my.queries",
 */
import * as minimist from 'minimist';
import * as path from 'path';
import { promises as fs } from 'fs';
import { generateQuerySources } from 'sqljson-query';
import { queryGroupSpec } from '../query-specs';
import { parseArgs, parseBoolOption, replaceAll } from './utils';

async function generateQueries(parsedArgs: minimist.ParsedArgs)
{
  // Generate SQL source files if specified.
  const internalDbmdDir = path.join(__dirname, '..', 'dbmd');
  const dbmdPath = parsedArgs['dbmd'] || path.join(internalDbmdDir, 'dbmd.json');
  const sqlOutputDir = parsedArgs['sqlDir'];
  const sqlSpecOutputDir = parsedArgs['sqlSpecDir'];
  const queryPropertiesOutputDir = parsedArgs['propsMdDir'];
  const tsOutputDir = parsedArgs['tsQueriesDir'];
  const javaBaseDir = parsedArgs['javaBaseDir'];
  const javaPackage = parsedArgs['javaQueriesPkg'] ?? '';
  const javaOutputDir = javaBaseDir ? `${javaBaseDir}/${replaceAll(javaPackage, '.','/')}` : null;
  const javaEmitRecords = parseBoolOption(parsedArgs['javaEmitRecords'] ?? 'true', 'javaEmitRecords');

  if ( sqlOutputDir == null )
    throw new Error('SQL output directory is required.');
  if ( tsOutputDir == null && javaOutputDir == null )
    throw new Error('An output directory argument for result types is required.');

  await fs.mkdir(sqlOutputDir, {recursive: true});
  if ( sqlSpecOutputDir)
    await fs.mkdir(sqlSpecOutputDir, {recursive: true});
  if (queryPropertiesOutputDir)
    await fs.mkdir(queryPropertiesOutputDir, {recursive: true});

  // Generate TS query/result-type source files if specified.
  if ( tsOutputDir )
  {
    await fs.mkdir(tsOutputDir, {recursive: true});

    console.log(`Writing TS source files to ${tsOutputDir}.`);

    await generateQuerySources(
      queryGroupSpec,
      dbmdPath,
      {
        sourceLanguage: 'TS',
        resultTypesOutputDir: tsOutputDir,
        sqlSpecOutputDir,
        queryPropertiesOutputDir,
        sqlOutputDir,
        typesHeaderFile: parsedArgs['tsTypesHeader'],
        sqlResourcePathPrefix: parsedArgs['sqlResourcePath']
      }
    );
  }

  // Generate Java sources if specified.
  if ( javaOutputDir )
  {
    await fs.mkdir(javaOutputDir, {recursive: true});

    console.log(`Writing Java query source files to ${javaOutputDir}.`);

    await generateQuerySources(
      queryGroupSpec,
      dbmdPath,
      {
        sourceLanguage: 'Java',
        resultTypesOutputDir: javaOutputDir,
        sqlSpecOutputDir,
        queryPropertiesOutputDir,
        sqlOutputDir,
        javaOptions: { javaPackage, emitRecords: javaEmitRecords },
        typesHeaderFile: parsedArgs['javaTypesHeader'],
        sqlResourcePathPrefix: parsedArgs['sqlResourcePath'],
      }
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////////
// Run
//////////////////////////////////////////////////////////////////////////////////////

const optionNames = [
  'dbmd', // database metadata json file path
  'sqlDir',
  'sqlSpecDir',
  'propsMdDir',
  'sqlResourcePath',
  'tsQueriesDir', 'tsTypesHeader',
  'javaBaseDir', 'javaQueriesPkg', 'javaTypesHeader', 'javaEmitRecords'
];
const parsedArgs = parseArgs(process.argv, [], optionNames, 0);

if ( typeof parsedArgs === 'string' ) // arg parsing error
{
  console.error(`Error: ${parsedArgs}`);
  process.exit(1);
}
else
{
  generateQueries(parsedArgs)
  .then(() => { console.log("Query generation completed."); })
  .catch((e) => {
    console.error(e);
    console.error("Query generation failed due to error - see error detail above.");
    process.exit(1);
  });
}
