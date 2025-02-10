import { getPool } from "./db"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

export interface Servicio {
  id: string
  nombre: string
  consumido: boolean
}

export interface Bono {
  id: string
  nombre: string
  telefono: string
  servicios: Servicio[]
  fechaCreacion: string
  fechaExpiracion: string
}

export interface Contacto {
  id: string
  nombre: string
  telefono: string
}

export async function crearBono(nombre: string, telefono: string, fechaCreacion?: string): Promise<Bono> {
  const pool = await getPool()
  const _fechaCreacion = fechaCreacion || dayjs().format("YYYY-MM-DD")
  const fechaExpiracion = dayjs(_fechaCreacion).add(1, "month").format("YYYY-MM-DD")
  const id = uuidv4()

  try {
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

    return { id, nombre, telefono, servicios, fechaCreacion: _fechaCreacion, fechaExpiracion }
  } catch (error) {
    console.error("Error al crear bono:", error)
    throw new Error("Error al crear el bono")
  }
}

export async function getBonos(): Promise<Bono[]> {
  const pool = await getPool()
  try {
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
    return bonos
  } catch (error) {
    console.error("Error al obtener bonos:", error)
    throw new Error("Error al obtener los bonos")
  }
}

export async function getBonoById(id: string): Promise<Bono | undefined> {
  const pool = await getPool()
  try {
    const [bonoRows] = await pool.query("SELECT * FROM bonos WHERE id = ?", [id])
    if (bonoRows.length === 0) {
      return undefined
    }
    const bonoRow = bonoRows[0]
    const [serviciosRows] = await pool.query("SELECT * FROM servicios WHERE bonoId = ?", [id])
    return {
      ...bonoRow,
      servicios: serviciosRows,
    }
  } catch (error) {
    console.error("Error al obtener bono por ID:", error)
    throw new Error("Error al obtener el bono")
  }
}

export async function actualizarBono(bonoActualizado: Bono) {
  const pool = await getPool()
  try {
    await pool.query("UPDATE bonos SET nombre = ?, telefono = ?, fechaCreacion = ?, fechaExpiracion = ? WHERE id = ?", [
      bonoActualizado.nombre,
      bonoActualizado.telefono,
      bonoActualizado.fechaCreacion,
      bonoActualizado.fechaExpiracion,
      bonoActualizado.id,
    ])

    for (const servicio of bonoActualizado.servicios) {
      await pool.query("UPDATE servicios SET nombre = ?, consumido = ? WHERE id = ? AND bonoId = ?", [
        servicio.nombre,
        servicio.consumido,
        servicio.id,
        bonoActualizado.id,
      ])
    }
  } catch (error) {
    console.error("Error al actualizar bono:", error)
    throw new Error("Error al actualizar el bono")
  }
}

export async function getBonosActivos(): Promise<Bono[]> {
  const pool = await getPool()
  try {
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
    return bonos
  } catch (error) {
    console.error("Error al obtener bonos activos:", error)
    throw new Error("Error al obtener los bonos activos")
  }
}

export async function getBonosExpirados(): Promise<Bono[]> {
  const pool = await getPool()
  try {
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
    return bonos
  } catch (error) {
    console.error("Error al obtener bonos expirados:", error)
    throw new Error("Error al obtener los bonos expirados")
  }
}

// Nota: Las funciones relacionadas con contactos deberían implementarse de manera similar,
// utilizando el pool de conexiones y manejando los errores adecuadamente.

export async function agregarContacto(nombre: string, telefono: string): Promise<Contacto> {
  const pool = await getPool()
  try {
    const id = uuidv4()
    await pool.query("INSERT INTO contactos (id, nombre, telefono) VALUES (?, ?, ?)", [id, nombre, telefono])
    return { id, nombre, telefono }
  } catch (error) {
    console.error("Error al agregar contacto:", error)
    throw new Error("Error al agregar el contacto")
  }
}

export async function getContactos(): Promise<Contacto[]> {
  const pool = await getPool()
  try {
    const [rows] = await pool.query("SELECT * FROM contactos")
    return rows as Contacto[]
  } catch (error) {
    console.error("Error al obtener contactos:", error)
    throw new Error("Error al obtener los contactos")
  }
}

export async function generarBonosDeMuestra() {
  const pool = await getPool()
  try {
    // Generar algunos bonos de muestra
    const bonosMuestra = [
      { nombre: "Juan Pérez", telefono: "1234567890" },
      { nombre: "María García", telefono: "0987654321" },
      { nombre: "Carlos Rodríguez", telefono: "1122334455" },
    ]

    for (const bono of bonosMuestra) {
      await crearBono(bono.nombre, bono.telefono)
    }

    console.log("Bonos de muestra generados con éxito")
  } catch (error) {
    console.error("Error al generar bonos de muestra:", error)
    throw new Error("Error al generar bonos de muestra")
  }
}

