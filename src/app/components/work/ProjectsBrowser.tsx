"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/portfolio";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "software", label: "Software" },
  { key: "publication", label: "Publication" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const toFilter = (value: string | null): FilterKey =>
  FILTERS.find((filter) => filter.key === value?.toLowerCase())?.key ?? "all";

// Chips and the project list. Without onSelect (the server-rendered fallback) the
// chips are inert until the page hydrates.
export function ProjectsView({
  projects,
  active,
  onSelect,
}: {
  projects: Project[];
  active: FilterKey;
  onSelect?: (filter: FilterKey) => void;
}) {
  const visible =
    active === "all" ? projects : projects.filter((project) => project.category.toLowerCase() === active);

  return (
    <>
      <section className="mgrid pt-6">
        <div className="mspacer" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className="chip"
              aria-pressed={filter.key === active}
              onClick={() => onSelect?.(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>
      <div className="mt-7 m:mt-5">
        {visible.map((project) => (
          <article key={project.id} className="mgrid border-t border-rule2 py-7 m:py-6">
            <div className="mnote pt-3.5">{project.category}</div>
            <div className="min-w-0 max-w-[820px]">
              <h2 className="text-[clamp(28px,3vw,38px)] font-medium leading-[1.1] tracking-[-0.015em] text-ink m:text-[26px]">
                {project.name}
              </h2>
              <p className="mt-2.5 text-[18px] leading-[1.6] m:text-[17px]">{project.description}</p>
              {project.tech.length > 0 && (
                <p className="mt-3 font-mono text-[13px] leading-[1.6] text-tx2">{project.tech.join(", ")}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-x-5 font-mono text-[13px]">
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center m:min-h-11 text-ink">
                    Live demo ↗
                  </a>
                )}
                {project.links.paper && (
                  <a href={project.links.paper} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center m:min-h-11 text-ink">
                    Read paper ↗
                  </a>
                )}
                {project.links.source && (
                  <a href={project.links.source} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center m:min-h-11 text-tx2">
                    Source ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

// Reads ?filter= and keeps it in the URL, so a filtered list can be shared.
export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const pathname = usePathname();
  const active = toFilter(useSearchParams().get("filter"));

  const onSelect = (filter: FilterKey) => {
    const url = filter === "all" ? pathname : `${pathname}?filter=${filter}`;
    window.history.replaceState(null, "", url);
  };

  return <ProjectsView projects={projects} active={active} onSelect={onSelect} />;
}
