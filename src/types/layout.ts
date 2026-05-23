import type { BadgeState, BadgeVariant } from "@/components/ui/badge";
import type { ButtonVariant } from "@/components/ui/button";

type LayoutActionViewModel = {
  ariaLabel?: string;
  disabledReason?: string;
  id: string;
  label: string;
  variant?: ButtonVariant;
};

type AppHeaderNavigationItemViewModel = {
  current?: boolean;
  detail?: string;
  id: string;
  label: string;
  marker?: string;
};

type AppHeaderViewModel = {
  navigationItems?: AppHeaderNavigationItemViewModel[];
  primaryAction?: LayoutActionViewModel;
  productName: string;
  subtitle?: string;
  userDisplayLabel?: string;
};

type GameHeaderBadgeViewModel = {
  id: string;
  label?: string;
  marker?: string;
  state?: BadgeState;
  variant?: BadgeVariant;
};

type GameHeaderViewModel = {
  activePlayerLabel: string;
  currentTurnLabel: string;
  gameStatusLabel: string;
  rightActions?: LayoutActionViewModel[];
  statusBadges?: GameHeaderBadgeViewModel[];
  worldTitle: string;
};

type MobileGameTabViewModel = {
  badgeLabel?: string;
  id: string;
  label: string;
  previewed?: boolean;
};

export type {
  AppHeaderNavigationItemViewModel,
  AppHeaderViewModel,
  GameHeaderBadgeViewModel,
  GameHeaderViewModel,
  LayoutActionViewModel,
  MobileGameTabViewModel
};
