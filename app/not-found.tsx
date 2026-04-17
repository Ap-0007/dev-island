import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="bento-glass p-16 max-w-lg relative overflow-hidden backdrop-blur-3xl">
        <div className="bg-grain opacity-5" />
        
        <div className="mb-8 text-8xl font-black aura-text animate-pulse">
           404
        </div>
        
        <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white">
          LOST IN THE VOID
        </h2>
        
        <p className="mb-10 text-white/40 font-medium leading-relaxed">
          This sector hasn&apos;t been synced yet. The coordinates you followed 
          lead into deep space.
        </p>
        
        <Link 
          href="/" 
          className="btn-hype !px-12"
        >
          RETURN TO HUB
        </Link>
      </div>
      
      {/* Decorative Aura Shimmer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
