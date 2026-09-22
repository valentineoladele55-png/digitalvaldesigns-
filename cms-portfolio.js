(function () {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  async function loadCMSPortfolio() {
    try {
      const response = await fetch("/portfolio.json?cms=" + Date.now(), {cache:"no-store"});
      if (!response.ok) return;
      const data = await response.json();
      const covers = Array.isArray(data.covers) ? data.covers : [];
      if (!covers.length) return;

      document.querySelectorAll(".cms-cover-item").forEach(el => el.remove());

      const candidates = Array.from(document.images).filter(img => {
        const src = (img.currentSrc || img.src || "").toLowerCase();
        return src.includes("image/project") || src.includes("images/project");
      });
      let gallery = null, best = 0;
      candidates.forEach(img => {
        let n = img.parentElement;
        for (let i=0; i<7 && n; i++, n=n.parentElement) {
          const count = n.querySelectorAll("img").length;
          if (count > best && count >= 3) { best=count; gallery=n; }
        }
      });
      if (!gallery) return;

      const cards = Array.from(gallery.children).filter(el => el.querySelector && el.querySelector("img"));
      const template = cards[0] || candidates[0]?.parentElement;
      if (!template) return;

      covers.forEach(item => {
        if (!item || !item.image) return;
        const clone = template.cloneNode(true);
        clone.classList.add("cms-cover-item");

        const img = clone.querySelector("img");
        if (!img) return;
        img.src = item.image;
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.alt = item.title || "Book cover";

        const texts = clone.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,strong,small");
        if (texts.length && item.title) texts[0].textContent = item.title;
        if (texts.length > 1 && item.author) texts[1].textContent = item.author;

        const link = clone.tagName === "A" ? clone : clone.querySelector("a");
        if (link) {
          link.href = item.image;
          link.target = "_blank";
          link.rel = "noopener";
        } else {
          const wrapper = document.createElement("a");
          wrapper.href = item.image;
          wrapper.target = "_blank";
          wrapper.rel = "noopener";
          wrapper.style.display = "block";
          clone.parentNode?.replaceChild(wrapper, clone);
          wrapper.appendChild(clone);
          gallery.appendChild(wrapper);
          return;
        }
        gallery.appendChild(clone);
      });
    } catch (e) { console.error("CMS portfolio loader:", e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadCMSPortfolio);
  else loadCMSPortfolio();
})();