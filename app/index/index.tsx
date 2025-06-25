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
  estado: string;
  cidade: string;
}

export function Index() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    nomeEmpresa: "",
    cnpj: "",
    estado: "",
    cidade: "",
  });

  const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxRllKWwfhZyefora3bNO5Lfe3juvGb2Ajm-HtgKoqMIlKOxNk4Dd1631d3DX1vjtXm/exec";

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
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
    if (formData.estado) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios?orderBy=nome`
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
            cidade: "",
          }));
        })
        .catch((error) =>
          console.error(
            `Erro ao buscar cidades para ${formData.estado}:`,
            error
          )
        );
    } else {
      setCidades([]);
      setFormData((prevData) => ({
        ...prevData,
        cidade: "",
      }));
    }
  }, [formData.estado]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const isValidCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  };

  const isValidPhone = (telefone: string): boolean => {
    const digits = telefone.replace(/\D/g, "");
    return /^\d{10,11}$/.test(digits);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidCNPJ(formData.cnpj)) {
      alert("CNPJ inválido. Verifique e tente novamente.");
      return;
    }

    if (!isValidPhone(formData.telefone)) {
      alert("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const dataToSend = new URLSearchParams();
    for (const key in formData) {
      dataToSend.append(key, String(formData[key as keyof FormData]));
    }

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: dataToSend,
      });

      setSubmitMessage("Cadastro enviado com sucesso! Aguarde o contato.");
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        nomeEmpresa: "",
        cnpj: "",
        estado: "",
        cidade: "",
      });
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setSubmitMessage(
        "Erro ao enviar o cadastro. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  placeholder="(99) 99999-9999"
                  pattern="\(\d{2}\) \d{5}-\d{4}"
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
                placeholder="99.999.999/9999-99"
                pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"
                value={formData.cnpj}
                onChange={handleChange}
              />
            </div>

            {/* Bloco de Estado e Cidade */}
            <div className="flex flex-col md:flex-row gap-7">
              {/* Campo Estado */}
              <div className="w-full md:w-1/4">
                <label
                  htmlFor="estado"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Estado
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight"
                    id="estado"
                    value={formData.estado}
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
                  htmlFor="cidade"
                  className="block tracking-wide text-gray-700 text-base font-bold mb-2"
                >
                  Cidade
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight"
                    id="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    disabled={!formData.estado || cidades.length === 0}
                  >
                    <option value="">
                      {formData.estado
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
                disabled={isSubmitting}
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
