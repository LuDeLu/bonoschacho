import DashboardLayout from "../../components/DashboardLayout"
import BonoForm from "../../components/BonoForm"
import BonoList from "../../components/BonoList"

export default function BonosActivos() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Bonos Activos</h1>
      <div className="space-y-6">
        <BonoForm />
        <BonoList />
      </div>
    </DashboardLayout>
  )
}

