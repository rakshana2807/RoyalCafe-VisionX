"use client";

import Link from "next/link";
import { Coffee, MapPin, Clock, Phone, Mail, Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#EAE0D5] text-primary py-16 border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-serif tracking-tight text-primary">
                RoyalCafe<span className="text-accent">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/80 leading-relaxed max-w-sm mb-6">
              The premier co-working cafe offering dedicated desk spaces, ultra-fast Wi-Fi, and delicious specialty coffee for professionals and learners.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-primary transition-all"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-primary transition-all"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-8 w-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-primary transition-all"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>

            <span className="text-xs text-foreground/60 block">
              &copy; {new Date().getFullYear()} RoyalCafe Connect. All rights reserved.
            </span>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-foreground/80 grid grid-cols-2 gap-x-2">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-accent transition-colors">Menu</Link></li>
              <li><Link href="/live-status" className="hover:text-accent transition-colors">Live Status</Link></li>
              <li><Link href="/work-study" className="hover:text-accent transition-colors">Work &amp; Study</Link></li>
              <li><Link href="/specials" className="hover:text-accent transition-colors">Specials</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-accent transition-colors">Gallery &amp; Contact</Link></li>
              <li><Link href="/reviews" className="hover:text-accent transition-colors">Reviews</Link></li>
              <li><Link href="/book" className="hover:text-accent transition-colors font-bold text-accent">Book Desk</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/gallery-contact" className="hover:text-accent transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Column 3: Opening Hours (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 font-serif">
              Opening Hours
            </h4>
            <ul className="space-y-3 text-xs text-foreground/80">
              <li className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-primary">Mon - Fri</span>
                  <span>7:00 AM - 9:00 PM</span>
                </div>
              </li>
              <li className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-primary">Sat - Sun</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & CTA (3 cols) */}
          <div className="lg:col-span-3 text-left flex flex-col items-start">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 font-serif">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
              <li className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a href="tel:+11234567890" className="hover:text-primary transition-colors">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <Link href="/gallery-contact" className="hover:text-primary transition-colors">
                  hello@royalcafe.connect
                </Link>
              </li>
              <li className="flex gap-2 items-center">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <Link href="/gallery-contact" className="hover:text-primary transition-colors">
                  123 Innovation Way, Tech District
                </Link>
              </li>
            </ul>
            
          </div>

        </div>

      </div>
    </footer>
  );
}
