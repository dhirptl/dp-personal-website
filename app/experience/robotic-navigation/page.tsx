import { ExperiencePage } from "@/components/ExperiencePage";

export default function RoboticNavigationPage() {
  return (
    <ExperiencePage
      title="Undergraduate Research Assistant, Robotic Navigation"
      period="JAN 2026 > APR 2026"
      overview="Supported navigation-focused research by developing reproducible test setups and analyzing algorithm behavior under realistic constraints. The work centered on turning theoretical models into practical validation pipelines."
      responsibilities={[
        "Implemented simulation scenarios for path planning and obstacle response experiments.",
        "Collected and cleaned run data for performance comparison across navigation strategies.",
        "Prepared concise technical reports for weekly research reviews.",
      ]}
      outcomes={[
        "Improved reproducibility of experiments through scripted setup and standardized metrics.",
        "Identified failure cases that informed follow-up algorithm tuning.",
        "Contributed benchmark summaries used in future lab planning.",
      ]}
      tools={["ROS", "Python", "SLAM Concepts", "Simulation", "Data Analysis"]}
    />
  );
}
