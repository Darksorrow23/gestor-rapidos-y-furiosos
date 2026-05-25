
let personajes = [
  {
    id: 1,
    nombre: "Dominic Toretto",
    descripcion:
      "El corazón de la familia. Mecánico y corredor que vive la vida a un cuarto de milla a la vez.",
    habilidades: [
      "conducción extrema",
      "mecánica avanzada",
      "liderazgo",
      "combate",
    ],
    edad: 46,
    altura: 1.88,
    esVillano: false,
  },
  {
    id: 2,
    nombre: "Deckard Shaw",
    descripcion:
      "Agente renegado y asesino de élite. Capaz de robar cualquier cosa en cualquier lugar del mundo.",
    habilidades: [
      "combate armado",
      "infiltración",
      "hackeo",
      "conducción táctica",
    ],
    edad: 44,
    altura: 1.85,
    esVillano: true,
  },
];

let nextId = 3;
let editandoId = null;

function obtenerIniciales(nombre) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();
}


function getFiltrados() {
  const busqueda = document.getElementById("buscarInput").value.toLowerCase();
  let lista = busqueda
    ? personajes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.descripcion.toLowerCase().includes(busqueda) ||
          p.habilidades.some((h) => h.toLowerCase().includes(busqueda)),
      )
    : [...personajes];

  const orden = document.getElementById("ordenSelect").value;
  if (orden === "n") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (orden === "nd") lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (orden === "e") lista.sort((a, b) => a.edad - b.edad);
  if (orden === "ed") lista.sort((a, b) => b.edad - a.edad);

  return lista;
}


function renderCards() {
  const lista = getFiltrados();
  const grid = document.getElementById("cardsGrid");

  if (!lista.length) {
    grid.innerHTML = '<p class="empty-msg">No se encontraron personajes.</p>';
    return;
  }

  grid.innerHTML = lista
    .map((p) => {
      const iniciales = obtenerIniciales(p.nombre);
      const esV = p.esVillano;
      return `
                <div class="pj-card">
                    <div class="card-top-bar ${esV ? "bar-villano" : "bar-heroe"}"></div>
                    <div class="card-body">
                        <div class="card-header-row">
                            <div class="card-ini ${esV ? "ini-villano" : "ini-heroe"}">${iniciales}</div>
                            <span class="card-badge ${esV ? "badge-villano" : "badge-heroe"}">
                                ${esV ? "Villano" : "Héroe"}
                            </span>
                        </div>
                        <div class="card-name">${p.nombre}</div>
                        <div class="card-desc">${p.descripcion}</div>
                        <div class="card-meta">
                            <span>${p.edad} años</span>
                            <span>${p.altura.toFixed(2)} m</span>
                        </div>
                        <div class="skills-wrap">
                            ${p.habilidades.map((h) => `<span class="skill-pill">${h}</span>`).join("")}
                        </div>
                        <div class="card-btns">
                            <button class="btn-editar" onclick="startEdit(${p.id})">✎ Editar</button>
                            <button class="btn-eliminar" onclick="eliminar(${p.id})">✕ Eliminar</button>
                        </div>
                    </div>
                </div>`;
    })
    .join("");
}

function mostrarFormulario() {
  document.getElementById("registro").scrollIntoView({ behavior: "smooth" });
  limpiarFormulario();
  editandoId = null;
  document.getElementById("formTitulo").textContent = "Agregar personaje";
  document.getElementById("btnLabel").textContent = "Agregar";
  document.getElementById("btnCancelar").style.display = "none";
}

function limpiarFormulario() {
  document.getElementById("name").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("habilidades").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("altura").value = "";
  document.getElementById("villano").checked = false;
  document.getElementById("formError").style.display = "none";
}

function startEdit(id) {
  const p = personajes.find((x) => x.id === id);
  if (!p) return;

  editandoId = id;
  document.getElementById("name").value = p.nombre;
  document.getElementById("descripcion").value = p.descripcion;
  document.getElementById("habilidades").value = p.habilidades.join(", ");
  document.getElementById("edad").value = p.edad;
  document.getElementById("altura").value = p.altura;
  document.getElementById("villano").checked = p.esVillano;

  document.getElementById("formTitulo").textContent = "Editar personaje";
  document.getElementById("btnLabel").textContent = "Actualizar";
  document.getElementById("btnCancelar").style.display = "block";

  document
    .querySelector(".formulario-seccion")
    .scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicion() {
  editandoId = null;
  limpiarFormulario();
  document.getElementById("formTitulo").textContent = "Agregar personaje";
  document.getElementById("btnLabel").textContent = "Agregar";
  document.getElementById("btnCancelar").style.display = "none";
}


function agregar() {
  const nombre = document.getElementById("name").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const habRaw = document.getElementById("habilidades").value.trim();
  const edad = parseInt(document.getElementById("edad").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const esVillano = document.getElementById("villano").checked;
  const errorEl = document.getElementById("formError");

  if (!nombre) {
    errorEl.textContent = "El nombre es obligatorio.";
    errorEl.style.display = "block";
    return;
  }
  if (!descripcion) {
    errorEl.textContent = "La descripción es obligatoria.";
    errorEl.style.display = "block";
    return;
  }
  if (!habRaw) {
    errorEl.textContent = "Ingresá al menos una habilidad.";
    errorEl.style.display = "block";
    return;
  }
  if (isNaN(edad) || edad < 0) {
    errorEl.textContent = "Ingresá una edad válida.";
    errorEl.style.display = "block";
    return;
  }
  if (isNaN(altura) || altura <= 0) {
    errorEl.textContent = "Ingresá una altura válida (ej. 1.85).";
    errorEl.style.display = "block";
    return;
  }

  errorEl.style.display = "none";

  const habilidades = habRaw
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  const personaje = {
    id: editandoId !== null ? editandoId : nextId++,
    nombre,
    descripcion,
    habilidades,
    edad,
    altura: parseFloat(altura.toFixed(2)),
    esVillano,
  };

  if (editandoId !== null) {
    
    const index = personajes.findIndex((p) => p.id === editandoId);
    if (index !== -1) personajes[index] = personaje;
  } else {
    
    personajes.push(personaje);
  }

  cancelarEdicion();
  renderCards();
}


function eliminar(id) {
  personajes = personajes.filter((p) => p.id !== id);
  renderCards();
}


renderCards();
