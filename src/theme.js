applyTheme(); //run before the body loads to prevent flashing

window.addEventListener("DOMContentLoaded", () => {
  setIcon();
  document.getElementById("theme-auto").addEventListener("click", () => setTheme("auto"));
  document.getElementById("theme-dark").addEventListener("click", () => setTheme("dark"));
  document.getElementById("theme-light").addEventListener("click", () => setTheme("light"));
});

function applyTheme() {
  if ("theme" in localStorage) {
    theme = localStorage.theme;
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    } else {
      theme = "light";
    }
  }
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  setIcon();
}

function setIcon() {
  theme = localStorage.theme ?? "auto";
  let themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.querySelectorAll("button").forEach(e => {
      if (e.id === "theme-" + theme) {
        e.classList.remove("can-hover:hidden");
      } else {
        e.classList.add("can-hover:hidden");
      }
    });
  }
}

function setTheme(theme) {
  if (theme === "auto") {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = theme;
  }
  document.body.classList.add("transition-colors", "duration-500"); //add only when toggling so initial color does not transition
  applyTheme();
}
