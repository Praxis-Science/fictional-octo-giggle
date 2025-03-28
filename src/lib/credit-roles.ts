import { CreditRole } from "@/types/credit";

/**
 * CRediT (Contributor Roles Taxonomy) roles
 * Based on https://credit.niso.org/
 */
export const CreditRoleData: CreditRole[] = [
  {
    id: "conceptualization",
    name: "Conceptualization",
    description: "Ideas; formulation or evolution of overarching research goals and aims.",
    category: "conceptualization"
  },
  {
    id: "methodology",
    name: "Methodology",
    description: "Development or design of methodology; creation of models.",
    category: "conceptualization"
  },
  {
    id: "software",
    name: "Software",
    description: "Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms; testing of existing code components.",
    category: "execution"
  },
  {
    id: "validation",
    name: "Validation",
    description: "Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.",
    category: "execution"
  },
  {
    id: "formal_analysis",
    name: "Formal Analysis",
    description: "Application of statistical, mathematical, computational, or other formal techniques to analyze or synthesize study data.",
    category: "execution"
  },
  {
    id: "investigation",
    name: "Investigation",
    description: "Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.",
    category: "execution"
  },
  {
    id: "resources",
    name: "Resources",
    description: "Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, computing resources, or other analysis tools.",
    category: "support"
  },
  {
    id: "data_curation",
    name: "Data Curation",
    description: "Management activities to annotate (produce metadata), scrub data and maintain research data (including software code, where it is necessary for interpreting the data itself) for initial use and later re-use.",
    category: "execution"
  },
  {
    id: "writing_original",
    name: "Writing - Original Draft",
    description: "Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).",
    category: "writing"
  },
  {
    id: "writing_review",
    name: "Writing - Review & Editing",
    description: "Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision – including pre- or post-publication stages.",
    category: "writing"
  },
  {
    id: "visualization",
    name: "Visualization",
    description: "Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.",
    category: "writing"
  },
  {
    id: "supervision",
    name: "Supervision",
    description: "Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.",
    category: "support"
  },
  {
    id: "project_administration",
    name: "Project Administration",
    description: "Management and coordination responsibility for the research activity planning and execution.",
    category: "support"
  },
  {
    id: "funding_acquisition",
    name: "Funding Acquisition",
    description: "Acquisition of the financial support for the project leading to this publication.",
    category: "support"
  }
]; 