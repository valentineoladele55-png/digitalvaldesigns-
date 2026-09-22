(function () {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  async function loadCMSPortfolio() {
    try {
      const response = await fetch("/portfolio.json?cms=" + Date.now(), {cache:"no-store"});
      if (!response.ok) return;
      const data = await response.json();
      const covers = Array.isArray(data.covers) ? data.covers : [];
      if (!covers.length) return;

      function findGallery() {
        const images = Array.from(document.images).filter(img => {
          const src = (img.currentSrc || img.src || "").toLowerCase();
          return src.includes("image/project") || src.includes("images/project");
        });
        let best = null, bestScore = Infinity;
        images.forEach(img => {
          let n = img.parentElement;
          for (let i=0; i<12 && n; i++, n=n.parentElement) {
            const count = n.querySelectorAll("img").length;
            if (count >= 10 && count <= 20) {
              const score = Math.abs(count - 14);
              if (score < bestScore) { best=n; bestScore=score; }
            }
          }
        });
        return best;
      }

      function render(gallery) {
        document.querySelectorAll(".cms-cover-item").forEach(el => el.remove());
        const cards = Array.from(gallery.children).filter(el => el.querySelector && el.querySelector("img"));
        const template = cards[0];
        if (!template) return false;

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
          const link = clone.tagName === "A" ? clone : clone.querySelector("a");
          if (link) {
            link.href = item.image;
            link.target = "_blank";
            link.rel = "noopener";
            gallery.appendChild(clone);
          } else {
            const wrapper = document.createElement("a");
            wrapper.href = item.image;
            wrapper.target = "_blank";
            wrapper.rel = "noopener";
            wrapper.className = "cms-cover-item";
            wrapper.appendChild(clone);
            gallery.appendChild(wrapper);
          }
        });
        return true;
      }

      let attempts=0;
      const timer=setInterval(() => {
        attempts++;
        const gallery=findGallery();
        if (gallery && render(gallery)) clearInterval(timer);
        else if (attempts>=60) clearInterval(timer);
      },500);
    } catch(e) { console.error("CMS portfolio loader:",e); }
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",loadCMSPortfolio);
  else loadCMSPortfolio();
})();