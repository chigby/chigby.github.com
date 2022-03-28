document.querySelectorAll('input[name="theme-toggle"]').forEach(element => {
  element.addEventListener("change", e => {
    e.preventDefault();
    let value = document.querySelector('input[name="theme-toggle"]:checked').value;
    window.__setPreferredTheme(value);
  });
});
