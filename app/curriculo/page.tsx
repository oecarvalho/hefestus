import CurriculoForm from "./components/curriculo-form";
import { getCurriculum } from "../actions/curriculum-actions";

export default async function CurriculoPage() {

  const userId = "123";

  const curriculum = await getCurriculum(userId);

  return (
    <CurriculoForm curriculum={curriculum} userId={userId} />
  )
}