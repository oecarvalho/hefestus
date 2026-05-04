'use client'
import { Briefcase, FileChartLine, FileText, LayoutGrid, User } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Sidebar = () => {
    const pathname = usePathname()
    return (
        <div className="w-62 bg-white border-r-1">
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
    )
}