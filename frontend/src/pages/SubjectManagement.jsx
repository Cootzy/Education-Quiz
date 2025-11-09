import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await api.getAdminSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error("Error loading subjects:", error);
      setError("Gagal memuat mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Nama mata pelajaran harus diisi");
      return;
    }

    try {
      if (editingSubject) {
        await api.updateSubject(editingSubject.id, formData);
      } else {
        await api.createSubject(formData);
      }

      await loadSubjects();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving subject:", error);
      setError(
        error.response?.data?.detail ||
          "Terjadi kesalahan saat menyimpan mata pelajaran"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus mata pelajaran ini? Pastikan tidak ada pertanyaan yang terkait dengan mata pelajaran ini."
      )
    ) {
      return;
    }

    try {
      await api.deleteSubject(id);
      await loadSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert(
        error.response?.data?.detail ||
          "Terjadi kesalahan saat menghapus mata pelajaran"
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl">Memuat mata pelajaran...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kelola Mata Pelajaran
          </h1>
          <p className="text-gray-600">
            Tambah, edit, dan hapus mata pelajaran
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>+</span>
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      {error && !showModal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4 flex-grow">
              <div className="flex-1 flex flex-col min-h-[140px]">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {subject.name}
                </h2>
                <div className="flex-grow min-h-[60px] mb-3">
                  {subject.description ? (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {subject.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Tidak ada deskripsi
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-auto">
                  Dibuat:{" "}
                  {new Date(subject.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-3xl ml-4 flex-shrink-0">📚</div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={() => handleOpenModal(subject)}
                className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Belum ada mata pelajaran
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Tambah Mata Pelajaran Pertama
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingSubject
                  ? "Edit Mata Pelajaran"
                  : "Tambah Mata Pelajaran"}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Contoh: Matematika"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Deskripsi mata pelajaran..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingSubject ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
