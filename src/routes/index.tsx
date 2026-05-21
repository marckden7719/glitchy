import { createFileRoute } from "@tanstack/react-router";
import BlankBoyHome from "@/components/BlankBoyHome";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <BlankBoyHome />;
}
