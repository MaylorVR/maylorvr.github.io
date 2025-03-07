document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {
    fetch("productos.json")
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById("productos");
            contenedor.innerHTML = "";

            data.forEach(producto => {
                const productoHTML = `
                    <div class="producto">
                        <img src="images/${producto.imagen}" alt="${producto.nombre}">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p><strong>S/ ${producto.precio}</strong></p>
                    </div>
                `;
                contenedor.innerHTML += productoHTML;
            });
        })
        .catch(error => console.error("Error cargando productos:", error));
}

function agregarProducto() {
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const imagenInput = document.getElementById("imagen-file").files[0];

    if (!nombre || !descripcion || !precio || !imagenInput) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("imagen", imagenInput);

    fetch("api.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarProductos();
    })
    .catch(error => console.error("Error guardando producto:", error));
}
