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










// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, CreditCard, Lock, Truck, ShoppingBag, Globe, MapPin, Heart } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useCart } from '@/contexts/CartContext';

// // PayPal SDK script loader
// const loadPayPalScript = (clientId: string) => {
//   return new Promise((resolve, reject) => {
//     if (document.getElementById('paypal-sdk')) {
//       resolve(window.paypal);
//       return;
//     }

//     const script = document.createElement('script');
//     script.id = 'paypal-sdk';
//     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
//     script.onload = () => resolve(window.paypal);
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// export default function CheckoutPage() {
//   const { user } = useAuth();
//   const { cart, refreshCart, clearCart } = useCart();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [customerCountry, setCustomerCountry] = useState('GB');
//   const [detectedLocation, setDetectedLocation] = useState('');
//   const [paypalLoaded, setPaypalLoaded] = useState(false);
//   const paypalRef = useRef(null);

//   const [customerInfo, setCustomerInfo] = useState({
//     name: '',
//     email: user?.email || '',
//     phone: ''
//   });

//   const [shippingAddress, setShippingAddress] = useState({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'GB'
//   });

//   const [billingAddress, setBillingAddress] = useState({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'GB',
//     sameAsShipping: true
//   });

//   // Detect customer's country
//   useEffect(() => {
//     const detectCountry = async () => {
//       try {
//         const response = await fetch('https://ipapi.co/json/');
//         const data = await response.json();
//         const countryCode = data.country_code || 'GB';
//         setCustomerCountry(countryCode);
//         setDetectedLocation(`${data.city}, ${data.country_name}`);
        
//         // Update addresses with detected country
//         setShippingAddress(prev => ({ ...prev, country: countryCode }));
//         setBillingAddress(prev => ({ ...prev, country: countryCode }));
//       } catch (error) {
//         console.error('Location detection failed:', error);
//         setCustomerCountry('GB'); // Default to UK
//       }
//     };

//     detectCountry();
//   }, []);

//   // Load PayPal SDK
//   useEffect(() => {
//     const initPayPal = async () => {
//       try {
//         // Replace with your actual PayPal Client ID
//         const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
//         await loadPayPalScript(PAYPAL_CLIENT_ID);
//         setPaypalLoaded(true);
//       } catch (error) {
//         console.error('Failed to load PayPal SDK:', error);
//       }
//     };

//     if (step === 3) {
//       initPayPal();
//     }
//   }, [step]);

//   // Currency and shipping info based on country
//   const getLocalInfo = (country: string) => {
//     const info: Record<string, any> = {
//       'GB': { currency: 'GBP', symbol: '£', shipping: 5.00, name: 'United Kingdom', flag: '🇬🇧' },
//       'US': { currency: 'USD', symbol: '$', shipping: 15.00, name: 'United States', flag: '🇺🇸' },
//       'AU': { currency: 'AUD', symbol: 'A$', shipping: 20.00, name: 'Australia', flag: '🇦🇺' },
//       'CA': { currency: 'CAD', symbol: 'C$', shipping: 18.00, name: 'Canada', flag: '🇨🇦' },
//       'DE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Germany', flag: '🇩🇪' },
//       'FR': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'France', flag: '🇫🇷' },
//       'NZ': { currency: 'NZD', symbol: 'NZ$', shipping: 22.00, name: 'New Zealand', flag: '🇳🇿' },
//       'NL': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Netherlands', flag: '🇳🇱' },
//       'BE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Belgium', flag: '🇧🇪' },
//       'IT': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Italy', flag: '🇮🇹' },
//       'ES': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Spain', flag: '🇪🇸' },
//       'SE': { currency: 'SEK', symbol: 'kr', shipping: 120.00, name: 'Sweden', flag: '🇸🇪' },
//       'NO': { currency: 'NOK', symbol: 'kr', shipping: 130.00, name: 'Norway', flag: '🇳🇴' },
//       'DK': { currency: 'DKK', symbol: 'kr', shipping: 90.00, name: 'Denmark', flag: '🇩🇰' },
//       'CH': { currency: 'CHF', symbol: 'Fr', shipping: 15.00, name: 'Switzerland', flag: '🇨🇭' },
//       'JP': { currency: 'JPY', symbol: '¥', shipping: 1800, name: 'Japan', flag: '🇯🇵' },
//       'SG': { currency: 'SGD', symbol: 'S$', shipping: 25.00, name: 'Singapore', flag: '🇸🇬' },
//       'HK': { currency: 'HKD', symbol: 'HK$', shipping: 120.00, name: 'Hong Kong', flag: '🇭🇰' },
//     };
    
//     return info[country] || { currency: 'GBP', symbol: '£', shipping: 15.00, name: 'International', flag: '🌍' };
//   };

//   const localInfo = getLocalInfo(customerCountry);

//   // Convert prices to USD for PayPal (PayPal processes in USD)
//   const convertToUSD = (priceLocal: number, fromCurrency: string) => {
//     const exchangeRates: Record<string, number> = {
//       'gbp': 1.27,
//       'eur': 1.09,
//       'aud': 0.66,
//       'cad': 0.74,
//       'sek': 0.095,
//       'nok': 0.093,
//       'dkk': 0.147,
//       'chf': 1.10,
//       'jpy': 0.0067,
//       'sgd': 0.74,
//       'hkd': 0.128,
//       'nzd': 0.61,
//       'usd': 1.00
//     };
    
//     return priceLocal * (exchangeRates[fromCurrency.toLowerCase()] || 1);
//   };

//   const taxRate = 0.08; // 8% tax
//   const cartTotalUSD = cart.items.reduce((total, item) => total + (item.product_price * item.quantity), 0);
//   const shippingCostUSD = convertToUSD(localInfo.shipping, localInfo.currency);
//   const finalShippingCost = cartTotalUSD > 100 ? 0 : shippingCostUSD;
//   const taxAmount = cartTotalUSD * taxRate;
//   const totalAmountUSD = cartTotalUSD + taxAmount + finalShippingCost;

//   // PayPal Button Effect
//   useEffect(() => {
//     if (paypalLoaded && window.paypal && paypalRef.current && step === 3) {
//       // Clear previous PayPal buttons
//       paypalRef.current.innerHTML = '';

//       window.paypal.Buttons({
//         createOrder: (data, actions) => {
//           return actions.order.create({
//             purchase_units: [{
//               amount: {
//                 value: totalAmountUSD.toFixed(2),
//                 currency_code: 'USD',
//                 breakdown: {
//                   item_total: {
//                     currency_code: 'USD',
//                     value: cartTotalUSD.toFixed(2)
//                   },
//                   shipping: {
//                     currency_code: 'USD', 
//                     value: finalShippingCost.toFixed(2)
//                   },
//                   tax_total: {
//                     currency_code: 'USD',
//                     value: taxAmount.toFixed(2)
//                   }
//                 }
//               },
//               items: cart.items.map(item => ({
//                 name: item.product_name,
//                 unit_amount: {
//                   currency_code: 'USD',
//                   value: item.product_price.toFixed(2)
//                 },
//                 quantity: item.quantity.toString(),
//                 description: `${item.size} • ${item.color}`,
//                 category: 'PHYSICAL_GOODS'
//               })),
//               shipping: {
//                 name: {
//                   full_name: customerInfo.name
//                 },
//                 address: {
//                   address_line_1: shippingAddress.street,
//                   admin_area_2: shippingAddress.city,
//                   admin_area_1: shippingAddress.state,
//                   postal_code: shippingAddress.zipCode,
//                   country_code: shippingAddress.country
//                 }
//               }
//             }],
//             application_context: {
//               shipping_preference: 'SET_PROVIDED_ADDRESS'
//             }
//           });
//         },
//         onApprove: async (data, actions) => {
//           setLoading(true);
//           try {
//             const order = await actions.order.capture();
            
//             // Send order data to your backend
//             const response = await fetch('/api/paypal-webhook', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 paypalOrderId: order.id,
//                 orderDetails: order,
//                 customerInfo,
//                 shippingAddress,
//                 billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
//                 cartItems: cart.items,
//                 userId: user.id
//               }),
//             });

//             if (response.ok) {
//               clearCart();
//               router.push(`/order-success?orderId=${order.id}`);
//             } else {
//               throw new Error('Failed to process order');
//             }
//           } catch (error) {
//             console.error('Payment processing error:', error);
//             alert('Payment completed but order processing failed. Please contact support.');
//           } finally {
//             setLoading(false);
//           }
//         },
//         onError: (err) => {
//           console.error('PayPal error:', err);
//           alert('Payment failed. Please try again.');
//           setLoading(false);
//         },
//         onCancel: (data) => {
//           console.log('Payment cancelled:', data);
//           setLoading(false);
//         }
//       }).render(paypalRef.current);
//     }
//   }, [paypalLoaded, step, totalAmountUSD, customerInfo, shippingAddress, billingAddress]);

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth');
//       return;
//     }
//     if (cart.items.length === 0) {
//       router.push('/cart');
//       return;
//     }
//   }, [user, cart.items.length, router]);

//   const validateStep = (stepNumber: number) => {
//     switch (stepNumber) {
//       case 1:
//         return customerInfo.name && customerInfo.email && customerInfo.phone;
//       case 2:
//         return shippingAddress.street && shippingAddress.city && 
//                shippingAddress.state && shippingAddress.zipCode;
//       case 3:
//         if (billingAddress.sameAsShipping) return true;
//         return billingAddress.street && billingAddress.city && 
//                billingAddress.state && billingAddress.zipCode;
//       default:
//         return false;
//     }
//   };

//   if (!user || cart.items.length === 0) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
//           <h1 className="overspray-title text-white text-3xl mb-4">Loading...</h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <div className="pt-20 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Link href="/cart" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Cart
//           </Link>
          
//           <div className="text-center">
//             <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
//               SECURE CHECKOUT
//             </h1>
//             <p className="text-gray-300">
//               Complete your order securely with PayPal
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         {/* Location Detection Banner */}
//         {detectedLocation && (
//           <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-8">
//             <div className="flex items-center space-x-2">
//               <MapPin className="h-5 w-5 text-blue-400" />
//               <span className="text-blue-300">
//                 Shipping to: {detectedLocation} • Payment processed in USD via PayPal
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             {/* Progress Steps */}
//             <div className="flex items-center justify-between mb-8">
//               {[1, 2, 3].map((stepNumber) => (
//                 <div key={stepNumber} className="flex items-center">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
//                     step >= stepNumber ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'
//                   }`}>
//                     {stepNumber}
//                   </div>
//                   {stepNumber < 3 && (
//                     <div className={`w-16 h-0.5 mx-2 ${
//                       step > stepNumber ? 'bg-white' : 'bg-gray-700'
//                     }`} />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Step 1: Customer Information */}
//             {step === 1 && (
//               <div className="space-y-6">
//                 <h2 className="overspray-title text-white text-2xl mb-6">Customer Information</h2>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
//                     <Input
//                       type="text"
//                       value={customerInfo.name}
//                       onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
//                       className="bg-black border-gray-600 text-white"
//                       placeholder="John Doe"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
//                     <Input
//                       type="tel"
//                       value={customerInfo.phone}
//                       onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
//                       className="bg-black border-gray-600 text-white"
//                       placeholder="+44 7700 900123"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
//                   <Input
//                     type="email"
//                     value={customerInfo.email}
//                     onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
//                     className="bg-black border-gray-600 text-white"
//                     placeholder="john@example.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-white mb-2">Shipping Country</label>
//                   <select
//                     value={customerCountry}
//                     onChange={(e) => {
//                       setCustomerCountry(e.target.value);
//                       setShippingAddress(prev => ({ ...prev, country: e.target.value }));
//                       setBillingAddress(prev => ({ ...prev, country: e.target.value }));
//                     }}
//                     className="w-full border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
//                   >
//                     <option value="GB">🇬🇧 United Kingdom</option>
//                     <option value="US">🇺🇸 United States</option>
//                     <option value="AU">🇦🇺 Australia</option>
//                     <option value="CA">🇨🇦 Canada</option>
//                     <option value="DE">🇩🇪 Germany</option>
//                     <option value="FR">🇫🇷 France</option>
//                     <option value="IT">🇮🇹 Italy</option>
//                     <option value="ES">🇪🇸 Spain</option>
//                     <option value="NL">🇳🇱 Netherlands</option>
//                     <option value="BE">🇧🇪 Belgium</option>
//                     <option value="CH">🇨🇭 Switzerland</option>
//                     <option value="SE">🇸🇪 Sweden</option>
//                     <option value="NO">🇳🇴 Norway</option>
//                     <option value="DK">🇩🇰 Denmark</option>
//                     <option value="NZ">🇳🇿 New Zealand</option>
//                     <option value="JP">🇯🇵 Japan</option>
//                     <option value="SG">🇸🇬 Singapore</option>
//                     <option value="HK">🇭🇰 Hong Kong</option>
//                   </select>
//                 </div>

//                 <div className="bg-gray-900 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Globe className="h-4 w-4 text-blue-400" />
//                     <span className="text-blue-400 font-medium">PayPal Payment Info</span>
//                   </div>
//                   <p className="text-sm text-gray-300">
//                     • Payment will be processed in USD via PayPal
//                     <br />
//                     • Shipping cost: {localInfo.symbol}{localInfo.shipping.toFixed(2)} (${shippingCostUSD.toFixed(2)} USD)
//                     <br />
//                     • Secure international payment processing
//                     <br />
//                     • Pay with PayPal balance, bank account, or card
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Shipping Address */}
//             {step === 2 && (
//               <div className="space-y-6">
//                 <h2 className="overspray-title text-white text-2xl mb-6">Shipping Address</h2>
                
//                 <div>
//                   <label className="block text-sm font-medium text-white mb-2">Street Address *</label>
//                   <Input
//                     type="text"
//                     value={shippingAddress.street}
//                     onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
//                     className="bg-black border-gray-600 text-white"
//                     placeholder="123 Main Street"
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">City *</label>
//                     <Input
//                       type="text"
//                       value={shippingAddress.city}
//                       onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
//                       className="bg-black border-gray-600 text-white"
//                       placeholder="London"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">State/County *</label>
//                     <Input
//                       type="text"
//                       value={shippingAddress.state}
//                       onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
//                       className="bg-black border-gray-600 text-white"
//                       placeholder="England"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-white mb-2">Postal Code *</label>
//                     <Input
//                       type="text"
//                       value={shippingAddress.zipCode}
//                       onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
//                       className="bg-black border-gray-600 text-white"
//                       placeholder="SW1A 1AA"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Payment */}
//             {step === 3 && (
//               <div className="space-y-6">
//                 <h2 className="overspray-title text-white text-2xl mb-6">Payment</h2>
                
//                 <div className="flex items-center space-x-2 mb-4">
//                   <input
//                     type="checkbox"
//                     id="sameAsShipping"
//                     checked={billingAddress.sameAsShipping}
//                     onChange={(e) => setBillingAddress({ ...billingAddress, sameAsShipping: e.target.checked })}
//                     className="w-4 h-4"
//                   />
//                   <label htmlFor="sameAsShipping" className="text-white">
//                     Billing address same as shipping address
//                   </label>
//                 </div>
                
//                 {!billingAddress.sameAsShipping && (
//                   <div className="space-y-4 mb-6">
//                     <h3 className="text-lg font-medium text-white">Billing Address</h3>
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2">Street Address *</label>
//                       <Input
//                         type="text"
//                         value={billingAddress.street}
//                         onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
//                         className="bg-black border-gray-600 text-white"
//                         placeholder="123 Main Street"
//                         required
//                       />
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">City *</label>
//                         <Input
//                           type="text"
//                           value={billingAddress.city}
//                           onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
//                           className="bg-black border-gray-600 text-white"
//                           placeholder="London"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">State/County *</label>
//                         <Input
//                           type="text"
//                           value={billingAddress.state}
//                           onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
//                           className="bg-black border-gray-600 text-white"
//                           placeholder="England"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">Postal Code *</label>
//                         <Input
//                           type="text"
//                           value={billingAddress.zipCode}
//                           onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
//                           className="bg-black border-gray-600 text-white"
//                           placeholder="SW1A 1AA"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* PayPal Payment Section */}
//                 <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-6">
//                   <div className="flex items-center space-x-2 mb-4">
//                     <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0070ba">
//                       <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.028 9.028 0 0 1-.408 2.188c-1.59 8.175-7.677 8.894-11.58 8.894l-1.085 6.905h4.606c.46 0 .85-.334.926-.787l.038-.204.73-4.63.047-.254c.077-.453.467-.787.926-.787h.584c3.596 0 6.412-1.461 7.23-5.687.341-1.764.166-3.24-.698-4.256a3.67 3.67 0 0 0-.316-.268z"/>
//                     </svg>
//                     <span className="text-blue-300 font-medium text-lg">Pay with PayPal</span>
//                   </div>
                  
//                   {validateStep(3) ? (
//                     <div>
//                       <p className="text-sm text-gray-300 mb-4">
//                         Click the PayPal button below to complete your payment securely. 
//                         You'll be redirected to PayPal to authorize the payment.
//                       </p>
//                       <div ref={paypalRef} className="paypal-button-container">
//                         {loading && (
//                           <div className="flex items-center justify-center py-8">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                             <span className="ml-2 text-blue-300">Processing payment...</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-red-400">Please complete all required fields above to continue.</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-8">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(Math.max(1, step - 1))}
//                 disabled={step === 1}
//                 className="border-gray-600 text-white hover:bg-gray-800"
//               >
//                 Previous
//               </Button>
              
//               {step < 3 && (
//                 <Button
//                   onClick={() => setStep(step + 1)}
//                   disabled={!validateStep(step)}
//                   className="btn-primary"
//                 >
//                   Next
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="border border-gray-700 rounded-lg p-6 sticky top-24 bg-black">
//               <h2 className="overspray-title text-white text-xl mb-6">Order Summary</h2>
              
//               {/* Items */}
//               <div className="space-y-4 mb-6">
//                 {cart.items.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-3">
//                     <img
//                       src={item.product_image}
//                       alt={item.product_name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
//                       <p className="text-xs text-gray-400">{item.size} • {item.color}</p>
//                       <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
//                     </div>
//                     <p className="text-sm font-medium text-white">
//                       ${(item.product_price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Totals */}
//               <div className="space-y-3 border-t border-gray-700 pt-4">
//                 <div className="flex justify-between text-gray-300">
//                   <span>Subtotal</span>
//                   <span>${cartTotalUSD.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Shipping to {localInfo.name}</span>
//                   <span>{finalShippingCost === 0 ? 'Free' : `${finalShippingCost.toFixed(2)}`}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Estimated Tax</span>
//                   <span>${taxAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-3">
//                   <span>Total (USD)</span>
//                   <span>${totalAmountUSD.toFixed(2)}</span>
//                 </div>
//                 <div className="text-xs text-gray-400 text-center">
//                   ≈ {localInfo.symbol}{(totalAmountUSD / convertToUSD(1, localInfo.currency)).toFixed(2)} {localInfo.currency}
//                 </div>
//               </div>
              
//               {/* Palestine Donation Notice */}
//               <div className="mt-6 bg-white text-black p-4 rounded-lg">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Heart className="h-4 w-4 text-red-500" />
//                   <h3 className="overspray-title text-lg">Supporting Palestine 🇵🇸</h3>
//                 </div>
//                 <p className="text-sm">
//                   25% of your purchase (${(totalAmountUSD * 0.25).toFixed(2)}) will be donated to Palestinian humanitarian aid.
//                 </p>
//               </div>
              
//               {/* Security Notice */}
//               <div className="mt-4 p-3 bg-gray-900 rounded text-center">
//                 <div className="flex items-center justify-center space-x-2 mb-2">
//                   <Lock className="h-4 w-4 text-blue-500" />
//                   <span className="text-sm text-blue-500 font-medium">Secure PayPal Payment</span>
//                 </div>
//                 <p className="text-xs text-gray-400">
//                   Powered by PayPal • Buyer Protection • Secure transactions
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }