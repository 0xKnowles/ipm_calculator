"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Leaf, Bug, DollarSign, ChevronDown, ChevronUp, FileDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { SettingsMenu } from "@/components/SettingsMenu"
import { CompartmentConfigurator, type CompartmentConfig } from "@/components/CompartmentConfigurator"
import { ConfigurationManager } from "@/components/ConfigurationManager"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { WelcomeModal } from "@/components/WelcomeModal"

interface PestControlAgent {
  brandedName: string
  scientificName: string
  populationPerBottle: number
  pricePerBottle: number
  method: string
}

const initialPestControlAgents: PestControlAgent[] = [
  {
    brandedName: "Aphipar",
    scientificName: "Aphidius Colemani",
    populationPerBottle: 1000,
    pricePerBottle: 45,
    method:
      "Endoparasitism. Lays eggs inside aphids, larva consumes the aphid from the inside out, forming a 'mummy'. Adult wasp emerges to parasitize more aphids.",
  },
  {
    brandedName: "Chrysopa",
    scientificName: "Chrysoperla Carnea",
    populationPerBottle: 100000,
    pricePerBottle: 225,
    method:
      "Predation. Larvae are voracious predators, using large mandibles to pierce and suck body fluids from soft-bodied pests like aphids, mealybugs, thrips, and spider mites.",
  },
  {
    brandedName: "Spidex",
    scientificName: "Phytoseiulus Persimilis",
    populationPerBottle: 10000,
    pricePerBottle: 300,
    method:
      "Predation. Specialist predator of spider mites, actively hunting and consuming all life stages. They pierce the mites and suck out their contents.",
  },
  {
    brandedName: "Atheta",
    scientificName: "Dalotia Coriaria",
    populationPerBottle: 5000,
    pricePerBottle: 50,
    method:
      "Predation. Generalist predator in both larval and adult stages, actively hunting soil-dwelling pests like fungus gnat larvae, thrips pupae, and shore fly larvae.",
  },
  {
    brandedName: "Thripx",
    scientificName: "Neoseiulus Cucumeris",
    populationPerBottle: 50000,
    pricePerBottle: 30,
    method:
      "Predation. Primarily feeds on young thrips larvae, also consumes pollen and may feed on other small arthropods like spider mites.",
  },
  {
    brandedName: "Thripor",
    scientificName: "Orius Insideous",
    populationPerBottle: 1000,
    pricePerBottle: 60,
    method:
      "Predation. Generalist predator feeding on thrips, aphids, spider mites, and whiteflies. Uses piercing-sucking mouthparts to paralyze prey and suck out liquefied contents.",
  },
  {
    brandedName: "Entonem",
    scientificName: "Steinernema Feltiae",
    populationPerBottle: 50000000,
    pricePerBottle: 30,
    method:
      "Entomopathogenic Nematode (Parasitism). Enters host insects, releases symbiotic bacteria that kill the host. Nematodes feed on bacteria and decaying host tissues, then reproduce.",
  },
  {
    brandedName: "Swirskimite",
    scientificName: "Amblyseius Swirskii",
    populationPerBottle: 50000,
    pricePerBottle: 70,
    method:
      "Predation. Generalist predatory mite feeding on whitefly eggs and larvae, thrips larvae, and spider mites. Can survive on pollen when prey is scarce.",
  },
  {
    brandedName: "Nutemia",
    scientificName: "Carpoglyphus Lactis",
    populationPerBottle: 10000000,
    pricePerBottle: 80,
    method:
      "Competition and Indirect Predation. Used to culture other beneficial mites. Can help suppress pest populations via competition in large numbers.",
  },
  {
    brandedName: "Limonica",
    scientificName: "Amblydromalus Limonicus",
    populationPerBottle: 12500,
    pricePerBottle: 85,
    method:
      "Predation. Generalist predatory mite, robust to temperature fluctuation. Controls thrips, broad mites, and whitefly eggs. Can survive on pollen.",
  },
  {
    brandedName: "Miglyphus",
    scientificName: "Diglyphus",
    populationPerBottle: 500,
    pricePerBottle: 100,
    method:
      "Ectoparasitism and Host-Feeding. Targets leafminer larvae. Paralyzes prey and lays eggs next to it. Adult wasps also feed directly on young leafminer larvae.",
  },
]

interface SelectedAgent {
  scientificName: string
  desiredPestPerMeter: number
  selectedCompartments: string[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57", "#FFC658"]

export default function IPMCalculator() {
  const [selectedAgents, setSelectedAgents] = useState<SelectedAgent[]>([])
  const [openAgents, setOpenAgents] = useState<string[]>([])
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [pestControlAgents, setPestControlAgents] = useState<PestControlAgent[]>(initialPestControlAgents)
  const [compartments, setCompartments] = useState<CompartmentConfig[]>([
    { id: "1", name: "Comp 1", width: 8, length: 50, count: 15 },
  ])
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

  const treatedSquareMeters = compartments.reduce(
    (total, compartment) => total + compartment.width * compartment.length * compartment.count,
    0,
  )

  const toggleAgent = (scientificName: string) => {
    setSelectedAgents((prev) =>
      prev.some((agent) => agent.scientificName === scientificName)
        ? prev.filter((agent) => agent.scientificName !== scientificName)
        : [...prev, { scientificName, desiredPestPerMeter: 0, selectedCompartments: [] }],
    )
  }

  const updateDesiredPestPerMeter = (scientificName: string, value: number) => {
    setSelectedAgents((prev) =>
      prev.map((agent) => (agent.scientificName === scientificName ? { ...agent, desiredPestPerMeter: value } : agent)),
    )
  }

  const updateSelectedCompartments = (scientificName: string, compartmentId: string, isSelected: boolean) => {
    setSelectedAgents((prev) =>
      prev.map((agent) =>
        agent.scientificName === scientificName
          ? {
              ...agent,
              selectedCompartments: isSelected
                ? [...agent.selectedCompartments, compartmentId]
                : agent.selectedCompartments.filter((id) => id !== compartmentId),
            }
          : agent,
      ),
    )
  }

  const calculateBottlesAndCost = (selectedAgent: SelectedAgent) => {
    const agent = pestControlAgents.find((a) => a.scientificName === selectedAgent.scientificName)
    if (!agent) return null

    const selectedCompartmentsArea = compartments
      .filter((comp) => selectedAgent.selectedCompartments.includes(comp.id))
      .reduce((total, comp) => total + comp.width * comp.length * comp.count, 0)

    const totalPestsNeeded = selectedCompartmentsArea * selectedAgent.desiredPestPerMeter
    const bottlesNeeded = Math.ceil(totalPestsNeeded / agent.populationPerBottle)
    const totalCost = bottlesNeeded * agent.pricePerBottle

    return { totalPestsNeeded, bottlesNeeded, totalCost, treatedArea: selectedCompartmentsArea }
  }

  const agentCosts = selectedAgents
    .map((agent) => {
      const calculation = calculateBottlesAndCost(agent)
      return calculation ? { name: agent.scientificName, value: calculation.totalCost } : null
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)

  const totalCost = agentCosts.reduce((sum, { value }) => sum + value, 0)

  const toggleAgentCollapsible = (scientificName: string) => {
    setOpenAgents((prev) =>
      prev.includes(scientificName) ? prev.filter((name) => name !== scientificName) : [...prev, scientificName],
    )
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("IPM Calculator Report", 14, 22)
    doc.setFontSize(12)
    doc.text(`Total treated area: ${treatedSquareMeters.toLocaleString()} m²`, 14, 32)

    // Add compartment configuration details
    doc.setFontSize(14)
    doc.text("Compartment Configurations:", 14, 42)
    let yOffset = 52
    compartments.forEach((compartment, index) => {
      doc.setFontSize(12)
      doc.text(
        `${compartment.name}: ${compartment.width}m x ${compartment.length}m, ${compartment.count} bays`,
        20,
        yOffset,
      )
      yOffset += 10
    })

    const tableData = selectedAgents.map((agent) => {
      const calculation = calculateBottlesAndCost(agent)
      if (!calculation) return []
      return [
        agent.scientificName,
        agent.desiredPestPerMeter,
        calculation.totalPestsNeeded.toLocaleString(),
        calculation.bottlesNeeded.toLocaleString(),
        `$${calculation.totalCost.toFixed(2)}`,
        `${calculation.treatedArea.toLocaleString()} m²`,
      ]
    })

    doc.autoTable({
      head: [["Agent", "Desired Pest/m²", "Total Pests", "Bottles", "Cost", "Treated Area"]],
      body: tableData,
      startY: yOffset + 10,
    })

    doc.setFontSize(14)
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10)

    doc.save("ipm_calculations.pdf")
  }

  const updateAgentPrice = (scientificName: string, newPrice: number) => {
    setPestControlAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.scientificName === scientificName ? { ...agent, pricePerBottle: newPrice } : agent,
      ),
    )
  }

  useEffect(() => {
    const hideWelcomeModal = localStorage.getItem("hideWelcomeModal")
    if (hideWelcomeModal === "true") {
      setShowWelcomeModal(false)
    }

    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem("ipmCalculatorConfig")
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setCompartments(parsedConfig.compartments)
      setPestControlAgents((prevAgents) =>
        prevAgents.map((agent) => ({
          ...agent,
          pricePerBottle: parsedConfig.agentPrices[agent.scientificName] || agent.pricePerBottle,
        })),
      )
      setSelectedAgents(parsedConfig.selectedAgents)
    }

    console.log("Component mounted, attempting to load logo")
  }, [])

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    const config = {
      compartments,
      agentPrices: Object.fromEntries(pestControlAgents.map((agent) => [agent.scientificName, agent.pricePerBottle])),
      selectedAgents,
    }
    localStorage.setItem("ipmCalculatorConfig", JSON.stringify(config))
  }, [compartments, pestControlAgents, selectedAgents])

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-slate-50 to-white min-h-screen relative">
      <WelcomeModal open={showWelcomeModal} onOpenChange={setShowWelcomeModal} />
      <div className="absolute top-4 left-4 flex">
        <SettingsMenu
          pestControlAgents={pestControlAgents.map((agent) => ({
            name: agent.scientificName,
            pricePerBottle: agent.pricePerBottle,
          }))}
          updateAgentPrice={updateAgentPrice}
        />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-slate-800">Biological Pest Calculator</h1>
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.PNG"
          alt="IPM Calculator Logo"
          width={200}
          height={100}
          priority
          onLoad={() => {
            console.log("Logo loaded successfully")
            setLogoLoaded(true)
          }}
          onError={(e) => {
            console.error("Error loading image:", e)
            e.currentTarget.src = "/placeholder.svg?height=100&width=200"
          }}
        />
      </div>

      <div className="mb-4">
        <ConfigurationManager
          currentConfig={{
            compartments,
            agentPrices: Object.fromEntries(
              pestControlAgents.map((agent) => [agent.scientificName, agent.pricePerBottle]),
            ),
          }}
          onLoadConfig={(config) => {
            setCompartments(config.compartments)
            setPestControlAgents((prevAgents) =>
              prevAgents.map((agent) => ({
                ...agent,
                pricePerBottle: config.agentPrices[agent.scientificName] || agent.pricePerBottle,
              })),
            )
          }}
        />
      </div>

      <Card className="mb-8 shadow-lg border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
            <Leaf className="mr-2 text-teal-600" /> Compartment Configuration
          </CardTitle>
          <CardDescription>Configure multiple compartment sizes for your greenhouse</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CompartmentConfigurator compartments={compartments} onChange={setCompartments} />
          <div className="mt-4 text-sm text-slate-600">
            Total Treated Area: {treatedSquareMeters.toLocaleString()} m²
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
              <div key={agent.scientificName} className="border rounded-lg bg-white overflow-hidden border-slate-200">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedAgents.some((a) => a.scientificName === agent.scientificName)}
                        onCheckedChange={() => toggleAgent(agent.scientificName)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-medium text-slate-700">{agent.scientificName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAgentCollapsible(agent.scientificName)}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      {openAgents.includes(agent.scientificName) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {openAgents.includes(agent.scientificName) && (
                  <div className="p-4 bg-slate-50">
                    <Separator className="my-2" />
                    <div className="text-sm text-slate-600 mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Branded Name
                      </span>
                      {agent.brandedName}
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
                          value={
                            selectedAgents.find((a) => a.scientificName === agent.scientificName)
                              ?.desiredPestPerMeter || 0
                          }
                          onChange={(e) => updateDesiredPestPerMeter(agent.scientificName, Number(e.target.value))}
                          disabled={!selectedAgents.some((a) => a.scientificName === agent.scientificName)}
                          className="w-24"
                        />
                      </div>
                      <div className="text-sm text-slate-600">
                        Population/Bottle: {agent.populationPerBottle.toLocaleString()}
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        ${agent.pricePerBottle.toFixed(2)}/bottle
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-slate-700">Select Compartments:</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {compartments.map((compartment) => (
                          <div key={compartment.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${agent.scientificName}-${compartment.id}`}
                              checked={selectedAgents
                                .find((a) => a.scientificName === agent.scientificName)
                                ?.selectedCompartments.includes(compartment.id)}
                              onCheckedChange={(checked) =>
                                updateSelectedCompartments(agent.scientificName, compartment.id, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`${agent.scientificName}-${compartment.id}`}
                              className="text-sm text-slate-600"
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
                <div key={selectedAgent.scientificName} className="p-4 border rounded-lg bg-white border-slate-200">
                  <div className="font-medium mb-2 text-slate-700">{selectedAgent.scientificName}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                    <div className="text-slate-600">Total Pests: {calculation.totalPestsNeeded.toLocaleString()}</div>
                    <div className="text-slate-600">Bottles: {calculation.bottlesNeeded.toLocaleString()}</div>
                    <div className="font-semibold text-slate-700">Cost: ${calculation.totalCost.toFixed(2)}</div>
                    <div className="text-slate-600">Treated Area: {calculation.treatedArea.toLocaleString()} m²</div>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between items-center font-bold text-lg p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700">Total Cost:</span>
              <span className="text-teal-600">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agentCosts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {agentCosts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bottles Needed</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={selectedAgents.map((agent) => {
                    const calculation = calculateBottlesAndCost(agent)
                    return {
                      name: agent.scientificName,
                      bottles: calculation ? calculation.bottlesNeeded : 0,
                    }
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bottles" fill="#8884d8">
                    {selectedAgents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 text-sm text-slate-600 flex flex-col sm:flex-row justify-between items-center p-4">
          <p className="mb-4 sm:mb-0">
            Calculations are based on desired pest density per square meter. Adjust as needed based on pest pressure and
            environmental conditions.
          </p>
          <Button onClick={exportToPDF} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

