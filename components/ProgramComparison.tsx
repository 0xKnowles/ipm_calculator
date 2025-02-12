"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PestControlAgent } from "@/types/biocontrol"

interface ProgramOrder {
  week: number
  weeklyProgramCost: number
  agents: {
    scientificName: string
    quantity: number
  }[]
}

interface ProgramComparisonProps {
  pestControlAgents: PestControlAgent[]
  calculatedOrder: {
    scientificName: string
    unitsNeeded: number
  }[]
  onSaveProgramOrder: (order: ProgramOrder) => void
}

export function ProgramComparison({ pestControlAgents, calculatedOrder, onSaveProgramOrder }: ProgramComparisonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [programOrder, setProgramOrder] = useState<ProgramOrder>({
    week: 1,
    weeklyProgramCost: 0,
    agents: [],
  })

  const handleAgentQuantityChange = (scientificName: string, quantity: number) => {
    setProgramOrder((prev) => ({
      ...prev,
      agents: prev.agents.some((agent) => agent.scientificName === scientificName)
        ? prev.agents.map((agent) => (agent.scientificName === scientificName ? { ...agent, quantity } : agent))
        : [...prev.agents, { scientificName, quantity }],
    }))
  }

  const handleSaveProgramOrder = () => {
    onSaveProgramOrder(programOrder)
    setIsOpen(false)
  }

  const calculateComparison = () => {
    let extraCost = 0

    calculatedOrder.forEach((calculatedAgent) => {
      const programAgent = programOrder.agents.find((agent) => agent.scientificName === calculatedAgent.scientificName)
      const agent = pestControlAgents.find((a) => a.scientificName === calculatedAgent.scientificName)

      if (programAgent && agent) {
        const difference = calculatedAgent.unitsNeeded - programAgent.quantity
        if (difference > 0) {
          extraCost += difference * agent.pricePerUnit
        }
      } else if (agent) {
        extraCost += calculatedAgent.unitsNeeded * agent.pricePerUnit
      }
    })

    return { extraCost, totalCost: programOrder.weeklyProgramCost + extraCost }
  }

  const comparison = calculateComparison()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
          <span className="sr-only">Open program comparison</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-[200]" align="center" side="right" sideOffset={5} alignOffset={-50}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Supplier Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="week">Week:</Label>
                <Input
                  id="week"
                  type="number"
                  value={programOrder.week}
                  onChange={(e) => setProgramOrder((prev) => ({ ...prev, week: Number.parseInt(e.target.value) }))}
                  className="w-20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="weeklyProgramCost">Weekly Program Cost:</Label>
                <Input
                  id="weeklyProgramCost"
                  type="number"
                  value={programOrder.weeklyProgramCost}
                  onChange={(e) =>
                    setProgramOrder((prev) => ({ ...prev, weeklyProgramCost: Number.parseFloat(e.target.value) }))
                  }
                  className="w-24"
                />
              </div>
              <ScrollArea className="h-[200px] pr-4">
                {pestControlAgents.map((agent) => (
                  <div key={agent.scientificName} className="flex items-center space-x-2 mb-2">
                    <Label htmlFor={`agent-${agent.scientificName}`} className="w-1/2 truncate">
                      {agent.scientificName}:
                    </Label>
                    <Input
                      id={`agent-${agent.scientificName}`}
                      type="number"
                      value={programOrder.agents.find((a) => a.scientificName === agent.scientificName)?.quantity || 0}
                      onChange={(e) => handleAgentQuantityChange(agent.scientificName, Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                ))}
              </ScrollArea>
              <Button onClick={handleSaveProgramOrder} className="w-full">
                Save Program Order
              </Button>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Extra Cost:</span>
                  <span className="font-semibold text-red-600">${comparison.extraCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-semibold">${comparison.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

