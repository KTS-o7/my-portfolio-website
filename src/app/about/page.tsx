import type { Metadata } from "next";
import Link from "next/link";
import aboutData from "@/data/about.json";
import { ResumeLink } from "@/app/components/site/blocks";
import { buildPageMetadata } from "@/lib/metadata";
import { toolbox } from "@/lib/portfolio";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "AI engineer building production agent systems, memory architectures, backend APIs, and evaluation pipelines at Future Standard.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  const education = aboutData.education[0];
  // Publications live in Work → Projects; only the certificates are listed here.
  const certifications = aboutData.certifications.filter((item) => item.startsWith("NPTEL"));

  return (
    <div className="pb-24 m:pb-12">
      <section className="mgrid pt-14 m:pt-[26px]">
        <div className="mspacer" />
        <h1 className="h-about">{aboutData.title}</h1>
      </section>

      <section className="mgrid pt-9 m:pt-5">
        <div className="mnote leading-[1.7]">
          <span className="mnote-line">{aboutData.location}</span>
          {education && (
            <>
              <span className="mnote-line m:hidden" aria-hidden="true">
                &nbsp;
              </span>
              <span className="mnote-line">{education.degreeShort}</span>
              <span className="mnote-line">{education.institution.split(",")[0]}</span>
              <span className="mnote-line">{education.years}</span>
              <span className="mnote-line">GPA {education.gpa}</span>
            </>
          )}
        </div>
        <div className="flex max-w-[720px] flex-col gap-5 text-[21px] leading-[1.6] m:mt-3 m:gap-4 m:text-[18px]">
          <p className="text-[26px] italic leading-[1.4] text-ink m:text-[21px]">{aboutData.lead}</p>
          <p>{aboutData.description.primary}</p>
          <div className="cta-row mt-2">
            <Link href="/contact" className="btn-ink">
              Get in touch →
            </Link>
            <ResumeLink />
          </div>
        </div>
      </section>

      <section className="pt-16 m:pt-10" aria-labelledby="toolbox">
        <div className="mgrid items-baseline">
          <div className="mspacer" />
          <h2 id="toolbox" className="h-list">
            Toolbox
          </h2>
        </div>
        <dl className="mt-2.5">
          {toolbox.map((group) => (
            <div key={group.label} className="mgrid row py-2.5">
              <dt className="mnote pt-[5px]">{group.label}</dt>
              <dd className="text-[20px] m:text-[18px]">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pt-16 m:pt-10" aria-labelledby="certifications">
        <div className="mgrid items-baseline">
          <div className="mspacer" />
          <h2 id="certifications" className="h-list">
            Certifications
          </h2>
        </div>
        <div className="mgrid mt-2.5">
          <div className="mspacer" />
          <ul className="max-w-[760px]">
            {certifications.map((item) => (
              <li key={item} className="row py-2.5 text-[17px] leading-normal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
