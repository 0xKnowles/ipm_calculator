"use client"

import * as React from "react"
import Slider from "@mui/material/Slider"

import { cn } from "@/lib/utils"

const MySlider = React.forwardRef<React.ElementRef<typeof Slider>, React.ComponentPropsWithoutRef<typeof Slider>>(
  ({ className, ...props }, ref) => (
    <Slider
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    />
  ),
)
MySlider.displayName = Slider.displayName

export { MySlider }

