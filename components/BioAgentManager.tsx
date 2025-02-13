import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PestControlAgent, SelectedAgent } from "@/types/biocontrol"
import type { CompartmentConfig } from "./CompartmentConfigurator"

interface BioAgentManagerProps {
  agents: PestControlAgent[]
  selectedAgents: SelectedAgent[]
  compartments: CompartmentConfig[]
  onToggleAgent: (scientificName: string) => void
  onUpdateDesiredPest: (scientificName: string, value: number) => void
  onUpdateCompartments: (scientificName: string, compartmentId: string, isSelected: boolean) => void
}

export function BioAgentManager({
  agents,
  selectedAgents,
  compartments,
  onToggleAgent,
  onUpdateDesiredPest,
  onUpdateCompartments,
}: BioAgentManagerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bio Agents List */}
      <Card className="lg:col-span-1 h-[600px] flex flex-col">
        <CardHeader className="bg-slate-100 dark:bg-gray-700 py-2 px-4 shrink-0">
          <CardTitle className="text-sm font-medium">Biocontrol Agents</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-1 pr-4">
              {agents.map((agent) => {
                const isSelected = selectedAgents.some((a) => a.scientificName === agent.scientificName)
                return (
                  <div
                    key={agent.scientificName}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? "bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100"
                          : "hover:bg-slate-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleAgent(agent.scientificName)}
                      className="h-4 w-4"
                    />
                    <label htmlFor={`agent-${agent.scientificName}`} className="flex-grow cursor-pointer">
                      {agent.scientificName}
                    </label>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <Card className="lg:col-span-2 h-[600px] flex flex-col">
        <CardHeader className="bg-slate-100 dark:bg-gray-700 py-2 px-4 shrink-0">
          <CardTitle className="text-sm font-medium">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-2 pr-4">
              {selectedAgents.map((selectedAgent) => {
                const agent = agents.find((a) => a.scientificName === selectedAgent.scientificName)
                if (!agent) return null

                return (
                  <div
                    key={agent.scientificName}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="text-sm font-medium mb-2">{agent.scientificName}</h3>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Population per Unit: {agent.populationPerUnit.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Price per Unit: ${agent.pricePerUnit.toFixed(2)}
                      </div>
                      <div className="text-xs">
                        <Label className="text-slate-500 dark:text-slate-400 mb-1 block">Method:</Label>
                        <p className="text-teal-800 dark:text-teal-100 bg-teal-50 dark:bg-teal-900 p-2 rounded-md border border-teal-200 dark:border-teal-800">
                          {agent.method}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`pest-density-${agent.scientificName}`} className="text-xs">
                          Desired Pest/m²:
                        </Label>
                        <Input
                          id={`pest-density-${agent.scientificName}`}
                          type="number"
                          min={0}
                          step="0.01"
                          value={selectedAgent.desiredPestPerMeter}
                          onChange={(e) => onUpdateDesiredPest(agent.scientificName, Number(e.target.value))}
                          className="h-7 text-sm px-2 w-24"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Target Compartments:</Label>
                        <div className="grid grid-cols-2 gap-1">
                          {compartments.map((compartment) => (
                            <label key={compartment.id} className="flex items-center gap-1 text-xs">
                              <Checkbox
                                checked={selectedAgent.selectedCompartments.includes(compartment.id)}
                                onCheckedChange={(checked) =>
                                  onUpdateCompartments(agent.scientificName, compartment.id, checked as boolean)
                                }
                                className="h-3 w-3"
                              />
                              {compartment.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {selectedAgents.length === 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  Select agents to view details
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

