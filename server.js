require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// ✅ CONFIGURAR CLOUDINARY PRIMERO
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// ✅ DESPUÉS crear storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage });

// Servir archivos estáticos
app.use(express.static("public"));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Fotos.html"));
});

// ✅ UNA sola ruta POST
app.post("/Fotos", upload.array("fotos"), (req, res) => {

    if (!req.files || req.files.length === 0) {
        return res.send("No se subieron imágenes");
    }

    const urls = req.files.map(file => file.path);

    console.log(urls);

    res.send("Imágenes subidas a Cloudinary");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo");
});
