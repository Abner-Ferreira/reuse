'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center px-6 md:px-20">
      
      <div className="grid md:grid-cols-2 items-center gap-12 w-full">
        
        {/* LEFT - IMAGE */}
        <div className="relative w-full h-75 md:h-125">
          <Image
            src="/lost.png"
            alt="Pessoa perdida"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* RIGHT - CONTENT */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          
          <h1 className="text-7xl md:text-9xl font-extrabold text-primary leading-none">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Parece que você se perdeu...
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
            A página que você está tentando acessar não existe ou foi movida 
            para outro lugar.
          </p>

          <button
            onClick={() => router.back()}
            className="flex flex-row justify-center items-center w-[20%] mx-auto md:mx-0 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium cursor-pointer  "
          >
            Voltar <ArrowRight className="ml-3 h-5"/>
          </button>

        </div>
      </div>
    </div>
  )
}