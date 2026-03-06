# 🎓 SIAKAD ITS — Modern UI

> Chrome extension yang mengubah tampilan [SIAKAD ITS](https://akademik.its.ac.id) menjadi modern, bersih, dan nyaman dipakai — tanpa menghilangkan fungsionalitas aslinya.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Tampilan

| Sebelum | Sesudah |
|---------|---------|
| Layout tabel lama, font default browser, warna tahun 2005 | Sidebar navigasi, card grid, typography modern, grade pills berwarna |

---

## 🚀 Fitur

### Layout
- **Sidebar navigasi** dengan avatar, nama, NIM, dan badge semester aktif
- **Topbar** per halaman dengan judul dan prodi
- **Dashboard home** dengan stat cards dan quick access module grid

### Tampilan Nilai
- Grade **A / AB / B / BC / C / D / E** otomatis jadi pill berwarna (hijau → merah)
- IPK/IPS diwarnai sesuai range — hijau ≥3.5, biru ≥3.0, kuning ≥2.5, merah <2.0
- Tabel dibungkus card dengan scroll horizontal

### Interaktivitas tetap utuh
Halaman yang punya form/interaksi penting **tidak di-clone** — kontennya dipindahkan ke dalam shell baru sehingga semua event listener dan form action tetap berfungsi:

| Halaman | Fitur yang dijaga |
|---------|-------------------|
| `list_frs.php` | Tambah / hapus mata kuliah |
| `ipd_kuesionermk.php` | Pengisian kuesioner (radio button) |
| `data_kur.php` | Pilih kurikulum semester |
| `data_update_biodata.php` | Edit & verifikasi biodata |
| `surat_mahasiswa.php` | Request surat online |
| `skpi_draft.php` | Edit draft SKPI |
| `data_mhswisuda.php` | Update data wisuda |

---

## 📦 Instalasi

### 1. Download / Clone

```bash
git clone https://github.com/fahmiilmi14/SIAKAD-REMAKE-UI
```

atau download ZIP dari halaman Releases.

### 2. Load ke Chrome

1. Buka **Chrome** → ketik `chrome://extensions` di address bar
2. Aktifkan **Developer Mode** (toggle di pojok kanan atas)
3. Klik **Load unpacked**
4. Pilih folder `siakad-fixed` (atau nama folder hasil extract)
5. Ekstensi aktif — buka [akademik.its.ac.id](https://akademik.its.ac.id)

---

## 🗂️ Struktur Project

```
siakad-fixed/
├── manifest.json        # Chrome extension manifest (v3)
├── content.js           # Main script — build shell, route pages, style content
├── popup.html           # Popup UI saat klik icon ekstensi
└── styles/
    └── main.css         # Semua CSS — layout, komponen, animasi
```

---

## 🧠 Cara Kerja

Ekstensi ini **tidak mengubah server** atau data apapun — murni client-side visual overhaul.

```
Page Load
   │
   ├── Baca info user dari DOM lama (NIM, nama, prodi, semester)
   │
   ├── Bangun shell baru: Sidebar + Topbar + Content area
   │
   └── Route berdasarkan halaman:
         ├── home.php           → Stat cards + module grid (baru)
         ├── INTERACTIVE_PAGES  → MOVE konten asli ke shell (form tetap hidup)
         └── Halaman lain       → Clone tabel → render sebagai card modern
```

CSS di-inject via `content_scripts` di `manifest.json`, JS berjalan setelah `document_end`.

---

## 🎨 Design System

| Token | Nilai |
|-------|-------|
| Font heading | Outfit (Google Fonts) |
| Font body | Nunito (Google Fonts) |
| Accent blue | `#3b6ef8` |
| Background | `#f0f4ff` |
| Surface | `#ffffff` |
| Border | `#e8edf5` |
| Radius card | `16px` |

---

## ⚠️ Catatan

- Ekstensi hanya aktif di domain `akademik.its.ac.id`
- Tidak menyimpan, mengirim, atau memodifikasi data akademik apapun
- Jika ada update tampilan dari pihak ITS yang mengubah struktur HTML, beberapa halaman mungkin perlu penyesuaian selector
- Tested di Chrome — belum diuji di Firefox / Edge

---

## 🤝 Kontribusi

Pull request welcome! Beberapa hal yang bisa dikembangkan:

---

## 📄 License

MIT — bebas dipakai, dimodifikasi, dan didistribusikan.

---
