import { getShowrooms } from "@/lib/repositories/showroomRepository";

export async function listShowrooms() {
  return getShowrooms();
}
