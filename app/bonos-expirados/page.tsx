import DashboardLayout from "../../components/DashboardLayout"
import BonosExpirados from "../../components/BonosExpirados"

export default function BonosExpiradosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Bonos Expirados</h1>
      <BonosExpirados />
    </DashboardLayout>
  )
}

