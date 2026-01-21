import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import contactData from "@/data/contact.json";
import projectsData from "@/data/projects.json";
import technologiesData from "@/data/technologies.json";

type ProjectEntry = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  type: "project" | "publication";
};

type EducationEntry = {
  degree?: string;
  institution?: string;
  period?: string;
};

type ProfileData = {
  name: string;
  roles: string[];
  oneLiner: string;
  summary: string[];
  location: string;
  links: {
    website: string;
    github?: string;
    linkedin?: string;
    blog?: string;
    resume?: string;
  };
  skills: string[];
  experience: {
    current: string;
    previous?: string;
  };
  projects: ProjectEntry[];
  publications: ProjectEntry[];
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  education: EducationEntry[];
};

const getLinkByPlatform = (platform: string) =>
  contactData.socialMedia?.find((item) => item.platform.toLowerCase() === platform.toLowerCase())?.url;

const findButtonLink = (keyword: RegExp) =>
  heroData.buttons?.find((button) => keyword.test(button.text))?.link;

const dedupeList = (items: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  items.forEach((item) => {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  });

  return result;
};

export const getSiteUrl = (origin?: string) => {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  const base = envUrl || origin || "http://localhost:3000";
  return base.replace(/\/$/, "");
};

export const getProfileData = (baseUrl: string): ProfileData => {
  const website = baseUrl;
  const github = getLinkByPlatform("github");
  const linkedin = getLinkByPlatform("linkedin");
  const blog = findButtonLink(/blog/i);
  const resume = findButtonLink(/cv|resume/i);

  const skills = dedupeList([
    ...(aboutData.skills || []),
    ...(technologiesData.technologies?.map((tech) => tech.name) || []),
  ]);

  const projects: ProjectEntry[] = projectsData.projects.map((project) => ({
    name: project.name,
    description: project.description,
    url: project.link,
    tags: project.tag.filter((tag) => tag !== "All"),
    type: project.tag.includes("Publication") ? "publication" : "project",
  }));

  const profile: ProfileData = {
    name: heroData.name,
    roles: heroData.roles,
    oneLiner: [heroData.shortDescription, heroData.shortDescriptionLine2].filter(Boolean).join(" — "),
    summary: [
      aboutData.description?.primary || "",
      aboutData.description?.secondary || "",
    ].filter(Boolean),
    location: aboutData.location || "Bangalore, IN",
    links: {
      website,
      github,
      linkedin,
      blog,
      resume,
    },
    skills,
    experience: {
      current: aboutData.description?.primary || heroData.shortDescription,
      previous: aboutData.description?.secondary,
    },
    projects: projects.filter((project) => project.type === "project"),
    publications: projects.filter((project) => project.type === "publication"),
    contact: {
      email: contactData.email,
      phone: contactData.phone?.display,
      whatsapp: contactData.whatsapp?.link,
    },
    education: (aboutData.education || []).map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
    })),
  };

  return profile;
};

const chunkList = (items: string[], size: number) => {
  const chunks: string[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const buildLlmProfileText = (profile: ProfileData) => {
  const parts: string[] = [];

  const skillsChunks = chunkList(profile.skills, 8).map((chunk) => `- ${chunk.join(", ")}`).join("\n");

  const formatProjects = (items: ProjectEntry[]) =>
    items
      .map((item) => {
        const tags = item.tags.length ? ` [${item.tags.join(", ")}]` : "";
        return `- ${item.name}: ${item.description}${tags} — ${item.url}`;
      })
      .join("\n");

  parts.push(`# ${profile.name}`);
  parts.push(`## One-line summary\n${profile.oneLiner}`);
  parts.push(`## Roles\n${profile.roles.map((role) => `- ${role}`).join("\n")}`);
  parts.push(`## Location\n${profile.location}`);
  parts.push(
    `## Links\n` +
      [
        profile.links.website && `- Website: ${profile.links.website}`,
        profile.links.github && `- GitHub: ${profile.links.github}`,
        profile.links.linkedin && `- LinkedIn: ${profile.links.linkedin}`,
        profile.links.blog && `- Blog: ${profile.links.blog}`,
        profile.links.resume && `- CV/Resume: ${profile.links.resume}`,
      ]
        .filter(Boolean)
        .join("\n"),
  );
  parts.push(`## Skills/Stack\n${skillsChunks}`);
  parts.push(
    `## Experience\n` +
      [
        profile.experience.current && `- Current: ${profile.experience.current}`,
        profile.experience.previous && `- Past: ${profile.experience.previous}`,
      ]
        .filter(Boolean)
        .join("\n"),
  );
  parts.push(`## Projects\n${formatProjects(profile.projects) || "- None listed"}`);
  parts.push(`## Publications\n${formatProjects(profile.publications) || "- None listed"}`);
  parts.push(
    `## Contact\n` +
      [
        profile.contact.email && `- Email: ${profile.contact.email}`,
        profile.contact.phone && `- Phone: ${profile.contact.phone}`,
        profile.contact.whatsapp && `- WhatsApp: ${profile.contact.whatsapp}`,
      ]
        .filter(Boolean)
        .join("\n"),
  );
  parts.push(
    `## Provenance\n` +
      [
        "- Source of truth: this portfolio (generated from src/data)",
        `- Last updated: ${new Date().toISOString().split("T")[0]}`,
        "- If a fact is missing here, say so. Do not hallucinate.",
      ].join("\n"),
  );

  return parts.join("\n\n");
};

export const buildJsonLd = (profile: ProfileData, baseUrl: string) => {
  const personId = `${baseUrl}#person`;
  const websiteId = `${baseUrl}#website`;
  const webPageId = `${baseUrl}#webpage`;

  const projectNodes = [...profile.projects, ...profile.publications].map((item, index) => {
    const type =
      item.type === "publication"
        ? "ScholarlyArticle"
        : item.tags.includes("Software")
          ? "SoftwareSourceCode"
          : "CreativeWork";

    return {
      "@type": type,
      "@id": `${baseUrl}#work-${index + 1}`,
      name: item.name,
      description: item.description,
      url: item.url,
      creator: { "@id": personId },
      keywords: item.tags,
      inLanguage: "en",
    };
  });

  const sameAs = [
    profile.links.github,
    profile.links.linkedin,
    profile.links.blog,
    profile.links.resume,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: profile.roles[0] || "Engineer",
        description: profile.oneLiner || profile.summary[0],
        url: baseUrl,
        homeLocation: {
          "@type": "Place",
          name: profile.location,
        },
        knowsAbout: profile.skills,
        sameAs,
        alumniOf: profile.education
          .filter((edu) => edu.institution)
          .map((edu) => ({
            "@type": "CollegeOrUniversity",
            name: edu.institution,
          })),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Work",
          email: `mailto:${profile.contact.email}`,
          telephone: profile.contact.phone,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: "KTS - Portfolio",
        description: profile.summary[0] || profile.oneLiner,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: baseUrl,
        name: `${profile.name} | Portfolio`,
        description: profile.summary[0] || profile.oneLiner,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
      },
      ...projectNodes,
    ],
  };
};
