import {
  DumbbellIcon,
  HouseIcon,
  LaptopIcon,
  PackageIcon,
  ShirtIcon,
  SparklesIcon,
} from "lucide-react"

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case "electronics":
      return <LaptopIcon className={className} aria-hidden="true" />
    case "clothing":
      return <ShirtIcon className={className} aria-hidden="true" />
    case "home":
      return <HouseIcon className={className} aria-hidden="true" />
    case "beauty":
      return <SparklesIcon className={className} aria-hidden="true" />
    case "sports":
      return <DumbbellIcon className={className} aria-hidden="true" />
    default:
      return <PackageIcon className={className} aria-hidden="true" />
  }
}
