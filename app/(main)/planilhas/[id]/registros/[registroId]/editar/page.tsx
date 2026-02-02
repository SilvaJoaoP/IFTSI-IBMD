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
          <h1 className="text-2xl font-bold text-red-500">
            Registro não encontrado
          </h1>
        </div>
      </div>
    );
  }

  // Formatar data para o input type="date" (YYYY-MM-DD)
  const dateString = registro.data.toISOString().split("T")[0];

  const isSaidaFixa = registro.tipo === TipoRegistro.SAIDA_FIXA;
  const isSaidaVariavel = registro.tipo === TipoRegistro.SAIDA_VARIAVEL;
  const isParcelado =
    isSaidaVariavel && registro.grupoId && registro.parcelaAtual;

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href={`/planilhas/${id}`} />
      </div>

      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Editar Registro
        </h1>
        <p className="text-slate-500 mb-8">
          Atualize as informações do registro financeiro.
        </p>

        <form action={updateRegistro} className="space-y-6">
          <input type="hidden" name="id" value={registro.id} />
          <input type="hidden" name="planilhaId" value={id} />

          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              defaultValue={registro.tipo}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all font-medium"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA_FIXA">Saída Fixa</option>
              <option value="SAIDA_VARIAVEL">Saída Variável</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Valor
            </label>
            <input
              type="number"
              id="value"
              name="value"
              step="0.01"
              defaultValue={registro.valor}
              className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all font-bold text-blue-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={dateString}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              defaultValue={registro.descricao}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="contaDigital"
              name="contaDigital"
              defaultChecked={registro.contaDigital}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
            />
            <label
              htmlFor="contaDigital"
              className="ml-3 block text-sm font-medium text-slate-700"
            >
              Registro da Conta Digital
            </label>
          </div>

          {(isSaidaFixa || isParcelado) && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="encerrar"
                  name="encerrar"
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 rounded transition-all"
                />
                <label
                  htmlFor="encerrar"
                  className="ml-3 block text-sm text-red-700 font-bold"
                >
                  {isSaidaFixa
                    ? "Encerrar recorrência (não copiar para o próximo mês)"
                    : "Encerrar parcelas futuras (excluir próximas parcelas)"}
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 duration-200 mt-4"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
