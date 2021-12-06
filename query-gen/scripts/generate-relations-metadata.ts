/* NOTE: Usually you won't need to change this file.
   It generates metadata for database tables and fields for use in TypeScript or Java.
 */
import * as minimist from 'minimist';
import * as path from 'path';
import {promises as fs} from 'fs';
import {generateRelationsMetadataSource} from 'sqljson-query';

async function generateRelationsMetadata(parsedArgs: minimist.ParsedArgs)
{
  // Generate SQL source files if specified.
  const internalDbmdDir = path.join(__dirname, 'dbmd');
  const dbmdPath = parsedArgs['dbmd'] || path.join(internalDbmdDir, 'dbmd.json');
  const tsRelsMdOutputDir = parsedArgs['tsRelsMdDir'] || parsedArgs['tsRelMdsDir'];;
  const javaBaseDir = parsedArgs['javaBaseDir'];
  const javaRelsMdPackage = parsedArgs['javaRelsMdPkg'] || parsedArgs['javaRelMdsPkg'];

  if ( tsRelsMdOutputDir )
  {
    console.log(`Writing TS relation metadatas source file to ${tsRelsMdOutputDir}.`);

    await generateRelationsMetadataSource(dbmdPath, tsRelsMdOutputDir, 'TS');
  }

  // Write Java relation metadatas if specified.
  if ( javaRelsMdPackage )
  {
    if ( !javaBaseDir )
      throw new Error('javaBaseDir is required for Java source generation');

    const javaRelsMdOutputDir = `${javaBaseDir}/${replaceAll(javaRelsMdPackage, '.','/')}`;

    await fs.mkdir(javaRelsMdOutputDir, {recursive: true});

    console.log(`Writing Java relations metadata file to ${javaRelsMdOutputDir}.`);

    await generateRelationsMetadataSource(dbmdPath, javaRelsMdOutputDir, 'Java', javaRelsMdPackage);
  }

  // If no other outputs were specified, write TS rel mds to the internal dbmd directory.
  if ( !tsRelsMdOutputDir && !javaRelsMdPackage )
  {
    await generateRelationsMetadataSource(dbmdPath, internalDbmdDir, 'TS');
  }
}

const optionNames = [
  'dbmd', // database metadata json file path
  'tsRelsMdDir', 'tsRelMdsDir',     // equiv params, former name preferred
  'javaRelsMdPkg', 'javaRelMdsPkg', // "
  'javaBaseDir'
];

const parsedArgs = parseArgs(process.argv, [], optionNames, 0);

if ( typeof parsedArgs === 'string' ) // arg parsing error
{
  console.error(`Error: ${parsedArgs}`);
  throw new Error(parsedArgs);
}
else
{
  generateRelationsMetadata(parsedArgs)
  .then(() => console.log("Generation of relations metadata completed."))
  .catch((e) => {
    console.error(e);
    console.error("Generation of relations metadata failed due to error - see error detail above.");
    process.exit(1);
  });
  ;
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

