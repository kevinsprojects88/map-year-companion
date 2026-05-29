import assert from "node:assert/strict";
import test from "node:test";

const { buildLobbySetupReadiness } = (await import(
  "./setup-readiness" + ".ts"
)) as typeof import("./setup-readiness");

type SetupReadinessInput = Parameters<typeof buildLobbySetupReadiness>[0];

const orderedTwoMemberInput = {
  deckSetup: {
    cardCount: 0,
    deckId: null,
    promptTextCount: 0,
    isLocked: false,
    setupHref: "/games/c54887e2-6ee1-46a2-9861-7a5894d697db/setup/deck",
    sourceType: null,
    status: null
  },
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
    "Players invited",
    "Deck/card setup"
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
    "Initial map",
    "Community notes"
  ]);
  assert.equal(startGameItem?.status, "blocked");
  assert.equal(startGameItem?.readinessCategory, "blocked");
  assert.deepEqual(readiness.summary.blockedAreaLabels, ["Start game"]);
});

test("marks missing deck setup incomplete and links the setup route", () => {
  const readiness = buildLobbySetupReadiness(orderedTwoMemberInput);
  const deckItem = readiness.items.find(
    (item) => item.title === "Deck/card setup"
  );

  assert.equal(deckItem?.status, "warning");
  assert.equal(deckItem?.statusLabel, "Missing");
  assert.equal(deckItem?.readinessCategory, "incomplete");
  assert.equal(
    deckItem?.actionHref,
    "/games/c54887e2-6ee1-46a2-9861-7a5894d697db/setup/deck"
  );
  assert.equal(deckItem?.actionLabel, "Open deck setup");
  assert.match(
    deckItem?.validationMessages?.join(" ") ?? "",
    /No draft deck exists yet/i
  );
  assert.deepEqual(readiness.summary.needsAttentionAreaLabels, [
    "Deck/card setup"
  ]);
});

test("marks a draft deck as in progress until it has meaningful validation", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    deckSetup: {
      ...orderedTwoMemberInput.deckSetup,
      cardCount: 0,
      deckId: "11111111-1111-4111-8111-111111111111",
      promptTextCount: 0,
      sourceType: "placeholder",
      status: "draft"
    }
  });
  const deckItem = readiness.items.find(
    (item) => item.title === "Deck/card setup"
  );

  assert.equal(deckItem?.status, "warning");
  assert.equal(deckItem?.statusLabel, "In progress");
  assert.equal(deckItem?.readinessCategory, "incomplete");
  assert.match(
    deckItem?.validationMessages?.join(" ") ?? "",
    /0 \/ 52 cards configured/i
  );
});

test("marks a valid full deck complete when the saved status supports it", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    deckSetup: {
      ...orderedTwoMemberInput.deckSetup,
      cardCount: 52,
      deckId: "11111111-1111-4111-8111-111111111111",
      isLocked: true,
      promptTextCount: 52,
      sourceType: "manual",
      status: "locked"
    }
  });
  const deckItem = readiness.items.find(
    (item) => item.title === "Deck/card setup"
  );

  assert.equal(deckItem?.status, "complete");
  assert.equal(deckItem?.statusLabel, "Complete");
  assert.equal(deckItem?.readinessCategory, "complete");
  assert.deepEqual(readiness.summary.readyAreaLabels, [
    "Players invited",
    "Turn order",
    "Deck/card setup"
  ]);
});

test("keeps a full deck incomplete until all saved cards have prompt text", () => {
  const readiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    deckSetup: {
      ...orderedTwoMemberInput.deckSetup,
      cardCount: 52,
      deckId: "11111111-1111-4111-8111-111111111111",
      isLocked: true,
      promptTextCount: 51,
      sourceType: "manual",
      status: "locked"
    }
  });
  const deckItem = readiness.items.find(
    (item) => item.title === "Deck/card setup"
  );

  assert.equal(deckItem?.status, "warning");
  assert.equal(deckItem?.readinessCategory, "incomplete");
  assert.match(
    deckItem?.validationMessages?.join(" ") ?? "",
    /51 \/ 52 cards have prompt text/i
  );
});

test("uses distinct setup copy for owner/admin and player members", () => {
  const ownerReadiness = buildLobbySetupReadiness(orderedTwoMemberInput);
  const playerReadiness = buildLobbySetupReadiness({
    ...orderedTwoMemberInput,
    isOwnerAdmin: false
  });
  const playerDeckItem = playerReadiness.items.find(
    (item) => item.title === "Deck/card setup"
  );

  assert.match(ownerReadiness.summary.roleDescription, /invite players/i);
  assert.match(ownerReadiness.summary.roleDescription, /adjust turn order/i);
  assert.match(playerReadiness.summary.roleDescription, /read-only/i);
  assert.match(playerReadiness.summary.roleDescription, /owner\/admin/i);
  assert.equal(playerDeckItem?.actionLabel, "View deck setup");
});
