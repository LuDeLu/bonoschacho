import type { NextApiRequest, NextApiResponse } from "next"
import { getPool } from "../../lib/db"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      if (req.query.type === "activos") {
        return getBonosActivos(req, res)
      } else if (req.query.type === "expirados") {
        return getBonosExpirados(req, res)
      } else {
        return getBonos(req, res)
      }
    case "POST":
      return crearBono(req, res)
    case "PUT":
      return actualizarBono(req, res)
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function getBonos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = await getPool()
    const [bonosRows] = await pool.query("SELECT * FROM bonos")
    const bonos = await Promise.all(
      (bonosRows as any[]).map(async (bonoRow) => {
        const [serviciosRows] = await pool.query("SELECT * FROM servicios WHERE bonoId = ?", [bonoRow.id])
        return {
          ...bonoRow,
          servicios: serviciosRows,
        }
      }),
    )
    res.status(200).json(bonos)
  } catch (error) {
    console.error("Error al obtener bonos:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

async function getBonosActivos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = await getPool()
    const today = dayjs().format("YYYY-MM-DD")
    const [bonosRows] = await pool.query("SELECT * FROM bonos WHERE fechaExpiracion >= ?", [today])
    const bonos = await Promise.all(
      (bonosRows as any[]).map(async (bonoRow) => {
        const [serviciosRows] = await pool.query("SELECT * FROM servicios WHERE bonoId = ?", [bonoRow.id])
        return {
          ...bonoRow,
          servicios: serviciosRows,
        }
      }),
    )
    res.status(200).json(bonos)
  } catch (error) {
    console.error("Error al obtener bonos activos:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

async function getBonosExpirados(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = await getPool()
    const today = dayjs().format("YYYY-MM-DD")
    const [bonosRows] = await pool.query("SELECT * FROM bonos WHERE fechaExpiracion < ?", [today])
    const bonos = await Promise.all(
      (bonosRows as any[]).map(async (bonoRow) => {
        const [serviciosRows] = await pool.query("SELECT * FROM servicios WHERE bonoId = ?", [bonoRow.id])
        return {
          ...bonoRow,
          servicios: serviciosRows,
        }
      }),
    )
    res.status(200).json(bonos)
  } catch (error) {
    console.error("Error al obtener bonos expirados:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

async function crearBono(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nombre, telefono, fechaCreacion } = req.body
    const pool = await getPool()
    const _fechaCreacion = fechaCreacion || dayjs().format("YYYY-MM-DD")
    const fechaExpiracion = dayjs(_fechaCreacion).add(1, "month").format("YYYY-MM-DD")
    const id = uuidv4()

    await pool.query(
      "INSERT INTO bonos (id, nombre, telefono, fechaCreacion, fechaExpiracion) VALUES (?, ?, ?, ?, ?)",
      [id, nombre, telefono, _fechaCreacion, fechaExpiracion],
    )

    const servicios = [
      { id: uuidv4(), nombre: "Servicio 1", consumido: false },
      { id: uuidv4(), nombre: "Servicio 2", consumido: false },
      { id: uuidv4(), nombre: "Servicio 3", consumido: false },
      { id: uuidv4(), nombre: "Servicio 4", consumido: false },
    ]

    for (const servicio of servicios) {
      await pool.query("INSERT INTO servicios (id, bonoId, nombre, consumido) VALUES (?, ?, ?, ?)", [
        servicio.id,
        id,
        servicio.nombre,
        servicio.consumido,
      ])
    }

    res.status(201).json({ id, nombre, telefono, servicios, fechaCreacion: _fechaCreacion, fechaExpiracion })
  } catch (error) {
    console.error("Error al crear bono:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

async function actualizarBono(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, nombre, telefono, fechaCreacion, fechaExpiracion, servicios } = req.body
    const pool = await getPool()

    await pool.query("UPDATE bonos SET nombre = ?, telefono = ?, fechaCreacion = ?, fechaExpiracion = ? WHERE id = ?", [
      nombre,
      telefono,
      fechaCreacion,
      fechaExpiracion,
      id,
    ])

    for (const servicio of servicios) {
      await pool.query("UPDATE servicios SET nombre = ?, consumido = ? WHERE id = ? AND bonoId = ?", [
        servicio.nombre,
        servicio.consumido,
        servicio.id,
        id,
      ])
    }

    res.status(200).json({ message: "Bono actualizado con éxito" })
  } catch (error) {
    console.error("Error al actualizar bono:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

