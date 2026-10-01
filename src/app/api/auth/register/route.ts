import { NextResponse, type NextRequest } from "next/server";
import { authenticateWith } from "@/lib/auth/bff";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
      { status: 422 },
    );
  }
  const { phone, confirmPassword, ...rest } = parsed.data;
  void confirmPassword; // client-side-only field; intentionally never sent to the backend
  return authenticateWith("/auth/register", { ...rest, ...(phone ? { phone } : {}) });
}
