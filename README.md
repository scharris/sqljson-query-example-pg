# SQL/JSON query Generation
This example application generates and exercises SQL and matching result types for nested data queries
defined at

```query-gen/queries/query-specs.ts```

To run the example:

- Install dependencies for the app and for the query-generation sub-project:
  ```
  npm i && cd query-gen && npm i
  ```

- Next initialize the example (Postgres) database as described in `db`.
  
  If Docker is installed, this may be as easy as just doing:
  ```
  npm run start-db
  ```
  Or you can setup the example database manually as described in `db/pg-manual-setup.md`.

- Then to run the app:
  ```
  npm run app
  ```
  This should generate the SQL and matching result types, then compile and run the app.

You should output describing queries and updates made against the database, followed by a notice
that all changes were rolled back.

## Enabling query generation in another project

The `query-gen` folder in this example project is a self-contained NodeJS project which
can be used from an enclosing project to generate SQL/JSON sql queries and source code
for the corresponding result types in Java and/or TypesScript languages.
The below describes how to incorporate parts of this example into any project to enable
query generation. The outer project is also a NodeJS project in this example, but this is
not required. Any build system which is able to call npm scripts should be able to generate
queries via these instructions without trouble.

- Copy the contents of `query-gen/` into your project.

- Install query-gen dependencies:
  ```
  cd query-gen
  npm i
  ```

- Generate database metadata:
  - Postgres
    ```
    npm run --prefix query-gen generate-dbmd -- --conn-env ../<connection env file> dbmd.json     
    ```
    where the connection environment file has format:
    ```
    PGHOST=...
    PGDATABASE=...
    PGUSER=...
    PGPASSWORD=...
    PGPORT=...
    ```
  - Oracle
    
    Execute the query in `ora-dbmd.sql` which will yield a single json value.
    Store the json result in file `query-gen/dbmd.json`.


- Define application queries

  Edit `query-gen/queries/query-specs.ts` to define application queries.


- Generate SQL and source files representing query result types:

  For Java result types:
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --javaBaseDir=../src/generated/lib -javaPkg=javapkg # --javaResultTypesHeader=...
  ```

  For TypeScript result types:
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --tsDir=../src/generated/lib --tsTypesHeader=queries/result-types-header-ts
  ```
  

- Specify custom header content for result types source

  Sometimes result source files need additional imports, comments etc in their header portion. A custom
  header section can be applied to source files via options `--javaResultTypesHeader` and
  `--tsResultTypesHeader` for Java and TypeScript source files, respectively.

