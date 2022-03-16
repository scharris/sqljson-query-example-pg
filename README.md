# SQL/JSON-Query Example Application
This example application generates and exercises SQL and matching result types for nested data queries
using [SQL/JSON-Query](https://scharris.github.io/sqljson-query).

You can view the query definitions source code in file `query-gen/queries/query-specs.ts`.

## Setup

- Install dependencies for the app and for the query-generation sub-project:
  ```
  npm i                 # (for the example app)
  cd query-gen && npm i && npm run compile # (for the query generator)
  ```

- Next initialize the example (Postgres) database as described in `db`.

  If Docker is installed, this may be as easy as just doing:
  ```
  npm run start-db
  ```
  Or you can setup the example database manually as described in [pg-manual-setup](db/pg-manual-setup.md).

## Running the example app
  ```
  npm run app
  ```
  This should generate the SQL and matching result types, then compile and run the app.

You should output describing queries and updates made against the database, followed by a notice
that all changes were rolled back.

## Notes about SQL/JSON-Query usage

The build process is configured to automatically generate the app's SQL and result types source code
whenever the app is built or run via `npm`. See the `scripts` section in `package.json` for details.
Note that only the TypeScript result types are actually used in the example application, the Java source
is generated only as an example to show how it would be done.

The queries and sources are generated based on the query specifications defined at
`query-gen/queries/query-specs.ts`, and using database metadata defined at `query-gen/dbmd/dbmd.json`.
The database metadata is already provided in the example and so doesn't need to be generated in order
to generate queries. However, it may be helpful to see how to perform these steps manually as part of
the build, such as to incorporate them into another project.

### Database Metadata Generation

In a new project (but not this one), the database metadata must be generated before the tool can be run to
generate SQL and result types. After initial metadata generation, the metadata only needs to be refreshed
when the database has changes that need to be incorporated into the app, which is why its npm run script is
not run automatically in the normal build/run process. The database metadata can be generated at the proper
location (`query-gen/dbmd/dbmd.json` and `query-gen/dbmd/relations-metadata.ts`) by running `npm run gen-dbmd`.
This implementation of metadata generation requires Maven and Java. You can however avoid the Java and Maven
dependencies for generating database metadata as implemented here, by following instructions in the
[Generating Database Metadata without Maven and Java](https://scharris.github.io/sqljson-query/tutorial.html#generating-database-metadata-without-maven-and-java)
section in the SQL/JSON tutorial.

