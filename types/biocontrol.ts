export interface BrandedName {
  name: string
  supplier?: string
}

export interface PestControlAgent {
  scientificName: string
  brandedNames: BrandedName[]
  populationPerUnit: number
  pricePerUnit: number
  method?: string
}

export interface SelectedAgent {
  scientificName: string
  desiredPestPerMeter: number
  selectedCompartments: string[]
}

