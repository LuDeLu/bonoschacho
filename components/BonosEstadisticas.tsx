"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBonos, getBonosExpirados } from "../lib/bonos"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import dayjs from "dayjs"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BonosEstadisticas() {
  const [estadisticas, setEstadisticas] = useState({
    bonosVendidosMes: 0,
    bonosVendidosAnio: 0,
    bonosVendidosTotal: 0,
    bonosAgotados: 0,
  })

  useEffect(() => {
    async function fetchEstadisticas() {
      try {
        const bonos = await getBonos()
        const bonosExpirados = await getBonosExpirados()
        const fechaActual = dayjs()

        const bonosVendidosMes = bonos.filter((bono) => dayjs(bono.fechaCreacion).isSame(fechaActual, "month")).length

        const bonosVendidosAnio = bonos.filter((bono) => dayjs(bono.fechaCreacion).isSame(fechaActual, "year")).length

        const bonosVendidosTotal = bonos.length
        const bonosAgotados = bonosExpirados.length

        setEstadisticas({
          bonosVendidosMes,
          bonosVendidosAnio,
          bonosVendidosTotal,
          bonosAgotados,
        })
      } catch (error) {
        console.error("Error al obtener estadísticas:", error)
      }
    }
    fetchEstadisticas()
  }, [])

  const data = {
    labels: ["Este Mes", "Este Año", "Total", "Agotados"],
    datasets: [
      {
        label: "Cantidad de Bonos",
        data: [
          estadisticas.bonosVendidosMes,
          estadisticas.bonosVendidosAnio,
          estadisticas.bonosVendidosTotal,
          estadisticas.bonosAgotados,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Estadísticas de Bonos",
      },
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Estadísticas de Bonos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[400px]">
          <Bar options={options} data={data} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-semibold">Bonos vendidos este mes:</p>
            <p>{estadisticas.bonosVendidosMes}</p>
          </div>
          <div>
            <p className="font-semibold">Bonos vendidos este año:</p>
            <p>{estadisticas.bonosVendidosAnio}</p>
          </div>
          <div>
            <p className="font-semibold">Bonos generales vendidos:</p>
            <p>{estadisticas.bonosVendidosTotal}</p>
          </div>
          <div>
            <p className="font-semibold">Bonos agotados:</p>
            <p>{estadisticas.bonosAgotados}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

