import CurriculoForm from "./components/curriculo-form";
import { getCurriculum } from "../actions/curriculum-actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CurriculoPage() {

  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  const userId = session.userId;

  const curriculum = await getCurriculum(userId);

  return (
    <CurriculoForm curriculum={curriculum} userId={userId} />
  )
}