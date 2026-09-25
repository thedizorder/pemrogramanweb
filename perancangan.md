# PERANCANGAN SISTEM: SCHOOL OF PEOPLE PEOPLE HAVE / COMPANY PROFILE
**Milestone 1 (Pekan Ke-3): Perencanaan Menu & UI Wireframing**

---

## 1. Pendahuluan & Ringkasan Proyek
Sistem ini merupakan platform manajemen konten terpadu untuk pengelolaan website profil sekolah dan informasi publik. Platform ini memfasilitasi administrator, staf pengajar/redaksi, dan humas sekolah dalam mengelola konten publik seperti berita, agenda kegiatan, galeri fasilitas, profil guru/staf, data prestasi siswa, serta manajemen pendaftaran/kontak (PPDB/Inquiry).

---

## 2. Hirarki Navigasi & Menu Aplikasi

### A. Frontend (Situs Publik Profil Sekolah)
1. **Beranda (Home)**
   - Hero Banner & Sambutan Kepala Sekolah
   - Quick Highlights (Jumlah Siswa, Guru, Akreditasi 'A', Fasilitas)
   - Berita & Pengumuman Terbaru
   - Agenda & Kegiatan Mendatang
   - Testimoni Alumni / Mitra
   - Footer (Peta, Kontak Resmi, Medsos)
2. **Tentang Kami (About Us)**
   - Sejarah Singkat & Visi Misi
   - Struktur Organisasi & Dewan Guru
   - Fasilitas & Sarana Prasarana
   - Akreditasi & Prestasi
3. **Akademik & Kesiswaan**
   - Kurikulum & Program Unggulan
   - Ekstrakurikuler
   - Kalender Akademik
4. **Informasi & Berita**
   - Warta Sekolah / Artikel Blog
   - Galeri Foto & Dokumentasi Video
   - Pengumuman Resmi
5. **PPDB / Pendaftaran Online**
   - Panduan Alur Pendaftaran & Biaya
   - Formulir Registrasi Online
   - Cek Status Seleksi Calon Siswa
6. **Hubungi Kami (Contact)**
   - Formulir Pesan & FAQ Publik

---

### B. Backend Admin (Dashboard Panel)
```
Dashboard Admin
├── 1. Ringkasan & Analitik (Overview)
│   ├── Metrik Kunjungan & Statistik Konten
│   ├── Pendaftar Baru (PPDB) & Pesan Masuk
│   └── Aktivitas Terkini (Audit Log)
│
├── 2. Manajemen Konten Publik (Content Management)
│   ├── Berita & Artikel (Daftar, Tulis Baru, Kategori, Tag)
│   ├── Pengumuman Sekolah (Draft, Published, Pin ke Beranda)
│   ├── Galeri Fasilitas & Dokumentasi Kegiatan (Media Manager)
│   └── Halaman Statis (Visi Misi, Sejarah, Kebijakan)
│
├── 3. Data Akademik & Sivitas
│   ├── Data Tenaga Pendidik & Staf (Direktori Guru, Mata Pelajaran)
│   ├── Ekstrakurikuler & Program Kejuruan/Unggulan
│   └── Riwayat Prestasi Siswa & Guru
│
├── 4. Layanan & Interaksi
│   ├── Penerimaan Peserta Didik Baru (PPDB Online)
│   │   ├── Verifikasi Berkas & Pembayaran
│   │   ├── Status Kelulusan / Seleksi
│   │   └── Export Data Calon Siswa (Excel/PDF)
│   └── Kotak Masuk / Pesan & Pertanyaan Publik
│
└── 5. Pengaturan Sistem (Settings)
    ├── Identitas Lembaga (Logo, Kontak, Alamat, Sosmed)
    ├── Manajemen Pengguna & Hak Akses (RBAC: Super Admin, Redaktur, Verifikator PPDB)
    └── Pengaturan SEO & Backup Data
```

---

## 3. Konsep ER-D (Entity Relationship Diagram)
Berikut adalah rancangan basis data konseptual menggunakan sintaks **Mermaid.js**:

```mermaid
erDiagram
    USERS ||--o{ POSTS : "menulis"
    USERS ||--o{ ACTIVITY_LOGS : "mencatat"
    ROLES ||--|{ USERS : "memiliki"
    
    CATEGORIES ||--o{ POSTS : "mengelompokkan"
    POSTS ||--o{ POST_TAGS : "memiliki"
    TAGS ||--o{ POST_TAGS : "dimiliki"
    
    MEDIA_GALLERY ||--o{ POSTS : "disematkan_pada"
    
    DEPARTMENTS ||--o{ STAFF_MEMBERS : "menaungi"
    
    PPDB_PERIODS ||--o{ PPDB_REGISTRATIONS : "dibuka_untuk"
    PPDB_REGISTRATIONS ||--o{ PPDB_DOCUMENTS : "melampirkan"

    ROLES {
        int id PK
        string role_name "Superadmin, Editor, Verifikator"
        json permissions
    }

    USERS {
        int id PK
        int role_id FK
        string name
        string email
        string password_hash
        string avatar_url
        boolean is_active
        timestamp created_at
    }

    CATEGORIES {
        int id PK
        string name
        string slug
        string description
    }

    TAGS {
        int id PK
        string name
        string slug
    }

    POSTS {
        int id PK
        int author_id FK
        int category_id FK
        string title
        string slug
        text content
        string featured_image
        enum status "draft, published, archived"
        int view_count
        timestamp published_at
    }

    POST_TAGS {
        int post_id FK
        int tag_id FK
    }

    MEDIA_GALLERY {
        int id PK
        int uploaded_by FK
        string file_name
        string file_url
        string file_type "image, video, document"
        int file_size
        timestamp created_at
    }

    DEPARTMENTS {
        int id PK
        string name "Kurikulum, Tata Usaha, Guru Mapel"
        string head_of_dept
    }

    STAFF_MEMBERS {
        int id PK
        int department_id FK
        string nip
        string full_name
        string title_degree
        string position
        string photo_url
        string email
    }

    PPDB_PERIODS {
        int id PK
        string academic_year "2025/2026"
        date start_date
        date end_date
        int quota
        boolean is_active
    }

    PPDB_REGISTRATIONS {
        int id PK
        int period_id FK
        string registration_number
        string student_name
        string nisn
        string gender
        date birth_date
        string origin_school
        string parent_phone
        enum status "menunggu_verifikasi, berkas_lengkap, lolos, tidak_lolos"
        timestamp submitted_at
    }

    PPDB_DOCUMENTS {
        int id PK
        int registration_id FK
        string document_type "Akte, Kartu Keluarga, Rapor"
        string file_url
        boolean is_verified
    }

    ACTIVITY_LOGS {
        int id PK
        int user_id FK
        string action
        string entity_name
        int entity_id
        timestamp created_at
    }
```

---

## 4. Skema Komponen Polimorfik & UI Wireframing

### Komponen Kunci:
1. **Polymorphic Content Card (`<Card />`)**:
   - Varian: *ArticleCard*, *EventCard*, *StaffDirectoryCard*, *FacilityCard*.
   - Properti adaptif: Gambar thumbnail, meta badge (kategori/status), header judul, dan call-to-action dinamis.
2. **Data Table Panel (`<DataTable />`)**:
   - Filter dinamis berdasarkan kategori/status.
   - Batch actions (Publish, Delete, Export).
   - Indikator status tag berwarna (Pill badge).
3. **Metric KPI Card (`<StatCard />`)**:
   - Menampilkan total artikel, pendaftar PPDB, kunjungan unik, dan persentase perubahan.
4. **Unified App Shell (`<AdminShell />`)**:
   - Sidebar navigasi hierarkis responsif, header dengan notifikasi pendaftar & profil akun aktif.

---

## 5. Tautan Prototyping & Visualisasi
- **Status Wireframe & UI Canvas**: Dirancang langsung pada workspace Google Stitch dengan layout Desktop responsif (Admin Dashboard Panel & Landing Page Preview).
- **Figma Design System & Wireframe Link**: `https://www.figma.com/design/sample-project-sekolah-portal/Wireframe-Prototype-v1` *(Placeholder link proyek)*
