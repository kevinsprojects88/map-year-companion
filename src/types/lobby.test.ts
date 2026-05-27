import assert from "node:assert/strict";
import test from "node:test";

import type {
  LobbyRosterMemberViewModel,
  LobbyStatusViewModel
} from "./lobby";

test("lobby status view model includes a read-only ordered roster", () => {
  const member = {
    displayName: "Kevin",
    isCurrentUser: true,
    joinedLabel: "Joined May 27, 2026",
    membershipId: "b526a640-2dac-48fd-85fb-91c2effbf225",
    profileId: "7d14147c-53d1-4883-9a50-c0e753382d7d",
    role: "owner",
    roleLabel: "Owner",
    status: "active",
    statusLabel: "Active",
    turnOrderIndex: 0,
    turnOrderLabel: "Turn order: 1"
  } satisfies LobbyRosterMemberViewModel;

  const roster = {
    memberCount: 1,
    memberCountLabel: "1 active member",
    members: [member],
    readOnlyLabel: "Turn order editing comes later."
  } satisfies LobbyStatusViewModel["roster"];

  assert.equal(roster.members[0]?.displayName, "Kevin");
});
