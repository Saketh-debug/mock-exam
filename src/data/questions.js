// ── AAC Mock Test — 30 Questions + Answer Key ──
// Source: AAC Mock Test - Question Paper with Answer Key.md
// Questions with images use the optional `imageUrl` and `imageAlt` fields.

export const QUESTIONS = [
  // ── Section 1: C Basics (3 questions) ──
  {
    id: 1,
    subject: "C Basics",
    subjectShort: "C Basics",
    text: `What will be the output of the following C code snippet?\n\n\`\`\`c\n#include <stdio.h>\nint main() {\n    int a = 5, b = 2;\n    printf("%d", a / b);\n    return 0;\n}\n\`\`\``,
    options: { A: "2.5", B: "2", C: "3", D: "2.0" },
    correctAnswer: "B",
  },
  {
    id: 2,
    subject: "C Basics",
    subjectShort: "C Basics",
    text: `Which format specifier is used to read or print a single character using scanf() and printf() in C?`,
    options: { A: "%c", B: "%d", C: "%s", D: "%f" },
    correctAnswer: "A",
  },
  {
    id: 3,
    subject: "C Basics",
    subjectShort: "C Basics",
    text: `What is the index of the first element in any standard C array?`,
    options: { A: "1", B: "-1", C: "0", D: "Defined by programmer" },
    correctAnswer: "C",
  },

  // ── Section 2: Mathematics (15 questions) ──
  {
    id: 4,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `How many ways can the letters of the word MISSISSIPPI be arranged so that all I's are together?`,
    options: { A: "105", B: "840", C: "420", D: "210" },
    correctAnswer: "B",
  },
  {
    id: 5,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `If R(z) and I(z) denote the real and imaginary parts of z, where z = (√3/2 + i/2)⁵ + (√3/2 − i/2)⁵, then select the correct statement:`,
    options: {
      A: "z = 2sin(5π/6)",
      B: "z = 2cos(5π/6)",
      C: "z = cos(5π/6)",
      D: "z = 0",
    },
    correctAnswer: "B",
  },
  {
    id: 6,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `For real numbers x and y satisfying the inequality 2√(sin²x − 2sinx + 5) · (1/4sin²y) ≤ 1, determine the possible value of 2sin²y:`,
    options: { A: "0", B: "1", C: "2", D: "4" },
    correctAnswer: "C",
  },
  {
    id: 7,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `If the 19th term of a non-zero Arithmetic Progression is zero, then find the ratio of the (50th term) : (20th term):`,
    options: { A: "29 : 1", B: "31 : 1", C: "30 : 1", D: "32 : 1" },
    correctAnswer: "B",
  },
  {
    id: 8,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Find the sum of the digits of the number of 3 × 3 matrices M with entries from {0, 1, 2} for which the sum of the diagonal entries of MᵀM is 5:`,
    options: { A: "12", B: "18", C: "9", D: "21" },
    correctAnswer: "B",
  },
  {
    id: 9,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Find the center and radius squared of a circle which has the lines y = 2x + 1 and y = −x + 3 as diameters and passes through the point (1, 2):`,
    options: {
      A: "Center: (−2/3, −7/3), r² = 2/9",
      B: "Center: (2/3, 7/3), r² = 2/9",
      C: "Center: (−2/3, −7/3), r² = 14/9",
      D: "Center: (1, 3), r² = 4",
    },
    correctAnswer: "B",
  },
  {
    id: 10,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Find the base b for which the arithmetic operation is true: (54)ᵦ ÷ (4)ᵦ = (13)ᵦ:`,
    options: { A: "6", B: "7", C: "8", D: "9" },
    correctAnswer: "C",
  },
  {
    id: 11,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `The number of permutations of 12 different color balls taken not more than 4 at a time, where a ball can be repeated any number of times, is:`,
    options: { A: "20736", B: "22620", C: "21480", D: "24200" },
    correctAnswer: "B",
  },
  {
    id: 12,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Suppose determinant A = 0 holds true for a positive integer n (a certain matrix expression). Find Σₖ₌₀ⁿ (ⁿCₖ / (k + 1)):`,
    options: { A: "4.50", B: "5.75", C: "6.20", D: "7.15" },
    correctAnswer: "C",
  },
  {
    id: 13,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `If the area between the curves in the first quadrant from x = 1 to the point of intersection of f(x) and g(x) is 2 − √a, then find a:\n\nf(x) = eˣ⁻¹ − e⁻⁽ˣ⁻¹⁾\ng(x) = ½(eˣ⁻¹ + e¹⁻ˣ)`,
    options: { A: "2", B: "3", C: "4", D: "5" },
    correctAnswer: "B",
  },
  {
    id: 14,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `A person sells an article for ₹840 and incurs a loss of 20%. At what price should he sell it to gain 15%?`,
    options: { A: "₹1,150", B: "₹1,200", C: "₹1,207.50", D: "₹1,260" },
    correctAnswer: "C",
  },
  {
    id: 15,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Consider the groups: English, Math, and Chinese.\n\nWhich of the following diagrams shows this relationship correctly?\n\n[Note: This question has a visual diagram. In the actual exam, refer to the diagram provided.]\n\n`,
    imageUrl: "https://res.cloudinary.com/aacgriet/image/upload/v1790408544/817108cb-44d6-4b1f-aae4-f9ecf55354a5.png",
    imageAlt: "Relationship diagram for English, Math, and Chinese groups",
    options: {
      A: "Diagram A",
      B: "Diagram B",
      C: "Diagram C",
      D: "Diagram D",
      E: "Diagram E",
    },
    correctAnswer: "E",
    fiveOptions: true,
  },

  {
    id: 16,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Trace the figure that contains Figure (X) as an embedded part.\n\n[Figure (X): A horizontal zigzag line with a central trapezoid below a triangular peak]\n\n[Note: This question has visual figures. In the actual exam, refer to the diagrams provided.]\n\n• Figure (a): Contains only diagonal lines\n• Figure (b): Contains overlapping triangles\n• Figure (c): Contains a simple square with diagonals\n• Figure (d): Contains the trapezoid + triangular peak pattern embedded within it`,
    imageUrl: "https://res.cloudinary.com/aacgriet/image/upload/v1790408619/c494af4b-519f-4ee2-98c0-fdd5b18cb174.png",
    imageAlt: "Embedded figure question with four answer figures",
    options: {
      A: "Figure (a)",
      B: "Figure (b)",
      C: "Figure (c)",
      D: "Figure (d)",
    },
    correctAnswer: "D",
  },
  {
    id: 17,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `In a certain code language, TABLE is coded as UBCMF and CHAIR is coded as DIBJS. How is PLANE coded in that language?`,
    options: { A: "QMBOD", B: "QMBOF", C: "QLBOF", D: "PMBOF" },
    correctAnswer: "B",
  },
  {
    id: 18,
    subject: "Mathematics",
    subjectShort: "Math",
    text: `Manick walked 40 m towards North, took a left turn and walked 20 m. He again took a left turn and walked 40 m. How far and in which direction is he from the starting point?`,
    options: {
      A: "20 m East",
      B: "40 m South",
      C: "20 m North",
      D: "None of these",
    },
    correctAnswer: "D",
  },

  // ── Section 3: Aptitude (7 questions) ──
  {
    id: 19,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `If COMPUTER is written as RETUPMOC, how will ALGORITHM be written in the same code?`,
    options: { A: "MHTIROGLA", B: "MHTIROGMLA", C: "MHTIROGALA", D: "MHTIRGOLA" },
    correctAnswer: "A",
  },
  {
    id: 20,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `Five students A, B, C, D, and E are standing in a row facing North.\n\n• B is to the immediate right of A.\n• C is to the immediate left of D.\n• E is at the extreme left of the row.\n• A is to the left of C.\n• A is not at either end.\n\nWho is standing in the middle?`,
    options: { A: "A", B: "B", C: "C", D: "D" },
    correctAnswer: "B",
  },
  {
    id: 21,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `In a school, codes used during physical exercise: '1' = start walking, '2' = keep standing, '3' = start running at the same spot, '4' = sit down.\n\nHow many times will a student sit down in this sequence?\n\n1 2 3 4 2 3 1 4 4 3 4 1 2 4 3 4 4 1 4`,
    options: { A: "5", B: "6", C: "7", D: "8" },
    correctAnswer: "D",
  },
  {
    id: 22,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `Find the missing number in the series:\n\n9324, 8392, 7553, 6798, ?`,
    options: { A: "6119", B: "6219", C: "6019", D: "6129" },
    correctAnswer: "A",
  },
  {
    id: 23,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `X was born on March 6, 1993. In that year, Independence Day (August 15) fell on a Sunday. On which day of the week was X born?`,
    options: { A: "Friday", B: "Saturday", C: "Sunday", D: "Monday" },
    correctAnswer: "B",
  },
  {
    id: 24,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `Find the next term in the sequence:\n\n1, 8, 27, 64, ?`,
    options: { A: "100", B: "121", C: "125", D: "144" },
    correctAnswer: "C",
  },
  {
    id: 25,
    subject: "Aptitude",
    subjectShort: "Aptitude",
    text: `Select the combination in which some or all figures overlap to form an equilateral triangle.\n\n[Note: This question has visual component figures (A), (B), (C), (D), (E). In the actual exam, refer to the diagrams provided.]\n\n• (A) A small right triangle\n• (B) A larger right triangle (mirror of A)\n• (C) A rhombus\n• (D) A right triangle of different size\n• (E) A small triangular wedge`,
    imageUrl: "https://res.cloudinary.com/aacgriet/image/upload/v1790408700/53457c3d-265f-4776-995d-7abcd0e8b403.png",
    imageAlt: "Five component figures for forming an equilateral triangle",
    options: { A: "ABC", B: "ACE", C: "BCD", D: "BDE" },
    correctAnswer: "D",
  },

  // ── Section 4: English (5 questions) ──
  {
    id: 26,
    subject: "English",
    subjectShort: "English",
    text: `Change the given sentence into direct speech:\n\nThe caretaker asked the girl if she hadn't been told not to come outside.`,
    options: {
      A: `The caretaker said to the girl, "Haven't you been telling not to come outside?"`,
      B: `The caretaker said to the girl, "Weren't you told not to come outside?"`,
      C: `The caretaker told the girl, "Did you not come outside?"`,
      D: `The caretaker asked the girl, "Why weren't you told not to come outside?"`,
    },
    correctAnswer: "B",
  },
  {
    id: 27,
    subject: "English",
    subjectShort: "English",
    text: `Complete the sentence with the appropriate question tag:\n\nYou cannot bring her with you because the vaccine is available to only those people who have completed 18 years of age, _______?`,
    options: { A: "can you?", B: "can't you?", C: "could you?", D: "will you?" },
    correctAnswer: "A",
  },
  {
    id: 28,
    subject: "English",
    subjectShort: "English",
    text: `Fill in the blank with the appropriate article:\n\nI recollect _______ Monday we met.`,
    options: { A: "a", B: "an", C: "the", D: "no article" },
    correctAnswer: "C",
  },
  {
    id: 29,
    subject: "English",
    subjectShort: "English",
    text: `Fill in the blanks with the appropriate articles:\n\nSandeep will take _______ bus from _______ next stop.`,
    options: { A: "the, a", B: "a, the", C: "a, a", D: "the, the" },
    correctAnswer: "B",
  },
  {
    id: 30,
    subject: "English",
    subjectShort: "English",
    text: `Fill in the blank with the correct preposition:\n\nOldman died _______ Pneumonia.`,
    options: { A: "from", B: "with", C: "of", D: "by" },
    correctAnswer: "C",
  },
];

// Answer key map: question ID → correct option key
export const ANSWER_KEY = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q.correctAnswer])
);

// Subject order for organizing display
export const SUBJECT_ORDER = ["Mathematics", "Aptitude", "English", "C Basics"];

export const SUBJECT_META = {
  Mathematics: { icon: "∑", color: "--s-accent-coral", badge: "student-badge-coral", short: "Math" },
  Aptitude: { icon: "◈", color: "--s-accent-teal", badge: "student-badge-teal", short: "Aptitude" },
  English: { icon: "Aa", color: "--s-accent-gold", badge: "student-badge-gold", short: "English" },
  "C Basics": { icon: "</>", color: "--s-accent-orange", badge: "student-badge-orange", short: "C" },
};
