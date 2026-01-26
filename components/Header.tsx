import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="flex-shrink-0 relative bg-[#F2F0EA]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Logo - Centered */}
        <div className="flex-1"></div>
        <Link href="/" className="flex-1 flex justify-center">
          <Image
            src="/logo.png"
            alt="THE LONE SCREEN"
            width={180}
            height={180}
            className="h-auto w-auto max-h-20"
            priority
          />
        </Link>
        
        {/* Sidebar Button - Right */}
        <div className="flex-1 flex justify-end">
          <Sidebar user={user} />
        </div>
      </nav>
    </header>
  )
}

