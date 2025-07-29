import gis from "../assets/gis/gis-resposta-errada.jpg";
import { useNavigate } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz - Stalo" },
    { name: "description", content: "Você consegue responder ao nosso quiz?" },
  ];
}

export default function QuestaoErrada() {
  let navigate = useNavigate();
  return (
    <>
      <div className="my-36 px-24">
        <div className="items-center justify-center text-center place-self-center mb-2 flex flex-col">
          <h1 className="text-black text-6xl font-semibold mb-4">
            Que pena! Não foi dessa vez.
          </h1>
        </div>
        <div className="flex justify-center">
          <p className="text-3xl text-wrap text-center">
            Quem sabe da próxima? Enquanto isso, você pode conferir os produtos
            Stalo no nosso stand.
          </p>
        </div>
        <div className="h-[250px] flex justify-center mt-8">
          <img className="h-full" src={gis} />
        </div>
      </div>
      <div className="flex justify-end mx-10 my-auto">
        <button
          className="bg-[#4100A5] text-white text-2xl font-bold py-3 px-6 rounded-3xl hover:bg-[#f7941f]"
          onClick={() => navigate("/")}
        >
          Voltar ao início
        </button>
      </div>
    </>
  );
}
