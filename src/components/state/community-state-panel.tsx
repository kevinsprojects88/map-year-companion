import type { ComponentProps, ReactNode } from "react";

import { DiscontentCard } from "@/components/state/discontent-card";
import { ProjectCard } from "@/components/state/project-card";
import { ResourceCard } from "@/components/state/resource-card";
import { EmptyState } from "@/components/feedback/empty-state";
import type {
  DiscontentCardViewModel,
  ProjectCardViewModel,
  ResourceCardViewModel
} from "@/types/community-state";

type CommunityStatePanelProps = Omit<ComponentProps<"section">, "title"> & {
  description?: string;
  discontent: DiscontentCardViewModel[];
  projects: ProjectCardViewModel[];
  resources: ResourceCardViewModel[];
  title?: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StateSection({
  children,
  description,
  title
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby={`${title}-heading`}>
      <div className="flex flex-col gap-1">
        <h3 id={`${title}-heading`} className="text-xl font-semibold">
          {title}
        </h3>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function CommunityStatePanel({
  className,
  description = "Display-only grouping for mock projects, resources, and discontent state.",
  discontent,
  projects,
  resources,
  title = "Community State Mock Panel",
  ...props
}: CommunityStatePanelProps) {
  return (
    <section
      className={classes("flex flex-col gap-8", className)}
      aria-labelledby="community-state-panel-heading"
      {...props}
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
          Display-only state grouping
        </p>
        <h2 id="community-state-panel-heading" className="text-2xl font-semibold">
          {title}
        </h2>
        <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <StateSection
        title="Projects"
        description="Mock project records with official, completed, abandoned, and provisional states."
      >
        {projects.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mock projects shown"
            description="This placeholder panel can show project records later without adding real state logic now."
          />
        )}
      </StateSection>

      <StateSection
        title="Resources"
        description="Mock community resources with text labels for abundance, scarcity, neutral, custom, and draft states."
      >
        {resources.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mock resources shown"
            description="This placeholder panel can show resource records later without treating them like inventory stacks."
          />
        )}
      </StateSection>

      <StateSection
        title="Discontent"
        description="Mock discontent records with explicit holder, count, reason, and resolved or provisional labels."
      >
        {discontent.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {discontent.map((item) => (
              <DiscontentCard key={item.id} discontent={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mock discontent shown"
            description="This placeholder panel can show discontent records later while keeping official and draft state separate."
          />
        )}
      </StateSection>
    </section>
  );
}

export { CommunityStatePanel };
export type { CommunityStatePanelProps };
