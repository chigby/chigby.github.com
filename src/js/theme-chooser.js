function setTheme(value) {
  if (["light", "dark"].includes(value)) {
    document.documentElement.dataset.colorTheme = value;
    localStorage.setItem('theme', value);
  } else if (value === "system") {
    delete document.documentElement.dataset.colorTheme;
    localStorage.removeItem("theme");
  }
}

export default function() {
  let theme = localStorage.getItem('theme');
  if (["light", "dark"].includes(theme)) {
    document.documentElement.dataset.colorTheme = theme;
    let box = document.getElementById(theme);
    if (box) {
      box.checked = true;
    }
  }

  const themeButtons = document.querySelectorAll('input[name="theme-toggle"]');
  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTheme(button.value);
    });
  });
};
