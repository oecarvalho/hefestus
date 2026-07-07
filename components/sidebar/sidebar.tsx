'use client'
import { Briefcase, FileChartLine, FileText, LayoutGrid, LogOut } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutUser } from "@/app/actions/auth-actions"

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string;
  } | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
    const pathname = usePathname()

    if (pathname === '/login' || pathname === '/cadastro') {
        return null;
    }

    return (
        <div className="w-64 bg-white border-r-1 flex flex-col justify-between h-screen sticky top-0">
            <div>
                <div className="px-8 py-6">
                    <h1 className="text-2xl font-bold">Hefestus</h1>
                    <p className="text-sm text-shadow-gray-300">Forje a sua carreira</p>
                </div>

                <div className="flex flex-col gap-2 p-2">
                    <Button variant={pathname === '/' ? 'secondary' : 'ghost'}
                        className="justify-start" asChild>
                        <Link href='/'>
                            <LayoutGrid />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant={pathname === '/curriculo' ? 'secondary' : 'ghost'}
                        className="justify-start" asChild>
                        <Link href='/curriculo'>
                            <FileText />
                            Currículo
                        </Link>
                    </Button>
                    <Button variant={pathname === '/jobs' ? 'secondary' : 'ghost'}
                        className="justify-start" asChild>
                        <Link href='/jobs'>
                            <Briefcase />
                            Vagas
                        </Link>
                    </Button>
                    <Button variant={pathname === '/relatorio' ? 'secondary' : 'ghost'}
                        className="justify-start" asChild><Link href='/relatorio'>
                            <FileChartLine />
                            Relatório
                        </Link>
                    </Button>
                </div>
            </div>

            {user && (
                <div className="p-4 border-t flex flex-col gap-2 bg-zinc-50/50">
                    <div className="px-2 py-1 flex flex-col">
                        <span className="text-sm font-semibold truncate text-zinc-950">{user.name || 'Candidato'}</span>
                        <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50/50"
                        onClick={() => logoutUser()}
                    >
                        <LogOut className="size-4 mr-2" />
                        Sair
                    </Button>
                </div>
            )}
        </div>
    )
}