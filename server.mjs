import express from 'express'
import pool from './db/config.js';
import cors from "cors";
import 'dotenv/config'
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Cambia por el puerto donde corre React
    methods: ["GET", "POST"]
}));


//
//app.use(express.static(path.join(__dirname, "client/build")));
app.get("/posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts"); // Ajusta la consulta
        res.json(result.rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});
app.post("/posts", async (req, res) => {
    try {
        const { titulo, img, descripcion, likes } = req.body;
        const query = "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [titulo, img, descripcion, likes];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al insertar post:", error);
        res.status(500).json({ error: "Error al insertar el post" });
    }
});
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('Estamos ready  http://localhost:',{PORT}))


