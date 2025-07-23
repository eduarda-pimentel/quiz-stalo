import { useEffect, useState } from "react";
import questao4 from "../assets/questoes/questao4.json";
import questao5 from "../assets/questoes/questao5.json";
import questao6 from "../assets/questoes/questao6.json";
import questao7 from "../assets/questoes/questao7.json";
import questao8 from "../assets/questoes/questao8.json";
import questao9 from "../assets/questoes/questao9.json";
import gis from "../assets/gis/gis-pergunta.jpg";
import QuestaoTexto from "./QuestaoTexto";
import QuestaoImagem from "./QuestaoImagem";
import { useNavigate } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz - Stalo" },
    { name: "description", content: "Você consegue responder ao nosso quiz?" },
  ];
}

interface QuestaoData {
  pergunta: string;
  alternativas: string[];
  resposta: number;
}

export default function Questao() {
  let navigate = useNavigate();
  const [randomInt] = useState(() => getRandomInteger(4, 9));
  const [questaoSelecionada, setQuestaoSelecionada] =
    useState<QuestaoData | null>(null);
  const [valorSelecionado, setValorSelecionado] = useState<number>(-1);
  const [respondendo, setRespondendo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(60);

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

  useEffect(() => {
    setQuestaoSelecionada(questoes[randomInt]);
  }, [randomInt]);

  useEffect(() => {
    if (tempoRestante <= 0) {
      navigate("/respostaErrada");
      return;
    }

    const interval = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestante, navigate]);

  useEffect(() => {
    setQuestaoSelecionada(questoes[randomInt]);
  }, []);

  useEffect(() => {
    if (valorSelecionado >= 0 && questaoSelecionada) {
      const valorAtual = valorSelecionado;
      const respostaCorreta = questaoSelecionada.resposta;

      const timer = setTimeout(() => {
        if (valorAtual === respostaCorreta) {
          navigate("/respostaCerta");
        } else {
          navigate("/respostaErrada");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [valorSelecionado, questaoSelecionada]);

  return (
    <>
      <div className="flex flex-col mt-40 px-24">
        <div className="items-center justify-center text-center place-self-center mb-4 flex flex-col">
          {randomInt >= 4 && questaoSelecionada && randomInt <= 9 ? (
            <QuestaoTexto pergunta={questaoSelecionada.pergunta} />
          ) : (
            <QuestaoImagem random={0} />
          )}
        </div>
        <div className="w-4/5 h-11/12 grid grid-cols-1 md:grid-cols-2 place-self-center m-0 gap-14">
          {questaoSelecionada &&
            questaoSelecionada.alternativas.map(
              (alternativa: string, ind: number) => {
                return (
                  <button
                    disabled={respondendo}
                    className="p-6 w-1/2 rounded-3xl bg-[#4100A5] hover:bg-[#f7941f] text-white place-self-center"
                    key={ind}
                    onClick={() => {
                      if (!respondendo) {
                        setRespondendo(true);
                        setValorSelecionado(ind);
                      }
                    }}
                  >
                    <span className="text-3xl"> {alternativa} </span>
                  </button>
                );
              }
            )}
        </div>
      </div>
      <div className="mt-auto h-[250px] w-full flex justify-between items-center px-14 py-2">
        <div className="text-3xl font-light flex justify-end">
          <p className="flex">
            <span>Tempo restante:&nbsp;</span>
            <span>{tempoRestante}&nbsp;s</span>
          </p>
        </div>
        <img className="h-full" src={gis} />
      </div>
    </>
  );
}
