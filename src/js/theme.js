let storedTheme = localStorage.getItem('theme');
if (!storedTheme) { storedTheme = '""'; } else { console.log("stored theme is", storedTheme); }
let preferredTheme = JSON.parse(storedTheme);
document.querySelectorAll('input[name="theme-toggle"]').forEach(element => {
  if (element.value == preferredTheme) { element.checked = true; }
  element.addEventListener("change", e => {
    e.preventDefault();
    let value = document.querySelector('input[name="theme-toggle"]:checked').value;
    window.__setPreferredTheme(value);
  });
});
