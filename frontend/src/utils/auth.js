export function cerrarSesionConMensaje() {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }
