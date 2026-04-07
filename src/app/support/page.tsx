import { MessageCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Footer } from '../components/Footer';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
          <p className="text-lg text-gray-600">
            Get instant answers from our AI or contact our support team
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp Support */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Support</h2>
              <p className="text-sm text-gray-500 mb-6">Instant Answers</p>
              
              <p className="text-sm text-gray-600 mb-6">
                Chat with us on WhatsApp for quick assistance
              </p>

              <Button 
                onClick={() => window.open('https://wa.me/306934541170?text=Hello%2C%20I%20need%20help%20with%20Katia%20Booking', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Average response time: 5 mins
              </p>
            </CardContent>
          </Card>

          {/* Email Us */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Us</h2>
              <p className="text-sm text-gray-500 mb-6">For complex inquiries</p>
              
              <p className="text-sm text-gray-600 mb-6">
                Send us an email and we will get back to you within 24 hours
              </p>

              <a
                href="mailto:katiabooking@gmail.com"
                className="block"
              >
                <Button 
                  variant="outline" 
                  className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  katiabooking@gmail.com
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Send Message Form */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Message</h2>
              <p className="text-sm text-gray-600">
                Can't find what you're looking for? Send us a message
              </p>
            </div>

            <form className="space-y-6">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white bg-no-repeat bg-right pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="">Select Topic</option>
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Question</option>
                  <option value="account">Account Help</option>
                  <option value="partner">Partner Inquiry</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Describe your issue..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                size="lg"
              >
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Looking for quick answers?
          </p>
          <a
            href="#"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Browse our FAQ →
          </a>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}