// ─── BRAND TOKENS ───
export const C = {
  navy: "#1A2B4A",
  navyDeep: "#0F1D33",
  navyMid: "#223A5E",
  orange: "#E85D26",
  orangeLight: "#F4845F",
  orangeGlow: "rgba(232,93,38,0.10)",
  cream: "#FAF8F5",
  white: "#FFFFFF",
  gray100: "#F0EDEA",
  gray200: "#E0DBD5",
  gray400: "#9B9590",
  gray600: "#6B6560",
  gray800: "#3A3530",
  teal: "#2B7A78",
  tealGlow: "rgba(43,122,120,0.08)",
  purple: "#7B4DAA",
  purpleGlow: "rgba(123,77,170,0.08)",
};

// ─── 9 SKILLS → 3 CATEGORIES ───
export const SKILLS = [
  { id: "climate",    name: "Create the Climate",           cat: "connect",   num: 1 },
  { id: "connection", name: "Make a Personal Connection",   cat: "connect",   num: 2 },
  { id: "aim",        name: "Aim with Purpose",             cat: "connect",   num: 3 },
  { id: "feedback",   name: "Engage with Feedback",         cat: "connect",   num: 4 },
  { id: "reinforce",  name: "Reinforce Positive Behavior",  cat: "influence", num: 5 },
  { id: "praise",     name: "Praise with Precision",        cat: "influence", num: 6 },
  { id: "correction", name: "Give Positive Correction",     cat: "influence", num: 7 },
  { id: "name",       name: "The Name Effect",              cat: "inspire",   num: 8 },
  { id: "victory",    name: "The Victory Frame",            cat: "inspire",   num: 9 },
];

export const CATEGORIES = [
  { id: "connect",   label: "Connect",   skills: [0,1,2,3], color: C.teal,   glow: C.tealGlow,   desc: "Building trust, setting tone, creating clarity" },
  { id: "influence", label: "Influence",  skills: [4,5,6],   color: C.orange, glow: C.orangeGlow, desc: "Reinforcing, praising, and redirecting behavior" },
  { id: "inspire",   label: "Inspire",    skills: [7,8],     color: C.purple, glow: C.purpleGlow, desc: "Using names with intention and framing victories" },
];

export const ROLES = [
  { id: "parent",       label: "Parent",              icon: "♥", desc: "Leading your family with intention" },
  { id: "teacher",      label: "Teacher / Educator",  icon: "✦", desc: "Reaching every student, every day" },
  { id: "leader",       label: "Business Leader",     icon: "◆", desc: "Building teams that want to follow" },
  { id: "entrepreneur", label: "Entrepreneur",        icon: "▲", desc: "Growing people alongside your business" },
  { id: "coach",        label: "Coach / Instructor",  icon: "●", desc: "Developing skills and character" },
];

// ─── CONTEXT PER ROLE ───
const CTX = {
  parent:       { person: "your child",              people: "your kids",          setting: "at home",            area: "home" },
  teacher:      { person: "a student",               people: "your students",      setting: "in class",           area: "classroom" },
  leader:       { person: "a team member",            people: "your team",          setting: "at work",            area: "workplace" },
  entrepreneur: { person: "an employee or partner",   people: "your team",          setting: "in your business",   area: "business" },
  coach:        { person: "an athlete/participant",   people: "your group",         setting: "during a session",   area: "sessions" },
};

// ─── 18 QUESTIONS (2 per skill × 9 skills) ───
export function getQuestions(role) {
  const c = CTX[role];
  return [
    // 1 — Create the Climate
    { skill: "climate", q: `You're about to walk into a tense situation ${c.setting}. What do you do?`, opts: [
      { text: "I take a breath and consciously decide what energy I want to bring before I walk in", pts: 4 },
      { text: "I think about the outcome I need and focus on getting there", pts: 3 },
      { text: "I just walk in and deal with whatever's happening", pts: 2 },
      { text: "I tend to mirror whatever energy is already in the room", pts: 1 },
    ]},
    { skill: "climate", q: `When ${c.people} seem disengaged or flat, your instinct is to:`, opts: [
      { text: "Shift my own energy first — I know the climate starts with me", pts: 4 },
      { text: "Address it directly and ask what's going on", pts: 3 },
      { text: "Push through the agenda and hope the energy picks up", pts: 2 },
      { text: "Feel frustrated and take it personally", pts: 1 },
    ]},
    // 2 — Make a Personal Connection
    { skill: "connection", q: `When you see ${c.person} for the first time today, you typically:`, opts: [
      { text: "Greet them by name and reference something personal — their weekend, a recent win, something they shared", pts: 4 },
      { text: "Say hello warmly and make eye contact", pts: 3 },
      { text: "Give a quick nod or wave while handling something else", pts: 2 },
      { text: "Jump straight into what needs to happen next", pts: 1 },
    ]},
    { skill: "connection", q: `How well do you know what matters most to ${c.people} outside of your ${c.area}?`, opts: [
      { text: "I could tell you something personal about almost every one of them", pts: 4 },
      { text: "I know a few things about most of them", pts: 3 },
      { text: "I know a lot about a few, not much about the rest", pts: 2 },
      { text: "Honestly, I don't know much beyond our direct interactions", pts: 1 },
    ]},
    // 3 — Aim with Purpose
    { skill: "aim", q: `When you need ${c.person} to do something specific, you usually:`, opts: [
      { text: "Give a clear, specific target with a deadline and check for understanding", pts: 4 },
      { text: "Explain what I need and assume they'll figure out the details", pts: 3 },
      { text: "Give a general direction like 'do your best' or 'improve this'", pts: 2 },
      { text: "Hint at what I want and hope they pick up on it", pts: 1 },
    ]},
    { skill: "aim", q: `If ${c.person} completes a task but misses your intent, your first thought is:`, opts: [
      { text: "I probably wasn't clear enough — let me re-aim with more precision", pts: 4 },
      { text: "I'll clarify, but they should have asked if unsure", pts: 3 },
      { text: "I feel frustrated they didn't understand", pts: 2 },
      { text: "I just fix it myself — it's faster", pts: 1 },
    ]},
    // 4 — Engage with Feedback
    { skill: "feedback", q: `When giving feedback to ${c.person}, your default approach is:`, opts: [
      { text: "Specific observations tied to behavior and impact — what they did, what happened, what to try next", pts: 4 },
      { text: "Honest and direct, even if it's uncomfortable", pts: 3 },
      { text: "Mostly positive — I don't want to discourage them", pts: 2 },
      { text: "I tend to wait or avoid it until it becomes a real problem", pts: 1 },
    ]},
    { skill: "feedback", q: `After giving feedback, how often does ${c.person} know exactly what to do differently?`, opts: [
      { text: "Almost always — I make sure they leave with a clear next step", pts: 4 },
      { text: "Usually, though I'm sometimes too vague", pts: 3 },
      { text: "Sometimes — I know I could be more specific", pts: 2 },
      { text: "I'm not sure — I haven't thought about it from their side", pts: 1 },
    ]},
    // 5 — Reinforce Positive Behavior
    { skill: "reinforce", q: `When ${c.person} does something right ${c.setting}, you:`, opts: [
      { text: "Acknowledge it immediately and specifically — so they know exactly what to repeat", pts: 4 },
      { text: "Make a mental note to mention it later", pts: 3 },
      { text: "Notice it but assume they know they did well", pts: 2 },
      { text: "Focus more on correcting what's wrong than reinforcing what's right", pts: 1 },
    ]},
    { skill: "reinforce", q: `Honestly, how much of your interaction time is spent recognizing positives vs. correcting negatives?`, opts: [
      { text: "I'm intentionally weighted toward reinforcing — at least 3-to-1 positive", pts: 4 },
      { text: "Probably about even", pts: 3 },
      { text: "I spend more time correcting, but I mean well", pts: 2 },
      { text: "Most of my energy goes to fixing problems", pts: 1 },
    ]},
    // 6 — Praise with Precision
    { skill: "praise", q: `Think about the last time you praised ${c.person}. What did it sound like?`, opts: [
      { text: "I named exactly what they did, why it mattered, and the impact it had", pts: 4 },
      { text: "Something like 'Great job on that' with some context", pts: 3 },
      { text: "'Good job' or 'Nice work' — quick and positive", pts: 2 },
      { text: "I can't specifically remember the last time", pts: 1 },
    ]},
    { skill: "praise", q: `If ${c.person} asked "What specifically am I doing well?" — could you answer immediately?`, opts: [
      { text: "Yes — I could name 2–3 specific things with examples", pts: 4 },
      { text: "I could give a general answer but need a moment for specifics", pts: 3 },
      { text: "I'd struggle to be specific in the moment", pts: 2 },
      { text: "I'd probably deflect with something general", pts: 1 },
    ]},
    // 7 — Give Positive Correction
    { skill: "correction", q: `When ${c.person} makes a mistake, your first move is:`, opts: [
      { text: "Acknowledge the effort, name the gap, redirect toward what right looks like — dignity intact", pts: 4 },
      { text: "Point out what went wrong and tell them what to do instead", pts: 3 },
      { text: "Correct the mistake but worry about how they'll take it", pts: 2 },
      { text: "Either avoid the conversation or address it more harshly than intended", pts: 1 },
    ]},
    { skill: "correction", q: `After you correct ${c.person}, they typically:`, opts: [
      { text: "Seem motivated to improve — the relationship feels intact or stronger", pts: 4 },
      { text: "Accept the correction and move on", pts: 3 },
      { text: "Get quiet or defensive", pts: 2 },
      { text: "I'm not sure — I don't usually check in after", pts: 1 },
    ]},
    // 8 — The Name Effect
    { skill: "name", q: `How often do you use ${c.people}'s names in daily interactions?`, opts: [
      { text: "Constantly and naturally — names are part of how I connect", pts: 4 },
      { text: "Often — especially in greetings and important moments", pts: 3 },
      { text: "Sometimes — more with people I know well", pts: 2 },
      { text: "Rarely — I default to 'hey' or no name at all", pts: 1 },
    ]},
    { skill: "name", q: `When you meet someone new ${c.setting}, how quickly do you learn and use their name?`, opts: [
      { text: "Immediately — I repeat it, use it in conversation, and make it stick", pts: 4 },
      { text: "I try to remember but sometimes forget within minutes", pts: 3 },
      { text: "I usually wait until I hear it a few times", pts: 2 },
      { text: "I rarely prioritize learning names right away", pts: 1 },
    ]},
    // 9 — The Victory Frame
    { skill: "victory", q: `When ${c.person} makes progress — even small progress — you:`, opts: [
      { text: "Stop and help them see it: 'Remember where you were? Look at where you are now.'", pts: 4 },
      { text: "Acknowledge the progress and encourage them to keep going", pts: 3 },
      { text: "Note it but focus more on what's still left to improve", pts: 2 },
      { text: "Assume they can see their own progress — I focus on the next challenge", pts: 1 },
    ]},
    { skill: "victory", q: `How often do you help ${c.people} see a version of themselves they didn't know they'd become?`, opts: [
      { text: "Regularly — I hold up the mirror and show them their own growth", pts: 4 },
      { text: "Sometimes — when a big milestone happens", pts: 3 },
      { text: "Rarely — I'm not sure how to do that naturally", pts: 2 },
      { text: "Almost never — I hadn't thought about doing this intentionally", pts: 1 },
    ]},
  ];
}

// ─── SKILL FEEDBACK (3 tiers) ───
export function getSkillFeedback(skillId, pct) {
  const fb = {
    climate: {
      high: "You're setting the emotional tone intentionally. People feel the shift when you walk in — and that's powerful.",
      mid: "You have awareness of climate, but it's inconsistent. Under pressure, you default to reacting rather than leading the room's energy.",
      low: "The climate in your interactions is often set by circumstance, not by you. This is your biggest leverage point — own the first 10 seconds.",
    },
    connection: {
      high: "You make people feel individually seen. That's rare, and it's the foundation everything else is built on.",
      mid: "You connect well with some people but not consistently across everyone. The people you overlook feel it more than you think.",
      low: "Your interactions tend to be transactional. People may respect your competence but don't feel personally known by you.",
    },
    aim: {
      high: "You give people clear, specific targets. They know exactly what success looks like — and that clarity is a gift.",
      mid: "Your goals are sometimes clear, sometimes vague. When people miss the mark, it's often because the target was fuzzy.",
      low: "People around you are often guessing at what you actually want. Vague expectations create anxiety, not autonomy.",
    },
    feedback: {
      high: "Your feedback is specific, timely, and actionable. People leave your conversations knowing exactly what to do next.",
      mid: "You give feedback, but it could be more specific. 'Good job' and 'needs improvement' aren't feedback — they're verdicts.",
      low: "Feedback is either absent or unclear in your interactions. People are left guessing where they stand.",
    },
    reinforce: {
      high: "You catch people doing things right — consistently and specifically. That's how cultures of excellence are built.",
      mid: "You notice good behavior but don't always call it out. What goes unrecognized goes unrepeated.",
      low: "Most of your energy goes to correcting what's wrong. Flip the ratio — you'll be stunned at the difference.",
    },
    praise: {
      high: "Your praise is precise enough to be meaningful and repeatable. People don't just feel good — they know exactly what to keep doing.",
      mid: "You praise, but it's often generic. The jump from 'great job' to naming exactly what was great is small — but the impact is massive.",
      low: "Praise is either absent or too vague to land. People need more than appreciation — they need to know specifically what they did right.",
    },
    correction: {
      high: "You redirect behavior without damaging the relationship. People walk away from your corrections feeling capable, not defeated.",
      mid: "Your corrections land, but sometimes at a cost. The relationship occasionally takes a hit you don't intend.",
      low: "Correction is either avoided or delivered in a way that creates distance. Redirecting with dignity intact is transformative.",
    },
    name: {
      high: "You use names naturally and intentionally. It's a small thing that creates an outsized feeling of being recognized.",
      mid: "You use names with some people but not others. Extending this to everyone — including strangers — multiplies your connection.",
      low: "Names aren't part of your interaction toolkit yet. This is the simplest skill on the list and one of the most powerful to adopt.",
    },
    victory: {
      high: "You hold up the mirror and help people see their own growth. That's not motivation — that's transformation.",
      mid: "You acknowledge wins but don't always help people see the full arc of their progress. The 'look how far you've come' moment is what sticks.",
      low: "People around you may be growing without realizing it — because no one is showing them. This skill changes lives when you learn it.",
    },
  };
  const level = pct >= 75 ? "high" : pct >= 45 ? "mid" : "low";
  return fb[skillId]?.[level] || "";
}

// ─── OVERALL MESSAGE ───
export function getOverallMessage(pct) {
  if (pct >= 85) return "You're operating at a high level of interpersonal impact. The 9 Skills aren't new to you — but naming them and making them intentional will elevate your influence even further.";
  if (pct >= 65) return "You have strong instincts and real skills — but there are gaps between your intentions and your impact. The good news: the gaps are specific and closable.";
  if (pct >= 45) return "You care about the people you lead — that's clear. But caring isn't the same as connecting. The 9 Skills will give your good intentions a framework to actually land.";
  return "There's a significant gap between what you intend and what people experience. That's not a judgment — it's an opportunity. You're closer to a breakthrough than you think.";
}

// ─── DYNAMIC CTA RECOMMENDATIONS ───
export function getSmartCTAs(skillScores, catScores, role) {
  const sorted = [...SKILLS].sort((a, b) => (skillScores[a.id] || 0) - (skillScores[b.id] || 0));
  const weakest = sorted.slice(0, 3);
  const weakestCats = [...new Set(weakest.map(s => s.cat))];
  const lowestCat = CATEGORIES.reduce((a, b) => (catScores[a.id] < catScores[b.id] ? a : b));

  const courseRec = {
    connect: {
      headline: "Your biggest growth area is in Connect — the foundation.",
      body: "Skills like setting the climate, making personal connections, aiming with purpose, and giving feedback are the bridge everything else is built on. Without them, influence and inspiration fall flat.",
      module: "The Connect Foundation",
    },
    influence: {
      headline: "Your biggest growth area is in Influence — moving people.",
      body: "You build connections, but translating that into behavior change — through reinforcement, precise praise, and positive correction — is where your impact can leap forward.",
      module: "The Influence Accelerator",
    },
    inspire: {
      headline: "Your biggest growth area is in Inspire — lasting transformation.",
      body: "You connect and influence, but helping people see their own growth and using names with real intention is what turns short-term change into lifelong impact.",
      module: "The Inspire Multiplier",
    },
  };

  const rec = courseRec[lowestCat.id];

  const skillTips = weakest.map(s => ({
    skill: s,
    tip: getQuickWin(s.id, role),
  }));

  return { rec, skillTips, lowestCat, weakest };
}

// ─── QUICK WINS PER SKILL ───
function getQuickWin(skillId, role) {
  const wins = {
    climate: {
      parent: "Before walking through the front door tonight, pause for 3 seconds and decide: what energy do I want my kids to feel?",
      teacher: "Tomorrow morning, stand at your classroom door and greet each student by name before they sit down.",
      leader: "Start your next meeting with a genuine check-in instead of jumping to the agenda.",
      entrepreneur: "Before your next team standup, ask yourself: what climate am I about to create?",
      coach: "Open your next session with energy that matches what you want them to bring — they'll mirror you.",
    },
    connection: {
      parent: "Ask your child one question today that has nothing to do with school, chores, or behavior.",
      teacher: "Learn one new personal fact about a student you don't know well — and mention it tomorrow.",
      leader: "In your next 1-on-1, spend the first 2 minutes on the person before the project.",
      entrepreneur: "Text someone on your team today just to ask how their weekend was. No business.",
      coach: "Before your next session, recall one personal detail about each participant and use it.",
    },
    aim: {
      parent: "Replace 'clean your room' with 'put all the clothes in the hamper and make your bed by 4pm.'",
      teacher: "End your next lesson by having a student repeat back the one thing they should be able to do now.",
      leader: "Rewrite your next task assignment: add a specific deliverable, a deadline, and a definition of done.",
      entrepreneur: "Pick one vague goal you've given this week and rewrite it with ruthless specificity.",
      coach: "Start your next drill with: 'By the end of this, you will be able to ___.'",
    },
    feedback: {
      parent: "Replace 'good job' with exactly what you saw: 'You shared your toy with your sister without being asked — that shows real kindness.'",
      teacher: "Give one student feedback tomorrow that includes: what they did, why it matters, and what to try next.",
      leader: "In your next review, replace every vague comment with a specific observation + specific next step.",
      entrepreneur: "Give someone feedback today using this format: 'I noticed [behavior]. Here's the impact: [result]. Try: [next step].'",
      coach: "After the next drill, pull one person aside and tell them exactly what they did differently than last time.",
    },
    reinforce: {
      parent: "Catch your child doing something right today — and name it out loud before correcting anything.",
      teacher: "Keep a tally tomorrow: how many positives vs. corrections? Aim for 3:1.",
      leader: "Send a Slack message right now recognizing something specific someone did well this week.",
      entrepreneur: "In your next team meeting, open by calling out one thing someone did that moved the needle.",
      coach: "During your next session, make your first 5 comments all reinforcements. See what happens to the energy.",
    },
    praise: {
      parent: "Tonight at dinner, give each child one specific piece of praise with a concrete example.",
      teacher: "Write a 2-sentence note to a student naming exactly what they did well and why it mattered.",
      leader: "Replace your next 'great job' email with 3 sentences: what they did, why it mattered, the impact it had.",
      entrepreneur: "Give public praise in your next all-hands — with enough detail that everyone learns from it.",
      coach: "After practice, tell one person: 'The specific thing you did today that impressed me was ___.'",
    },
    correction: {
      parent: "Next time you correct your child, start with what they did right — then redirect.",
      teacher: "Practice this formula: acknowledge effort → name the gap → point forward. Try it once tomorrow.",
      leader: "Before your next difficult conversation, write down: what went wrong, and what 'right' looks like.",
      entrepreneur: "Replace 'that's wrong' with 'here's what would make it great' in your next correction.",
      coach: "Next correction: say 'I know you can do this — here's the adjustment' instead of 'that's not right.'",
    },
    name: {
      parent: "Use your child's name when you praise them today — not just when you're correcting them.",
      teacher: "Challenge yourself: use every student's name at least once during tomorrow's class.",
      leader: "In your next meeting, address each person by name at least once — especially the quiet ones.",
      entrepreneur: "Next time you're at a coffee shop, read the barista's name tag and use it. Build the muscle.",
      coach: "Open your next session by greeting each person by name before anything else happens.",
    },
    victory: {
      parent: "Tonight, remind your child of something they couldn't do 6 months ago that they can do now.",
      teacher: "Pull aside one student and say: 'Remember when you struggled with ___? Look at what you just did.'",
      leader: "In your next 1-on-1, show someone their own progress — don't just discuss what's next.",
      entrepreneur: "At your next team meeting, share a 'where we were vs. where we are' moment for the whole team.",
      coach: "End your next session by showing one person a before/after of their own performance.",
    },
  };
  return wins[skillId]?.[role] || wins[skillId]?.leader || "";
}

// ─── SCORE COMPUTATION ───
export function computeScores(answers, questions) {
  const rawBySkill = {};
  const maxBySkill = {};
  SKILLS.forEach(s => { rawBySkill[s.id] = 0; maxBySkill[s.id] = 0; });

  answers.forEach((a, i) => {
    const skillId = questions[i].skill;
    rawBySkill[skillId] += a.pts;
    maxBySkill[skillId] += 4;
  });

  const skillScores = {};
  SKILLS.forEach(s => {
    skillScores[s.id] = maxBySkill[s.id] > 0 ? Math.round((rawBySkill[s.id] / maxBySkill[s.id]) * 100) : 0;
  });

  const catScores = {};
  CATEGORIES.forEach(cat => {
    const catSkills = cat.skills.map(i => SKILLS[i].id);
    const total = catSkills.reduce((sum, sid) => sum + skillScores[sid], 0);
    catScores[cat.id] = Math.round(total / catSkills.length);
  });

  return { skillScores, catScores };
}
