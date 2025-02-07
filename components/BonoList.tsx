"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { type Bono, getBonosActivos, actualizarBono } from "../lib/bonos"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneIcon } from "lucide-react"
import dayjs from "dayjs"

export default function BonoList({ limit }: { limit?: number }) {
  const [bonos, setBonos] = useState<Bono[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBonos() {
      try {
        setIsLoading(true) // Added setIsLoading(true) here
        const activeBonos = await getBonosActivos()
        setBonos(limit ? activeBonos.slice(0, limit) : activeBonos)
        setError(null) // Added setError(null) here
      } catch (err) {
        console.error("Error al obtener los bonos:", err)
        setError("No se pudieron cargar los bonos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBonos()
  }, [limit])

  const generateWhatsAppLink = (bono: Bono) => {
    const serviciosDisponibles = bono.servicios.filter((s) => !s.consumido).map((s) => s.nombre)
    const message = encodeURIComponent(
      `Información del Bono:
Nombre: ${bono.nombre}
Teléfono: ${bono.telefono}
Fecha de expiración: ${bono.fechaExpiracion}
Servicios disponibles:
${serviciosDisponibles.join("\n")}
Link del bono: ${process.env.NEXT_PUBLIC_BASE_URL}/bono/${bono.id}`,
    )
    return `https://wa.me/${bono.telefono}?text=${message}`
  }

  const toggleServicio = async (bonoId: string, servicioId: string) => {
    const bonoIndex = bonos.findIndex((b) => b.id === bonoId)
    if (bonoIndex === -1) return

    const nuevoBono = { ...bonos[bonoIndex] }
    const servicioIndex = nuevoBono.servicios.findIndex((s) => s.id === servicioId)
    if (servicioIndex === -1) return

    nuevoBono.servicios[servicioIndex].consumido = !nuevoBono.servicios[servicioIndex].consumido

    const nuevosBonos = [...bonos]
    nuevosBonos[bonoIndex] = nuevoBono

    setBonos(nuevosBonos)
    try {
      await actualizarBono(nuevoBono)
    } catch (err) {
      console.error("Error al actualizar el bono:", err)
      // Revertir el cambio en caso de error
      setBonos(bonos)
    }
  }

  if (isLoading) {
    return <div>Cargando bonos...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bonos Activos</CardTitle>
      </CardHeader>
      <CardContent>
        {bonos.length === 0 ? (
          <p>No hay bonos activos en este momento.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {bonos.map((bono) => (
              <AccordionItem key={bono.id} value={bono.id}>
                <AccordionTrigger>{bono.nombre}</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-600">Teléfono: {bono.telefono}</p>
                    <p className="text-sm text-gray-600">
                      Fecha de expiración: {dayjs(bono.fechaExpiracion).format("DD/MM/YYYY")}
                    </p>
                    <div>
                      <h4 className="font-medium mb-2">Servicios:</h4>
                      <ul className="space-y-2">
                        {bono.servicios.map((servicio) => (
                          <li key={servicio.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`servicio-${servicio.id}`}
                              checked={servicio.consumido}
                              onCheckedChange={() => toggleServicio(bono.id, servicio.id)}
                            />
                            <label
                              htmlFor={`servicio-${servicio.id}`}
                              className={`text-sm ${servicio.consumido ? "line-through text-gray-500" : ""}`}
                            >
                              {servicio.nombre}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <div className="w-full sm:w-auto">
                        <QRCodeSVG value={`${process.env.NEXT_PUBLIC_BASE_URL}/bono/${bono.id}`} />
                      </div>
                      <div className="w-full sm:w-auto">
                        <Button
                          as="a"
                          href={generateWhatsAppLink(bono)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          <PhoneIcon className="w-5 h-5 mr-2" />
                          Enviar por WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

