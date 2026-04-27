// app/api/products/route.ts

import { NextResponse } from "next/server"
import prisma  from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      title: p.name, 
      category: p.category,
      categoryName: p.category,
      price: 0, 
      status: "ativo",
      active: true,
    }))

    return NextResponse.json(formatted, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    )
  }
}