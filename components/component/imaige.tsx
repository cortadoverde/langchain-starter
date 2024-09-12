'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"

const filters = [
  { name: 'bri', title: 'Brightness', min: -100, max: 100, step: 1 },
  { name: 'con', title: 'Contrast', min: -100, max: 100, step: 1 },
  { name: 'exp', title: 'Exposure', min: -100, max: 100, step: 1 },
  { name: 'gam', title: 'Gamma', min: -100, max: 100, step: 1 },
  { name: 'high', title: 'Highlight', min: -100, max: 0, step: 1 },
  { name: 'hue', title: 'Hue shift', min: 0, max: 360, step: 1 },
  { name: 'invert', title: 'Invert', min: 0, max: 1, step: 1 },
  { name: 'sat', title: 'Saturation', min: -100, max: 100, step: 1 },
  { name: 'shad', title: 'Shadow', min: 0, max: 100, step: 1 },
  { name: 'sharp', title: 'Sharpen', min: 0, max: 100, step: 1 },
  { name: 'usm', title: 'Unsharp Mask', min: -100, max: 100, step: 1 },
  { name: 'usmrad', title: 'Unsharp Mask Radius', min: 0, max: 500, step: 1 },
  { name: 'vib', title: 'Vibrance', min: -100, max: 100, step: 1 },
]

const animations = [
  { name: 'gifq', title: 'Animated GIF Quality', min: 1, max: 100, step: 1 },
  { name: 'loop', title: 'Animated Loop Count', min: 0, max: 100, step: 1 },
  { name: 'frame_interval', title: 'Frame Interval', min: 0, max: 1000, step: 10 },
  { name: 'frame', title: 'Frame Selection', min: 1, max: 100, step: 1 },
  { name: 'frame_skip', title: 'Frame Skip', min: 0, max: 10, step: 1 },
  { name: 'fps', title: 'Frames Per Second', min: 1, max: 60, step: 1 },
  { name: 'reverse', title: 'Reverse', type: 'boolean' },
]

const focalPointFilters = [
  { name: 'fp-debug', title: 'Focal Point Debug', type: 'boolean' },
  { name: 'fp-x', title: 'Focal Point X Position', min: 0, max: 1, step: 0.01 },
  { name: 'fp-y', title: 'Focal Point Y Position', min: 0, max: 1, step: 0.01 },
  { name: 'fp-z', title: 'Focal Point Zoom', min: 1, max: 10, step: 0.1 },
]

export function Imaige() {
  const [imageUrl, setImageUrl] = useState('https://assets.imgix.net/examples/butterfly.jpg')
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [fit, setFit] = useState('clip')
  const [format, setFormat] = useState('auto')
  const [quality, setQuality] = useState(75)
  const [filterValues, setFilterValues] = useState(
    Object.fromEntries(filters.map(filter => [filter.name, 0]))
  )
  const [animationValues, setAnimationValues] = useState(
    Object.fromEntries(animations.map(anim => [anim.name, anim.type === 'boolean' ? false : 0]))
  )
  const [focalPointValues, setFocalPointValues] = useState(
    Object.fromEntries(focalPointFilters.map(fp => [fp.name, fp.type === 'boolean' ? false : fp.min]))
  )

  const [processedUrl, setProcessedUrl] = useState('')

  useEffect(() => {
    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      fit,
      fm: format,
      q: quality.toString(),
      ...Object.fromEntries(Object.entries(filterValues).filter(([_, value]) => value !== 0)),
      ...Object.fromEntries(Object.entries(animationValues).filter(([_, value]) => value !== 0 && value !== false)),
      ...Object.fromEntries(Object.entries(focalPointValues).filter(([_, value]) => value !== false && value !== 0))
    })
    setProcessedUrl(`${imageUrl}?${params.toString()}`)
  }, [imageUrl, width, height, fit, format, quality, filterValues, animationValues, focalPointValues])

  const handleFilterChange = (name, value) => {
    setFilterValues(prev => ({ ...prev, [name]: value }))
  }

  const handleAnimationChange = (name, value) => {
    setAnimationValues(prev => ({ ...prev, [name]: value }))
  }

  const handleFocalPointChange = (name, value) => {
    setFocalPointValues(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">imgix.com Playground</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="adjustments">
              <AccordionTrigger>Adjustments</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Width: {width}px</Label>
                    <Slider
                      value={[width]}
                      onValueChange={(value) => setWidth(value[0])}
                      min={50}
                      max={1000}
                      step={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Height: {height}px</Label>
                    <Slider
                      value={[height]}
                      onValueChange={(value) => setHeight(value[0])}
                      min={50}
                      max={1000}
                      step={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fit">Fit</Label>
                    <Select value={fit} onValueChange={setFit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clip">Clip</SelectItem>
                        <SelectItem value="crop">Crop</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality: {quality}</Label>
                    <Slider
                      value={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent>
                {filters.map((filter) => (
                  <div key={filter.name} className="space-y-2 mb-4">
                    <Label>{filter.title}: {filterValues[filter.name]}</Label>
                    <Slider
                      value={[filterValues[filter.name]]}
                      onValueChange={(value) => handleFilterChange(filter.name, value[0])}
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="animations">
              <AccordionTrigger>Animations</AccordionTrigger>
              <AccordionContent>
                {animations.map((anim) => (
                  <div key={anim.name} className="space-y-2 mb-4">
                    <Label>{anim.title}</Label>
                    {anim.type === 'boolean' ? (
                      <Switch
                        checked={animationValues[anim.name]}
                        onCheckedChange={(checked) => handleAnimationChange(anim.name, checked)}
                      />
                    ) : (
                      <>
                        <Label>{animationValues[anim.name]}</Label>
                        <Slider
                          value={[animationValues[anim.name]]}
                          onValueChange={(value) => handleAnimationChange(anim.name, value[0])}
                          min={anim.min}
                          max={anim.max}
                          step={anim.step}
                        />
                      </>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="focalPoint">
              <AccordionTrigger>Focal Point</AccordionTrigger>
              <AccordionContent>
                {focalPointFilters.map((fp) => (
                  <div key={fp.name} className="space-y-2 mb-4">
                    <Label>{fp.title}</Label>
                    {fp.type === 'boolean' ? (
                      <Switch
                        checked={focalPointValues[fp.name]}
                        onCheckedChange={(checked) => handleFocalPointChange(fp.name, checked)}
                      />
                    ) : (
                      <>
                        <Label>{focalPointValues[fp.name]}</Label>
                        <Slider
                          value={[focalPointValues[fp.name]]}
                          onValueChange={(value) => handleFocalPointChange(fp.name, value[0])}
                          min={fp.min}
                          max={fp.max}
                          step={fp.step}
                        />
                      </>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-6 md:sticky md:top-4 self-start">
          <div className="space-y-2">
            <Label>Processed URL:</Label>
            <Input value={processedUrl} readOnly />
          </div>

          <div className="space-y-2">
            <Label>Preview:</Label>
            <img src={processedUrl} alt="Processed image" className="max-w-full h-auto border rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}