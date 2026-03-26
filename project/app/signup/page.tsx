import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "../components/SignUpForm";

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/");
  return <SignUpForm />;
}
