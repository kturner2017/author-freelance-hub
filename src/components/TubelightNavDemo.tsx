
import { Home, FileText, BookOpen, Users } from 'lucide-react'
import { TubelightNavbar } from "@/components/ui/tubelight-navbar"

export function TubelightNavDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Editor', url: '/editor', icon: FileText },
    { name: 'For Authors', url: '/for-authors', icon: BookOpen },
    { name: 'Publishing Support', url: '/publishing-support', icon: Users }
  ]

  return <TubelightNavbar items={navItems} />
}

export default TubelightNavDemo;
