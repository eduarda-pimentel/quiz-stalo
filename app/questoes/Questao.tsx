import { useEffect, useState } from "react";
import questao4 from "../assets/questoes/questao4.json";
import questao5 from "../assets/questoes/questao5.json";
import questao6 from "../assets/questoes/questao6.json";
import questao7 from "../assets/questoes/questao7.json";
import questao8 from "../assets/questoes/questao8.json";
import questao9 from "../assets/questoes/questao9.json";
import gis from "../assets/gis/gis-pergunta.jpg";
import QuestaoTexto from "./QuestaoTexto";
import { useNavigate } from "react-router";

interface QuestaoData {
  pergunta: string;
  alternativas: string[];
  resposta: number;
}

export default function Questao() {
  let navigate = useNavigate();
  const [questaoSelecionada, setQuestaoSelecionada] =
    useState<QuestaoData | null>(null);
  const [valorSelecionado, setValorSelecionado] = useState<number>(-1);

  function getRandomInteger(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const questoes: { [key: number]: QuestaoData } = {
    4: questao4.questao,
    5: questao5.questao,
    6: questao6.questao,
    7: questao7.questao,
    8: questao8.questao,
    9: questao9.questao,
  };

  const randomInt = getRandomInteger(4, 9);

  useEffect(() => {
    setQuestaoSelecionada(questoes[randomInt]);
  }, []);

  useEffect(() => {
    if (valorSelecionado>=0) {
      setQuestaoSelecionada(null);
      setValorSelecionado(-1);
      if (valorSelecionado === questaoSelecionada?.resposta) {
        navigate("/respostaCerta");
      } else {
        navigate("/respostaErrada");
      }
    }
  }, [valorSelecionado]);

  return (
    <>
      <div className="pb-8 px-48">
        {randomInt >= 4 && randomInt <= 9 && questaoSelecionada && (
          <QuestaoTexto pergunta={questaoSelecionada.pergunta} />
        )}
        <div className="w-4/5 h-64 grid grid-cols-1 md:grid-cols-2 place-self-center">
          {questaoSelecionada &&
            questaoSelecionada.alternativas.map(
              (alternativa: string, ind: number) => {
                return (
                  <button
                    className="p-6 w-1/2  rounded-3xl bg-[#4100A5] hover:bg-[#f7941f] text-white place-self-center"
                    key={ind}
                    onClick={() =>  setValorSelecionado(ind)}
                  >
                    {" "}
                    <span className="text-xl"> {alternativa} </span>{" "}
                  </button>
                );
              }
            )}
        </div>
      </div>
      <div className="h-40 flex justify-end mx-10 my-auto">
        <img className="h-full" src={gis} />
      </div>
    </>
  );
}
