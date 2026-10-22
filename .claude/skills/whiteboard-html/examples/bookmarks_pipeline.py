"""Whiteboard 2: how 394 X bookmarks went through three passes.

Usage: python3 -I examples/bookmarks_pipeline.py [out.html]
Facts come from the 2026-10-18 bookmarks session.
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import wb  # noqa: E402

STEPS = [
    ("The job: read 394 bookmarks without touching anything",
     "An agent opened the Bookmarks tab at x.com/i/history in my personal Brave profile. "
     "It was read-only: no likes, no unbookmarking, no clicking links.",
     "x.com/i/history (Bookmarks tab)"),
    ("Pass 1: scroll to the bottom",
     "The agent scrolled until nothing new loaded: 185,599 px down, 394 bookmarks, the oldest from "
     "12 Nov 2023. For each one it kept the author, date, link, the first 280 characters, and the first link.",
     "the bookmarks list, read in the page"),
    ("Pass 1 came out thin",
     "The browser tool cut each output at about 2 KB, so summaries shrank to about 50 characters "
     "and every outside link was dropped. 60 bookmarks (15%) landed in Unclear.",
     "`x-bookmarks-2026-10-18.md` (v1)"),
    ("Pass 2: scroll again, read the page text",
     "This time the data came out through the page-text reader, which has no 2 KB limit. "
     "It kept the full text up to 1,000 characters, quoted tweets, image descriptions, and links: "
     "about 150 KB of raw text against 30 KB before.",
     "6 raw files in `/tmp/x-bookmarks/`"),
    ("Deep read: only the ones that need it",
     "Bookmarks with more behind them got opened one by one: 135 cut off at “Show more”, "
     "81 quoted tweets, 53 outside links, 41 videos, 30 link previews. Outside pages were read "
     "with a separate web reader, never the logged-in browser.",
     "each tweet page, then its outside link"),
    ("A link it chose not to open",
     "One bookmark held claude.ai offer-claim links. Opening them could have acted on my account, "
     "so the agent skipped them and noted why.",
     "nothing: skipped on purpose"),
    ("Rewrite: every bookmark exactly once",
     "The v1 file was backed up first. The new file has 394 entries with 394 different tweet links. "
     "Unclear dropped from 60 to 14, and 84 entries now carry their outside link.",
     "`x-bookmarks-2026-10-18.md` (v2), `/tmp/x-bookmarks/v1-backup.md`"),
    ("Checking the agent's own claims",
     "The agent said it read about 150 tweet pages and 75 links, but it made only 138 tool calls "
     "in total, so those numbers were too high. About 8 sites refused or failed.",
     "the agent's report against its tool-call count"),
    ("Pass 3: the “empty” ones were articles",
     "Ten bookmarks looked empty. Opening them showed that 9 were X Articles, which the list shows "
     "with no text, and 1 was a reply video. Unclear went from 14 to 4.",
     "the 10 tweet pages, with screenshots"),
    ("A classifier that didn’t make the cut",
     "I piloted the THX-01 classifier on 34 bookmarks. It was fast and free, but agreed with the "
     "existing labels only 55% of the time (76% after rewording), and flagged 30 of 34 as "
     "“actionable”. I stopped after the pilot.",
     "the 34-bookmark pilot results"),
    ("What was worth keeping",
     "Out of 394, about 30–40 were worth keeping: courses, a few career posts, agent "
     "engineering notes and sources. The rest were memes, hype, stale job posts and vague one-liners.",
     "`x-bookmarks-useful-2026-10-18.md`"),
    ("Recap",
     "Three passes, each fixing what the last one missed: scroll, scroll with full text and a deep "
     "read, then open the leftovers. Check the agent’s numbers, and keep the logged-in browser "
     "away from outside links.",
     "the color legend on the board."),
]

STORY_JS = r"""
  // World units on a 2600 x 1462 board. Top row = pass 1, middle row = pass 2 and
  // the deep read, right column = the rewritten file and pass 3, bottom = what was kept.
  const FULL = [0, 0, 2600, 1462];
  const S = [];

  // 0. The source and the read-only agent
  S.push({ cam: [0, 90, 1000, 563], ops: [
    box("src", 60, 180, 280, 120, ["X bookmarks", "`x.com/i/history`"], { size: 24 }),
    box("agent", 440, 180, 300, 120, ["agent in", "personal Brave"], { size: 24 }),
    arrow("a_src", [[342, 240], [436, 240]]),
    note("rules", 60, 330, ["read-only: never like,", "unbookmark or open links"], { k: "bad", size: 21 }),
  ], packets: [{ via: "a_src", overlap: 1 }] });

  // 1. Pass 1 scroll
  S.push({ cam: [300, 60, 1250, 703], ops: [
    box("p1", 840, 180, 300, 120, ["pass 1: scroll", "394 found"], { k: "new" }),
    arrow("a_p1", [[742, 240], [836, 240]], { k: "new" }),
    note("p1_how", 840, 330, ["scrolled to the bottom:", "185,599 px, oldest 12 Nov 2023"], { k: "old", size: 20 }),
    box("o1", 1240, 180, 300, 120, ["bookmarks.md v1"], { k: "new", size: 24 }),
    arrow("a_o1", [[1142, 240], [1236, 240]], { k: "new" }),
  ], packets: [{ via: "a_p1" }, { via: "a_o1", overlap: 1 }] });

  // 2. Pass 1 was thin
  S.push({ cam: [300, 60, 1450, 816], ops: [
    note("o1_bad", 1240, 330, ["output cut at ~2 KB:", "~50-character summaries,", "no links, 60 Unclear"], { k: "bad", size: 21 }),
    hl("o1_hl", 1225, 165, 330, 150),
  ] });

  // 3. Pass 2 scroll via the page-text reader
  S.push({ cam: [300, 120, 1450, 816], erase: ["o1_hl"], ops: [
    box("p2", 840, 560, 300, 120, ["pass 2: scroll again", "page-text reader"], { k: "new", size: 23 }),
    arrow("a_p2", [[590, 304], [590, 620], [836, 620]], { k: "new" }),
    box("raw", 1240, 560, 300, 120, ["6 raw files", "~150 KB (was ~30 KB)"], { k: "new", size: 23 }),
    arrow("a_raw", [[1142, 620], [1236, 620]], { k: "new" }),
    note("p2_keeps", 840, 710, ["full text up to 1,000 chars,", "quoted tweets, images, links"], { k: "new", size: 20 }),
  ], packets: [{ via: "a_p2" }, { via: "a_raw", overlap: 1 }] });

  // 4. Deep read branch
  S.push({ cam: [1100, 470, 1200, 675], ops: [
    box("deep", 1640, 560, 340, 120, ["deep read", "only what needs it"], { k: "new" }),
    arrow("a_deep", [[1542, 620], [1636, 620]], { k: "new" }),
    note("deep_n", 1640, 710, ["135 cut off at “Show more”", "81 quoted tweets", "53 outside links", "41 videos · 30 link previews"], { k: "new", size: 21 }),
    note("deep_web", 1640, 860, ["outside pages: a separate web", "reader, never the logged-in browser"], { k: "old", size: 20 }),
  ], packets: [{ via: "a_raw" }, { via: "a_deep", overlap: 1 }] });

  // 5. The link it did not open
  S.push({ cam: [1100, 470, 1200, 675], ops: [
    box("offer", 1240, 960, 300, 100, ["claude.ai offer links"], { k: "bad", size: 22 }),
    arrow("a_offer", [[1650, 684], [1470, 956]], { k: "bad", dash: true, head: false }),
    strike("offer_x", 1232, 1012, 1550, 1006),
    note("offer_why", 1240, 1080, ["could act on my account,", "so it was skipped"], { k: "bad", size: 20 }),
  ] });

  // 6. Rewrite to v2
  S.push({ cam: [1150, 40, 1450, 816], mute: ["o1", "o1_bad"], ops: [
    box("o2", 2100, 180, 380, 140, ["bookmarks.md v2", "394 entries, 394 links"], { k: "new", size: 24 }),
    arrow("a_o2", [[1982, 600], [2290, 600], [2290, 324]], { k: "new" }),
    arrow("a_bak", [[1542, 210], [2096, 210]], { k: "mute", dash: true, label: "v1 backed up first", at: [1820, 166], size: 21 }),
    note("o2_n", 2100, 350, ["Unclear 60 → 14", "84 with an outside link", "126 posts · 82 images", "62 threads · 58 links"], { k: "new", size: 21 }),
  ], packets: [{ via: "a_deep" }, { via: "a_o2", overlap: 1 }] });

  // 7. Checking the agent's numbers
  S.push({ cam: [1500, 450, 1100, 619], ops: [
    note("claim", 2040, 700, ["claimed ~150 pages read,", "but made only 138 tool calls"], { k: "bad", size: 21 }),
    strike("claim_x", 2036, 716, 2300, 712),
    note("fails", 2040, 800, ["~8 sites refused or failed"], { k: "mute", size: 21 }),
  ] });

  // 8. Pass 3: the empty ones
  S.push({ cam: [1350, 560, 1250, 703], ops: [
    box("p3", 2100, 1000, 380, 120, ["pass 3: open the", "10 “empty” ones"], { k: "new", size: 23 }),
    arrow("a_p3", [[2484, 250], [2560, 250], [2560, 1060], [2484, 1060]], { k: "new", label: "back to the leftovers", at: [2548, 560], anchor: "end", size: 20 }),
    note("p3_n", 2100, 1140, ["9 were X Articles: the list", "shows them with no text", "Unclear 14 → 4"], { k: "new", size: 21 }),
  ], packets: [{ via: "a_p3", overlap: 1 }] });

  // 9. The classifier that was rejected
  S.push({ cam: [400, 450, 1300, 731], ops: [
    box("cls", 840, 1000, 340, 120, ["THX-01 classifier", "pilot: 34 bookmarks"], { k: "bad", size: 23 }),
    arrow("a_cls", [[1390, 684], [1010, 996]], { k: "bad", dash: true }),
    strike("cls_x", 832, 1062, 1190, 1054),
    note("cls_n", 840, 1140, ["fast and free, but 55% agreement", "(76% after rewording),", "“actionable”: 30 of 34"], { k: "bad", size: 20 }),
  ], packets: [{ via: "a_cls", overlap: 1 }] });

  // 10. What was worth keeping
  S.push({ cam: [0, 760, 1250, 703], ops: [
    note("keep_big", 60, 960, ["394 → 30–40"], { k: "new", size: 64 }),
    note("keep_list", 60, 1060, ["kept: Learn Inference, Stas Bekman’s", "ML Engineering book, Hamel Husain’s", "evals guide, agent-loop notes"], { k: "new", size: 22 }),
    note("keep_rest", 60, 1170, ["the rest: memes, hype, stale job", "posts, vague one-liners"], { k: "mute", size: 22 }),
  ] });

  // 11. Recap with legend
  S.push({ cam: FULL, ops: [
    frame("legend", 60, 1310, 1100, 120, "legend"),
    box("lg_old", 100, 1350, 44, 34, [], { k: "old" }),
    note("lg_old_t", 156, 1346, ["already there"], { k: "old", size: 22 }),
    box("lg_new", 380, 1350, 44, 34, [], { k: "new" }),
    note("lg_new_t", 436, 1346, ["each pass"], { k: "new", size: 22 }),
    box("lg_bad", 620, 1350, 44, 34, [], { k: "bad" }),
    note("lg_bad_t", 676, 1346, ["wrong or rejected"], { k: "bad", size: 22 }),
    box("lg_mute", 900, 1350, 44, 34, [], { k: "mute" }),
    note("lg_mute_t", 956, 1346, ["replaced"], { k: "mute", size: 22 }),
  ] });

"""

wb.build(
    out=Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd() / "bookmarks-whiteboard.html",
    title="394 bookmarks on a whiteboard: three passes",
    heading="394 bookmarks on a whiteboard",
    lede_html="How an agent read three years of X bookmarks without touching anything, and why it took "
              "three passes. Press <strong>Next</strong> to step through it.",
    steps=STEPS,
    story_js=STORY_JS,
)
