import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Bell,
  Clock,
  Palette,
  Shield,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Mail,
  LogOut,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { Sidebar } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

type SettingsSection = "profile" | "appearance" | "timer" | "notifications" | "privacy" | "help"

interface SettingsItemProps {
  icon: React.ElementType
  label: string
  description?: string
  section: SettingsSection
  active: boolean
  onClick: () => void
}

function SettingsItem({ icon: Icon, label, description, active, onClick }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left",
        active 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        active ? "bg-primary text-primary-foreground" : "bg-sidebar-accent"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium font-[Poppins]">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground font-[Poppins]">{description}</p>
        )}
      </div>
      <ChevronRight className={cn(
        "w-5 h-5 transition-transform",
        active && "rotate-90"
      )} />
    </button>
  )
}

function ProfileSection() {
  const { user, getUserName } = useAuth()
  const [name, setName] = useState(getUserName() || "")
  const [email] = useState(user?.email || "")

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Perfil</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-3xl font-bold text-primary font-[Poppins]">
            {name.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div>
          <Button variant="outline" className="font-[Poppins]">
            Alterar foto
          </Button>
          <p className="text-xs text-muted-foreground mt-2 font-[Poppins]">
            JPG, PNG ou GIF. Máximo 2MB.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-[Poppins]">Nome</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="font-[Poppins]"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-[Poppins]">Email</Label>
          <Input
            value={email}
            disabled
            className="font-[Poppins] opacity-60"
          />
          <p className="text-xs text-muted-foreground font-[Poppins]">
            O email não pode ser alterado
          </p>
        </div>
      </div>

      <Button onClick={handleSave} className="font-[Poppins]">
        Salvar alterações
      </Button>
    </motion.div>
  )
}

function AppearanceSection() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [accentColor, setAccentColor] = useState("yellow")

  const colors = [
    { name: "yellow", color: "#eab308" },
    { name: "blue", color: "#3b82f6" },
    { name: "green", color: "#22c55e" },
    { name: "purple", color: "#8b5cf6" },
    { name: "pink", color: "#ec4899" },
    { name: "orange", color: "#f97316" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Aparência</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Personalize a aparência do aplicativo
        </p>
      </div>

      {/* Theme */}
      <div className="space-y-4">
        <Label className="font-[Poppins]">Tema</Label>
        <div className="flex gap-4">
          <button
            onClick={() => setIsDarkMode(true)}
            className={cn(
              "flex-1 p-4 rounded-2xl border-2 transition-all",
              isDarkMode 
                ? "border-primary bg-primary/10" 
                : "border-transparent bg-sidebar hover:bg-sidebar-accent/50"
            )}
          >
            <Moon className="w-8 h-8 mx-auto mb-2 text-foreground" />
            <p className="font-medium font-[Poppins] text-foreground">Escuro</p>
          </button>
          <button
            onClick={() => setIsDarkMode(false)}
            className={cn(
              "flex-1 p-4 rounded-2xl border-2 transition-all",
              !isDarkMode 
                ? "border-primary bg-primary/10" 
                : "border-transparent bg-sidebar hover:bg-sidebar-accent/50"
            )}
          >
            <Sun className="w-8 h-8 mx-auto mb-2 text-foreground" />
            <p className="font-medium font-[Poppins] text-foreground">Claro</p>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-4">
        <Label className="font-[Poppins]">Cor de destaque</Label>
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setAccentColor(c.name)}
              className={cn(
                "w-10 h-10 rounded-full transition-all",
                accentColor === c.name && "ring-2 ring-offset-2 ring-offset-background"
              )}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TimerSection() {
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)
  const [autoStart, setAutoStart] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Timer</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Configure o timer Pomodoro
        </p>
      </div>

      {/* Work Duration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-[Poppins]">Tempo de foco</Label>
          <span className="text-sm font-medium text-primary font-[Poppins]">
            {workDuration} minutos
          </span>
        </div>
        <Slider
          value={[workDuration]}
          onValueChange={(v) => setWorkDuration(v[0])}
          min={15}
          max={60}
          step={5}
        />
      </div>

      {/* Short Break */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-[Poppins]">Pausa curta</Label>
          <span className="text-sm font-medium text-primary font-[Poppins]">
            {shortBreak} minutos
          </span>
        </div>
        <Slider
          value={[shortBreak]}
          onValueChange={(v) => setShortBreak(v[0])}
          min={3}
          max={15}
          step={1}
        />
      </div>

      {/* Long Break */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-[Poppins]">Pausa longa</Label>
          <span className="text-sm font-medium text-primary font-[Poppins]">
            {longBreak} minutos
          </span>
        </div>
        <Slider
          value={[longBreak]}
          onValueChange={(v) => setLongBreak(v[0])}
          min={10}
          max={30}
          step={5}
        />
      </div>

      {/* Auto Start */}
      <div className="flex items-center justify-between p-4 bg-sidebar rounded-2xl">
        <div>
          <p className="font-medium font-[Poppins] text-foreground">Iniciar automaticamente</p>
          <p className="text-sm text-muted-foreground font-[Poppins]">
            Iniciar próximo timer automaticamente
          </p>
        </div>
        <Switch checked={autoStart} onCheckedChange={setAutoStart} />
      </div>

      {/* Sound */}
      <div className="flex items-center justify-between p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3">
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-primary" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium font-[Poppins] text-foreground">Sons</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">
              Tocar som ao finalizar
            </p>
          </div>
        </div>
        <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
      </div>
    </motion.div>
  )
}

function NotificationsSection() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Notificações</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Configure suas preferências de notificação
        </p>
      </div>

      {/* Push Notifications */}
      <div className="flex items-center justify-between p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium font-[Poppins] text-foreground">Notificações push</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">
              Receber notificações no navegador
            </p>
          </div>
        </div>
        <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
      </div>

      {/* Email Notifications */}
      <div className="flex items-center justify-between p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium font-[Poppins] text-foreground">Notificações por email</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">
              Receber resumos por email
            </p>
          </div>
        </div>
        <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
      </div>

      {/* Task Reminders */}
      <div className="flex items-center justify-between p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium font-[Poppins] text-foreground">Lembretes de tarefas</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">
              Lembrar de tarefas próximas do prazo
            </p>
          </div>
        </div>
        <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
      </div>
    </motion.div>
  )
}

function PrivacySection() {
  const { signOut, deleteAccount } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleLogout = async () => {
    await signOut()
    toast.success("Você saiu da sua conta")
    window.location.href = "/auth"
  }

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== "excluir") {
      toast.error('Por favor, digite "excluir" para confirmar')
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await deleteAccount()
      
      if (error) {
        toast.error("Erro ao excluir conta: " + (error.message || "Erro desconhecido"))
        setIsDeleting(false)
        return
      }

      toast.success("Conta excluída com sucesso. Todos os seus dados foram removidos.")
      setShowDeleteModal(false)
      
      // Redireciona para a página de login após um breve delay
      setTimeout(() => {
        window.location.href = "/auth"
      }, 2000)
    } catch (error) {
      toast.error("Erro ao excluir conta")
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Privacidade</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Gerencie sua conta e dados
        </p>
      </div>

      {/* Export Data */}
      <div className="p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-primary" />
          <p className="font-medium font-[Poppins] text-foreground">Exportar dados</p>
        </div>
        <p className="text-sm text-muted-foreground font-[Poppins] mb-4">
          Baixe uma cópia de todos os seus dados
        </p>
        <Button variant="outline" className="font-[Poppins]">
          Exportar dados
        </Button>
      </div>

      {/* Logout */}
      <div className="p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <LogOut className="w-5 h-5 text-yellow-500" />
          <p className="font-medium font-[Poppins] text-foreground">Sair da conta</p>
        </div>
        <p className="text-sm text-muted-foreground font-[Poppins] mb-4">
          Encerrar sessão neste dispositivo
        </p>
        <Button variant="outline" onClick={handleLogout} className="font-[Poppins]">
          Sair
        </Button>
      </div>

      {/* Delete Account */}
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="font-medium font-[Poppins] text-red-500">Zona de perigo</p>
        </div>
        <p className="text-sm text-muted-foreground font-[Poppins] mb-4">
          Excluir permanentemente sua conta e todos os dados. Esta ação não pode ser desfeita.
        </p>
        <Button 
          variant="destructive" 
          onClick={() => setShowDeleteModal(true)}
          className="font-[Poppins]"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir conta
        </Button>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão de Conta
            </DialogTitle>
            <DialogDescription className="font-[Poppins] pt-2">
              Esta ação é <strong>irreversível</strong>. Todos os seus dados serão permanentemente excluídos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-foreground font-[Poppins] mb-2">
                <strong>O que será excluído:</strong>
              </p>
              <ul className="text-sm text-muted-foreground font-[Poppins] space-y-1 list-disc list-inside">
                <li>Todas as suas tarefas</li>
                <li>Todas as suas listas</li>
                <li>Seu histórico de Pomodoros</li>
                <li>Todas as suas configurações</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label className="font-[Poppins]">
                Para confirmar, digite <strong className="text-red-500">"excluir"</strong> abaixo:
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite 'excluir'"
                className="font-[Poppins]"
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setConfirmText("")
              }}
              disabled={isDeleting}
              className="font-[Poppins]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmText.toLowerCase() !== "excluir"}
              className="font-[Poppins]"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir permanentemente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function HelpSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Ajuda</h2>
        <p className="text-muted-foreground font-[Poppins]">
          Precisa de ajuda? Estamos aqui para você
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        {[
          { q: "Como criar uma tarefa?", a: "Clique no botão '+' ou vá em Task's > Nova Tarefa" },
          { q: "Como funciona o Pomodoro?", a: "25 minutos de foco + 5 minutos de pausa" },
          { q: "Posso usar offline?", a: "Sim! O app funciona offline após o primeiro acesso" },
        ].map((item, i) => (
          <div key={i} className="p-4 bg-sidebar rounded-2xl">
            <p className="font-medium font-[Poppins] text-foreground mb-2">{item.q}</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">{item.a}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="p-4 bg-sidebar rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <p className="font-medium font-[Poppins] text-foreground">Ainda precisa de ajuda?</p>
        </div>
        <p className="text-sm text-muted-foreground font-[Poppins] mb-4">
          Entre em contato com nosso suporte
        </p>
        <Button variant="outline" className="font-[Poppins]">
          Enviar mensagem
        </Button>
      </div>

      {/* Version */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground font-[Poppins]">
          FizTarefa v1.0.0
        </p>
        <p className="text-xs text-muted-foreground/60 font-[Poppins]">
          Feito com ❤️ no Brasil
        </p>
      </div>
    </motion.div>
  )
}

function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

  const sections: { section: SettingsSection; icon: React.ElementType; label: string; description: string }[] = [
    { section: "profile", icon: User, label: "Perfil", description: "Suas informações" },
    { section: "appearance", icon: Palette, label: "Aparência", description: "Tema e cores" },
    { section: "timer", icon: Clock, label: "Timer", description: "Configurações Pomodoro" },
    { section: "notifications", icon: Bell, label: "Notificações", description: "Alertas e lembretes" },
    { section: "privacy", icon: Shield, label: "Privacidade", description: "Conta e dados" },
    { section: "help", icon: HelpCircle, label: "Ajuda", description: "FAQ e suporte" },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "appearance":
        return <AppearanceSection />
      case "timer":
        return <TimerSection />
      case "notifications":
        return <NotificationsSection />
      case "privacy":
        return <PrivacySection />
      case "help":
        return <HelpSection />
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex gap-6">
      <Sidebar />
      
      <main className="flex-1 flex gap-6">
        {/* Settings Menu */}
        <div className="w-[320px] bg-sidebar rounded-3xl p-4 space-y-2 h-fit sticky top-4">
          <h1 className="text-xl font-bold text-foreground font-[Poppins] px-4 py-2">
            Configurações
          </h1>
          {sections.map((item) => (
            <SettingsItem
              key={item.section}
              icon={item.icon}
              label={item.label}
              description={item.description}
              section={item.section}
              active={activeSection === item.section}
              onClick={() => setActiveSection(item.section)}
            />
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-sidebar rounded-3xl p-8 max-w-2xl">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}

export { SettingsPage }

