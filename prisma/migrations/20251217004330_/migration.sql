/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Membro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SituacaoMembro" AS ENUM ('MEMBRO', 'CONGREGADO', 'AFASTADO');

-- CreateEnum
CREATE TYPE "TipoParentesco" AS ENUM ('PAI', 'MAE', 'FILHO', 'FILHA', 'ESPOSO', 'ESPOSA', 'IRMAO', 'IRMA', 'OUTRO');

-- AlterTable
ALTER TABLE "Membro" ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "rua" TEXT,
ADD COLUMN     "situacao" "SituacaoMembro" NOT NULL DEFAULT 'MEMBRO';

-- AlterTable
ALTER TABLE "RegistroFinanceiro" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contaDigital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grupoId" TEXT,
ADD COLUMN     "parcelaAtual" INTEGER,
ADD COLUMN     "recorrente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalParcelas" INTEGER;

-- CreateTable
CREATE TABLE "Parentesco" (
    "id" TEXT NOT NULL,
    "membroOrigemId" TEXT NOT NULL,
    "membroDestinoId" TEXT NOT NULL,
    "tipo" "TipoParentesco" NOT NULL,

    CONSTRAINT "Parentesco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PDF',
    "folderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parentesco_membroOrigemId_membroDestinoId_key" ON "Parentesco"("membroOrigemId", "membroDestinoId");

-- CreateIndex
CREATE UNIQUE INDEX "Membro_cpf_key" ON "Membro"("cpf");

-- AddForeignKey
ALTER TABLE "Parentesco" ADD CONSTRAINT "Parentesco_membroOrigemId_fkey" FOREIGN KEY ("membroOrigemId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parentesco" ADD CONSTRAINT "Parentesco_membroDestinoId_fkey" FOREIGN KEY ("membroDestinoId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "DocumentFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
