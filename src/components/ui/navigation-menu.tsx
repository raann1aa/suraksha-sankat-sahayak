import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  User,
  Settings,
  Search,
  Bell,
  ShoppingCart,
  Heart,
  Star,
  Bookmark,
  ExternalLink,
  ArrowRight,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  Image,
  Play,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  Globe,
  Zap,
  Shield,
  Info,
  HelpCircle
} from "lucide-react"

import { cn } from "@/lib/utils"

// Enhanced navigation menu variants
const navigationMenuVariants = cva(
  "relative z-10 flex max-w-max flex-1 items-center justify-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col max-w-xs",
      },
      variant: {
        default: "",
        bordered: "border rounded-lg p-1",
        filled: "bg-muted rounded-lg p-1",
        minimal: "bg-transparent",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      }
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
      size: "default",
    },
  }
)

const triggerVariants = cva(
  "group inline-flex items-center justify-center rounded-md bg-background font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
  {
    variants: {
      variant: {
        default: "h-10 w-max px-4 py-2 text-sm",
        ghost: "hover:bg-accent/50 h-10 w-max px-4 py-2 text-sm",
        link: "h-auto w-auto p-0 font-normal underline-offset-4 hover:underline text-sm",
        pill: "h-10 w-max px-6 py-2 text-sm rounded-full",
        minimal: "h-8 w-max px-2 py-1 text-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Enhanced interfaces
interface NavigationItem {
  label: string
  href?: string
  icon?: React.ElementType
  badge?: React.ReactNode
  disabled?: boolean
  external?: boolean
  content?: React.ReactNode
  children?: NavigationItem[]
}

interface NavigationMenuProps extends 
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
  VariantProps<typeof navigationMenuVariants> {
  items?: NavigationItem[]
  logo?: React.ReactNode
  actions?: React.ReactNode
  mobileBreakpoint?: number
  showMobileMenu?: boolean
  onMobileMenuToggle?: (open: boolean) => void
  sticky?: boolean
  transparent?: boolean
  collapsible?: boolean
}

interface NavigationMenuTriggerProps extends 
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
  VariantProps<typeof triggerVariants> {
  icon?: React.ElementType
  badge?: React.ReactNode
  external?: boolean
  showChevron?: boolean
}

interface NavigationMenuContentProps extends 
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> {
  layout?: 'grid' | 'list' | 'mega'
  columns?: 1 | 2 | 3 | 4
}

interface NavigationMenuLinkProps extends 
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> {
  icon?: React.ElementType
  description?: string
  badge?: React.ReactNode
  external?: boolean
  active?: boolean
}

// Context for sharing navigation state
interface NavigationContextValue {
  orientation: 'horizontal' | 'vertical'
  isMobile: boolean
  closeMenu: () => void
}

const NavigationContext = React.createContext<NavigationContextValue>({
  orientation: 'horizontal',
  isMobile: false,
  closeMenu: () => {},
})

const useNavigation = () => {
  return React.useContext(NavigationContext)
}

// Enhanced NavigationMenu with responsive behavior[267][268]
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ 
  className, 
  children,
  orientation = "horizontal",
  variant = "default", 
  size = "default",
  items,
  logo,
  actions,
  mobileBreakpoint = 768,
  showMobileMenu = false,
  onMobileMenuToggle,
  sticky = false,
  transparent = false,
  collapsible = false,
  ...props 
}, ref) => {
  const [isMobile, setIsMobile] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(showMobileMenu)

  // Handle responsive behavior
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const toggleMobileMenu = React.useCallback(() => {
    const newOpen = !mobileMenuOpen
    setMobileMenuOpen(newOpen)
    onMobileMenuToggle?.(newOpen)
  }, [mobileMenuOpen, onMobileMenuToggle])

  const closeMenu = React.useCallback(() => {
    setMobileMenuOpen(false)
    onMobileMenuToggle?.(false)
  }, [onMobileMenuToggle])

  const contextValue = React.useMemo(() => ({
    orientation,
    isMobile,
    closeMenu,
  }), [orientation, isMobile, closeMenu])

  if (isMobile) {
    return (
      <NavigationContext.Provider value={contextValue}>
        <nav className={cn(
          "flex items-center justify-between w-full p-4",
          sticky && "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          transparent && "bg-transparent",
          className
        )}>
          {/* Mobile Header */}
          <div className="flex items-center gap-4 flex-1">
            {logo}
            <div className="ml-auto flex items-center gap-2">
              {actions}
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-full left-0 right-0 bg-background border-b shadow-lg"
              >
                <div className="p-4 space-y-2">
                  {items?.map((item, index) => (
                    <MobileNavItem key={index} item={item} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </NavigationContext.Provider>
    )
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      <nav className={cn(
        "flex items-center w-full",
        sticky && "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        transparent && "bg-transparent"
      )}>
        {logo && (
          <div className="mr-8">
            {logo}
          </div>
        )}
        
        <NavigationMenuPrimitive.Root
          ref={ref}
          className={cn(navigationMenuVariants({ orientation, variant, size }), className)}
          orientation={orientation}
          {...props}
        >
          {items ? (
            <>
              <NavigationMenuList>
                {items.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.content || item.children ? (
                      <>
                        <NavigationMenuTrigger
                          icon={item.icon}
                          badge={item.badge}
                          disabled={item.disabled}
                          external={item.external}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {item.content || (
                            <div className="grid gap-3 p-4 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <div className="row-span-3">
                                <NavigationMenuLink
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                  href={item.href}
                                >
                                  {item.icon && <item.icon className="h-6 w-6" />}
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    {item.label}
                                  </div>
                                </NavigationMenuLink>
                              </div>
                              <div className="grid gap-1">
                                {item.children?.map((child, childIndex) => (
                                  <NavigationMenuLink
                                    key={childIndex}
                                    href={child.href}
                                    icon={child.icon}
                                    description={child.label}
                                    badge={child.badge}
                                    external={child.external}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    {child.label}
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          )}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        icon={item.icon}
                        badge={item.badge}
                        external={item.external}
                        className={cn(triggerVariants())}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
              <NavigationMenuViewport />
            </>
          ) : (
            <>
              {children}
              <NavigationMenuViewport />
            </>
          )}
        </NavigationMenuPrimitive.Root>

        {actions && (
          <div className="ml-auto">
            {actions}
          </div>
        )}
      </nav>
    </NavigationContext.Provider>
  )
})

NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

// Mobile Navigation Item Component
const MobileNavItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
  const [expanded, setExpanded] = React.useState(false)
  const { closeMenu } = useNavigation()

  const handleClick = () => {
    if (item.children) {
      setExpanded(!expanded)
    } else if (item.href) {
      closeMenu()
      if (item.external) {
        window.open(item.href, '_blank')
      } else {
        window.location.href = item.href
      }
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={item.disabled}
        className="flex items-center justify-between w-full p-3 text-left hover:bg-accent rounded-md transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {item.icon && <item.icon className="h-5 w-5" />}
          <span>{item.label}</span>
          {item.badge && <div className="ml-2">{item.badge}</div>}
          {item.external && <ExternalLink className="h-3 w-3 opacity-50" />}
        </div>
        {item.children && (
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-90"
          )} />
        )}
      </button>
      
      {item.children && expanded && (
        <div className="ml-8 mt-2 space-y-1">
          {item.children.map((child, index) => (
            <MobileNavItem key={index} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => {
  const { orientation } = useNavigation()
  
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn(
        "group flex flex-1 list-none items-center justify-center",
        orientation === 'horizontal' ? "space-x-1" : "flex-col space-y-1 space-x-0",
        className
      )}
      {...props}
    />
  )
})

NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

// Enhanced NavigationMenuTrigger with accessibility improvements[267][271]
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ 
  className, 
  children, 
  variant = "default",
  size = "default",
  icon: Icon,
  badge,
  external = false,
  showChevron = true,
  ...props 
}, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(triggerVariants({ variant, size }), "group", className)}
    {...props}
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {badge && <div className="ml-1">{badge}</div>}
      {external && <ExternalLink className="h-3 w-3 opacity-50" />}
      {showChevron && (
        <ChevronDown
          className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      )}
    </div>
  </NavigationMenuPrimitive.Trigger>
))

NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

// Enhanced NavigationMenuContent with layout options
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ 
  className, 
  layout = "list",
  columns = 1,
  ...props 
}, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      layout === 'grid' && columns > 1 && `grid-cols-${columns}`,
      className
    )}
    {...props}
  />
))

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

// Enhanced NavigationMenuLink with rich content support
const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ 
  className, 
  icon: Icon, 
  description,
  badge,
  external = false,
  active = false,
  children, 
  href,
  onClick,
  ...props 
}, ref) => {
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    if (external && href) {
      e.preventDefault()
      window.open(href, '_blank')
    }
    onClick?.(e)
  }, [external, href, onClick])

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      href={href}
      onClick={handleClick}
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        active && "bg-accent/50 text-accent-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-none truncate">{children}</span>
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {external && <ExternalLink className="h-3 w-3 opacity-50 flex-shrink-0" />}
          </div>
          {description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </NavigationMenuPrimitive.Link>
  )
})

NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))

NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))

NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

// Preset NavigationMenu components
const MainNavigation: React.FC<{
  logo?: React.ReactNode
  items: NavigationItem[]
  actions?: React.ReactNode
  sticky?: boolean
}> = ({ logo, items, actions, sticky = false }) => (
  <NavigationMenu
    items={items}
    logo={logo}
    actions={actions}
    sticky={sticky}
    variant="bordered"
    className="w-full px-4"
  />
)

const SideNavigation: React.FC<{
  items: NavigationItem[]
  collapsed?: boolean
  onToggle?: () => void
}> = ({ items, collapsed = false, onToggle }) => (
  <NavigationMenu
    items={items}
    orientation="vertical"
    variant="minimal"
    className={cn(
      "h-full border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}
  />
)

export {
  navigationMenuTriggerStyle: triggerVariants,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  MainNavigation,
  SideNavigation,
  useNavigation,
  type NavigationMenuProps,
  type NavigationItem,
  type NavigationMenuTriggerProps,
  type NavigationMenuContentProps,
  type NavigationMenuLinkProps,
}
