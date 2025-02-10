import { type NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const pool = await getPool()

    if (type === "activos") {
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
      return NextResponse.json(bonos)
    } else if (type === "expirados") {
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
      return NextResponse.json(bonos)
    } else {
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
      return NextResponse.json(bonos)
    }
  } catch (error) {
    console.error("Error en la ruta API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, telefono, fechaCreacion } = body
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

    return NextResponse.json({ id, nombre, telefono, servicios, fechaCreacion: _fechaCreacion, fechaExpiracion })
  } catch (error) {
    console.error("Error al crear bono:", error)
    return NextResponse.json({ error: "Error al crear el bono" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nombre, telefono, fechaCreacion, fechaExpiracion, servicios } = body
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

    return NextResponse.json({ message: "Bono actualizado con éxito" })
  } catch (error) {
    console.error("Error al actualizar bono:", error)
    return NextResponse.json({ error: "Error al actualizar el bono" }, { status: 500 })
  }
}

