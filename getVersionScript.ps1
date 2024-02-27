$gitTag = Invoke-Expression "git tag --points-at HEAD"
$gitId = Invoke-Expression "git rev-parse --short HEAD"

$json = @"
{
   "hash":"${gitId}",
   "gitTag":"${gitTag}"
}
"@

$json | Out-File -Encoding utf8 -FilePath "version.json"