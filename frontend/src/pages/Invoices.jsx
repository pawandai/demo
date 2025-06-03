/* eslint-disable no-unused-vars */
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Trash2, Send, DollarSign, FileText, Eye } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { invoicesApi } from "../services/apiClient"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import toast from "react-hot-toast"

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const queryClient = useQueryClient()

  const {
    data: invoicesResponse = { data: [], pagination: { total: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["invoices", searchTerm, statusFilter],
    () =>
      invoicesApi.getAll({
        search: searchTerm,
        status: statusFilter,
      }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    },
  )

  const invoices = invoicesResponse.data || []

  const markAsPaidMutation = useMutation((id) => invoicesApi.markAsPaid(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("invoices")
      toast.success("Invoice marked as paid!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to mark invoice as paid")
    },
  })

  const sendInvoiceMutation = useMutation((id) => invoicesApi.send(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("invoices")
      toast.success("Invoice sent successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to send invoice")
    },
  })

  const deleteInvoiceMutation = useMutation((id) => invoicesApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("invoices")
      toast.success("Invoice deleted successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete invoice")
    },
  })

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoiceMutation.mutate(id)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-success bg-success/10"
      case "sent":
        return "text-primary bg-primary/10"
      case "overdue":
        return "text-error bg-error/10"
      case "cancelled":
        return "text-text-secondary bg-surface-dark"
      default:
        return "text-warning bg-warning/10"
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("sv-SE")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load invoices" onRetry={() => refetch()} />
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
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Invoice Management</h1>
            <p className="text-lg md:text-xl opacity-75 max-w-2xl mx-auto">
              Create, manage, and track your invoices with ease
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices by number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </motion.div>

        {/* Invoices Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-text-secondary">{invoice.customer?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Amount</span>
                  <span className="text-lg font-semibold text-primary">{invoice.total?.toFixed(2)} kr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Issue Date</span>
                  <span className="text-sm">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Due Date</span>
                  <span className="text-sm">{formatDate(invoice.dueDate)}</span>
                </div>
                {invoice.items && invoice.items.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Items</span>
                    <span className="text-sm">{invoice.items.length}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="btn btn-secondary flex-1 text-xs">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                {invoice.status === "draft" && (
                  <button
                    onClick={() => sendInvoiceMutation.mutate(invoice.id)}
                    disabled={sendInvoiceMutation.isLoading}
                    className="btn btn-primary flex-1 text-xs"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </button>
                )}
                {invoice.status === "sent" && (
                  <button
                    onClick={() => markAsPaidMutation.mutate(invoice.id)}
                    disabled={markAsPaidMutation.isLoading}
                    className="btn btn-success flex-1 text-xs"
                  >
                    <DollarSign className="w-3 h-3" />
                    Mark Paid
                  </button>
                )}
                <button
                  onClick={() => handleDelete(invoice.id)}
                  disabled={deleteInvoiceMutation.isLoading}
                  className="btn btn-error text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              {searchTerm || statusFilter
                ? "No invoices found matching your criteria."
                : "No invoices yet. Create your first invoice!"}
            </p>
            {!searchTerm && !statusFilter && (
              <button className="btn btn-primary mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-text mb-2">Total Invoices</h3>
            <p className="text-3xl font-bold text-primary">{invoices.length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-text mb-2">Paid</h3>
            <p className="text-3xl font-bold text-success">{invoices.filter((inv) => inv.status === "paid").length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-text mb-2">Pending</h3>
            <p className="text-3xl font-bold text-warning">{invoices.filter((inv) => inv.status === "sent").length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-text mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary">
              {invoices
                .filter((inv) => inv.status === "paid")
                .reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)
                .toFixed(2)}{" "}
              kr
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Invoices
