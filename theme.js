function setTheme(value) {
  if (value === 'system') {
    delete document.documentElement.dataset.colorTheme;
  } else {
    document.documentElement.dataset.colorTheme = value;
  }
  localStorage.setItem('theme', value);
}

document.querySelectorAll('input[name="theme-toggle"]').forEach(element => {
  element.addEventListener("change", e => {
    e.preventDefault();
    let value = document.querySelector('input[name="theme-toggle"]:checked').value;
    setTheme(value);
  })
});

let theme = localStorage.getItem('theme');
if (theme) {
  let box = document.getElementById(`theme-toggle-${theme}`);
  if (box) {
    box.checked = true;
  }
  setTheme(theme);
}
