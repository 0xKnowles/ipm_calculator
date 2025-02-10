import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit2 } from "lucide-react"

export interface CompartmentConfig {
  id: string
  name: string
  width: number
  length: number
  count: number
}

interface CompartmentConfiguratorProps {
  compartments: CompartmentConfig[]
  onChange: (compartments: CompartmentConfig[]) => void
}

export function CompartmentConfigurator({ compartments, onChange }: CompartmentConfiguratorProps) {
  const addCompartment = () => {
    const newCompartment: CompartmentConfig = {
      id: Date.now().toString(),
      name: `Comp ${compartments.length + 1}`,
      width: 8,
      length: 50,
      count: 1,
    }
    onChange([...compartments, newCompartment])
  }

  const updateCompartment = (id: string, field: keyof CompartmentConfig, value: string | number) => {
    onChange(
      compartments.map((compartment) => (compartment.id === id ? { ...compartment, [field]: value } : compartment)),
    )
  }

  const removeCompartment = (id: string) => {
    onChange(compartments.filter((compartment) => compartment.id !== id))
  }

  return (
    <div className="space-y-4">
      {compartments.map((compartment, index) => (
        <div key={compartment.id} className="flex flex-wrap items-center gap-2 mb-4">
          <div className="w-full sm:w-auto flex items-center gap-2 mb-2 sm:mb-0">
            <Input
              value={compartment.name}
              onChange={(e) => updateCompartment(compartment.id, "name", e.target.value)}
              className="w-40"
              placeholder={`Comp ${index + 1}`}
            />
            <Edit2 className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <Label
              htmlFor={`compartment-width-${compartment.id}`}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Width
            </Label>
            <Input
              id={`compartment-width-${compartment.id}`}
              type="number"
              min={1}
              value={compartment.width}
              onChange={(e) => updateCompartment(compartment.id, "width", Number(e.target.value))}
              className="w-20 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
              placeholder="Width"
            />
          </div>
          <span>x</span>
          <div>
            <Label
              htmlFor={`compartment-length-${compartment.id}`}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Height
            </Label>
            <Input
              id={`compartment-length-${compartment.id}`}
              type="number"
              min={1}
              value={compartment.length}
              onChange={(e) => updateCompartment(compartment.id, "length", Number(e.target.value))}
              className="w-20 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
              placeholder="Height"
            />
          </div>
          <span>m</span>
          <div>
            <Label
              htmlFor={`compartment-count-${compartment.id}`}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              # of Bays
            </Label>
            <Input
              id={`compartment-count-${compartment.id}`}
              type="number"
              min={1}
              value={compartment.count}
              onChange={(e) => updateCompartment(compartment.id, "count", Number(e.target.value))}
              className="w-20 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
              placeholder="Count"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeCompartment(compartment.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove compartment configuration</span>
          </Button>
        </div>
      ))}
      <Button
        onClick={addCompartment}
        className="mt-2 w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Compartment
      </Button>
    </div>
  )
}

