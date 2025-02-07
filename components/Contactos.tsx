"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { getContactos, agregarContacto, type Contacto } from "../lib/bonos"
import { Phone, Send } from "lucide-react"

export default function Contactos() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [selectedContactos, setSelectedContactos] = useState<string[]>([])

  useEffect(() => {
    setContactos(getContactos())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    agregarContacto(nombre, telefono)
    setNombre("")
    setTelefono("")
    setContactos(getContactos())
  }

  const generateWhatsAppLink = (telefonos: string[], mensaje: string) => {
    const numbers = telefonos.join(",")
    return `https://wa.me/${numbers}?text=${encodeURIComponent(mensaje)}`
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContactos(contactos.map((c) => c.telefono))
    } else {
      setSelectedContactos([])
    }
  }

  const handleSelectContacto = (telefono: string, checked: boolean) => {
    if (checked) {
      setSelectedContactos([...selectedContactos, telefono])
    } else {
      setSelectedContactos(selectedContactos.filter((t) => t !== telefono))
    }
  }

  const sendGroupMessage = (mensaje: string) => {
    window.open(generateWhatsAppLink(selectedContactos, mensaje), "_blank")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contactos</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <Input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          <Button type="submit">Añadir Contacto</Button>
        </form>
        <div className="mb-4">
          <Button
            onClick={() => sendGroupMessage("¡Tenemos una promoción especial para ti!")}
            disabled={selectedContactos.length === 0}
          >
            Enviar promoción a seleccionados
          </Button>
          <Button
            onClick={() => sendGroupMessage("¡Mira nuestro nuevo flyer!")}
            disabled={selectedContactos.length === 0}
            className="ml-2"
          >
            Enviar flyer a seleccionados
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedContactos.length === contactos.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactos.map((contacto) => (
              <TableRow key={contacto.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedContactos.includes(contacto.telefono)}
                    onCheckedChange={(checked) => handleSelectContacto(contacto.telefono, checked as boolean)}
                  />
                </TableCell>
                <TableCell>{contacto.nombre}</TableCell>
                <TableCell>{contacto.telefono}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4 text-green-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            window.open(
                              generateWhatsAppLink([contacto.telefono], "¡Tenemos una promoción especial para ti!"),
                              "_blank",
                            )
                          }
                        >
                          Mandar promoción
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            window.open(
                              generateWhatsAppLink([contacto.telefono], "Recordatorio: Tu bono está por expirar"),
                              "_blank",
                            )
                          }
                        >
                          Mandar recordatorio
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            window.open(
                              generateWhatsAppLink([contacto.telefono], "¡Mira nuestro nuevo flyer!"),
                              "_blank",
                            )
                          }
                        >
                          Mandar flyer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

