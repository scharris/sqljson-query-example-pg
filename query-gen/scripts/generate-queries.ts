/* NOTE: Usually you won't need to change this file.
   It generates SQL, TS and/or Java sources for the queries specified in the query-specs.ts file,
   with options and output file locations as specified by the input arguments.
   Example usage generating SQL and both Java and TS source files:
      node generate-queries --sqlDir=../src/generated/sql --tsDir=../src/generated/lib --tsTypesHeader=result-types-header-ts --javaBaseDir=../src/generated/lib --javaQueriesPkg=my.queries",
 */
import * as minimist from 'minimist';
import * as path from 'path';
import {promises as fs} from 'fs';
import {generateQuerySources} from 'sqljson-query';

import {queryGroupSpec} from '../query-specs';

async function generateQueries(parsedArgs: minimist.ParsedArgs)
{
  // Generate SQL source files if specified.
  const internalDbmdDir = path.join(__dirname, 'dbmd');
  const dbmdPath = parsedArgs['dbmd'] || path.join(internalDbmdDir, 'dbmd.json');
  const sqlOutputDir = parsedArgs['sqlDir'];
  const sqlSpecOutputDir = parsedArgs['sqlSpecDir'];
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

  // Generate TS query/result-type source files if specified.
  if ( tsOutputDir )
  {
    await fs.mkdir(tsOutputDir, {recursive: true});

    console.log(`Writing TS source files to ${tsOutputDir}.`);

    await generateQuerySources(queryGroupSpec, dbmdPath, {
      sourceLanguage: 'TS',
      resultTypesOutputDir: tsOutputDir,
      sqlOutputDir,
      sqlSpecOutputDir,
      typesHeaderFile: parsedArgs['tsTypesHeader'],
      sqlResourcePathPrefix: parsedArgs['sqlResourcePath']
    });
  }

  // Generate Java sources if specified.
  if ( javaOutputDir )
  {
    await fs.mkdir(javaOutputDir, {recursive: true});

    console.log(`Writing Java query source files to ${javaOutputDir}.`);

    await generateQuerySources(queryGroupSpec, dbmdPath, {
      sourceLanguage: 'Java',
      resultTypesOutputDir: javaOutputDir,
      sqlOutputDir,
      sqlSpecOutputDir,
      javaOptions: { javaPackage, emitRecords: javaEmitRecords },
      typesHeaderFile: parsedArgs['javaTypesHeader'],
      sqlResourcePathPrefix: parsedArgs['sqlResourcePath'],
    });
  }
}

function parseArgs
  (
    args: string[],
    requiredNamedArgs: string[],
    optionalNamedArgs: string[],
    minPositionalArgs: number,
    maxPositionalArgs: number | null = null
  )
  : minimist.ParsedArgs | string
{
  let invalidParam = null;
  const parsedArgs = minimist(args, {
    string: [...requiredNamedArgs, ...optionalNamedArgs],
    unknown: (p: string) => {
      if ( p.startsWith('--') ) { invalidParam = p; return false; }
      return true;
    }
  });

  if ( invalidParam )
    return `Parameter "${invalidParam}" is not valid.`;

  if ( parsedArgs._.length < minPositionalArgs )
    return `Expected at least ${minPositionalArgs} positional arguments, got ${parsedArgs._.length}`;

  if ( maxPositionalArgs != null && parsedArgs._.length > maxPositionalArgs )
    return `Expected at most ${maxPositionalArgs} positional arguments, got ${parsedArgs._.length}`;

  for ( const param of requiredNamedArgs )
  {
    if ( !parsedArgs.hasOwnProperty(param) )
      return `Missing required parameter "${param}".`;
  }

  return parsedArgs;
}

function replaceAll(inString: string, replace: string, replacement: string)
{
  const regex = new RegExp(escapeRegExp(replace), 'g');
  return inString.replace(regex, replacement);
}

function escapeRegExp(s: string)
{
  return s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function parseBoolOption(valStr: string, optionName: string): boolean
{
  const valLc = valStr.toLowerCase();
  if ( valLc === 'true' || valLc === 't' || valLc === '1' )
    return true;
  else if ( valLc === 'false' || valLc === 'f' || valLc === '0' )
    return false;
  else
    throw new Error(`Could not parse value "${valStr}" for boolean option ${optionName}.`);
}

//////////////////////////////////////////////////////////////////////////////////////
// Run
//////////////////////////////////////////////////////////////////////////////////////

const optionNames = [
  'dbmd', // database metadata json file path
  'sqlDir',
  'sqlSpecDir',
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
