document.addEventListener("DOMContentLoaded", () => {
    verificarAdmin();
    cargarProductos();
});

// Variables globales
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let editandoId = null;

// Ocultar admin-panel si no es admin
function verificarAdmin() {
    const adminPanel = document.getElementById("admin-panel");
    if (adminPanel && !esAdmin()) {
        adminPanel.style.display = "none";
    }
}

// Función para verificar si es admin
function esAdmin() {
    return localStorage.getItem("admin") === "true";
}

// Función para iniciar sesión de administrador
function iniciarSesionAdmin() {
    const password = prompt("Ingrese la clave de administrador:");
    if (password === "admin123") {
        localStorage.setItem("admin", "true");
        location.reload();
    } else {
        alert("Clave incorrecta.");
    }
}

// Función para cerrar sesión de administrador
function cerrarSesionAdmin() {
    localStorage.removeItem("admin");
    location.reload();
}

// Vista previa de imagen
const imagenInput = document.getElementById('imagen-file');
if (imagenInput) {
    imagenInput.addEventListener('change', function(event) {
        if (!esAdmin()) return;

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview').src = e.target.result;
                document.getElementById('preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Función para agregar o editar productos
function agregarProducto() {
    if (!esAdmin()) return;

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value.trim();
    
    if (!nombre || !descripcion || !precio) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (isNaN(precio) || Number(precio) <= 0) {
        alert("El precio debe ser un número válido y mayor a cero.");
        return;
    }

    if (imagenInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            guardarProducto(nombre, descripcion, precio, e.target.result);
        };
        reader.readAsDataURL(imagenInput.files[0]);
    } else {
        guardarProducto(nombre, descripcion, precio, null);
    }
}

// Función para almacenar producto en localStorage
function guardarProducto(nombre, descripcion, precio, imagen) {
    if (editandoId !== null) {
        const index = productos.findIndex(p => p.id === editandoId);
        if (index !== -1) {
            productos[index] = {
                id: editandoId,
                nombre,
                descripcion,
                precio: `S/ ${precio}`,
                imagen: imagen || productos[index].imagen 
            };
        }
        editandoId = null;
    } else {
        const nuevoProducto = {
            id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
            nombre,
            descripcion,
            precio: `S/ ${precio}`,
            imagen: imagen || "default.jpg"
        };
        productos.push(nuevoProducto);
    }

    guardarProductos();
    cargarProductos();
    limpiarFormulario();
}

// Función para cargar productos en la tienda
function cargarProductos() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const imagenSrc = producto.imagen && producto.imagen.startsWith("data:image") ? producto.imagen : `images/${producto.imagen || 'default.jpg'}`;

        const productoHTML = `
            <div class="producto">
                <img src="${imagenSrc}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><strong>${producto.precio}</strong></p>
                <button onclick="comprarProducto('${producto.nombre}', '${producto.precio}')">Comprar</button>
                ${esAdmin() ? `
                <button class="editar" onclick="llenarFormulario(${producto.id})">✏️</button>
                <button class="eliminar" onclick="eliminarProducto(${producto.id})">🗑️</button>` : ""}
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });
}

// Función para comprar producto y enviar a WhatsApp
function comprarProducto(nombre, precio) {
    const mensaje = encodeURIComponent(`Hola, quiero comprar el producto: ${nombre} por ${precio}.`);
    window.open(`https://wa.me/51999999999?text=${mensaje}`, "_blank");
}

// Función para eliminar un producto
function eliminarProducto(id) {
    if (!esAdmin()) return;

    productos = productos.filter(p => p.id !== id);
    guardarProductos();
    cargarProductos();
}

// Guardar productos en localStorage
function guardarProductos() {
    try {
        localStorage.setItem("productos", JSON.stringify(productos));
    } catch (error) {
        console.error("Error guardando en localStorage: ", error);
        alert("No se pueden guardar más productos. Intenta eliminar algunos.");
    }
}

// Función para llenar el formulario con datos de un producto
function llenarFormulario(id) {
    if (!esAdmin()) return;

    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("precio").value = producto.precio.replace("S/ ", "");
        document.getElementById("preview").src = producto.imagen;
        document.getElementById("preview").style.display = "block";
        editandoId = id;
    }
}

// Limpiar el formulario después de guardar
function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("imagen-file").value = "";
    document.getElementById("preview").style.display = "none";
    editandoId = null;
}
