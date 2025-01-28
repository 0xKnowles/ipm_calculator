import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PestControlAgent {
  scientificName: string
  brandedName: string
  pricePerBottle: number
  populationPerBottle: number
  method: string
}

interface SettingsMenuProps {
  pestControlAgents: PestControlAgent[]
  updateAgentSettings: (name: string, newPrice: number, newPopulation: number) => void
  addNewAgent: (newAgent: PestControlAgent) => void
}

export function SettingsMenu({ pestControlAgents, updateAgentSettings, addNewAgent }: SettingsMenuProps) {
  const [settings, setSettings] = useState<Record<string, { price: number; population: number }>>({})
  const [newAgent, setNewAgent] = useState<PestControlAgent>({
    scientificName: "",
    brandedName: "",
    pricePerBottle: 0,
    populationPerBottle: 0,
    method: "",
  })
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  useEffect(() => {
    const initialSettings = Object.fromEntries(
      pestControlAgents.map((agent) => [
        agent.scientificName,
        { price: agent.pricePerBottle, population: agent.populationPerBottle },
      ]),
    )
    setSettings(initialSettings)
  }, [pestControlAgents])

  const handleSettingChange = (name: string, field: "price" | "population", value: string) => {
    const numericValue = Number.parseFloat(value)
    if (!isNaN(numericValue) && numericValue >= 0) {
      setSettings((prev) => ({
        ...prev,
        [name]: { ...prev[name], [field]: numericValue },
      }))
    }
  }

  const handleNewAgentChange = (field: keyof PestControlAgent, value: string) => {
    setNewAgent((prev) => ({
      ...prev,
      [field]: field === "pricePerBottle" || field === "populationPerBottle" ? Number(value) : value,
    }))
  }

  const handleSave = () => {
    Object.entries(settings).forEach(([name, { price, population }]) => {
      updateAgentSettings(name, price, population)
    })
  }

  const handleAddNewAgent = () => {
    addNewAgent(newAgent)
    setSettings((prev) => ({
      ...prev,
      [newAgent.scientificName]: { price: newAgent.pricePerBottle, population: newAgent.populationPerBottle },
    }))
    setIsAddProductOpen(false)
    setNewAgent({
      scientificName: "",
      brandedName: "",
      pricePerBottle: 0,
      populationPerBottle: 0,
      method: "",
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
            <CardTitle className="text-lg font-semibold">Biocontrol Agent Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {pestControlAgents.map((agent) => (
                <div key={agent.scientificName} className="mb-4">
                  <Label htmlFor={`price-${agent.scientificName}`} className="text-sm font-medium">
                    {agent.scientificName} ({agent.brandedName})
                  </Label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-slate-500 mr-2">$</span>
                    <Input
                      id={`price-${agent.scientificName}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings[agent.scientificName]?.price || agent.pricePerBottle}
                      onChange={(e) => handleSettingChange(agent.scientificName, "price", e.target.value)}
                      className="flex-grow"
                    />
                    <span className="text-sm text-slate-500 ml-2">/bottle</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Input
                      id={`population-${agent.scientificName}`}
                      type="number"
                      min="0"
                      step="1"
                      value={settings[agent.scientificName]?.population || agent.populationPerBottle}
                      onChange={(e) => handleSettingChange(agent.scientificName, "population", e.target.value)}
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
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-2" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Biocontrol Agent</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scientificName" className="text-right">
                      Scientific Name
                    </Label>
                    <Input
                      id="scientificName"
                      value={newAgent.scientificName}
                      onChange={(e) => handleNewAgentChange("scientificName", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brandedName" className="text-right">
                      Branded Name
                    </Label>
                    <Input
                      id="brandedName"
                      value={newAgent.brandedName}
                      onChange={(e) => handleNewAgentChange("brandedName", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pricePerBottle" className="text-right">
                      Price per Bottle
                    </Label>
                    <Input
                      id="pricePerBottle"
                      type="number"
                      value={newAgent.pricePerBottle}
                      onChange={(e) => handleNewAgentChange("pricePerBottle", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="populationPerBottle" className="text-right">
                      Population per Bottle
                    </Label>
                    <Input
                      id="populationPerBottle"
                      type="number"
                      value={newAgent.populationPerBottle}
                      onChange={(e) => handleNewAgentChange("populationPerBottle", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">
                      Method
                    </Label>
                    <Input
                      id="method"
                      value={newAgent.method}
                      onChange={(e) => handleNewAgentChange("method", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddNewAgent}>Add Agent</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

