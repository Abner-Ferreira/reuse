import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  context: any
) {
  try {
    const params = await context.params; 
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID não enviado" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 }
    )
  }
}