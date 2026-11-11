
const WORKER_URL = "https://1plus1-proxy.licelottegonzalez2019.workers.dev";

let proxyKey = sessionStorage.getItem("proxyKey") || "";

function conectar() {
  let url = document.getElementById("url").value.trim();

  if (!url) {
    alert("Escribe una dirección web");
    return;
  }

  if (!proxyKey) {
    proxyKey = prompt("Introduce tu clave del proxy:");

    if (!proxyKey) return;

    sessionStorage.setItem("proxyKey", proxyKey);
  }

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    new URL(url);
  } catch {
    alert("Dirección no válida");
    return;
  }

  const direccion =
    WORKER_URL +
    "/proxy?url=" +
    encodeURIComponent(url) +
    "&key=" +
    encodeURIComponent(proxyKey);

  document.getElementById("visor").src = direccion;
}

function recargar() {
  const visor = document.getElementById("visor");
  visor.src = visor.src;
}

function inicio() {
  document.getElementById("url").value = "";
  document.getElementById("visor").src = "about:blank";
}

function cambiarClave() {
  sessionStorage.removeItem("proxyKey");
  proxyKey = "";
  alert("Clave eliminada.");
}

function irAtras() {
  try {
    document.getElementById("visor").contentWindow.history.back();
  } catch {
    alert("No se puede volver atrás en esta página.");
  }
}

function irAdelante() {
  try {
    document.getElementById("visor").contentWindow.history.forward();
  } catch {
    alert("No se puede avanzar en esta página.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const campo = document.getElementById("url");

  if (campo) {
    campo.addEventListener("keydown", event => {
      if (event.key === "Enter") conectar();
    });
  }
});
