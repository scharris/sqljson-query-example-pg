/* NOTE: Usually you won't need to change this file.
   It generates metadata for database tables and fields for use in TypeScript or Java.
 */
import * as minimist from 'minimist';
import * as path from 'path';
import { promises as fs } from 'fs';
import { generateRelationsMetadataSource } from 'sqljson-query';
import { replaceAll } from './utils';

export async function generateRelationsMetadata(parsedArgs: minimist.ParsedArgs)
{
  // Generate SQL source files if specified.
  const internalDbmdDir = path.join(__dirname, '..', 'dbmd');
  const dbmdPath = parsedArgs['dbmd'] || path.join(internalDbmdDir, 'dbmd.json');
  const tsRelsMdOutputDir = parsedArgs['tsRelsMdDir'] || parsedArgs['tsRelMdsDir'];;
  const javaBaseDir = parsedArgs['javaBaseDir'];
  const javaRelsMdPackage = parsedArgs['javaRelsMdPkg'] || parsedArgs['javaRelMdsPkg'];

  if ( tsRelsMdOutputDir )
  {
    await fs.mkdir(tsRelsMdOutputDir, {recursive: true});

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
