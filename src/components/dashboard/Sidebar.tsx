import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Mail,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: BarChart3, label: "Statistics", href: "/statistics" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Mail, label: "Inbox", href: "/inbox" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error("Erro ao sair: " + error.message)
    } else {
      toast.success("Você saiu da sua conta")
      navigate("/auth", { replace: true })
    }
  }

  return (
    <aside className="flex flex-col h-screen w-[220px] bg-sidebar text-sidebar-foreground rounded-3xl p-6">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-primary">Fiz</span>Tarefa
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  )
}

export { Sidebar }
