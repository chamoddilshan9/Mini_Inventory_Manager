import mongoose from "mongoose"

const SaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Paid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema)
