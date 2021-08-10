/* NOTE: Usually you won't need to change this file.
   It generates SQL, TS and/or Java sources for the queries specified in the query-specs.ts file,
   with options and output file locations as specified by the input arguments.
   Example usage generating SQL and both Java and TS source files:
      node generate-queries --sqlDir=../src/generated/sql --tsDir=../src/generated/lib --tsTypesHeader=result-types-header-ts --javaBaseDir=../src/generated/lib --javaPkg=javapkg",
 */
import * as minimist from 'minimist';
import * as path from 'path';
import {promises as fs} from 'fs';
import {generateQuerySources, generateRelationsMetadataSource, SourceGenerationOptions} from 'sqljson-query';

import {queryGroupSpec} from './queries/query-specs';

const optionNames = ['sqlDir','tsDir','tsTypesHeader','javaBaseDir','javaPkg','javaTypesHeader'];
const parsedArgs = parseArgs(process.argv, [], optionNames, 0);

async function go()
{
  if ( typeof parsedArgs === 'string' ) { console.error(`Error: ${parsedArgs}`); throw new Error(parsedArgs); }

  console.log(parsedArgs);

  const dbmdPath = path.join(__dirname, 'dbmd', 'dbmd.json');
  const sqlOutputDir: string | null = parsedArgs['sqlDir'];

  console.log(`Using database metadata from '${dbmdPath}'`);

  if ( sqlOutputDir )
  {
    await fs.mkdir(sqlOutputDir, { recursive: true });
    console.log(`SQL files will be written to ${sqlOutputDir}.`);
  }

  // Generate TS sources if specified.
  const tsOutputDir = parsedArgs['tsDir'];
  if ( tsOutputDir )
  {
    await fs.mkdir(tsOutputDir, { recursive: true });

    console.log(`Writing TS source files to ${tsOutputDir}.`);

    const tsOpts: SourceGenerationOptions = {
      sourceLanguage: 'TS',
      typesHeaderFile: parsedArgs['tsTypesHeader'] || undefined
    };

    await generateQuerySources(queryGroupSpec, dbmdPath, tsOutputDir, sqlOutputDir, tsOpts);
    await generateRelationsMetadataSource(dbmdPath, tsOutputDir, 'TS');
  }

  // Generate Java sources if specified.
  const javaOutputBaseDir = parsedArgs['javaBaseDir'];
  if ( javaOutputBaseDir )
  {
    const javaPackage = parsedArgs['javaPkg'];
    const javaOutputDir = `${javaOutputBaseDir}/${replaceAll(javaPackage, '.','/')}`;

    await fs.mkdir(javaOutputDir, { recursive: true });

    console.log(`Writing Java source files to ${javaOutputDir}.`);

    const javaOpts: SourceGenerationOptions = {
      sourceLanguage: 'Java',
      javaPackage,
      typesHeaderFile: parsedArgs['javaTypesHeader']
    };

    const maybeSqlOutputDir = tsOutputDir != null ? null : sqlOutputDir; // avoid writing SQL again if already written for TS
    await generateQuerySources(queryGroupSpec, dbmdPath, javaOutputDir, maybeSqlOutputDir, javaOpts);
    await generateRelationsMetadataSource(dbmdPath, javaOutputDir, 'Java', javaPackage);
  }
}

go().then(() => {
  console.log("Query generation completed.");
});


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

