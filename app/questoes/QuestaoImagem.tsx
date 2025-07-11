import questao0Enunciado from "../assets/questoes/questao0-enunciado.png";

const questoesEnunciados: { [key: number]: string } = {
  0: questao0Enunciado,
};

interface QuestaoImagemProps {
  random: number;
}

export default function QuestaoImagem({ random }: QuestaoImagemProps) {
  const imageSource = questoesEnunciados[random];
  if (!imageSource) {
    console.warn(`Imagem para a questão ${random} não encontrada!`);
    return null;
  }

  return (
    <div className="items-center m-0 p-0 justify-center text-center place-self-center flex flex-col border">
      <img
        src={imageSource}
        className="w-full p-0 m-0 object-contain object-center"
        alt={`Enunciado da Questão ${random}`}
      />
    </div>
  );
}
