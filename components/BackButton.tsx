import Link from "next/link";
import React from "react";
import { ChevronLeft } from "lucide-react";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      aria-label="Voltar para a página anterior"
    >
      <ChevronLeft className="w-6 h-6" />

      {/* Texto escondido para acessibilidade */}
      <span className="sr-only">Voltar</span>
    </Link>
  );
}
