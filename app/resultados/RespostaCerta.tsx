import gis from "../assets/gis/gis-resposta-certa.jpg";
import type { Route } from "../+types/root";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz - Stalo" },
    { name: "description", content: "Você consegue responder ao nosso quiz?" },
  ];
}

export default function QuestaoCerta() {
  let navigate = useNavigate();
  return (
    <>
      <div className="my-auto px-48">
        <div className="items-center justify-center text-center place-self-center mb-2 flex flex-col">
          <h1 className="text-black text-3xl font-semibold mb-4">
            Resposta certa!
          </h1>
        </div>
        <div className="flex justify-center">
          <p className="text-2xl">
            {" "}
            Você agora pode pegar o seu brinde. Parabéns e obrigada por
            participar!{" "}
          </p>
        </div>
        <div className="h-48 flex justify-center mt-8">
          <img className="h-full" src={gis} />
        </div>
      </div>
      <div className="flex justify-end mx-10 my-4">
        <button
          className="bg-[#4100A5] text-white font-bold py-3 px-6 rounded-3xl hover:bg-[#f7941f]"
          onClick={()=>navigate('/')}
        >
          Voltar ao início
        </button>
      </div>
    </>
  );
}
