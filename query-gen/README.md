# Enabling query generation in an enclosing project

This folder is a self-contained project which can be used from an enclosing project to
generate SQL/JSON queries and source code for the corresponding query result types in
Java and/or TypesScript languages. The below describes how to incorporate this
capability into any project to enable query generation. Any build system which is able
to call npm scripts and `java` 11+ should be able to generate queries via these
instructions.

## Instructions

- Clone or copy this project's folder into your project. From here we'll assume the folder
  is named `query-gen/` at the top level of your project, but this can be adjusted to suit.

- Initialize the query-gen project:
  In the `query-gen` folder, 
  ```
  npm i && cd dbmd && mvn package
  ```
  This step only needs to be performed once to install npm dependencies and compile Java code for
  fetching database metadata from the database.

- Generate database metadata
  
  Add a script or manually-triggered step to your build process to perform the following whenever
  database metadata needs to be updated to reflect changes in the database:
  ```
  java -jar query-gen/dbmd/target/dbmd-fetcher.jar <jdbc.props> <pg|ora> '^[^$].*' query-gen/dbmd/dbmd.json
  ```
  where the connection properties file (here "jdbc.props") has format:
  ```
  jdbc.driverClassName=...
  jdbc.url=...
  jdbc.username=...
  jdbc.password=...
  ```
  
  To remove unwanted tables from database metadata generation, you can adjust the third parameter
  which is a regular expression used to filter relation names.

- Define application queries

  Edit `query-gen/queries/query-specs.ts` to define application queries. Any tables, views and
  fields used in the queries must exist in the database metadata, so database metadata should 
  be generated before proceeding to query generation Example queries involving a drug-related
  schema may be provided in this file, which if so should be replaced with your own queries.

- Generate SQL and source files representing query result types:

  For Java result types:
  
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --javaBaseDir=../src/generated/lib -javaQueriesPkg=gen.queries -javaRelMdsPkg=gen.relmds # --javaResultTypesHeader=...
  ```

  For TypeScript result types:
  
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --tsQueriesDir=../src/generated/lib --tsRelMdsDir=../src/generated/lib --tsTypesHeader=queries/result-types-header-ts
  ```

  The java/tsTypesHeader parameters are not required, but can be used in case additional imports
  or comments are wanted at the top of the generated query result type files.
