import React from 'react';
import { BarChart2, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <BarChart2 className="h-6 w-6 text-primary-700" />
            <span className="ml-2 text-lg font-display font-semibold text-primary-700">Truth_Frame</span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Truth_Frame. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-500 hover:text-primary-700">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary-700">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;