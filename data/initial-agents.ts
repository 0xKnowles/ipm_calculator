import type { PestControlAgent } from "../types/biocontrol"

export const initialPestControlAgents: PestControlAgent[] = [
  {
    scientificName: "Aphidius Colemani",
    brandedNames: [{ name: "Aphipar" }, { name: "Aphidius-System" }],
    populationPerBottle: 1000,
    pricePerBottle: 45,
    method:
      "Endoparasitism. Lays eggs inside aphids, larva consumes the aphid from the inside out, forming a 'mummy'. Adult wasp emerges to parasitize more aphids.",
  },
  {
    scientificName: "Chrysoperla Carnea",
    brandedNames: [{ name: "Chrysopa" }, { name: "Chrysopa-System" }],
    populationPerBottle: 100000,
    pricePerBottle: 225,
    method:
      "Predation. Larvae are voracious predators, using large mandibles to pierce and suck body fluids from soft-bodied pests like aphids, mealybugs, thrips, and spider mites.",
  },
  {
    scientificName: "Phytoseiulus Persimilis",
    brandedNames: [{ name: "Spidex" }, { name: "Phytoseiulus-System" }],
    populationPerBottle: 10000,
    pricePerBottle: 300,
    method:
      "Predation. Specialist predator of spider mites, actively hunting and consuming all life stages. They pierce the mites and suck out their contents.",
  },
  {
    scientificName: "Dalotia Coriaria",
    brandedNames: [{ name: "Atheta" }, { name: "Atheta-System" }],
    populationPerBottle: 5000,
    pricePerBottle: 50,
    method:
      "Predation. Generalist predator in both larval and adult stages, actively hunting soil-dwelling pests like fungus gnat larvae, thrips pupae, and shore fly larvae.",
  },
  {
    scientificName: "Neoseiulus Cucumeris",
    brandedNames: [{ name: "Thripx" }, { name: "ABS-System" }],
    populationPerBottle: 50000,
    pricePerBottle: 30,
    method:
      "Predation. Primarily feeds on young thrips larvae, also consumes pollen and may feed on other small arthropods like spider mites.",
  },
  {
    scientificName: "Orius Insideous",
    brandedNames: [{ name: "Thripor" }, { name: "Orius-System" }],
    populationPerBottle: 1000,
    pricePerBottle: 60,
    method:
      "Predation. Generalist predator feeding on thrips, aphids, spider mites, and whiteflies. Uses piercing-sucking mouthparts to paralyze prey and suck out liquefied contents.",
  },
  {
    scientificName: "Steinernema Feltiae",
    brandedNames: [{ name: "Entonem" }, { name: "NemaFence® Felti" }],
    populationPerBottle: 50000000,
    pricePerBottle: 30,
    method:
      "Entomopathogenic Nematode (Parasitism). Enters host insects, releases symbiotic bacteria that kill the host. Nematodes feed on bacteria and decaying host tissues, then reproduce.",
  },
  {
    scientificName: "Amblyseius Swirskii",
    brandedNames: [{ name: "Swirskimite" }, { name: "Amblyseius-System" }],
    populationPerBottle: 50000,
    pricePerBottle: 70,
    method:
      "Predation. Generalist predatory mite feeding on whitefly eggs and larvae, thrips larvae, and spider mites. Can survive on pollen when prey is scarce.",
  },
  {
    scientificName: "Diglyphus Isaea",
    brandedNames: [{ name: "Miglyphus" }, { name: "Diglyphus-System" }],
    populationPerBottle: 500,
    pricePerBottle: 100,
    method:
      "Ectoparasitism and Host-Feeding. Targets leafminer larvae. Paralyzes prey and lays eggs next to it. Adult wasps also feed directly on young leafminer larvae.",
  },
]

