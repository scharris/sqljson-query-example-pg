# Enabling query generation in an enclosing project

This folder is a self-contained project which can be used from an enclosing project to
generate SQL/JSON queries and source code for the corresponding query result types in
Java and/or TypesScript languages. The below describes how to incorporate this
capability into any project to enable query generation. Any build system which is able
to call npm scripts and `java` from JDK 11+ should be able to generate queries via these
instructions.

## Instructions

- Clone or copy this project's folder into your project. From here we'll assume the folder
  is named `query-gen/` at the top level of your project, but this can be adjusted to suit.

- Initialize the query-gen project:
  In the `query-gen` folder, 
  ```
  npm i
  ```
  This step only needs to be performed once to install npm dependencies.

  - Generate database metadata
  
    Add a script or manually-triggered step to your build process to perform the following whenever
    database metadata needs to be updated to reflect changes in the database:
    ```
    mvn -f query-gen/dbmd/pom.xml compile exec:java -DjdbcProps=<jdbc-props-file> -Ddb=<pg|ora>
    ```
  
    Here `<jdbc-props-file>` is the path to a properties file with JDBC connection information for
    the database to be examined. The expected format of the jdbc properties file is:
    ```
    jdbc.driverClassName=...
    jdbc.url=...
    jdbc.username=...
    jdbc.password=...
    ```
  
    The above command will produce output file `query-gen/dbmd/dbmd.json` containing the database
    metadata. On first run, examine this file to make sure that the expected tables have been found
    by the metadata generator.
  
    To remove unwanted tables from database metadata generation, add an additional property
    definition `-Ddbmd.table.pattern=<regex>` to the `mvn` command to only include relations
    whose name matches the given regular expression. The pattern defaults to `^[^$].*`.

- Define application queries

  Edit `query-gen/queries/query-specs.ts` to define application queries. Any tables, views and
  fields used in the queries must exist in the database metadata, so database metadata should 
  be generated before proceeding to query generation.

- Generate SQL and source files representing query result types:

  To generate SQL and matching Java result types:
  
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --javaBaseDir=../src/generated/lib -javaQueriesPkg=gen.queries -javaRelMdsPkg=gen.relmds # --javaResultTypesHeader=...
  ```

  To generate SQL and matching TypeScript result types:
  
  ```
  npm run --prefix query-gen generate-queries -- --sqlDir=../src/generated/sql --tsQueriesDir=../src/generated/lib --tsRelMdsDir=../src/generated/lib --tsTypesHeader=queries/result-types-header-ts
  ```

  The java/tsTypesHeader parameters are not required, but can be used in case additional imports
  or comments are wanted at the top of the generated query result type files.
