import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Logout from './Logout';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Footer Text */}
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold">Vault Church</h2>
                    <p className="text-gray-400">Empowering youth for a greater tomorrow.</p>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="https://www.facebook.com/vaulteenz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://www.instagram.com/vault_teenz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                        <FaInstagram size={24} />
                    </a>
                </div>

                
                <div>
                    <Logout />
                </div>
            </div>

            
            <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-800 pt-4">
                &copy; 2024 Life Church. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
