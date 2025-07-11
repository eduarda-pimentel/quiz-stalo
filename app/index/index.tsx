import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { InputMask } from "@react-input/mask";
import { useNavigate } from "react-router";

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
  cpf: string;
  estado: string;
  cidade: string;
}

export function Index() {
  let navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    nomeEmpresa: "",
    cnpj: "",
    cpf: "",
    estado: "",
    cidade: "",
  });

  const GOOGLE_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxRllKWwfhZyefora3bNO5Lfe3juvGb2Ajm-HtgKoqMIlKOxNk4Dd1631d3DX1vjtXm/exec";

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    setValidationError(null);
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value.toString(),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.cnpj.trim() === "" && formData.cpf.trim() === "") {
      setValidationError("Informe o CNPJ ou o CPF!");
      setIsSubmitting(false);
      return;
    }

    const dataToSend = new URLSearchParams();
    for (const key in formData) {
      let valueToAppend = String(formData[key as keyof FormData]);
      if (key === "telefone" && valueToAppend) {
        valueToAppend = "'" + valueToAppend;
      }

      dataToSend.append(key, valueToAppend);
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

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        nomeEmpresa: "",
        cnpj: "",
        cpf: "",
        estado: "",
        cidade: "",
      });
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    } finally {
      navigate("/questao");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-48 my-auto">
      <div className="items-center justify-center text-center place-self-center mb-4 flex flex-col">
        <h1 className="text-black text-3xl font-bold mb-1">
          Bem-vindo(a) ao Desafio Stalo!
        </h1>
        <h5 className="text-xl">
          Faça o cadastro, responda ao nosso desafio e concorra a um brinde
        </h5>
      </div>
      <form className="w-full place-self-center" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <div>
            <label
              htmlFor="nome"
              className="block tracking-wide text-gray-700 text-base font-bold mb-1"
            >
              Nome *
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight "
              id="nome"
              type="text"
              placeholder="Seu nome aqui"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo: Email e Telefone */}
          <div className="flex flex-col md:flex-row gap-7">
            {/* Campo Email */}
            <div className="w-full md:w-1/2">
              <label
                htmlFor="email"
                className="block tracking-wide text-gray-700 text-base font-bold mb-1"
              >
                Email *
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight"
                id="email"
                type="email"
                placeholder="Email para contato"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo Telefone */}
            <div className="w-full md:w-1/2">
              <label
                htmlFor="telefone"
                className="block tracking-wide text-gray-700 text-base font-bold mb-1"
              >
                Telefone *
              </label>
              <InputMask
                placeholder="(XX) XXXXX-XXXX"
                mask="+55 (__) _____-____"
                replacement={{ _: /\d/ }}
                id="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight"
                required
              />
            </div>
          </div>

          {/* Campo: Nome da Empresa (ocupa uma linha inteira) */}
          <div className="">
            <label
              htmlFor="nomeEmpresa"
              className="block tracking-wide text-gray-700 text-base font-bold mb-1"
            >
              Empresa
            </label>
            <input
              className="sappearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight"
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
              className="block tracking-wide text-gray-700 text-base font-bold mb-1"
            >
              CNPJ
            </label>
            <InputMask
              placeholder="XX.XXX.XXX/XXXX-XX"
              mask="__.___.___/____-__"
              replacement={{ _: /\d/ }}
              id="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight"
            />
          </div>

          {/* Bloco de Estado e Cidade */}
          <div>
            <label
              htmlFor="cnpj"
              className="block tracking-wide text-gray-700 text-base font-bold mb-1"
            >
              CPF
            </label>
            <InputMask
              placeholder="XXX.XXX.XXX-XX"
              mask="___.___.___-__"
              replacement={{ _: /\d/ }}
              id="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-2 px-4 leading-tight"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-7">
            {/* Campo Estado */}
            <div className="w-full md:w-1/4">
              <label
                htmlFor="estado"
                className="block tracking-wide text-gray-700 text-base font-bold mb-1"
              >
                Estado *
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight"
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
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
                className="block tracking-wide text-gray-700 text-base font-bold mb-1"
              >
                Cidade *
              </label>
              <div className="relative">
                <select
                  required
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight"
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
          <div className="md:col-span-full mt-6 flex justify-center flex-col align-middle place-items-center">
            <button
              type="submit"
              className="bg-[#4100A5] text-white font-bold py-3 px-6 rounded-3xl hover:bg-[#f7941f] w-1/3 place-self-center"
              disabled={isSubmitting}
            >
              Começar
            </button>
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
            {isSubmitting && !validationError && (
              <p className="text-green-500 text-sm mt-2">
                {" "}
                Enviando cadastro...{" "}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
