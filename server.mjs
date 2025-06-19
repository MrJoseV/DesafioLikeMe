import express from 'express'
import pool from './db/config.js';
import cors from "cors";
import 'dotenv/config'
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Cambia por el puerto donde corre React
    methods: ["GET", "POST","PUT","DELETE"]
}));
console.log("✅ Backend inicializado correctamente");

app.get("/posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts"); 
        res.json(result.rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});
app.post("/posts", async (req, res) => {
    try {
        const { titulo, img, descripcion } = req.body;
        const query = "INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *";
        const values = [titulo, img, descripcion];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al insertar post:", error);
        res.status(500).json({ error: "Error al insertar el post" });
    }
});

app.put("/posts/:id/like", async (req, res) => {


    const { id } = req.params;
    console.log("🛰️ Backend recibió PUT para ID:", id)
    const query = `
      UPDATE posts
      SET likes = likes + 1
      WHERE id = $1
      RETURNING *`;

    // 👇 Esto debería mostrarse en la consola
    console.log("Query:", query);

    const result = await pool.query(query, [id]);

    res.json(result.rows[0]);

});

app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM posts WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post no encontrado" });
        }

        res.json({ message: "Post eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar post:", error);
        res.status(500).json({ error: "Error al eliminar el post" });
    }
});


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('Estamos ready  http://localhost:',{PORT}))