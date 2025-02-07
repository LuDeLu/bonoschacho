import DashboardLayout from "../../components/DashboardLayout"
import Contactos from "../../components/Contactos"

export default function ContactosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Contactos</h1>
      <Contactos />
    </DashboardLayout>
  )
}

