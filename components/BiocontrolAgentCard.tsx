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
    <div className="border rounded-lg bg-white dark:bg-gray-800 overflow-hidden border-slate-200 dark:border-slate-700">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="font-medium text-slate-700 dark:text-slate-200">{agent.scientificName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 bg-slate-50 dark:bg-gray-700">
          <Separator className="my-2" />
          <div className="text-sm text-slate-600 mb-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Branded Names
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.brandedNames.map((bn, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200"
                >
                  {bn.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600 mb-2">
            Method:{" "}
            <Badge
              variant="secondary"
              className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
            >
              {agent.method}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`pest-density-${agent.scientificName}`}
                className="text-sm whitespace-nowrap text-slate-700 dark:text-slate-300"
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
                className="w-24 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Population/Bottle: {agent.populationPerBottle.toLocaleString()}
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              ${agent.pricePerBottle.toFixed(2)}/bottle
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Compartments:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {compartments.map((compartment) => (
                <div key={compartment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${agent.scientificName}-${compartment.id}`}
                    checked={selectedAgent?.selectedCompartments.includes(compartment.id)}
                    onCheckedChange={(checked) => onUpdateCompartments(compartment.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`${agent.scientificName}-${compartment.id}`}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
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

