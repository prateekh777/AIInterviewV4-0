import React from "react";
import { Link } from "wouter";
import Logo from "../ui/logo";
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube, 
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo className="bg-primary" />
            </div>
            
            <div className="flex mt-4">
              <a href="#" className="text-neutral-400 hover:text-white mr-4">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white mr-4">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white mr-4">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <div className="mt-4">
              <div className="relative">
                <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/jobs"><a className="hover:text-white">All jobs</a></Link></li>
              <li><Link href="/companies"><a className="hover:text-white">Companies</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-white">Categories</a></Link></li>
              <li><Link href="/candidates"><a className="hover:text-white">Candidates</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/blog"><a className="hover:text-white">Blog</a></Link></li>
              <li><Link href="/guides"><a className="hover:text-white">User guides</a></Link></li>
              <li><Link href="/webinars"><a className="hover:text-white">Webinars</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/about"><a className="hover:text-white">About</a></Link></li>
              <li><Link href="/careers"><a className="hover:text-white">Join us</a></Link></li>
            </ul>
            
            <h3 className="text-lg font-medium mb-4 mt-6">Subscribe to our newsletter</h3>
            <p className="text-neutral-400 text-sm mb-4">For product announcements and exclusive insights</p>
            
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow py-2 px-3 bg-neutral-800 border border-neutral-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary text-white"
              />
              <Button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-r-md transition duration-150">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-neutral-400 text-sm">
          <div>© 2023 TalentFlow, Inc. • <a href="#" className="hover:text-white">Privacy</a> • <a href="#" className="hover:text-white">Terms</a> • <a href="#" className="hover:text-white">Sitemap</a></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
