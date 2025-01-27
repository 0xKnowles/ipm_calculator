import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PestControlAgent {
  name: string
  pricePerBottle: number
}

interface SettingsMenuProps {
  pestControlAgents: PestControlAgent[]
  updateAgentPrice: (name: string, newPrice: number) => void
}

export function SettingsMenu({ pestControlAgents, updateAgentPrice }: SettingsMenuProps) {
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(pestControlAgents.map((agent) => [agent.name, agent.pricePerBottle])),
  )

  const handlePriceChange = (name: string, newPrice: string) => {
    const numericPrice = Number.parseFloat(newPrice)
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      setPrices((prev) => ({ ...prev, [name]: numericPrice }))
    }
  }

  const handleSave = () => {
    Object.entries(prices).forEach(([name, price]) => {
      updateAgentPrice(name, price)
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 left-4">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Bio Price Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {pestControlAgents.map((agent) => (
                <div key={agent.name} className="mb-4">
                  <Label htmlFor={`price-${agent.name}`} className="text-sm font-medium">
                    {agent.name}
                  </Label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-slate-500 mr-2">$</span>
                    <Input
                      id={`price-${agent.name}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={prices[agent.name]}
                      onChange={(e) => handlePriceChange(agent.name, e.target.value)}
                      className="flex-grow"
                    />
                    <span className="text-sm text-slate-500 ml-2">/bottle</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <Button onClick={handleSave} className="w-full mt-4">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

