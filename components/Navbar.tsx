"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Coffee } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", sectionId: "home" },
    { name: "Menu", href: "/menu", sectionId: "menu" },
    { name: "Live Status", href: "/live-status", sectionId: "live-status" },
    { name: "Work & Study", href: "/work-study", sectionId: "work-study" },
    { name: "Specials", href: "/specials", sectionId: "specials" },
    { name: "Gallery & Contact", href: "/gallery-contact", sectionId: "gallery-contact" },
    { name: "Reviews", href: "/reviews", sectionId: "reviews" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId: string) => {
    setIsOpen(false);
    // Only intercept and smooth scroll if clicking a link for the CURRENT active page
    if (pathname === href) {
      const elem = document.getElementById(sectionId);
      if (elem) {
        e.preventDefault();
        window.scrollTo({
          top: elem.offsetTop - 80,
          behavior: "smooth",
        });
      } else if (href === "/") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect shadow-md py-3 border-b border-primary/5 bg-background/90 backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/", "home")}
              className="text-xl font-bold font-serif tracking-tight text-primary flex items-center"
            >
              RoyalCafe<span className="text-accent">Connect</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className={`text-[14px] font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-foreground/80 hover:text-primary hover:font-semibold"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden sm:block">
            <Link
              href="/book"
              onClick={(e) => handleNavClick(e, "/book", "book")}
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 shadow-sm transition-all duration-250 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Desk
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-primary hover:bg-primary/5 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[72px] bg-background/98 backdrop-blur-lg shadow-xl transition-all duration-300 ease-in-out border-b border-primary/10 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
              className="block px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-primary/10 px-4 sm:hidden">
            <Link
              href="/book"
              onClick={(e) => handleNavClick(e, "/book", "book")}
              className="block w-full text-center px-5 py-3 text-base font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 transition-all"
            >
              Book Desk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
