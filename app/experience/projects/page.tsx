import { ExperiencePage } from "@/components/ExperiencePage";

export default function ProjectsPage() {
  return (
    <ExperiencePage
      title="Projects"
      period="SELECTED WORK"
      overview="A collection of technical projects exploring software, systems, and applied engineering. Each project is designed as a focused experiment with strong documentation and clear success criteria."
      responsibilities={[
        "Design and build project architectures that balance speed with maintainability.",
        "Own implementation from early prototype through iterative refinement.",
        "Document trade-offs, lessons learned, and next-step opportunities.",
      ]}
      outcomes={[
        "Built a portfolio of end-to-end projects spanning web, simulation, and engineering contexts.",
        "Improved delivery speed by standardizing setup and review patterns.",
        "Maintained clear project narratives useful for recruiting and collaboration.",
      ]}
      tools={["TypeScript", "Next.js", "Python", "Systems Thinking", "Technical Writing"]}
    />
  );
}
