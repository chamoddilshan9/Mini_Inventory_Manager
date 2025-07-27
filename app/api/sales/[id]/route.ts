import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Sale from "@/models/Sale"
import Product from "@/models/Product"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { quantitySold, status } = await request.json()

    const sale = await Sale.findById(params.id)
    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    const product = await Product.findById(sale.productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Restore original quantity
    product.quantity += sale.quantitySold

    // Check if new quantity is available
    if (product.quantity < quantitySold) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Update sale
    sale.quantitySold = quantitySold
    sale.totalPrice = product.sellingPrice * quantitySold
    sale.status = status
    await sale.save()

    // Update product quantity
    product.quantity -= quantitySold
    await product.save()

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Update sale error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const sale = await Sale.findById(params.id)
    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    // Restore product quantity
    const product = await Product.findById(sale.productId)
    if (product) {
      product.quantity += sale.quantitySold
      await product.save()
    }

    await Sale.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Sale deleted successfully" })
  } catch (error) {
    console.error("Delete sale error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
