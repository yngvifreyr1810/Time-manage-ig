param([string]$TechPathPath)
$ErrorActionPreference = 'Stop'
if (-not $TechPathPath) {
  try {
    $picker = New-Object -ComObject Shell.Application
    $folder = $picker.BrowseForFolder(0, 'Chon thu muc TechPath (co server.mjs)', 0)
    if (-not $folder) { Write-Host 'Da huy. Chua thay doi file nao.'; exit 0 }
    $TechPathPath = $folder.Self.Path
  } catch {
    $TechPathPath = Read-Host 'Nhap duong dan thu muc TechPath (thu muc co server.mjs)'
  }
}
$TechPathPath = $TechPathPath.Trim().Trim('"')
if (-not (Test-Path -LiteralPath (Join-Path $TechPathPath 'server.mjs'))) { throw 'Khong tim thay server.mjs trong thu muc nay.' }
& node (Join-Path $PSScriptRoot 'install.mjs') $TechPathPath
if ($LASTEXITCODE -ne 0) { throw 'Chua cai thanh cong. Hay giu thong bao loi de kiem tra.' }
& node (Join-Path $PSScriptRoot 'restart.mjs') $TechPathPath
if ($LASTEXITCODE -ne 0) { throw 'File da duoc cai, nhung server chua nap lai. Hay giu thong bao loi ngay phia tren.' }
