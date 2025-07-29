import gis from "../assets/gis/gis-resposta-certa.jpg";
import balloon from "../assets/gis/balloon.png";
import type { Route } from "../+types/root";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Check, SquareCheck } from "lucide-react";

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
      <div className="my-36 px-24">
        <div className="flex flex-row items-center justify-center text-center mb-4 gap-4">
          <h1 className="text-black text-6xl font-semibold">Resposta certa!</h1>
          <Check size={50} className="text-green-600" />
        </div>

        <div className="flex justify-center">
          <p className="text-3xl text-wrap text-center">
            Parabéns! Você pode agora pegar o seu brinde. Obrigada por
            participar!
          </p>
        </div>
        <div className="h-[250px] flex justify-between mt-8">
          <motion.img
            className="h-full"
            src={balloon}
            animate={{ y: -800, opacity: 0 }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0,
            }}
          />
          <img className="h-full" src={gis} />
          <motion.img
            className="h-full"
            src={balloon}
            animate={{ y: -800, opacity: 0 }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0,
            }}
          />
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
