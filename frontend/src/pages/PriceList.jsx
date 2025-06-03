/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Printer, Settings, Edit2, Trash2, Save, X, Filter, RefreshCw } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { productsApi } from "../services/apiClient"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import toast from "react-hot-toast"

const Pricelist = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: "",
    sortBy: "name",
    sortOrder: "ASC",
  })
  const queryClient = useQueryClient()

  // Get product categories for filter dropdown
  const { data: categories = [] } = useQuery("productCategories", () => productsApi.getCategories(), {
    select: (response) => response.data,
  })

  // Get products with filters only (no search term sent to backend)
  const {
    data: productsResponse = { data: [], pagination: { total: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["products", filters], // Remove search term from query key
    () =>
      productsApi.getAll({
        // Remove search parameter from API call
        ...filters,
      }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    },
  )

  // Get all products from API response
  const allProducts = productsResponse.data || []
  
  // Filter products on client side based on search term
  const products = searchTerm 
    ? allProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.articleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allProducts;
  
  // Update pagination based on client-side filtered results
  const pagination = {
    ...productsResponse.pagination,
    total: products.length // Update total count to filtered count
  }

  const updateProductMutation = useMutation(({ id, data }) => productsApi.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("products")
      setEditingId(null)
      setEditForm({})
      toast.success("Product updated successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update product")
    },
  })

  const deleteProductMutation = useMutation((id) => productsApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("products")
      toast.success("Product deleted successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete product")
    },
  })

  const createProductMutation = useMutation((data) => productsApi.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("products")
      toast.success("Product created successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create product")
    },
  })

  const handleEdit = (product) => {
    setEditingId(product.id)
    setEditForm({ ...product })
  }

  const handleSave = () => {
    updateProductMutation.mutate({
      id: editingId,
      data: editForm,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: "",
      sortBy: "name",
      sortOrder: "ASC",
    });
    setSearchTerm("");
    // No need to reset debouncedSearchTerm
  }

  const handleCreateDemoProduct = () => {
    const demoProduct = {
      articleNo: `DEMO-${Math.floor(Math.random() * 10000)}`,
      name: "Demo Product",
      description: "This is a demo product for testing",
      price: 99.99,
      inPrice: 49.99,
      unit: "st",
      inStock: 10,
      category: "Demo",
      isActive: true,
    }
    createProductMutation.mutate(demoProduct)
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
        <ErrorMessage message="Failed to load products" onRetry={() => refetch()} />
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4">Product Pricelist</h1>
            <p className="text-base md:text-lg lg:text-xl opacity-75 max-w-2xl mx-auto">
              Manage your products and pricing with our comprehensive pricelist system
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4 mb-6 md:mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, article number or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Direct search with no debounce
              className="input pl-10 w-full"
              style={{paddingLeft: 40}}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button onClick={handleCreateDemoProduct} className="btn btn-primary btn-sm md:btn-md">
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden xs:inline">New Product</span>
              <span className="xs:hidden">New</span>
            </button>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm md:btn-md no-print">
              <Printer className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden xs:inline">Print List</span>
              <span className="xs:hidden">Print</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? "btn-primary" : "btn-secondary"} btn-sm md:btn-md no-print`}
            >
              <Filter className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden xs:inline">Filters</span>
              <span className="xs:hidden">Filter</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-6 md:mb-8 no-print p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="input">
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="input"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Stock Status</label>
                <select name="inStock" value={filters.inStock} onChange={handleFilterChange} className="input">
                  <option value="">All Products</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Sort By</label>
                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="input">
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="inStock">Stock</option>
                  <option value="articleNo">Article No.</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Sort Order</label>
                <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange} className="input">
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
              <div className="flex items-end sm:col-span-2 lg:col-span-3">
                <button onClick={resetFilters} className="btn btn-secondary w-full sm:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Table - Use responsive table wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto -mx-4 sm:mx-0"> {/* Negative margin on mobile for full-width scroll */}
            <table className="table min-w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Article No.</th>
                  <th className="whitespace-nowrap">Product/Service</th>
                  <th className="hidden md:table-cell whitespace-nowrap">In Price</th>
                  <th className="whitespace-nowrap">Price</th>
                  <th className="hidden lg:table-cell whitespace-nowrap">Unit</th>
                  <th className="hidden lg:table-cell whitespace-nowrap">In Stock</th>
                  <th className="no-print whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editForm.articleNo || ""}
                          onChange={(e) => setEditForm({ ...editForm, articleNo: e.target.value })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className="text-sm font-mono">{product.articleNo}</span>
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className="text-sm font-medium">{product.name}</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.inPrice || ""}
                          onChange={(e) => setEditForm({ ...editForm, inPrice: Number.parseFloat(e.target.value) })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className="text-sm">{product.inPrice?.toFixed(2)} kr</span>
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price || ""}
                          onChange={(e) => setEditForm({ ...editForm, price: Number.parseFloat(e.target.value) })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary">{product.price?.toFixed(2)} kr</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={editForm.unit || ""}
                          onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className="text-sm">{product.unit}</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={editForm.inStock || ""}
                          onChange={(e) => setEditForm({ ...editForm, inStock: Number.parseInt(e.target.value) })}
                          className="input text-sm"
                        />
                      ) : (
                        <span className={`text-sm ${product.inStock > 0 ? "text-success" : "text-error"}`}>
                          {product.inStock}
                        </span>
                      )}
                    </td>
                    <td className="no-print">
                      <div className="flex items-center justify-end lg:justify-start gap-1 md:gap-2">
                        {editingId === product.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              disabled={updateProductMutation.isLoading}
                              className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                              aria-label="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-text-secondary hover:bg-surface-dark rounded transition-colors"
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                              aria-label="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteProductMutation.isLoading}
                              className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">
                {searchTerm || Object.values(filters).some(Boolean)
                  ? "No products found matching your criteria."
                  : "No products available. Click 'New Product' to add one."}
              </p>
              {(searchTerm || Object.values(filters).some(Boolean)) && (
                <button onClick={resetFilters} className="btn btn-secondary mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Summary - Updated grid for better mobile experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="card text-center p-4">
            <h3 className="text-base md:text-lg font-semibold text-text mb-1 md:mb-2">Total Products</h3>
            <p className="text-2xl md:text-3xl font-bold text-primary">{products.length}</p>
          </div>
          <div className="card text-center p-4">
            <h3 className="text-base md:text-lg font-semibold text-text mb-1 md:mb-2">In Stock</h3>
            <p className="text-2xl md:text-3xl font-bold text-success">{products.filter((p) => p.inStock > 0).length}</p>
          </div>
          <div className="card text-center p-4">
            <h3 className="text-base md:text-lg font-semibold text-text mb-1 md:mb-2">Out of Stock</h3>
            <p className="text-2xl md:text-3xl font-bold text-error">{products.filter((p) => p.inStock === 0).length}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Pricelist
