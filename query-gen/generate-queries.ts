/* NOTE: Usually you won't need to change this file.
   It generates SQL, TS and/or Java sources for the queries specified in the query-specs.ts file,
   with options and output file locations as specified by the input arguments.
   Example usage generating SQL and both Java and TS source files:
      node generate-queries --sqlDir=../src/generated/sql --tsDir=../src/generated/lib --tsTypesHeader=result-types-header-ts --javaBaseDir=../src/generated/lib --javaQueriesPkg=my.queries--javaRelMdsPkg=my.relmds",
 */
import * as minimist from 'minimist';
import * as path from 'path';
import {promises as fs} from 'fs';
import {generateQuerySources, generateRelationsMetadataSource} from 'sqljson-query';

import {queryGroupSpec} from './queries/query-specs';

async function generateQueries(parsedArgs: minimist.ParsedArgs)
{
  const dbmdPath = path.join(__dirname, 'dbmd', 'dbmd.json');
  console.log(`Using database metadata from ${dbmdPath}.`);

  // Generate SQL source files if specified.
  const sqlOutputDir = parsedArgs['sqlDir'];
  const tsQueriesOutputDir = parsedArgs['tsQueriesDir'];
  const javaBaseDir = parsedArgs['javaBaseDir'];
  const javaQueriesPackage = parsedArgs['javaQueriesPkg'];
  const javaQueriesOutputDir = javaBaseDir ? `${javaBaseDir}/${replaceAll(javaQueriesPackage, '.','/')}` : null;

  // Only generate SQL here if it's not being generated with Java or TS source code below.
  // The Java/TS source generators need to generate the SQL when they are enabled, so that they can
  // reference the generated SQL resources within their source code.
  if ( sqlOutputDir )
  {
    await fs.mkdir(sqlOutputDir, {recursive: true});

    console.log(`Writing SQL files to ${sqlOutputDir}.`);

    if ( !tsQueriesOutputDir && !javaQueriesOutputDir )
      await generateQuerySources(queryGroupSpec, dbmdPath, null, sqlOutputDir, {});
  }

  // Generate TS query/result-type source files if specified.
  if ( tsQueriesOutputDir )
  {
    await fs.mkdir(tsQueriesOutputDir, {recursive: true});

    console.log(`Writing TS source files to ${tsQueriesOutputDir}.`);

    await generateQuerySources(queryGroupSpec, dbmdPath, tsQueriesOutputDir, sqlOutputDir, {
      sourceLanguage: 'TS',
      typesHeaderFile: parsedArgs['tsTypesHeader'] || undefined
    });
  }

  const tsRelMdsOutputDir = parsedArgs['tsRelMdsDir'];
  if ( tsRelMdsOutputDir )
  {
    console.log(`Writing TS relation metadatas source file to ${tsRelMdsOutputDir}.`);

    await generateRelationsMetadataSource(dbmdPath, tsRelMdsOutputDir, 'TS');
  }

  // Generate Java sources if specified.
  if ( javaQueriesOutputDir )
  {
    if ( !javaBaseDir )
      throw new Error('javaBaseDir is required for Java source generation');

    await fs.mkdir(javaQueriesOutputDir, {recursive: true});

    console.log(`Writing Java query source files to ${javaQueriesOutputDir}.`);

    await generateQuerySources(queryGroupSpec, dbmdPath, javaQueriesOutputDir, sqlOutputDir, {
      sourceLanguage: 'Java',
      javaPackage: javaQueriesPackage,
      typesHeaderFile: parsedArgs['javaTypesHeader']
    });
  }

  // Write Java relation metadatas if specified.
  const javaRelMdsPackage = parsedArgs['javaRelMdsPkg'];
  if ( javaRelMdsPackage )
  {
    if ( !javaBaseDir )
      throw new Error('javaBaseDir is required for Java source generation');

    const javaRelMdsOutputDir = `${javaBaseDir}/${replaceAll(javaRelMdsPackage, '.','/')}`;

    await fs.mkdir(javaRelMdsOutputDir, {recursive: true});

    console.log(`Writing Java relations metadata file to ${javaRelMdsOutputDir}.`);

    await generateRelationsMetadataSource(dbmdPath, javaRelMdsOutputDir, 'Java', javaRelMdsPackage);
  }
}

const optionNames = [
  'sqlDir',
  'tsQueriesDir', 'tsRelMdsDir', 'tsTypesHeader',
  'javaBaseDir', 'javaQueriesPkg', 'javaRelMdsPkg', 'javaTypesHeader'
];
const parsedArgs = parseArgs(process.argv, [], optionNames, 0);

if ( typeof parsedArgs === 'string' ) // arg parsing error
{
  console.error(`Error: ${parsedArgs}`);
  throw new Error(parsedArgs);
}
else
{
  generateQueries(parsedArgs).then(() => {
    console.log("Query generation completed.");
  });
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

