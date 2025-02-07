"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Ticket, ClipboardList, BarChart, Users, Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Ticket, label: "Bonos Activos", href: "/bonos-activos" },
    { icon: ClipboardList, label: "Bonos Expirados", href: "/bonos-expirados" },
    { icon: BarChart, label: "Estadísticas", href: "/estadisticas" },
    { icon: Users, label: "Contactos", href: "/contactos" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static fixed z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Sistema de Bonos</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <Menu />
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-md p-2 transition-colors duration-200 ${
                  pathname === item.href ? "bg-gray-100" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-grow overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Dashboard de Bonos</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </Button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

