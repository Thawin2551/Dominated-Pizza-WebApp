const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="https://openclipart.org/image/800px/341088" 
            alt="Pizza Logo" 
            className="h-12 w-12"
          />
          <span className="text-white font-semibold text-lg">Dominated Pizza</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
        
        {/* Social Media */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" className="h-6 w-6" alt="fb"/>
          </a>
          <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" className="h-6 w-6" alt="ig"/>
          </a>
          <a href="#" aria-label="LINE" className="hover:opacity-80 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" className="h-6 w-6" alt="line"/>
          </a>
        </div>

        {/* Phone */}
        <div className="text-sm text-white font-semibold">📞 1112</div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs mt-6 text-gray-500 border-t border-gray-800 pt-4">
        © 2010-2025 Dominated Pizza. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;