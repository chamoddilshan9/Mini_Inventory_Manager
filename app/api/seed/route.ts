import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Product from "@/models/Product"

export async function POST() {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})

    // Create admin user
    const adminUser = new User({
      username: "admin",
      password: "admin123",
    })
    await adminUser.save()

    // Create sample products
    const sampleProducts = [
      {
        name: "iPhone 14",
        category: "Electronics",
        quantity: 15,
        buyingPrice: 800,
        sellingPrice: 999,
        imageUrl: "",
      },
      {
        name: "Samsung Galaxy S23",
        category: "Electronics",
        quantity: 8,
        buyingPrice: 700,
        sellingPrice: 899,
        imageUrl: "",
      },
      {
        name: "Nike Air Max",
        category: "Clothing",
        quantity: 3,
        buyingPrice: 80,
        sellingPrice: 120,
        imageUrl: "",
      },
      {
        name: "MacBook Pro",
        category: "Electronics",
        quantity: 5,
        buyingPrice: 1800,
        sellingPrice: 2299,
        imageUrl: "",
      },
      {
        name: "Coffee Beans",
        category: "Food",
        quantity: 25,
        buyingPrice: 8,
        sellingPrice: 15,
        imageUrl: "",
      },
      {
        name: "JavaScript Book",
        category: "Books",
        quantity: 12,
        buyingPrice: 25,
        sellingPrice: 45,
        imageUrl: "",
      },
    ]

    await Product.insertMany(sampleProducts)

    return NextResponse.json({
      message: "Database seeded successfully!",
      user: { username: "admin", password: "admin123" },
      productsCount: sampleProducts.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
