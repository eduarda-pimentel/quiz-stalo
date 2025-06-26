import questao4 from "../assets/questoes/questao4.json";
import questao5 from "../assets/questoes/questao5.json";
import questao6 from "../assets/questoes/questao6.json";
import questao7 from "../assets/questoes/questao7.json";
import questao8 from "../assets/questoes/questao8.json";
import questao9 from "../assets/questoes/questao9.json";

interface QuestaoData {
  pergunta: string;
  alternativas: string[];
  resposta: number;
}

export default function Questao() {
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
  const questaoSelecionada = questoes[randomInt];

  return (
    <>
      <div className="items-center justify-center text-center place-self-center mb-14 flex flex-col">
        <h1 className="text-black text-4xl font-semibold mb-8">
         {questaoSelecionada.pergunta}
        </h1>
        
      </div>
     <div className="w-4/5 h-full grid grid-cols-1 md:grid-cols-2 place-self-center">
        {questaoSelecionada.alternativas.map((alternativa)=>{
            return(
                <button className="p-6 w-1/2  rounded-3xl bg-[#4100A5] hover:bg-[#f7941f] text-white place-self-center"> <span className="text-xl"> {alternativa} </span> </button>
            )
        })}
     </div>
      
    </>
  );
}
