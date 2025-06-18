'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Lock, Truck, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/lib/orders';
import { clearCart } from '@/lib/cart';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: user?.email || '',
    phone: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    sameAsShipping: true
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cardType: ''
  });

  const taxRate = 0.08; // 8% tax
  const shippingCost = cart.totalPrice > 100 ? 0 : 15; // Free shipping over $100
  const taxAmount = cart.totalPrice * taxRate;
  const totalAmount = cart.totalPrice + taxAmount + shippingCost;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    if (cart.items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [user, cart.items.length, router]);

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return '';
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      const formatted = formatCardNumber(value);
      setPaymentInfo({
        ...paymentInfo,
        cardNumber: formatted,
        cardType: detectCardType(value)
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setPaymentInfo({
        ...paymentInfo,
        expiryDate: formatExpiryDate(value)
      });
    }
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return customerInfo.name && customerInfo.email && customerInfo.phone;
      case 2:
        return shippingAddress.street && shippingAddress.city && 
               shippingAddress.state && shippingAddress.zipCode;
      case 3:
        if (billingAddress.sameAsShipping) return true;
        return billingAddress.street && billingAddress.city && 
               billingAddress.state && billingAddress.zipCode;
      case 4:
        return paymentInfo.cardNumber.replace(/\s/g, '').length >= 13 &&
               paymentInfo.expiryDate.length === 5 &&
               paymentInfo.cvv.length >= 3 &&
               paymentInfo.cardholderName;
      default:
        return false;
    }
  };

  const handleSubmitOrder = async () => {
    if (!user || !validateStep(4)) return;

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: shippingAddress,
        billing_address: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
        payment_method: paymentInfo.cardType,
        card_last_four: paymentInfo.cardNumber.slice(-4),
        total_amount: totalAmount,
        tax_amount: taxAmount,
        shipping_amount: shippingCost,
        items: cart.items
      };

      const order = await createOrder(orderData);
      await clearCart(user.id);
      await refreshCart();
      
      // Redirect to order confirmation with order number as query parameter
      router.push(`/order-confirmation?order=${order.order_number}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h1 className="overspray-title text-white text-3xl mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cart" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          
          <div className="text-center">
            <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
              CHECKOUT
            </h1>
            <p className="text-gray-300">
              Complete your order securely
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNumber ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      step > stepNumber ? 'bg-white' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="overspray-title text-white text-2xl mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="bg-black border-gray-600 text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="overspray-title text-white text-2xl mb-6">Shipping Address</h2>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Street Address *</label>
                  <Input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="bg-black border-gray-600 text-white"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">City *</label>
                    <Input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">State *</label>
                    <Input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">ZIP Code *</label>
                    <Input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Billing Address */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="overspray-title text-white text-2xl mb-6">Billing Address</h2>
                
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={billingAddress.sameAsShipping}
                    onChange={(e) => setBillingAddress({ ...billingAddress, sameAsShipping: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="sameAsShipping" className="text-white">
                    Same as shipping address
                  </label>
                </div>
                
                {!billingAddress.sameAsShipping && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Street Address *</label>
                      <Input
                        type="text"
                        value={billingAddress.street}
                        onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                        className="bg-black border-gray-600 text-white"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">City *</label>
                        <Input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">State *</label>
                        <Input
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                          placeholder="NY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">ZIP Code *</label>
                        <Input
                          type="text"
                          value={billingAddress.zipCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Payment Information */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="h-5 w-5 text-green-500" />
                  <h2 className="overspray-title text-white text-2xl">Payment Information</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Cardholder Name *</label>
                  <Input
                    type="text"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                    className="bg-black border-gray-600 text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Card Number *</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={handleCardNumberChange}
                      className="bg-black border-gray-600 text-white pr-16"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    {paymentInfo.cardType && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {paymentInfo.cardType}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Expiry Date *</label>
                    <Input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={handleExpiryChange}
                      className="bg-black border-gray-600 text-white"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">CVV *</label>
                    <Input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setPaymentInfo({ ...paymentInfo, cvv: value });
                        }
                      }}
                      className="bg-black border-gray-600 text-white"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!validateStep(step)}
                  className="btn-primary"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitOrder}
                  disabled={!validateStep(4) || loading}
                  className="btn-primary"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {loading ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-700 rounded-lg p-6 sticky top-24 bg-black">
              <h2 className="overspray-title text-white text-xl mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-400">{item.size} • {item.color}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      ${(item.product_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-3">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gray-900 rounded text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}