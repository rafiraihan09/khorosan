'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Contact form submission:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="overspray-title text-white text-5xl lg:text-7xl mb-6">
            GET IN TOUCH
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We aim to reply within 24 hours
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Contact Information - Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
                <h2 className="overspray-title text-white text-2xl lg:text-3xl mb-8">
                  CONTACT INFO
                </h2>
                
                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Email</h3>
                      <p className="text-gray-300">khorosan@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Support Notice */}
                <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <h4 className="text-blue-400 mb-2">Customer Support</h4>
                  <p className="text-blue-200 text-sm">
                    For order inquiries, returns, or product questions, please include your order number in your message.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form - Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
                <h2 className="overspray-title text-white text-2xl lg:text-3xl mb-8">
                  SEND MESSAGE
                </h2>

                {isSubmitted ? (
                  <div className="bg-green-900/50 border border-green-600 p-8 rounded-lg text-center">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl text-green-300 mb-3">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-200">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full bg-black border-gray-600 text-white placeholder-gray-500 focus:border-gray-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email address"
                          className="w-full bg-black border-gray-600 text-white placeholder-gray-500 focus:border-gray-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this message about?"
                        className="w-full bg-black border-gray-600 text-white placeholder-gray-500 focus:border-gray-400 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please provide details about your inquiry..."
                        className="w-full bg-black border-gray-600 text-white placeholder-gray-500 focus:border-gray-400 transition-colors resize-none"
                      />
                      <p className="text-gray-500 text-sm mt-2">
                        Minimum 10 characters required
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                        className="btn-primary w-full sm:w-auto min-w-[200px] h-12"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Form Notice */}
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm">
                        * Required fields. Your information will be kept confidential and used only to respond to your inquiry.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
              QUICK ANSWERS
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Common questions answered instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white mb-3">Order Status</h3>
              <p className="text-gray-300 text-sm">
                Track your order status and shipping updates in your account dashboard.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white mb-3">Returns & Exchanges</h3>
              <p className="text-gray-300 text-sm">
                30-day return policy for unworn items with original tags attached.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white mb-3">Size Guide</h3>
              <p className="text-gray-300 text-sm">
                Check our detailed size charts for the perfect fit on all products.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}