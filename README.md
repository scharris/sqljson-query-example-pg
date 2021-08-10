# SQL/JSON query Generation
This example application generates and exercises SQL and matching result types for nested data queries
defined at

```query-gen/queries/query-specs.ts```

To run the example:

- Install dependencies for the app and for the query-generation sub-project:
  ```
  npm i && cd query-gen && npm i && cd dbmd && mvn package
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

The `query-gen` folder in this example project is a self-contained project which can be
used from an enclosing project to generate SQL/JSON sql queries and source code
for the corresponding result types in Java and/or TypesScript languages.
The below describes how to incorporate parts of this example into any project to enable
query generation. The outer project is also a NodeJS project in this example, but this is
not required. Any build system which is able to call npm scripts should be able to generate
queries via these instructions without trouble.

- Copy the contents of `query-gen/` into your project.

- Initialize the query-gen project:
  ```
  cd query-gen && npm i && cd dbmd && mvn package
  ```
  This step only needs to be performed once to install npm dependencies and compile Java code for
  fetching database metadata from the database.

- Generate database metadata
  
  Add a script or manually-triggered step to your build process to perform the following whenever database
  metadata needs to be updated to reflect changes in the database:
  ```
  java -jar query-gen/dbmd/target/dbmd-fetcher.jar <jdbc.props> <pg|ora> '.*' query-gen/dbmd/dbmd.json
  ```
  where the connection properties file (here "jdbc.props") has format:
  ```
  jdbc.driverClassName=...
  jdbc.url=...
  jdbc.username=...
  jdbc.password=...
  ```

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

