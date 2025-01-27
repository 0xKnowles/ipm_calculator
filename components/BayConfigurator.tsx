import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

export interface BayConfig {
  id: string
  width: number
  length: number
  count: number
}

interface BayConfiguratorProps {
  bays: BayConfig[]
  onChange: (bays: BayConfig[]) => void
}

export function BayConfigurator({ bays, onChange }: BayConfiguratorProps) {
  const addBay = () => {
    const newBay: BayConfig = {
      id: Date.now().toString(),
      width: 8,
      length: 50,
      count: 1,
    }
    onChange([...bays, newBay])
  }

  const updateBay = (id: string, field: keyof BayConfig, value: number) => {
    onChange(bays.map((bay) => (bay.id === id ? { ...bay, [field]: value } : bay)))
  }

  const removeBay = (id: string) => {
    onChange(bays.filter((bay) => bay.id !== id))
  }

  return (
    <div className="space-y-4">
      {bays.map((bay) => (
        <div key={bay.id} className="flex flex-wrap items-center gap-2 mb-4">
          <div>
            <Label htmlFor={`bay-width-${bay.id}`} className="sr-only">
              Width (m)
            </Label>
            <Input
              id={`bay-width-${bay.id}`}
              type="number"
              min={1}
              value={bay.width}
              onChange={(e) => updateBay(bay.id, "width", Number(e.target.value))}
              className="w-20"
              placeholder="Width"
            />
          </div>
          <span>x</span>
          <div>
            <Label htmlFor={`bay-length-${bay.id}`} className="sr-only">
              Length (m)
            </Label>
            <Input
              id={`bay-length-${bay.id}`}
              type="number"
              min={1}
              value={bay.length}
              onChange={(e) => updateBay(bay.id, "length", Number(e.target.value))}
              className="w-20"
              placeholder="Length"
            />
          </div>
          <span>m</span>
          <div>
            <Label htmlFor={`bay-count-${bay.id}`} className="sr-only">
              Number of bays
            </Label>
            <Input
              id={`bay-count-${bay.id}`}
              type="number"
              min={1}
              value={bay.count}
              onChange={(e) => updateBay(bay.id, "count", Number(e.target.value))}
              className="w-20"
              placeholder="Count"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeBay(bay.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove bay configuration</span>
          </Button>
        </div>
      ))}
      <Button onClick={addBay} className="mt-2 w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add New Bay
      </Button>
    </div>
  )
}

