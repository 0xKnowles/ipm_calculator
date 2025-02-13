"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { PestControlAgent, SelectedAgent } from "@/types/biocontrol"
import type { CompartmentConfig } from "./CompartmentConfigurator"

interface BioAgentSelectorProps {
  agents: PestControlAgent[]
  selectedAgents: SelectedAgent[]
  compartments: CompartmentConfig[]
  onToggleAgent: (scientificName: string) => void
  onUpdateDesiredPest: (scientificName: string, value: number) => void
  onUpdateCompartments: (scientificName: string, compartmentId: string, isSelected: boolean) => void
}

export function BioAgentSelector({
  agents,
  selectedAgents,
  compartments,
  onToggleAgent,
  onUpdateDesiredPest,
  onUpdateCompartments,
}: BioAgentSelectorProps) {
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<string | null>(null)

  const currentAgent = agents.find((agent) => agent.scientificName === selectedAgentDetails)
  const currentSelectedAgent = selectedAgents.find((agent) => agent.scientificName === selectedAgentDetails)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left Panel - Agent List */}
      <Card className="md:col-span-1">
        <CardHeader className="bg-slate-100 dark:bg-gray-700">
          <CardTitle className="text-lg font-semibold">Biocontrol Agents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1 p-2">
              {agents.map((agent) => {
                const isSelected = selectedAgents.some((a) => a.scientificName === agent.scientificName)
                return (
                  <div
                    key={agent.scientificName}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer
                      ${selectedAgentDetails === agent.scientificName ? "bg-slate-100 dark:bg-gray-700" : ""}
                      hover:bg-slate-50 dark:hover:bg-gray-800
                    `}
                    onClick={() => setSelectedAgentDetails(agent.scientificName)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleAgent(agent.scientificName)}
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm font-medium truncate">{agent.scientificName}</span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel - Agent Details */}
      <Card className="md:col-span-2">
        <CardHeader className="bg-slate-100 dark:bg-gray-700">
          <CardTitle className="text-lg font-semibold">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {currentAgent ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{currentAgent.scientificName}</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Branded Names</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentAgent.brandedNames.map((bn, index) => (
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

                  <div>
                    <Label className="text-sm font-medium mb-1 block">Method</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800 p-3 rounded-lg">
                      {currentAgent.method}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Population per Unit</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {currentAgent.populationPerUnit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Price per Unit</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        ${currentAgent.pricePerUnit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {currentSelectedAgent && (
                    <>
                      <div>
                        <Label htmlFor="desired-pest" className="text-sm font-medium mb-1 block">
                          Desired Pest/m²
                        </Label>
                        <Input
                          id="desired-pest"
                          type="number"
                          min={0}
                          step="0.01"
                          value={currentSelectedAgent.desiredPestPerMeter}
                          onChange={(e) => onUpdateDesiredPest(currentAgent.scientificName, Number(e.target.value))}
                          className="w-32"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Target Compartments</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {compartments.map((compartment) => (
                            <div key={compartment.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${currentAgent.scientificName}-${compartment.id}`}
                                checked={currentSelectedAgent.selectedCompartments.includes(compartment.id)}
                                onCheckedChange={(checked) =>
                                  onUpdateCompartments(currentAgent.scientificName, compartment.id, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`${currentAgent.scientificName}-${compartment.id}`}
                                className="text-sm text-slate-600 dark:text-slate-400"
                              >
                                {compartment.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
              Select an agent to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

