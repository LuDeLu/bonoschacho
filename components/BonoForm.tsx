"use client"

import { useState } from "react"
import { crearBono } from "../lib/bonos"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function BonoForm() {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const nuevoBono = await crearBono(nombre, telefono)
      toast({
        title: "Bono creado",
        description: `Se ha creado un nuevo bono para ${nuevoBono.nombre}`,
      })
      setNombre("")
      setTelefono("")
    } catch (error) {
      console.error("Error al crear el bono:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el bono. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crear Nuevo Bono</CardTitle>
        <CardDescription>Ingrese los datos para generar un nuevo bono</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <Input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <Input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Bono"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

