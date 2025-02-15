"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Bug, DollarSign, AlertTriangle, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "jspdf-autotable"
import { SettingsMenu } from "@/components/SettingsMenu"
import type { CompartmentConfig } from "@/components/CompartmentConfigurator"
import { ConfigurationManager } from "@/components/ConfigurationManager"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { WelcomeModal } from "@/components/WelcomeModal"
import { useTheme } from "next-themes"
import { GreenhouseVisualizer } from "@/components/GreenhouseVisualizer"
import { PDFCustomizer, type PDFOptions } from "@/components/PDFCustomizer"
import html2canvas from "html2canvas"
import { ProgramComparison } from "@/components/ProgramComparison"
import { BioAgentManager } from "@/components/BioAgentManager"
import { CompartmentConfigModal } from "@/components/CompartmentConfigModal"

interface PestControlAgent {
  brandedNames: { name: string }[]
  scientificName: string
  populationPerUnit: number
  pricePerUnit: number
  method: string
}

const initialPestControlAgents: PestControlAgent[] = [
  {
    brandedNames: [{ name: "Aphipar" }, { name: "Aphidius-System" }],
    scientificName: "Aphidius Colemani",
    populationPerUnit: 1000,
    pricePerUnit: 45,
    method:
      "Endoparasitism. Lays eggs inside aphids, larva consumes the aphid from the inside out, forming a 'mummy'. Adult wasp emerges to parasitize more aphids.",
  },
  {
    brandedNames: [{ name: "Chrysopa" }, { name: "Chrysopa-System" }],
    scientificName: "Chrysoperla Carnea",
    populationPerUnit: 100000,
    pricePerUnit: 225,
    method:
      "Predation. Larvae are voracious predators, using large mandibles to pierce and suck body fluids from soft-bodied pests like aphids, mealybugs, thrips, and spider mites.",
  },
  {
    brandedNames: [{ name: "Spidex" }, { name: "Phytoseiulus-System" }],
    scientificName: "Phytoseiulus Persimilis",
    populationPerUnit: 10000,
    pricePerUnit: 300,
    method:
      "Predation. Specialist predator of spider mites, actively hunting and consuming all life stages. They pierce the mites and suck out their contents.",
  },
  {
    brandedNames: [{ name: "Atheta" }, { name: "Atheta-System" }],
    scientificName: "Dalotia Coriaria",
    populationPerUnit: 5000,
    pricePerUnit: 50,
    method:
      "Predation. Generalist predator in both larval and adult stages, actively hunting soil-dwelling pests like fungus gnat larvae, thrips pupae, and shore fly larvae.",
  },
  {
    brandedNames: [{ name: "Thripx" }, { name: "ABS-System" }],
    scientificName: "Neoseiulus Cucumeris",
    populationPerUnit: 50000,
    pricePerUnit: 30,
    method:
      "Predation. Primarily feeds on young thrips larvae, also consumes pollen and may feed on other small arthropods like spider mites.",
  },
  {
    brandedNames: [{ name: "Thripor" }, { name: "Orius-System" }],
    scientificName: "Orius Insideous",
    populationPerUnit: 1000,
    pricePerUnit: 60,
    method:
      "Predation. Generalist predator feeding on thrips, aphids, spider mites, and whiteflies. Uses piercing-sucking mouthparts to paralyze prey and suck out liquefied contents.",
  },
  {
    brandedNames: [{ name: "Entonem" }, { name: "NemaFence® Felti" }],
    scientificName: "Steinernema Feltiae",
    populationPerUnit: 50000000,
    pricePerUnit: 30,
    method:
      "Entomopathogenic Nematode (Parasitism). Enters host insects, releases symbiotic bacteria that kill the host. Nematodes feed on bacteria and decaying host tissues, then reproduce.",
  },
  {
    brandedNames: [{ name: "Swirskimite" }, { name: "Amblyseius-System" }],
    scientificName: "Amblyseius Swirskii",
    populationPerUnit: 50000,
    pricePerUnit: 70,
    method:
      "Predation. Generalist predatory mite feeding on whitefly eggs and larvae, thrips larvae, and spider mites. Can survive on pollen when prey is scarce.",
  },
  {
    brandedNames: [{ name: "Nutemia" }],
    scientificName: "Carpoglyphus Lactis",
    populationPerUnit: 10000000,
    pricePerUnit: 80,
    method:
      "Competition and Indirect Predation. Used to culture other beneficial mites. Can help suppress pest populations via competition in large numbers.",
  },
  {
    brandedNames: [{ name: "Limonica" }],
    scientificName: "Amblydromalus Limonicus",
    populationPerUnit: 12500,
    pricePerUnit: 85,
    method:
      "Predation. Generalist predatory mite, robust to temperature fluctuation. Controls thrips, broad mites, and whitefly eggs. Can survive on pollen.",
  },
  {
    brandedNames: [{ name: "Miglyphus" }, { name: "Diglyphus-System" }],
    scientificName: "Diglyphus",
    populationPerUnit: 500,
    pricePerUnit: 100,
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
  const [isControlsExpanded, setIsControlsExpanded] = useState(false)
  const { theme, setTheme } = useTheme()
  const [programOrder, setProgramOrder] = useState<{
    week: number
    weeklyProgramCost: number
    agents: { scientificName: string; quantity: number }[]
  }>({
    week: 1,
    weeklyProgramCost: 0,
    agents: [],
  })

  const handleSaveProgramOrder = (order: {
    week: number
    weeklyProgramCost: number
    agents: { scientificName: string; quantity: number }[]
  }) => {
    setProgramOrder(order)
  }

  useEffect(() => {
    const savedConfig = localStorage.getItem("ipmCalculatorConfig")
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setCompartments(parsedConfig.compartments || [])
      setPestControlAgents(parsedConfig.pestControlAgents || [])
      setSelectedAgents(parsedConfig.selectedAgents || [])
    }
  }, [])

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

  const calculateUnitsAndCost = (selectedAgent: SelectedAgent) => {
    const agent = pestControlAgents.find((a) => a.scientificName === selectedAgent.scientificName)
    if (!agent) return null

    const selectedCompartmentsArea = compartments
      .filter((comp) => selectedAgent.selectedCompartments.includes(comp.id))
      .reduce((total, comp) => total + comp.width * comp.length * comp.count, 0)

    const totalPestsNeeded = selectedCompartmentsArea * selectedAgent.desiredPestPerMeter
    const unitsNeeded = Math.ceil(totalPestsNeeded / agent.populationPerUnit)

    const programAgent = programOrder.agents.find((a) => a.scientificName === selectedAgent.scientificName)
    const programUnits = programAgent ? programAgent.quantity : 0
    const extraUnits = Math.max(unitsNeeded - programUnits, 0)
    const totalCost = extraUnits * agent.pricePerUnit

    return { totalPestsNeeded, unitsNeeded, programUnits, extraUnits, totalCost, treatedArea: selectedCompartmentsArea }
  }

  const agentCosts = selectedAgents
    .map((agent) => {
      const calculation = calculateUnitsAndCost(agent)
      return calculation ? { name: agent.scientificName, value: calculation.totalCost } : null
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)

  const totalExtraCost = agentCosts.reduce((sum, { value }) => sum + value, 0)
  const totalCost = programOrder.weeklyProgramCost + totalExtraCost

  const toggleAgentCollapsible = (scientificName: string) => {
    setOpenAgents((prev) =>
      prev.includes(scientificName) ? prev.filter((name) => name !== scientificName) : [...prev, scientificName],
    )
  }

  const exportToPDF = async (options: PDFOptions) => {
    const doc = new jsPDF(options.orientation, "mm", "a4")
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 14
    let yPos = margin

    // Helper function for centered text
    const addCenteredText = (text: string, y: number, size = 12) => {
      doc.setFontSize(size)
      const textWidth = (doc.getStringUnitWidth(text) * size) / doc.internal.scaleFactor
      const x = (pageWidth - textWidth) / 2
      doc.text(text, x, y)
      return doc.getTextDimensions(text).h + 5
    }

    // Helper function for section headers
    const addSectionHeader = (text: string, y: number) => {
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, y - 6, pageWidth - 2 * margin, 8, "F")
      doc.setFont(undefined, "bold")
      doc.setFontSize(12)
      doc.text(text, margin, y)
      doc.setFont(undefined, "normal")
      return 12
    }

    // Title and Date
    yPos += addCenteredText(options.title, yPos, 24)
    yPos += 5
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPos)
    yPos += 10

    // Add notes if provided
    if (options.notes) {
      yPos += addSectionHeader("Notes", yPos)
      yPos += 8
      doc.setFontSize(10)
      const splitNotes = doc.splitTextToSize(options.notes, pageWidth - 2 * margin)
      doc.text(splitNotes, margin, yPos)
      yPos += splitNotes.length * 5 + 10
    }

    // Summary Statistics
    yPos += addSectionHeader("Summary Statistics", yPos)
    yPos += 8
    doc.setFontSize(11)
    doc.text(
      [
        `Total Treated Area: ${treatedSquareMeters.toLocaleString()} m²`,
        `Number of Compartments: ${compartments.length}`,
        `Selected Agents: ${selectedAgents.length}`,
        `Weekly Program Cost: $${programOrder.weeklyProgramCost.toFixed(2)}`,
        `Extra Cost: $${totalExtraCost.toFixed(2)}`,
        `Total Cost: $${totalCost.toFixed(2)}`,
      ],
      margin,
      yPos,
    )
    yPos += 35

    // Compartment Configurations
    if (options.includeCompartments) {
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = margin
      }
      yPos += addSectionHeader("Compartment Configurations", yPos)
      yPos += 5
      autoTable(doc, {
        startY: yPos,
        head: [["Compartment", "Width (m)", "Length (m)", "Bays", "Total Area (m²)"]],
        body: compartments.map((comp) => [
          comp.name,
          comp.width.toString(),
          comp.length.toString(),
          comp.count.toString(),
          (comp.width * comp.length * comp.count).toLocaleString(),
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 150, 136] },
      })
      yPos = doc.lastAutoTable.finalY + 10
    }

    // Agent Details
    if (options.includeAgentDetails) {
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = margin
      }
      yPos += addSectionHeader("Biocontrol Agent Details", yPos)
      yPos += 5

      for (const selectedAgent of selectedAgents) {
        const agent = pestControlAgents.find((a) => a.scientificName === selectedAgent.scientificName)
        const calculation = calculateUnitsAndCost(selectedAgent)

        if (!agent || !calculation) continue

        if (yPos > pageHeight - 80) {
          doc.addPage()
          yPos = margin
        }

        doc.setFont(undefined, "bold")
        doc.setFontSize(11)
        doc.text(agent.scientificName, margin, yPos)
        yPos += 5

        doc.setFont(undefined, "normal")
        doc.setFontSize(10)
        const details = [
          `Branded Names: ${agent.brandedNames.map((bn) => bn.name).join(", ")}`,
          `Price per Unit: $${agent.pricePerUnit.toFixed(2)}`,
          `Population per Unit: ${agent.populationPerUnit.toLocaleString()}`,
          `Desired Pest Density: ${selectedAgent.desiredPestPerMeter}/m²`,
          `Selected Compartments: ${selectedAgent.selectedCompartments
            .map((id) => compartments.find((c) => c.id === id)?.name)
            .filter(Boolean)
            .join(", ")}`,
          "",
          "Calculations:",
          `• Total Area: ${calculation.treatedArea.toLocaleString()} m²`,
          `• Total Pests Needed: ${calculation.totalPestsNeeded.toLocaleString()}`,
          `• Units Required: ${calculation.unitsNeeded.toLocaleString()}`,
          `• Program Units: ${calculation.programUnits.toLocaleString()}`,
          `• Extra Units: ${calculation.extraUnits.toLocaleString()}`,
          `• Extra Cost: $${calculation.totalCost.toFixed(2)}`,
        ]

        doc.setTextColor(60, 60, 60)
        details.forEach((detail) => {
          if (yPos > pageHeight - 20) {
            doc.addPage()
            yPos = margin
          }
          doc.text(detail, margin + 5, yPos)
          yPos += 5
        })
        yPos += 5
      }
    }

    // Cost Breakdown
    if (options.includeCostBreakdown) {
      if (yPos > pageHeight - 100) {
        doc.addPage()
        yPos = margin
      }
      yPos += addSectionHeader("Cost Breakdown", yPos)
      yPos += 5
      autoTable(doc, {
        startY: yPos,
        head: [["Agent", "Units Needed", "Program Units", "Extra Units", "Extra Cost"]],
        body: selectedAgents
          .map((agent) => {
            const calculation = calculateUnitsAndCost(agent)
            if (!calculation) return []
            return [
              agent.scientificName,
              calculation.unitsNeeded.toString(),
              calculation.programUnits.toString(),
              calculation.extraUnits.toString(),
              `$${calculation.totalCost.toFixed(2)}`,
            ]
          })
          .filter((row) => row.length > 0),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 150, 136] },
      })
      yPos = doc.lastAutoTable.finalY + 10

      doc.setFontSize(12)
      doc.setFont(undefined, "bold")
      doc.text(`Weekly Program Cost: $${programOrder.weeklyProgramCost.toFixed(2)}`, margin, yPos)
      yPos += 6
      doc.text(`Extra Cost: $${totalExtraCost.toFixed(2)}`, margin, yPos)
      yPos += 6
      doc.text(`Total Cost: $${totalCost.toFixed(2)}`, margin, yPos)
    }

    // Visual Layout
    if (options.includeVisualLayout) {
      const visualizerElement = document.querySelector(".greenhouse-visualizer svg")
      if (visualizerElement) {
        if (yPos > pageHeight - 100) {
          doc.addPage()
          yPos = margin
        }
        yPos += addSectionHeader("Visual Distribution", yPos)
        yPos += 10

        const canvas = await html2canvas(visualizerElement as HTMLElement)
        const imgData = canvas.toDataURL("image/png")
        const imgWidth = pageWidth - 2 * margin
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        doc.addImage(imgData, "PNG", margin, yPos, imgWidth, imgHeight)
        yPos += imgHeight + 10
      }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - margin, { align: "right" })
      doc.text("Generated by IPM Calculator", margin, pageHeight - margin, { align: "left" })
    }

    // Save the PDF
    doc.save("ipm_calculations.pdf")
  }

  const updateAgentSettings = (scientificName: string, updatedAgent: Partial<PestControlAgent>) => {
    setPestControlAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.scientificName === scientificName ? { ...agent, ...updatedAgent } : agent)),
    )
  }

  const addNewAgent = (newAgent: PestControlAgent) => {
    setPestControlAgents((prevAgents) => [
      ...prevAgents,
      {
        ...newAgent,
        brandedNames: newAgent.brandedNames.length > 0 ? newAgent.brandedNames : [{ name: "" }],
        method: newAgent.method || "",
      },
    ])
    setOpenAgents((prev) => [...prev, newAgent.scientificName])
  }

  const deleteAgent = (scientificName: string) => {
    setPestControlAgents((prevAgents) => prevAgents.filter((agent) => agent.scientificName !== scientificName))
    setSelectedAgents((prevSelected) => prevSelected.filter((agent) => agent.scientificName !== scientificName))
  }

  useEffect(() => {
    const hideWelcomeModal = localStorage.getItem("hideWelcomeModal")
    if (hideWelcomeModal === "true") {
      setShowWelcomeModal(false)
    }
    console.log("Component mounted, attempting to load logo")
  }, [])

  useEffect(() => {
    const configToSave = {
      compartments,
      pestControlAgents,
      selectedAgents,
    }
    localStorage.setItem("ipmCalculatorConfig", JSON.stringify(configToSave))
  }, [compartments, pestControlAgents, selectedAgents])

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen relative text-slate-900 dark:text-slate-100">
      <WelcomeModal open={showWelcomeModal} onOpenChange={setShowWelcomeModal} />
      <div className="fixed top-4 left-0 z-[100] flex items-start">
        <button
          onClick={() => setIsControlsExpanded(!isControlsExpanded)}
          className="fixed z-50 left-0 top-4 h-[88px] w-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-r-md flex items-center justify-center transition-colors shadow-md"
          aria-label={isControlsExpanded ? "Collapse controls" : "Expand controls"}
        >
          <div className="text-slate-600 dark:text-slate-400">{isControlsExpanded ? "◀" : "▶"}</div>
        </button>
        <div
          className={`
            absolute left-0 flex flex-col gap-2 transition-transform duration-200 overflow-visible
            ${isControlsExpanded ? "translate-x-5" : "-translate-x-full opacity-0 pointer-events-none"}
          `}
          style={{ width: "40px" }}
        >
          <div className="pl-2">
            <SettingsMenu
              pestControlAgents={pestControlAgents}
              updateAgentSettings={updateAgentSettings}
              addNewAgent={addNewAgent}
              deleteAgent={deleteAgent}
            />
          </div>
          <div className="pl-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <div className="pl-2">
            <ProgramComparison
              pestControlAgents={pestControlAgents}
              calculatedOrder={selectedAgents.map((agent) => {
                const calculation = calculateUnitsAndCost(agent)
                return {
                  scientificName: agent.scientificName,
                  unitsNeeded: calculation ? calculation.unitsNeeded : 0,
                }
              })}
              onSaveProgramOrder={handleSaveProgramOrder}
            />
          </div>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center text-slate-800 dark:text-slate-100">
        Biological Pest Calculator
      </h1>
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.PNG"
          alt="IPM Calculator Logo"
          width={55}
          height={35}
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
      <Alert className="mb-6 bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-100">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 dark:text-amber-100 font-semibold">Reminder</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-200">
          Please ensure you have set up your greenhouse compartments, added your biological control agents, and modified
          the pricing to match your local suppliers before proceeding with calculations.
        </AlertDescription>
      </Alert>
      <div className="mb-4 flex items-center">
        <CompartmentConfigModal compartments={compartments} onCompartmentsChange={setCompartments} />
        <ConfigurationManager
          currentConfig={{
            compartments,
            pestControlAgents,
            selectedAgents,
          }}
          onLoadConfig={(config) => {
            setCompartments(config.compartments)
            setPestControlAgents(config.pestControlAgents)
            setSelectedAgents(config.selectedAgents)
          }}
        />
      </div>
      {/* Biocontrol Management */}
      <Card className="mb-4 sm:mb-8 shadow-lg border-slate-200 dark:border-slate-700 dark:bg-gray-800">
        <CardHeader className="bg-slate-100 dark:bg-gray-700">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 dark:text-slate-100 flex items-center">
            <Bug className="mr-2 text-teal-600" /> Biocontrol Management
          </CardTitle>
          <CardDescription>Select biocontrol agents and configure their application</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <BioAgentManager
            agents={pestControlAgents}
            selectedAgents={selectedAgents}
            compartments={compartments}
            onToggleAgent={toggleAgent}
            onUpdateDesiredPest={updateDesiredPestPerMeter}
            onUpdateCompartments={updateSelectedCompartments}
          />
        </CardContent>
      </Card>
      <GreenhouseVisualizer
        compartments={compartments}
        selectedAgents={selectedAgents}
        className="greenhouse-visualizer"
      />
      <Card className="mb-4 sm:mb-8 shadow-lg border-slate-200 dark:border-slate-700 dark:bg-gray-800">
        <CardHeader className="bg-slate-100 dark:bg-gray-700">
          <CardTitle className="text-xl sm:text-2xl text-slate-800 dark:text-slate-100 flex items-center">
            <DollarSign className="mr-2 text-teal-600" /> Order Calculations
          </CardTitle>
          <CardDescription>Total treated area: {treatedSquareMeters.toLocaleString()} m²</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedAgents.map((selectedAgent) => {
              const calculation = calculateUnitsAndCost(selectedAgent)
              if (!calculation) return null

              return (
                <div key={selectedAgent.scientificName} className="p-4 border rounded-lg bg-white border-slate-200">
                  <div className="font-medium mb-2 text-slate-700">{selectedAgent.scientificName}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                    <div className="text-slate-600">Total Pests: {calculation.totalPestsNeeded.toLocaleString()}</div>
                    <div className="text-slate-600">Units Needed: {calculation.unitsNeeded.toLocaleString()}</div>
                    <div className="text-slate-600">Program Units: {calculation.programUnits.toLocaleString()}</div>
                    <div className="text-slate-600">Extra Units: {calculation.extraUnits.toLocaleString()}</div>
                    <div className="font-semibold text-slate-700">Extra Cost: ${calculation.totalCost.toFixed(2)}</div>
                    <div className="text-slate-600">Treated Area: {calculation.treatedArea.toLocaleString()} m²</div>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between items-center font-bold text-lg p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
              <span className="text-slate-700">Weekly Program Cost:</span>
              <span className="text-teal-600">${programOrder.weeklyProgramCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
              <span className="text-slate-700">Extra Cost:</span>
              <span className="text-teal-600">${totalExtraCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
              <span className="text-slate-700">Total Cost:</span>
              <span className="text-teal-600">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
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
              <h3 className="text-lg font-semibold mb-4">Units Needed</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={selectedAgents.map((agent) => {
                    const calculation = calculateUnitsAndCost(agent)
                    return {
                      name: agent.scientificName,
                      units: calculation ? calculation.unitsNeeded : 0,
                    }
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#8884d8">
                    {selectedAgents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 text-sm text-slate-600 flex flex-col sm:flexrow justify-between items-center p-4">
          <p className="mb-4 sm:mb-0">
            Calculations are based on desired pest density per square meter. Adjust as neededCalculations are based on
            desired pest density per square meter. Adjust desired pest density per square meter. Adjust as needed based
            on pest pressure and environmental conditions.
          </p>
          <PDFCustomizer onExport={exportToPDF} />
        </CardFooter>
      </Card>
    </div>
  )
}

