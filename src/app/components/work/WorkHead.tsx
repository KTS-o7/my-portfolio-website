import Link from "next/link";

const TABS = [
  { key: "experience", href: "/experience", label: "Experience" },
  { key: "projects", href: "/projects", label: "Projects & publications" },
] as const;

// "Work" with its two tabs; each tab is its own route.
export default function WorkHead({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <section className="mgrid pt-14 m:pt-[26px]">
      <div className="mspacer" />
      <div>
        <h1 className="h-page">Work</h1>
        <nav aria-label="Work" className="tabs mt-6 m:mt-4">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={tab.key === active ? "page" : undefined}
              className="tab m:px-3"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
