"""Whiteboard for content/blog/systems/two_phase_commit.md.

Usage: python3 -I whiteboards/two_phase_commit.py
Writes public/whiteboards/two-phase-commit.html, using the whiteboard-html skill in .claude/skills/.
No coordinates: the elements, groups and links below are laid out by the skill (ELK) for
wide screens and for phones.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / ".claude/skills/whiteboard-html/scripts"))
import wb  # noqa: E402
from board_layout import Board, story_js  # noqa: E402


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

b = Board()

# ---------- what is on the board ----------
coord = b.box("coord", ["coordinator"], size=30, w=300, h=130)
na = b.box("a", ["node A"], size=30, w=300, h=130)
nb = b.box("b", ["node B"], size=30, w=300, h=130)
goal = b.note("goal", ["all commit,", "or none do"], k="old", size=28, slot="coord_n1")
crash = b.note("crash", ["crashed after", "phase 1, before", "phase 2"], k="bad", size=28, slot="coord_n1")
no = b.note("no", ["any NO: ABORT", "goes to everyone"], k="bad", size=28, slot="coord_n2")
d1 = b.note("d1", ["commit? another node", "might have said NO"], k="bad", size=26)
d2 = b.note("d2", ["abort? COMMIT might", "be on its way"], k="bad", size=26)
wait = b.note("wait", ["so they wait,", "locks held, until", "the coordinator", "comes back"], k="old", size=28)
a_s = b.note("a_s", ["writes the transaction", "to a durable log,", "acquires locks"], size=28, slot="a_n")
b_s = b.note("b_s", ["writes the transaction", "to a durable log,", "acquires locks"], size=28, slot="b_n")
a_c = b.note("a_c", ["commits,", "releases locks"], size=28, slot="a_n")
b_c = b.note("b_c", ["commits,", "releases locks"], size=28, slot="b_n")
a_w = b.note("a_w", ["voted YES,", "locks held"], k="bad", size=28, slot="a_n")
b_w = b.note("b_w", ["voted YES,", "locks held"], k="bad", size=28, slot="b_n")

ph1 = b.box("ph1", ["PREPARE"], size=28, w=300, h=100)
ph2 = b.box("ph2", ["PRE-COMMIT"], k="new", size=28, w=340, h=100)
ph3 = b.box("ph3", ["COMMIT"], size=28, w=300, h=100)
pc = b.note("pc", ["got PRE-COMMIT: the coordinator", "saw every YES, so committing", "alone is safe"], size=26)
pc_cost = b.note("pc_cost", ["one extra round;", "still edge cases", "under partitions"], k="mute", size=24)

alt1 = b.box("alt1", ["Saga pattern", "compensating transactions:", "no locks, no true atomicity"], k="new", size=28, w=600, h=170)
alt2 = b.box("alt2", ["Paxos / Raft", "consensus: strong", "guarantees, more complexity"], k="new", size=28, w=600, h=170)
alt3 = b.box("alt3", ["Optimistic concurrency", "detect conflicts at commit:", "good for low contention"], k="new", size=28, w=600, h=170)

LEGEND = [("old", "actors"), ("new", "this step"), ("bad", "failure"), ("mute", "done or costly")]
legend = []
for k, label in LEGEND:
    legend += [b.box(f"lg_{k}", [], k=k, w=44, h=34), b.note(f"lg_{k}_t", [label], k=k, size=22)]

# ---------- how it is arranged ----------
# The coordinator's notes stack under it (above it on phones, so it stays next to A and B);
# the dilemma and "so they wait" read in story order either way.
b.group("dil", "stack", "d1", "d2", "wait", gap=16)
b.group("coordG", "stack", "coord", "coord_n1", "coord_n2", "dil", gap=28, reverse_narrow=True)
b.component("protocol", ["coordG", "a", "b", "a_n", "b_n"],
            [["coordG", "a"], ["coordG", "b"], ["a", "a_n"], ["b", "b_n"]])
b.group("phases", "flow", "ph1", "ph2", "ph3", gap=110, align="center")
b.group("tpc", "stack", "phases", "pc", "pc_cost", gap=30)
b.component("threepc", ["tpc"])
b.group("altG", "stack", "alt1", "alt2", "alt3", gap=20, pad=30, pad_top=100)
b.component("alts", ["altG"])
rows = [b.group(f"lgr_{k}", "row", f"lg_{k}", f"lg_{k}_t", gap=14, align="center") for k, _ in LEGEND]
b.group("legendG", "stack", *rows, gap=14, pad=30, pad_top=100)
b.component("legend", ["legendG"])

# ---------- the story ----------
STORY = [
    {"ops": [coord, na, nb, goal]},
    {"focus": ["coord", "a", "b"], "packets": [{"via": "pa", "overlap": 0}, {"via": "pb", "overlap": 0}],
     "ops": [b.link("pa", "coord", "a", k="new", label="PREPARE", offset=-1),
             b.link("pb", "coord", "b", k="new", label="PREPARE", offset=1)]},
    {"focus": ["a", "b"], "ops": [a_s, b_s]},
    {"focus": ["coord", "a", "b"], "packets": [{"via": "ya", "overlap": 0}, {"via": "yb", "overlap": 0}],
     "ops": [b.link("ya", "a", "coord", k="new", dash=True, label="YES", offset=-1),
             b.link("yb", "b", "coord", k="new", dash=True, label="YES", offset=1)]},
    {"erase": ["pa", "pb", "a_s", "b_s"], "mute": ["ya", "yb"],
     "packets": [{"via": "ca", "overlap": 0}, {"via": "cb", "overlap": 0}],
     "ops": [b.link("ca", "coord", "a", k="new", label="COMMIT", offset=-1),
             b.link("cb", "coord", "b", k="new", label="COMMIT", offset=1), a_c, b_c]},
    {"focus": ["coord", "a", "b"], "ops": [no]},
    {"erase": ["ca", "cb", "a_c", "b_c", "no", "goal"], "ops": [b.cross("cx", "coord"), crash, a_w, b_w]},
    {"focus": ["coord"], "ops": [d1, d2, wait]},
    {"packets": [{"via": "p12"}, {"via": "p23", "overlap": 1}],
     "ops": [ph1, ph2, ph3, b.link("p12", "ph1", "ph2"), b.link("p23", "ph2", "ph3"), pc, pc_cost]},
    {"ops": [b.frame("alts_f", "altG", "what systems do instead"), alt1, alt2, alt3]},
    {"cam": "full", "ops": [b.frame("legend_f", "legendG", "legend"), *legend]},
]

wb.build(
    out=ROOT / "public/whiteboards/two-phase-commit.html",
    title="Two-phase commit on a whiteboard",
    heading="Two-phase commit on a whiteboard",
    lede_html="The clean path, the crash that blocks it, and what 3PC tries. "
              "Press <strong>Next</strong> to step through it.",
    steps=STEPS,
    story_js=story_js(b, STORY),
)
