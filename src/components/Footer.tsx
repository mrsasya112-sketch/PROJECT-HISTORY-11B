import { Heart, Code2 } from "lucide-react";

const FIVERR_LINK = "https://www.fiverr.com/ascheleo/create-html-css-website-and-deliver-source-files";
const WHATSAPP_LINK = "https://wa.me/375299746157";
const FACEBOOK_LINK = "https://www.facebook.com/profile.php?id=61588211300827";

export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-slate-100 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-800 font-semibold">
          <Code2 className="w-5 h-5 text-violet-500" />
          Kystameelion A.
        </div>
        <p className="text-sm text-slate-400">
          HTML & CSS Developer · Professional Web Solutions
        </p>
        
        {/* Social links */}
        <div className="flex justify-center gap-4">
          <a
            href={FIVERR_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            title="Fiverr"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.878-.486l1.435.323c-.351.852-1.177 1.382-2.312 1.382-1.523 0-2.59-1.006-2.59-2.466 0-1.46 1.067-2.466 2.59-2.466 1.488 0 2.466.976 2.466 2.466 0 .146-.029.282-.044.389h-.07zm-1.699-1.012c-.117-.439-.439-.673-.819-.673-.38 0-.703.234-.82.673h1.639zM7.246 11.81c-.547 0-.84.41-.84 1.092v2.466h-1.61V11.81h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316h-.85zm-4.89 3.558H.747v-4.874h1.61v4.874z"/></svg>
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors"
            title="WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            title="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>

        <p className="text-xs text-slate-300 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-400" /> for those who appreciate quality
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-400">
          <a href="#about" className="hover:text-violet-500 transition-colors">About</a>
          <a href="#services" className="hover:text-violet-500 transition-colors">Services</a>
          <a href="#pricing" className="hover:text-violet-500 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-violet-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
