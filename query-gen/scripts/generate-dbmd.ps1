param (
  [Parameter(Mandatory = $true)][string]$jdbcProps,
  [Parameter(Mandatory = $true)][string]$dbType
)

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot

mvn -f $scriptDir/../dbmd/pom.xml compile exec:java "-DjdbcProps=$jdbcProps" "-Ddb=$dbType"

npm run --prefix $scriptDir/.. gen-rels-md -- --tsRelsMdDir $scriptDir/../dbmd
