"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../components/DashboardLayout"
import BonoForm from "../components/BonoForm"
import BonoList from "../components/BonoList"
import BonosExpirados from "../components/BonosExpirados"
import BonosEstadisticas from "../components/BonosEstadisticas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generarBonosDeMuestra, getBonosActivos, getBonosExpirados } from "../lib/bonos"

export default function Home() {
  const [bonosActivos, setBonosActivos] = useState([])
  const [bonosExpirados, setBonosExpirados] = useState([])

  useEffect(() => {
    async function fetchBonos() {
      try {
        const activos = await getBonosActivos()
        const expirados = await getBonosExpirados()
        setBonosActivos(activos)
        setBonosExpirados(expirados)
      } catch (error) {
        console.error("Error fetching bonos:", error)
      }
    }
    fetchBonos()
  }, [])

  const handleGenerateSampleData = async () => {
    try {
      await generarBonosDeMuestra()
      const activos = await getBonosActivos()
      const expirados = await getBonosExpirados()
      setBonosActivos(activos)
      setBonosExpirados(expirados)
    } catch (error) {
      console.error("Error generating sample data:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Dashboard General</h2>
          <Button onClick={handleGenerateSampleData} className="mb-4">
            Generar Datos de Muestra
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Bonos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{bonosActivos.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bonos Expirados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{bonosExpirados.length}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Crear Nuevo Bono</h2>
          <BonoForm />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Bonos Activos Recientes</h2>
          <BonoList limit={5} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Bonos Expirados Recientes</h2>
          <BonosExpirados limit={5} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
          <BonosEstadisticas />
        </section>
      </div>
    </DashboardLayout>
  )
}

