export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          {/* Banner Image with lazy loading */}
          <div className="relative w-full">
            <img
              src="/assets/BANNER.png"
              alt="BOOYAH Battle of Supremacy"
              className="w-full h-auto object-contain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {/* Enhanced Gradient Overlay for Better Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-gray-100/95 dark:via-gray-100/60 dark:to-transparent" />
          </div>
          
          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              BOOYAH Battle of Supremacy
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 drop-shadow-md">
              Register your team and compete for glory
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
