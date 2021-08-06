// Example as run from project directory (..):
// # First generate database metadata (initially and when database changes are made).
//   deno run --allow-read=.env.defaults,db/connection.env --allow-write=query-gen/dbmd.json --allow-net=localhost:5432 https://raw.githubusercontent.com/scharris/dbmd-pg/v1.1.2/src/cli.ts --conn-env db/connection.env query-gen/dbmd.json
// # Generate SQL and TS/Java sources.
//   deno run --allow-read=query-gen,src/generated --allow-write=src/generated --unstable query-gen/generate-queries.ts
//
import * as path from 'https://deno.land/std@0.97.0/path/mod.ts';

import { generateQuerySources, generateRelationsMetadataSource, SourceGenerationOptions }
  from 'https://raw.githubusercontent.com/scharris/sqljson-query/v1.2.1/src/mod.ts';

import {queryGroupSpec} from './query-specs.ts';

const scriptDir = path.dirname(path.fromFileUrl(import.meta.url));
const dbmdPath = path.join(scriptDir, 'dbmd.json');

const outputBase = path.join(path.dirname(scriptDir), 'src', 'generated');
const srcOutputDir = path.join(outputBase, 'lib');
const sqlOutputDir = path.join(outputBase, 'sql');

console.log('generate-queries.ts: Generating SQL and TS source code for SQL/JSON queries.');
console.log(`Using database metadata from '${dbmdPath}'.`);
console.log(`Writing TS source code to '${srcOutputDir}'.`);
console.log(`Writing SQL to '${sqlOutputDir}'.`);

// Generate SQL and TS sources

const tsOpts: SourceGenerationOptions = {
  sourceLanguage: 'TS',
  typesHeaderFile: path.join(scriptDir, 'types-header-ts')
};
await generateQuerySources(queryGroupSpec, dbmdPath, srcOutputDir, sqlOutputDir, tsOpts);
await generateRelationsMetadataSource(dbmdPath, srcOutputDir, 'TS');

// Generate SQL (again) with Java sources this time.
// (If an app really needed both TS and Java sources to be generated, the repeat SQL generation could be avoided
//  by passing null for srcOutputDir param in either call to generateQuerySources().)

console.log(`Writing Java source code to '${srcOutputDir}/javapkg'.`);

const javaOpts: SourceGenerationOptions = {
  sourceLanguage: 'Java',
  javaPackage: 'javapkg'
};
await generateQuerySources(queryGroupSpec, dbmdPath, `${srcOutputDir}/javapkg`, sqlOutputDir, javaOpts);
await generateRelationsMetadataSource(dbmdPath, `${srcOutputDir}/javapkg`, 'Java', 'javapkg');

console.log(`Completing queries generation.`);
