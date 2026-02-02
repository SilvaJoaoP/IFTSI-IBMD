import { BackButton } from "@/components/BackButton";
import { getRegistro, updateRegistro } from "../../../actions";
import { redirect } from "next/navigation";
import { TipoRegistro } from "@prisma/client";

export default async function EditarRegistroPage({
  params,
}: {
  params: Promise<{ id: string; registroId: string }>;
}) {
  const { id, registroId } = await params;
  const registro = await getRegistro(registroId);

  if (!registro) {
    return (
      <div>
        <BackButton href={`/planilhas/${id}`} />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">Registro não encontrado</h1>
        </div>
      </div>
    );
  }

  // Formatar data para o input type="date" (YYYY-MM-DD)
  const dateString = registro.data.toISOString().split("T")[0];

  const isSaidaFixa = registro.tipo === TipoRegistro.SAIDA_FIXA;
  const isSaidaVariavel = registro.tipo === TipoRegistro.SAIDA_VARIAVEL;
  const isParcelado = isSaidaVariavel && registro.grupoId && registro.parcelaAtual;

  return (
    <div>
      <BackButton href={`/planilhas/${id}`} />
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Editar Registro
        </h1>
        <form action={updateRegistro}>
          <input type="hidden" name="id" value={registro.id} />
          <input type="hidden" name="planilhaId" value={id} />
          
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              defaultValue={registro.tipo}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA_FIXA">Saída Fixa</option>
              <option value="SAIDA_VARIAVEL">Saída Variável</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-gray-300">
              Valor
            </label>
            <input
              type="number"
              id="value"
              name="value"
              step="0.01"
              defaultValue={registro.valor}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={dateString}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              defaultValue={registro.descricao}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="contaDigital"
              name="contaDigital"
              defaultChecked={registro.contaDigital}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="contaDigital" className="ml-2 block text-sm text-gray-300">
              Registro da Conta Digital
            </label>
          </div>

          {(isSaidaFixa || isParcelado) && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="encerrar"
                  name="encerrar"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="encerrar" className="ml-2 block text-sm text-red-200 font-semibold">
                  {isSaidaFixa
                    ? "Encerrar recorrência (não copiar para o próximo mês)"
                    : "Encerrar parcelas futuras (excluir próximas parcelas)"}
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
