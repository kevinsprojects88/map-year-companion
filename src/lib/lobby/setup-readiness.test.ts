import assert from "node:assert/strict";
import test from "node:test";

const { buildLobbySetupReadiness } = (await import(
  "./setup-readiness" + ".ts"
)) as typeof import("./setup-readiness");

type SetupReadinessInput = Parameters<typeof buildLobbySetupReadiness>[0];

const orderedTwoMemberInput = {
  gameStatus: "setup",
  gameStatusLabel: "Setup",
  isOwnerAdmin: true,
  memberCount: 2,
  memberCountLabel: "2 active members",
  rosterMembers: [
    {
      displayName: "Kevin",
      turnOrderIndex: 0
    },
    {
      displayName: "kevinrallen0",
      turnOrderIndex: 1
    }
  ]
} satisfies SetupReadinessInput;

test("marks players and turn order ready from active member roster data", () => {
  const readiness = buildLobbySetupReadiness(orderedTwoMemberInput);

  assert.equal(readiness.summary.readyCount, 2);
  assert.equal(readiness.summary.totalCount, 6);
  assert.equal(readiness.summary.summaryLabel, "2 of 6 setup areas ready");
  assert.deepEqual(readiness.summary.readyAreaLabels, [
    "Players invited",
    "Turn order"
  ]);

  assert.equal(readiness.items[0]?.title, "Players invited");
  assert.equal(readiness.items[0]?.status, "complete");
  assert.equal(readiness.items[1]?.title, "Turn order");
  assert.equal(readiness.items[1]?.status, "complete");
});

test("warns when only one active member is in the lobby", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    memberCount: 1,
    memberCountLabel: "1 active member",
    rosterMembers: [orderedTwoMemberInput.rosterMembers[0]]
  });

  const playersItem = readiness.items.find(
    (item) => item.title === "Players invited"
  );

  assert.equal(playersItem?.status, "warning");
  assert.equal(playersItem?.readinessCategory, "incomplete");
  assert.match(
    playersItem?.validationMessages?.join(" ") ?? "",
    /solo start may be allowed later/i
  );
  assert.deepEqual(readiness.summary.needsAttentionAreaLabels, [
    "Players invited"
  ]);
});

test("warns when any active member has no turn order", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    rosterMembers: [
      orderedTwoMemberInput.rosterMembers[0],
      {
        displayName: "kevinrallen0",
        turnOrderIndex: null
      }
    ]
  });

  const turnOrderItem = readiness.items.find(
    (item) => item.title === "Turn order"
  );

  assert.equal(turnOrderItem?.status, "warning");
  assert.match(
    turnOrderItem?.validationMessages?.join(" ") ?? "",
    /missing a turn order/i
  );
});

test("warns when active member turn order indexes are duplicated", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    rosterMembers: [
      orderedTwoMemberInput.rosterMembers[0],
      {
        displayName: "kevinrallen0",
        turnOrderIndex: 0
      }
    ]
  });

  const turnOrderItem = readiness.items.find(
    (item) => item.title === "Turn order"
  );

  assert.equal(turnOrderItem?.status, "warning");
  assert.match(
    turnOrderItem?.validationMessages?.join(" ") ?? "",
    /unique/i
  );
});

test("keeps future setup areas disabled and start game blocked", () => {
  const readiness = buildLobbySetupReadiness(orderedTwoMemberInput);

  const futureAreas = readiness.items
    .filter((item) => item.readinessCategory === "future")
    .map((item) => item.title);
  const startGameItem = readiness.items.find(
    (item) => item.title === "Start game"
  );

  assert.deepEqual(futureAreas, [
    "Deck/card setup",
    "Initial map",
    "Community notes"
  ]);
  assert.equal(startGameItem?.status, "blocked");
  assert.equal(startGameItem?.readinessCategory, "blocked");
  assert.deepEqual(readiness.summary.blockedAreaLabels, ["Start game"]);
});

test("uses distinct setup copy for owner/admin and player members", () => {
  const ownerReadiness = buildLobbySetupReadiness(orderedTwoMemberInput);
  const playerReadiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    isOwnerAdmin: false
  });

  assert.match(ownerReadiness.summary.roleDescription, /invite players/i);
  assert.match(ownerReadiness.summary.roleDescription, /adjust turn order/i);
  assert.match(playerReadiness.summary.roleDescription, /read-only/i);
  assert.match(playerReadiness.summary.roleDescription, /owner\/admin/i);
});
