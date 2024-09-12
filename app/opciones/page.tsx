"use client";

import React, { 
    useState, 
    useEffect, 
    useRef 
} from 'react'
import { 
    motion,
    useScroll,
    useSpring,
    useTransform,
    MotionValue,
    useInView,
    AnimatePresence
} from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"




function useParallax(value: MotionValue<number>, distance: number) {
return useTransform(value, [0, 1], [-distance, distance]);
}

function Image({ id }: { id: number }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const y = useParallax(scrollYProgress, 300);
    const [xo, setX] = useState(0);
    const [yo, setY] = useState(0);
    const [rotateo, setRotate] = useState(0);
    const isInView = useInView(ref, { once: false });

    return (
        <section>
            
            <motion.div
                ref={ref}
                layoutScroll
                animate={isInView ? { x: 0, y: 0, rotate: 0 } : {x: "-100px", y: 0, rotate: 0}}
                transition={{ type: "spring" }}
            >
            <img src={`/images/agent-convo.gif`} alt="A London skyscraper" />
      
            </motion.div>
        <motion.h2 style={{ y }}>{`#00${id}`}</motion.h2>
        </section>
    );
}

export default function AnimatedHeader() {
    const ref = useRef(null);
  const [amplitude, setAmplitude] = useState(0)
  const frequency = 1000
  const svgRef = useRef(null);
  const [svgPosition, setSvgPosition] = useState(0);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      const rect = svgElement.getBoundingClientRect();
      setSvgPosition(80 );
    }

    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY < svgPosition) {
          const scrollPercentage = scrollY / svgPosition;
          const newAmplitude = Math.min(scrollPercentage * 50, 50);
          setAmplitude(newAmplitude);
        }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [svgPosition])

  const generatePath = (amp: number) => {
    const width = 1440
    const height = 320
    const points = []

    for (let x = 0; x <= width; x += 10) {
      const y = Math.sin((x / width) * Math.PI * 2 * (frequency / 100)) * amp + height / 2
      points.push(`${x},${y}`)
    }

    return `M0,${height} L${points.join(' L')} L${width},${height} Z`
  }

  const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

  return (
    <div className="landingPage pt-[80px]"> {/* Ensure scrollable content */}
        <header className="fixed top-0 left-0 right-0  overflow-hidden bg-primary h-[40px]">
            <svg
            className="w-full h-[50px] transition-all duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            ref={svgRef}
            >
            <path 
                fill="#ffffff" 
                fillOpacity="1" 
                d={generatePath(amplitude)}
            ></path>
            </svg>
        </header>
        <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center m-[100px]"
                viewport={{ once: false }}
                >
                <h2 className="text-4xl font-bold text-[#1e6891] mb-4">Potencia tu Agencia de Viajes con Tecnología de Vanguardia</h2>
                <p className="text-xl text-gray-600">Únete a Opciones Argentinas y lleva tu negocio al siguiente nivel</p>
        </motion.section>
        <div  className="text-center pb-[40px] pt-[80px] bg-[#040c11] relative">

            <motion.div
                initial={{ x: 0, y: 0, rotate: 180 }}
                animate={{
                x: [0, window.innerWidth - 300],
                y: [0, -10, 0, -10],
                    rotate: [20, 30, 10],
                    opacity: [0, 1, 1, 0]
                }}
                style={{ position:"absolute", left:0, top:"30px" }}
                    transition={{
                        duration: 6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay:1
                }}
                >

                            <img src="/img/avion.png" alt="avion" className="w-[200px] h-[200px] mx-auto" />
                </motion.div>
            
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
                viewport={{ once: false }}
                >
                <h2 className="text-4xl font-bold text-[#ffffff] mb-4">Cupos aereos confirmados</h2>
                <p className="text-xl text-[#e7e7e7]">Con equipaje de bodega incluido y flexibilidad operativa</p>
            </motion.section>
        </div>

        <section className="my-20 text-center">
          <h2 className="text-3xl font-semibold mb-10 text-[#1e6891]">¿Por qué elegir Opciones Argentinas?</h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ul className="text-xl space-y-6 text-gray-700 w-[650px] mx-auto">
              <li className="flex items-center">
                <span className="bg-[#48b8a7] text-white rounded-full flex items-center justify-center w-[40px] h-[40px] mr-[4px]">✓</span>
                Más de 30 años de trayectoria y experiencia en el mercado
              </li>
              <li className="flex items-center">
                <span className="bg-[#48b8a7] text-white rounded-full flex items-center justify-center w-[40px] h-[40px] mr-[4px]">✓</span>
                Únete a más de 600 agencias que ya confían en nosotros
              </li>
              <li className="flex items-center">
                <span className="bg-[#48b8a7] text-white rounded-full flex items-center justify-center w-[40px] h-[40px] mr-[4px]">✓</span>
                Sistema de reservas online con confirmación inmediata
              </li>
              <li className="flex items-center">
                <span className="bg-[#48b8a7] text-white rounded-full flex items-center justify-center w-[40px] h-[40px] mr-[4px]">✓</span>
                Soporte técnico y comercial personalizado
              </li>
            </ul>
          </motion.div>
        </section>

        <section className="my-20 text-center">
            <Button className="bg-[#1e6891] hover:bg-[#165570] text-white">
                  Solicitar Información
            </Button>
        </section>
    </div>
  )
}