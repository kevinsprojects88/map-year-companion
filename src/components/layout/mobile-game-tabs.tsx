import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import type { MobileGameTabViewModel } from "@/types/layout";

type MobileGameTabsProps = Omit<ComponentProps<"nav">, "children"> & {
  tabs?: MobileGameTabViewModel[];
};

const defaultTabs: MobileGameTabViewModel[] = [
  { id: "turn", label: "Turn", previewed: true },
  { id: "chat", label: "Chat" },
  { id: "map", label: "Map" },
  { id: "state", label: "State" },
  { id: "history", label: "History" }
];

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function MobileGameTabs({
  className,
  tabs = defaultTabs,
  ...props
}: MobileGameTabsProps) {
  return (
    <nav
      aria-label="Static future mobile game tabs placeholder"
      data-slot="mobile-game-tabs"
      className={classes(
        "rounded-lg border border-dashed border-border bg-surface-raised p-3 shadow-paper-sm",
        className
      )}
      {...props}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
          Static mobile tab labels
        </p>
        <Badge variant="outline">Non-functional preview</Badge>
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <span
              aria-current={tab.previewed ? "page" : undefined}
              className={classes(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md border px-1.5 py-2 text-center text-xs font-semibold leading-tight",
                tab.previewed
                  ? "border-border-strong bg-surface text-foreground shadow-paper-sm"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              <span>{tab.label}</span>
              {tab.badgeLabel ? (
                <span className="font-mono text-[0.65rem] uppercase">
                  {tab.badgeLabel}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { MobileGameTabs };
export type { MobileGameTabsProps };
