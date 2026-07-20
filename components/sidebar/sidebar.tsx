'use client'
import { Briefcase, FileChartLine, FileText, LayoutGrid, LogOut, Menu, TrendingUp } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutUser } from "@/app/actions/auth-actions"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string;
  } | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    if (pathname === '/login' || pathname === '/cadastro') {
        return null;
    }

    const navigationItems = (onItemClick?: () => void) => {
        const getButtonClass = (path: string) => {
            const isActive = pathname === path || pathname.startsWith(path + '/');
            return cn(
                "justify-start gap-2 transition-all border-l-2 pl-3 rounded-l-none w-full",
                isActive 
                    ? "border-l-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium" 
                    : "border-l-transparent text-muted-foreground hover:text-foreground"
            );
        };

        return (
            <div className="flex flex-col gap-1.5 p-2">
                <Button variant="ghost" className={getButtonClass('/')} asChild onClick={onItemClick}>
                    <Link href='/'>
                        <LayoutGrid size={18} />
                        Dashboard
                    </Link>
                </Button>
                <Button variant="ghost" className={getButtonClass('/curriculo')} asChild onClick={onItemClick}>
                    <Link href='/curriculo'>
                        <FileText size={18} />
                        Currículo
                    </Link>
                </Button>
                <Button variant="ghost" className={getButtonClass('/jobs')} asChild onClick={onItemClick}>
                    <Link href='/jobs'>
                        <Briefcase size={18} />
                        Vagas
                    </Link>
                </Button>
                <Button variant="ghost" className={getButtonClass('/relatorio')} asChild onClick={onItemClick}>
                    <Link href='/relatorio'>
                        <FileChartLine size={18} />
                        Relatório
                    </Link>
                </Button>
                <Button variant="ghost" className={getButtonClass('/mercado')} asChild onClick={onItemClick}>
                    <Link href='/mercado'>
                        <TrendingUp size={18} />
                        Mercado
                    </Link>
                </Button>
            </div>
        );
    };

    const userInfoSection = (
        user && (
            <div className="p-4 border-t border-sidebar-border flex flex-col gap-2 bg-sidebar-accent/30">
                <div className="px-2 py-1 flex flex-col">
                    <span className="text-sm font-semibold truncate text-foreground">{user.name || 'Candidato'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
                <Button 
                    variant="ghost" 
                    className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                    onClick={() => logoutUser()}
                >
                    <LogOut className="size-4 mr-2" />
                    Sair
                </Button>
            </div>
        )
    );

    return (
        <>
            {/* Header de Navegação Mobile (visível em telas menores de 768px) */}
            <div className="flex md:hidden w-full border-b border-sidebar-border bg-sidebar items-center justify-between px-4 py-3 sticky top-0 z-40">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Hefestus</h1>
                
                <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação" className="text-foreground">
                            <Menu size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="fixed inset-y-0 left-0 z-50 h-full w-64 border-r border-sidebar-border bg-sidebar p-0 shadow-lg translate-x-0 translate-y-0 top-0 left-0 max-w-none sm:max-w-none flex flex-col justify-between gap-0">
                        <div>
                            <div className="px-6 py-5 border-b border-sidebar-border mb-2">
                                <h1 className="text-xl font-bold tracking-tight text-foreground">Hefestus</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">Forje a sua carreira</p>
                            </div>
                            {navigationItems(() => setIsMobileOpen(false))}
                        </div>
                        {userInfoSection}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Sidebar Lateral Desktop (visível apenas em md+) */}
            <div className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex flex-col justify-between h-screen sticky top-0 z-40">
                <div>
                    <div className="px-8 py-6">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Hefestus</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Forje a sua carreira</p>
                    </div>
                    {navigationItems()}
                </div>
                {userInfoSection}
            </div>
        </>
    )
}