import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings } from "lucide-react"

interface PestControlAgent {
  brandedName: string
  pricePerBottle: number
}

interface SettingsMenuProps {
  pestControlAgents: PestControlAgent[]
  updateAgentPrice: (brandedName: string, newPrice: number) => void
}

export function SettingsMenu({ pestControlAgents, updateAgentPrice }: SettingsMenuProps) {
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(pestControlAgents.map((agent) => [agent.brandedName, agent.pricePerBottle])),
  )

  const handlePriceChange = (brandedName: string, newPrice: string) => {
    const numericPrice = Number.parseFloat(newPrice)
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      setPrices((prev) => ({ ...prev, [brandedName]: numericPrice }))
    }
  }

  const handleSave = () => {
    Object.entries(prices).forEach(([brandedName, price]) => {
      updateAgentPrice(brandedName, price)
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 left-4">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open Price settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h2 className="text-lg font-semibold mb-4">Price Settings</h2>
        <ScrollArea className="h-[300px] pr-4">
          {pestControlAgents.map((agent) => (
            <div key={agent.brandedName} className="mb-4">
              <Label htmlFor={`price-${agent.brandedName}`} className="text-sm font-medium">
                {agent.brandedName}
              </Label>
              <Input
                id={`price-${agent.brandedName}`}
                type="number"
                min="0"
                step="0.01"
                value={prices[agent.brandedName]}
                onChange={(e) => handlePriceChange(agent.brandedName, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}
        </ScrollArea>
        <Button onClick={handleSave} className="w-full mt-4">
          Save Changes
        </Button>
      </PopoverContent>
    </Popover>
  )
}

