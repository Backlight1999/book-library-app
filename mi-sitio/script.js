// Variables y elementos del DOM

const form = document.getElementById('form-libro');
const tituloInput = document.getElementById('titulo');
const autorInput = document.getElementById('autor');
const generoInput = document.getElementById('genero');
const listaLibros = document.getElementById('lista-libros');
const filtroSelect = document.getElementById('filtro');


// Cargar libros del localStorage

let libros = JSON.parse(localStorage.getItem('libros')) || [];

// Guardar en localStorage

function guardarLibros() {
    localStorage.setItem('libros', JSON.stringify(libros));
}


// Renderizar libros

function renderizarLibros() {
    listaLibros.innerHTML = '';

    if (libros.length === 0) {
        listaLibros.innerHTML = '<p style="text-align:center;color:#777;">No hay libros</p>';
        return;
    }

    // Aplicar filtro
    let librosFiltrados = libros;
    const filtro = filtroSelect ? filtroSelect.value : 'todos';

    if (filtro === 'leidos') {
        librosFiltrados = libros.filter(l => l.leido);
    } else if (filtro === 'no-leidos') {
        librosFiltrados = libros.filter(l => !l.leido);
    }

    librosFiltrados.forEach((libro) => {
        const div = document.createElement('div');
        div.className = 'libro';

        const h3 = document.createElement('h3');
        h3.textContent = libro.titulo;

        const pAutor = document.createElement('p');
        pAutor.textContent = `Autor: ${libro.autor}`;

        const pGenero = document.createElement('p');
        pGenero.textContent = `Género: ${libro.genero}`;

        const pEstado = document.createElement('p');
        pEstado.textContent = libro.leido ? '✅ Leído' : '📖 No leído';
        pEstado.style.color = libro.leido ? 'green' : 'red';

        const btnToggle = document.createElement('button');
        btnToggle.textContent = libro.leido ? 'Marcar como No leído' : 'Marcar como Leído';
        btnToggle.onclick = () => toggleLeido(libro.id);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.style.marginLeft = '10px';
        btnEliminar.onclick = () => eliminarLibro(libro.id);

        div.appendChild(h3);
        div.appendChild(pAutor);
        div.appendChild(pGenero);
        div.appendChild(pEstado);
        div.appendChild(btnToggle);
        div.appendChild(btnEliminar);

        listaLibros.appendChild(div);
    });
}


// Agregar libro
form.addEventListener('submit', e => {
    e.preventDefault();

    const titulo = tituloInput.value.trim();
    const autor = autorInput.value.trim();
    const genero = generoInput.value.trim();

    if (!titulo || !autor || !genero) return;

    const nuevoLibro = new Libro(titulo, autor, genero);
    libros.push(nuevoLibro);

    guardarLibros();
    renderizarLibros();
    form.reset();
});

// Cambiar estado leído/no leído
function toggleLeido(id) {
    const libro = libros.find(l => l.id === id);
    if (libro) {
        libro.leido ? libro.marcarComoNoLeido() : libro.marcarComoLeido();
        guardarLibros();
        renderizarLibros();
    }
}

// Eliminar libro

function eliminarLibro(id) {
    libros = libros.filter(l => l.id !== id);
    guardarLibros();
    renderizarLibros();
}

// Filtro por estado

if (filtroSelect) {
    filtroSelect.addEventListener('change', renderizarLibros);
}


// Render inicial

renderizarLibros();
