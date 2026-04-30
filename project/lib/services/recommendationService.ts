import { getRecommendationsForCustomer as getRecommendationsForCustomerRepo } from "@/lib/repositories/recommendationRepository";

export async function getRecommendationsForCustomer(customerId: string) {
  return getRecommendationsForCustomerRepo(customerId);
}
