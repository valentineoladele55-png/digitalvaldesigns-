(function () {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;

  async function loadCMSPortfolio() {
    try {
      const response = await fetch("/portfolio.json?cms=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();

      const covers = Array.isArray(data.covers) ? data.covers : [];
      const mockups = Array.isArray(data.mockups) ? data.mockups : [];
      if (!covers.length && !mockups.length) return;

      const old = document.getElementById("cms-portfolio-live");
      if (old) old.remove();

      const section = document.createElement("section");
      section.id = "cms-portfolio-live";
      section.innerHTML = `
        <div class="cms-live-wrap">
          <div class="cms-live-intro">
            <p class="cms-live-kicker">DIGITAL VAL DESIGNS</p>
            <h2>Book Cover Portfolio</h2>
            <p>Selected book cover designs and presentation mockups.</p>
          </div>
          ${covers.length ? `
          <div class="cms-live-heading"><h3>Cover Designs</h3></div>
          <div class="cms-live-grid">
            ${covers.map(item => card(item, "cover")).join("")}
          </div>` : ""}
          ${mockups.length ? `
          <div class="cms-live-heading"><h3>3D Mockups</h3></div>
          <div class="cms-live-grid">
            ${mockups.map(item => card(item, "mockup")).join("")}
          </div>` : ""}
        </div>`;

      const style = document.createElement("style");
      style.textContent = `
        #cms-portfolio-live{padding:90px 20px;background:#07101f;color:#fff}
        #cms-portfolio-live .cms-live-wrap{max-width:1180px;margin:auto}
        .cms-live-intro{text-align:center;margin-bottom:45px}
        .cms-live-kicker{font-size:12px;letter-spacing:.18em;opacity:.7;margin:0 0 10px}
        .cms-live-intro h2{font-size:clamp(30px,5vw,54px);margin:0 0 12px}
        .cms-live-intro>p:last-child{opacity:.72;margin:0}
        .cms-live-heading{margin:35px 0 18px}
        .cms-live-heading h3{font-size:24px;margin:0}
        .cms-live-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}
        .cms-live-card{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.11);border-radius:18px;overflow:hidden}
        .cms-live-card img{display:block;width:100%;height:auto;aspect-ratio:2/3;object-fit:cover;background:#111}
        .cms-live-card-body{padding:18px}
        .cms-live-card h4{margin:0 0 7px;font-size:18px}
        .cms-live-meta{margin:0 0 8px;opacity:.68;font-size:13px}
        .cms-live-desc{margin:0;opacity:.78;line-height:1.55;font-size:14px}
        @media(max-width:600px){#cms-portfolio-live{padding:65px 16px}.cms-live-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cms-live-card-body{padding:13px}.cms-live-card h4{font-size:15px}.cms-live-desc{font-size:12px}}
      `;
      document.head.appendChild(style);

      const target = Array.from(document.querySelectorAll("section")).find(s =>
        /cover\s*design/i.test(s.textContent || "") && (s.textContent || "").length > 150
      );
      if (target) target.appendChild(section);
      else {
        const footer = document.querySelector("footer");
        if (footer) footer.parentNode.insertBefore(section, footer);
        else document.body.appendChild(section);
      }

      function card(item) {
        const image = item && item.image ? item.image : "";
        const title = escapeHTML(item && item.title ? item.title : "Untitled");
        const author = escapeHTML(item && item.author ? item.author : "");
        const genre = escapeHTML(item && (item.genre || item.type) ? (item.genre || item.type) : "");
        const description = escapeHTML(item && item.description ? item.description : "");
        return `
          <article class="cms-live-card">
            ${image ? `<img loading="lazy" src="${escapeAttr(image)}" alt="${title}">` : ""}
            <div class="cms-live-card-body">
              <h4>${title}</h4>
              ${author ? `<p class="cms-live-meta">${author}</p>` : ""}
              ${genre ? `<p class="cms-live-meta">${genre}</p>` : ""}
              ${description ? `<p class="cms-live-desc">${description}</p>` : ""}
            </div>
          </article>`;
      }
      function escapeHTML(v){return String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
      function escapeAttr(v){return String(v).replace(/["'<>]/g,c=>({"&":"&amp;",'"':"&quot;","'":"&#39;","<":"&lt;",">":"&gt;"}[c]));}
    } catch (e) {
      console.error("CMS portfolio loader:", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadCMSPortfolio);
  else loadCMSPortfolio();
})();