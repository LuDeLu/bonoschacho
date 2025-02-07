"use client"

import { useEffect, useState } from "react"
import { type Bono, getBonosExpirados } from "../lib/bonos"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dayjs from "dayjs"

export default function BonosExpirados({ limit }: { limit?: number }) {
  const [bonosExpirados, setBonosExpirados] = useState<Bono[]>([])
  const [filteredBonos, setFilteredBonos] = useState<Bono[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

  useEffect(() => {
    async function fetchBonosExpirados() {
      try {
        const expiredBonos = await getBonosExpirados()
        const limitedBonos = limit ? expiredBonos.slice(0, limit) : expiredBonos
        setBonosExpirados(limitedBonos)
        setFilteredBonos(limitedBonos)
      } catch (error) {
        console.error("Error al obtener bonos expirados:", error)
      }
    }
    fetchBonosExpirados()
  }, [limit])

  useEffect(() => {
    filterBonos()
  }, [bonosExpirados]) // Updated dependency array

  const filterBonos = () => {
    let filtered = bonosExpirados

    if (searchTerm) {
      filtered = filtered.filter((bono) => bono.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedMonth && selectedMonth !== "all") {
      filtered = filtered.filter((bono) => dayjs(bono.fechaExpiracion).format("MM") === selectedMonth)
    }

    if (selectedYear && selectedYear !== "all") {
      filtered = filtered.filter((bono) => dayjs(bono.fechaExpiracion).format("YYYY") === selectedYear)
    }

    setFilteredBonos(filtered)
  }

  const months = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const years = Array.from(new Set(bonosExpirados.map((bono) => dayjs(bono.fechaExpiracion).format("YYYY"))))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bonos Expirados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-1/3">
              <SelectValue placeholder="Filtrar por mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los meses</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-1/3">
              <SelectValue placeholder="Filtrar por año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los años</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Fecha de Expiración</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBonos.map((bono) => (
              <TableRow key={bono.id}>
                <TableCell>{bono.nombre}</TableCell>
                <TableCell>{bono.telefono}</TableCell>
                <TableCell>{dayjs(bono.fechaCreacion).format("DD/MM/YYYY")}</TableCell>
                <TableCell>{dayjs(bono.fechaExpiracion).format("DD/MM/YYYY")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

