<?php
$archivo = "productos.json";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_FILES["imagen"])) {
        echo json_encode(["mensaje" => "Falta la imagen."]);
        exit;
    }

    // Guardar la imagen en la carpeta "images/"
    $imagenNombre = time() . "_" . basename($_FILES["imagen"]["name"]);
    $rutaDestino = "images/" . $imagenNombre;

    if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaDestino)) {
        echo json_encode(["mensaje" => "Error al subir la imagen."]);
        exit;
    }

    // Cargar productos actuales
    $productos = file_exists($archivo) ? json_decode(file_get_contents($archivo), true) : [];

    // Agregar el nuevo producto
    $nuevoProducto = [
        "nombre" => $_POST["nombre"],
        "descripcion" => $_POST["descripcion"],
        "precio" => $_POST["precio"],
        "imagen" => $imagenNombre
    ];

    $productos[] = $nuevoProducto;

    // Guardar en productos.json
    file_put_contents($archivo, json_encode($productos, JSON_PRETTY_PRINT));

    echo json_encode(["mensaje" => "Producto agregado correctamente."]);
    exit;
}

echo json_encode(["mensaje" => "Método no permitido."]);
?>
