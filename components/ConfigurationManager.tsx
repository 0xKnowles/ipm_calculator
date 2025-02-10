import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Save, Upload } from "lucide-react"
import type { CompartmentConfig } from "@/components/CompartmentConfigurator"
import type { PestControlAgent, SelectedAgent } from "@/types/biocontrol"
import type React from "react" // Added import for React

interface Configuration {
  compartments: CompartmentConfig[]
  pestControlAgents: PestControlAgent[]
  selectedAgents: SelectedAgent[]
}

interface ConfigurationManagerProps {
  currentConfig: Configuration
  onLoadConfig: (config: Configuration) => void
}

export function ConfigurationManager({ currentConfig, onLoadConfig }: ConfigurationManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveConfiguration = () => {
    const configString = JSON.stringify(currentConfig)
    const blob = new Blob([configString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ipm_configuration.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const loadConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string)
          onLoadConfig(config)
        } catch (error) {
          console.error("Error parsing configuration file:", error)
          alert("Invalid configuration file")
        }
      }
      reader.readAsText(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={saveConfiguration}>
        <Save className="mr-2 h-4 w-4" />
        Save Config
      </Button>
      <Button variant="outline" onClick={triggerFileInput}>
        <Upload className="mr-2 h-4 w-4" />
        Load Config
      </Button>
      <input type="file" ref={fileInputRef} onChange={loadConfiguration} accept=".json" style={{ display: "none" }} />
    </div>
  )
}

