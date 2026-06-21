import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminBlogTab = ({ userInfo }) => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
    tags: '',
    isPublished: false
  });

  const fetchBlogs = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs?all=true`, config);
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      setBlogs([]);
      toast.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        coverImage: blog.coverImage || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        isPublished: blog.isPublished
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        coverImage: '',
        seoTitle: '',
        seoDescription: '',
        tags: '',
        isPublished: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Auto-generate slug if empty
      if (!payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      if (editingBlog) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/blogs/${editingBlog._id}`, payload, config);
        toast.success('Blog updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, payload, config);
        toast.success('Blog created successfully');
      }
      
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, config);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
        <h2 className="text-xl font-serif text-gray-800">SEO Blogs & Content</h2>
        <button
          onClick={() => openModal()}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Blog
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">/{blog.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-center space-x-3">
                    <button onClick={() => openModal(blog)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No blogs found. Create your first SEO article!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-gray-800">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (leave empty to auto-generate)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="e.g. affordable-jewellery"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL (Cloudinary Link)</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">SEO Settings (Crucial for Google Ranking)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="e.g. Top 10 Affordable Minimalist Jewellery Pieces"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Tags/Keywords (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="affordable jewellery, minimalist, anti tarnish"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Description</label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none h-20"
                      placeholder="A short, catchy description that will appear in Google search results..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article Content (Rich Text)</label>
                <div className="bg-white">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content} 
                    onChange={handleContentChange}
                    modules={quillModules}
                    className="h-64 mb-12"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 flex items-center"
                >
                  {loading ? 'Saving...' : 'Save Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogTab;
