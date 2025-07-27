import mongoose from "mongoose"
import bcrypt from "bcryptjs"

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mini-inventory"

// User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

// Product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  buyingPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log("🗑️ Cleared existing data")

    // Create admin user
    const adminUser = new User({
      username: "admin",
      password: "admin123",
    })
    await adminUser.save()
    console.log("👤 Created admin user")

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
    console.log("📦 Created sample products")

    console.log("🎉 Database seeded successfully!")
    console.log("🔑 Login credentials: admin / admin123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
    process.exit(0)
  }
}

seedDatabase()
