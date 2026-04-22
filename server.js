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
    res.sendFile(path.join(__dirname, "public", "Index.html"));
});
app.get("/Fotos", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Fotos.html"));
});
app.get("/horario", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "horario.html"));
});
app.get("/asistencia", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "asistencia.html"));
});
app.get("/regalo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "regalo.html"));
}

// ✅ UNA sola ruta POST
app.post("/Fotos", upload.array("fotos"), (req, res) => {

    if (!req.files || req.files.length === 0) {
        return res.send("No se subieron imágenes");
    }

    const urls = req.files.map(file => file.path);

    console.log(urls);

    res.send("Imágenes subidas a Cloudinary");
});

app.get("/imagenes", async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression("folder:uploads")
            .sort_by("created_at", "desc")
            .max_results(20)
            .execute();

        const urls = result.resources.map(img => img.secure_url);

        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener imágenes");
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo");
});
