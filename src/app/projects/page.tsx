import type { Metadata } from "next";
import { Suspense } from "react";
import WorkHead from "@/app/components/work/WorkHead";
import ProjectsBrowser, { ProjectsView } from "@/app/components/work/ProjectsBrowser";
import { buildPageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/portfolio";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects & publications",
  description:
    "Projects and publications by Krishnatejaswi Shenthar: graph-rca, permission-mongo, BetterBingImageDownloader, a Clang complexity plugin, and papers in IJEECS and IEEE Xplore.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="pb-24 m:pb-12">
      <WorkHead active="projects" />
      <Suspense fallback={<ProjectsView projects={projects} active="all" />}>
        <ProjectsBrowser projects={projects} />
      </Suspense>
    </div>
  );
}
