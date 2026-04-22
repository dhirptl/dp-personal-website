import { ExperiencePage } from "@/components/ExperiencePage";

export default function ClutchVRPage() {
  return (
    <ExperiencePage
      title="Unity and ML Intern, ClutchVR"
      period="MAY 2026 > AUG 2026"
      overview="Contributed to immersive training prototypes that combined real-time Unity interaction with lightweight ML-assisted behavior systems. The role emphasized rapid experimentation, disciplined technical communication, and measurable user feedback loops."
      responsibilities={[
        "Built interaction systems for VR scenes with an emphasis on latency, clarity, and maintainable architecture.",
        "Implemented and tested ML-driven logic modules for adaptive scenario responses.",
        "Collaborated with design and product leads to convert prototype findings into clear engineering tasks.",
      ]}
      outcomes={[
        "Shipped multiple internal prototype milestones with consistent performance targets.",
        "Reduced integration friction by documenting scene architecture and model interface patterns.",
        "Provided structured demo feedback that informed the next product sprint.",
      ]}
      tools={["Unity", "C#", "Python", "ML Prototyping", "VR Interaction Design"]}
    />
  );
}
