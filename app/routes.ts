import { type RouteConfig, index , route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("questao", "./questoes/Questao.tsx" ),
    route("respostaCerta", "./resultados/RespostaCerta.tsx"),
    route("respostaErrada", "./resultados/RespostaErrada.tsx")
] satisfies RouteConfig;
