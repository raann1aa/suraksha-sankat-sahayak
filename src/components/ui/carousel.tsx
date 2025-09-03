import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Square,
  Circle,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Settings,
  Download,
  Share2,
  Bookmark,
  Heart,
  Star,
  MessageCircle,
  User,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

// Enhanced carousel variants
const carouselVariants = cva("relative", {
  variants: {
    variant: {
      default: "",
      card: "rounded-lg border shadow-sm bg-card",
      ghost: "bg-transparent",
      filled: "bg-muted/50 rounded-lg",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const navigationVariants = cva(
  "absolute h-8 w-8 rounded-full z-10 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        floating: "shadow-lg hover:shadow-xl",
        minimal: "bg-transparent border-0 hover:bg-accent",
        filled: "bg-background border-2",
      },
      position: {
        inside: "",
        outside: "",
        overlay: "bg-black/20 backdrop-blur-sm text-white hover:bg-black/40",
      },
      size: {
        sm: "h-6 w-6",
        default: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "inside",
      size: "default",
    },
  }
);

// Enhanced carousel interfaces
interface CarouselSlide {
  id: string;
  content: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
}

interface CarouselProps extends VariantProps<typeof carouselVariants> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  slides?: CarouselSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showProgress?: boolean;
  showCounter?: boolean;
  showThumbnails?: boolean;
  showFullscreen?: boolean;
  dragFree?: boolean;
  containScroll?: boolean | "trimSnaps" | "keepSnaps";
  align?: "start" | "center" | "end";
  skipSnaps?: boolean;
  inViewThreshold?: number;
  navigationVariant?: VariantProps<typeof navigationVariants>["variant"];
  navigationPosition?: VariantProps<typeof navigationVariants>["position"];
  navigationSize?: VariantProps<typeof navigationVariants>["size"];
  arrowIcon?: "chevron" | "arrow";
  dotShape?: "circle" | "square" | "dash";
  onSlideChange?: (index: number) => void;
  onAutoplayToggle?: (playing: boolean) => void;
  className?: string;
  contentClassName?: string;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentIndex: number;
  slideCount: number;
  isAutoplay: boolean;
  toggleAutoplay: () => void;
  scrollToIndex: (index: number) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  selectedSnapIndex: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      variant,
      size,
      opts,
      setApi,
      plugins,
      slides = [],
      autoplay = false,
      autoplayDelay = 3000,
      loop = false,
      slidesToShow = 1,
      slidesToScroll = 1,
      showDots = false,
      showArrows = true,
      showProgress = false,
      showCounter = false,
      showThumbnails = false,
      showFullscreen = false,
      dragFree = false,
      containScroll = "trimSnaps",
      align = "center",
      skipSnaps = false,
      inViewThreshold = 0.7,
      navigationVariant = "default",
      navigationPosition = "inside",
      navigationSize = "default",
      arrowIcon = "chevron",
      dotShape = "circle",
      onSlideChange,
      onAutoplayToggle,
      className,
      contentClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        loop,
        slidesToScroll,
        align,
        skipSnaps,
        containScroll,
        dragFree,
        inViewThreshold,
      },
      plugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [selectedSnapIndex, setSelectedSnapIndex] = React.useState(0);
    const [slideCount, setSlideCount] = React.useState(0);
    const [isAutoplay, setIsAutoplay] = React.useState(autoplay);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const autoplayRef = React.useRef<NodeJS.Timeout>();

    const onSelect = React.useCallback(
      (api: CarouselApi) => {
        if (!api) return;

        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        setCurrentIndex(api.selectedScrollSnap());
        setSelectedSnapIndex(api.selectedScrollSnap());
        setSlideCount(api.slideNodes().length);

        onSlideChange?.(api.selectedScrollSnap());
      },
      [onSlideChange]
    );

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const scrollToIndex = React.useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api]
    );

    // Enhanced keyboard navigation
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key, ctrlKey, shiftKey } = event;

        switch (key) {
          case "ArrowLeft":
            if (orientation === "horizontal") {
              event.preventDefault();
              scrollPrev();
            }
            break;
          case "ArrowRight":
            if (orientation === "horizontal") {
              event.preventDefault();
              scrollNext();
            }
            break;
          case "ArrowUp":
            if (orientation === "vertical") {
              event.preventDefault();
              scrollPrev();
            }
            break;
          case "ArrowDown":
            if (orientation === "vertical") {
              event.preventDefault();
              scrollNext();
            }
            break;
          case "Home":
            event.preventDefault();
            scrollToIndex(0);
            break;
          case "End":
            event.preventDefault();
            scrollToIndex(slideCount - 1);
            break;
          case " ":
            event.preventDefault();
            toggleAutoplay();
            break;
          case "f":
          case "F":
            if (showFullscreen) {
              event.preventDefault();
              toggleFullscreen();
            }
            break;
          default:
            // Number keys for direct slide navigation
            if (/^[1-9]$/.test(key)) {
              const slideIndex = parseInt(key) - 1;
              if (slideIndex < slideCount) {
                event.preventDefault();
                scrollToIndex(slideIndex);
              }
            }
            break;
        }
      },
      [
        orientation,
        scrollPrev,
        scrollNext,
        scrollToIndex,
        slideCount,
        showFullscreen,
      ]
    );

    // Autoplay functionality
    const startAutoplay = React.useCallback(() => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        if (api) {
          if (api.canScrollNext()) {
            api.scrollNext();
          } else if (loop) {
            api.scrollTo(0);
          } else {
            setIsAutoplay(false);
            onAutoplayToggle?.(false);
          }
        }
      }, autoplayDelay);
    }, [api, autoplayDelay, loop, onAutoplayToggle]);

    const stopAutoplay = React.useCallback(() => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = undefined;
      }
    }, []);

    const toggleAutoplay = React.useCallback(() => {
      const newAutoplay = !isAutoplay;
      setIsAutoplay(newAutoplay);
      onAutoplayToggle?.(newAutoplay);

      if (newAutoplay) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    }, [isAutoplay, startAutoplay, stopAutoplay, onAutoplayToggle]);

    // Fullscreen functionality
    const toggleFullscreen = React.useCallback(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }, []);

    // Effects
    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
        api?.off("reInit", onSelect);
      };
    }, [api, onSelect]);

    React.useEffect(() => {
      if (isAutoplay) {
        startAutoplay();
      } else {
        stopAutoplay();
      }

      return stopAutoplay;
    }, [isAutoplay, startAutoplay, stopAutoplay]);

    // Pause autoplay on hover
    const handleMouseEnter = React.useCallback(() => {
      if (isAutoplay) stopAutoplay();
    }, [isAutoplay, stopAutoplay]);

    const handleMouseLeave = React.useCallback(() => {
      if (isAutoplay) startAutoplay();
    }, [isAutoplay, startAutoplay]);

    // Fullscreen change listener
    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () =>
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
    }, []);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          currentIndex,
          slideCount,
          isAutoplay,
          toggleAutoplay,
          scrollToIndex,
          isFullscreen,
          toggleFullscreen,
          selectedSnapIndex,
          slides,
          autoplay,
          autoplayDelay,
          loop,
          slidesToShow,
          slidesToScroll,
          showDots,
          showArrows,
          showProgress,
          showCounter,
          showThumbnails,
          showFullscreen,
          navigationVariant,
          navigationPosition,
          navigationSize,
          arrowIcon,
          dotShape,
        }}
      >
        <div
          ref={ref}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(carouselVariants({ variant, size }), className)}
          role="region"
          aria-roledescription="carousel"
          aria-label={`Carousel with ${slideCount} slides`}
          tabIndex={0}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

// Enhanced CarouselContent
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// Enhanced CarouselItem
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index?: number;
  }
>(({ className, index, ...props }, ref) => {
  const { orientation, selectedSnapIndex, slidesToShow } = useCarousel();
  const isActive = index === selectedSnapIndex;

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${(index || 0) + 1}`}
      aria-hidden={!isActive}
      className={cn(
        "min-w-0 shrink-0 grow-0",
        slidesToShow === 1 ? "basis-full" : `basis-1/${slidesToShow}`,
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// Enhanced navigation buttons
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const {
    orientation,
    scrollPrev,
    canScrollPrev,
    navigationVariant,
    navigationPosition,
    navigationSize,
    arrowIcon,
  } = useCarousel();

  const ArrowComponent = arrowIcon === "arrow" ? ArrowLeft : ChevronLeft;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        navigationVariants({
          variant: navigationVariant,
          position: navigationPosition,
          size: navigationSize,
        }),
        orientation === "horizontal"
          ? navigationPosition === "outside"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "left-2 top-1/2 -translate-y-1/2"
          : navigationPosition === "outside"
          ? "-top-12 left-1/2 -translate-x-1/2 rotate-90"
          : "top-2 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ArrowComponent className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const {
    orientation,
    scrollNext,
    canScrollNext,
    navigationVariant,
    navigationPosition,
    navigationSize,
    arrowIcon,
  } = useCarousel();

  const ArrowComponent = arrowIcon === "arrow" ? ArrowRight : ChevronRight;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        navigationVariants({
          variant: navigationVariant,
          position: navigationPosition,
          size: navigationSize,
        }),
        orientation === "horizontal"
          ? navigationPosition === "outside"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "right-2 top-1/2 -translate-y-1/2"
          : navigationPosition === "outside"
          ? "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"
          : "bottom-2 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ArrowComponent className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

// Carousel Dots/Indicators
const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    clickable?: boolean;
  }
>(({ className, clickable = true, ...props }, ref) => {
  const { slideCount, currentIndex, scrollToIndex, dotShape, orientation } =
    useCarousel();

  if (slideCount <= 1) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-2 justify-center items-center",
        orientation === "vertical"
          ? "flex-col absolute right-4 top-1/2 -translate-y-1/2"
          : "mt-4",
        className
      )}
      role="tablist"
      aria-label="Carousel pagination"
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => {
        const isActive = index === currentIndex;

        return (
          <button
            key={index}
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "transition-all duration-200",
              dotShape === "square"
                ? "w-3 h-3 rounded-sm"
                : dotShape === "dash"
                ? "w-6 h-1 rounded-full"
                : "w-3 h-3 rounded-full",
              isActive
                ? "bg-primary scale-110"
                : "bg-muted-foreground/50 hover:bg-muted-foreground/70",
              !clickable && "cursor-default"
            )}
            onClick={clickable ? () => scrollToIndex(index) : undefined}
            disabled={!clickable}
          />
        );
      })}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";

// Carousel Progress Bar
const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentIndex, slideCount } = useCarousel();
  const progress = slideCount > 0 ? ((currentIndex + 1) / slideCount) * 100 : 0;

  return (
    <div
      ref={ref}
      className={cn("w-full bg-muted rounded-full h-1 mt-4", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={`Slide ${currentIndex + 1} of ${slideCount}`}
      {...props}
    >
      <motion.div
        className="bg-primary h-1 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
});
CarouselProgress.displayName = "CarouselProgress";

// Carousel Counter
const CarouselCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentIndex, slideCount } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground font-medium", className)}
      aria-live="polite"
      {...props}
    >
      {currentIndex + 1} / {slideCount}
    </div>
  );
});
CarouselCounter.displayName = "CarouselCounter";

// Carousel Controls
const CarouselControls = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    isAutoplay,
    toggleAutoplay,
    toggleFullscreen,
    showFullscreen,
    currentIndex,
    slideCount,
  } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAutoplay}
        aria-label={isAutoplay ? "Pause autoplay" : "Start autoplay"}
      >
        {isAutoplay ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {showFullscreen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      )}

      <div className="text-sm text-muted-foreground">
        {currentIndex + 1} / {slideCount}
      </div>
    </div>
  );
});
CarouselControls.displayName = "CarouselControls";

// Preset carousel components
const ImageCarousel: React.FC<
  CarouselProps & {
    images: Array<{
      src: string;
      alt: string;
      title?: string;
      description?: string;
    }>;
  }
> = ({ images, ...props }) => (
  <Carousel {...props}>
    <CarouselContent>
      {images.map((image, index) => (
        <CarouselItem key={index}>
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover rounded-lg"
            />
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
                {image.title && (
                  <h3 className="text-white font-semibold">{image.title}</h3>
                )}
                {image.description && (
                  <p className="text-white/80 text-sm">{image.description}</p>
                )}
              </div>
            )}
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
);

const TestimonialCarousel: React.FC<
  CarouselProps & {
    testimonials: Array<{
      quote: string;
      author: string;
      title?: string;
      avatar?: string;
    }>;
  }
> = ({ testimonials, ...props }) => (
  <Carousel {...props}>
    <CarouselContent>
      {testimonials.map((testimonial, index) => (
        <CarouselItem key={index}>
          <div className="text-center p-6">
            <blockquote className="text-lg italic mb-4">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <cite className="font-semibold not-italic">
                  {testimonial.author}
                </cite>
                {testimonial.title && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselDots />
  </Carousel>
);

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselProgress,
  CarouselCounter,
  CarouselControls,
  ImageCarousel,
  TestimonialCarousel,
  useCarousel,
  type CarouselProps,
};
