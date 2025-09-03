import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { motion } from "framer-motion";
import {
  ImageIcon,
  VideoIcon,
  LoaderIcon,
  AlertCircle,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  RotateCw,
  Download,
  Share2,
  Crop,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  MoreHorizontal,
  Filter,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced AspectRatio with additional features
interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  ratio?: number;
  fallback?: React.ReactNode;
  loading?: boolean;
  error?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  placeholder?: boolean;
  overlay?: React.ReactNode;
  controls?: boolean;
  zoomable?: boolean;
  rotatable?: boolean;
  downloadable?: boolean;
  shareable?: boolean;
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  animate?: boolean;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  objectPosition?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  grayscale?: boolean;
  blur?: boolean;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  onDoubleClick?: () => void;
  maxZoom?: number;
  minZoom?: number;
}

// Preset ratios for common use cases
const COMMON_RATIOS = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
  widescreen: 16 / 9,
  ultrawide: 21 / 9,
  golden: 1.618,
  instagram: 1.91,
  twitter: 2,
  facebook: 1.91,
  youtube: 16 / 9,
  pinterest: 2 / 3,
  a4: 1.414,
  photo: 3 / 2,
  slide: 4 / 3,
  cinema: 2.35,
} as const;

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(
  (
    {
      className,
      ratio = 1,
      fallback,
      loading = false,
      error = false,
      onError,
      onLoad,
      placeholder = false,
      overlay,
      controls = false,
      zoomable = false,
      rotatable = false,
      downloadable = false,
      shareable = false,
      responsive,
      animate = false,
      objectFit = "cover",
      objectPosition = "center",
      borderRadius = "md",
      shadow = "none",
      grayscale = false,
      blur = false,
      brightness = 1,
      contrast = 1,
      saturate = 1,
      onDoubleClick,
      maxZoom = 3,
      minZoom = 1,
      children,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(loading);
    const [hasError, setHasError] = React.useState(error);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [zoom, setZoom] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);
    const [showControls, setShowControls] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Responsive ratio calculation
    const getCurrentRatio = React.useCallback(() => {
      if (!responsive) return ratio;

      const width = window.innerWidth;
      if (width < 768 && responsive.mobile) return responsive.mobile;
      if (width < 1024 && responsive.tablet) return responsive.tablet;
      if (responsive.desktop) return responsive.desktop;
      return ratio;
    }, [ratio, responsive]);

    const [currentRatio, setCurrentRatio] = React.useState(getCurrentRatio);

    // Handle responsive ratio changes
    React.useEffect(() => {
      if (!responsive) return;

      const handleResize = () => {
        setCurrentRatio(getCurrentRatio());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [getCurrentRatio, responsive]);

    // Handle image/video loading states
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const media = container.querySelector("img, video");
      if (!media) return;

      const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
      };

      const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
      };

      media.addEventListener("load", handleLoad);
      media.addEventListener("loadeddata", handleLoad); // for videos
      media.addEventListener("error", handleError);

      return () => {
        media.removeEventListener("load", handleLoad);
        media.removeEventListener("loadeddata", handleLoad);
        media.removeEventListener("error", handleError);
      };
    }, [children, onLoad, onError]);

    // Zoom controls
    const handleZoomIn = () => {
      setZoom((prev) => Math.min(prev + 0.25, maxZoom));
    };

    const handleZoomOut = () => {
      setZoom((prev) => Math.max(prev - 0.25, minZoom));
    };

    const resetZoom = () => {
      setZoom(1);
      setRotation(0);
    };

    // Rotation controls
    const handleRotate = () => {
      setRotation((prev) => (prev + 90) % 360);
    };

    // Download functionality
    const handleDownload = async () => {
      const container = containerRef.current;
      if (!container) return;

      const media = container.querySelector("img") as HTMLImageElement;
      if (!media) return;

      try {
        const response = await fetch(media.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `image_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    };

    // Share functionality
    const handleShare = async () => {
      const container = containerRef.current;
      if (!container) return;

      const media = container.querySelector("img") as HTMLImageElement;
      if (!media) return;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Shared Image",
            url: media.src,
          });
        } catch (error) {
          console.error("Share failed:", error);
        }
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(media.src);
        } catch (error) {
          console.error("Copy failed:", error);
        }
      }
    };

    // Fullscreen functionality
    const toggleFullscreen = () => {
      const container = containerRef.current;
      if (!container) return;

      if (!isFullscreen) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    };

    // CSS classes for styling
    const getBorderRadiusClass = () => {
      switch (borderRadius) {
        case "none":
          return "rounded-none";
        case "sm":
          return "rounded-sm";
        case "md":
          return "rounded-md";
        case "lg":
          return "rounded-lg";
        case "xl":
          return "rounded-xl";
        case "full":
          return "rounded-full";
        default:
          return "rounded-md";
      }
    };

    const getShadowClass = () => {
      switch (shadow) {
        case "none":
          return "";
        case "sm":
          return "shadow-sm";
        case "md":
          return "shadow-md";
        case "lg":
          return "shadow-lg";
        case "xl":
          return "shadow-xl";
        default:
          return "";
      }
    };

    const getFilterStyle = () => {
      const filters = [];
      if (grayscale) filters.push("grayscale(100%)");
      if (blur) filters.push("blur(4px)");
      if (brightness !== 1) filters.push(`brightness(${brightness})`);
      if (contrast !== 1) filters.push(`contrast(${contrast})`);
      if (saturate !== 1) filters.push(`saturate(${saturate})`);

      return filters.length > 0 ? { filter: filters.join(" ") } : {};
    };

    const content = (
      <AspectRatioPrimitive.Root
        ref={ref}
        ratio={currentRatio}
        className={cn(
          "relative overflow-hidden bg-muted",
          getBorderRadiusClass(),
          getShadowClass(),
          "group",
          className
        )}
        onMouseEnter={() => controls && setShowControls(true)}
        onMouseLeave={() => controls && setShowControls(false)}
        onDoubleClick={
          onDoubleClick ||
          (zoomable
            ? () => (zoom === 1 ? handleZoomIn() : resetZoom())
            : undefined)
        }
        {...props}
      >
        <div
          ref={containerRef}
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            ...getFilterStyle(),
          }}
        >
          {/* Content */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <LoaderIcon className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {hasError && !fallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2" />
              <span className="text-sm">Failed to load</span>
            </div>
          )}

          {hasError && fallback ? (
            fallback
          ) : placeholder ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm opacity-70">No image</span>
            </div>
          ) : (
            <div
              className="w-full h-full"
              style={{
                objectFit,
                objectPosition,
              }}
            >
              {React.cloneElement(children as React.ReactElement, {
                className: cn(
                  "w-full h-full",
                  `object-${objectFit}`,
                  (children as React.ReactElement)?.props?.className
                ),
                style: {
                  objectPosition,
                  ...(children as React.ReactElement)?.props?.style,
                },
              })}
            </div>
          )}

          {/* Overlay */}
          {overlay && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              {overlay}
            </div>
          )}

          {/* Controls */}
          {controls && showControls && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-2 right-2 flex gap-1">
                {zoomable && (
                  <>
                    <button
                      onClick={handleZoomIn}
                      className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </>
                )}
                {rotatable && (
                  <button
                    onClick={handleRotate}
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                    title="Rotate"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                  title="Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="absolute bottom-2 right-2 flex gap-1">
                {downloadable && (
                  <button
                    onClick={handleDownload}
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                {shareable && (
                  <button
                    onClick={handleShare}
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </AspectRatioPrimitive.Root>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

AspectRatio.displayName = "AspectRatio";

// Utility component for common aspect ratios
interface CommonRatioProps extends Omit<AspectRatioProps, "ratio"> {
  variant: keyof typeof COMMON_RATIOS;
}

const CommonAspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  CommonRatioProps
>(({ variant, ...props }, ref) => (
  <AspectRatio ref={ref} ratio={COMMON_RATIOS[variant]} {...props} />
));

CommonAspectRatio.displayName = "CommonAspectRatio";

// Responsive aspect ratio grid
interface AspectRatioGridProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
    ratio?: number;
  }>;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const AspectRatioGrid = React.forwardRef<HTMLDivElement, AspectRatioGridProps>(
  (
    {
      items,
      columns = { mobile: 1, tablet: 2, desktop: 3 },
      gap = "md",
      className,
      ...props
    },
    ref
  ) => {
    const getGridClass = () => {
      const cols = `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
      const gapClass =
        gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
      return `grid ${cols} ${gapClass}`;
    };

    return (
      <div ref={ref} className={cn(getGridClass(), className)} {...props}>
        {items.map((item) => (
          <AspectRatio
            key={item.id}
            ratio={item.ratio || 1}
            className="bg-muted"
          >
            {item.content}
          </AspectRatio>
        ))}
      </div>
    );
  }
);

AspectRatioGrid.displayName = "AspectRatioGrid";

// Media player aspect ratio wrapper
interface MediaAspectRatioProps extends AspectRatioProps {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
}

const MediaAspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  MediaAspectRatioProps
>(
  (
    {
      type,
      src,
      alt,
      poster,
      autoPlay = false,
      muted = true,
      loop = false,
      preload = "metadata",
      ...props
    },
    ref
  ) => (
    <AspectRatio ref={ref} {...props}>
      {type === "image" ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          controls
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </AspectRatio>
  )
);

MediaAspectRatio.displayName = "MediaAspectRatio";

export {
  AspectRatio,
  CommonAspectRatio,
  AspectRatioGrid,
  MediaAspectRatio,
  COMMON_RATIOS,
  type AspectRatioProps,
  type CommonRatioProps,
  type AspectRatioGridProps,
  type MediaAspectRatioProps,
};
