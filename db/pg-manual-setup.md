# Database setup (Postgres)
Note: If docker is available on your platform, it may be easier to just run the
database via docker by calling the `example/db/init-pg.sh` script.

```
# psql -U postgres template1
create user drugs with password 'drugs';
create database drugs owner drugs;
\q
```

```
# psql -U drugs
create schema drugs authorization drugs;
alter role drugs set search_path to drugs;
\i db/sql/create-schema-objects.sql
\i db/sql/create-test-data.sql
```
