import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const file = await prisma.documentFile.findUnique({
      where: { id },
    });

    if (!file) {
      return new NextResponse("Arquivo não encontrado", { status: 404 });
    }

    if (file.type === "LINK") {
      return NextResponse.redirect(file.url);
    }

    if (file.url.startsWith("data:")) {
      const commaIndex = file.url.indexOf(",");
      if (commaIndex === -1) {
        return new NextResponse("Formato de arquivo inválido", { status: 500 });
      }

      const meta = file.url.substring(5, commaIndex); 
      const isBase64 = meta.endsWith(";base64");
      const contentType = isBase64 ? meta.substring(0, meta.length - 7) : meta;
      const data = file.url.substring(commaIndex + 1);

      const buffer = Buffer.from(data, isBase64 ? "base64" : "utf8");

      const filename = file.name.toLowerCase().endsWith(".pdf")
        ? file.name
        : `${file.name}.pdf`;

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType || "application/pdf",
          "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
            filename
          )}`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.redirect(file.url);
  } catch (error) {
    console.error("Erro ao servir arquivo:", error);
    return new NextResponse("Erro interno ao processar arquivo", {
      status: 500,
    });
  }
}
