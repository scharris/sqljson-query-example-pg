#!/bin/sh
set -e

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 2 ] || die "Expected two arguments: <jdbc-properties-file> <db-type=pg|mysql|ora>"

SCRIPTDIR="$(cd "$(dirname "$0")"; pwd)";

JDBC_PROPS=$1
DBTYPE=$2

mvn -f "$SCRIPTDIR"/../dbmd/pom.xml compile exec:java "-DjdbcProps=$JDBC_PROPS" "-Ddb=$DBTYPE"

npm run --prefix "$SCRIPTDIR/.." generate-relations-metadata -- --tsRelsMdDir "$SCRIPTDIR/../dbmd"
