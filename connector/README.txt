NHIP - KET NOI AI DUNG CHUNG TECHPATH

1. Giai nen toan bo file zip vao mot thu muc rieng.
2. Neu da cai nhung bao chua co ket noi Nhip: dung Repair-Nhip.cmd.
3. Mo Install-Nhip.cmd (hoac Repair-Nhip.cmd), chon thu muc TechPath co server.mjs.
4. Bo sua tu xac minh dung thu muc va PID TechPath, nap lai server va kiem tra Nhip.
5. Mo Nhip, bam Ket noi AI, chon provider/model dang dung.

Neu trinh duyet chan web goi may ca nhan, dung ban Nhip cung may:
http://127.0.0.1:4173/nhip/index.html

Bo cai them route /api/nhip/* va ngu canh Nhip vao cac bo goi model.
Launcher TechPath cu giu server ngam dang chay; mo lai launcher khong tu nap code moi.
Bo sua dung installation ID cua thu muc, PID tu health, process Node server.mjs
va PID listener 4173 de xac minh truoc khi chi dung dung tien trinh TechPath.
Khong dung 9Router, LM Studio hay cac tien trinh Node khac.
Chi bao thanh cong khi /api/nhip/health xac nhan code moi da nap.
SQL va tro chuyen TechPath van giu ngu canh cu. Khong doi provider/model,
khong goi model de test. File goc duoc sao luu trong .techpath-local/nhip-backup.
Neu cau truc TechPath khac ban da kiem tra, bo cai se dung truoc khi sua.

Du lieu phan hoi duoc luu trong trinh duyet Nhip. Xuat JSONL chi tao file
tren may; khong tu gui di fine-tune hoac dua vao ma nguon.
