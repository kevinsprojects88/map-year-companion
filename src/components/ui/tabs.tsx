"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode
} from "react";

type TabsActivationMode = "automatic" | "manual";
type TabsOrientation = "horizontal" | "vertical";

type TabsProps = ComponentProps<"div"> & {
  activationMode?: TabsActivationMode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  value?: string;
};

type TabsListProps = ComponentProps<"div">;

type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> & {
  badge?: ReactNode;
  value: string;
};

type TabsContentProps = ComponentProps<"div"> & {
  value: string;
};

type TabsContextValue = {
  activationMode: TabsActivationMode;
  baseId: string;
  orientation: TabsOrientation;
  setValue: (value: string) => void;
  value: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getTabId(baseId: string, value: string) {
  return `${baseId}-tab-${sanitizeId(value)}`;
}

function getPanelId(baseId: string, value: string) {
  return `${baseId}-panel-${sanitizeId(value)}`;
}

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Tabs.`);
  }

  return context;
}

function Tabs({
  activationMode = "automatic",
  className,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  value: controlledValue,
  ...props
}: TabsProps) {
  const generatedId = useId();
  const baseId = `tabs-${generatedId.replace(/:/g, "")}`;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? controlledValue ?? ""
  );
  const value = controlledValue ?? internalValue;
  const setValue = useCallback(
    (nextValue: string) => {
      if (nextValue === value) {
        return;
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange, value]
  );
  const context = useMemo<TabsContextValue>(
    () => ({
      activationMode,
      baseId,
      orientation,
      setValue,
      value
    }),
    [activationMode, baseId, orientation, setValue, value]
  );

  return (
    <TabsContext value={context}>
      <div
        data-orientation={orientation}
        data-slot="tabs"
        className={classes("flex flex-col gap-4", className)}
        {...props}
      />
    </TabsContext>
  );
}

function TabsList({
  className,
  onKeyDown,
  ...props
}: TabsListProps) {
  const { activationMode, orientation, setValue } =
    useTabsContext("TabsList");

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const isHorizontalNext =
      orientation === "horizontal" && event.key === "ArrowRight";
    const isHorizontalPrevious =
      orientation === "horizontal" && event.key === "ArrowLeft";
    const isVerticalNext =
      orientation === "vertical" && event.key === "ArrowDown";
    const isVerticalPrevious =
      orientation === "vertical" && event.key === "ArrowUp";
    const isHome = event.key === "Home";
    const isEnd = event.key === "End";

    if (
      !isHorizontalNext &&
      !isHorizontalPrevious &&
      !isVerticalNext &&
      !isVerticalPrevious &&
      !isHome &&
      !isEnd
    ) {
      return;
    }

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)'
      )
    );

    if (!tabs.length) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    if (isHome) {
      nextIndex = 0;
    } else if (isEnd) {
      nextIndex = tabs.length - 1;
    } else if (isHorizontalNext || isVerticalNext) {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (isHorizontalPrevious || isVerticalPrevious) {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    const nextTab = tabs[nextIndex];
    event.preventDefault();
    nextTab.focus();

    if (activationMode === "automatic" && nextTab.dataset.tabValue) {
      setValue(nextTab.dataset.tabValue);
    }
  }

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="tabs-list"
      onKeyDown={handleKeyDown}
      className={classes(
        "flex max-w-full gap-2 rounded-lg border border-border bg-muted p-1 shadow-paper-sm",
        orientation === "horizontal" && "flex-wrap items-center",
        orientation === "vertical" && "flex-col items-stretch",
        className
      )}
      {...props}
    />
  );
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    {
      badge,
      children,
      className,
      disabled,
      onClick,
      type = "button",
      value,
      ...props
    },
    ref
  ) {
    const { baseId, setValue, value: selectedValue } =
      useTabsContext("TabsTrigger");
    const selected = selectedValue === value;
    const tabId = getTabId(baseId, value);
    const panelId = getPanelId(baseId, value);

    return (
      <button
        ref={ref}
        role="tab"
        id={tabId}
        type={type}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        aria-selected={selected}
        data-state={selected ? "active" : "inactive"}
        data-slot="tabs-trigger"
        data-tab-value={value}
        disabled={disabled}
        tabIndex={selected ? 0 : -1}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !disabled) {
            setValue(value);
          }
        }}
        className={classes(
          "inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-md border px-3 py-2",
          "text-sm font-semibold leading-none text-muted-foreground transition-colors duration-150",
          "hover:border-border-strong hover:bg-card hover:text-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-55",
          "data-[state=active]:border-border-strong data-[state=active]:bg-surface-raised data-[state=active]:text-foreground data-[state=active]:shadow-paper-sm",
          "data-[state=active]:underline data-[state=active]:decoration-[3px] data-[state=active]:decoration-[var(--state-official-accent)] data-[state=active]:underline-offset-[7px]",
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {badge ? (
          <span
            data-slot="tabs-trigger-badge"
            className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.68rem] font-semibold leading-none text-muted-foreground"
          >
            {badge}
          </span>
        ) : null}
      </button>
    );
  }
);

function TabsContent({
  className,
  value,
  ...props
}: TabsContentProps) {
  const { baseId, value: selectedValue } = useTabsContext("TabsContent");
  const selected = selectedValue === value;

  return (
    <div
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTabId(baseId, value)}
      data-state={selected ? "active" : "inactive"}
      data-slot="tabs-content"
      hidden={!selected}
      tabIndex={0}
      className={classes(
        "rounded-lg border border-border bg-surface p-4 text-sm leading-6 shadow-paper-sm",
        "focus-visible:outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
export type {
  TabsActivationMode,
  TabsContentProps,
  TabsListProps,
  TabsOrientation,
  TabsProps,
  TabsTriggerProps
};
