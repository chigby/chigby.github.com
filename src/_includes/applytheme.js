(function () {
  function applyTheme(newValue) {
    if (newValue === 'system') {
      delete document.documentElement.dataset.colorTheme;
    } else if (['light', 'dark'].includes(newValue)) {
      document.documentElement.dataset.colorTheme = newValue;
    }
  }
  window.__setPreferredTheme = function setPreferredTheme(newValue) {
    applyTheme(newValue);
    try {
      localStorage.setItem('theme', JSON.stringify(newValue));
    } catch (err) {}
  };
  // detect saved theme
  try {
    preferredTheme = JSON.parse(localStorage.getItem('theme'));
  } catch (err) {}
  applyTheme(preferredTheme);
})();
