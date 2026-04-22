import { ExperiencePage } from "@/components/ExperiencePage";

export default function FormulaSAEPage() {
  return (
    <ExperiencePage
      title="Drivetrain Subsystem, Formula SAE"
      period="JAN 2026 > PRESENT"
      overview="Work on the drivetrain subsystem focuses on reliability, manufacturability, and practical race-day constraints. The role blends mechanical reasoning with careful execution and cross-team coordination."
      responsibilities={[
        "Assisted in drivetrain concept selection with attention to torque transmission and packaging constraints.",
        "Supported component validation workflows and tolerance tracking for manufactured parts.",
        "Coordinated with adjacent subsystems to ensure integration readiness before assembly windows.",
      ]}
      outcomes={[
        "Helped establish clear subsystem checklists for design and testing phases.",
        "Improved documentation quality for handoff between design and manufacturing tasks.",
        "Contributed to a more predictable integration process under tight deadlines.",
      ]}
      tools={["CAD", "Mechanical Design", "Manufacturing Readiness", "Testing", "Team Operations"]}
    />
  );
}
