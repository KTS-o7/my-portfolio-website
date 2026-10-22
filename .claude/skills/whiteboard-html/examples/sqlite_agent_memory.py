"""Whiteboard 1: SQLite + FTS5 agent memory.

Usage: python3 -I examples/sqlite_agent_memory.py [out.html]
"""
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import wb  # noqa: E402

# One entry per board step: heading, 2-3 plain sentences, and the "Open:" line.
STEPS = [
    ("Before: facts lived in the system prompt",
     "I asked my AI which port a service was running on. It guessed. "
     "The real answer was in a chat thread from the week before, where the agent could not read it.",
     "nothing yet. The facts are spread across old chat threads."),
    ("The cost: explaining the same thing again",
     "Every new session started from zero. I pasted the same paragraph into session after session, "
     "and still heard “didn’t we already figure this out?”",
     "three chat threads with the same paragraph in them."),
    ("First try: a JSON file",
     "A JSON file was the obvious first step. Merging two threads into it hurt, the schema drifted, "
     "and there was no real search.",
     "`memory.json` (retired)"),
    ("Then RAG, then a vector store",
     "A RAG pipeline made it worse: higher latency, worse answers, and a reindex step after every fix "
     "that I kept forgetting. A vector store had the same problem, plus chunking decisions.",
     "nothing worth keeping."),
    ("The fix: one SQLite file",
     "One file holds everything, and it is smaller than a screenshot. Mine has services, configs and "
     "lessons, plus two more tables. The schema is whatever I want it to be.",
     "`memory.db`: `services`, `configs`, `lessons`"),
    ("Full-text search on top",
     "Every row has a primary key, and every text column is mirrored into an FTS5 virtual table. "
     "Search just works, with no embeddings and no server.",
     "the FTS5 virtual table in `memory.db`"),
    ("Rule 1: query first",
     "Before the agent answers anything about my infra, it runs a SELECT. "
     "The port question now gets the real answer from the services table instead of a guess.",
     "`services`"),
    ("Rule 2: write back immediately",
     "After a fix, the agent INSERTs a lesson row before it forgets: the date, the file that broke, "
     "and the fix. When the same bug comes back, it reads the row, applies the fix, and moves on.",
     "`lessons`"),
    ("The system prompt becomes a pointer",
     "The system prompt no longer holds facts. It just points to the file. "
     "The system prompt is a cache and the database is a notebook. Caches expire, notebooks don’t.",
     "the system prompt (now one line)"),
    ("The side effect: questions I never typed",
     "The agent started asking the database things I never wrote, like the fix the last time the "
     "scheduler broke, or which lessons are still unresolved. Easy questions get asked more often.",
     "`lessons`, through the FTS5 index"),
    ("It is my file",
     "The database is mine, not the model’s or the framework’s. It goes in git, I copy it to a "
     "backup path on Sundays, and I can read it in vim, grep it, or open it in a GUI. "
     "50+ lessons so far, each one a bug I don’t debug twice.",
     "`memory.db`"),
    ("Recap",
     "Pick one thing you keep re-explaining and make it a table. Make the agent SELECT before it "
     "answers, and write a row after every fix. Don’t over-engineer.",
     "the color legend on the board."),
]

STORY_JS = r"""  // World units on a 2600 x 1462 board. Regions: left = me, the agent and the old
  // system prompt; bottom left = rejected tries; centre = memory.db; right = what it unlocked.
  const FULL = [0, 0, 2600, 1462];
  const S = [];

  // 0. Before: the system prompt holds the facts, the agent guesses
  S.push({ cam: [0, 100, 1200, 675], ops: [
    box("you", 60, 620, 220, 100, ["Me"]),
    box("agent", 440, 620, 260, 110, ["AI agent"]),
    box("sp", 400, 170, 340, 300, ["system prompt", "facts pasted in", "by hand, going stale"], { size: 24 }),
    arrow("ask", [[282, 650], [436, 650]], { label: "which port is it on?", at: [360, 582], size: 21 }),
    arrow("read", [[570, 616], [570, 474]], { label: "reads", at: [590, 520], anchor: "start" }),
    arrow("guess", [[436, 700], [282, 700]], { k: "bad", label: "port 8080? (a guess)", at: [360, 736], size: 21 }),
  ], packets: [{ via: "ask" }, { via: "read" }, { via: "guess", overlap: 1 }] });

  // 1. The cost: the same paragraph in every session
  S.push({ cam: [0, 380, 1150, 647], ops: [
    box("s1", 60, 860, 230, 96, ["session 1", "same paragraph"], { size: 21 }),
    box("s2", 330, 860, 230, 96, ["session 2", "same paragraph"], { size: 21 }),
    box("s3", 600, 860, 230, 96, ["session 3", "same paragraph"], { size: 21 }),
    arrow("p1", [[150, 724], [170, 856]], { dash: true }),
    arrow("p2", [[200, 724], [440, 856]], { dash: true }),
    arrow("p3", [[250, 724], [710, 856]], { dash: true }),
    note("again", 862, 868, ["“Didn’t we already", "figure this out?”"], { k: "bad", size: 24 }),
  ], packets: [{ via: "p1", overlap: 0 }, { via: "p2", overlap: 0 }, { via: "p3", overlap: 0 }] });

  // 2. First try: JSON file
  S.push({ cam: [0, 731, 1300, 731], ops: [
    note("tried", 60, 996, ["What I tried first"], { k: "old", size: 30 }),
    box("json", 60, 1070, 320, 110, ["JSON file"]),
    strike("json_x", 52, 1128, 390, 1120),
    note("json_why", 60, 1200, ["merge pain, schema drift,", "no real search"], { k: "bad", size: 21 }),
  ] });

  // 3. Then RAG, then a vector store
  S.push({ cam: [0, 731, 1300, 731], ops: [
    box("rag", 440, 1070, 320, 110, ["RAG pipeline"]),
    strike("rag_x", 432, 1128, 770, 1120),
    note("rag_why", 440, 1200, ["slower, worse answers,", "a reindex step I forgot"], { k: "bad", size: 21 }),
    box("vec", 820, 1070, 320, 110, ["vector store"]),
    strike("vec_x", 812, 1128, 1150, 1120),
    note("vec_why", 820, 1200, ["same problem, plus", "chunking decisions"], { k: "bad", size: 21 }),
  ] });

  // 4. The fix: one SQLite file
  S.push({ cam: [820, 60, 1700, 956], ops: [
    frame("db", 1160, 170, 820, 800, "memory.db  (one SQLite file)", { k: "new" }),
    box("t_srv", 1200, 240, 240, 90, ["services"], { k: "new" }),
    box("t_cfg", 1460, 240, 240, 90, ["configs"], { k: "new" }),
    box("t_les", 1720, 240, 220, 90, ["lessons"], { k: "new" }),
    box("t_more", 1200, 360, 740, 74, ["+ 2 more tables: the schema is whatever I want"], { k: "new", size: 22 }),
    note("small", 1200, 880, ["Smaller than a screenshot."], { k: "new", size: 24 }),
  ] });

  // 5. FTS5 on top
  S.push({ cam: [820, 60, 1700, 956], ops: [
    box("fts", 1200, 560, 740, 130, ["FTS5 virtual table", "every text column mirrored here"], { k: "new", size: 24 }),
    arrow("m1", [[1320, 438], [1320, 556]], { k: "new", dash: true }),
    arrow("m2", [[1580, 438], [1580, 556]], { k: "new", dash: true }),
    arrow("m3", [[1830, 438], [1830, 556]], { k: "new", dash: true }),
    note("noserver", 1200, 716, ["No embeddings. No server. Search just works."], { k: "new", size: 22 }),
  ], packets: [{ via: "m1", overlap: 0 }, { via: "m2", overlap: 0 }, { via: "m3", overlap: 0 }] });

  // 6. Rule 1: SELECT first
  S.push({ cam: [0, 20, 2000, 1125], erase: ["guess"], ops: [
    arrow("sel", [[702, 640], [1156, 470]], { k: "new", label: "1. SELECT first", at: [905, 500], size: 26 }),
    arrow("row", [[1156, 610], [702, 690]], { k: "new", label: "a row from services", at: [930, 690], size: 22 }),
    arrow("right", [[436, 700], [282, 700]], { k: "new", label: "the real port", at: [360, 736], size: 21 }),
  ], packets: [{ via: "ask" }, { via: "sel" }, { via: "row" }, { via: "right", overlap: 1 }] });

  // 7. Rule 2: INSERT a lesson after a fix
  S.push({ cam: [0, 0, 2000, 1125], ops: [
    arrow("ins", [[702, 668], [755, 668], [755, 70], [1830, 70], [1830, 236]],
      { k: "new", label: "2. after a fix: INSERT a lesson row", at: [1290, 12], size: 26 }),
    note("lesson_row", 1200, 790, ["a lesson row: the date,", "the file that broke, the fix"], { k: "new", size: 22 }),
  ], packets: [{ via: "ins", overlap: 1 }] });

  // 8. The system prompt becomes a pointer
  S.push({ cam: [100, 40, 1300, 731], mute: ["sp", "read"], ops: [
    strike("sp_x", 404, 176, 736, 464),
    box("ptr", 770, 250, 340, 100, ["system prompt:", "“read memory.db first”"], { k: "new", size: 22 }),
    arrow("ptr_a", [[1112, 300], [1156, 300]], { k: "new" }),
    note("cache", 770, 390, ["The system prompt is a cache.", "The database is a notebook."], { k: "new", size: 24 }),
  ], packets: [{ via: "ptr_a", overlap: 1 }] });

  // 9. The side effect: questions I never typed
  S.push({ cam: [1150, 40, 1450, 816], ops: [
    note("q_head", 2030, 180, ["Questions I never typed"], { k: "old", size: 28 }),
    note("q1", 2030, 250, ["“What was the fix last time", "the scheduler broke?”"], { k: "new", size: 22 }),
    note("q2", 2030, 380, ["“Which lessons are", "still unresolved?”"], { k: "new", size: 22 }),
    arrow("qa1", [[2024, 290], [1944, 288]], { k: "new" }),
    arrow("qa2", [[2024, 418], [1944, 610]], { k: "new" }),
    note("easy", 2030, 500, ["Easy questions get", "asked more often."], { k: "old", size: 24 }),
  ], packets: [{ via: "qa1", overlap: 0.4 }, { via: "qa2", overlap: 1 }] });

  // 10. Ownership
  S.push({ cam: [1150, 520, 1450, 816], ops: [
    box("git", 2120, 700, 300, 90, ["git repo"]),
    box("bak", 2120, 850, 300, 90, ["Sunday backup copy"], { size: 22 }),
    box("tools", 2120, 1010, 300, 100, ["vim · grep · a GUI"], { size: 22 }),
    arrow("o1", [[1984, 745], [2116, 745]]),
    arrow("o2", [[1984, 895], [2116, 895]]),
    arrow("o3", [[1900, 974], [1900, 1060], [2116, 1060]]),
    note("fifty", 1200, 1030, ["50+ lessons now. Each one is", "a bug I don’t debug twice."], { k: "new", size: 24 }),
  ], packets: [{ via: "o1", overlap: 0 }, { via: "o2", overlap: 0 }, { via: "o3", overlap: 1 }] });

  // 11. Recap with legend
  S.push({ cam: FULL, ops: [
    hl("hl_db", 1140, 150, 860, 840),
    frame("legend", 1560, 1200, 960, 210, "legend"),
    box("lg_old", 1600, 1240, 44, 34, [], { k: "old" }),
    note("lg_old_t", 1660, 1236, ["already there"], { k: "old", size: 22 }),
    box("lg_new", 1600, 1310, 44, 34, [], { k: "new" }),
    note("lg_new_t", 1660, 1306, ["new: the SQLite memory"], { k: "new", size: 22 }),
    box("lg_bad", 2030, 1240, 44, 34, [], { k: "bad" }),
    note("lg_bad_t", 2090, 1236, ["wrong or rejected"], { k: "bad", size: 22 }),
    box("lg_mute", 2030, 1310, 44, 34, [], { k: "mute" }),
    note("lg_mute_t", 2090, 1306, ["replaced"], { k: "mute", size: 22 }),
    note("start", 60, 1320, ["Start small: one thing you keep re-explaining,", "one table, SELECT before answering."], { k: "old", size: 26 }),
  ] });

"""

wb.build(
    out=Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd() / "sqlite-memory-whiteboard.html",
    title="Agent memory on a whiteboard: one SQLite file",
    heading="Agent memory on a whiteboard",
    lede_html='How I stopped keeping state in the system prompt: one SQLite file, five tables, an FTS5 index on top. Press <strong>Next</strong> to step through it.',
    steps=STEPS,
    story_js=STORY_JS,
)
