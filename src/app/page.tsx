import type { Metadata } from "next";
import Link from "next/link";
import heroData from "@/data/hero.json";
import JsonLd from "@/app/components/site/JsonLd";
import { CtaPair, Metrics, ResumeLink, SectionHead } from "@/app/components/site/blocks";
import { buildJsonLd, getProfileData, getSiteUrl } from "@/lib/profile";
import { formatPostDate, getAllPosts, getSectionLabel } from "@/lib/blog";
import { experience, homeMetrics, projects } from "@/lib/portfolio";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const siteUrl = getSiteUrl();
  const jsonLd = buildJsonLd(getProfileData(siteUrl), siteUrl);
  const posts = getAllPosts();
  const featured = projects.filter((project) => project.category === "Software").slice(0, 3);

  return (
    <div className="pb-24 m:pb-12">
      <JsonLd data={jsonLd} />

      <section className="mgrid pt-16 m:pt-7">
        <div className="mspacer" />
        <h1 className="h-home">{heroData.headline}</h1>
      </section>
      <section className="mgrid pt-7 m:pt-4">
        <div className="mspacer" />
        <p className="lead max-w-[44ch]">{heroData.subhead}</p>
      </section>
      <section className="mgrid pt-8 m:pt-[22px]">
        <div className="mspacer" />
        <div className="cta-row">
          <CtaPair />
          <ResumeLink />
        </div>
      </section>
      <section className="mgrid pt-16 m:pt-[18px]">
        <div className="mspacer" />
        <Metrics items={homeMetrics} />
      </section>

      <section className="pt-[88px] m:pt-9" aria-labelledby="shipped">
        <SectionHead
          n="1"
          id="shipped"
          title="Where I've shipped"
          link={{ href: "/experience", label: "All experience →" }}
        />
        <div className="mt-3 m:mt-2">
          {experience.map((entry) => (
            <Link key={entry.slug} href={`/experience/${entry.slug}`} className="group mgrid row py-[18px] m:py-3">
              <span className="mnote pt-2">{entry.timeframe}</span>
              <span>
                <span className="block text-[26px] font-medium leading-tight text-ink group-hover:text-acc m:text-[21px]">
                  {entry.company.name}
                </span>
                <span className="mt-1 block text-[17px] leading-normal text-tx m:mt-0.5 m:text-[15px]">
                  {entry.role}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-[72px] m:pt-8" aria-labelledby="projects">
        <SectionHead
          n="2"
          id="projects"
          title="Projects that show how I think"
          link={{ href: "/projects", label: "All work →" }}
        />
        <div className="mt-3 m:mt-2">
          {featured.map((project) => (
            <a
              key={project.id}
              href={project.links.source}
              target="_blank"
              rel="noopener noreferrer"
              className="group mgrid row py-[18px] m:py-3"
            >
              <span className="mspacer" />
              <span>
                <span className="block text-[26px] font-medium leading-tight text-ink group-hover:text-acc m:text-[21px]">
                  {project.name}
                </span>
                <span className="mt-1 block text-[17px] leading-normal text-tx m:mt-0.5 m:text-[15px]">
                  {project.impact}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="pt-[72px] m:pt-8" aria-labelledby="notebook">
        <SectionHead
          n="3"
          id="notebook"
          title="From the notebook"
          link={{ href: "/blog", label: `All ${posts.length} entries →` }}
        />
        <div className="mgrid mt-3 m:mt-2">
          <div className="mspacer" />
          <div>
            {posts.slice(0, 3).map((post) => (
              <Link
                key={`${post.section}/${post.slug}`}
                href={`/blog/${post.section}/${post.slug}`}
                className="group row flex flex-col gap-1 py-3.5 m:gap-0.5 m:py-3"
              >
                <span className="meta m:text-[10.5px]">
                  {formatPostDate(post.date)} · {getSectionLabel(post.section)}
                </span>
                <span className="text-[21px] font-medium leading-tight text-ink group-hover:text-acc m:text-[19px]">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mgrid pt-24 m:pt-14">
        <div className="mspacer" />
        <div className="border-t border-rule2 pt-7">
          <h2 className="text-[clamp(36px,4.6vw,58px)] font-medium leading-[1.05] tracking-[-0.02em] text-ink m:text-[32px]">
            Let&apos;s build something reliable.
          </h2>
          <p className="mt-3.5 max-w-[52ch] text-[20px] leading-normal m:text-[18px]">
            Available for full-time roles and select freelance projects. Based in Bangalore — open to remote.
          </p>
          <div className="cta-row mt-7">
            <CtaPair />
          </div>
        </div>
      </section>
    </div>
  );
}
