import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'NECKLACE',
    stock: '',
    description: '',
    images: '',
  });

  // Filter States - Split search into two states
  const [searchInput, setSearchInput] = useState(''); // For input field
  const [debouncedSearch, setDebouncedSearch] = useState(''); // For actual filtering
  const searchTimeoutRef = useRef(null);

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    role: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    dateFrom: '',
    dateTo: '',
  });

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  const getUserInfo = () => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  };

  // Filter functions - Use debouncedSearch instead of filters.search
  const filterProducts = useCallback((products) => {
    return products.filter((product) => {
      const matchesSearch = !debouncedSearch || 
        product.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = !filters.category || product.category === filters.category;
      
      const price = parseFloat(product.price) || 0;
      const matchesMinPrice = !filters.minPrice || price >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || price <= parseFloat(filters.maxPrice);
      
      const stock = parseInt(product.stock) || 0;
      const matchesMinStock = !filters.minStock || stock >= parseInt(filters.minStock);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesMinStock;
    });
  }, [debouncedSearch, filters]);

  const filterUsers = useCallback((users) => {
    return users.filter((user) => {
      const matchesSearch = !debouncedSearch || 
        user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;

      return matchesSearch && matchesRole;
    });
  }, [debouncedSearch, filters]);

  const filterContacts = useCallback((contacts) => {
    return contacts.filter((contact) => {
      const matchesSearch = !debouncedSearch || 
        contact.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.message?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = !filters.status || contact.status === filters.status;

      const createdAt = new Date(contact.createdAt);
      const matchesDateFrom = !filters.dateFrom || createdAt >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || createdAt <= new Date(filters.dateTo);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [debouncedSearch, filters]);

  const filterOrders = useCallback((orders) => {
    return orders.filter((order) => {
      const userName = order.user?.name || '';
      const matchesSearch = !debouncedSearch || 
        userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order._id?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = !filters.status || order.status === filters.status;

      const createdAt = new Date(order.createdAt);
      const matchesDateFrom = !filters.dateFrom || createdAt >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || createdAt <= new Date(filters.dateTo);

      const totalPrice = parseFloat(order.totalPrice) || 0;
      const matchesMinPrice = !filters.minPrice || totalPrice >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || totalPrice <= parseFloat(filters.maxPrice);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo && matchesMinPrice && matchesMaxPrice;
    });
  }, [debouncedSearch, filters]);

  // Memoized filtered data
  const filteredProducts = useMemo(() => filterProducts(products), [products, filterProducts]);
  const filteredUsers = useMemo(() => filterUsers(users), [users, filterUsers]);
  const filteredContacts = useMemo(() => filterContacts(contacts), [contacts, filterContacts]);
  const filteredOrders = useMemo(() => filterOrders(orders), [orders, filterOrders]);
  const filteredCategories = categories;

  useEffect(() => {
    const ui = getUserInfo();
    if (!ui || ui.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, activeTab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const ui = getUserInfo();
      if (!ui || ui.role !== 'admin') {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };

      if (activeTab === 'products') {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(
          Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data)
            ? data
            : []
        );
      } else if (activeTab === 'users') {
        const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'categories') {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        setCategories(Array.isArray(data) ? data : []);
      } else if (activeTab === 'contact') {
        const { data } = await axios.get('http://localhost:5000/api/contact', config);
        setContacts(Array.isArray(data?.data) ? data.data : []);
      } else if (activeTab === 'orders') {
        const { data } = await axios.get(
          'http://localhost:5000/api/orders/all/admin',
          config
        );
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
      setUsers([]);
      setCategories([]);
      setContacts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, navigate]);

  const clearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setFilters({
      category: '',
      status: '',
      role: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      const ui = getUserInfo();
      if (!ui) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        config
      );
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleExchangeApproval = async (orderId, approved) => {
    if (
      !window.confirm(
        `Are you sure you want to ${approved ? 'approve' : 'reject'} this exchange request?`
      )
    )
      return;

    try {
      const ui = getUserInfo();
      if (!ui) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/exchange/approve`,
        { approved },
        config
      );
      alert(`Exchange ${approved ? 'approved' : 'rejected'} successfully`);
      fetchData();
    } catch (error) {
      console.error('Error handling exchange:', error);
      alert('Failed to process exchange request');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const ui = getUserInfo();
      if (!ui) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };
      await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'NECKLACE',
        stock: product.stock || '',
        description: product.description || '',
        images: product.images ? product.images.join(', ') : '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'NECKLACE',
        stock: '',
        description: '',
        images: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const ui = getUserInfo();
      if (!ui) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ui = getUserInfo();
    if (!ui) {
      navigate('/login');
      return;
    }
    const config = { headers: { Authorization: `Bearer ${ui.token}` } };

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img !== ''),
    };

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          productData,
          config
        );
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

  const handleContactStatusChange = async (contactId, newStatus) => {
    try {
      const ui = getUserInfo();
      if (!ui) {
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };
      await axios.put(
        `http://localhost:5000/api/contact/${contactId}/status`,
        { status: newStatus },
        config
      );
      fetchData();
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status');
    }
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactModal = () => {
    setSelectedContact(null);
  };

  // Filter Controls Component
  const FilterControls = () => {
    const currentTab = activeTab;
    const hasActiveFilters = searchInput !== '' || Object.values(filters).some(f => f !== '');
    
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 min-w-0">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${currentTab === 'products' ? 'products' : 
                             currentTab === 'users' ? 'users' : 
                             currentTab === 'contact' ? 'contacts' : 
                             currentTab === 'orders' ? 'orders' : 'items'}...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {searchInput !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            {['products', 'contact', 'orders'].includes(currentTab) && (
              <div className="flex gap-2">
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">All Status</option>
                  {currentTab === 'products' && (
                    <>
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </>
                  )}
                  {currentTab === 'contact' && (
                    <>
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                    </>
                  )}
                  {currentTab === 'orders' && (
                    <>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="exchange_requested">Exchange Requested</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              Clear
            </button>
            <button
              onClick={fetchData}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1 text-sm"
              disabled={loading}
            >
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {currentTab === 'products' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">All Categories</option>
                  <option value="NECKLACE">NECKLACE</option>
                  <option value="EARRINGS">EARRINGS</option>
                  <option value="RINGS">RINGS</option>
                  <option value="BRACELET">BRACELET</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500"
                  placeholder="∞"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Stock</label>
                <input
                  type="number"
                  value={filters.minStock}
                  onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500"
                  placeholder="0"
                />
              </div>
            </>
          )}
          
          {currentTab === 'users' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-span-3" />
            </>
          )}

          {['contact', 'orders'].includes(currentTab) && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-rose-500"
                />
              </div>
            </>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing {(() => {
                switch(activeTab) {
                  case 'products': return filteredProducts.length;
                  case 'users': return filteredUsers.length;
                  case 'categories': return filteredCategories.length;
                  case 'contact': return filteredContacts.length;
                  case 'orders': return filteredOrders.length;
                  default: return 0;
                }
              })()} of {(() => {
                switch(activeTab) {
                  case 'products': return products.length;
                  case 'users': return users.length;
                  case 'categories': return categories.length;
                  case 'contact': return contacts.length;
                  case 'orders': return orders.length;
                  default: return 0;
                }
              })()} {activeTab}{' '}
              <button
                onClick={clearFilters}
                className="underline hover:no-underline"
              >
                Clear all filters
              </button>
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderProductsTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="text-lg text-gray-500">Loading products...</div>
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchInput !== '' || Object.values(filters).some(f => f !== '') 
              ? 'No products match your filters' 
              : 'No products found'}
          </p>
          <button
            onClick={fetchData}
            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
          >
            Refresh
          </button>
        </div>
      );
    }
    return (
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
            {filteredProducts.map((product) => (
              <tr key={product._id || Math.random()}>
                <td className="px-6 py-4">{product.name || 'Unnamed Product'}</td>
                <td className="px-6 py-4">{product.category || 'N/A'}</td>
                <td className="px-6 py-4">Rs. {product.price || 0}</td>
                <td className="px-6 py-4">{product.stock || 0}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUsersTable = () => {
    if (loading) return <div className="flex justify-center py-12">Loading users...</div>;
    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchInput !== '' || Object.values(filters).some(f => f !== '') 
              ? 'No users match your filters' 
              : 'No users found'}
          </p>
        </div>
      );
    }
    return (
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
            {filteredUsers.map((user) => (
              <tr key={user._id || Math.random()}>
                <td className="px-6 py-4">{user.name || 'N/A'}</td>
                <td className="px-6 py-4">{user.email || 'N/A'}</td>
                <td className="px-6 py-4">{user.role || 'user'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCategoriesTable = () => {
    if (loading)
      return <div className="flex justify-center py-12">Loading categories...</div>;
    if (filteredCategories.length === 0)
      return <div className="text-center py-12 text-gray-500">No categories found</div>;
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-serif text-lg">Categories</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((cat) => (
              <tr key={cat._id || Math.random()}>
                <td className="px-6 py-4">{cat.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleCategoryDelete(cat._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContactTable = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b justify-between items-center flex">
        <h3 className="font-serif text-lg">Contact Messages</h3>
        <button
          onClick={fetchData}
          className="text-sm text-rose-500 hover:underline"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">Loading contacts...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchInput !== '' || Object.values(filters).some(f => f !== '') 
            ? 'No contacts match your filters' 
            : 'No contact messages yet.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 font-medium text-gray-500">Subject</th>
                <th className="px-6 py-3 font-medium text-gray-500">Message</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact._id || Math.random()}>
                  <td className="px-6 py-4">{contact.name || 'N/A'}</td>
                  <td className="px-6 py-4">{contact.email || 'N/A'}</td>
                  <td className="px-6 py-4">{contact.subject || '-'}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-800">
                      <p className="line-clamp-3">{contact.message || ''}</p>
                      {contact.message && contact.message.length > 120 && (
                        <button
                          type="button"
                          onClick={() => openContactModal(contact)}
                          className="mt-1 text-xs text-rose-500 hover:underline"
                        >
                          View full
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={contact.status || 'New'}
                      onChange={(e) =>
                        handleContactStatusChange(contact._id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderOrdersTable = () => {
    if (loading) {
      return <div className="flex justify-center py-12">Loading orders...</div>;
    }
    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchInput !== '' || Object.values(filters).some(f => f !== '') 
              ? 'No orders match your filters' 
              : 'No orders found.'}
          </p>
        </div>
      );
    }
    return (
      <div className="bg-white shadow rounded-lg overflow-x-auto">
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
            {filteredOrders.map((order) => (
              <tr key={order._id || Math.random()}>
                <td className="px-6 py-4 font-mono text-sm">
                  {order._id?.substring(0, 8) || 'N/A'}...
                </td>
                <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">Rs. {order.totalPrice || 0}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'processing'
                        ? 'bg-purple-100 text-purple-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : order.status === 'exchange_requested'
                        ? 'bg-orange-100 text-orange-700'
                        : order.status === 'exchange_approved'
                        ? 'bg-teal-100 text-teal-700'
                        : order.status === 'exchanged'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status
                      ? order.status
                          .replace('_', ' ')
                          .split(' ')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')
                      : 'Unknown'}
                  </span>
                  {order.exchangeReason && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reason: {order.exchangeReason.replace('_', ' ')}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.status === 'exchange_requested' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExchangeApproval(order._id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleExchangeApproval(order._id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  ) : order.status === 'cancelled' ||
                    order.status === 'exchanged' ? (
                    <span className="text-gray-400 text-xs">No actions</span>
                  ) : (
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) =>
                        handleOrderStatus(order._id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-serif mb-8">Admin Dashboard</h1>

      <div className="flex border-b mb-8 overflow-x-auto">
        {['products', 'users', 'categories', 'contact', 'orders'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 font-medium capitalize whitespace-nowrap ${
              activeTab === tab ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <FilterControls />

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Product Management</h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-rose-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <FaPlus /> Add Product
            </button>
          </div>
          {renderProductsTable()}
        </div>
      )}

      {activeTab === 'users' && <div>{renderUsersTable()}</div>}

      {activeTab === 'categories' && <div>{renderCategoriesTable()}</div>}

      {activeTab === 'contact' && renderContactTable()}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Order Management</h2>
            <button
              onClick={fetchData}
              className="text-sm text-rose-500 hover:underline"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          {renderOrdersTable()}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-serif mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="NECKLACE">NECKLACE</option>
                  <option value="EARRINGS">EARRINGS</option>
                  <option value="RINGS">RINGS</option>
                  <option value="BRACELET">BRACELET</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URLs (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80]">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeContactModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-serif mb-4">Contact Message</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Name: </span>
                {selectedContact.name || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {selectedContact.email || 'N/A'}
              </p>
              {selectedContact.subject && (
                <p>
                  <span className="font-semibold">Subject: </span>
                  {selectedContact.subject}
                </p>
              )}
              <p>
                <span className="font-semibold">Status: </span>
                {selectedContact.status || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Created: </span>
                {selectedContact.createdAt
                  ? new Date(selectedContact.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
              <div className="mt-4">
                <p className="font-semibold mb-1">Message:</p>
                <p className="whitespace-pre-wrap">
                  {selectedContact.message || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
