'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  status:
    | 'pending'
    | 'awaiting_image'
    | 'processing'
    | 'completed'
    | 'cancelled';
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filter, setFilter] = useState<
    | 'all'
    | 'pending'
    | 'awaiting_image'
    | 'processing'
    | 'completed'
    | 'cancelled'
  >('all');
  const router = useRouter();

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

      // Check if this is a base64 image (temporary preview)
      if (imageUrl.startsWith('data:')) {
        // Handle base64 download directly
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${cleanFilename}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Use our API endpoint to proxy the download
      const downloadUrl = `/api/download-image?url=${encodeURIComponent(
        imageUrl
      )}&filename=${encodeURIComponent(cleanFilename)}`;

      // Create download link
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
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderData['status']
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Also update selectedOrder if it's the same order
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
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
        // Close modal if the deleted order was selected
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
          order.printData.type,
          order.printData.size,
          order.printData.price,
          order.status,
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
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-sm'>
          <div className='animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full mx-auto'></div>
          <p className='text-center text-gray-600 mt-4'>Učitavanje...</p>
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
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_image':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Na čekanju';
      case 'awaiting_image':
        return 'Čeka sliku';
      case 'processing':
        return 'U obradi';
      case 'completed':
        return 'Završeno';
      case 'cancelled':
        return 'Otkazano';
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
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Studio Vista Admin
              </h1>
            </div>

            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                {localStorage.getItem('adminEmail')}
              </span>
              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors'
              >
                <LogOut size={16} />
                Odjava
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Ukupno narudžbi</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {orders.length}
                </p>
              </div>
              <Package className='text-gray-600' size={32} />
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Na čekanju</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <Calendar className='text-yellow-600' size={32} />
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>U obradi</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {orders.filter((o) => o.status === 'processing').length}
                </p>
              </div>
              <Package className='text-blue-600' size={32} />
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Završeno</p>
                <p className='text-2xl font-bold text-green-600'>
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
              </div>
              <Package className='text-green-600' size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div className='flex items-center gap-4'>
            <Filter size={20} className='text-gray-400' />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>Sve narudžbe</option>
              <option value='pending'>Na čekanju</option>
              <option value='awaiting_image'>Čeka sliku</option>
              <option value='processing'>U obradi</option>
              <option value='completed'>Završeno</option>
              <option value='cancelled'>Otkazano</option>
            </select>
          </div>

          <button
            onClick={exportOrders}
            className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
          >
            <Download size={20} />
            Izvezi sve
          </button>
        </div>

        {/* Orders Grid */}
        <div className='grid gap-4'>
          {filteredOrders.length === 0 ? (
            <div className='bg-white rounded-xl p-8 text-center shadow-sm'>
              <Package size={48} className='mx-auto text-gray-400 mb-4' />
              <p className='text-gray-600 text-lg font-medium'>Nema narudžbi</p>
              <p className='text-gray-500 text-sm mt-1'>
                {filter === 'all'
                  ? 'Trenutno nema narudžbi u sustavu.'
                  : `Nema narudžbi s filterom "${getStatusText(filter)}".`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className='bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between'>
                    {/* Left side - Order Info */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-4 mb-3'>
                        <div className='flex-shrink-0'>
                          <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
                            <Package size={24} className='text-gray-600' />
                          </div>
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-3 mb-1'>
                            <h3 className='text-lg font-semibold text-gray-900 truncate'>
                              {order.customerData.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>

                          <div className='flex items-center gap-4 text-sm text-gray-600'>
                            <span className='flex items-center gap-1'>
                              <Mail size={14} />
                              {order.customerData.email}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Calendar size={14} />
                              {new Date(order.timestamp).toLocaleDateString(
                                'hr-HR'
                              )}
                            </span>
                            <span className='font-medium text-gray-900'>
                              €{order.printData.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className='flex items-center gap-6 text-sm'>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                          <span className='font-medium capitalize'>
                            {getPrintTypeText(order.printData.type)}
                          </span>
                        </div>
                        <div className='text-gray-600'>
                          {order.printData.size}
                        </div>
                        {order.printData.frameColor && (
                          <div className='flex items-center gap-1'>
                            <div
                              className={`w-3 h-3 rounded-full border ${
                                order.printData.frameColor === 'black'
                                  ? 'bg-gray-800'
                                  : 'bg-gray-300'
                              }`}
                            ></div>
                            <span className='text-gray-600 capitalize'>
                              {order.printData.frameColor === 'black'
                                ? 'Crni'
                                : 'Srebrni'}{' '}
                              okvir
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Action Button */}
                    <div className='flex-shrink-0 ml-6'>
                      <button
                        onClick={() => openOrderDetails(order)}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors'
                      >
                        <Eye size={16} />
                        Detalji
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
            <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
              <div
                className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
                onClick={closeOrderDetails}
              ></div>

              <div className='inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle'>
                {/* Modal Header */}
                <div className='flex items-center justify-between pb-4 border-b border-gray-200'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900'>
                      Detalji narudžbe
                    </h2>
                    <p className='text-sm text-gray-500 mt-1'>
                      ID: #{selectedOrder._id.slice(-8)}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          selectedOrder._id,
                          e.target.value as OrderData['status']
                        )
                      }
                      className={`text-sm font-medium px-3 py-2 rounded-lg border-0 ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      <option value='pending'>Na čekanju</option>
                      <option value='awaiting_image'>Čeka sliku</option>
                      <option value='processing'>U obradi</option>
                      <option value='completed'>Završeno</option>
                      <option value='cancelled'>Otkazano</option>
                    </select>
                    <button
                      onClick={closeOrderDetails}
                      className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 py-6'>
                  {/* Left Column - Customer & Order Info */}
                  <div className='space-y-6'>
                    {/* Customer Information */}
                    <div className='bg-gray-50 rounded-xl p-6'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <User size={20} className='text-gray-600' />
                        Podaci kupca
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <User size={16} className='text-gray-500' />
                          <span className='font-medium'>
                            {selectedOrder.customerData.name}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Mail size={16} className='text-gray-500' />
                          <span className='text-gray-700'>
                            {selectedOrder.customerData.email}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Phone size={16} className='text-gray-500' />
                          <span className='text-gray-700'>
                            {selectedOrder.customerData.phone}
                          </span>
                        </div>
                        <div className='flex items-start gap-3'>
                          <MapPin size={16} className='text-gray-500 mt-0.5' />
                          <div className='text-gray-700'>
                            {selectedOrder.customerData.address}
                            <br />
                            {selectedOrder.customerData.city},{' '}
                            {selectedOrder.customerData.postalCode}
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <CreditCard size={16} className='text-gray-500' />
                          <span className='text-gray-700'>
                            {getPaymentMethodText(
                              selectedOrder.customerData.paymentMethod
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className='bg-blue-50 rounded-xl p-6'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <Package size={20} className='text-blue-600' />
                        Detalji proizvoda
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Tip:</span>
                          <span className='font-medium'>
                            {getPrintTypeText(selectedOrder.printData.type)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Veličina:</span>
                          <span className='font-medium'>
                            {selectedOrder.printData.size}
                          </span>
                        </div>
                        {selectedOrder.printData.frameColor && (
                          <div className='flex items-center justify-between'>
                            <span className='text-gray-600'>Boja okvira:</span>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-4 h-4 rounded-full border ${
                                  selectedOrder.printData.frameColor === 'black'
                                    ? 'bg-gray-800'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                              <span className='font-medium capitalize'>
                                {selectedOrder.printData.frameColor === 'black'
                                  ? 'Crna'
                                  : 'Srebrna'}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className='flex items-center justify-between pt-3 border-t border-blue-200'>
                          <span className='text-gray-600'>Ukupno:</span>
                          <span className='text-xl font-bold text-blue-600'>
                            €{selectedOrder.printData.price}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-600'>Datum narudžbe:</span>
                          <span className='font-medium'>
                            {new Date(
                              selectedOrder.timestamp
                            ).toLocaleDateString('hr-HR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image & Actions */}
                  <div className='space-y-6'>
                    {/* Image Preview */}
                    {selectedOrder.printData.imageUrl ? (
                      <div className='bg-gray-50 rounded-xl p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                          <ImageIcon size={20} className='text-gray-600' />
                          Slika za print
                        </h3>
                        <div className='relative group'>
                          <Image
                            src={selectedOrder.printData.imageUrl}
                            alt='Print image'
                            width={400}
                            height={300}
                            className='w-full h-64 object-cover rounded-lg border border-gray-200'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center'>
                            <button
                              onClick={() =>
                                window.open(
                                  selectedOrder.printData.imageUrl,
                                  '_blank'
                                )
                              }
                              className='opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2'
                            >
                              <Eye size={16} />
                              Otvori u novoj kartici
                            </button>
                          </div>
                        </div>

                        {/* Image Actions */}
                        <div className='flex gap-3 mt-4'>
                          <button
                            onClick={() =>
                              window.open(
                                selectedOrder.printData.imageUrl,
                                '_blank'
                              )
                            }
                            className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                          >
                            <Eye size={16} />
                            Pogledaj
                          </button>
                          <button
                            onClick={() =>
                              downloadImage(
                                selectedOrder.printData.imageUrl!,
                                `${selectedOrder.customerData.name}-${selectedOrder.printData.type}-${selectedOrder.printData.size}`
                              )
                            }
                            className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                          >
                            <Download size={16} />
                            Preuzmi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-6'>
                        <div className='flex items-center gap-3 mb-3'>
                          <ImageIcon size={20} className='text-yellow-600' />
                          <h3 className='text-lg font-semibold text-yellow-900'>
                            Slika nije uploadana
                          </h3>
                        </div>
                        <p className='text-yellow-800 text-sm'>
                          Kupac još nije uploadao sliku za print. Narudžba je u
                          statusu "Čeka sliku".
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className='space-y-3'>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              'Jeste li sigurni da želite obrisati ovu narudžbu? Ova akcija se ne može poništiti.'
                            )
                          ) {
                            deleteOrder(selectedOrder._id);
                            closeOrderDetails();
                          }
                        }}
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                      >
                        <Trash2 size={16} />
                        Obriši narudžbu
                      </button>
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
