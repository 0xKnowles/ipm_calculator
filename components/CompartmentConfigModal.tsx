"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CompartmentConfigurator, type CompartmentConfig } from "@/components/CompartmentConfigurator"
import { Map } from "lucide-react"

interface CompartmentConfigModalProps {
  compartments: CompartmentConfig[]
  onCompartmentsChange: (compartments: CompartmentConfig[]) => void
}

export function CompartmentConfigModal({ compartments, onCompartmentsChange }: CompartmentConfigModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mr-2">
          <Map className="h-4 w-4" />
          <span className="sr-only">Configure Compartments</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Compartment Configuration</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CompartmentConfigurator compartments={compartments} onChange={onCompartmentsChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

