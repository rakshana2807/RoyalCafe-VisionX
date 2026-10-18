"use client";

import Link from "next/link";
import { Coffee, MapPin, Clock, Phone, Mail, Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-primary text-background/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 mb-8 border-b border-primary/10 pb-8">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Coffee className="h-8 w-8 text-background stroke-[1.5]" />
              <span className="text-2xl font-semibold font-serif tracking-tight text-background">
                RoyalCafe<span className="text-background ml-1 font-medium">Connect</span>
              </span>
            </Link>
            <p className="text-[14px] text-background leading-relaxed max-w-sm mb-8 font-medium">
              The premier co-working cafe offering dedicated desk spaces, ultra-fast Wi-Fi, and delicious specialty coffee for professionals and learners.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mb-0">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full border border-primary/10 hover:border-accent hover:bg-accent flex items-center justify-center text-background hover:text-background transition-all duration-300"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-10 w-10 rounded-full border border-primary/10 hover:border-accent hover:bg-accent flex items-center justify-center text-background hover:text-background transition-all duration-300"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-10 w-10 rounded-full border border-primary/10 hover:border-accent hover:bg-accent flex items-center justify-center text-background hover:text-background transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background mb-6 font-sans">
              Quick Links
            </h4>
            <ul className="space-y-3 text-[13px] font-medium text-background grid grid-cols-2 gap-x-4">
              <li><Link href="/" className="hover:text-background transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-background transition-colors">Menu</Link></li>
              <li><Link href="/live-status" className="hover:text-background transition-colors">Live Status</Link></li>
              <li><Link href="/work-study" className="hover:text-background transition-colors">Work &amp; Study</Link></li>
              <li><Link href="/specials" className="hover:text-background transition-colors">Specials</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-background transition-colors">Gallery &amp; Contact</Link></li>
              <li><Link href="/reviews" className="hover:text-background transition-colors">Reviews</Link></li>
              <li><Link href="/book" className="hover:text-background transition-colors font-medium text-background">Book Desk</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-background transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Column 3: Opening Hours (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background mb-6 font-sans">
              Opening Hours
            </h4>
            <ul className="space-y-5 text-[13px] text-primary/70 font-medium">
              <li className="flex gap-3 items-start">
                <Clock className="h-4 w-4 text-background shrink-0 mt-0.5 opacity-80" />
                <div>
                  <span className="font-medium block text-background mb-1">Mon - Fri</span>
                  <span className="text-background">7:00 AM - 9:00 PM</span>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Clock className="h-4 w-4 text-background shrink-0 mt-0.5 opacity-80" />
                <div>
                  <span className="font-medium block text-background mb-1">Sat - Sun</span>
                  <span className="text-background">8:00 AM - 8:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & CTA (3 cols) */}
          <div className="lg:col-span-3 text-left flex flex-col items-start">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-background mb-6 font-sans">
              Contact
            </h4>
            <ul className="space-y-4 text-[13px] font-medium text-background mb-8">
              <li className="flex gap-3 items-center">
                <Phone className="h-4 w-4 text-background shrink-0 opacity-80" />
                <a href="tel:+11234567890" className="hover:text-background transition-colors">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-4 w-4 text-background shrink-0 opacity-80" />
                <Link href="/gallery-contact" className="hover:text-background transition-colors">
                  hello@royalcafe.connect
                </Link>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="h-4 w-4 text-background shrink-0 opacity-80" />
                <Link href="/gallery-contact" className="hover:text-background transition-colors">
                  123 Innovation Way, Tech District
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-background/80">
          <span>&copy; {new Date().getFullYear()} RoyalCafe Connect. All rights reserved.</span>
          <span>Designed for luxury workspaces.</span>
        </div>

      </div>
    </footer>
  );
}
