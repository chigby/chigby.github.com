(()=>{function o(e){["light","dark"].includes(e)?(document.documentElement.dataset.colorTheme=e,localStorage.setItem("theme",e)):e==="system"&&delete document.documentElement.dataset.colorTheme}function m(){let e=localStorage.getItem("theme");if(["light","dark"].includes(e)){document.documentElement.dataset.colorTheme=e;let t=document.getElementById(e);t&&(t.checked=!0)}document.querySelectorAll('input[name="theme-toggle"]').forEach(t=>{t.addEventListener("click",()=>{o(t.value)})})}m();})();
