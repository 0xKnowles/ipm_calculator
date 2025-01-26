"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Leaf, Bug, DollarSign, ChevronDown, ChevronUp, FileDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface PestControlAgent {
  brandedName: string
  scientificName: string
  populationPerBottle: number
  pricePerBottle: number
  method: string
}

const pestControlAgents: PestControlAgent[] = [
  {
    brandedName: "Aphipar",
    scientificName: "Aphidius Colemani",
    populationPerBottle: 1000,
    pricePerBottle: 47.03,
    method:
      "Endoparasitism. Lays eggs inside aphids, larva consumes the aphid from the inside out, forming a 'mummy'. Adult wasp emerges to parasitize more aphids.",
  },
  {
    brandedName: "Chrysopa",
    scientificName: "Chrysoperla Carnea",
    populationPerBottle: 100000,
    pricePerBottle: 239.8,
    method:
      "Predation. Larvae are voracious predators, using large mandibles to pierce and suck body fluids from soft-bodied pests like aphids, mealybugs, thrips, and spider mites.",
  },
  {
    brandedName: "Spidex",
    scientificName: "Phytoseiulus Persimilis",
    populationPerBottle: 10000,
    pricePerBottle: 297.49,
    method:
      "Predation. Specialist predator of spider mites, actively hunting and consuming all life stages. They pierce the mites and suck out their contents.",
  },
  {
    brandedName: "Atheta",
    scientificName: "Dalotia Coriaria",
    populationPerBottle: 5000,
    pricePerBottle: 49.4,
    method:
      "Predation. Generalist predator in both larval and adult stages, actively hunting soil-dwelling pests like fungus gnat larvae, thrips pupae, and shore fly larvae.",
  },
  {
    brandedName: "Thripx",
    scientificName: "Neoseiulus Cucumeris",
    populationPerBottle: 50000,
    pricePerBottle: 26.65,
    method:
      "Predation. Primarily feeds on young thrips larvae, also consumes pollen and may feed on other small arthropods like spider mites.",
  },
  {
    brandedName: "Thripor",
    scientificName: "Orius Insideous",
    populationPerBottle: 1000,
    pricePerBottle: 64.33,
    method:
      "Predation. Generalist predator feeding on thrips, aphids, spider mites, and whiteflies. Uses piercing-sucking mouthparts to paralyze prey and suck out liquefied contents.",
  },
  {
    brandedName: "Entonem",
    scientificName: "Steinernema Feltiae",
    populationPerBottle: 50000000,
    pricePerBottle: 31.39,
    method:
      "Entomopathogenic Nematode (Parasitism). Enters host insects, releases symbiotic bacteria that kill the host. Nematodes feed on bacteria and decaying host tissues, then reproduce.",
  },
  {
    brandedName: "Swirskimite",
    scientificName: "Amblyseius Swirskii",
    populationPerBottle: 50000,
    pricePerBottle: 70.22,
    method:
      "Predation. Generalist predatory mite feeding on whitefly eggs and larvae, thrips larvae, and spider mites. Can survive on pollen when prey is scarce.",
  },
  {
    brandedName: "Nutemia",
    scientificName: "Carpoglyphus Lactis",
    populationPerBottle: 10000000,
    pricePerBottle: 80.83,
    method:
      "Competition and Indirect Predation. Used to culture other beneficial mites. Can help suppress pest populations via competition in large numbers.",
  },
  {
    brandedName: "Limonica",
    scientificName: "Amblydromalus Limonicus",
    populationPerBottle: 12500,
    pricePerBottle: 87.44,
    method:
      "Predation. Generalist predatory mite, robust to temperature fluctuation. Controls thrips, broad mites, and whitefly eggs. Can survive on pollen.",
  },
  {
    brandedName: "Miglyphus",
    scientificName: "Diglyphus",
    populationPerBottle: 500,
    pricePerBottle: 117.55,
    method:
      "Ectoparasitism and Host-Feeding. Targets leafminer larvae. Paralyzes prey and lays eggs next to it. Adult wasps also feed directly on young leafminer larvae.",
  },
]

interface SelectedAgent {
  brandedName: string
  desiredPestPerMeter: number
}

export default function IPMCalculator() {
  const [treatedBays, setTreatedBays] = useState(15)
  const [selectedAgents, setSelectedAgents] = useState<SelectedAgent[]>([])
  const [openAgents, setOpenAgents] = useState<string[]>([])
  const [hasExtraBays, setHasExtraBays] = useState(false)
  const [bayWidth, setBayWidth] = useState(8)
  const [bayLength, setBayLength] = useState(50)

  const baySize = bayWidth * bayLength
  const treatedSquareMeters = Math.max(1, treatedBays) * baySize

  const toggleAgent = (brandedName: string) => {
    setSelectedAgents((prev) =>
      prev.some((agent) => agent.brandedName === brandedName)
        ? prev.filter((agent) => agent.brandedName !== brandedName)
        : [...prev, { brandedName, desiredPestPerMeter: 0 }],
    )
  }

  const updateDesiredPestPerMeter = (brandedName: string, value: number) => {
    setSelectedAgents((prev) =>
      prev.map((agent) => (agent.brandedName === brandedName ? { ...agent, desiredPestPerMeter: value } : agent)),
    )
  }

  const calculateBottlesAndCost = (selectedAgent: SelectedAgent) => {
    const agent = pestControlAgents.find((a) => a.brandedName === selectedAgent.brandedName)
    if (!agent) return null

    const totalPestsNeeded = treatedSquareMeters * selectedAgent.desiredPestPerMeter
    const bottlesNeeded = Math.ceil(totalPestsNeeded / agent.populationPerBottle)
    const totalCost = bottlesNeeded * agent.pricePerBottle

    return { totalPestsNeeded, bottlesNeeded, totalCost }
  }

  const totalCost = selectedAgents
    .map((agent) => calculateBottlesAndCost(agent))
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .reduce((sum, { totalCost }) => sum + totalCost, 0)

  const toggleAgentCollapsible = (brandedName: string) => {
    setOpenAgents((prev) =>
      prev.includes(brandedName) ? prev.filter((name) => name !== brandedName) : [...prev, brandedName],
    )
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("IPM Calculator Report", 14, 22)
    doc.setFontSize(12)
    doc.text(`Total treated area: ${treatedSquareMeters.toLocaleString()} m²`, 14, 32)

    const tableData = selectedAgents.map((agent) => {
      const calculation = calculateBottlesAndCost(agent)
      if (!calculation) return []
      return [
        agent.brandedName,
        agent.desiredPestPerMeter,
        calculation.totalPestsNeeded.toLocaleString(),
        calculation.bottlesNeeded.toLocaleString(),
        `$${calculation.totalCost.toFixed(2)}`,
      ]
    })

    doc.autoTable({
      head: [["Agent", "Desired Pest/m²", "Total Pests", "Bottles", "Cost"]],
      body: tableData,
      startY: 40,
    })

    doc.setFontSize(14)
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10)

    doc.save("ipm_calculations.pdf")
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-slate-800">Biological Pest Calculator</h1>
      <div className="flex justify-center mb-6">
        <Image src="/logo.PNG" alt="IPM Calculator Logo" width={75} height={75} />
      </div>
      <Card className="mb-8 shadow-lg border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
            <Leaf className="mr-2 text-teal-600" /> Bay Configuration
          </CardTitle>
          <CardDescription>Adjust bay size and number of bays to treat</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div>
                <Label htmlFor="bay-width" className="text-sm text-slate-700">
                  Bay Width (m)
                </Label>
                <Input
                  id="bay-width"
                  type="number"
                  min={1}
                  value={bayWidth}
                  onChange={(e) => setBayWidth(Number(e.target.value))}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="bay-length" className="text-sm text-slate-700">
                  Bay Length (m)
                </Label>
                <Input
                  id="bay-length"
                  type="number"
                  min={1}
                  value={bayLength}
                  onChange={(e) => setBayLength(Number(e.target.value))}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="text-sm text-slate-600">Bay Size: {baySize} m²</div>
            <Label htmlFor="treated-bays" className="text-lg text-slate-700">
              Number of Bays to Treat: {treatedBays}
            </Label>
            <Slider
              id="treated-bays"
              min={1}
              max={15}
              step={1}
              value={[treatedBays]}
              onValueChange={(value) => setTreatedBays(value[0])}
              className="w-[300px]"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="extra-bays"
                checked={hasExtraBays}
                onChange={(e) => setHasExtraBays(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Label htmlFor="extra-bays" className="text-slate-700">
                Add extra bays
              </Label>
            </div>
            {hasExtraBays && (
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="extra-bays-input" className="text-slate-700">
                  Extra bays:
                </Label>
                <Input
                  id="extra-bays-input"
                  type="number"
                  min={1}
                  value={treatedBays > 15 ? treatedBays - 15 : 0}
                  onChange={(e) => setTreatedBays(15 + Number(e.target.value))}
                  className="w-20 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-lg border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
            <Bug className="mr-2 text-teal-600" /> Select Biological Control Agents
          </CardTitle>
          <CardDescription>Choose agents and set desired pest density per m²</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pestControlAgents.map((agent) => (
              <div key={agent.brandedName} className="border rounded-lg bg-white overflow-hidden border-slate-200">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAgents.some((a) => a.brandedName === agent.brandedName)}
                        onChange={() => toggleAgent(agent.brandedName)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-medium text-slate-700">{agent.brandedName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAgentCollapsible(agent.brandedName)}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      {openAgents.includes(agent.brandedName) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {openAgents.includes(agent.brandedName) && (
                  <div className="p-4 bg-slate-50">
                    <Separator className="my-2" />
                    <div className="text-sm text-slate-600 mb-2">{agent.scientificName}</div>
                    <div className="text-sm text-slate-600 mb-2">
                      Method:{" "}
                      <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                        {agent.method}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`pest-density-${agent.brandedName}`}
                          className="text-sm whitespace-nowrap text-slate-700"
                        >
                          Desired Pest/m²:
                        </Label>
                        <Input
                          id={`pest-density-${agent.brandedName}`}
                          type="number"
                          value={
                            selectedAgents.find((a) => a.brandedName === agent.brandedName)?.desiredPestPerMeter || 0
                          }
                          onChange={(e) => updateDesiredPestPerMeter(agent.brandedName, Number(e.target.value))}
                          disabled={!selectedAgents.some((a) => a.brandedName === agent.brandedName)}
                          className="w-20 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="text-sm text-slate-600">
                        Population/Bottle: {agent.populationPerBottle.toLocaleString()}
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        ${agent.pricePerBottle.toFixed(2)}/bottle
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
            <DollarSign className="mr-2 text-teal-600" /> Order Calculations
          </CardTitle>
          <CardDescription>Total treated area: {treatedSquareMeters.toLocaleString()} m²</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedAgents.map((selectedAgent) => {
              const calculation = calculateBottlesAndCost(selectedAgent)
              if (!calculation) return null

              return (
                <div key={selectedAgent.brandedName} className="p-4 border rounded-lg bg-white border-slate-200">
                  <div className="font-medium mb-2 text-slate-700">{selectedAgent.brandedName}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="text-slate-600">Total Pests: {calculation.totalPestsNeeded.toLocaleString()}</div>
                    <div className="text-slate-600">Bottles: {calculation.bottlesNeeded.toLocaleString()}</div>
                    <div className="font-semibold text-slate-700">Cost: ${calculation.totalCost.toFixed(2)}</div>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between items-center font-bold text-lg p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700">Total Cost:</span>
              <span className="text-teal-600">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 text-sm text-slate-600 flex justify-between items-center">
          <p>
            Calculations are based on desired pest density per square meter. Adjust as needed based on pest pressure and
            environmental conditions.
          </p>
          <Button onClick={exportToPDF} className="ml-4 bg-teal-600 hover:bg-teal-700 text-white">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

