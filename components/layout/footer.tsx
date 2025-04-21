import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { AIChatSupport } from "@/components/chat/ai-chat-support"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <Logo size="md" variant="full" type="brain" />
              </div>
              <p className="mt-4 text-sm text-gray-600 max-w-xs">
                Remindr AI helps you stay organized with intelligent reminders, task management, and AI-powered
                productivity tools.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/calendar" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Teams
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">support@remindr.ai</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">123 Productivity Lane, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <p className="text-xs text-gray-500">© {currentYear} Remindr AI. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  Cookies
                </a>
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by Remindr Team
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stay updated with Remindr AI</h3>
            <p className="mt-2 text-sm text-gray-600">
              Subscribe to our newsletter for the latest features, tips, and updates.
            </p>
          </div>
          <div className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-1" aria-label="Email for newsletter" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      {/* AI Chat Support */}
      <AIChatSupport />
    </footer>
  )
}
