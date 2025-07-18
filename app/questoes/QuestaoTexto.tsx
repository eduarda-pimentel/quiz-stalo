interface QuestaoTextoProps {
  pergunta: string;
}

export default function QuestaoTexto({ pergunta}: QuestaoTextoProps) {
  return (
    <div className="items-center justify-center text-center place-self-center mb-0 flex flex-col">
      <h1 className="text-black text-3xl font-semibold mb-8">{pergunta}</h1>
    </div>
  );
}
