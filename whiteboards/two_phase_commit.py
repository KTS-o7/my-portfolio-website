"""Whiteboard for content/blog/systems/two_phase_commit.md.

Usage: python3 -I whiteboards/two_phase_commit.py
Writes public/whiteboards/two-phase-commit.html. Needs the whiteboard-html skill engine.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.home() / ".claude/skills/whiteboard-html/scripts"))
import wb  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

STEPS = [
    ("One transaction, two nodes",
     "A transaction touches two nodes. Either both commit or neither does. A coordinator drives "
     "the protocol; the nodes are participants.",
     "The Protocol"),
    ("Phase 1: PREPARE",
     "The coordinator sends PREPARE to every participant.",
     "The Protocol"),
    ("Participants get ready",
     "Each participant writes the transaction to a durable log and acquires the locks it needs. "
     "From here on it can commit if asked.",
     "The Protocol"),
    ("Everyone votes YES",
     "Each participant replies YES, ready to commit. A participant that hit a problem would "
     "reply NO.",
     "The Protocol"),
    ("Phase 2: COMMIT",
     "All votes were YES, so the coordinator sends COMMIT. Each participant commits and "
     "releases its locks. Every node ends in the same state.",
     "The Protocol"),
    ("If anyone says NO",
     "A single NO changes the decision: the coordinator sends ABORT to everyone, and every "
     "participant aborts and releases its locks.",
     "The Protocol"),
    ("The coordinator crashes",
     "Run it again, but crash the coordinator after phase 1 and before phase 2. Both "
     "participants voted YES and are holding their locks.",
     "The Fatal Flaw"),
    ("Stuck in both directions",
     "Committing might be wrong if another participant said NO. Aborting might be wrong if "
     "COMMIT was about to arrive. So they wait, locks held, until the coordinator recovers. "
     "That is the blocking problem.",
     "The Fatal Flaw"),
    ("The attempted fix: 3PC",
     "Three-phase commit adds PRE-COMMIT between the two. A participant that received it knows "
     "the coordinator saw every YES, so it can commit alone if the coordinator disappears. It "
     "costs an extra round of messages and still has edge cases under network partitions.",
     "The Attempted Fix: 3PC"),
    ("What systems do instead",
     "Most large systems avoid 2PC for anything user-facing. Sagas use compensating "
     "transactions, consensus protocols like Paxos and Raft give strong guarantees at more "
     "complexity, and optimistic concurrency detects conflicts at commit time.",
     "What Systems Actually Do"),
    ("Recap",
     "2PC gives you distributed atomicity, and you pay for it with availability when the "
     "coordinator fails. The other approaches are different points on that curve.",
     "What Systems Actually Do"),
]
STEPS = [(h, b, f"the “{o}” section") for h, b, o in STEPS]

STORY_JS = r"""
  // Regions: coordinator left (x 160-460), node A top (x 1100-1400, y 240-370) and node B
  // bottom (y 880-1010), their status notes right of them (x 1440-1800), the 3PC row along the
  // bottom (y 1150-1350), the alternatives column on the right (x 1870-2530, y 200-840).
  const FULL = [0, 0, 2600, 1462];
  const MAIN = [60, 170, 1800, 1013];
  const S = [];

  // 0. Actors
  S.push({ cam: MAIN, ops: [
    box("coord", 160, 560, 300, 130, ["coordinator"], { size: 28 }),
    box("a", 1100, 240, 300, 130, ["node A"], { size: 28 }),
    box("b", 1100, 880, 300, 130, ["node B"], { size: 28 }),
    note("goal", 160, 760, ["all commit, or none do"], { k: "old", size: 26 }),
  ] });

  // 1. PREPARE
  S.push({ cam: MAIN, ops: [
    arrow("pa", [[462, 600], [1096, 320]], { k: "new", label: "PREPARE", at: [700, 400], size: 24 }),
    arrow("pb", [[462, 660], [1096, 930]], { k: "new", label: "PREPARE", at: [700, 862], size: 24 }),
  ], packets: [{ via: "pa", overlap: 0 }, { via: "pb", overlap: 0 }] });

  // 2. Durable log + locks
  S.push({ cam: MAIN, ops: [
    note("a_s", 1440, 262, ["writes the transaction", "to a durable log,", "acquires locks"], { k: "new", size: 24 }),
    note("b_s", 1440, 902, ["writes the transaction", "to a durable log,", "acquires locks"], { k: "new", size: 24 }),
  ] });

  // 3. YES votes
  S.push({ cam: MAIN, ops: [
    arrow("ya", [[1096, 362], [470, 632]], { k: "new", dash: true, label: "YES", at: [860, 520], size: 24 }),
    arrow("yb", [[1096, 960], [470, 690]], { k: "new", dash: true, label: "YES", at: [860, 760], size: 24 }),
  ], packets: [{ via: "ya", overlap: 0 }, { via: "yb", overlap: 0 }] });

  // 4. COMMIT
  S.push({ cam: MAIN, erase: ["pa", "pb", "a_s", "b_s"], mute: ["ya", "yb"], ops: [
    arrow("ca", [[462, 600], [1096, 320]], { k: "new", label: "COMMIT", at: [700, 400], size: 24 }),
    arrow("cb", [[462, 660], [1096, 930]], { k: "new", label: "COMMIT", at: [700, 862], size: 24 }),
    note("a_c", 1440, 278, ["commits,", "releases locks"], { k: "new", size: 24 }),
    note("b_c", 1440, 918, ["commits,", "releases locks"], { k: "new", size: 24 }),
  ], packets: [{ via: "ca", overlap: 0 }, { via: "cb", overlap: 0 }] });

  // 5. Any NO -> ABORT
  S.push({ cam: MAIN, ops: [
    note("no", 160, 820, ["any NO: ABORT goes", "to everyone instead"], { k: "bad", size: 24 }),
  ] });

  // 6. Crash after phase 1
  S.push({ cam: MAIN, erase: ["ca", "cb", "a_c", "b_c", "no", "goal"], ops: [
    strike("cx1", 168, 568, 452, 682),
    strike("cx2", 452, 568, 168, 682),
    note("crash", 160, 720, ["crashed after phase 1,", "before phase 2"], { k: "bad", size: 24 }),
    note("a_w", 1440, 262, ["voted YES,", "locks held"], { k: "bad", size: 24 }),
    note("b_w", 1440, 902, ["voted YES,", "locks held"], { k: "bad", size: 24 }),
  ] });

  // 7. The dilemma
  S.push({ cam: MAIN, ops: [
    note("d1", 640, 590, ["commit? another node", "might have said NO"], { k: "bad", size: 22 }),
    note("d2", 640, 672, ["abort? COMMIT might", "have been on its way"], { k: "bad", size: 22 }),
    note("wait", 1440, 400, ["so they wait, locks held,", "until the coordinator", "comes back"], { k: "old", size: 24 }),
  ] });

  // 8. 3PC
  S.push({ cam: [60, 449, 1800, 1013], ops: [
    box("ph1", 200, 1150, 300, 100, ["PREPARE"], { size: 26 }),
    box("ph2", 620, 1150, 340, 100, ["PRE-COMMIT"], { k: "new", size: 26 }),
    box("ph3", 1080, 1150, 300, 100, ["COMMIT"], { size: 26 }),
    arrow("p12", [[502, 1200], [616, 1200]]),
    arrow("p23", [[962, 1200], [1076, 1200]]),
    note("pc", 200, 1290, ["got PRE-COMMIT: the coordinator saw every YES,", "so committing alone is safe if it vanishes"], { k: "new", size: 24 }),
    note("pc_cost", 1440, 1160, ["one extra round;", "still edge cases", "under partitions"], { k: "mute", size: 24 }),
  ], packets: [{ via: "p12" }, { via: "p23", overlap: 1 }] });

  // 9. What systems do instead
  S.push({ cam: [1100, 150, 1500, 844], ops: [
    frame("alts", 1870, 200, 660, 640, "what systems do instead"),
    box("alt1", 1900, 250, 600, 160, ["Saga pattern", "compensating transactions:", "no locks, no true atomicity"], { k: "new", size: 24 }),
    box("alt2", 1900, 440, 600, 160, ["Paxos / Raft", "consensus: strong guarantees,", "more complexity"], { k: "new", size: 24 }),
    box("alt3", 1900, 630, 600, 160, ["Optimistic concurrency", "detect conflicts at commit:", "good for low contention"], { k: "new", size: 24 }),
  ] });

  // 10. Recap
  S.push({ cam: FULL, ops: [
    frame("legend", 1870, 1180, 660, 200, "legend"),
    box("lg_old", 1900, 1220, 44, 34, [], { k: "old" }),
    note("lg_old_t", 1956, 1216, ["actors"], { k: "old", size: 22 }),
    box("lg_new", 2200, 1220, 44, 34, [], { k: "new" }),
    note("lg_new_t", 2256, 1216, ["this step"], { k: "new", size: 22 }),
    box("lg_bad", 1900, 1300, 44, 34, [], { k: "bad" }),
    note("lg_bad_t", 1956, 1296, ["failure"], { k: "bad", size: 22 }),
    box("lg_mute", 2200, 1300, 44, 34, [], { k: "mute" }),
    note("lg_mute_t", 2256, 1296, ["done or costly"], { k: "mute", size: 22 }),
  ] });

"""

wb.build(
    out=ROOT / "public/whiteboards/two-phase-commit.html",
    title="Two-phase commit on a whiteboard",
    heading="Two-phase commit on a whiteboard",
    lede_html="The clean path, the crash that blocks it, and what 3PC tries. "
              "Press <strong>Next</strong> to step through it.",
    steps=STEPS,
    story_js=STORY_JS,
)
