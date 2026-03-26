import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInForm from "../components/SignInForm";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect("/");
  return <SignInForm />;
}
