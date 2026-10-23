import aboutData from "@/data/about.json";
import experienceData from "@/data/experience.json";
import heroData from "@/data/hero.json";
import projectsData from "@/data/projects.json";
import technologiesData from "@/data/technologies.json";
import workData from "@/data/work.json";

export type Metric = { value: string; label: string };

export type ExperienceEntry = {
  slug: string;
  company: { name: string; url?: string };
  role: string;
  type?: string;
  location?: string;
  timeframe?: string;
  summary?: string;
  highlights?: string[];
  skills?: string[];
};

export const experience = experienceData.experience as ExperienceEntry[];

export const getExperience = (slug: string) => experience.find((entry) => entry.slug === slug);

export type ProjectCategory = "Software" | "Publication";

export type Project = {
  id: number;
  name: string;
  description: string;
  impact?: string;
  tech: string[];
  category: ProjectCategory;
  links: { demo?: string; paper?: string; source?: string };
};

export const projects: Project[] = projectsData.projects.map((project) => {
  const links = project.links as Project["links"];
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    impact: project.impact,
    tech: project.tech ?? [],
    category: project.tag.includes("Publication") ? "Publication" : "Software",
    links,
  };
});

export const homeMetrics = heroData.metrics as Metric[];

export type WorkItem = (typeof workData.work)[number];

export const getWork = (slug: string) => workData.work.find((item) => item.slug === slug);

// The case study for a company, if there is one (e.g. OnFinance AI → ComplianceOS).
export const getWorkForCompany = (companyName: string) =>
  workData.work.find((item) => item.company?.name === companyName);

const TOOLBOX_GROUPS: { label: string; names: string[] }[] = [
  { label: "Languages", names: ["Python", "JavaScript", "TypeScript", "C++", "Java", "Go"] },
  { label: "Backend & Data", names: ["FastAPI", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Kafka"] },
  { label: "AI & LLM", names: ["LangGraph", "LiteLLM", "LangChain", "OpenAI", "Hugging Face"] },
  { label: "Infra", names: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"] },
  { label: "Frontend", names: ["React", "Next.js", "Tailwind CSS", "Angular"] },
];

// Toolbox rows for About: each group lists the names that appear in the technologies
// list or the skills list (matched case-insensitively), in the group's own order.
export const toolbox = (() => {
  const known = new Set(
    [...technologiesData.technologies.map((tech) => tech.name), ...aboutData.skills].map((name) =>
      name.toLowerCase(),
    ),
  );
  return TOOLBOX_GROUPS.map((group) => ({
    label: group.label,
    items: group.names.filter((name) => known.has(name.toLowerCase())),
  })).filter((group) => group.items.length > 0);
})();
