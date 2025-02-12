import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bug, Plus, PlusCircle, X, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { PestControlAgent, BrandedName } from "@/types/biocontrol"

interface SettingsMenuProps {
  pestControlAgents: PestControlAgent[]
  updateAgentSettings: (name: string, updatedAgent: Partial<PestControlAgent>) => void
  addNewAgent: (newAgent: PestControlAgent) => void
  deleteAgent: (scientificName: string) => void
}

export function SettingsMenu({ pestControlAgents, updateAgentSettings, addNewAgent, deleteAgent }: SettingsMenuProps) {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<PestControlAgent | null>(null)
  const [newAgent, setNewAgent] = useState<PestControlAgent>({
    scientificName: "",
    brandedNames: [],
    pricePerUnit: 0,
    populationPerUnit: 0,
    method: "",
  })

  const handleNewAgentChange = (field: keyof PestControlAgent, value: string | BrandedName[]) => {
    setNewAgent((prev) => ({
      ...prev,
      [field]: field === "pricePerUnit" || field === "populationPerUnit" ? Number(value) : value,
    }))
  }

  const handleEditingAgentChange = (field: keyof PestControlAgent, value: string | BrandedName[]) => {
    setEditingAgent((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [field]: field === "pricePerUnit" || field === "populationPerUnit" ? Number(value) : value,
      }
    })
  }

  const addBrandedName = (isEditing: boolean) => {
    if (isEditing) {
      setEditingAgent((prev) => {
        if (!prev) return null
        return {
          ...prev,
          brandedNames: [...prev.brandedNames, { name: "" }],
        }
      })
    } else {
      setNewAgent((prev) => ({
        ...prev,
        brandedNames: [...prev.brandedNames, { name: "" }],
      }))
    }
  }

  const updateBrandedName = (index: number, value: string, isEditing: boolean) => {
    if (isEditing) {
      setEditingAgent((prev) => {
        if (!prev) return null
        return {
          ...prev,
          brandedNames: prev.brandedNames.map((bn, i) => (i === index ? { ...bn, name: value } : bn)),
        }
      })
    } else {
      setNewAgent((prev) => ({
        ...prev,
        brandedNames: prev.brandedNames.map((bn, i) => (i === index ? { ...bn, name: value } : bn)),
      }))
    }
  }

  const removeBrandedName = (index: number, isEditing: boolean) => {
    if (isEditing) {
      setEditingAgent((prev) => {
        if (!prev) return null
        return {
          ...prev,
          brandedNames: prev.brandedNames.filter((_, i) => i !== index),
        }
      })
    } else {
      setNewAgent((prev) => ({
        ...prev,
        brandedNames: prev.brandedNames.filter((_, i) => i !== index),
      }))
    }
  }

  const handleAddNewAgent = () => {
    if (!newAgent.scientificName || newAgent.pricePerUnit <= 0 || newAgent.populationPerUnit <= 0) {
      alert("Please fill in all required fields: Scientific Name, Price per Unit, and Population per Unit.")
      return
    }
    const filteredAgent = {
      ...newAgent,
      brandedNames: newAgent.brandedNames.filter((bn) => bn.name.trim() !== ""),
      method: newAgent.method.trim(),
    }
    addNewAgent(filteredAgent)
    setIsAddProductOpen(false)
    setNewAgent({
      scientificName: "",
      brandedNames: [],
      pricePerUnit: 0,
      populationPerUnit: 0,
      method: "",
    })
  }

  const handleEditAgent = () => {
    if (editingAgent) {
      const filteredAgent = {
        ...editingAgent,
        brandedNames: editingAgent.brandedNames.filter((bn) => bn.name.trim() !== ""),
      }
      updateAgentSettings(editingAgent.scientificName, filteredAgent)
      setIsEditProductOpen(false)
      setEditingAgent(null)
    }
  }

  const handleDeleteAgent = (scientificName: string) => {
    if (window.confirm(`Are you sure you want to delete ${scientificName}?`)) {
      deleteAgent(scientificName)
    }
  }

  const openEditDialog = (agent: PestControlAgent) => {
    setEditingAgent(agent)
    setIsEditProductOpen(true)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bug className="h-4 w-4" />
          <span className="sr-only">Open biocontrol agent settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-[200]" align="center" side="right" sideOffset={5} alignOffset={-50}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Biocontrol Agent Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {pestControlAgents.length > 0 ? (
                pestControlAgents.map((agent) => (
                  <div key={agent.scientificName} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">{agent.scientificName}</Label>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(agent)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
                      {agent.brandedNames.map((bn, index) => (
                        <Badge key={index} variant="secondary">
                          {bn.name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleDeleteAgent(agent.scientificName)}
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                    >
                      Delete Agent
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500">No biocontrol agents available.</div>
              )}
            </ScrollArea>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4" variant="outline">
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
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pricePerUnit" className="text-right">
                      Price per Unit
                    </Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      value={newAgent.pricePerUnit}
                      onChange={(e) => handleNewAgentChange("pricePerUnit", e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="populationPerUnit" className="text-right">
                      Population per Unit
                    </Label>
                    <Input
                      id="populationPerUnit"
                      type="number"
                      value={newAgent.populationPerUnit}
                      onChange={(e) => handleNewAgentChange("populationPerUnit", e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Branded Names (Optional)</Label>
                    <div className="col-span-3 space-y-2">
                      {newAgent.brandedNames.map((bn, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={bn.name}
                            onChange={(e) => updateBrandedName(index, e.target.value, false)}
                            placeholder={`Branded Name ${index + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBrandedName(index, false)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addBrandedName(false)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Branded Name
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">
                      Method (Optional)
                    </Label>
                    <Input
                      id="method"
                      value={newAgent.method}
                      onChange={(e) => handleNewAgentChange("method", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddNewAgent}
                  disabled={!newAgent.scientificName || newAgent.pricePerUnit <= 0 || newAgent.populationPerUnit <= 0}
                >
                  Add Agent
                </Button>
              </DialogContent>
            </Dialog>
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Biocontrol Agent</DialogTitle>
                </DialogHeader>
                {editingAgent && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editScientificName" className="text-right">
                        Scientific Name
                      </Label>
                      <Input
                        id="editScientificName"
                        value={editingAgent.scientificName}
                        onChange={(e) => handleEditingAgentChange("scientificName", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right mt-2">Branded Names</Label>
                      <div className="col-span-3 space-y-2">
                        {editingAgent.brandedNames.map((bn, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={bn.name}
                              onChange={(e) => updateBrandedName(index, e.target.value, true)}
                              placeholder={`Branded Name ${index + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBrandedName(index, true)}
                              className="shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => addBrandedName(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Another Name
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editPricePerUnit" className="text-right">
                        Price per Unit
                      </Label>
                      <Input
                        id="editPricePerUnit"
                        type="number"
                        value={editingAgent.pricePerUnit}
                        onChange={(e) => handleEditingAgentChange("pricePerUnit", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editPopulationPerUnit" className="text-right">
                        Population per Unit
                      </Label>
                      <Input
                        id="editPopulationPerUnit"
                        type="number"
                        value={editingAgent.populationPerUnit}
                        onChange={(e) => handleEditingAgentChange("populationPerUnit", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editMethod" className="text-right">
                        Method
                      </Label>
                      <Input
                        id="editMethod"
                        value={editingAgent.method}
                        onChange={(e) => handleEditingAgentChange("method", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                )}
                <Button onClick={handleEditAgent}>Save Changes</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

