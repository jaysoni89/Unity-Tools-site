/* app.js — Unity Tools hosted app
   Place this file alongside tools.json and index.html on GitHub Pages.
*/
(function(){
  try{
    const CONFIG = {
      SITE_TITLE: 'Unity Tools',
      WEBHOOK_URL: '',
      ADSENSE_CLIENT: 'ca-pub-XXXX',
      ENABLE_ADS: false,
    };

    // default tools (fallback)
    let tools = window.TOOLS_JSON && Array.isArray(window.TOOLS_JSON) ? window.TOOLS_JSON : [
      {title:'Quick Scene Linter',slug:'quick-scene-linter', thumb:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', desc:'Scan scenes for common problems and missing references.', body:'<p>Detailed description and usage instructions...</p>', link:'#', tags:['editor','lint']},
      {title:'Prefab Batch Renamer',slug:'prefab-batch-renamer', thumb:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop', desc:'Rename and reparent prefabs in bulk with rules.', body:'<p>How to use the batch renamer...</p>', link:'#', tags:['editor','utils']},
    ];

    function safeQuery(id){ return document.getElementById(id) || null; }
    function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

    function renderHome(){
      const vc = safeQuery('view-container'); if(!vc) return;
      document.title = CONFIG.SITE_TITLE + ' — Home';
      const html = `
        <section class="card">
          <h2>Featured Tools</h2>
          <div class="tools-grid" id="tools-grid"></div>
        </section>
        <section class="card">
          <h2>Inquiry</h2>
          <form id="inquiry-form" style="display:flex;flex-direction:column;gap:8px">
            <input name="name" placeholder="Your name" style="padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:inherit" required>
            <input name="email" placeholder="Email" style="padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:inherit" required>
            <textarea name="message" placeholder="How can I help?" style="padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.04);color:inherit" required></textarea>
            <div style="text-align:right"><button class="btn btn-primary" type="submit">Send Inquiry</button></div>
          </form>
        </section>
      `;
      vc.innerHTML = html;
      renderToolsGrid();
      const form = document.getElementById('inquiry-form'); if(form) form.addEventListener('submit', onInquiry);
    }

    function renderToolsGrid(){
      const grid = document.getElementById('tools-grid'); if(!grid) return;
      grid.innerHTML = '';
      tools.forEach(t=>{
        const d = document.createElement('div'); d.className='card';
        d.innerHTML = `<div class="thumb"><img src="${t.thumb}" alt="${escapeHtml(t.title)}"></div><h3>${escapeHtml(t.title)}</h3><p class="muted">${escapeHtml(t.desc)}</p><div style="display:flex;gap:8px;margin-top:8px"><a class="btn btn-primary" href="#/tool/${t.slug}">Open</a></div>`;
        grid.appendChild(d);
      });
    }

    function onInquiry(ev){
      ev.preventDefault(); const data = new FormData(ev.target); const payload = Object.fromEntries(data.entries());
      if(CONFIG.WEBHOOK_URL){ fetch(CONFIG.WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'inquiry',payload})}).then(()=>alert('Inquiry sent')).catch(e=>{alert('Failed to send');console.error(e)}); }
      else{ const saved = JSON.parse(localStorage.getItem('ut_inquiries')||'[]'); saved.push(payload); localStorage.setItem('ut_inquiries', JSON.stringify(saved)); alert('Saved locally (no webhook configured)'); }
      ev.target.reset();
    }

    function router(){
      const hash = window.location.hash.replace(/^#/,'') || '/';
      if(hash === '/' || hash === '') renderHome();
      else if(hash.startsWith('/tool/')){
        const slug = hash.split('/')[2]; renderToolPage(slug);
      } else if(hash.startsWith('/inquiry')) renderHome(); else renderHome();
    }

    function renderToolPage(slug){
      const vc = safeQuery('view-container'); if(!vc) return;
      const t = tools.find(x=>x.slug===slug);
      if(!t){vc.innerHTML = '<div class="card"><h2>Tool not found</h2></div>'; return}
      vc.innerHTML = `<div class="card"><h1>${escapeHtml(t.title)}</h1><p class="muted">${escapeHtml(t.desc)}</p><div>${t.body||'<p>No details</p>'}</div><div style="margin-top:12px"><a class="btn btn-primary" href="${t.link}" target="_blank">Download / Open</a></div></div>`;
    }

    window.addEventListener('hashchange', router);
    document.addEventListener('DOMContentLoaded', ()=>{ router(); });

  }catch(e){ console.error('app.js runtime error', e); }
})();
