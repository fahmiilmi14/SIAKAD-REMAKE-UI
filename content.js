// ===== SIAKAD ITS — Modern Card UI (fix: preserve interactivity) =====
(function () {
  'use strict';

  // ── Fonts ─────────────────────────────────────
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);

  // ── Read user info BEFORE we touch the DOM ────
  const userRow   = document.querySelector('td[align="right"]')?.textContent || '';
  const nimMatch  = userRow.match(/(\d{10,})/);
  const nameMatch = userRow.match(/,\s*([^&\n]+)/);
  const nim       = nimMatch  ? nimMatch[1].trim()  : '';
  const name      = nameMatch ? nameMatch[1].trim() : 'Mahasiswa';
  const initials  = name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const prodiSel  = document.querySelector('#sJur');
  const prodiText = prodiSel?.options[prodiSel.selectedIndex]?.text || '';
  const prodiShort = prodiText.includes('INFORMATIKA') ? 'Teknik Informatika'
                   : prodiText.includes('ELEKTRO')     ? 'Teknik Elektro'
                   : prodiText.split('-').pop()?.trim() || 'ITS';
  const periodRaw = document.querySelector('tr[height="20"] td, tr[style*="ece9d8"] td')?.textContent || '';
  const periodText = periodRaw.replace('Periode:','').split('Tanggal:')[0].trim() || 'Genap 2025/2026';
  const page       = location.pathname.split('/').pop() || 'home.php';

  // ── Pages that have important forms/interactions ──
  // These pages will have their content MOVED (not cloned) so JS/forms stay alive
  const INTERACTIVE_PAGES = new Set([
    'list_frs.php',           // tambah/hapus mata kuliah
    'ipd_kuesionermk.php',    // kuesioner radio buttons
    'data_update_biodata.php',// verifikasi biodata form
    'data_kur.php',           // kurikulum (ada select)
    'data_mhswisuda.php',     // update data wisuda
    'surat_mahasiswa.php',    // request surat (form)
    'skpi_draft.php',         // SKPI (ada upload/edit)
    'css_bio_puas.php',       // survei (radio/checkbox)
    'yudisium_nilai_bahasa_asing.php', // upload file
    'ekivalensi_rekapitulasi_mhs.php',
  ]);

  // ── Nav ───────────────────────────────────────
  const NAV = [
    { sec:'Utama' },
    { label:'Dashboard',      icon:'🏠', href:'home.php'                    },
    { label:'Biodata',        icon:'👤', href:'data_mhs.php'                },
    { sec:'Akademik' },
    { label:'Rencana Studi',  icon:'📝', href:'list_frs.php'                },
    { label:'Kurikulum',      icon:'📚', href:'data_kur.php'                },
    { label:'Jadwal Kuliah',  icon:'📅', href:'list_mhsjadwal.php'          },
    { label:'Kuesioner IPD',  icon:'📋', href:'ipd_kuesionermk.php'         },
    { sec:'Nilai' },
    { label:'Nilai Per MK',   icon:'🎯', href:'data_nilaimhs.php'           },
    { label:'Nilai/Semester', icon:'📊', href:'data_nilaipersem.php'        },
    { label:'Transkrip',      icon:'📄', href:'xrep_transkrip.php'          },
    { sec:'Lainnya' },
    { label:'Tagihan',        icon:'💳', href:'data_tagihan_pendidikan.php' },
    { label:'Surat',          icon:'✉️',  href:'surat_mahasiswa.php'         },
    { label:'SKPI',           icon:'🏅', href:'skpi_draft.php'              },
    { sec:'' },
    { label:'Keluar',         icon:'🚪', href:'sys_logout.php', cls:'logout'},
  ];

  const PAGE_META = {
    'home.php':                    ['🏠','Dashboard'],
    'data_mhs.php':                ['👤','Biodata Mahasiswa'],
    'data_update_biodata.php':     ['✏️', 'Verifikasi Biodata'],
    'list_frs.php':                ['📝','Formulir Rencana Studi'],
    'data_kur.php':                ['📚','Kurikulum Semester'],
    'list_mhsjadwal.php':          ['📅','Jadwal Kuliah'],
    'data_nilaimhs.php':           ['🎯','Nilai Per Mahasiswa'],
    'data_nilaipersem.php':        ['📊','Nilai Per Semester'],
    'xrep_transkrip.php':          ['📄','Transkrip'],
    'xrep_transkrip_sementara.php':['📃','Transkrip Sementara'],
    'data_tagihan_pendidikan.php': ['💳','Tagihan Pendidikan'],
    'data_historis_pembayaran.php':['🧾','Historis Pembayaran'],
    'surat_mahasiswa.php':         ['✉️', 'Layanan Surat'],
    'skpi_draft.php':              ['🏅','Draft SKPI'],
    'ipd_kuesionermk.php':         ['📋','Kuesioner IPD'],
    'data_mhsakademik.php':        ['🏫','Akademik Mahasiswa'],
    'data_mhswisuda.php':          ['🎓','Data Wisuda'],
    'ekivalensi_rekapitulasi_mhs.php':['🔄','Ekivalensi'],
    'css_bio_puas.php':            ['⭐','Survei Kepuasan'],
  };
  const [pageIcon, pageTitle] = PAGE_META[page] || ['📋', document.title.replace('[SIAKAD-ITS]','').trim()];

  // ── Grade & GPA helpers ───────────────────────
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

  // ── Build sidebar + topbar shell ──────────────
  function buildShell() {
    const shell = document.createElement('div');
    shell.id = 'siakad-shell';

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sk-sidebar';
    sidebar.innerHTML = `
      <div class="sk-logo">
        <div class="sk-logo-icon">🎓</div>
        <div class="sk-logo-text">
          <strong>SIAKAD ITS</strong>
          <span>Academic Portal</span>
        </div>
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
        sidebar.appendChild(sec);
        lastSec = sec;
        return;
      }
      const a = document.createElement('a');
      a.href = item.href;
      a.className = `sk-nav-item${page===item.href?' active':''}${item.cls?' '+item.cls:''}`;
      a.innerHTML = `<div class="sk-nav-icon">${item.icon}</div>${item.label}`;
      (lastSec || sidebar).appendChild(a);
    });

    const periodBadge = document.createElement('div');
    periodBadge.className = 'sk-period';
    periodBadge.innerHTML = `
      <div class="sk-period-label">Semester Aktif</div>
      <div class="sk-period-value">${periodText}</div>`;
    sidebar.appendChild(periodBadge);

    const main = document.createElement('div');
    main.id = 'sk-main';
    main.innerHTML = `
      <div id="sk-topbar">
        <div class="sk-topbar-title">${pageIcon} ${pageTitle}</div>
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

  // ── Convert a static table into a styled card ─
  // Used for read-only pages — cloneNode is fine here
  function convertTable(oldTable, title, icon) {
    const card = document.createElement('div');
    card.className = 'sk-table-card sk-animate';
    if (title) {
      card.innerHTML = `<div class="sk-table-card-header"><div class="sk-table-card-title">${icon} ${title}</div></div>`;
    }
    const wrap = document.createElement('div');
    wrap.className = 'sk-table-wrap';

    const newTable = document.createElement('table');
    newTable.className = 'sk-table';

    // Headers
    const oldThs = oldTable.querySelectorAll('th, thead td');
    if (oldThs.length) {
      const thead = newTable.createTHead();
      const tr = thead.insertRow();
      oldThs.forEach(th => {
        const newTh = document.createElement('th');
        newTh.textContent = th.textContent.trim();
        tr.appendChild(newTh);
      });
    }

    // Body
    const tbody = newTable.createTBody();
    oldTable.querySelectorAll('tbody tr, tr').forEach(row => {
      if (row.querySelector('th')) return;
      const cells = row.querySelectorAll('td');
      if (!cells.length) return;
      const newRow = tbody.insertRow();
      cells.forEach(cell => {
        const td = newRow.insertCell();
        const txt = cell.textContent.trim();
        const pill = gradePill(txt) || gpaPill(txt);
        if (pill) { td.innerHTML = pill; }
        else { td.textContent = txt; }
      });
    });

    if (!tbody.rows.length) {
      wrap.innerHTML = `<div class="sk-empty"><span class="sk-empty-icon">🔍</span><div class="sk-empty-text">Tidak ada data</div></div>`;
    } else {
      wrap.appendChild(newTable);
    }
    card.appendChild(wrap);
    return card;
  }

  // ── INTERACTIVE page handler ──────────────────
  // Move real DOM nodes — forms, scripts, event listeners stay intact
  function buildInteractivePage(content) {
    // Collect all original content containers
    const containers = [
      document.querySelector('div[align="center"]'),
      ...Array.from(document.querySelectorAll('body > form:not(#fMenu)')),
      ...Array.from(document.querySelectorAll('body > table:not(#fMenu table)')),
    ].filter(Boolean);

    // Wrap in a card shell
    const card = document.createElement('div');
    card.className = 'sk-table-card sk-animate';
    card.innerHTML = `<div class="sk-table-card-header"><div class="sk-table-card-title">${pageIcon} ${pageTitle}</div></div>`;

    const inner = document.createElement('div');
    inner.className = 'sk-interactive-wrap';

    containers.forEach(node => inner.appendChild(node)); // MOVE, not clone
    card.appendChild(inner);
    content.appendChild(card);

    // Now cosmetically re-style the moved elements without touching events
    cosmeticStyle(inner);
  }

  // ── Apply cosmetic styles to moved content ────
  // Only changes appearance — never replaces elements or rewires events
  function cosmeticStyle(root) {
    // Tables → add class only (no replacement)
    root.querySelectorAll('table[border], table[cellpadding]').forEach(t => {
      t.classList.add('sk-table');
      t.removeAttribute('border');
      t.removeAttribute('cellpadding');
      t.removeAttribute('cellspacing');
      // Wrap in scrollable div if not already
      if (!t.parentElement.classList.contains('sk-table-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'sk-table-wrap';
        t.parentNode.insertBefore(wrap, t);
        wrap.appendChild(t);
      }
    });

    // TH styling
    root.querySelectorAll('th').forEach(th => th.classList.add('sk-th-style'));

    // Grade pills inside table cells — only for purely text cells
    root.querySelectorAll('td').forEach(td => {
      if (td.children.length) return; // has input/select/etc. — skip
      const txt = td.textContent.trim();
      const pill = gradePill(txt) || gpaPill(txt);
      if (pill) td.innerHTML = pill;
    });

    // Style section headers (DFE3EB background)
    root.querySelectorAll('div[style*="DFE3EB"]').forEach(d => {
      d.removeAttribute('style');
      d.classList.add('sk-cat-header');
    });

    // Hide old decorative images
    root.querySelectorAll('img[src*="corner"], img[src*="upper_accent"], img[src*="selamatdatang"]')
        .forEach(img => img.style.display = 'none');

    // Clean up hardcoded width constraints
    root.querySelectorAll('table[width], td[width]').forEach(el => el.removeAttribute('width'));
    root.querySelectorAll('[style*="width:700"]').forEach(el => el.style.width = '100%');

    // Remove hardcoded colors from module list divs
    root.querySelectorAll('div[style*="background-color:#efefef"]').forEach(d => {
      d.removeAttribute('style');
      d.classList.add('sk-link-list-wrap');
    });
    root.querySelectorAll('div[style*="background-color:#DFE3EB"]').forEach(d => {
      d.removeAttribute('style');
      d.classList.add('sk-cat-header');
    });
    root.querySelectorAll('p > a[href]').forEach(a => {
      a.classList.add('sk-list-link');
      a.querySelectorAll('img[src*="bullet"]').forEach(i=>i.remove());
    });

    // Announcement bg
    root.querySelectorAll('td[style*="background-color:#ccccff"]').forEach(td => {
      td.removeAttribute('style');
      td.classList.add('sk-announce-cell');
    });

    // Upper accent bar
    root.querySelectorAll('td[bgcolor="#C1C1C1"]').forEach(td => {
      td.removeAttribute('bgcolor');
      td.style.cssText = 'background:linear-gradient(90deg,#3b6ef8,#06b6d4);height:3px;padding:0';
    });
  }

  // ── READ-ONLY table page ───────────────────────
  function buildTablePage(content) {
    const tables = Array.from(
      document.querySelectorAll('div[align="center"] table[border="1"], div[align="center"] table.tablesorter')
    ).filter(t => t.rows.length > 1);

    if (!tables.length) {
      buildInteractivePage(content); // fallback — treat as interactive
      return;
    }
    tables.forEach((table, i) => {
      const card = convertTable(table, i === 0 ? pageTitle : '', pageIcon);
      card.classList.add(`sk-animate-${i+1}`);
      content.appendChild(card);
    });
  }

  // ── HOME page ─────────────────────────────────
  function buildHomePage(content) {
    // Announcement — clone only (static text)
    const announceEl = document.querySelector('td[style*="background-color:#ccccff"]');
    if (announceEl) {
      const ac = document.createElement('div');
      ac.className = 'sk-announce sk-animate';
      const title = announceEl.querySelector('strong')?.textContent || 'Pengumuman';
      const ol = announceEl.querySelector('ol');
      ac.innerHTML = `<div class="sk-announce-title">📢 ${title}</div>`;
      if (ol) ac.appendChild(ol.cloneNode(true));
      content.appendChild(ac);
    }

    // Stat cards
    const stats = document.createElement('div');
    stats.className = 'sk-stats sk-animate sk-animate-1';
    stats.innerHTML = `
      <div class="sk-stat-card blue"><span class="sk-stat-icon">📚</span><div class="sk-stat-value">S-1</div><div class="sk-stat-label">Jenjang Studi</div></div>
      <div class="sk-stat-card green"><span class="sk-stat-icon">🎓</span><div class="sk-stat-value">ELECTICS</div><div class="sk-stat-label">Fakultas</div></div>
      <div class="sk-stat-card amber"><span class="sk-stat-icon">🏫</span><div class="sk-stat-value">2025</div><div class="sk-stat-label">Angkatan</div></div>
      <div class="sk-stat-card purple"><span class="sk-stat-icon">📅</span><div class="sk-stat-value">Genap</div><div class="sk-stat-label">Semester Aktif</div></div>`;
    content.appendChild(stats);

    // Module card groups
    const GROUPS = [
      { cat:'Akademik', items:[
        {label:'Rencana Studi (FRS)',icon:'📝',href:'list_frs.php',        bg:'#eff6ff',ib:'#dbeafe'},
        {label:'Kurikulum Semester', icon:'📚',href:'data_kur.php',        bg:'#f0f9ff',ib:'#bae6fd'},
        {label:'Jadwal Kuliah',      icon:'📅',href:'list_mhsjadwal.php',  bg:'#eff6ff',ib:'#dbeafe'},
        {label:'Kuesioner IPD',      icon:'📋',href:'ipd_kuesionermk.php', bg:'#f5f3ff',ib:'#ddd6fe'},
      ]},
      { cat:'Nilai & Transkrip', items:[
        {label:'Nilai Per MK',        icon:'🎯',href:'data_nilaimhs.php',          bg:'#ecfdf5',ib:'#a7f3d0'},
        {label:'Nilai Per Semester',  icon:'📊',href:'data_nilaipersem.php',       bg:'#ecfdf5',ib:'#a7f3d0'},
        {label:'Transkrip Resmi',     icon:'📄',href:'xrep_transkrip.php',         bg:'#fffbeb',ib:'#fde68a'},
        {label:'Transkrip Sementara', icon:'📃',href:'xrep_transkrip_sementara.php',bg:'#fffbeb',ib:'#fde68a'},
      ]},
      { cat:'Data & Profil', items:[
        {label:'Biodata Mahasiswa',icon:'👤',href:'data_mhs.php',           bg:'#fff7ed',ib:'#fed7aa'},
        {label:'KTM Virtual',      icon:'💳',href:'xrep_kartumahasiswa.php',bg:'#fff7ed',ib:'#fed7aa'},
        {label:'Akademik Mhs',     icon:'🏫',href:'data_mhsakademik.php',   bg:'#f0f9ff',ib:'#bae6fd'},
        {label:'Draft SKPI',       icon:'🏅',href:'skpi_draft.php',         bg:'#f5f3ff',ib:'#ddd6fe'},
      ]},
      { cat:'Keuangan & Surat', items:[
        {label:'Tagihan Pendidikan', icon:'💰',href:'data_tagihan_pendidikan.php',bg:'#fef2f2',ib:'#fecaca'},
        {label:'Historis Pembayaran',icon:'🧾',href:'data_historis_pembayaran.php',bg:'#fef2f2',ib:'#fecaca'},
        {label:'Layanan Surat',      icon:'✉️', href:'surat_mahasiswa.php',         bg:'#ecfdf5',ib:'#a7f3d0'},
        {label:'Pembayaran Wisuda',  icon:'🎓',href:'data_pembayaran_wisuda.php',  bg:'#f5f3ff',ib:'#ddd6fe'},
      ]},
    ];

    GROUPS.forEach((g, i) => {
      const hdr = document.createElement('div');
      hdr.className = `sk-section-header sk-animate sk-animate-${i+2}`;
      hdr.innerHTML = `<div class="sk-section-title">${g.cat}</div>`;
      content.appendChild(hdr);

      const grid = document.createElement('div');
      grid.className = `sk-modules-grid sk-animate sk-animate-${i+2}`;
      g.items.forEach(m => {
        const a = document.createElement('a');
        a.href = m.href;
        a.className = 'sk-module-card';
        a.style.background = m.bg;
        a.innerHTML = `
          <div class="sk-module-emoji" style="background:${m.ib}">${m.icon}</div>
          <div><div class="sk-module-name">${m.label}</div></div>
          <div class="sk-module-arrow">›</div>`;
        grid.appendChild(a);
      });
      content.appendChild(grid);
    });
  }

  // ── Router ────────────────────────────────────
  function route(content) {
    if (page === 'home.php' || page === '') {
      buildHomePage(content);
    } else if (INTERACTIVE_PAGES.has(page)) {
      // Forms stay alive — move, don't clone
      buildInteractivePage(content);
    } else {
      // Read-only tables — safe to clone & restyle
      buildTablePage(content);
    }
  }

  // ── Init ──────────────────────────────────────
  function init() {
    const content = buildShell();
    route(content);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
