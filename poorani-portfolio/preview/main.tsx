// Single-file preview entry: same components, hash routing instead of Next.js routes.
import { createRoot } from "react-dom/client";
import Shell from "../components/Shell";
import { useRoute } from "./router";
import Home from "../components/pages/Home";
import About from "../components/pages/About";
import Skills from "../components/pages/Skills";
import Projects from "../components/pages/Projects";
import Experience from "../components/pages/Experience";
import Contact from "../components/pages/Contact";

const PAGES: Record<string, () => React.JSX.Element> = {
  "/": Home, "/about": About, "/skills": Skills, "/projects": Projects,
  "/experience": Experience, "/contact": Contact,
};

function App() {
  const { path } = useRoute();
  const Page = PAGES[path] ?? Home;
  return <Shell><Page /></Shell>;
}

createRoot(document.getElementById("root")!).render(<App />);
