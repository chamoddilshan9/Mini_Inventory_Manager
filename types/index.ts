export interface Product {
  _id: string
  name: string
  category: string
  quantity: number
  buyingPrice: number
  sellingPrice: number
  imageUrl?: string
  createdAt: string
}

export interface Sale {
  _id: string
  productId: string
  productName: string
  quantitySold: number
  unitPrice: number
  totalPrice: number
  status: "Paid" | "Unpaid"
  createdAt: string
}

export interface DashboardStats {
  totalProducts: number
  lowStockProducts: Product[]
  totalSales: number
  totalRevenue: number
  unpaidSales: number
  unpaidAmount: number
  recentSales: Sale[]
}
