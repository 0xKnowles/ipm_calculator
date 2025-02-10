import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileDown, Settings } from "lucide-react"

export interface PDFOptions {
  title: string
  orientation: "portrait" | "landscape"
  includeCompartments: boolean
  includeAgentDetails: boolean
  includeCostBreakdown: boolean
  includeVisualLayout: boolean
  notes: string
}

interface PDFCustomizerProps {
  onExport: (options: PDFOptions) => void
  defaultTitle?: string
}

export function PDFCustomizer({ onExport, defaultTitle = "IPM Calculator Report" }: PDFCustomizerProps) {
  const [options, setOptions] = useState<PDFOptions>({
    title: defaultTitle,
    orientation: "portrait",
    includeCompartments: true,
    includeAgentDetails: true,
    includeCostBreakdown: true,
    includeVisualLayout: true,
    notes: "",
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white">
          <FileDown className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize PDF Export
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={options.title}
              onChange={(e) => setOptions((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter report title"
            />
          </div>

          <div className="grid gap-2">
            <Label>Page Orientation</Label>
            <RadioGroup
              value={options.orientation}
              onValueChange={(value: "portrait" | "landscape") =>
                setOptions((prev) => ({ ...prev, orientation: value }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" />
                <Label htmlFor="portrait">Portrait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" />
                <Label htmlFor="landscape">Landscape</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Include Sections</Label>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCompartments"
                  checked={options.includeCompartments}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, includeCompartments: checked as boolean }))
                  }
                />
                <Label htmlFor="includeCompartments">Compartment Configurations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAgentDetails"
                  checked={options.includeAgentDetails}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, includeAgentDetails: checked as boolean }))
                  }
                />
                <Label htmlFor="includeAgentDetails">Agent Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCostBreakdown"
                  checked={options.includeCostBreakdown}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, includeCostBreakdown: checked as boolean }))
                  }
                />
                <Label htmlFor="includeCostBreakdown">Cost Breakdown</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeVisualLayout"
                  checked={options.includeVisualLayout}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, includeVisualLayout: checked as boolean }))
                  }
                />
                <Label htmlFor="includeVisualLayout">Visual Layout</Label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={options.notes}
              onChange={(e) => setOptions((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes to include in the report..."
              className="h-20"
            />
          </div>

          <Button onClick={() => onExport(options)} className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2">
            Generate PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

