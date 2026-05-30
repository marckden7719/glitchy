import { createFileRoute } from "@tanstack/react-router";
import GlitchyHome from "@/components/GlitchyHome";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <GlitchyHome />;
}
