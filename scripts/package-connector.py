from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
app_files = ['index.html', 'styles.css', 'workshop.css', 'app.js', 'workshop.js', 'ai-client.js', 'guide.js', 'guide.css']
connector_files = ['install.mjs', 'restart.mjs', 'Install-Nhip.ps1', 'Install-Nhip.cmd', 'Repair-Nhip.cmd', 'provider-catalog.mjs', 'qoder-check-transport.txt', 'check-qoder.mjs', 'Check-Qoder.cmd', 'Check-Qoder.ps1', 'nhip-http.mjs', 'nhip-prompts.mjs', 'README.txt']
with ZipFile(root / 'dist' / 'nhip-connector.zip', 'w', ZIP_DEFLATED) as archive:
    for name in connector_files:
        archive.write(root / 'connector' / name, name)
    for name in app_files:
        archive.write(root / 'dist' / name, 'app/' + name)
print('Packaged connector code and neutral frontend assets only.')
