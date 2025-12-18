import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  Zap,
  Loader2,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DatePicker } from '@/components/ui/date-picker'
import { Sidebar, GuestModeBanner } from '@/components/dashboard'
import { useTasks } from '@/hooks/use-tasks'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TaskFormData {
  name: string
  description: string
  scheduledDate: Date | undefined
  difficulty: number
  estimatedTime: string
}

const timeOptions = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1h 30m' },
  { value: '120', label: '2 horas' },
  { value: '180', label: '3 horas' },
  { value: '240', label: '4 horas' },
  { value: '480', label: '8 horas' },
]

export function CreateTaskPage() {
  const navigate = useNavigate()
  const { createTask } = useTasks()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    scheduledDate: new Date(),
    difficulty: 25,
    estimatedTime: '60',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Por favor, informe o nome da tarefa')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await createTask({
        title: formData.name,
        description: formData.description || undefined,
        difficulty: formData.difficulty,
        estimated_time: parseInt(formData.estimatedTime),
        start_date: formData.scheduledDate?.toISOString() || null,
      })

      if (error) {
        toast.error('Erro ao criar tarefa. Tente novamente.')
        return
      }
      
      toast.success('Tarefa criada com sucesso!', {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      
      navigate('/')
    } catch (error) {
      toast.error('Erro ao criar tarefa. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex gap-6">
      <Sidebar />
      
      <main className="flex-1 max-w-4xl">
        <GuestModeBanner />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground font-[Poppins]">
            Criar Nova Tarefa
          </h1>
          <p className="text-muted-foreground mt-1 font-[Poppins]">
            Preencha os detalhes da sua nova tarefa
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Defina o nome e uma descrição para sua tarefa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-[Poppins] font-medium">
                    Nome da Tarefa *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Finalizar relatório mensal"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 font-[Poppins]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-[Poppins] font-medium">
                    Descrição (opcional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva os detalhes da tarefa..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px] font-[Poppins]"
                  />
                </div>
              </CardContent>
            </Card>


            {/* Data para Realizar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Data para Realizar
                </CardTitle>
                <CardDescription>
                  Quando você pretende realizar esta tarefa?
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-2">
                  <Label className="font-[Poppins] font-medium">Selecione a data</Label>
                    <DatePicker
                    date={formData.scheduledDate}
                    onDateChange={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                    placeholder="Selecione a data"
                    />
                </div>
              </CardContent>
            </Card>

            {/* Dificuldade com Slider */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Dificuldade & Relevância
                </CardTitle>
                <CardDescription>
                  Arraste o slider para definir o nível de dificuldade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-[Poppins] font-medium">Nível de Dificuldade</Label>
                    <span className="text-lg font-bold font-[Poppins] text-primary">
                      {formData.difficulty}%
                    </span>
                  </div>
                  
                  <div className="pt-2 pb-4">
                    <Slider
                      value={[formData.difficulty]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value[0] }))}
                      max={100}
                      step={25}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Labels do Slider */}
                  <div className="flex justify-between text-sm text-muted-foreground font-[Poppins]">
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tempo Estimado com Radio Group */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Tempo Estimado
                </CardTitle>
                <CardDescription>
                  Quanto tempo você espera gastar nesta tarefa?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.estimatedTime}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedTime: value }))}
                  className="grid grid-cols-3 md:grid-cols-5 gap-3"
                >
                  {timeOptions.map((option) => (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={`time-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`time-${option.value}`}
                        className={cn(
                          "flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 cursor-pointer font-[Poppins] text-sm font-medium transition-all",
                          "hover:bg-accent hover:text-accent-foreground",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary"
                        )}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <p className="text-sm text-muted-foreground mt-4 font-[Poppins]">
                  💡 Isso equivale a aproximadamente{' '}
                  <strong className="text-foreground">
                    {Math.ceil(parseInt(formData.estimatedTime) / 25)} pomodoros
                  </strong>
                </p>
              </CardContent>
            </Card>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between pt-4"
            >
              <div className="text-sm text-muted-foreground font-[Poppins]">
                <span className="text-foreground">*</span> Campos obrigatórios
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="font-[Poppins]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[140px] font-[Poppins]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Tarefa'
                  )}
                </Button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
