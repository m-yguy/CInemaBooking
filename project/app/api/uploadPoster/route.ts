import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File size must be 5 MB or less" },
      { status: 400 },
    );
  }

  const rawTitle = formData.get("title");
  const titleSlug =
    typeof rawTitle === "string" && rawTitle.trim().length > 0
      ? rawTitle
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60)
      : "poster";

  const filename = `${titleSlug}.${ext}`;
  const dest = path.join(process.cwd(), "public", "Movie_Posters", filename);

  const bytes = await file.arrayBuffer();
  await writeFile(dest, Buffer.from(bytes));

  return NextResponse.json({ path: `/Movie_Posters/${filename}` });
}
