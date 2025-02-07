import DashboardLayout from "../../components/DashboardLayout"
import BonosEstadisticas from "../../components/BonosEstadisticas"

export default function EstadisticasPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>
      <BonosEstadisticas />
    </DashboardLayout>
  )
}

