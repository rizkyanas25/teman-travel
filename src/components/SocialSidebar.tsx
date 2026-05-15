import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function SocialSidebar() {
  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-400/50 transition" aria-label="Facebook">
        <FaFacebookF className="w-5 h-5" />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-400/50 transition" aria-label="Instagram">
        <FaInstagram className="w-5 h-5" />
      </a>
      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 hover:border-gold-400/50 transition" aria-label="TikTok">
        <FaTiktok className="w-5 h-5" />
      </a>
    </div>
  );
}
