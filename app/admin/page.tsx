'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  Trash2,
  Download,
  Filter,
  X,
  ImageIcon,
  Clock,
  Euro,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader,
  ChevronDown,
  Truck,
  Edit3,
  Save,
} from 'lucide-react';

interface OrderData {
  _id: string;
  id?: string;
  timestamp: string;
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: 'card' | 'paypal' | 'bank';
  };
  printData: {
    type: 'canvas' | 'framed' | 'sticker';
    size: string;
    frameColor?: 'black' | 'silver';
    price: number;
    imageUrl?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'shipped' | 'cancelled';
  trackingId?: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'processing' | 'completed' | 'shipped' | 'cancelled'
  >('all');
  const router = useRouter();
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    loadOrders();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        console.error('Error loading orders:', result.error);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    router.push('/login');
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const cleanFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');

      if (imageUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${cleanFilename}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const downloadUrl = `/api/download-image?url=${encodeURIComponent(
        imageUrl
      )}&filename=${encodeURIComponent(cleanFilename)}`;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = cleanFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Greška pri preuzimanju slike. Molimo pokušajte ponovno.');
    }
  };

  const openOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    setTrackingId(order.trackingId || '');
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
    setIsStatusDropdownOpen(false);
    setTrackingId('');
    setIsEditingTracking(false);
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderData['status'],
    trackingIdValue?: string
  ) => {
    try {
      const body: any = { status: newStatus };
      if (trackingIdValue !== undefined) {
        body.trackingId = trackingIdValue;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        const updatedOrder = { status: newStatus, trackingId: trackingIdValue };
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, ...updatedOrder } : order
          )
        );

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, ...updatedOrder });
        }
      } else {
        console.error('Error updating order status:', result.error);
        alert('Greška pri ažuriranju statusa narudžbe');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Greška pri ažuriranju statusa narudžbe');
    }
  };

  const saveTrackingId = async () => {
    if (selectedOrder && trackingId.trim()) {
      await updateOrderStatus(
        selectedOrder._id,
        selectedOrder.status,
        trackingId.trim()
      );
      setIsEditingTracking(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu narudžbu?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setOrders(orders.filter((order) => order._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) {
          closeOrderDetails();
        }
      } else {
        console.error('Error deleting order:', result.error);
        alert('Greška pri brisanju narudžbe');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Greška pri brisanju narudžbe');
    }
  };

  const exportOrders = () => {
    const csvContent = [
      [
        'ID',
        'Kupac',
        'Email',
        'Telefon',
        'Adresa',
        'Grad',
        'Proizvod',
        'Veličina',
        'Cijena',
        'Status',
        'Tracking ID',
        'Datum',
      ].join(','),
      ...filteredOrders.map((order) =>
        [
          order._id,
          order.customerData.name,
          order.customerData.email,
          order.customerData.phone || '',
          order.customerData.address,
          order.customerData.city,
          getPrintTypeText(order.printData.type),
          order.printData.size,
          order.printData.price,
          getStatusText(order.status),
          order.trackingId || '',
          new Date(order.timestamp).toLocaleDateString('hr-HR'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narudžbe-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-2xl shadow-xl border border-slate-200'>
          <div className='flex items-center space-x-4'>
            <div className='animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full'></div>
            <p className='text-slate-600 font-medium'>Učitavanje...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Loader size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Na čekanju';
      case 'processing':
        return 'U izradi';
      case 'completed':
        return 'Završena';
      case 'shipped':
        return 'Poslana';
      case 'cancelled':
        return 'Otkazana';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card':
        return 'Kartica';
      case 'paypal':
        return 'PayPal';
      case 'bank':
        return 'Bankovna uplata';
      default:
        return method;
    }
  };

  const filterOptions = [
    {
      value: 'all',
      label: 'Sve narudžbe',
      icon: Package,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
    },
    {
      value: 'pending',
      label: 'Na čekanju',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      value: 'processing',
      label: 'U izradi',
      icon: Loader,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      value: 'completed',
      label: 'Završena',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      value: 'shipped',
      label: 'Poslana',
      icon: Truck,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      value: 'cancelled',
      label: 'Otkazana',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  const statusOptions = [
    {
      value: 'pending',
      label: 'Na čekanju',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      value: 'processing',
      label: 'U izradi',
      icon: Loader,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      value: 'completed',
      label: 'Završena',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      value: 'shipped',
      label: 'Poslana',
      icon: Truck,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      value: 'cancelled',
      label: 'Otkazana',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  const handleStatusChange = (newStatus: OrderData['status']) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, newStatus);
      setIsStatusDropdownOpen(false);

      // If status is changed to shipped, enable tracking ID editing
      if (newStatus === 'shipped') {
        setIsEditingTracking(true);
        setTrackingId(selectedOrder.trackingId || '');
      }
    }
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setIsFilterDropdownOpen(false);
  };

  const getFilterIcon = (filterValue: string) => {
    switch (filterValue) {
      case 'all':
        return <Package size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Loader size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Filter size={16} />;
    }
  };

  const getFilterText = (filterValue: string) => {
    switch (filterValue) {
      case 'all':
        return 'Sve narudžbe';
      case 'pending':
        return 'Na čekanju';
      case 'processing':
        return 'U izradi';
      case 'completed':
        return 'Završena';
      case 'shipped':
        return 'Poslana';
      case 'cancelled':
        return 'Otkazana';
      default:
        return 'Filter';
    }
  };

  const getFilterColor = (filterValue: string) => {
    switch (filterValue) {
      case 'all':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-white text-slate-700 border-slate-200';
    }
  };

  const getPrintTypeText = (type: string) => {
    switch (type) {
      case 'canvas':
        return 'Canvas print';
      case 'framed':
        return 'Uokvireni print';
      case 'sticker':
        return 'Zidna naljepnica';
      default:
        return type;
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Package size={24} className='text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-slate-800'>
                  Studio Vista
                </h1>
                <p className='text-sm text-slate-500 font-medium'>
                  Admin Dashboard
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm font-medium text-slate-600'>
                  {localStorage.getItem('adminEmail')}
                </p>
                <p className='text-xs text-slate-400'>Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 px-4 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl font-medium transition-all duration-200'
              >
                <LogOut size={18} />
                <span>Odjava</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>
                  Ukupno narudžbi
                </p>
                <p className='text-3xl font-bold text-slate-800 mt-1'>
                  {orders.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center'>
                <Package className='text-slate-600' size={24} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>Na čekanju</p>
                <p className='text-3xl font-bold text-amber-600 mt-1'>
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center'>
                <Clock className='text-amber-600' size={24} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>U obradi</p>
                <p className='text-3xl font-bold text-blue-600 mt-1'>
                  {orders.filter((o) => o.status === 'processing').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <Loader className='text-blue-600' size={24} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>Završena</p>
                <p className='text-3xl font-bold text-emerald-600 mt-1'>
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center'>
                <CheckCircle className='text-emerald-600' size={24} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600'>Poslana</p>
                <p className='text-3xl font-bold text-indigo-600 mt-1'>
                  {orders.filter((o) => o.status === 'shipped').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center'>
                <Truck className='text-indigo-600' size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div className='flex items-center space-x-4'>
            {/* Custom Filter Dropdown */}
            <div className='relative' ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl border font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 min-w-[180px] justify-between ${getFilterColor(
                  filter
                )}`}
              >
                <div className='flex items-center space-x-3'>
                  {getFilterIcon(filter)}
                  <span>{getFilterText(filter)}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${
                    isFilterDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isFilterDropdownOpen && (
                <div className='absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2'>
                  {filterOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleFilterChange(option.value as typeof filter)
                        }
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 text-left ${
                          filter === option.value ? 'bg-slate-50' : ''
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg ${option.color.replace(
                            'border-',
                            'border '
                          )}`}
                        >
                          <IconComponent size={16} />
                        </div>
                        <div className='flex-1'>
                          <span className='text-sm font-medium text-slate-800'>
                            {option.label}
                          </span>
                          {filter === option.value && (
                            <div className='text-xs text-slate-500 mt-0.5'>
                              Trenutni filter
                            </div>
                          )}
                        </div>
                        {filter === option.value && (
                          <CheckCircle size={16} className='text-emerald-600' />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={exportOrders}
            className='flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5'
          >
            <Download size={18} />
            <span>Izvezi CSV</span>
          </button>
        </div>

        {/* Orders */}
        <div className='space-y-4'>
          {filteredOrders.length === 0 ? (
            <div className='bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60'>
              <div className='w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <Package size={32} className='text-slate-400' />
              </div>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                Nema narudžbi
              </h3>
              <p className='text-slate-500'>
                {filter === 'all'
                  ? 'Trenutno nema narudžbi u sustavu.'
                  : `Nema narudžbi s filterom "${getStatusText(filter)}".`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className='bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between'>
                    {/* Left side - Order Info */}
                    <div className='flex items-center space-x-6 flex-1'>
                      {/* Avatar */}
                      <div className='w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                        <User size={24} className='text-indigo-600' />
                      </div>

                      {/* Order Details */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-3 mb-2'>
                          <h3 className='text-lg font-semibold text-slate-800 truncate'>
                            {order.customerData.name}
                          </h3>
                          <span
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </span>
                        </div>

                        <div className='flex items-center space-x-6 text-sm text-slate-600'>
                          <span className='flex items-center space-x-1.5'>
                            <Mail size={14} />
                            <span>{order.customerData.email}</span>
                          </span>
                          <span className='flex items-center space-x-1.5'>
                            <Calendar size={14} />
                            <span>
                              {new Date(order.timestamp).toLocaleDateString(
                                'hr-HR'
                              )}
                            </span>
                          </span>
                          <span className='flex items-center space-x-1.5 font-semibold text-slate-800'>
                            <Euro size={14} />
                            <span>{order.printData.price}</span>
                          </span>
                        </div>

                        <div className='flex items-center space-x-4 mt-2 text-sm'>
                          <span className='flex items-center space-x-1.5'>
                            <div className='w-2 h-2 bg-indigo-500 rounded-full'></div>
                            <span className='font-medium text-slate-700'>
                              {getPrintTypeText(order.printData.type)}
                            </span>
                          </span>
                          <span className='text-slate-500'>
                            {order.printData.size}
                          </span>
                          {order.printData.frameColor && (
                            <span className='flex items-center space-x-1.5'>
                              <div
                                className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                  order.printData.frameColor === 'black'
                                    ? 'bg-slate-800'
                                    : 'bg-slate-300'
                                }`}
                              ></div>
                              <span className='text-slate-500 capitalize'>
                                {order.printData.frameColor === 'black'
                                  ? 'Crni'
                                  : 'Srebrni'}{' '}
                                okvir
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action Button */}
                    <div className='flex-shrink-0'>
                      <button
                        onClick={() => openOrderDetails(order)}
                        className='flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors duration-200 group-hover:shadow-lg'
                      >
                        <Eye size={16} />
                        <span>Detalji</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className='fixed inset-0 z-50 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 py-8'>
              <div
                className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
                onClick={closeOrderDetails}
              ></div>

              <div className='relative w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden'>
                {/* Modal Header */}
                <div className='bg-slate-50 px-8 py-6 border-b border-slate-200/60'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center'>
                        <FileText size={20} className='text-white' />
                      </div>
                      <div>
                        <h2 className='text-2xl font-bold text-slate-800'>
                          Narudžba #{selectedOrder._id.slice(-8)}
                        </h2>
                        <p className='text-sm text-slate-500 mt-1'>
                          {new Date(selectedOrder.timestamp).toLocaleDateString(
                            'hr-HR',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                      {/* Custom Status Dropdown */}
                      <div className='relative' ref={statusDropdownRef}>
                        <button
                          onClick={() =>
                            setIsStatusDropdownOpen(!isStatusDropdownOpen)
                          }
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-medium text-sm ${getStatusColor(
                            selectedOrder.status
                          )} hover:shadow-sm transition-all duration-200 min-w-[160px] justify-between`}
                        >
                          <div className='flex items-center space-x-2'>
                            {getStatusIcon(selectedOrder.status)}
                            <span>{getStatusText(selectedOrder.status)}</span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 ${
                              isStatusDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isStatusDropdownOpen && (
                          <div className='absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2'>
                            {statusOptions.map((option) => {
                              const IconComponent = option.icon;
                              return (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    handleStatusChange(
                                      option.value as OrderData['status']
                                    )
                                  }
                                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 text-left ${
                                    selectedOrder.status === option.value
                                      ? 'bg-slate-50'
                                      : ''
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${option.color.replace(
                                      'border-',
                                      'border '
                                    )}`}
                                  >
                                    <IconComponent size={16} />
                                  </div>
                                  <div className='flex-1'>
                                    <span className='text-sm font-medium text-slate-800'>
                                      {option.label}
                                    </span>
                                    {selectedOrder.status === option.value && (
                                      <div className='text-xs text-slate-500 mt-0.5'>
                                        Trenutni status
                                      </div>
                                    )}
                                  </div>
                                  {selectedOrder.status === option.value && (
                                    <CheckCircle
                                      size={16}
                                      className='text-emerald-600'
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={closeOrderDetails}
                        className='w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors duration-200'
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className='flex max-h-[calc(100vh-200px)]'>
                  {/* Left Sidebar - Customer & Order Info */}
                  <div className='w-2/5 p-8 bg-slate-50/50 border-r border-slate-200/60 overflow-y-auto'>
                    <div className='space-y-8'>
                      {/* Customer Information */}
                      <div>
                        <div className='flex items-center space-x-3 mb-6'>
                          <div className='w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center'>
                            <User size={20} className='text-indigo-600' />
                          </div>
                          <h3 className='text-lg font-semibold text-slate-800'>
                            Kupac
                          </h3>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex items-start space-x-3'>
                            <User size={16} className='text-slate-400 mt-1' />
                            <div>
                              <p className='font-semibold text-slate-800'>
                                {selectedOrder.customerData.name}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-start space-x-3'>
                            <Mail size={16} className='text-slate-400 mt-1' />
                            <div>
                              <p className='text-slate-600'>
                                {selectedOrder.customerData.email}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-start space-x-3'>
                            <Phone size={16} className='text-slate-400 mt-1' />
                            <div>
                              <p className='text-slate-600'>
                                {selectedOrder.customerData.phone}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-start space-x-3'>
                            <MapPin size={16} className='text-slate-400 mt-1' />
                            <div>
                              <p className='text-slate-600 leading-relaxed'>
                                {selectedOrder.customerData.address}
                                <br />
                                {selectedOrder.customerData.city},{' '}
                                {selectedOrder.customerData.postalCode}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-start space-x-3'>
                            <CreditCard
                              size={16}
                              className='text-slate-400 mt-1'
                            />
                            <div>
                              <p className='text-slate-600'>
                                {getPaymentMethodText(
                                  selectedOrder.customerData.paymentMethod
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Information */}
                      <div>
                        <div className='flex items-center space-x-3 mb-6'>
                          <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                            <Package size={20} className='text-blue-600' />
                          </div>
                          <h3 className='text-lg font-semibold text-slate-800'>
                            Proizvod
                          </h3>
                        </div>

                        <div className='bg-white rounded-2xl p-6 border border-slate-200/60'>
                          <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                              <span className='text-slate-600'>Tip:</span>
                              <span className='font-semibold text-slate-800'>
                                {getPrintTypeText(selectedOrder.printData.type)}
                              </span>
                            </div>

                            <div className='flex items-center justify-between'>
                              <span className='text-slate-600'>Veličina:</span>
                              <span className='font-semibold text-slate-800'>
                                {selectedOrder.printData.size}
                              </span>
                            </div>

                            {selectedOrder.printData.frameColor && (
                              <div className='flex items-center justify-between'>
                                <span className='text-slate-600'>Okvir:</span>
                                <div className='flex items-center space-x-2'>
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                      selectedOrder.printData.frameColor ===
                                      'black'
                                        ? 'bg-slate-800'
                                        : 'bg-slate-300'
                                    }`}
                                  ></div>
                                  <span className='font-semibold text-slate-800 capitalize'>
                                    {selectedOrder.printData.frameColor ===
                                    'black'
                                      ? 'Crna'
                                      : 'Srebrna'}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className='border-t border-slate-200 pt-4'>
                              <div className='flex items-center justify-between'>
                                <span className='text-slate-600'>Ukupno:</span>
                                <span className='text-2xl font-bold text-indigo-600'>
                                  €{selectedOrder.printData.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking ID Section */}
                    {selectedOrder.status === 'shipped' && (
                      <div className='space-y-6 mt-8'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center'>
                            <Truck size={20} className='text-indigo-600' />
                          </div>
                          <h3 className='text-lg font-semibold text-slate-800'>
                            Dostava
                          </h3>
                        </div>

                        <div className='bg-white rounded-2xl p-6 border border-slate-200/60'>
                          {isEditingTracking ? (
                            <div className='space-y-4'>
                              <div>
                                <label className='block text-sm font-medium text-slate-700 mb-2'>
                                  Tracking ID
                                </label>
                                <input
                                  type='text'
                                  value={trackingId}
                                  onChange={(e) =>
                                    setTrackingId(e.target.value)
                                  }
                                  placeholder='Unesite tracking ID...'
                                  className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900'
                                  autoFocus
                                />
                              </div>
                              <div className='flex items-center space-x-3'>
                                <button
                                  onClick={saveTrackingId}
                                  className='flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium'
                                >
                                  <Save size={16} />
                                  <span>Spremi</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditingTracking(false);
                                    setTrackingId(
                                      selectedOrder.trackingId || ''
                                    );
                                  }}
                                  className='px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium'
                                >
                                  Odustani
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className='space-y-4'>
                              <div className='flex items-center justify-between'>
                                <span className='text-slate-600'>
                                  Tracking ID:
                                </span>
                                <button
                                  onClick={() => setIsEditingTracking(true)}
                                  className='flex items-center space-x-1 px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium'
                                >
                                  <Edit3 size={16} />
                                  <span>Uredi</span>
                                </button>
                              </div>
                              <div className='p-3 bg-slate-50 rounded-lg'>
                                <span className='font-mono text-base font-semibold text-slate-800'>
                                  {selectedOrder.trackingId || 'Nije uneseno'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Content - Image & Actions */}
                  <div className='flex-1 p-8 overflow-y-auto'>
                    <div className='space-y-8'>
                      {/* Image Preview */}
                      {selectedOrder.printData.imageUrl ? (
                        <div>
                          <div className='flex items-center space-x-3 mb-6'>
                            <div className='w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center'>
                              <ImageIcon
                                size={20}
                                className='text-emerald-600'
                              />
                            </div>
                            <h3 className='text-lg font-semibold text-slate-800'>
                              Slika za print
                            </h3>
                          </div>

                          <div className='relative group'>
                            <div className='bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/60'>
                              <img
                                src={
                                  selectedOrder.printData.imageUrl.startsWith(
                                    'data:'
                                  )
                                    ? selectedOrder.printData.imageUrl
                                    : `/api/image-proxy?url=${encodeURIComponent(
                                        selectedOrder.printData.imageUrl
                                      )}`
                                }
                                alt='Print image'
                                className='w-full h-80 object-cover'
                                onError={(e) => {
                                  // If proxy fails, try direct URL as fallback
                                  const img = e.target as HTMLImageElement;
                                  if (!img.src.includes('api/image-proxy'))
                                    return;
                                  img.src = selectedOrder.printData.imageUrl;
                                }}
                              />
                            </div>

                            <div className='absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 rounded-2xl transition-all duration-300 flex items-center justify-center'>
                              <button
                                onClick={() => {
                                  const imageUrl =
                                    selectedOrder.printData.imageUrl.startsWith(
                                      'data:'
                                    )
                                      ? selectedOrder.printData.imageUrl
                                      : `/api/image-proxy?url=${encodeURIComponent(
                                          selectedOrder.printData.imageUrl
                                        )}`;
                                  window.open(imageUrl, '_blank');
                                }}
                                className='opacity-0 group-hover:opacity-100 bg-white text-slate-800 px-6 py-3 rounded-xl font-medium shadow-xl transition-all duration-300 flex items-center space-x-2 transform scale-95 group-hover:scale-100'
                              >
                                <Eye size={16} />
                                <span>Otvori u punoj veličini</span>
                              </button>
                            </div>
                          </div>

                          {/* Image Actions */}
                          <div className='flex space-x-4 mt-6'>
                            <button
                              onClick={() => {
                                const imageUrl =
                                  selectedOrder.printData.imageUrl.startsWith(
                                    'data:'
                                  )
                                    ? selectedOrder.printData.imageUrl
                                    : `/api/image-proxy?url=${encodeURIComponent(
                                        selectedOrder.printData.imageUrl
                                      )}`;
                                window.open(imageUrl, '_blank');
                              }}
                              className='flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl'
                            >
                              <Eye size={18} />
                              <span>Pogledaj</span>
                            </button>

                            <button
                              onClick={() =>
                                downloadImage(
                                  selectedOrder.printData.imageUrl!,
                                  `${selectedOrder.customerData.name}-${selectedOrder.printData.type}-${selectedOrder.printData.size}`
                                )
                              }
                              className='flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl'
                            >
                              <Download size={18} />
                              <span>Preuzmi</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className='bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-8 text-center'>
                          <div className='w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <ImageIcon size={24} className='text-amber-600' />
                          </div>
                          <h3 className='text-lg font-semibold text-amber-800 mb-2'>
                            Slika nije uploadana
                          </h3>
                          <p className='text-amber-700'>
                            Kupac još nije uploadao sliku za print. Narudžba je
                            u statusu "Čeka sliku".
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className='border-t border-slate-200 pt-8'>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                'Jeste li sigurni da želite obrisati ovu narudžbu? Ova akcija se ne može poništiti.'
                              )
                            ) {
                              deleteOrder(selectedOrder._id);
                            }
                          }}
                          className='w-full flex items-center justify-center space-x-2 px-6 py-4 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl'
                        >
                          <Trash2 size={18} />
                          <span>Obriši narudžbu</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
