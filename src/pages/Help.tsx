import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Truck, ShieldCheck, PhoneCall, Mail, Clock } from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Everything you need to know about shopping, delivery, and Cash on Delivery
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">How does Cash on Delivery work?</h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            With Cash on Delivery (COD), you do not need to make an advance payment online. When the courier executive arrives at your doorstep with the package, you inspect the parcel seal and pay the exact amount using physical cash or scan-and-pay UPI directly to the courier.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">What are the delivery charges?</h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            We provide complimentary standard delivery across India on all orders exceeding ₹999. For orders below ₹999, a nominal standard fulfillment fee of ₹99 applies.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">How do I track my order?</h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            Once you have placed an order, visit the <Link to="/orders" className="text-neutral-900 font-semibold underline">My Orders</Link> section from the top navigation. There you can monitor real-time order status updates: Order Placed, Processing, Shipped, and Delivered.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">Can I cancel an order?</h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            Orders can be cancelled before they transition to the Shipped state. Please reach out to customer care with your Order ID for immediate assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-neutral-950">
          Contact Trend Mart
        </h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          Reach our dedicated support coordinators for assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-3">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">Email Support</h2>
          <p className="text-xs text-neutral-500">For order inquiries, delivery updates, and product queries:</p>
          <p className="text-sm font-semibold text-neutral-950">support@trendmart.com</p>
          <p className="text-xs text-neutral-400">Response within 4 business hours</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xs p-6 space-y-3">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">Customer Helpline</h2>
          <p className="text-xs text-neutral-500">Available Monday through Saturday, 9:00 AM – 7:00 PM IST:</p>
          <p className="text-sm font-semibold text-neutral-950">+91 (800) 123-4567</p>
          <p className="text-xs text-neutral-400">Toll-free across domestic networks</p>
        </div>
      </div>
    </div>
  );
};
