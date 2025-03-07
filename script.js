document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const posiblesExtensiones = ["jpg", "jpeg", "png", "webp", "avif"];
        let imagenEncontrada = false;

        for (let ext of posiblesExtensiones) {
            let img = new Image();
            img.src = `producto ${i}.${ext}`;

            img.onload = () => {
                if (!imagenEncontrada) {
                    imagenEncontrada = true;
                    agregarProducto(i, img.src);
                }
            };
        }

        // Si después de un pequeño retraso no se encontró imagen, se usa una por defecto
        setTimeout(() => {
            if (!imagenEncontrada) {
                agregarProducto(i, "default.jpg");
            }
        }, 300);
    }
}

function agregarProducto(id, imagenSrc) {
    const contenedor = document.getElementById("productos");

    const productoHTML = `
        <div class="producto">
            <img src="${imagenSrc}" alt="Producto ${id}">
            <h3>Producto ${id}</h3>
            <p>Descripción del producto ${id}</p>
            <p><strong>S/ ${(id * 10).toFixed(2)}</strong></p>
            <button onclick="comprarProducto(${id})">Comprar</button>
        </div>
    `;

    contenedor.innerHTML += productoHTML;
}

function comprarProducto(id) {
    const mensaje = encodeURIComponent(`Hola guapo 🥵🥵🥵, quiero comprar el Producto ${id}.`);
    window.open(`https://wa.me/51904282196?text=${mensaje}`, "_blank");
}
