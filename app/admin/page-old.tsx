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
  const [spacesConfigured, setSpacesConfigured] = useState<boolean | null>(
    null
  );
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

      // For DigitalOcean Spaces URLs, warn if not configured
      if (imageUrl.includes('.digitaloceanspaces.com')) {
        // Show warning that DO Spaces needs to be configured
        if (
          !confirm(
            '⚠️ DigitalOcean Spaces pokušaj preuzimanja...\n\nAko preuzimanje ne radi, to znači da DO Spaces nije konfiguriran.\nPogledajte DIGITALOCEAN_SETUP.md datoteku.\n\nŽelite pokušati preuzimanje?'
          )
        ) {
          return;
        }
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
        // Update local state
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      } else {
        console.error('Error updating order:', result.error);
        alert('Error updating order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
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
        // Update local state
        const updatedOrders = orders.filter((order) => order._id !== orderId);
        setOrders(updatedOrders);
      } else {
        console.error('Error deleting order:', result.error);
        alert('Error deleting order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studio-vista-orders.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        return 'Bankovni transfer';
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-4'>
              <Package size={24} className='text-gray-900' />
              <div>
                <h1 className='text-xl font-bold text-gray-900'>
                  Studio Vista Admin
                </h1>
                <p className='text-sm text-gray-600'>Upravljanje narudžbama</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <LogOut size={20} />
              Odjavi se
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Ukupno narudžbi</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {orders.length}
                </p>
              </div>
              <Package className='text-blue-600' size={32} />
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
              onChange={(e) =>
                setFilter(
                  e.target.value as
                    | 'all'
                    | 'pending'
                    | 'awaiting_image'
                    | 'processing'
                    | 'completed'
                )
              }
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

        {/* Orders Table */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          {filteredOrders.length === 0 ? (
            <div className='text-center py-12'>
              <Package size={48} className='mx-auto text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Nema narudžbi
              </h3>
              <p className='text-gray-600'>
                {filter === 'all'
                  ? 'Još nema poslanih narudžbi.'
                  : `Nema narudžbi sa statusom "${getStatusText(filter)}".`}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Narudžba
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Kupac
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Proizvod
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Akcije
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            #{order._id.slice(-8)}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {new Date(order.timestamp).toLocaleDateString(
                              'hr-HR',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <User size={16} className='text-gray-400' />
                            <span className='text-sm font-medium text-gray-900'>
                              {order.customerData.name}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 mt-1'>
                            <Mail size={16} className='text-gray-400' />
                            <span className='text-sm text-gray-500'>
                              {order.customerData.email}
                            </span>
                          </div>
                          {order.customerData.phone && (
                            <div className='flex items-center gap-2 mt-1'>
                              <Phone size={16} className='text-gray-400' />
                              <span className='text-sm text-gray-500'>
                                {order.customerData.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {getPrintTypeText(order.printData.type)}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {order.printData.size}
                            {order.printData.frameColor &&
                              ` • ${
                                order.printData.frameColor === 'black'
                                  ? 'Crni'
                                  : 'Srebrni'
                              } okvir`}
                          </div>
                          <div className='text-sm font-medium text-green-600'>
                            €{order.printData.price}
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap'>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order._id,
                              e.target.value as OrderData['status']
                            )
                          }
                          className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value='pending'>Na čekanju</option>
                          <option value='awaiting_image'>Čeka sliku</option>
                          <option value='processing'>U obradi</option>
                          <option value='completed'>Završeno</option>
                          <option value='cancelled'>Otkazano</option>
                        </select>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex items-center gap-2'>
                          {order.printData.imageUrl && (
                            <>
                              <button
                                onClick={() =>
                                  window.open(
                                    order.printData.imageUrl,
                                    '_blank'
                                  )
                                }
                                className='text-blue-600 hover:text-blue-800'
                                title='Pogledaj sliku'
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  downloadImage(
                                    order.printData.imageUrl!,
                                    `${order.customerData.name}-${order.printData.type}-${order.printData.size}`
                                  )
                                }
                                className='text-green-600 hover:text-green-800'
                                title='Preuzmi sliku'
                              >
                                <Download size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className='text-red-600 hover:text-red-800'
                            title='Obriši narudžbu'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
