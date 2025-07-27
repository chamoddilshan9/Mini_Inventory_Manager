import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Product from "@/models/Product"
import Sale from "@/models/Sale"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get total products
    const totalProducts = await Product.countDocuments()

    // Get low stock products
    const lowStockProducts = await Product.find({ quantity: { $lt: 5 } })

    // Get sales stats
    const totalSales = await Sale.countDocuments()
    const totalRevenue = await Sale.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }])

    const unpaidSales = await Sale.countDocuments({ status: "Unpaid" })
    const unpaidAmount = await Sale.aggregate([
      { $match: { status: "Unpaid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ])

    // Recent sales
    const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(5)

    return NextResponse.json({
      totalProducts,
      lowStockProducts,
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      unpaidSales,
      unpaidAmount: unpaidAmount[0]?.total || 0,
      recentSales,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
