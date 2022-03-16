/* NOTE: Usually you won't need to change this file.
   It generates metadata for database tables and fields for use in TypeScript or Java.
 */
import { parseArgs } from './utils';
import { generateRelationsMetadata } from './gen-relsmd-lib';

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
