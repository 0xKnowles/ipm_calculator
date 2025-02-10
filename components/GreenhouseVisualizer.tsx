import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompartmentConfig } from "@/components/CompartmentConfigurator"
import type { SelectedAgent } from "@/types/biocontrol"

interface GreenhouseVisualizerProps {
  compartments: CompartmentConfig[]
  selectedAgents: SelectedAgent[]
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F9ED69",
  "#F08A5D",
  "#B83B5E",
  "#6A2C70",
  "#5D001E",
]

export function GreenhouseVisualizer({ compartments, selectedAgents }: GreenhouseVisualizerProps) {
  const totalWidth = compartments.reduce((sum, comp) => sum + comp.width, 0)
  const maxLength = Math.max(...compartments.map((comp) => comp.length))
  const scaleFactor = 400 / Math.max(totalWidth, maxLength)
  const DOT_RADIUS = 6
  const DOT_SPACING = DOT_RADIUS * 3
  const TEXT_PADDING = 60 // Increased padding for text

  let currentX = 0

  return (
    <Card className="w-full mb-4 sm:mb-8 shadow-lg border-slate-200 dark:border-slate-700 dark:bg-gray-800">
      <CardHeader className="bg-slate-100 dark:bg-gray-700">
        <CardTitle className="text-xl sm:text-2xl text-slate-800 dark:text-slate-100">Visual Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full overflow-x-auto">
          <svg width={totalWidth * scaleFactor} height={maxLength * scaleFactor + TEXT_PADDING} className="mx-auto">
            <defs>
              <filter id="dropShadow" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {compartments.map((compartment, index) => {
              const compartmentX = currentX
              currentX += compartment.width * scaleFactor

              const agentsInCompartment = selectedAgents.filter((agent) =>
                agent.selectedCompartments.includes(compartment.id),
              )

              // Calculate starting Y position for dots to be centered vertically
              const totalDotsHeight = agentsInCompartment.length * DOT_SPACING
              const startY = (compartment.length * scaleFactor - totalDotsHeight) / 2

              return (
                <g key={compartment.id}>
                  {/* Compartment rectangle */}
                  <rect
                    x={compartmentX}
                    y={0}
                    width={compartment.width * scaleFactor}
                    height={compartment.length * scaleFactor}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-slate-400 dark:text-slate-600"
                    filter="url(#dropShadow)"
                  />

                  {/* Compartment name with background for better readability */}
                  <g
                    transform={`translate(${compartmentX + (compartment.width * scaleFactor) / 2}, ${compartment.length * scaleFactor + 20})`}
                  >
                    <text
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {compartment.name}
                    </text>
                  </g>

                  {/* Dimensions */}
                  <text
                    x={compartmentX + (compartment.width * scaleFactor) / 2}
                    y={compartment.length * scaleFactor + 40}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-xs text-slate-500 dark:text-slate-400"
                  >
                    {`${compartment.width}m x ${compartment.length}m`}
                  </text>

                  {/* Vertical arrangement of agent indicators */}
                  {agentsInCompartment.map((agent, agentIndex) => (
                    <circle
                      key={agent.scientificName}
                      cx={compartmentX + compartment.width * scaleFactor - DOT_SPACING}
                      cy={startY + agentIndex * DOT_SPACING}
                      r={DOT_RADIUS}
                      fill={
                        COLORS[
                          selectedAgents.findIndex((a) => a.scientificName === agent.scientificName) % COLORS.length
                        ]
                      }
                      filter="url(#dropShadow)"
                    />
                  ))}
                </g>
              )
            })}
          </svg>
        </div>
        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {selectedAgents.map((agent, index) => (
            <div
              key={agent.scientificName}
              className="flex items-center bg-white/50 dark:bg-gray-800/50 rounded-full px-3 py-1"
            >
              <div
                className="w-4 h-4 rounded-full mr-2 shadow-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm text-slate-700 dark:text-slate-300">{agent.scientificName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

