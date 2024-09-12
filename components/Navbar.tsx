"use client";

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="mb-4">
      <a className={`mr-4 ${pathname === "/" ? "text-blue border-b" : ""}`} href="/">Creador de Paquetes</a>
      <a className={`mr-4 ${pathname === "/preferences" ? "text-blue border-b" : ""}`} href="/preferences">Preferencias de usuario</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-blue border-b" : ""}`} href="/agents">Sugerencias de Paquetes</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-blue border-b" : ""}`} href="/api/supabase/preferences">Preferencias API</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-blue border-b" : ""}`} href="/api/supabase/user_responses">Preferencias de Usuario API</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-blue border-b" : ""}`} href="/api/supabase/packages">Paquetes API</a>
    </nav>
  );
}