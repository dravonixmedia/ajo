export interface ProcessStep {
  n: string;
  title: string;
  copy: string;
}

export const processSteps: ProcessStep[] = [
  { n: "01", title: "Connect", copy: "Understand the occasion, personality and expectations." },
  { n: "02", title: "Plan", copy: "Develop the photography approach, visual direction and schedule." },
  { n: "03", title: "Capture", copy: "Document the experience naturally without interrupting its rhythm." },
  { n: "04", title: "Curate", copy: "Carefully select and professionally finish the strongest photographs." },
  { n: "05", title: "Deliver", copy: "Present the completed memories through a refined digital gallery or album." },
];
