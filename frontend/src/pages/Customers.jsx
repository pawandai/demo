/* eslint-disable no-unused-vars */
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit2, Trash2, Save, X, Users, Building, Mail, Phone } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { customersApi } from "../services/apiClient"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import toast from "react-hot-toast"

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sweden",
    organizationNumber: "",
    vatNumber: "",
  })
  const queryClient = useQueryClient()

  const {
    data: customersResponse = { data: [], pagination: { total: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["customers", searchTerm],
    () =>
      customersApi.getAll({
        search: searchTerm,
      }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    },
  )

  const customers = customersResponse.data || []

  const createCustomerMutation = useMutation((data) => customersApi.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("customers")
      setShowCreateForm(false)
      setCreateForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Sweden",
        organizationNumber: "",
        vatNumber: "",
      })
      toast.success("Customer created successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create customer")
    },
  })

  const updateCustomerMutation = useMutation(({ id, data }) => customersApi.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("customers")
      setEditingId(null)
      setEditForm({})
      toast.success("Customer updated successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update customer")
    },
  })

  const deleteCustomerMutation = useMutation((id) => customersApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("customers")
      toast.success("Customer deleted successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete customer")
    },
  })

  const handleEdit = (customer) => {
    setEditingId(customer.id)
    setEditForm({ ...customer })
  }

  const handleSave = () => {
    updateCustomerMutation.mutate({
      id: editingId,
      data: editForm,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomerMutation.mutate(id)
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    createCustomerMutation.mutate(createForm)
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
        <ErrorMessage message="Failed to load customers" onRetry={() => refetch()} />
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Customer Management</h1>
            <p className="text-lg md:text-xl opacity-75 max-w-2xl mx-auto">
              Manage your customer database and track their information
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
              placeholder="Search customers by name, email, or organization number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New Customer
            </button>
          </div>
        </motion.div>

        {/* Create Customer Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Customer</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Organization Number</label>
                <input
                  type="text"
                  value={createForm.organizationNumber}
                  onChange={(e) => setCreateForm({ ...createForm, organizationNumber: e.target.value })}
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">Address</label>
                <textarea
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="input textarea"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">City</label>
                <input
                  type="text"
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Postal Code</label>
                <input
                  type="text"
                  value={createForm.postalCode}
                  onChange={(e) => setCreateForm({ ...createForm, postalCode: e.target.value })}
                  className="input"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" disabled={createCustomerMutation.isLoading} className="btn btn-primary">
                  {createCustomerMutation.isLoading ? <LoadingSpinner size="sm" /> : "Create Customer"}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Customers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              {editingId === customer.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input text-lg font-semibold"
                    placeholder="Customer name"
                  />
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input"
                    placeholder="Phone"
                  />
                  <textarea
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="input textarea"
                    placeholder="Address"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={updateCustomerMutation.isLoading}
                      className="btn btn-primary flex-1"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text">{customer.name}</h3>
                        {customer.organizationNumber && (
                          <p className="text-sm text-text-secondary">Org: {customer.organizationNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        disabled={deleteCustomerMutation.isLoading}
                        className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Building className="w-4 h-4" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                  </div>

                  {customer.invoices && customer.invoices.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-text-secondary">Invoices</p>
                          <p className="text-lg font-semibold text-primary">{customer.invoices.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Total</p>
                          <p className="text-lg font-semibold text-success">
                            {customer.invoices
                              .reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)
                              .toFixed(2)}{" "}
                            kr
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {customers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              {searchTerm
                ? "No customers found matching your search."
                : "No customers yet. Create your first customer!"}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowCreateForm(true)} className="btn btn-primary mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Customer
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Customers
