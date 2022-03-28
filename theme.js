let preferredTheme = JSON.parse(localStorage.getItem('theme'));
document.querySelectorAll('input[name="theme-toggle"]').forEach(element => {
  if (element.value == preferredTheme) { element.checked = true; }
  element.addEventListener("change", e => {
    e.preventDefault();
    let value = document.querySelector('input[name="theme-toggle"]:checked').value;
    window.__setPreferredTheme(value);
  });
});
