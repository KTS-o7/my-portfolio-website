"""Whiteboard for content/blog/systems/raft-consensus.md.

Usage: python3 -I whiteboards/raft_consensus.py
Writes public/whiteboards/raft-consensus.html, using the whiteboard-html skill in .claude/skills/.
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

b = Board()
NODES = ["s1", "s2", "s3", "s4", "s5"]


def node(id, slot, role, k="old", term=None):
    name = slot.upper()
    return b.box(id, [f"{name} · term {term}" if term else name, role], k=k, size=28, w=190, h=100, slot=slot)


def cell(id, node_id, col, text, k):
    """One entry in a node's log strip: column 1 is the earlier entries, column 2 the new one."""
    return b.box(id, [text], k=k, size=26, w=114, h=64, slot=f"{node_id}_c{col}")


# ---------- what is on the board ----------
followers = {n: node(n, n, "follower") for n in NODES}
s1c = node("s1c", "s1", "candidate", "new", 2)
s1l = node("s1l", "s1", "leader", "new", 2)
s2c = node("s2c", "s2", "candidate", "new", 3)
old = {n: cell(f"e{n[1]}o", n, 1, "earlier", "old") for n in NODES}
new = {n: cell(f"e{n[1]}", n, 2, "x=5", "new") for n in NODES}
e3s = cell("e3s", "s3", 2, "stale", "bad")

# The leader's notes take turns in one slot by the client, outside the fan of arrows from
# S1; each replaces the one before. The voting rule goes under S2, the peer it is about.
timeout = b.note("timeout", ["election timeout", "(150-300 ms, random)"], size=24, slot="ln1")
hb_n = b.note("hb_n", ["heartbeats:", "empty AppendEntries", "keep followers quiet"], size=24, slot="ln1")
e1_n = b.note("e1_n", ["not committed", "yet"], size=24, slot="ln1")
e1_c = b.note("e1_c", ["committed:", "3 of 5 have it"], size=24, slot="ln1")
rv_n = b.note("rv_n", ["RequestVote(term 2)", "to every peer"], size=24, slot="ln1")
maj = b.note("maj", ["3 of 5 votes,", "its own included"], size=24, slot="ln1")
rule = b.note("rule", ["a peer votes yes if it", "hasn’t voted this term", "and the candidate’s log",
                       "is at least as up-to-date"], k="old", size=24, slot="s2_n")
win = b.note("win", ["only a node with every", "committed entry can win"], size=26, slot="s2_n")
s3_down = b.note("s3_down", ["unreachable"], k="bad", size=26, slot="s3_n")
e3_n = b.note("e3_n", ["prev index + term don’t", "match: rejected"], k="bad", size=26, slot="s3_n")
e3_f = b.note("e3_f", ["leader backed up and", "overwrote it"], size=26, slot="s3_n")
client = b.box("client", ["client"], size=28, w=200, h=90)

ca = b.box("ca", ["S2 candidate"], k="bad", size=24, w=220, h=90)
cb = b.box("cb", ["S4 candidate"], k="bad", size=24, w=220, h=90)
cab = b.note("cab", ["neither reaches", "a majority"], k="bad", size=24)
retry = b.note("retry", ["both time out and retry with a new term;", "random timeouts make a repeat unlikely"], k="old", size=22)
runs = b.note("runs", ["runs in production:", "etcd, CockroachDB,", "TiKV, Consul"], k="old", size=30)

LEGEND = [("old", "already there"), ("new", "this step"), ("bad", "failure"), ("mute", "gone")]
legend = []
for k, label in LEGEND:
    legend += [b.box(f"lg_{k}", [], k=k, w=44, h=34), b.note(f"lg_{k}_t", [label], k=k, size=22)]

# ---------- how it is arranged ----------
# Each node sits with its log strip, and S2 and S3 have a note slot after that: beside it on
# wide boards, under it on phones. The leader is in the middle, two followers above and
# two below, so its arrows fan out without crossing anyone.
# On phones the top row's logs and notes go above the node, away from S1, so its arrows
# reach the node without crossing them.
TOP = {"s5", "s2"}
for n in NODES:
    b.group(f"{n}_log", "row", f"{n}_c1", f"{n}_c2", gap=10)
    if n != "s1":  # S1's log has its own place in the middle row
        b.group(f"{n}_g", "flow", n, f"{n}_log", gap=20, align="center", reverse_narrow=n in TOP)
b.group("s2_gn", "flow", "s2_g", "s2_n", gap=20, reverse_narrow=True)
b.group("s3_gn", "flow", "s3_g", "s3_n", gap=20)
# S1's row holds the client and the leader's note slot on its left and its log on its
# right: the arrows from S1 to the four followers leave it steeply, so beside it stays
# clear (on phones too). The note goes above the client on phones, out of the client's
# arrow.
b.group("clientG", "stack", "client", "ln1", gap=24, reverse_narrow=True)
b.group("ring", "rows", ("s5_g", "s2_gn"), ("clientG", "s1", "s1_log"), ("s4_g", "s3_gn"), gap=40, row_gap=110, axis="s1")
b.component("cluster", ["ring"])
b.group("split_row", "flow", "ca", "cb", "cab", gap=30, align="center")
b.group("splitG", "stack", "split_row", "retry", gap=30, pad=30, pad_top=100)
b.component("split", ["splitG"])
b.component("runs", ["runs"])
rows = [b.group(f"lgr_{k}", "row", f"lg_{k}", f"lg_{k}_t", gap=14, align="center") for k, _ in LEGEND]
b.group("legendG", "stack", *rows, gap=14, pad=30, pad_top=100)
b.component("legend", ["legendG"])

PEERS = ["s2", "s5", "s3", "s4"]


def fan(prefix, **o):
    return [b.link(f"{prefix}{p[1]}", "s1", p, **o) for p in PEERS]


def packets(ids):
    return [{"via": i, "overlap": 0} for i in ids]


# ---------- the story ----------
STORY = [
    {"ops": [followers[n] for n in ["s1", "s2", "s5", "s4", "s3"]]},
    {"erase": ["s1"], "ops": [s1c, timeout]},
    {"erase": ["timeout"], "packets": packets(["rv2", "rv5", "rv3", "rv4"]), "ops": [*fan("rv", k="new", offset=-1), rv_n]},
    {"erase": ["rv_n"], "packets": packets(["v2", "v5"]),
     "ops": [b.link("v2", "s2", "s1", k="new", dash=True, offset=-1),
             b.link("v5", "s5", "s1", k="new", dash=True, offset=-1), maj, rule]},
    {"erase": ["s1c", "timeout", "rv2", "rv5", "rv3", "rv4", "rv_n", "v2", "v5", "maj", "rule"],
     "packets": packets(["hb2", "hb5", "hb3", "hb4"]), "ops": [s1l, *fan("hb", k="new", dash=True), hb_n]},
    {"ops": [b.frame("split_f", "splitG", "what if two candidates start at once?", k="bad"), ca, cb, cab, retry]},
    {"erase": ["hb_n"], "packets": [{"via": "cw", "overlap": 1}],
     "ops": [*old.values(), client, b.link("cw", "client", "s1", label="write x=5", offset=-1), new["s1"], e1_n]},
    {"packets": packets(["hb2", "hb5", "hb4"]),
     "ops": [new["s2"], new["s4"], new["s5"], b.cut("hb3_x", "hb3"), s3_down]},
    {"erase": ["e1_n"], "packets": [{"via": "cr", "overlap": 1}],
     "ops": [e1_c, b.link("cr", "s1", "client", k="new", label="ok", offset=-1)]},
    {"erase": ["hb3_x", "s3_down"], "packets": [{"via": "hb3", "overlap": 1}], "ops": [e3s, e3_n]},
    {"erase": ["e3s", "e3_n"], "packets": [{"via": "hb3", "overlap": 1}], "ops": [new["s3"], e3_f]},
    {"focus": ["s5", "s4", "s3"], "mute": ["s1l", "hb2", "hb3", "hb4", "hb5", "e1_c", "cw", "cr"], "erase": ["s2", "e3_f"],
     "ops": [b.cross("s1_x", "s1"), s2c, win]},
    {"cam": "full", "ops": [runs, b.frame("legend_f", "legendG", "legend"), *legend]},
]

wb.build(
    out=ROOT / "public/whiteboards/raft-consensus.html",
    title="Raft on a whiteboard",
    heading="Raft on a whiteboard",
    lede_html="Leader election, log replication and log matching, one step at a time. "
              "Press <strong>Next</strong> to step through it.",
    steps=STEPS,
    story_js=story_js(b, STORY),
)
