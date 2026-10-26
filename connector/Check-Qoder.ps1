param([string]$TechPathPath)
$ErrorActionPreference = 'Stop'
if (-not $TechPathPath) {
  $picker = New-Object -ComObject Shell.Application
  $folder = $picker.BrowseForFolder(0, 'Chon thu muc TechPath (co server.mjs)', 0)
  if (-not $folder) { exit 0 }
  $TechPathPath = $folder.Self.Path
}
$script = Join-Path $TechPathPath 'check-qoder.mjs'
if (-not (Test-Path -LiteralPath $script)) { throw 'Hay chay Install-Nhip.cmd moi truoc.' }
& node $script
if ($LASTEXITCODE -ne 0) { throw 'Kiem tra chua hoan tat; hay giu thong bao loi.' }
