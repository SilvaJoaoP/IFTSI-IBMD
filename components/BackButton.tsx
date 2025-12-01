import Link from "next/link";

/**
 * Um botão de link simples que navega para um 'href' específico.
 * Usado para "subir um nível" na navegação (ex: de 'Editar' para 'Lista').
 */
export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline"
    >
      {}
      <span className="text-[18px] translate-y-[-1px]" aria-hidden="true">
        ‹‹
      </span>
      <span>Voltar</span>
    </Link>
  );
}
