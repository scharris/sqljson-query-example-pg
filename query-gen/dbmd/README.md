# Database metadata fetcher

## Build
```
mvn clean package
```

## Run

### Running via Maven
```
mvn -f query-gen/dbmd/pom.xml compile exec:java "-DjdbcProps=<jdbc-props-file>" "-Ddb=<pg|ora>"
```

### Running via jar
As an example run from the parent directory of the enclosing `query-gen` directory:
```
java -jar query-gen/dbmd/target/dbmd-fetcher.jar db/jdbc.props pg '^[^$].*' query-gen/dbmd/dbmd.json
```

Fetching metadata for an Oracle database would be similar:

```
java -jar query-gen/dbmd/target/dbmd-fetcher.jar someOraJdbc.props ora '^[^$].*' query-gen/dbmd/dbmd.json
```
