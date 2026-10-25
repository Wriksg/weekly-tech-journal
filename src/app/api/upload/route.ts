import { put } from "@vercel/blob";
import { requireWriteToken } from "@/lib/auth";
import { fail, ok, serverError } from "@/lib/api";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions reject bodies over ~4.5MB
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  try {
    const denied = requireWriteToken(req);
    if (denied) return denied;

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return fail(400, "VALIDATION_ERROR", "Form field 'file' is required");
    }
    const ext = EXT[file.type];
    if (!ext) {
      return fail(400, "VALIDATION_ERROR", "Only jpeg, png, webp or gif images are allowed");
    }
    if (file.size > MAX_BYTES) {
      return fail(400, "VALIDATION_ERROR", "Image must be 4MB or smaller");
    }

    const blob = await put(`covers/${crypto.randomUUID()}.${ext}`, file, { access: "public" });
    return ok({ url: blob.url }, 201);
  } catch (e) {
    return serverError(e);
  }
}