import express from "express"
import cors from "cors"
import { createPool } from "mysql2/promise"

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const pool = createPool({
  host: "marianod.sg-host.com",
  user: "u9tkeoegnj0dq",
  password: "Calpol12345",
  database: "dbrdoe8nedbxfl",
})

app.get("/api/bonos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bonos")
    res.json(rows)
  } catch (error) {
    console.error("Error fetching bonos:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/api/bonos/activos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bonos WHERE fechaExpiracion >= CURDATE()")
    res.json(rows)
  } catch (error) {
    console.error("Error fetching active bonos:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/api/bonos/expirados", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bonos WHERE fechaExpiracion < CURDATE()")
    res.json(rows)
  } catch (error) {
    console.error("Error fetching expired bonos:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.post("/api/bonos", async (req, res) => {
  try {
    const { nombre, telefono, fechaCreacion } = req.body
    const [result] = await pool.query(
      "INSERT INTO bonos (nombre, telefono, fechaCreacion, fechaExpiracion) VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 1 MONTH))",
      [nombre, telefono, fechaCreacion, fechaCreacion],
    )
    res.status(201).json({ id: result.insertId, nombre, telefono, fechaCreacion })
  } catch (error) {
    console.error("Error creating bono:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.put("/api/bonos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, telefono, fechaCreacion, fechaExpiracion } = req.body
    await pool.query("UPDATE bonos SET nombre = ?, telefono = ?, fechaCreacion = ?, fechaExpiracion = ? WHERE id = ?", [
      nombre,
      telefono,
      fechaCreacion,
      fechaExpiracion,
      id,
    ])
    res.json({ message: "Bono updated successfully" })
  } catch (error) {
    console.error("Error updating bono:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

