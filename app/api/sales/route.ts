import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Sale from "@/models/Sale"
import Product from "@/models/Product"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const query: any = {}

    if (status && status !== "all") {
      query.status = status
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const sales = await Sale.find(query).sort({ createdAt: -1 })
    return NextResponse.json(sales)
  } catch (error) {
    console.error("Get sales error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { productId, quantitySold, status } = await request.json()

    // Get product details
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.quantity < quantitySold) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Create sale
    const sale = new Sale({
      productId,
      productName: product.name,
      quantitySold,
      unitPrice: product.sellingPrice,
      totalPrice: product.sellingPrice * quantitySold,
      status,
    })

    await sale.save()

    // Update product quantity
    product.quantity -= quantitySold
    await product.save()

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error("Create sale error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
