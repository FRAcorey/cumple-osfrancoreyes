require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Configuración de multer (guardar archivos)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage });


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/Fotos.html");
});

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configurar Cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});;

// Servir archivos estáticos
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.post("/Fotos", upload.array("fotos"), (req, res) => {

    const urls = req.files.map(file => file.path);

    console.log(urls); // links de las imágenes

    res.send("Imágenes subidas a Cloudinary");
});

// Ruta para subir imágenes
app.post("/Fotos", upload.array("fotos"), (req, res) => {
    res.send("Imágenes subidas correctamente");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo");
});
