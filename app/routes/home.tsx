import type { Route } from "./+types/home";
import { Index } from "../index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz - Stalo" },
    { name: "description", content: "Você consegue responder ao nosso quiz?" },
  ];
}

export default function Home() {
  return <Index />;
}
