import React, { useState, useEffect } from 'react';
import { Building, Package, Users, HelpCircle, FileText, Search, Tag, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  // Main state for company data
  const [companyData, setCompanyData] = useState({
    company: {
      name: '',
      description: '',
      industry: '',
      website: '',
      contact: {
        email: '',
        phone: '',
        address: ''
      }
    },
    products: [],
    services: [],
    faqs: [],
    policies: []
  });

  // UI state
  const [activeTab, setActiveTab] = useState('company');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({});

  // Add this near the top of the component with other state declarations
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef(null);

  // Initialize with sample data
  useEffect(() => {
    setCompanyData({
      company: {
        name: 'TechCorp Solutions',
        description: 'Leading provider of innovative technology solutions',
        industry: 'Technology',
        website: 'https://techcorp.com',
        contact: {
          email: 'info@techcorp.com',
          phone: '+1-555-0123',
          address: '123 Tech Street, Silicon Valley, CA'
        }
      },
      products: [
        {
          id: 1,
          name: 'CloudSync Pro',
          description: 'Enterprise cloud synchronization platform',
          category: 'Software',
          price: '$99/month',
          features: ['Real-time sync', 'Advanced security', '24/7 support'],
          tags: ['cloud', 'enterprise', 'sync']
        }
      ],
      services: [
        {
          id: 1,
          name: 'Technical Consulting',
          description: 'Expert technical consultation services',
          category: 'Consulting',
          duration: '1-6 months',
          features: ['Architecture review', 'Best practices', 'Implementation guidance'],
          tags: ['consulting', 'technical', 'architecture']
        }
      ],
      faqs: [
        {
          id: 1,
          question: 'What is your refund policy?',
          answer: 'We offer a 30-day money-back guarantee for all our products and services.',
          category: 'Billing',
          tags: ['refund', 'policy', 'billing']
        }
      ],
      policies: [
        {
          id: 1,
          title: 'Privacy Policy',
          content: 'We are committed to protecting your privacy and personal information...',
          category: 'Legal',
          lastUpdated: '2024-01-15',
          tags: ['privacy', 'legal', 'data']
        }
      ]
    });
  }, []);

  // Generic form handlers
  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  // Modify the handleSmartInput function
  const handleSmartInput = (value) => {
    setInputValue(value);
    
    if (activeTab === 'products' || activeTab === 'services') {
      setFormData(prev => ({
        ...prev,
        name: value
      }));
    } else if (activeTab === 'faqs') {
      setFormData(prev => ({
        ...prev,
        question: value
      }));
    } else if (activeTab === 'policies') {
      setFormData(prev => ({
        ...prev,
        title: value
      }));
    }
  };

  // CRUD operations
  const handleCreate = (type) => {
    const newItem = { ...formData, id: Date.now() };
    
    if (type === 'company') {
      setCompanyData(prev => ({
        ...prev,
        company: formData
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [type]: [...prev[type], newItem]
      }));
    }
    
    resetForm();
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, id: item.id });
    setFormData(item);
    setShowForm(true);
  };

  const handleUpdate = (type) => {
    if (type === 'company') {
      setCompanyData(prev => ({
        ...prev,
        company: formData
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        )
      }));
    }
    
    resetForm();
  };

  const handleDelete = (type, id) => {
    setCompanyData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  // Filter items based on search
  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Form components
  const CompanyForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Company Name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Industry"
          value={formData.industry || ''}
          onChange={(e) => handleInputChange('industry', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <textarea
        placeholder="Company Description"
        value={formData.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
      />
      
      <input
        type="url"
        placeholder="Website URL"
        value={formData.website || ''}
        onChange={(e) => handleInputChange('website', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="email"
          placeholder="Contact Email"
          value={formData.contact?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value, 'contact')}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.contact?.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value, 'contact')}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.contact?.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value, 'contact')}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const ProductServiceForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          defaultValue={formData.name || ''}
          onBlur={(e) => handleInputChange('name', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Category"
          defaultValue={formData.category || ''}
          onBlur={(e) => handleInputChange('category', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <textarea
        placeholder="Description"
        defaultValue={formData.description || ''}
        onBlur={(e) => handleInputChange('description', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'products' ? (
          <input
            type="text"
            placeholder="Price"
            defaultValue={formData.price || ''}
            onBlur={(e) => handleInputChange('price', e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <input
            type="text"
            placeholder="Duration"
            defaultValue={formData.duration || ''}
            onBlur={(e) => handleInputChange('duration', e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          defaultValue={formData.tags?.join(', ') || ''}
          onBlur={(e) => handleArrayInputChange('tags', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const FAQForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Question"
        defaultValue={formData.question || ''}
        onBlur={(e) => handleInputChange('question', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <textarea
        placeholder="Answer"
        defaultValue={formData.answer || ''}
        onBlur={(e) => handleInputChange('answer', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Category"
          defaultValue={formData.category || ''}
          onBlur={(e) => handleInputChange('category', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          defaultValue={formData.tags?.join(', ') || ''}
          onBlur={(e) => handleArrayInputChange('tags', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const PolicyForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Policy Title"
        defaultValue={formData.title || ''}
        onBlur={(e) => handleInputChange('title', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <textarea
        placeholder="Policy Content"
        defaultValue={formData.content || ''}
        onBlur={(e) => handleInputChange('content', e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Category"
          defaultValue={formData.category || ''}
          onBlur={(e) => handleInputChange('category', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="date"
          placeholder="Last Updated"
          defaultValue={formData.lastUpdated || ''}
          onBlur={(e) => handleInputChange('lastUpdated', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          defaultValue={formData.tags?.join(', ') || ''}
          onBlur={(e) => handleArrayInputChange('tags', e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  // Render form based on active tab
  const renderForm = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyForm />;
      case 'products':
      case 'services':
        return <ProductServiceForm />;
      case 'faqs':
        return <FAQForm />;
      case 'policies':
        return <PolicyForm />;
      default:
        return null;
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Users },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'policies', label: 'Policies', icon: FileText }
  ];

  // Add this effect to reset input value when changing tabs
  useEffect(() => {
    setInputValue('');
  }, [activeTab]);

  // Add this effect to focus the input when the form opens
  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Configuration</h1>
          <p className="text-gray-600">Manage your company data, products, services, FAQs, and policies</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search and Add Button */}
        {activeTab !== 'company' && (
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={() => {
                setFormData({});
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              <span>Add {activeTab.slice(0, -1)}</span>
            </button>
          </div>
        )}

        {/* Company Info Section */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Company Information</h2>
              <button
                onClick={() => {
                  setFormData(companyData.company);
                  setShowForm(true);
                }}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={18} />
                <span>Edit Info</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{companyData.company.name}</h3>
                <p className="text-gray-600 mb-4">{companyData.company.description}</p>
                <div className="space-y-2">
                  <p><span className="font-medium">Industry:</span> {companyData.company.industry}</p>
                  <p>
                    <span className="font-medium">Website:</span> 
                    <a href={companyData.company.website} className="text-blue-500 hover:underline ml-1">
                      {companyData.company.website}
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Email:</span> {companyData.company.contact.email}</p>
                  <p><span className="font-medium">Phone:</span> {companyData.company.contact.phone}</p>
                  <p><span className="font-medium">Address:</span> {companyData.company.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        {activeTab !== 'company' && !showForm && (
          <div>
            {companyData[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No {activeTab} added yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add your first {activeTab.slice(0, -1)}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filterItems(companyData[activeTab]).map(item => (
                  <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name || item.question || item.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(activeTab, item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(activeTab, item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {item.description || item.answer || item.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {item.category}
                        </span>
                      )}
                      {item.price && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {item.price}
                        </span>
                      )}
                      {item.duration && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {item.duration}
                        </span>
                      )}
                    </div>
                    
                    {item.features && item.features.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center">
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {item.lastUpdated && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {item.lastUpdated}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Edit' : activeTab === 'company' ? 'Edit Company Info' : `Add ${activeTab.slice(0, -1)}`}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {renderForm()}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingItem ? handleUpdate(activeTab) : handleCreate(activeTab)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save size={18} />
                  <span>{editingItem ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}

export default App; 