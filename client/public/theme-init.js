/* Aplica el tema guardado antes de pintar, para que no parpadee.
   Va en un archivo propio (no inline) para poder usar una CSP estricta sin 'unsafe-inline' en scripts. */
(function () {
  var t = null;
  try { t = localStorage.getItem("pb_theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute("content", t === "light" ? "#eaf6fd" : "#07111c");
})();
