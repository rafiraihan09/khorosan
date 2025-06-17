'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { getOrderByNumber } from '@/lib/orders';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: string;
  created_at: string;
  items: any[];
}

export default function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderByNumber(params.orderNumber);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-6 animate-pulse" />
          <h1 className="overspray-title text-white text-3xl mb-4">Loading Order...</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h1 className="overspray-title text-white text-3xl mb-4">Order Not Found</h1>
          <Link href="/">
            <Button className="btn-primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
            ORDER CONFIRMED
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Thank you for your order, {order.customer_name}!
          </p>
          <p className="text-gray-400">
            Order #{order.order_number}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Order Status */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Order Status</h2>
              <Badge className="bg-yellow-600 text-white">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Order Date</p>
              <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Items */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h2 className="overspray-title text-white text-xl mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.product_name}</h3>
                    <p className="text-sm text-gray-400">{item.size} • {item.color}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${(order.total_amount - order.tax_amount - order.shipping_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>${order.shipping_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Contact */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-5 w-5 text-white" />
                <h2 className="overspray-title text-white text-lg">Shipping Address</h2>
              </div>
              <div className="text-gray-300">
                <p>{order.customer_name}</p>
                <p>{order.shipping_address.street}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h2 className="overspray-title text-white text-lg mb-4">Contact Information</h2>
              <div className="text-gray-300 space-y-1">
                <p>Email: {order.customer_email}</p>
                <p>Phone: {order.customer_phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="overspray-title text-white text-xl mb-4">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Processing</h3>
              <p className="text-sm text-gray-400">We're preparing your order</p>
            </div>
            <div>
              <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Shipping</h3>
              <p className="text-sm text-gray-400">Your order will ship within 2-3 business days</p>
            </div>
            <div>
              <Home className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Delivery</h3>
              <p className="text-sm text-gray-400">Estimated delivery in 5-7 business days</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-300">
            A confirmation email has been sent to {order.customer_email}
          </p>
          <div className="space-x-4">
            <Link href="/shop">
              <Button className="btn-primary">Continue Shopping</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="btn-secondary">View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}