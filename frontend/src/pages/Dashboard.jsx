/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"
import { Users, FileText, DollarSign, TrendingUp, Calendar, Package } from "lucide-react"
import { useQuery } from "react-query"
import { useAuthStore } from "../stores/authStore"
import { usersApi, customersApi, invoicesApi, productsApi } from "../services/apiClient"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuthStore()

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery(
    ["userStats", user?.id],
    () => usersApi.getStats(user.id),
    {
      select: (response) => response.data,
      enabled: !!user?.id,
    },
  )

  // Fetch recent customers
  const { data: customersData } = useQuery(
    ["customers", { limit: 5 }],
    () => customersApi.getAll({ limit: 5, sortBy: "createdAt", sortOrder: "DESC" }),
    {
      select: (response) => response.data.data,
    },
  )

  // Fetch recent invoices
  const { data: invoicesData } = useQuery(
    ["invoices", { limit: 5 }],
    () => invoicesApi.getAll({ limit: 5, sortBy: "createdAt", sortOrder: "DESC" }),
    {
      select: (response) => response.data.data,
    },
  )

  // Fetch recent products
  const { data: productsData } = useQuery(
    ["products", { limit: 5 }],
    () => productsApi.getAll({ limit: 5, sortBy: "createdAt", sortOrder: "DESC" }),
    {
      select: (response) => response.data.data,
    },
  )

  const stats = [
    {
      title: "Total Revenue",
      value: userStats ? `${userStats.totalRevenue.toFixed(2)} kr` : "0 kr",
      change: "+12.5%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      title: "Active Customers",
      value: userStats?.totalCustomers || 0,
      change: "+5.2%",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-600",
    },
    {
      title: "Total Invoices",
      value: userStats?.totalInvoices || 0,
      change: "+8.1%",
      icon: <FileText className="w-6 h-6" />,
      color: "text-purple-600",
    },
    {
      title: "Products",
      value: userStats?.totalProducts || 0,
      change: "+2.3%",
      icon: <Package className="w-6 h-6" />,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    ...(invoicesData?.map((invoice) => ({
      type: "invoice",
      description: `Invoice ${invoice.invoiceNumber} created for ${invoice.customer?.name}`,
      time: new Date(invoice.createdAt).toLocaleDateString(),
      status: invoice.status,
    })) || []),
    ...(customersData?.map((customer) => ({
      type: "customer",
      description: `New customer added: ${customer.name}`,
      time: new Date(customer.createdAt).toLocaleDateString(),
    })) || []),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5)

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-text-secondary">Here's what's happening with your business today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-surface-dark ${stat.color}`}>{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Recent Activity</h2>
              <Calendar className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-surface-dark">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-text text-sm">{activity.description}</p>
                      <p className="text-text-secondary text-xs mt-1">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {activity.status}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-center py-8">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Quick Actions</h2>
              <TrendingUp className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/invoices" className="card text-left hover:shadow-lg transition-shadow bg-surface-dark">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-text mb-2">Create Invoice</h3>
                <p className="text-text-secondary text-sm">Generate a new invoice for your customers</p>
              </Link>
              <Link to="/customers" className="card text-left hover:shadow-lg transition-shadow bg-surface-dark">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-text mb-2">Add Customer</h3>
                <p className="text-text-secondary text-sm">Add a new customer to your database</p>
              </Link>
              <Link to="/pricelist" className="card text-left hover:shadow-lg transition-shadow bg-surface-dark">
                <Package className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-text mb-2">Manage Products</h3>
                <p className="text-text-secondary text-sm">Update your product catalog and pricing</p>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Invoice Status Overview */}
        {userStats && userStats.totalInvoices > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-text mb-4">Invoice Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-text mb-2">Paid Invoices</h3>
                <p className="text-3xl font-bold text-success">{userStats.paidInvoices}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {userStats.totalInvoices > 0
                    ? `${((userStats.paidInvoices / userStats.totalInvoices) * 100).toFixed(1)}% of total`
                    : "0% of total"}
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-text mb-2">Pending Invoices</h3>
                <p className="text-3xl font-bold text-warning">{userStats.pendingInvoices}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {userStats.totalInvoices > 0
                    ? `${((userStats.pendingInvoices / userStats.totalInvoices) * 100).toFixed(1)}% of total`
                    : "0% of total"}
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-text mb-2">Overdue Invoices</h3>
                <p className="text-3xl font-bold text-error">{userStats.overdueInvoices}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {userStats.totalInvoices > 0
                    ? `${((userStats.overdueInvoices / userStats.totalInvoices) * 100).toFixed(1)}% of total`
                    : "0% of total"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Dashboard
