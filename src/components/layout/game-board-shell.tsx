import type { ComponentProps, ReactNode } from "react";

type GameBoardShellProps = Omit<ComponentProps<"section">, "children"> & {
  header: ReactNode;
  mapWorkspace: ReactNode;
  mapWorkspaceLabel?: string;
  rightRail: ReactNode;
  rightRailLabel?: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function GameBoardShell({
  className,
  header,
  mapWorkspace,
  mapWorkspaceLabel = "Map workspace placeholder",
  rightRail,
  rightRailLabel = "Persistent right rail placeholder",
  ...props
}: GameBoardShellProps) {
  return (
    <section
      aria-label="Placeholder game board shell"
      data-slot="game-board-shell"
      className={classes("flex min-w-0 flex-col gap-4", className)}
      {...props}
    >
      {header}
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
        <section
          aria-label={mapWorkspaceLabel}
          className="min-w-0 rounded-lg border border-border bg-surface p-3 shadow-paper-sm"
        >
          {mapWorkspace}
        </section>
        <section aria-label={rightRailLabel} className="min-w-0">
          {rightRail}
        </section>
      </div>
    </section>
  );
}

export { GameBoardShell };
export type { GameBoardShellProps };
