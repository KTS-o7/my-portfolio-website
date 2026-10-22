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
  // Cameras are automatic (framed from what each step draws, plus `focus`); only the
  // recap sets one. Regions: coordinator left (x 100-400), node A top (x 760-1060,
  // y 240-370) and node B bottom (y 880-1010), their status notes at x 1100-1420, the
  // dilemma notes between the arrows (x 480-760, y 598-730), the 3PC row along the bottom
  // (y 1150-1350), the alternatives column on the right (x 1870-2530, y 200-840).
  const FULL = [0, 0, 2600, 1462];
  const S = [];

  // 0. Actors
  S.push({ ops: [
    box("coord", 100, 560, 300, 130, ["coordinator"], { size: 30 }),
    box("a", 760, 240, 300, 130, ["node A"], { size: 30 }),
    box("b", 760, 880, 300, 130, ["node B"], { size: 30 }),
    note("goal", 100, 760, ["all commit,", "or none do"], { k: "old", size: 28 }),
  ] });

  // 1. PREPARE
  S.push({ focus: ["coord", "a", "b"], ops: [
    arrow("pa", [[402, 600], [756, 320]], { k: "new", label: "PREPARE", at: [540, 420], size: 26 }),
    arrow("pb", [[402, 660], [756, 930]], { k: "new", label: "PREPARE", at: [540, 818], size: 26 }),
  ], packets: [{ via: "pa", overlap: 0 }, { via: "pb", overlap: 0 }] });

  // 2. Durable log + locks
  S.push({ focus: ["a", "b"], ops: [
    note("a_s", 1100, 252, ["writes the transaction", "to a durable log,", "acquires locks"], { k: "new", size: 28 }),
    note("b_s", 1100, 892, ["writes the transaction", "to a durable log,", "acquires locks"], { k: "new", size: 28 }),
  ] });

  // 3. YES votes
  S.push({ focus: ["coord", "a", "b"], ops: [
    arrow("ya", [[756, 362], [410, 632]], { k: "new", dash: true, label: "YES", at: [640, 470], size: 26 }),
    arrow("yb", [[756, 960], [410, 690]], { k: "new", dash: true, label: "YES", at: [600, 880], size: 26 }),
  ], packets: [{ via: "ya", overlap: 0 }, { via: "yb", overlap: 0 }] });

  // 4. COMMIT
  S.push({ erase: ["pa", "pb", "a_s", "b_s"], mute: ["ya", "yb"], ops: [
    arrow("ca", [[402, 600], [756, 320]], { k: "new", label: "COMMIT", at: [540, 420], size: 26 }),
    arrow("cb", [[402, 660], [756, 930]], { k: "new", label: "COMMIT", at: [540, 818], size: 26 }),
    note("a_c", 1100, 270, ["commits,", "releases locks"], { k: "new", size: 28 }),
    note("b_c", 1100, 910, ["commits,", "releases locks"], { k: "new", size: 28 }),
  ], packets: [{ via: "ca", overlap: 0 }, { via: "cb", overlap: 0 }] });

  // 5. Any NO -> ABORT
  S.push({ focus: ["coord", "a", "b"], ops: [
    note("no", 100, 860, ["any NO: ABORT", "goes to everyone"], { k: "bad", size: 28 }),
  ] });

  // 6. Crash after phase 1
  S.push({ erase: ["ca", "cb", "a_c", "b_c", "no", "goal"], ops: [
    strike("cx1", 108, 568, 392, 682),
    strike("cx2", 392, 568, 108, 682),
    note("crash", 100, 730, ["crashed after", "phase 1, before", "phase 2"], { k: "bad", size: 28 }),
    note("a_w", 1100, 270, ["voted YES,", "locks held"], { k: "bad", size: 28 }),
    note("b_w", 1100, 910, ["voted YES,", "locks held"], { k: "bad", size: 28 }),
  ] });

  // 7. The dilemma
  S.push({ ops: [
    note("d1", 470, 596, ["commit? another node", "might have said NO"], { k: "bad", size: 26 }),
    note("d2", 470, 676, ["abort? COMMIT might", "be on its way"], { k: "bad", size: 26 }),
    note("wait", 1100, 520, ["so they wait,", "locks held, until", "the coordinator", "comes back"], { k: "old", size: 28 }),
  ] });

  // 8. 3PC
  S.push({ ops: [
    box("ph1", 100, 1150, 300, 100, ["PREPARE"], { size: 28 }),
    box("ph2", 500, 1150, 340, 100, ["PRE-COMMIT"], { k: "new", size: 28 }),
    box("ph3", 940, 1150, 300, 100, ["COMMIT"], { size: 28 }),
    arrow("p12", [[402, 1200], [496, 1200]]),
    arrow("p23", [[842, 1200], [936, 1200]]),
    note("pc", 100, 1290, ["got PRE-COMMIT: the coordinator saw every", "YES, so committing alone is safe"], { k: "new", size: 26 }),
    note("pc_cost", 940, 1290, ["one extra round;", "still edge cases", "under partitions"], { k: "mute", size: 24 }),
  ], packets: [{ via: "p12" }, { via: "p23", overlap: 1 }] });

  // 9. What systems do instead
  S.push({ ops: [
    frame("alts", 1870, 200, 660, 640, "what systems do instead"),
    box("alt1", 1900, 250, 600, 170, ["Saga pattern", "compensating transactions:", "no locks, no true atomicity"], { k: "new", size: 28 }),
    box("alt2", 1900, 440, 600, 170, ["Paxos / Raft", "consensus: strong", "guarantees, more complexity"], { k: "new", size: 28 }),
    box("alt3", 1900, 630, 600, 170, ["Optimistic concurrency", "detect conflicts at commit:", "good for low contention"], { k: "new", size: 28 }),
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
