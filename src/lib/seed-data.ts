import type { Assignment, Child, ChildSlug, Question, Skill } from "./types";

export const children: Child[] = [
  {
    id: "ella",
    name: "Ella Gu",
    gradeLabel: "Rising 2nd grade",
    track: "Foundations and confidence",
    color: "bg-coral"
  },
  {
    id: "evelyn",
    name: "Evelyn Gu",
    gradeLabel: "Rising 4th grade",
    track: "EPS prep track",
    color: "bg-leaf"
  }
];

const q = (
  id: string,
  section: Question["section"],
  type: Question["type"],
  prompt: string,
  skill: Skill,
  answer: Question["answer"],
  extra: Partial<Question> = {}
): Question => ({
  id,
  section,
  type,
  prompt,
  skill,
  answer,
  points: type === "short_text" ? 4 : 1,
  ...extra
});

const ellaDay = (day: number, title: string, questions: Question[]): Assignment => ({
  id: `ella-day-${day}`,
  childId: "ella",
  day,
  title,
  dateLabel: `Day ${day}`,
  questions
});

const evelynDay = (day: number, title: string, questions: Question[]): Assignment => ({
  id: `evelyn-day-${day}`,
  childId: "evelyn",
  day,
  title,
  dateLabel: `Day ${day}`,
  questions
});

export const assignments: Assignment[] = [
  ellaDay(1, "Ella's Brave Beginning", [
    q("ella-1-m1", "math", "numeric", "14 - 8 =", "subtraction", 6),
    q("ella-1-m2", "math", "numeric", "16 - 7 =", "subtraction", 9),
    q("ella-1-m3", "math", "multiple_choice", "Mia has 9 shells. She finds 5 more, then gives 3 away. How many shells now?", "word_problems", "11", { choices: ["10", "11", "12"] }),
    q("ella-1-m4", "math", "multiple_choice", "A picture graph shows 5 cats, 3 dogs, and 2 birds. How many pets are shown in all?", "graphs", "10", { choices: ["8", "10", "12"] }),
    q("ella-1-v1", "vocabulary", "multiple_choice", "What does unhappy mean?", "prefixes", "not happy", { choices: ["very happy", "not happy", "happy again"] }),
    q("ella-1-v2", "vocabulary", "multiple_choice", "Which word means to tie again?", "prefixes", "retie", { choices: ["untie", "retie", "tied"] }),
    q("ella-1-v3", "vocabulary", "multiple_choice", "Which sentence uses -ly correctly?", "suffixes", "Ella read quietly.", { choices: ["Ella read quietly.", "Ella is quietlyer.", "Ella quietlyest reads."] }),
    q("ella-1-r1", "reading", "short_text", "Question: Why did Nora put the blue pencil on Max's desk?", "story_elements", undefined, { passage: "Max was new in class and sat very still. Nora saw him looking for a pencil. She put her favorite blue pencil on his desk and smiled. Max whispered, \"Thank you,\" and began his drawing.", rubric: ["Answers the question", "Uses a detail from the paragraph", "Writes a complete sentence"] }),
    q("ella-1-w1", "writing", "short_text", "Quick write: Write 4 sentences about a kind thing Ella could do for a nervous new classmate.", "story_elements", undefined, { rubric: ["Names Ella and another character", "Shows the setting", "Includes one kind action", "Uses sentence punctuation"] })
  ]),
  ellaDay(2, "Ella's Garden Graphs", [
    q("ella-2-m1", "math", "numeric", "17 - 9 =", "subtraction", 8),
    q("ella-2-m2", "math", "numeric", "13 - 6 =", "subtraction", 7),
    q("ella-2-m3", "math", "multiple_choice", "A picture graph shows 4 apples, 6 pears, and 3 bananas. Which fruit has the most?", "graphs", "pears", { choices: ["apples", "pears", "bananas"] }),
    q("ella-2-m4", "math", "multiple_choice", "Ella picked 7 flowers and Evelyn picked 5. Then they gave 4 away. How many flowers are left?", "word_problems", "8", { choices: ["8", "9", "12"] }),
    q("ella-2-v1", "vocabulary", "multiple_choice", "Which word means to read again?", "prefixes", "reread", { choices: ["unread", "reread", "reader"] }),
    q("ella-2-v2", "vocabulary", "multiple_choice", "What does unsafe mean?", "prefixes", "not safe", { choices: ["not safe", "very safe", "safe again"] }),
    q("ella-2-v3", "vocabulary", "multiple_choice", "Which word means more bright?", "suffixes", "brighter", { choices: ["brightly", "brighter", "brightest"] }),
    q("ella-2-r1", "reading", "short_text", "Question: What problem did Ben solve in the garden?", "story_elements", undefined, { passage: "Ben checked the class garden after lunch. The bean plant was bent over because the wind had pushed it down. Ben found a small stick and tied the plant gently. By the next morning, the plant stood tall again.", rubric: ["Names the problem", "Explains the solution", "Uses a paragraph detail"] }),
    q("ella-2-w1", "writing", "short_text", "Quick write: Ella notices a problem in the classroom or playground. What is the problem and how does she start to solve it?", "story_elements", undefined, { rubric: ["States a clear problem", "Shows Ella's first step", "Adds one feeling word", "Uses 4 or more sentences"] })
  ]),
  ellaDay(3, "Ella's Fraction Picnic", [
    q("ella-3-m1", "math", "multiple_choice", "Which shape is split into four equal parts?", "fractions", "fourths", { choices: ["halves", "thirds", "fourths"] }),
    q("ella-3-m2", "math", "numeric", "12 - 7 =", "subtraction", 5),
    q("ella-3-m3", "math", "multiple_choice", "Half of 10 grapes is how many grapes?", "fractions", "5", { choices: ["4", "5", "6"] }),
    q("ella-3-m4", "math", "multiple_choice", "Ella had 8 stickers. She got 6 more and used 5. How many stickers now?", "word_problems", "9", { choices: ["8", "9", "10"] }),
    q("ella-3-v1", "vocabulary", "multiple_choice", "Which suffix makes quick become an adverb?", "suffixes", "-ly", { choices: ["-er", "-est", "-ly"] }),
    q("ella-3-v2", "vocabulary", "multiple_choice", "What does rebuild mean?", "prefixes", "build again", { choices: ["not build", "build again", "build slowly"] }),
    q("ella-3-v3", "vocabulary", "multiple_choice", "Which word means the most small?", "suffixes", "smallest", { choices: ["smaller", "smallest", "smallly"] }),
    q("ella-3-r1", "reading", "short_text", "Question: What happened after Lila shared the crackers?", "retell", undefined, { passage: "Lila had eight crackers at snack time. She broke them into equal groups so four friends could share. Everyone got the same amount. After snack, the friends helped Lila clean the table.", rubric: ["Answers what happened after", "Uses sequence words if helpful", "Writes a complete sentence"] }),
    q("ella-3-w1", "writing", "short_text", "Quick write: Ella shares a snack or game fairly. Include halves or fourths in your answer.", "fractions", undefined, { rubric: ["Includes Ella", "Uses halves or fourths correctly", "Explains fair sharing", "Uses 4 or more sentences"] })
  ]),
  ellaDay(4, "Ella's Word Power", [
    q("ella-4-m1", "math", "multiple_choice", "Lena had 16 stickers. She used 7. How many are left?", "word_problems", "9", { choices: ["8", "9", "10"] }),
    q("ella-4-m2", "math", "multiple_choice", "A graph has 5 sunny days and 2 rainy days. How many more sunny days?", "graphs", "3", { choices: ["2", "3", "7"] }),
    q("ella-4-m3", "math", "numeric", "15 - 8 =", "subtraction", 7),
    q("ella-4-m4", "math", "multiple_choice", "Which shows one fourth?", "fractions", "1 out of 4 equal parts", { choices: ["1 out of 2 equal parts", "1 out of 4 equal parts", "4 whole shapes"] }),
    q("ella-4-v1", "vocabulary", "multiple_choice", "Which word means more fast?", "suffixes", "faster", { choices: ["fastest", "faster", "fastly"] }),
    q("ella-4-v2", "vocabulary", "multiple_choice", "What does unlock mean?", "prefixes", "open a lock", { choices: ["open a lock", "lock again", "the best lock"] }),
    q("ella-4-v3", "vocabulary", "multiple_choice", "Which word tells how Ella smiled?", "suffixes", "happily", { choices: ["happier", "happiest", "happily"] }),
    q("ella-4-r1", "reading", "short_text", "Question: How did Maya fix her mistake?", "story_elements", undefined, { passage: "Maya rushed through her spelling card and wrote two letters backward. She felt upset, but she did not quit. Maya erased the letters, reread the word slowly, and wrote it again. Her second card was neat and correct.", rubric: ["Explains how Maya fixed it", "Uses one detail", "Writes clearly"] }),
    q("ella-4-w1", "writing", "short_text", "Quick write: Ella tries to redo something after a mistake. Show what she learns.", "prefixes", undefined, { rubric: ["Uses redo or another re- word", "Shows a mistake and learning", "Includes a feeling", "Uses 4 or more sentences"] })
  ]),
  ellaDay(5, "Ella's Shining Review", [
    q("ella-5-m1", "math", "numeric", "18 - 9 =", "subtraction", 9),
    q("ella-5-m2", "math", "multiple_choice", "Half of 8 crackers is how many crackers?", "fractions", "4", { choices: ["2", "4", "6"] }),
    q("ella-5-m3", "math", "numeric", "11 + 6 - 5 =", "word_problems", 12),
    q("ella-5-m4", "math", "multiple_choice", "A picture graph shows 3 red books, 5 blue books, and 4 green books. How many books total?", "graphs", "12", { choices: ["9", "12", "15"] }),
    q("ella-5-v1", "vocabulary", "multiple_choice", "Which word means the most tall?", "suffixes", "tallest", { choices: ["taller", "tallest", "tally"] }),
    q("ella-5-v2", "vocabulary", "multiple_choice", "What does repaint mean?", "prefixes", "paint again", { choices: ["not paint", "paint again", "paint quickly"] }),
    q("ella-5-v3", "vocabulary", "multiple_choice", "Which word means not fair?", "prefixes", "unfair", { choices: ["refair", "unfair", "fairest"] }),
    q("ella-5-r1", "reading", "short_text", "Question: What is the lesson of this paragraph?", "story_elements", undefined, { passage: "Rina thought her paper star was unlucky because one point tore. Her friend Ella showed her how to fold a new point over the tear. The star looked different, but it was still beautiful. Rina smiled and hung it by the window.", rubric: ["States a lesson", "Uses a paragraph detail", "Writes a complete thought"] }),
    q("ella-5-w1", "writing", "short_text", "Ella's one writing project: Write a friendly note to the main character from your reading project. Tell the character what you noticed, what you liked, and one piece of advice.", "story_elements", undefined, { rubric: ["Addresses the character", "Mentions one story detail", "Gives kind advice", "Checks capitals and punctuation"] })
  ]),
  evelynDay(1, "Evelyn's EPS Reasoning Launch", [
    q("evelyn-1-m1", "math", "numeric", "8 x 7 =", "multiplication", 56),
    q("evelyn-1-m2", "math", "numeric", "54 / 6 =", "division", 9),
    q("evelyn-1-m3", "math", "multiple_choice", "Which fraction is equivalent to 3/4?", "equivalent_fractions", "6/8", { choices: ["4/6", "6/8", "9/16"] }),
    q("evelyn-1-m4", "math", "multiple_choice", "A rectangle has length 9 and width 3. What is the area?", "area_perimeter", "27", { choices: ["12", "24", "27"] }),
    q("evelyn-1-v1", "vocabulary", "multiple_choice", "The root aud means:", "roots", "hear", { choices: ["carry", "hear", "look"] }),
    q("evelyn-1-v2", "vocabulary", "multiple_choice", "Which word uses aud correctly?", "roots", "audience", { choices: ["audience", "portable", "structure"] }),
    q("evelyn-1-v3", "vocabulary", "multiple_choice", "The word inspect is closest to:", "roots", "look closely", { choices: ["carry away", "look closely", "build again"] }),
    q("evelyn-1-r1", "reading", "short_text", "Question: What theme is suggested by the paragraph, and what evidence supports it?", "theme", undefined, { passage: "Ari wanted to quit the science fair when his first bridge model collapsed. Instead, he studied where the sticks had bent and rebuilt the base with triangles. His second model held five books. Ari wrote in his notebook, \"Mistakes can show the next step.\"", rubric: ["States a theme as a lesson", "Uses specific evidence", "Explains how evidence supports the theme"] }),
    q("evelyn-1-w1", "writing", "short_text", "Quick write: Explain two different ways to solve 36 / 4. Make it clear enough for a younger student to follow.", "eps_reasoning", undefined, { rubric: ["Uses two strategies", "Shows reasoning step by step", "Concludes with 9", "Uses precise math language"] })
  ]),
  evelynDay(2, "Evelyn's Fraction Focus", [
    q("evelyn-2-m1", "math", "multiple_choice", "Which is greater: 2/3 or 3/5?", "comparing_fractions", "2/3", { choices: ["2/3", "3/5", "equal"] }),
    q("evelyn-2-m2", "math", "numeric", "A rectangle is 6 cm by 4 cm. What is the perimeter?", "area_perimeter", 20),
    q("evelyn-2-m3", "math", "numeric", "9 x 8 =", "multiplication", 72),
    q("evelyn-2-m4", "math", "multiple_choice", "Which fraction is equivalent to 4/6?", "equivalent_fractions", "2/3", { choices: ["2/3", "4/12", "6/8"] }),
    q("evelyn-2-v1", "vocabulary", "multiple_choice", "The root port means:", "roots", "carry", { choices: ["build", "carry", "watch"] }),
    q("evelyn-2-v2", "vocabulary", "multiple_choice", "Portable means:", "roots", "able to be carried", { choices: ["able to be carried", "able to be heard", "able to be built"] }),
    q("evelyn-2-v3", "vocabulary", "multiple_choice", "Which word uses struct?", "roots", "construct", { choices: ["audible", "transport", "construct"] }),
    q("evelyn-2-r1", "reading", "short_text", "Question: What is the main idea of the paragraph? Include two important details.", "nonfiction_summary", undefined, { passage: "Honeybees help many plants grow by moving pollen from flower to flower. A bee collects nectar for food, and pollen sticks to its body. When the bee visits another flower, some pollen rubs off. This process helps fruits and seeds form.", rubric: ["States the main idea", "Includes two important details", "Avoids minor details"] }),
    q("evelyn-2-w1", "writing", "short_text", "Quick write: A student says 4/6 is bigger than 2/3 because 6 is bigger than 3. Write a correction using equivalent fractions or a model.", "eps_reasoning", undefined, { rubric: ["Identifies denominator misconception", "Uses equivalent fractions or model", "Explains why they are equal", "Uses a respectful academic tone"] })
  ]),
  evelynDay(3, "Evelyn's Data Detectives", [
    q("evelyn-3-m1", "math", "numeric", "63 / 9 =", "division", 7),
    q("evelyn-3-m2", "math", "multiple_choice", "A line plot has values 2, 2, 3, 5, 5, 5. Which value appears most?", "line_plots", "5", { choices: ["2", "3", "5"] }),
    q("evelyn-3-m3", "math", "numeric", "7 x 6 =", "multiplication", 42),
    q("evelyn-3-m4", "math", "multiple_choice", "Evelyn reads 18 pages on Monday and twice as many on Tuesday. Then she reads 9 fewer on Wednesday than Tuesday. How many Wednesday pages?", "two_step_reasoning", "27", { choices: ["27", "36", "45"] }),
    q("evelyn-3-v1", "vocabulary", "multiple_choice", "The root spect means:", "roots", "look", { choices: ["look", "carry", "hear"] }),
    q("evelyn-3-v2", "vocabulary", "multiple_choice", "Which word means to look back at something?", "roots", "respect", { choices: ["transport", "respect", "construct"] }),
    q("evelyn-3-v3", "vocabulary", "multiple_choice", "Audible means:", "roots", "able to be heard", { choices: ["able to be heard", "able to be carried", "able to be built"] }),
    q("evelyn-3-r1", "reading", "short_text", "Question: Which detail best supports the idea that Jada is persistent? Explain why.", "theme", undefined, { passage: "Jada missed the first three free throws at practice. She asked her coach to watch her form, then practiced ten more shots. When her arms felt tired, she took a short break and tried again. By the end, she made six shots in a row.", rubric: ["Chooses a strong detail", "Explains persistence", "Uses evidence from the paragraph"] }),
    q("evelyn-3-w1", "writing", "short_text", "Quick write: Solve and explain this two-step problem: 5 bags have 8 marbles each. You give away 17. How many remain? Include a sentence explaining why your operation order makes sense.", "two_step_reasoning", undefined, { rubric: ["Multiplies first", "Subtracts second", "Explains final answer 23", "Justifies operation order"] })
  ]),
  evelynDay(4, "Evelyn's Build and Compare", [
    q("evelyn-4-m1", "math", "numeric", "9 x 6 =", "multiplication", 54),
    q("evelyn-4-m2", "math", "multiple_choice", "A rectangle has area 35 sq units and one side is 5. What is the other side?", "area_perimeter", "7", { choices: ["6", "7", "30"] }),
    q("evelyn-4-m3", "math", "multiple_choice", "Which is greater: 5/8 or 3/4?", "comparing_fractions", "3/4", { choices: ["5/8", "3/4", "equal"] }),
    q("evelyn-4-m4", "math", "numeric", "48 / 8 =", "division", 6),
    q("evelyn-4-v1", "vocabulary", "multiple_choice", "The root struct means:", "roots", "build", { choices: ["hear", "build", "carry"] }),
    q("evelyn-4-v2", "vocabulary", "multiple_choice", "Which word means to carry across?", "roots", "transport", { choices: ["transport", "inspect", "auditorium"] }),
    q("evelyn-4-v3", "vocabulary", "multiple_choice", "A structure is something that is:", "roots", "built", { choices: ["built", "heard", "carried"] }),
    q("evelyn-4-r1", "reading", "short_text", "Question: What is the author's purpose, and which detail helps you know?", "nonfiction_summary", undefined, { passage: "Suspension bridges can cross wide rivers because strong cables hold up the road. The cables hang from tall towers and spread the bridge's weight. Engineers inspect the cables often so the bridge stays safe for travelers.", rubric: ["States author's purpose", "Uses a supporting detail", "Explains the connection"] }),
    q("evelyn-4-w1", "writing", "short_text", "Quick write: Compare 5/8 and 3/4. Explain with a model, common denominator, or benchmark fraction. Then write one sentence about which method felt clearest.", "comparing_fractions", undefined, { rubric: ["Finds 3/4 is greater", "Uses model, denominator, or benchmark", "Explains reasoning", "Reflects on method choice"] })
  ]),
  evelynDay(5, "Evelyn's Scholar Review", [
    q("evelyn-5-m1", "math", "numeric", "72 / 8 =", "division", 9),
    q("evelyn-5-m2", "math", "multiple_choice", "Which fraction is equivalent to 5/6?", "equivalent_fractions", "10/12", { choices: ["10/12", "6/10", "15/20"] }),
    q("evelyn-5-m3", "math", "numeric", "A rectangle has length 11 and width 4. What is the perimeter?", "area_perimeter", 30),
    q("evelyn-5-m4", "math", "multiple_choice", "A line plot has study times 20, 25, 25, 30, 40. What is the range?", "line_plots", "20", { choices: ["15", "20", "25"] }),
    q("evelyn-5-v1", "vocabulary", "multiple_choice", "Which word means a place where people can hear a performance?", "roots", "auditorium", { choices: ["portable", "auditorium", "inspect"] }),
    q("evelyn-5-v2", "vocabulary", "multiple_choice", "Which word means to build again?", "roots", "reconstruct", { choices: ["reconstruct", "audible", "portable"] }),
    q("evelyn-5-v3", "vocabulary", "multiple_choice", "Which word means to look at carefully?", "roots", "inspect", { choices: ["export", "inspect", "structure"] }),
    q("evelyn-5-r1", "reading", "short_text", "Question: What theme does the paragraph teach? Cite two details and explain how they prove it.", "theme", undefined, { passage: "Noah found a wallet under a bench after soccer practice. He wanted to hurry home, but he noticed a school ID inside. Noah brought the wallet to the office and waited while the secretary called the owner. When a relieved sixth grader arrived, Noah felt proud that he had done the honest thing.", rubric: ["States a theme", "Cites two details", "Explains how details prove it"] }),
    q("evelyn-5-w1", "writing", "short_text", "Evelyn's one writing project: Write a polished EPS-style explanation of what a line plot of study times can show. Use the values 20, 25, 25, 30, and 40, include one conclusion, and support it with data.", "line_plots", undefined, { rubric: ["Reads data accurately", "Mentions common value or range", "Explains conclusion", "Uses evidence from the values"] })
  ])
];

export function getChild(slug: ChildSlug) {
  return children.find((child) => child.id === slug);
}

export function getAssignmentsForChild(slug: ChildSlug) {
  return assignments.filter((assignment) => assignment.childId === slug);
}

export function getTodayAssignment(slug: ChildSlug) {
  return getAssignmentsForChild(slug)[0];
}

export function getAssignment(id: string) {
  return assignments.find((assignment) => assignment.id === id);
}
