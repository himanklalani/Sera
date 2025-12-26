import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'NECKLACE',
    stock: '',
    description: '',
    images: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, activeTab]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      if (activeTab === 'products') {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } else if (activeTab === 'users') {
        const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(data);
      } else if (activeTab === 'categories') {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        setCategories(data);
      } else if (activeTab === 'contact') {
        const { data } = await axios.get('http://localhost:5000/api/contact', config);
        setContacts(data);
      } else if (activeTab === 'orders') {
        const { data } = await axios.get('http://localhost:5000/api/orders/all/admin', config);
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCategoryDelete = async (id) => {
      if (window.confirm('Delete this category?')) {
          try {
              const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
              await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
              fetchData();
          } catch (error) {
              console.error(error);
          }
      }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        description: product.description || '',
        images: product.images ? product.images.join(', ') : ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'NECKLACE',
        stock: '',
        description: '',
        images: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const productData = {
      ...formData,
      images: formData.images.split(',').map(img => img.trim()).filter(img => img !== '')
    };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productData, config);
      } else {
        await axios.post('http://localhost:5000/api/products', productData, config);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-serif mb-8">Admin Dashboard</h1>
      
      <div className="flex border-b mb-8 overflow-x-auto">
        {['products', 'users', 'categories', 'contact', 'orders'].map(tab => (
            <button 
                key={tab}
                className={`px-6 py-3 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Product Management</h2>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-rose-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-rose-600 transition-colors"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">Rs. {product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4 flex gap-4">
                      <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}

      {activeTab === 'categories' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-serif text-lg">Categories</h3>
                {/* Add Category Button can be implemented here similarly */}
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-6 py-4">{cat.name}</td>
                    <td className="px-6 py-4">
                        <button onClick={() => handleCategoryDelete(cat._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}

      {activeTab === 'contact' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td className="px-6 py-4">{contact.name}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4">{contact.subject}</td>
                    <td className="px-6 py-4">{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}

      {activeTab === 'orders' && (
          <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif">Order Management</h2>
                 <button onClick={fetchData} className="text-sm text-rose-500 hover:underline">Refresh</button>
              </div>
              
              {orders.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
              ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-6 py-3 font-medium text-gray-500">Order ID</th>
                                  <th className="px-6 py-3 font-medium text-gray-500">User</th>
                                  <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                                  <th className="px-6 py-3 font-medium text-gray-500">Total</th>
                                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                  <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                              {orders.map(order => (
                                  <tr key={order._id}>
                                      <td className="px-6 py-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                                      <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                      <td className="px-6 py-4">Rs. {order.totalPrice}</td>
                                      <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                              'bg-yellow-100 text-yellow-700'
                                          }`}>
                                              {order.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4">
                                          <select 
                                              value={order.status}
                                              onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                                              className="border rounded p-1 text-sm focus:ring-rose-500"
                                          >
                                              <option value="pending">Pending</option>
                                              <option value="shipped">Shipped</option>
                                              <option value="delivered">Delivered</option>
                                          </select>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <FaTimes />
            </button>
            <h2 className="text-2xl font-serif mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border p-2 rounded focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border p-2 rounded"
                >
                  <option value="NECKLACE">NECKLACE</option>
                  <option value="EARRINGS">EARRINGS</option>
                  <option value="RINGS">RINGS</option>
                  <option value="BRACELET">BRACELET</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
                <input 
                  type="text"
                  value={formData.images} 
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  className="w-full border p-2 rounded"
                  placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>
              <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition-colors">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
