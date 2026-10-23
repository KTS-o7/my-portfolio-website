import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import JsonLd from "@/app/components/site/JsonLd";
import { CtaPair, Metrics } from "@/app/components/site/blocks";
import { getAllPosts, getSectionLabel } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/metadata";
import { experience, getWork, type Metric } from "@/lib/portfolio";
import { getSiteUrl } from "@/lib/profile";
import { personSchema } from "@/lib/schema";

const pagePath = "/work/complianceos";
const workItem = getWork("complianceos");

const title = "ComplianceOS — End-to-end Work";
const description =
  "Founding-engineer style deep dive: discovery → architecture → development → deployment for ComplianceOS (OnFinance AI), with agentic workflows (LangGraph + LiteLLM) for compliance automation.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: pagePath,
  type: "article",
});

const letter = (i: number) => `(${String.fromCharCode(97 + i)})`;

export default function ComplianceOsPage() {
  if (!workItem) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${pagePath}`;
  const role = experience.find((entry) => entry.company.name === workItem.company.name);
  const posts = getAllPosts();
  const related = (workItem.relatedPosts ?? [])
    .map((key) => posts.find((post) => `${post.section}/${post.slug}` === key))
    .filter((post) => post !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    about: [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#work`,
        name: workItem.title,
        description: workItem.summary.join(" "),
        url: pageUrl,
        creator: personSchema(siteUrl),
        publisher: {
          "@type": "Organization",
          name: workItem.company.name,
          url: "https://www.onfinance.ai",
        },
        keywords: ["compliance automation", "BFSI", "agentic workflows", "LangGraph", "LiteLLM"],
        inLanguage: "en",
      },
    ],
  };

  return (
    <div className="pb-24 m:pb-12">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/experience" },
          { label: workItem.title },
        ]}
      />

      <section className="mgrid pt-10 m:pt-5">
        <div className="mnote pt-[18px] leading-[1.8] m:leading-relaxed">
          <span className="mnote-line">{workItem.company.name}</span>
          {role?.timeframe && <span className="mnote-line">{role.timeframe}</span>}
          <span className="mnote-line">{workItem.location}</span>
        </div>
        <div className="max-w-[820px]">
          <h1 className="text-[clamp(56px,8vw,96px)] font-medium leading-[0.98] tracking-[-0.03em] text-ink m:mt-1 m:text-[48px]">
            {workItem.title}
          </h1>
          <p className="mt-4 text-[26px] italic leading-[1.4] m:text-[20px]">{workItem.subtitle}</p>
        </div>
      </section>

      <section className="mgrid pt-10 m:pt-6">
        <div className="mspacer" />
        <Metrics items={workItem.metrics as Metric[]} className="max-w-[900px]" />
      </section>

      <section className="mgrid pt-12 m:pt-9" aria-labelledby="summary">
        <div className="mnote mnote-sec pt-2.5">§ 1</div>
        <div className="max-w-[720px]">
          <h2 id="summary" className="h-section">
            Summary
          </h2>
          {workItem.summary.map((paragraph) => (
            <p key={paragraph} className="mt-3.5 text-[21px] leading-[1.6] m:text-[18px]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mgrid pt-11 m:pt-9" aria-labelledby="highlights">
        <div className="mnote mnote-sec pt-2.5">§ 2</div>
        <div className="max-w-[720px]">
          <h2 id="highlights" className="h-section">
            Highlights
          </h2>
          <ol className="mt-3.5">
            {workItem.highlights.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[36px_minmax(0,1fr)] border-t border-rule py-3 text-[20px] leading-normal last:border-b m:text-[17px]"
              >
                <span className="pt-1.5 font-mono text-[11px] text-acc">{letter(i)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mgrid pt-11 m:pt-9" aria-label="Stack">
        <div className="mnote mnote-sec pt-1.5">§ 3 stack</div>
        <ul className="flex max-w-[720px] flex-wrap gap-2 font-mono text-[13px] m:mt-1.5">
          {workItem.stack.map((item) => (
            <li key={item} className="border border-rule2 px-2.5 py-1.5 text-ink">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <aside className="mgrid pt-11 m:pt-9" aria-label="Related writing">
          <div className="mnote mnote-sec pt-2.5">see also</div>
          <div className="max-w-[720px] m:mt-1">
            {related.map((post) => (
              <Link
                key={`${post.section}/${post.slug}`}
                href={`/blog/${post.section}/${post.slug}`}
                className="group flex items-baseline justify-between gap-5 border-t border-rule py-2.5 last:border-b"
              >
                <span className="text-[20px] font-medium leading-snug text-ink group-hover:text-acc m:text-[18px]">
                  {post.title}
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-tx2">
                  {getSectionLabel(post.section)}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <section className="mgrid pt-11 m:pt-9" aria-label="Notes">
        <div className="mnote mnote-sec pt-1">notes</div>
        <div className="max-w-[720px] m:mt-1">
          <p className="text-[18px] italic leading-[1.55]">{workItem.notes.join(" ")}</p>
          <div className="mt-3 font-mono text-xs leading-relaxed text-tx2">
            Evidence:{" "}
            {workItem.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="link-u text-ink">
                {link.label.replace(/\s*\(evidence\)\s*$/, "")} ↗
              </a>
            ))}
            {workItem.openness && <> · {workItem.openness}</>}
          </div>
          <div className="cta-row mt-[22px]">
            <CtaPair />
          </div>
        </div>
      </section>
    </div>
  );
}
