/* eslint-disable no-unused-vars */
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Save, X, Globe, Eye } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { termsApi } from "../services/apiClient"
import { useAuthStore } from "../stores/authStore"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import toast from "react-hot-toast"

const TermsAdmin = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    language: "sv",
    content: "",
    version: "1.0.0",
    isActive: true,
  })
  const [previewId, setPreviewId] = useState(null)

  const {
    data: termsResponse = { data: [], pagination: { total: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery(["allTerms"], () => termsApi.getAll(), {
    select: (response) => response.data,
  })

  const createTermsMutation = useMutation((data) => termsApi.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("allTerms")
      setShowCreateForm(false)
      setCreateForm({
        language: "sv",
        content: "",
        version: "1.0.0",
        isActive: true,
      })
      toast.success("Terms created successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create terms")
    },
  })

  const updateTermsMutation = useMutation(({ id, data }) => termsApi.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("allTerms")
      setEditingId(null)
      setEditForm({})
      toast.success("Terms updated successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update terms")
    },
  })

  const deleteTermsMutation = useMutation((id) => termsApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("allTerms")
      toast.success("Terms deleted successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete terms")
    },
  })

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-text-secondary">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const terms = termsResponse.data || []

  const handleEdit = (term) => {
    setEditingId(term.id)
    setEditForm({ ...term })
  }

  const handleSave = () => {
    updateTermsMutation.mutate({
      id: editingId,
      data: editForm,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete these terms?")) {
      deleteTermsMutation.mutate(id)
    }
  }

  const handleCreate = (e) => {
    e.preventDefault()
    createTermsMutation.mutate(createForm)
  }

  const getLanguageFlag = (language) => {
    return language === "sv" ? "🇸🇪" : "🇺🇸"
  }

  const getLanguageName = (language) => {
    return language === "sv" ? "Svenska" : "English"
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
        <ErrorMessage message="Failed to load terms" onRetry={() => refetch()} />
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions Management</h1>
            <p className="text-lg md:text-xl opacity-75 max-w-2xl mx-auto">
              Manage terms and conditions for different languages
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
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-2xl font-semibold text-text">All Terms</h2>
          <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Terms
          </button>
        </motion.div>

        {/* Create Terms Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Terms</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Language *</label>
                  <select
                    required
                    value={createForm.language}
                    onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}
                    className="input"
                  >
                    <option value="sv">🇸🇪 Svenska</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Version</label>
                  <input
                    type="text"
                    value={createForm.version}
                    onChange={(e) => setCreateForm({ ...createForm, version: e.target.value })}
                    className="input"
                    placeholder="1.0.0"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.isActive}
                      onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary mr-2"
                    />
                    <span className="text-sm text-text-secondary">Active</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Content *</label>
                <textarea
                  required
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  className="input textarea"
                  rows="10"
                  placeholder="Enter terms content (HTML supported)"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={createTermsMutation.isLoading} className="btn btn-primary">
                  {createTermsMutation.isLoading ? <LoadingSpinner size="sm" /> : "Create Terms"}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Terms List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {terms.map((term, index) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {editingId === term.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Language</label>
                      <select
                        value={editForm.language || ""}
                        onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                        className="input"
                      >
                        <option value="sv">🇸🇪 Svenska</option>
                        <option value="en">🇺🇸 English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Version</label>
                      <input
                        type="text"
                        value={editForm.version || ""}
                        onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.isActive || false}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                          className="rounded border-border text-primary focus:ring-primary mr-2"
                        />
                        <span className="text-sm text-text-secondary">Active</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Content</label>
                    <textarea
                      value={editForm.content || ""}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="input textarea"
                      rows="10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={updateTermsMutation.isLoading} className="btn btn-primary">
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary">
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getLanguageFlag(term.language)}</span>
                          <h3 className="text-lg font-semibold text-text">{getLanguageName(term.language)}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              term.isActive ? "bg-success/10 text-success" : "bg-surface-dark text-text-secondary"
                            }`}
                          >
                            {term.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">Version: {term.version}</p>
                        <p className="text-sm text-text-secondary">
                          Updated: {new Date(term.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewId(previewId === term.id ? null : term.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(term)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(term.id)}
                        disabled={deleteTermsMutation.isLoading}
                        className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {previewId === term.id && (
                    <div className="mt-4 p-4 bg-surface-dark rounded-lg">
                      <h4 className="font-semibold mb-2">Content Preview:</h4>
                      <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: term.content }} />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {terms.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No terms created yet. Create your first terms!</p>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Terms
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TermsAdmin
