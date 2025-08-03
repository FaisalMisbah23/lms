import Link from "next/link";
import React from "react";
import { FiMail, FiPhone, FiMapPin, FiYoutube, FiInstagram, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    resources: [
      { name: "Courses", href: "/courses" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      { name: "YouTube", href: "https://www.youtube.com/", icon: FiYoutube },
      { name: "Instagram", href: "https://www.instagram.com/", icon: FiInstagram },
      { name: "GitHub", href: "https://github.com/", icon: FiGithub },
      { name: "Twitter", href: "https://twitter.com/", icon: FiTwitter },
      { name: "LinkedIn", href: "https://linkedin.com/", icon: FiLinkedin },
    ],
  };

  const contactInfo = [
    { icon: FiPhone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: FiMail, text: "hello@elearning.com", href: "mailto:hello@elearning.com" },
    { icon: FiMapPin, text: "123 Learning St, Education City, EC 12345", href: "#" },
  ];

    return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-responsive py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                Learning
              </span>
                                </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Transform your future with expert-led learning. Join thousands of students worldwide in our comprehensive learning platform.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                                <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                    {link.name}
                                </Link>
                            </li>
              ))}
                        </ul>
                    </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Resources</h3>
                        <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                                <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                    {link.name}
                                </Link>
                            </li>
              ))}
                        </ul>
                    </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Support</h3>
                        <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                                <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                    {link.name}
                                </Link>
                            </li>
              ))}
                        </ul>
                    </div>
                    </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <Link
                key={index}
                href={contact.href}
                className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <contact.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  {contact.text}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
              © 2024 ELearning. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
        </footer>
    );
};

export default Footer;