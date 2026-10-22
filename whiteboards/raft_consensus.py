"""Whiteboard for content/blog/systems/raft_consensus.md.

Usage: python3 -I whiteboards/raft_consensus.py
Writes public/whiteboards/raft-consensus.html. Needs the whiteboard-html skill engine.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.home() / ".claude/skills/whiteboard-html/scripts"))
import wb  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

STEPS = [
    ("Every node starts as a follower",
     "This cluster has five nodes, and each one starts as a follower. A follower is passive: "
     "it only answers messages from leaders and candidates.",
     "Terms and Roles"),
    ("An election timeout fires",
     "S1 hears no heartbeat before its election timeout runs out. It becomes a candidate, "
     "moves to term 2 and votes for itself.",
     "Leader Election"),
    ("RequestVote to every peer",
     "The candidate asks every other node for its vote in term 2.",
     "Leader Election"),
    ("A majority of votes wins",
     "A peer votes yes if it hasn't voted this term and the candidate's log is at least as "
     "up-to-date as its own. S1 collects 3 of 5 votes, its own included. That is a majority.",
     "Leader Election"),
    ("The leader sends heartbeats",
     "S1 becomes leader and starts sending heartbeats right away: AppendEntries messages with "
     "no entries. As long as they keep arriving, no follower starts an election.",
     "Leader Election"),
    ("When two candidates tie",
     "If two nodes start elections at the same moment, the votes can split so neither reaches "
     "a majority. Both time out and retry with a new term. Randomized timeouts, typically "
     "150-300 ms, make another tie unlikely.",
     "Leader Election"),
    ("A client write reaches the leader",
     "A client sends x=5 to the leader. The leader appends it to its own log, but the entry "
     "isn't committed yet.",
     "Log Replication"),
    ("AppendEntries goes out in parallel",
     "The leader sends the entry to every follower at once. S2, S4 and S5 write it to their "
     "logs. S3 is unreachable, and that's fine: the leader doesn't need everyone.",
     "Log Replication"),
    ("Committed once a majority has it",
     "The entry is on three of five logs, so the leader marks it committed, applies it to its "
     "state machine and replies to the client. Followers learn the commit index on the next "
     "heartbeat and apply it too.",
     "Log Replication"),
    ("A follower with a diverged log",
     "Suppose S3 comes back holding a stale entry from an earlier term. Every AppendEntries "
     "carries the index and term of the entry just before the new one. S3's doesn't match, "
     "so S3 rejects the append.",
     "Safety: Log Matching"),
    ("The leader repairs the follower",
     "The leader backs up and resends from an earlier point until it finds a common prefix, "
     "then overwrites the diverged entries. If two logs share an entry's index and term, "
     "everything before it is now identical too.",
     "Safety: Log Matching"),
    ("If the leader crashes",
     "Heartbeats stop, an election timeout fires on a follower, and a new election starts in "
     "term 3. Nodes refuse to vote for a candidate with a less complete log, so the winner "
     "already has every committed entry. There is no repair phase.",
     "Leader Failure"),
    ("Recap",
     "Raft splits consensus into leader election, log replication and safety. Everything goes "
     "through one leader, a majority decides, and terms expose stale leaders.",
     "Where It Runs"),
]
# The "Open:" line names the section of the post that covers each step.
STEPS = [(h, b, f"the “{o}” section") for h, b, o in STEPS]

STORY_JS = r"""
  // Cameras are automatic (framed from what each step draws); only the recap sets one.
  // Each node's log sits in a strip beside it (two cells: earlier entries, then the new
  // one), so a step's new elements stay close together and the frame stays tight.
  // Regions: ring x 60-1350, y 150-940, notes right of S1 (x 1000-1400); split-vote inset bottom right
  // (x 1200-2080, y 1000-1330); legend bottom left; "runs in" note top right.
  const FULL = [0, 0, 2600, 1462];
  const S = [];
  const node = (id, x, y, role, k, term) => {
    const name = id.slice(0, 2).toUpperCase();
    return box(id, x, y, 200, 100, [term ? `${name} · term ${term}` : name, role], { k: k || "old", size: 28 });
  };
  // Log strip origin per node: [x of the "earlier" cell, y]. The new entry goes 130 to the right.
  const STRIP = { s1: [716, 168], s2: [1096, 398], s5: [120, 496], s4: [476, 778], s3: [956, 778] };
  const cell = (id, nodeId, col, text, k) => {
    const [x, y] = STRIP[nodeId];
    return box(id, x + (col - 1) * 130, y, 120, 64, [text], { k, size: 26 });
  };

  // 0. Five followers
  S.push({ ops: [
    node("s1", 500, 150, "follower"),
    node("s2", 880, 380, "follower"),
    node("s5", 120, 380, "follower"),
    node("s4", 260, 760, "follower"),
    node("s3", 740, 760, "follower"),
  ] });

  // 1. S1's election timeout fires
  S.push({ erase: ["s1"], ops: [
    node("s1c", 500, 150, "candidate", "new", 2),
    note("timeout", 120, 165, ["election timeout", "(150-300 ms, random)"], { k: "new", size: 26 }),
  ] });

  // 2. RequestVote to every peer
  S.push({ ops: [
    arrow("rv2", [[702, 252], [876, 400]], { k: "new" }),
    arrow("rv5", [[498, 230], [324, 390]], { k: "new" }),
    arrow("rv3", [[650, 252], [810, 756]], { k: "new" }),
    arrow("rv4", [[550, 252], [390, 756]], { k: "new" }),
    note("rv_n", 1000, 150, ["RequestVote(term 2)", "to every peer"], { k: "new", size: 26 }),
  ], packets: [{ via: "rv2", overlap: 0 }, { via: "rv5", overlap: 0 }, { via: "rv3", overlap: 0 }, { via: "rv4", overlap: 0 }] });

  // 3. Votes come back: a majority
  S.push({ ops: [
    arrow("v2", [[878, 440], [704, 286]], { k: "new", dash: true }),
    arrow("v5", [[322, 425], [495, 262]], { k: "new", dash: true }),
    note("maj", 1000, 240, ["3 of 5 votes,", "its own included"], { k: "new", size: 26 }),
    note("rule", 1110, 372, ["a peer votes yes if it", "hasn’t voted this term", "and the candidate’s log", "is at least as up-to-date"], { k: "old", size: 24 }),
  ], packets: [{ via: "v2", overlap: 0 }, { via: "v5", overlap: 0 }] });

  // 4. Leader, heartbeats
  S.push({ erase: ["s1c", "timeout", "rv2", "rv5", "rv3", "rv4", "rv_n", "v2", "v5", "maj", "rule"], ops: [
    node("s1l", 500, 150, "leader", "new", 2),
    arrow("hb2", [[702, 252], [876, 400]], { k: "new", dash: true }),
    arrow("hb5", [[498, 230], [324, 390]], { k: "new", dash: true }),
    arrow("hb3", [[650, 252], [810, 756]], { k: "new", dash: true }),
    arrow("hb4", [[550, 252], [390, 756]], { k: "new", dash: true }),
    note("hb_n", 1000, 150, ["heartbeats:", "empty AppendEntries", "keep followers quiet"], { k: "new", size: 26 }),
  ], packets: [{ via: "hb2", overlap: 0 }, { via: "hb5", overlap: 0 }, { via: "hb3", overlap: 0 }, { via: "hb4", overlap: 0 }] });

  // 5. Split vote, as an inset
  S.push({ ops: [
    frame("split", 1200, 1000, 880, 330, "what if two candidates start at once?", { k: "bad" }),
    box("ca", 1250, 1050, 220, 90, ["S2 candidate"], { k: "bad", size: 24 }),
    box("cb", 1500, 1050, 220, 90, ["S4 candidate"], { k: "bad", size: 24 }),
    note("cab", 1760, 1056, ["neither reaches", "a majority"], { k: "bad", size: 24 }),
    note("retry", 1250, 1180, ["both time out and retry with a new term;", "random timeouts make a repeat unlikely"], { k: "old", size: 22 }),
  ] });

  // 6. Client write; every node's log appears; the leader appends locally
  S.push({ erase: ["hb_n"], ops: [
    cell("e1o", "s1", 1, "earlier", "old"), cell("e2o", "s2", 1, "earlier", "old"),
    cell("e5o", "s5", 1, "earlier", "old"), cell("e4o", "s4", 1, "earlier", "old"),
    cell("e3o", "s3", 1, "earlier", "old"),
    box("client", 120, 150, 200, 90, ["client"], { size: 28 }),
    arrow("cw", [[322, 190], [496, 190]], { label: "write x=5", at: [409, 140], size: 24 }),
    cell("e1", "s1", 2, "x=5", "new"),
    note("e1_n", 980, 165, ["not committed", "yet"], { k: "new", size: 24 }),
  ], packets: [{ via: "cw", overlap: 1 }] });

  // 7. AppendEntries in parallel; S3 unreachable
  S.push({ ops: [
    cell("e2", "s2", 2, "x=5", "new"),
    cell("e4", "s4", 2, "x=5", "new"),
    cell("e5", "s5", 2, "x=5", "new"),
    strike("hb3_x", 680, 476, 750, 428),
    note("s3_down", 1090, 792, ["unreachable"], { k: "bad", size: 26 }),
  ], packets: [{ via: "hb2", overlap: 0 }, { via: "hb5", overlap: 0 }, { via: "hb4", overlap: 0 }] });

  // 8. Majority -> committed, reply to the client
  S.push({ erase: ["e1_n"], ops: [
    note("e1_c", 980, 165, ["committed:", "3 of 5 have it"], { k: "new", size: 24 }),
    arrow("cr", [[496, 226], [322, 226]], { k: "new", label: "ok", at: [409, 238], size: 24 }),
  ], packets: [{ via: "cr", overlap: 1 }] });

  // 9. S3 returns with a stale entry; the consistency check rejects the append
  S.push({ erase: ["hb3_x", "s3_down"], ops: [
    cell("e3s", "s3", 2, "stale", "bad"),
    note("e3_n", 740, 878, ["prev index + term don’t", "match: rejected"], { k: "bad", size: 26 }),
  ], packets: [{ via: "hb3", overlap: 1 }] });

  // 10. The leader backs up and overwrites
  S.push({ erase: ["e3s", "e3_n"], ops: [
    cell("e3", "s3", 2, "x=5", "new"),
    note("e3_f", 740, 878, ["leader backed up and", "overwrote it"], { k: "new", size: 26 }),
  ], packets: [{ via: "hb3", overlap: 1 }] });

  // 11. The leader crashes; a new election in term 3
  S.push({ focus: ["s5", "s4", "s3"], mute: ["s1l", "hb2", "hb3", "hb4", "hb5", "e1_c", "cw", "cr"], erase: ["s2", "e3_f"], ops: [
    strike("s1_x1", 506, 158, 694, 242),
    strike("s1_x2", 694, 158, 506, 242),
    node("s2c", 880, 380, "candidate", "new", 3),
    note("win", 880, 510, ["only a node with every", "committed entry can win"], { k: "new", size: 26 }),
  ] });

  // 12. Recap
  S.push({ cam: FULL, ops: [
    note("runs", 1500, 180, ["runs in production:", "etcd, CockroachDB,", "TiKV, Consul"], { k: "old", size: 30 }),
    frame("legend", 120, 1180, 1000, 150, "legend"),
    box("lg_old", 160, 1235, 44, 34, [], { k: "old" }),
    note("lg_old_t", 216, 1231, ["already there"], { k: "old", size: 22 }),
    box("lg_new", 410, 1235, 44, 34, [], { k: "new" }),
    note("lg_new_t", 466, 1231, ["this step"], { k: "new", size: 22 }),
    box("lg_bad", 640, 1235, 44, 34, [], { k: "bad" }),
    note("lg_bad_t", 696, 1231, ["failure"], { k: "bad", size: 22 }),
    box("lg_mute", 860, 1235, 44, 34, [], { k: "mute" }),
    note("lg_mute_t", 916, 1231, ["gone"], { k: "mute", size: 22 }),
  ] });

"""

wb.build(
    out=ROOT / "public/whiteboards/raft-consensus.html",
    title="Raft on a whiteboard",
    heading="Raft on a whiteboard",
    lede_html="Leader election, log replication and log matching, one step at a time. "
              "Press <strong>Next</strong> to step through it.",
    steps=STEPS,
    story_js=STORY_JS,
)
