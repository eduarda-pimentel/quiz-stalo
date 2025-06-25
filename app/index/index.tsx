import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import logo from "../assets/brand/logo.jpg";

interface Estado {
  id: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  nomeEmpresa: string;
  cnpj: string;
  estadoSelecionado: string;
  cidadeSelecionada: string;
}

export function Index() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    nomeEmpresa: "",
    cnpj: "",
    estadoSelecionado: "",
    cidadeSelecionada: "",
  });

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: any[]) => {
        const estadosFormatados: Estado[] = data.map((estado) => ({
          id: estado.sigla,
          nome: estado.nome,
        }));
        setEstados(estadosFormatados);
      })
      .catch((error) => console.error("Erro ao buscar estados:", error));
  }, []);

  useEffect(() => {
    if (formData.estadoSelecionado) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoSelecionado}/municipios?orderBy=nome`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: any[]) => {
          const cidadesFormatadas: Cidade[] = data.map((cidade) => ({
            id: cidade.id,
            nome: cidade.nome,
          }));
          setCidades(cidadesFormatadas);
          setFormData((prevData) => ({
            ...prevData,
            cidadeSelecionada: "",
          }));
        })
        .catch((error) =>
          console.error(
            `Erro ao buscar cidades para ${formData.estadoSelecionado}:`,
            error
          )
        );
    } else {
      setCidades([]);
      setFormData((prevData) => ({
        ...prevData,
        cidadeSelecionada: "",
      }));
    }
  }, [formData.estadoSelecionado]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dados do Formulário:", formData);
    alert("Formulário enviado! Verifique o console para os dados.");
  };

  return (
    <section className="flex my-14 place-self-center w-10/12 bg-white h-full rounded-3xl flex-col">
      <div className="h-28 mx-14 my-2">
        <img className="h-full" src={logo} />
      </div>
      <div className="pb-8 px-48">
        <div className="items-center justify-center text-center place-self-center mb-8 flex flex-col">
          <h1 className="text-black text-4xl font-bold mb-8">
            Bem-vindo(a) ao Desafio Stalo!
          </h1>
          <h5 className="text-2xl">
            Faça o cadastro, responda ao nosso desafio e concorra a um brinde
          </h5>
        </div>
        <form className="w-full place-self-center" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-full">
            <div>
              <label
                htmlFor="nome"
                className="block tracking-wide text-gray-700 text-base font-bold mb-2"
              >
                Nome
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight "
                id="nome"
                type="text"
                placeholder="Seu nome aqui"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            {/* Campo: Email e Telefone */}
            <div className="flex flex-col md:flex-row gap-7">
              {/* Campo Email */}
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="email"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight"
                  id="email"
                  type="email"
                  placeholder="Email para contato"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Campo Telefone */}
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="telefone"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Telefone
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight"
                  id="telefone"
                  type="tel"
                  placeholder="Telefone para contato"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Campo: Nome da Empresa (ocupa uma linha inteira) */}
            <div className="md:col-span-full">
              <label
                htmlFor="nomeEmpresa"
                className="block tracking-wide text-gray-700 text-base font-bold mb-2"
              >
                Nome da empresa
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight"
                id="nomeEmpresa"
                type="text"
                placeholder="Nome da sua empresa"
                value={formData.nomeEmpresa}
                onChange={handleChange}
              />
            </div>

            {/* Campo: CNPJ */}
            <div>
              <label
                htmlFor="cnpj"
                className="block tracking-wide text-gray-700 text-base font-bold mb-2"
              >
                CNPJ
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight "
                id="cnpj"
                type="text"
                placeholder="CNPJ da empresa"
                value={formData.cnpj}
                onChange={handleChange}
              />
            </div>

            {/* Bloco de Estado e Cidade */}
            <div className="flex flex-col md:flex-row gap-7">
              {/* Campo Estado */}
              <div className="w-full md:w-1/4">
                <label
                  htmlFor="estadoSelecionado"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Estado
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight"
                    id="estadoSelecionado"
                    value={formData.estadoSelecionado}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campo Cidade */}
              <div className="w-full md:w-3/4">
                <label
                  htmlFor="cidadeSelecionada"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Cidade
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight"
                    id="cidadeSelecionada"
                    value={formData.cidadeSelecionada}
                    onChange={handleChange}
                    disabled={
                      !formData.estadoSelecionado || cidades.length === 0
                    }
                  >
                    <option value="">
                      {formData.estadoSelecionado
                        ? cidades.length > 0
                          ? "Selecione uma Cidade"
                          : "Carregando Cidades..."
                        : "Selecione um Estado primeiro"}
                    </option>
                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="md:col-span-full mt-6 flex justify-center">
              <button
                type="submit"
                className="bg-[#4100A5] text-white font-bold py-3 px-6 rounded-3xl hover:bg-[#f7941f] w-1/3 place-self-center"
              >
                Começar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
