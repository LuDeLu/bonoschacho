"use server"

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
  const response = await fetch("/api/bonos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, telefono, fechaCreacion }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al crear el bono")
  }

  return response.json()
}

export async function getBonos(): Promise<Bono[]> {
  const response = await fetch("/api/bonos")
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al obtener los bonos")
  }
  return response.json()
}

export async function getBonoById(id: string): Promise<Bono | undefined> {
  const bonos = await getBonos()
  return bonos.find((bono) => bono.id === id)
}

export async function actualizarBono(bonoActualizado: Bono) {
  const response = await fetch("/api/bonos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bonoActualizado),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al actualizar el bono")
  }
}

export async function getBonosActivos(): Promise<Bono[]> {
  const response = await fetch("/api/bonos?type=activos")
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al obtener los bonos activos")
  }
  return response.json()
}

export async function getBonosExpirados(): Promise<Bono[]> {
  const response = await fetch("/api/bonos?type=expirados")
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al obtener los bonos expirados")
  }
  return response.json()
}

// Nota: Las funciones relacionadas con contactos deberían moverse a un archivo separado
// y tener su propia API route. Por ahora, las dejaremos aquí como ejemplo.

export async function agregarContacto(nombre: string, telefono: string): Promise<Contacto> {
  // Implementar lógica para agregar contacto a través de una API route
  throw new Error("No implementado")
}

export async function getContactos(): Promise<Contacto[]> {
  // Implementar lógica para obtener contactos a través de una API route
  throw new Error("No implementado")
}

export async function generarBonosDeMuestra() {
  // Implementar lógica para generar bonos de muestra a través de una API route
  throw new Error("No implementado")
}

