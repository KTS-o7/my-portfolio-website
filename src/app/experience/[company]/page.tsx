import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { experience, getExperience, getWorkForCompany } from "@/lib/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return experience.map((entry) => ({ company: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const entry = getExperience(company);
  if (!entry) return {};
  return buildPageMetadata({
    title: `${entry.company.name} — Experience`,
    description: entry.summary ?? `${entry.role} at ${entry.company.name}.`,
    path: `/experience/${entry.slug}`,
    type: "profile",
  });
}

export default async function CompanyExperiencePage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const entry = getExperience(company);
  if (!entry) notFound();

  const index = experience.indexOf(entry);
  const newer = experience[index - 1];
  const older = experience[index + 1];
  const caseStudy = getWorkForCompany(entry.company.name);

  return (
    <div className="pb-24 m:pb-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/experience" },
          { label: "Experience", href: "/experience" },
          { label: entry.company.name },
        ]}
      />

      <section className="mgrid pt-10 m:pt-5">
        <div className="mnote pt-4 leading-[1.8] m:leading-relaxed">
          {entry.type && <span className="mnote-line">{entry.type}</span>}
          <span className="mnote-line">{entry.timeframe}</span>
          {entry.location && <span className="mnote-line">{entry.location}</span>}
        </div>
        <div className="max-w-[820px]">
          <h1 className="text-[clamp(52px,7vw,84px)] font-medium leading-[0.98] tracking-[-0.03em] text-ink m:mt-1 m:text-[44px]">
            {entry.company.name}
          </h1>
          <div className="mt-2.5 font-mono text-sm text-acc">{entry.role}</div>
          {entry.summary && (
            <p className="mt-4 text-[24px] italic leading-[1.45] m:text-[19px]">{entry.summary}</p>
          )}
          <div className="mt-[18px] flex flex-wrap gap-3">
            {caseStudy && (
              <Link href={`/work/${caseStudy.slug}`} className="btn-outline">
                Read the {caseStudy.title} case study →
              </Link>
            )}
            {entry.company.url && (
              <a href={entry.company.url} target="_blank" rel="noopener noreferrer" className="btn-text">
                Company site ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {entry.highlights && entry.highlights.length > 0 && (
        <section className="mgrid pt-12 m:pt-9" aria-label="Highlights">
          <div className="mnote mnote-sec pt-2.5">§ highlights</div>
          <ol className="max-w-[820px] m:mt-1">
            {entry.highlights.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[36px_minmax(0,1fr)] border-t border-rule py-3 text-[19px] leading-[1.55] last:border-b m:text-[17px]"
              >
                <span className="pt-1.5 font-mono text-[11px] text-acc">{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {entry.skills && entry.skills.length > 0 && (
        <section className="mgrid pt-10 m:pt-8" aria-label="Stack">
          <div className="mnote mnote-sec pt-1.5">§ stack</div>
          <p className="max-w-[820px] font-mono text-[13px] leading-[1.8] text-tx m:mt-1">
            {entry.skills.join(" · ")}
          </p>
        </section>
      )}

      {(newer || older) && (
        <nav className="mgrid pt-10 m:pt-8" aria-label="More experience">
          <div className="mnote mnote-sec pt-3.5">next</div>
          <div className="grid max-w-[820px] grid-cols-2 border-t-[1.5px] border-rule2 m:mt-1">
            {newer ? (
              <Link href={`/experience/${newer.slug}`} className="group flex flex-col gap-1.5 pr-5 pt-3.5">
                <span className="font-mono text-[11px] text-tx2">← newer</span>
                <span className="text-[24px] font-medium leading-tight text-ink group-hover:text-acc m:text-[20px]">
                  {newer.company.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {older ? (
              <Link
                href={`/experience/${older.slug}`}
                className="group flex flex-col gap-1.5 border-l border-rule pl-5 pt-3.5 text-right"
              >
                <span className="font-mono text-[11px] text-tx2">older →</span>
                <span className="text-[24px] font-medium leading-tight text-ink group-hover:text-acc m:text-[20px]">
                  {older.company.name}
                </span>
              </Link>
            ) : (
              <span className="border-l border-rule" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
