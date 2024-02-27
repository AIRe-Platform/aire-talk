$gitTag = Invoke-Expression "git tag --points-at HEAD"
$gitTag | Out-File -FilePath "version.json"

$gitId = Invoke-Expression "git rev-parse --short HEAD"

$MyJsonVariable = @"
{
   "hash":"${gitId}",
   "gitTag":"${gitTag}"
}
"@

$MyJsonVariable | Out-File -Encoding utf8 -FilePath "version.json"