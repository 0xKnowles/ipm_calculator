import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PestControlAgent, SelectedAgent } from "@/types/biocontrol"
import type { CompartmentConfig } from "@/components/CompartmentConfigurator"

interface BiocontrolAgentCardProps {
  agent: PestControlAgent
  isOpen: boolean
  isSelected: boolean
  selectedAgent?: SelectedAgent
  compartments: CompartmentConfig[]
  onToggle: () => void
  onSelect: () => void
  onUpdateDesiredPest: (value: number) => void
  onUpdateCompartments: (compartmentId: string, isSelected: boolean) => void
}

export function BiocontrolAgentCard({
  agent,
  isOpen,
  isSelected,
  selectedAgent,
  compartments,
  onToggle,
  onSelect,
  onUpdateDesiredPest,
  onUpdateCompartments,
}: BiocontrolAgentCardProps) {
  return (
    <div className="border rounded-lg bg-white overflow-hidden border-slate-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="font-medium text-slate-700">{agent.scientificName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle} className="text-slate-600 hover:text-slate-800">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 bg-slate-50">
          <Separator className="my-2" />
          <div className="text-sm text-slate-600 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Branded Names
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.brandedNames.map((bn, index) => (
                <Badge key={index} variant="secondary">
                  {bn.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600 mb-2">
            Method:{" "}
            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
              {agent.method}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`pest-density-${agent.scientificName}`}
                className="text-sm whitespace-nowrap text-slate-700"
              >
                Desired Pest/m²:
              </Label>
              <Input
                id={`pest-density-${agent.scientificName}`}
                type="number"
                min={0}
                step="0.01"
                value={selectedAgent?.desiredPestPerMeter || 0}
                onChange={(e) => onUpdateDesiredPest(Number(e.target.value))}
                disabled={!isSelected}
                className="w-24"
              />
            </div>
            <div className="text-sm text-slate-600">
              Population/Bottle: {agent.populationPerBottle.toLocaleString()}
            </div>
            <div className="text-sm font-semibold text-slate-700">${agent.pricePerBottle.toFixed(2)}/bottle</div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-slate-700">Select Compartments:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {compartments.map((compartment) => (
                <div key={compartment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${agent.scientificName}-${compartment.id}`}
                    checked={selectedAgent?.selectedCompartments.includes(compartment.id)}
                    onCheckedChange={(checked) => onUpdateCompartments(compartment.id, checked as boolean)}
                  />
                  <Label htmlFor={`${agent.scientificName}-${compartment.id}`} className="text-sm text-slate-600">
                    {compartment.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

