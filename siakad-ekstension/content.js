// ===== SIAKAD ITS — Modern Card UI (with color theming) =====
(function () {
  'use strict';

  // ── Color theming ─────────────────────────────
  // Inject a <style> tag that overrides CSS variables with user's chosen accent
  const COLOR_STYLE_ID = 'siakad-color-override';

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  }
  function lighten(hex, amt) {
    const [r,g,b] = hexToRgb(hex);
    const m = c => Math.round(c + (255-c) * amt);
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }
  function darken(hex, amt) {
    const [r,g,b] = hexToRgb(hex);
    const m = c => Math.round(c * (1-amt));
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }

  function buildColorVars(palette) {
    const { hex, dark, soft, soft2 } = palette;
    // Generate gradient stop
    const grad2 = lighten(hex, 0.18);
    return `
      :root {
        --blue:      ${hex} !important;
        --blue-2:    ${grad2} !important;
        --blue-dark: ${dark} !important;
        --blue-soft: ${soft} !important;
      }
      /* Gradient surfaces that use blue */
      #sk-sidebar .sk-logo-icon {
        background: linear-gradient(135deg, ${hex}, ${grad2}) !important;
      }
      .sk-user { background: ${soft} !important; }
      .sk-user .sk-user-nim { color: ${hex} !important; }
      .sk-user .sk-user-name { color: ${dark} !important; }
      .sk-nav-item:hover, .sk-nav-item.active {
        background: ${soft} !important;
        color: ${hex} !important;
      }
      .sk-nav-item:hover .sk-nav-icon,
      .sk-nav-item.active .sk-nav-icon { color: ${hex} !important; }
      .sk-prodi-badge {
        background: ${soft} !important;
        color: ${hex} !important;
        border-color: ${soft2} !important;
      }
      .sk-stat-card.blue::before { background: linear-gradient(90deg, ${hex}, ${grad2}) !important; }
      .sk-stat-card.blue .sk-stat-icon { background: ${soft2} !important; color: ${hex} !important; }
      .sk-section-title::before { background: linear-gradient(to bottom, ${hex}, ${grad2}) !important; }
      .sk-table-card-header { background: ${soft} !important; }
      .sk-table-card-title { color: ${hex} !important; }
      .sk-topbar-icon { color: ${hex} !important; }
      .sk-announce { border-left-color: ${hex} !important; }
      .sk-announce-title { color: ${hex} !important; }
      .sk-announce-cell { border-left-color: ${hex} !important; }
      .sk-cat-header { border-left-color: ${hex} !important; }
      .sk-interactive-wrap input[type=submit],
      .sk-interactive-wrap input[type=button],
      .sk-interactive-wrap button,
      .sk-btn { background: ${hex} !important; }
      .sk-interactive-wrap input[type=submit]:hover,
      .sk-interactive-wrap input[type=button]:hover,
      .sk-interactive-wrap button:hover { background: ${dark} !important; }
      .sk-interactive-wrap input[type=text]:focus,
      .sk-interactive-wrap select:focus { border-color: ${hex} !important; box-shadow: 0 0 0 3px ${soft2} !important; }
      .sk-interactive-wrap tr:hover td,
      tbody tr:hover td { background: ${soft} !important; }
      .sk-module-card:hover { border-color: ${soft2} !important; }
      .sk-module-card:hover .sk-module-arrow { color: ${hex} !important; }
      .sk-list-link:hover { background: ${soft} !important; color: ${hex} !important; }
      .sk-list-link:hover::before { color: ${hex} !important; }
      a { color: ${hex} !important; }
      a:hover { color: ${dark} !important; }
      .sk-icon-sm { color: ${hex} !important; }
      input[type=radio], input[type=checkbox] { accent-color: ${hex} !important; }
    `;
  }

  function applyColor(palette) {
    let styleEl = document.getElementById(COLOR_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = COLOR_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = buildColorVars(palette);
  }

  // Load saved accent color from storage
  const DEFAULT_PALETTE = { name:'ITS Blue', hex:'#3b6ef8', dark:'#1e40af', soft:'#eff6ff', soft2:'#dbeafe' };
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get({ accentColor: DEFAULT_PALETTE }, (data) => {
      applyColor(data.accentColor);
    });
    // Listen for live color changes from popup
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'SET_COLOR' && msg.palette) {
        applyColor(msg.palette);
      }
    });
  }

  // ── Fonts ─────────────────────────────────────
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);

  // ── SVG Icon Library (Lucide) ─────────────────
  const IC = {
    home:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    user:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    edit:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    clipboard:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
    book:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    calendar:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    target:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    barchart:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    filetxt:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    creditcard: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    mail:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    award:      `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    logout:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    school:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    refresh:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    star:       `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    receipt:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
    idcard:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M13 12h4M13 16h4M9 16h.01"/></svg>`,
    announce:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    wallet:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="16" cy="13" r="1" fill="currentColor"/></svg>`,
    search:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    layers:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    chevron:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  };
  const IC24 = {
    book:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    grad:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    building:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
    cal:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  };

  // ── Read user info BEFORE touching DOM ────────
  const userRow    = document.querySelector('td[align="right"]')?.textContent || '';
  const nimMatch   = userRow.match(/(\d{10,})/);
  const nameMatch  = userRow.match(/,\s*([^&\n]+)/);
  const nim        = nimMatch  ? nimMatch[1].trim()  : '';
  const name       = nameMatch ? nameMatch[1].trim() : 'Mahasiswa';
  const initials   = name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const prodiSel   = document.querySelector('#sJur');
  const prodiText  = prodiSel?.options[prodiSel.selectedIndex]?.text || '';
  const prodiShort = prodiText.includes('INFORMATIKA') ? 'Teknik Informatika'
                   : prodiText.includes('ELEKTRO')     ? 'Teknik Elektro'
                   : prodiText.split('-').pop()?.trim() || 'ITS';
  const periodRaw  = document.querySelector('tr[height="20"] td, tr[style*="ece9d8"] td')?.textContent || '';
  const periodText = periodRaw.replace('Periode:','').split('Tanggal:')[0].trim() || 'Genap 2025/2026';
  const page       = location.pathname.split('/').pop() || 'home.php';

  const INTERACTIVE_PAGES = new Set([
    'list_frs.php','ipd_kuesionermk.php','data_update_biodata.php',
    'data_kur.php','data_mhswisuda.php','surat_mahasiswa.php',
    'skpi_draft.php','css_bio_puas.php',
    'yudisium_nilai_bahasa_asing.php','ekivalensi_rekapitulasi_mhs.php',
  ]);

  const NAV = [
    { sec:'Utama' },
    { label:'Dashboard',      icon:IC.home,       href:'home.php'                    },
    { label:'Biodata',        icon:IC.user,        href:'data_mhs.php'                },
    { sec:'Akademik' },
    { label:'Rencana Studi',  icon:IC.clipboard,   href:'list_frs.php'                },
    { label:'Kurikulum',      icon:IC.book,        href:'data_kur.php'                },
    { label:'Jadwal Kuliah',  icon:IC.calendar,    href:'list_mhsjadwal.php'          },
    { label:'Kuesioner IPD',  icon:IC.filetxt,     href:'ipd_kuesionermk.php'         },
    { sec:'Nilai' },
    { label:'Nilai Per MK',   icon:IC.target,      href:'data_nilaimhs.php'           },
    { label:'Nilai/Semester', icon:IC.barchart,    href:'data_nilaipersem.php'        },
    { label:'Transkrip',      icon:IC.filetxt,     href:'xrep_transkrip.php'          },
    { sec:'Lainnya' },
    { label:'Tagihan',        icon:IC.creditcard,  href:'data_tagihan_pendidikan.php' },
    { label:'Surat',          icon:IC.mail,        href:'surat_mahasiswa.php'         },
    { label:'SKPI',           icon:IC.award,       href:'skpi_draft.php'              },
    { sec:'' },
    { label:'Keluar',         icon:IC.logout,      href:'sys_logout.php', cls:'logout'},
  ];

  const PAGE_META = {
    'home.php':                    [IC.home,       'Dashboard'              ],
    'data_mhs.php':                [IC.user,        'Biodata Mahasiswa'      ],
    'data_update_biodata.php':     [IC.edit,        'Verifikasi Biodata'     ],
    'list_frs.php':                [IC.clipboard,   'Formulir Rencana Studi' ],
    'data_kur.php':                [IC.book,        'Kurikulum Semester'     ],
    'list_mhsjadwal.php':          [IC.calendar,    'Jadwal Kuliah'          ],
    'data_nilaimhs.php':           [IC.target,      'Nilai Per Mahasiswa'    ],
    'data_nilaipersem.php':        [IC.barchart,    'Nilai Per Semester'     ],
    'xrep_transkrip.php':          [IC.filetxt,     'Transkrip'              ],
    'xrep_transkrip_sementara.php':[IC.filetxt,     'Transkrip Sementara'    ],
    'data_tagihan_pendidikan.php': [IC.creditcard,  'Tagihan Pendidikan'     ],
    'data_historis_pembayaran.php':[IC.receipt,     'Historis Pembayaran'    ],
    'surat_mahasiswa.php':         [IC.mail,        'Layanan Surat'          ],
    'skpi_draft.php':              [IC.award,       'Draft SKPI'             ],
    'ipd_kuesionermk.php':         [IC.filetxt,     'Kuesioner IPD'          ],
    'data_mhsakademik.php':        [IC.school,      'Akademik Mahasiswa'     ],
    'data_mhswisuda.php':          [IC.graduation,  'Data Wisuda'            ],
    'ekivalensi_rekapitulasi_mhs.php':[IC.refresh,  'Ekivalensi'             ],
    'css_bio_puas.php':            [IC.star,        'Survei Kepuasan'        ],
    'xrep_kartumahasiswa.php':     [IC.idcard,      'KTM Virtual'            ],
  };
  const [pageIcon, pageTitle] = PAGE_META[page] || [IC.filetxt, document.title.replace('[SIAKAD-ITS]','').trim()];

  const GRADES = new Set(['A','AB','B','BC','C','D','E','T','K']);
  function gradePill(t) {
    if (!GRADES.has(t)) return null;
    return `<span class="sk-grade ${t}">${t}</span>`;
  }
  function gpaPill(t) {
    if (!/^\d\.\d{2}$/.test(t)) return null;
    const v = parseFloat(t);
    const c = v>=3.5?'high':v>=3.0?'mid':v>=2.0?'low':'fail';
    return `<span class="sk-gpa ${c}">${t}</span>`;
  }

  function buildShell() {
    const shell = document.createElement('div');
    shell.id = 'siakad-shell';
    const sidebar = document.createElement('div');
    sidebar.id = 'sk-sidebar';
    sidebar.innerHTML = `
      <div class="sk-logo">
        <div class="sk-logo-icon">${IC.graduation}</div>
        <div class="sk-logo-text"><strong>SIAKAD ITS</strong><span>Academic Portal</span></div>
      </div>
      <div class="sk-user">
        <div class="sk-avatar">${initials}</div>
        <div class="sk-user-info">
          <div class="sk-user-name">${name.split(' ').slice(0,3).join(' ')}</div>
          <div class="sk-user-nim">${nim}</div>
        </div>
      </div>`;

    let lastSec = null;
    NAV.forEach(item => {
      if ('sec' in item) {
        if (!item.sec) return;
        const sec = document.createElement('div');
        sec.className = 'sk-nav-section';
        sec.innerHTML = `<div class="sk-nav-label">${item.sec}</div>`;
        sidebar.appendChild(sec); lastSec = sec; return;
      }
      const a = document.createElement('a');
      a.href = item.href;
      a.className = `sk-nav-item${page===item.href?' active':''}${item.cls?' '+item.cls:''}`;
      a.innerHTML = `<div class="sk-nav-icon">${item.icon}</div>${item.label}`;
      (lastSec || sidebar).appendChild(a);
    });

    const pb = document.createElement('div');
    pb.className = 'sk-period';
    pb.innerHTML = `<div class="sk-period-label">Semester Aktif</div><div class="sk-period-value">${periodText}</div>`;
    sidebar.appendChild(pb);

    const main = document.createElement('div');
    main.id = 'sk-main';
    main.innerHTML = `
      <div id="sk-topbar">
        <div class="sk-topbar-title"><span class="sk-topbar-icon">${pageIcon}</span>${pageTitle}</div>
        <div class="sk-topbar-right"><div class="sk-prodi-badge">${prodiShort}</div></div>
      </div>`;
    const content = document.createElement('div');
    content.id = 'sk-content';
    main.appendChild(content);
    shell.appendChild(sidebar);
    shell.appendChild(main);
    document.body.appendChild(shell);
    return content;
  }

  function convertTable(oldTable, title, icon) {
    const card = document.createElement('div');
    card.className = 'sk-table-card sk-animate';
    if (title) card.innerHTML = `<div class="sk-table-card-header"><div class="sk-table-card-title"><span class="sk-icon-sm">${icon}</span>${title}</div></div>`;
    const wrap = document.createElement('div'); wrap.className = 'sk-table-wrap';
    const nt = document.createElement('table'); nt.className = 'sk-table';
    const ths = oldTable.querySelectorAll('th, thead td');
    if (ths.length) {
      const thead = nt.createTHead(); const tr = thead.insertRow();
      ths.forEach(th => { const newTh = document.createElement('th'); newTh.textContent = th.textContent.trim(); tr.appendChild(newTh); });
    }
    const tbody = nt.createTBody();
    oldTable.querySelectorAll('tbody tr, tr').forEach(row => {
      if (row.querySelector('th')) return;
      const cells = row.querySelectorAll('td'); if (!cells.length) return;
      const newRow = tbody.insertRow();
      cells.forEach(cell => {
        const td = newRow.insertCell(); const txt = cell.textContent.trim();
        td.innerHTML = gradePill(txt) || gpaPill(txt) || ''; if (!td.innerHTML) td.textContent = txt;
      });
    });
    if (!tbody.rows.length) { wrap.innerHTML = `<div class="sk-empty"><span class="sk-empty-icon">${IC.search}</span><div class="sk-empty-text">Tidak ada data</div></div>`; }
    else wrap.appendChild(nt);
    card.appendChild(wrap); return card;
  }

  function buildInteractivePage(content) {
    const containers = [
      document.querySelector('div[align="center"]'),
      ...Array.from(document.querySelectorAll('body > form:not(#fMenu)')),
      ...Array.from(document.querySelectorAll('body > table:not(#fMenu table)')),
    ].filter(Boolean);
    const card = document.createElement('div'); card.className = 'sk-table-card sk-animate';
    card.innerHTML = `<div class="sk-table-card-header"><div class="sk-table-card-title"><span class="sk-icon-sm">${pageIcon}</span>${pageTitle}</div></div>`;
    const inner = document.createElement('div'); inner.className = 'sk-interactive-wrap';
    containers.forEach(n => inner.appendChild(n));
    card.appendChild(inner); content.appendChild(card);
    cosmeticStyle(inner);
  }

  function cosmeticStyle(root) {
    root.querySelectorAll('table[border], table[cellpadding]').forEach(t => {
      t.classList.add('sk-table'); t.removeAttribute('border'); t.removeAttribute('cellpadding'); t.removeAttribute('cellspacing');
      if (!t.parentElement.classList.contains('sk-table-wrap')) {
        const w = document.createElement('div'); w.className = 'sk-table-wrap';
        t.parentNode.insertBefore(w, t); w.appendChild(t);
      }
    });
    root.querySelectorAll('th').forEach(th => th.classList.add('sk-th-style'));
    root.querySelectorAll('td').forEach(td => {
      if (td.children.length) return;
      const p = gradePill(td.textContent.trim()) || gpaPill(td.textContent.trim());
      if (p) td.innerHTML = p;
    });
    root.querySelectorAll('div[style*="DFE3EB"]').forEach(d => { d.removeAttribute('style'); d.classList.add('sk-cat-header'); });
    root.querySelectorAll('img[src*="corner"], img[src*="upper_accent"], img[src*="selamatdatang"]').forEach(img => img.style.display='none');
    root.querySelectorAll('table[width], td[width]').forEach(el => el.removeAttribute('width'));
    root.querySelectorAll('[style*="width:700"]').forEach(el => el.style.width='100%');
    root.querySelectorAll('div[style*="background-color:#efefef"]').forEach(d => { d.removeAttribute('style'); d.classList.add('sk-link-list-wrap'); });
    root.querySelectorAll('div[style*="background-color:#DFE3EB"]').forEach(d => { d.removeAttribute('style'); d.classList.add('sk-cat-header'); });
    root.querySelectorAll('p > a[href]').forEach(a => { a.classList.add('sk-list-link'); a.querySelectorAll('img[src*="bullet"]').forEach(i=>i.remove()); });
    root.querySelectorAll('td[style*="background-color:#ccccff"]').forEach(td => { td.removeAttribute('style'); td.classList.add('sk-announce-cell'); });
    root.querySelectorAll('td[bgcolor="#C1C1C1"]').forEach(td => { td.removeAttribute('bgcolor'); td.style.cssText='background:linear-gradient(90deg,var(--blue),var(--blue-2));height:3px;padding:0'; });
  }

  function buildTablePage(content) {
    const tables = Array.from(document.querySelectorAll('div[align="center"] table[border="1"], div[align="center"] table.tablesorter')).filter(t=>t.rows.length>1);
    if (!tables.length) { buildInteractivePage(content); return; }
    tables.forEach((table, i) => { const c = convertTable(table, i===0?pageTitle:'', pageIcon); c.classList.add(`sk-animate-${i+1}`); content.appendChild(c); });
  }

  function buildHomePage(content) {
    const announceEl = document.querySelector('td[style*="background-color:#ccccff"]');
    if (announceEl) {
      const ac = document.createElement('div'); ac.className = 'sk-announce sk-animate';
      const title = announceEl.querySelector('strong')?.textContent || 'Pengumuman';
      const ol = announceEl.querySelector('ol');
      ac.innerHTML = `<div class="sk-announce-title"><span class="sk-icon-sm">${IC.announce}</span>${title}</div>`;
      if (ol) ac.appendChild(ol.cloneNode(true));
      content.appendChild(ac);
    }
    const stats = document.createElement('div'); stats.className = 'sk-stats sk-animate sk-animate-1';
    stats.innerHTML = `
      <div class="sk-stat-card blue"><span class="sk-stat-icon">${IC24.book}</span><div class="sk-stat-value">S-1</div><div class="sk-stat-label">Jenjang Studi</div></div>
      <div class="sk-stat-card green"><span class="sk-stat-icon">${IC24.grad}</span><div class="sk-stat-value">ELECTICS</div><div class="sk-stat-label">Fakultas</div></div>
      <div class="sk-stat-card amber"><span class="sk-stat-icon">${IC24.building}</span><div class="sk-stat-value">2025</div><div class="sk-stat-label">Angkatan</div></div>
      <div class="sk-stat-card purple"><span class="sk-stat-icon">${IC24.cal}</span><div class="sk-stat-value">Genap</div><div class="sk-stat-label">Semester Aktif</div></div>`;
    content.appendChild(stats);

    const GROUPS = [
      { cat:'Akademik', items:[
        {label:'Rencana Studi (FRS)',icon:IC.clipboard, href:'list_frs.php',         bg:'#eff6ff',ib:'#dbeafe',ic:'#2563eb'},
        {label:'Kurikulum Semester', icon:IC.book,       href:'data_kur.php',          bg:'#f0f9ff',ib:'#bae6fd',ic:'#0284c7'},
        {label:'Jadwal Kuliah',      icon:IC.calendar,   href:'list_mhsjadwal.php',    bg:'#eff6ff',ib:'#dbeafe',ic:'#2563eb'},
        {label:'Kuesioner IPD',      icon:IC.filetxt,    href:'ipd_kuesionermk.php',   bg:'#f5f3ff',ib:'#ddd6fe',ic:'#7c3aed'},
      ]},
      { cat:'Nilai & Transkrip', items:[
        {label:'Nilai Per MK',        icon:IC.target,   href:'data_nilaimhs.php',          bg:'#ecfdf5',ib:'#a7f3d0',ic:'#059669'},
        {label:'Nilai Per Semester',  icon:IC.barchart, href:'data_nilaipersem.php',       bg:'#ecfdf5',ib:'#a7f3d0',ic:'#059669'},
        {label:'Transkrip Resmi',     icon:IC.filetxt,  href:'xrep_transkrip.php',         bg:'#fffbeb',ib:'#fde68a',ic:'#d97706'},
        {label:'Transkrip Sementara', icon:IC.filetxt,  href:'xrep_transkrip_sementara.php',bg:'#fffbeb',ib:'#fde68a',ic:'#d97706'},
      ]},
      { cat:'Data & Profil', items:[
        {label:'Biodata Mahasiswa',icon:IC.user,    href:'data_mhs.php',            bg:'#fff7ed',ib:'#fed7aa',ic:'#ea580c'},
        {label:'KTM Virtual',      icon:IC.idcard,  href:'xrep_kartumahasiswa.php', bg:'#fff7ed',ib:'#fed7aa',ic:'#ea580c'},
        {label:'Akademik Mhs',     icon:IC.school,  href:'data_mhsakademik.php',    bg:'#f0f9ff',ib:'#bae6fd',ic:'#0284c7'},
        {label:'Draft SKPI',       icon:IC.award,   href:'skpi_draft.php',          bg:'#f5f3ff',ib:'#ddd6fe',ic:'#7c3aed'},
      ]},
      { cat:'Keuangan & Surat', items:[
        {label:'Tagihan Pendidikan', icon:IC.creditcard,href:'data_tagihan_pendidikan.php', bg:'#fef2f2',ib:'#fecaca',ic:'#dc2626'},
        {label:'Historis Pembayaran',icon:IC.receipt,   href:'data_historis_pembayaran.php',bg:'#fef2f2',ib:'#fecaca',ic:'#dc2626'},
        {label:'Layanan Surat',      icon:IC.mail,      href:'surat_mahasiswa.php',         bg:'#ecfdf5',ib:'#a7f3d0',ic:'#059669'},
        {label:'Pembayaran Wisuda',  icon:IC.wallet,    href:'data_pembayaran_wisuda.php',  bg:'#f5f3ff',ib:'#ddd6fe',ic:'#7c3aed'},
      ]},
    ];
    GROUPS.forEach((g, i) => {
      const hdr = document.createElement('div'); hdr.className = `sk-section-header sk-animate sk-animate-${i+2}`;
      hdr.innerHTML = `<div class="sk-section-title">${g.cat}</div>`; content.appendChild(hdr);
      const grid = document.createElement('div'); grid.className = `sk-modules-grid sk-animate sk-animate-${i+2}`;
      g.items.forEach(m => {
        const a = document.createElement('a'); a.href=m.href; a.className='sk-module-card'; a.style.background=m.bg;
        a.innerHTML=`<div class="sk-module-emoji" style="background:${m.ib};color:${m.ic}">${m.icon}</div><div><div class="sk-module-name">${m.label}</div></div><div class="sk-module-arrow">${IC.chevron}</div>`;
        grid.appendChild(a);
      });
      content.appendChild(grid);
    });
  }

  function route(content) {
    if (page==='home.php'||page==='') { buildHomePage(content); }
    else if (INTERACTIVE_PAGES.has(page)) { buildInteractivePage(content); }
    else { buildTablePage(content); }
  }

  function init() {
    const content = buildShell();
    route(content);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
