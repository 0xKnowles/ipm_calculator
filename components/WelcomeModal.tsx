"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Bug, Calculator, FileDown, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideWelcomeModal", "true")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <ScrollArea className="max-h-[calc(90vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Bug className="h-6 w-6 text-teal-600" />
                Welcome to the IPM Calculator
              </DialogTitle>
              <DialogDescription>
                Your comprehensive tool for biological pest control planning and management
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">About the Application</h3>
                <p className="text-slate-600 mb-4">
                  The IPM Calculator helps agricultural professionals and greenhouse managers plan and optimize their
                  biological pest control strategy. Calculate precise quantities of beneficial insects needed for your
                  growing space and track associated costs.
                </p>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-teal-600" />
                      Key Features
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                      <li>Configure multiple greenhouse compartments</li>
                      <li>Select from various biological control agents</li>
                      <li>Calculate required quantities based on area</li>
                      <li>Track costs and generate detailed reports</li>
                      <li>Customize agent prices for accurate budgeting</li>
                      <li>Save and load your configurations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-teal-600" />
                      Getting Started
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                      <li>Set up your greenhouse compartment dimensions</li>
                      <li>Adjust biocontrol agent prices if needed</li>
                      <li>Select the agents you want to use</li>
                      <li>Specify desired pest density per square meter</li>
                      <li>Choose which compartments to treat</li>
                      <li>Review calculations and export reports</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Important: Your Data is Saved Locally</h4>
                    <p className="text-sm text-amber-700">
                      Your configuration is automatically saved in your browser's local storage. This means:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-amber-700">
                      <li>Your settings will be remembered between visits</li>
                      <li>You don't need to manually load your configuration each time</li>
                      <li>Clearing your browser data will erase this local save</li>
                    </ul>
                    <p className="text-sm text-amber-700 mt-2">
                      For backup purposes, you can still use the
                      <FileDown className="h-4 w-4 inline mx-1" />
                      Save Config button to download your settings as a file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between border-t p-4 mt-auto">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dontShow" className="text-sm text-slate-600">
              Don&apos;t show this again
            </Label>
          </div>
          <Button onClick={handleClose} className="ml-auto">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

