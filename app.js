/*
External app.js for Unity Tools (extracted from the theme CDATA).
Host this file on GitHub Pages, Cloudflare Pages, or any static host and reference it
from your Blogger theme or an HTML gadget.

Steps to host on GitHub Pages (quick):
1. Create a new GitHub repo (e.g. `unity-tools-site`).
2. Add this file as `app.js` in the repo root and commit.
3. In repo Settings -> Pages, set branch `main` (or `gh-pages`) and folder `/`.
4. After publish you'll get a URL like `https://<username>.github.io/unity-tools-site/app.js`.
5. Use that URL in the gadget HTML (see below) or insert <script src=".../app.js" defer></script> into your Blogger theme.

IMPORTANT: Use the final public URL (not raw.githubusercontent.com) so the script is served with correct CORS and caching.
*/

(function(){
  try{
    // ======= CONFIG =======
    const CONFIG = {
      SITE_TITLE: 'Unity Tools',
      WEBHOOK_URL: '', // n8n webhook or server endpoint to store tools/inquiries and build remote JSON
      TOOLS_JSON_URL: '', // optional remote JSON endpoint
      ADSENSE_CLIENT: 'ca-pub-XXXX', // replace with your AdSense client for real ads
      ENABLE_ADS: false, // set true after adding Ads code and approved account
    };

    let tools = [
      {title:'Quick Scene Linter',slug:'quick-scene-linter', thumb:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', desc:'Scan scenes for common problems and missing references.', body:'<p>Detailed description and usage instructions...</p>', link:'#', tags:['editor','lint']},
      {title:'Prefab Batch Renamer',slug:'prefab-batch-renamer', thumb:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop', desc:'Rename and reparent prefabs in bulk with rules.', body:'<p>How to use the batch renamer...</p>', link:'#', tags:['editor','utils']},
    ];

    function safeQuery(id){ return document.getElementById(id) || null; }
    function slugify(s){return String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
    function findToolBySlug(slug){return tools.find(t=>t.slug===slug);}
    function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

    // Renderers
    function renderHome(){
      const vc = safeQuery('view-container'); if(!vc) return;
      document.title = CONFIG.SITE_TITLE + ' — Home';
      const html = `
        <section class="hero">
          <div class="hero-left">
            <div class="kicker">FOR UNITY DEVELOPERS</div>
            <h2>Powerful Editor Tools & Utilities — ship faster, iterate smarter.</h2>
            <div class="lead">A curated collection of editor extensions, runtime utilities and scripts designed for Unity URP, HDRP and DOTS workflows. Graphics-first, developer-friendly, and ready to integrate.</div>
            <div class="cta-row">
              <button class="btn btn-primary" onclick="navigate('/tools')">Browse Tools</button>
              <button class="btn btn-ghost" onclick="navigate('/inquiry')">Contact / Inquiry</button>
            </div>
          </div>
          <div class="hero-right" aria-hidden="true">
            <img class="hero-graphic" src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="artistic hero">
            <div class="glow"><div class="g1"></div><div class="g2"></div></div>
          </div>
        </section>

        <section class="section">
          <h2>Featured Tools</h2>
          <div class="tools-grid" id="tools-grid"></div>
        </section>

        <section class="section">
          <h2>Monetize & Learn</h2>
          <div class="card"><p>Use AdSense ad slots (placeholders on this template) and affiliate links in tool pages. High-quality content + proper SEO drives sustainable revenue — not fake clicks. Follow policies to avoid penalties.</p></div>
        </section>
      `;
      vc.innerHTML = html;
      renderToolsGrid();
    }

    function renderToolsGrid(){
      const grid = safeQuery('tools-grid'); if(!grid) return;
      grid.innerHTML='';
      tools.forEach(t=>{
        const el = document.createElement('article'); el.className='card';
        el.innerHTML = `
          <div class="thumb"><img loading="lazy" src="${t.thumb}" alt="${escapeHtml(t.title)}" style="width:100%;height:100%;object-fit:cover"></div>
          <h3>${escapeHtml(t.title)}</h3>
          <p>${escapeHtml(t.desc)}</p>
          <div class="meta"><a class="badge" href="#/tool/${t.slug}">Open</a> <a class="badge" href="${t.link}" target="_blank" rel="noopener">Download</a></div>
        `;
        grid.appendChild(el);
      });
    }

    function renderToolPage(slug){
      const vc = safeQuery('view-container'); if(!vc) return;
      const t = findToolBySlug(slug);
      if(!t){vc.innerHTML = '<div class="card"><h2>Tool not found</h2></div>';return}
      document.title = `${t.title} — ${CONFIG.SITE_TITLE}`;
      const html = `
        <section class="section">
          <div style="display:flex;gap:18px;align-items:flex-start">
            <div style="flex:1">
              <h1>${escapeHtml(t.title)}</h1>
              <div style="color:var(--muted);margin-bottom:12px">${escapeHtml(t.desc)}</div>
              <div class="card">${t.body || '<p>No extended description provided.</p>'}</div>
              <div style="margin-top:12px;display:flex;gap:8px">
                <a class="btn btn-primary" href="${t.link}" target="_blank" rel="noopener">Download / Open</a>
                <a class="btn btn-ghost" href="#/inquiry">Request custom work</a>
              </div>
            </div>
            <aside style="width:320px">
              <div class="card"><img src="${t.thumb}" style="width:100%;border-radius:8px;object-fit:cover"></div>
              <div class="card" style="margin-top:12px">Ad or affiliate product here</div>
            </aside>
          </div>
        </section>
      `;
      vc.innerHTML = html;
    }

    function renderScriptsIndex(){
      const vc = safeQuery('view-container'); if(!vc) return;
      document.title = 'Scripts & Snippets — ' + CONFIG.SITE_TITLE;
      const html = `
        <section class="section">
          <h2>Scripts & Snippets</h2>
          <div class="card"><p>Index of useful scripts. Each script can have its own page — use admin to add entries with slug starting 'script-...'.</p></div>
          <div id="scripts-list"></div>
        </section>
      `;
      vc.innerHTML = html;
      const list = safeQuery('scripts-list'); if(!list) return;
      const scripts = tools.filter(t=>t.tags && t.tags.includes('script'));
      scripts.forEach(s=>{const d=document.createElement('div');d.className='card';d.innerHTML=`<h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p><a class="badge" href="#/tool/${s.slug}">Open</a>`;list.appendChild(d)});
    }

    function renderInquiry(){
      const vc = safeQuery('view-container'); if(!vc) return;
      document.title = 'Inquiry — ' + CONFIG.SITE_TITLE;
      const html = `
        <section class="section">
          <h2>Inquiry</h2>
          <div class="card">
            <p>If you want demo builds, custom tools or licensing — send a quick message below. This will send data to an n8n webhook or other automation endpoints.</p>
            <form id="inquiry-form">
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <input class="input" name="name" placeholder="Your name" required>
                <input class="input" name="email" placeholder="Email" required>
              </div>
              <textarea name="message" placeholder="How can I help?" required></textarea>
              <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
                <button class="btn btn-primary" type="submit">Send Inquiry</button>
              </div>
            </form>
          </div>
        </section>
      `;
      vc.innerHTML = html;
      const form = safeQuery('inquiry-form'); if(!form) return;
      form.addEventListener('submit', async (ev)=>{
        ev.preventDefault(); const data = new FormData(ev.target); const payload = Object.fromEntries(data.entries());
        if(CONFIG.WEBHOOK_URL){ try{ await fetch(CONFIG.WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'inquiry',payload})}); alert('Inquiry sent'); ev.target.reset(); } catch(e){alert('Failed to send to webhook — check console'); console.error(e)} }
        else { const saved = JSON.parse(localStorage.getItem('ut_inquiries')||'[]'); saved.push(payload); localStorage.setItem('ut_inquiries', JSON.stringify(saved)); alert('Saved locally (set WEBHOOK_URL to send to automation)'); ev.target.reset(); }
      });
    }

    function renderAbout(){
      const vc = safeQuery('view-container'); if(!vc) return;
      document.title = 'About — ' + CONFIG.SITE_TITLE;
      vc.innerHTML = `
        <section class="section">
          <h2>About Me</h2>
          <div class="card">
            <p id="about-body">Introduce yourself — your Unity background, projects, and a friendly call to action. Add links to your portfolio or GitHub.</p>
          </div>
        </section>
      `;
    }

    function navigate(path){window.location.hash = '#'+path}

    function router(){
      const hash = window.location.hash.replace(/^#/, '') || '/';
      // simple router
      if(hash==='/' || hash==='' ) renderHome();
      else if(hash.startsWith('/tool/')){ const slug = hash.split('/')[2]; renderToolPage(slug); }
      else if(hash.startsWith('/scripts')) renderScriptsIndex();
      else if(hash.startsWith('/tools')) renderHome();
      else if(hash.startsWith('/inquiry')) renderInquiry();
      else if(hash.startsWith('/about')) renderAbout();
      else renderHome();
      // update active nav
      const navs = document.querySelectorAll('.nav a'); if(navs && navs.length){ navs.forEach(a=>{a.classList.toggle('active', a.getAttribute('href')===('#'+hash)||(hash==='/'&&a.dataset.nav==='home'))}); }
    }

    // DOM ready: only run router/init when DOM available (avoid preview sandbox issues)
    document.addEventListener('DOMContentLoaded', ()=>{
      try{
        // defensive: ensure view-container exists
        if(!safeQuery('view-container')){
          // insert a static fallback so preview isn't blank
          const mainSection = document.querySelector('b\\:widget[type="HTML"]') || document.body;
          const fallback = document.createElement('div');
          fallback.innerHTML = '<div style="padding:24px;background:var(--card);border-radius:12px;color:var(--muted)"><h3>Unity Tools (Preview)</h3><p>Scripts are sandboxed in theme preview. View the live blog to see the interactive interface.</p></div>';
          mainSection.appendChild(fallback);
          return;
        }

        // attach admin buttons safely
        const openAdmin = safeQuery('open-admin');
        if(openAdmin) openAdmin.addEventListener('click', ()=>{ const m = safeQuery('modal'); if(m) m.style.display='flex'; });
        const cancelAdmin = safeQuery('cancel-admin'); if(cancelAdmin) cancelAdmin.addEventListener('click', ()=>{ const m = safeQuery('modal'); if(m) m.style.display='none'; });

        // chat send
        const chatSend = safeQuery('chat-send'); if(chatSend){ chatSend.addEventListener('click', async ()=>{
          const chatInput = safeQuery('chat-input'); if(!chatInput) return; const text = chatInput.value.trim(); if(!text) return; appendChat('user', text); chatInput.value=''; if(!CONFIG.WEBHOOK_URL){appendChat('bot','(No WEBHOOK_URL configured — set CONFIG.WEBHOOK_URL in template)');return} appendChat('bot','Thinking...'); try{ const res = await fetch(CONFIG.WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'chat_message',message:text})}); const data = await res.json(); const reply = data && data.reply ? data.reply : JSON.stringify(data).slice(0,800); const all = document.querySelectorAll('.msg'); if(all.length && all[all.length-1].textContent==='Thinking...') all[all.length-1].remove(); appendChat('bot', reply); }catch(e){appendChat('bot','Failed to contact webhook — see console'); console.error(e)} }); }

        // router + init: load tools from storage or remote
        (async function init(){
          try{
            const preview = JSON.parse(localStorage.getItem('ut_tools_preview')||'null'); if(Array.isArray(preview) && preview.length){tools = preview;}
            else if(CONFIG.TOOLS_JSON_URL){ try{ const r = await fetch(CONFIG.TOOLS_JSON_URL); if(r.ok){ const remote = await r.json(); if(Array.isArray(remote)) tools = remote; } }catch(e){console.warn('Remote tools JSON failed',e); } }
          }catch(e){console.error('init failed',e);} finally{ router(); }
        })();

      }catch(e){ console.error('DOM ready boot failed', e); }
    });

    // helpers used by chat
    function appendChat(kind, text){ const hist = safeQuery('chat-history'); if(!hist) return; const d=document.createElement('div'); d.className='msg '+(kind==='user'?'user':'bot'); d.textContent=text; hist.appendChild(d); hist.scrollTop = hist.scrollHeight; }

  }catch(e){ console.error('Theme script top-level error', e); }
})();
