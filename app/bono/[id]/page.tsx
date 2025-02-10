"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { type Bono, getBonoById, actualizarBono } from "../../../lib/bonos"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function BonoPage() {
  const { id } = useParams()
  const [bono, setBono] = useState<Bono | null>(null)

  useEffect(() => {
    if (typeof id === "string") {
      getBonoById(id).then((bonoEncontrado) => {
        if (bonoEncontrado) {
          setBono(bonoEncontrado)
        }
      })
    }
  }, [id])

  const toggleServicio = (servicioId: string) => {
    if (!bono) return

    const nuevoBono = { ...bono }
    const servicioIndex = nuevoBono.servicios.findIndex((s) => s.id === servicioId)
    if (servicioIndex === -1) return

    nuevoBono.servicios[servicioIndex].consumido = !nuevoBono.servicios[servicioIndex].consumido

    setBono(nuevoBono)
    actualizarBono(nuevoBono)
  }

  if (!bono) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Bono no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const serviciosUtilizados = bono.servicios.filter((s) => s.consumido)
  const serviciosRestantes = bono.servicios.filter((s) => !s.consumido)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Detalles del Bono</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{bono.nombre}</h2>
            <p className="text-gray-600">{bono.telefono}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-lg">Servicios Restantes ({serviciosRestantes.length})</h3>
            <ul className="space-y-2">
              {serviciosRestantes.map((servicio) => (
                <li key={servicio.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`servicio-${servicio.id}`}
                    checked={servicio.consumido}
                    onCheckedChange={() => toggleServicio(servicio.id)}
                  />
                  <label htmlFor={`servicio-${servicio.id}`} className="text-sm">
                    {servicio.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-lg">Servicios Utilizados ({serviciosUtilizados.length})</h3>
            <ul className="space-y-2">
              {serviciosUtilizados.map((servicio) => (
                <li key={servicio.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`servicio-${servicio.id}`}
                    checked={servicio.consumido}
                    onCheckedChange={() => toggleServicio(servicio.id)}
                  />
                  <label htmlFor={`servicio-${servicio.id}`} className="text-sm line-through text-gray-500">
                    {servicio.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <Button onClick={() => window.history.back()} className="w-full">
            Volver a la lista de bonos
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

