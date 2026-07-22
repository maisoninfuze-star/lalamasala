import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isAuthenticated } from "@/lib/admin-auth";

/*
  Image upload for the admin dashboard. Auth-gated, with MIME + size validation.
  Writes into /public/img/uploads and returns the public URL, which the owner
  then saves onto a dish via saveDishAction. In production on a read-only host,
  swap the fs write for Supabase Storage / Vercel Blob — the response shape is
  the same { url }.
*/

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slugRaw = String(form.get("slug") ?? "upload");
  const slug = slugRaw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60) || "upload";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WebP or AVIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)." }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "img", "uploads");
  await fs.mkdir(dir, { recursive: true });
  // Deterministic-ish unique name without Date in module scope concerns.
  const stamp = Date.now().toString(36);
  const name = `${slug}-${stamp}.${EXT[file.type]}`;
  await fs.writeFile(path.join(dir, name), buf);

  return NextResponse.json({ url: `/img/uploads/${name}` });
}
