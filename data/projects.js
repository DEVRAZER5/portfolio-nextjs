export const projects = [
  {
    slug: "logo-redesign-sirbegovic",
    name: "Logo Redesign — Sirbegović Inženjering",
    summary: "Redesigned a 15-year-old logo for a construction company, unprompted.",
    problem:
      "Sirbegović Inženjering, a company that builds concrete structures, had been using the same logo for over 15 years. Nobody asked me to touch it — I just noticed their brand didn't match what they were actually doing today.",
    whatIDid:
      "I built a complete logo redesign in Illustrator, with a bit of help from AI for brainstorming ideas. I went with a shape based on concrete pillars with the company's initials carved into them, and colors that read as construction/industrial.",
    outcome:
      "I sent the finished logo directly to the company, unannounced. They were pleasantly surprised, and we're currently in talks about whether they'll adopt it.",
  },
  {
    slug: "amazon-clone",
    name: "Amazon Clone",
    summary: "E-commerce practice site with cart, checkout, and async JavaScript.",
    problem:
      "I wanted to learn how to connect a front end to real logic — cart, checkout, and data handling — by building a complete e-commerce flow.",
    whatIDid:
      "I built the home page, cart, and checkout following a tutorial, spending the most time on callback functions, Promises, and fetch. The search bar wasn't covered in the tutorial — I solved that on my own.",
    outcome:
      "The whole site works end to end. I came out with a solid grasp of asynchronous JavaScript, the foundation for working with real APIs.",
  },
  {
    slug: "youtube-clone",
    name: "YouTube Clone",
    summary: "Layout practice replicating the YouTube home page.",
    problem:
      "I wanted to practice layout techniques — replicating YouTube's home page: search bar, menu, and video grid, using only HTML and CSS.",
    whatIDid:
      "I built the full home page following a tutorial, focusing on Flexbox and Grid — the biggest challenge was understanding how elements behave when combined.",
    outcome:
      "The page looks and functions like a real YouTube home page. I came out with a solid understanding of Flexbox and Grid.",
  },
  {
    slug: "js-fundamentals",
    name: "JavaScript Fundamentals — 30 Days",
    summary: "A month of small, self-directed JS exercises.",
    problem:
      "I wanted to turn scrolling time into something useful, so I had AI give me one basic JS task per day for a month.",
    whatIDid:
      "I solved every task on my own — a counter, calculator, reaction-time test, click-speed test, rock-paper-scissors, and more — only checking with AI at the end.",
    outcome:
      "I learned more about clean JS logic than expected, and picked up the habit of doing something useful every day.",
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
