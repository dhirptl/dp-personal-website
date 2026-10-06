# strain gauge carrier pcb (draft, not on site)

removed from site 2026-09-28; restore by adding back to SITE.projects in lib/site-data.ts and to EXP_DETAIL['formula-sae'].projects

original position in SITE.projects: after `motor-mounts`, before `flightreacts`.

## project object (from SITE.projects)

```ts
    {
      slug: "strain-gauge-pcb",
      name: "strain gauge carrier pcb",
      categories: ["hardware"],
      date: "2026 - present",
      tech: ["kicad", "can bus", "strain gauges"],
      xp: { label: "formula sae", route: "/experience/formula-sae" },
      overview:
        "a small board that sits next to strain gauges on the formula sae car, amplifies their signal, and sends it over can - so the team can measure chassis and suspension deformation during validation testing. in progress.",
      sections: [
        {
          title: "the problem",
          body: "the team wants to measure how the chassis and suspension deform during validation testing, using strain gauges. but a strain gauge's signal is very weak, and it degrades when it has to travel down long wires to the sensors - which is exactly the situation on a car.",
        },
        {
          title: "the plan",
          body: "put a small carrier board right next to the sensors: strain gauge in, amplified locally, out onto the car's can bus. once the reading is on can, the long wire run no longer eats into a tiny analog signal.",
        },
        {
          title: "what i'm doing now",
          items: [
            "researching automotive strain gauges and load cells.",
            "studying what makes existing strain-gauge-to-can converters work.",
            "designing the solution in kicad.",
          ],
        },
        {
          title: "status",
          body: "in progress - the board is still being designed, and nothing has been built or tested yet.",
        },
      ],
    },
```

## related lines removed/changed elsewhere in lib/site-data.ts (verbatim, before removal)

```ts
// EXP_DETAIL["formula-sae"].summary
      "mechanical & electrical team member on the university of alberta's formula sae team. i worked on the drivetrain subsystem - redesigning the jacking bar so it could actually be built - and i'm now designing a strain gauge carrier pcb for the team's validation testing.",
// EXP_DETAIL["formula-sae"].responsibilities (removed bullet)
      "design electrical hardware in kicad - currently a strain gauge carrier board that sends readings over can bus.",
// EXP_DETAIL["formula-sae"].accomplishments (removed bullet)
      "started the strain gauge carrier pcb: researching automotive strain gauges and load cells, and designing a board that amplifies the signal right next to the sensor and sends it over can.",
// EXP_DETAIL["formula-sae"].stack ("kicad" and "can bus" removed)
    stack: ["solidworks", "solidworks simulation (fea)", "kicad", "can bus", "welding / fabrication"],
// EXP_DETAIL["formula-sae"].projects
    projects: ["jacking-bar", "strain-gauge-pcb"],
// SITE.currently (removed line)
    "designing a strain gauge pcb",
```
