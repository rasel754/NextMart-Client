import Logo from "@/assets/svgs/Logo";
import { Facebook, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQs" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  const customerService = [
    { href: "/contact", label: "Contact Us" },
    { href: "/cart", label: "Shopping Cart" },
    { href: "/faq", label: "Returns & Exchanges" },
    { href: "/privacy", label: "Terms of Service" },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t border-border/80 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-black flex items-center gap-1.5">
                <Logo />
                <span className="text-[#3b49df] dark:text-[#5865f2]">Next</span>
                <span className="text-[#10b981]">Mart</span>
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium destination for the finest gadgets, home essentials, apparel, and active items. Shop safely and experience next-level digital commerce.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground uppercase tracking-wider">
              Customer Support
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-4">
            <h3 className="font-bold text-base mb-4 text-foreground uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Gulshan-2, Dhaka, Bangladesh</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@nextmart.com</span>
              </li>
            </ul>

            <div className="flex space-x-3 pt-2">
              {socialLinks.map(({ href, icon: Icon, label }, index) => (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="p-2 rounded-full border border-border/80 text-muted-foreground hover:text-primary hover:border-primary transition"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border/60 my-6" />

        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NextMart Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
