'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CheckAuth from '@/app/actions/checkAuth'
import LogoutAction from '@/app/actions/logoutAction'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth(){
        const checkAuthentication = await CheckAuth();
        setIsAuthenticated(checkAuthentication);
    }
    checkAuth();
  }, [])

  const  handleLogout = async () => {
    await LogoutAction();
    router.push('/login')
  }

  const navLinks = [
    { href: '/studyRoom/join-room', label: 'Join Room' },
    { href: '/studyRoom/create-room', label: 'Create Room' }
  ]

  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link href="/">StudyRooms</Link>
      </div>

      <div className="flex items-center gap-4">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant={pathname === link.href ? 'default' : 'ghost'}
              className={cn('text-sm')}
            >
              {link.label}
            </Button>
          </Link>
        ))}

        {isAuthenticated ? (
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
