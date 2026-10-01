import { NextResponse, type NextRequest } from "next/server";
import { authenticateWith } from "@/lib/auth/bff";
import { loginSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
      { status: 422 },
    );
  }
  return authenticateWith("/auth/login", parsed.data);
}
