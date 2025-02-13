import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {compartments.map((compartment) => (
            <div
              key={compartment.id}
              className="flex flex-col gap-1 bg-white dark:bg-gray-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-1">
                <Input
                  value={compartment.name}
                  onChange={(e) => updateCompartment(compartment.id, "name", e.target.value)}
                  className="h-7 text-sm flex-1"
                  placeholder={`Comp ${compartments.indexOf(compartment) + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompartment(compartment.id)}
                  className="h-7 w-7 text-slate-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    value={compartment.width}
                    onChange={(e) => updateCompartment(compartment.id, "width", Number(e.target.value))}
                    className="h-7 text-sm pr-5 text-right"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">m</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    value={compartment.length}
                    onChange={(e) => updateCompartment(compartment.id, "length", Number(e.target.value))}
                    className="h-7 text-sm pr-5 text-right"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">m</span>
                </div>
                <Input
                  type="number"
                  min={1}
                  value={compartment.count}
                  onChange={(e) => updateCompartment(compartment.id, "count", Number(e.target.value))}
                  className="h-7 text-sm text-right"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                Area: {(compartment.width * compartment.length * compartment.count).toLocaleString()} m²
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Total Area:{" "}
          {compartments.reduce((sum, comp) => sum + comp.width * comp.length * comp.count, 0).toLocaleString()} m²
        </div>
        <Button
          onClick={addCompartment}
          size="sm"
          className="bg-teal-600 hover:bg-teal-700 text-white h-7 text-xs rounded-full px-3"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Compartment
        </Button>
      </div>

      <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 justify-end">
        <span>Width (m)</span>
        <span>Length (m)</span>
        <span>Bays</span>
      </div>
    </div>
  )
}

