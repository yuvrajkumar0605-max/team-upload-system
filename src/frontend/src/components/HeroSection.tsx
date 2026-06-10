import { useBanner } from "../hooks/useQueries";

export default function HeroSection() {
  const { data: banner, isLoading } = useBanner();

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          {/* Banner area */}
          <div className="relative w-full">
            {!isLoading && banner ? (
              <img
                src={banner.image.getDirectURL()}
                alt="GameDom"
                className="w-full h-auto object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              /* Fallback: dark gradient placeholder when no banner is set */
              <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
              </div>
            )}
            {/* Gradient overlay for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 drop-shadow-lg">
              GameDom
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 drop-shadow-md">
              Register your team and compete for glory
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
