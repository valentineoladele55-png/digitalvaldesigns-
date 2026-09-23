(function () {
  async function loadCMSPortfolio() {
    try {
      const response = await fetch("/portfolio.json?cms=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();

      const covers = Array.isArray(data.covers) ? data.covers : [];
      const mockups = Array.isArray(data.mockups) ? data.mockups : [];

      let attempts = 0;
      const timer = setInterval(function () {
        attempts++;

        if (typeof window.renderCmsProject === "function") {
          covers.forEach(function (item) {
            window.renderCmsProject(item, "cover");
          });

          mockups.forEach(function (item) {
            window.renderCmsProject(item, "mockup");
          });

          const coverCount = document.getElementById("coverCount");
          if (coverCount) coverCount.textContent = (14 + covers.length) + " PROJECTS";

          if (typeof window.bindAllProjectCards === "function") {
            window.bindAllProjectCards();
          }

          clearInterval(timer);
        } else if (attempts >= 60) {
          clearInterval(timer);
        }
      }, 500);
    } catch (e) {
      console.error("CMS portfolio loader:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadCMSPortfolio);
  } else {
    loadCMSPortfolio();
  }
})();