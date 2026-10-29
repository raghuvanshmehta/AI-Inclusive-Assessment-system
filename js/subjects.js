/**
 * AI Inclusive Assessment System - Subject Catalog & Question Bank
 * Contains structured educational subjects, topic skills, and sample questions.
 * Clearly labeled as frontend sample educational content.
 */

const SUBJECTS_DATA = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    category: 'STEM',
    description: 'Master linear algebra, geometry calculations, arithmetic fractions, and foundational problem solving.',
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    topics: [
      {
        id: 'algebra',
        name: 'Linear Equations & Expressions',
        description: 'Single-variable equations, balancing terms, simplifying polynomials, and word problems.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'MATH-ALG-01'
      },
      {
        id: 'geometry',
        name: 'Perimeter, Area & Angles',
        description: 'Right triangles, Pythagorean theorem, polygon areas, and complementary angle relationships.',
        questionCount: 5,
        estimatedTimeMin: 12,
        skillCode: 'MATH-GEO-02'
      },
      {
        id: 'fractions',
        name: 'Fractions, Decimals & Percentages',
        description: 'Operations with rational numbers, lowest common denominators, and conversion methods.',
        questionCount: 5,
        estimatedTimeMin: 8,
        skillCode: 'MATH-FRAC-03'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    category: 'STEM',
    description: 'Explore fundamental principles of physical forces, energy conservation, cellular biology, and chemical reactions.',
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    topics: [
      {
        id: 'physics',
        name: 'Forces, Energy & Motion',
        description: 'Newtonian mechanics, kinetic vs potential energy, friction, and velocity calculations.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'SCI-PHYS-01'
      },
      {
        id: 'biology',
        name: 'Cell Structure & Living Systems',
        description: 'Plant and animal cell organelles, photosynthesis, cellular respiration, and DNA basics.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'SCI-BIO-02'
      },
      {
        id: 'chemistry',
        name: 'States of Matter & Elements',
        description: 'The periodic table, atomic structure, phase transitions, and chemical bonds.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'SCI-CHEM-03'
      }
    ]
  },
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    category: 'Humanities',
    description: 'Enhance critical reading comprehension, context clues, grammar conventions, and written analysis.',
    difficultyLevels: ['Easy', 'Medium'],
    topics: [
      {
        id: 'reading_comprehension',
        name: 'Inference and Main Idea',
        description: 'Extracting author intent, determining central themes, and identifying supporting evidence.',
        questionCount: 5,
        estimatedTimeMin: 12,
        skillCode: 'ENG-READ-01'
      },
      {
        id: 'grammar',
        name: 'Sentence Structure & Punctuation',
        description: 'Subject-verb agreement, clauses, apostrophe usage, and avoiding run-on sentences.',
        questionCount: 5,
        estimatedTimeMin: 8,
        skillCode: 'ENG-GRAM-02'
      },
      {
        id: 'vocabulary',
        name: 'Context Clues & Etymology',
        description: 'Deriving word meanings from prefixes, Latin roots, and surrounding sentence context.',
        questionCount: 5,
        estimatedTimeMin: 8,
        skillCode: 'ENG-VOC-03'
      }
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: '💻',
    category: 'Technology',
    description: 'Build algorithmic thinking, computational problem solving, data structure organization, and boolean logic.',
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    topics: [
      {
        id: 'algorithms',
        name: 'Sorting & Searching Basics',
        description: 'Binary search, bubble sort, algorithmic efficiency, and Big-O notation intuition.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'CS-ALGO-01'
      },
      {
        id: 'data_structures',
        name: 'Arrays, Stacks & Queues',
        description: 'Sequential memory allocation, LIFO vs FIFO access patterns, and push/pop operations.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'CS-DS-02'
      },
      {
        id: 'logic',
        name: 'Boolean Logic & Flow Control',
        description: 'Truth tables, AND/OR/NOT gates, conditional branching, and loop invariants.',
        questionCount: 5,
        estimatedTimeMin: 8,
        skillCode: 'CS-LOG-03'
      }
    ]
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    icon: '🌍',
    category: 'General',
    description: 'Deepen awareness of geography, global history, environmental stewardship, and modern inventions.',
    difficultyLevels: ['Easy', 'Medium'],
    topics: [
      {
        id: 'environment',
        name: 'Ecosystems & Sustainability',
        description: 'Biodiversity, carbon cycle, renewable resources, and conservation biology.',
        questionCount: 5,
        estimatedTimeMin: 8,
        skillCode: 'GK-ENV-01'
      },
      {
        id: 'world_history',
        name: 'Inventions & Historical Milestones',
        description: 'Key scientific inventions, printing press, industrial revolution, and world cultures.',
        questionCount: 5,
        estimatedTimeMin: 10,
        skillCode: 'GK-HIST-02'
      }
    ]
  }
];

// Rich question bank with clear explanations
const QUESTION_BANK = {
  'math-algebra': [
    {
      id: 'math-alg-01',
      question: 'Solve for x in the equation: 3x + 7 = 22',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Subtract 7 from both sides to isolate the term with x: 3x = 22 - 7 => 3x = 15. Then divide both sides by 3: x = 15 / 3 = 5.',
      demoSource: 'ASSISTments / Sample Algebra Item'
    },
    {
      id: 'math-alg-02',
      question: 'Which of the following expressions is equivalent to 2(4y - 3) + 5?',
      options: ['8y - 1', '8y + 2', '8y - 6', '6y + 2'],
      correctIndex: 0,
      difficulty: 'Easy',
      explanation: 'Distribute 2 across parentheses: 2 * 4y - 2 * 3 = 8y - 6. Then add 5: 8y - 6 + 5 = 8y - 1.',
      demoSource: 'ASSISTments / Sample Algebra Item'
    },
    {
      id: 'math-alg-03',
      question: 'If 5a - 4 = 2a + 11, what is the value of a?',
      options: ['a = 3', 'a = 4', 'a = 5', 'a = 6'],
      correctIndex: 2,
      difficulty: 'Medium',
      explanation: 'Subtract 2a from both sides: 3a - 4 = 11. Add 4 to both sides: 3a = 15. Divide by 3: a = 5.',
      demoSource: 'ASSISTments / Sample Algebra Item'
    },
    {
      id: 'math-alg-04',
      question: 'A car rental company charges $30 per day plus $0.15 per mile driven. If Carlos was charged $75 for a one-day rental, how many miles did he drive?',
      options: ['250 miles', '300 miles', '350 miles', '400 miles'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Set up the equation: 30 + 0.15m = 75. Subtract 30: 0.15m = 45. Divide by 0.15: m = 45 / 0.15 = 300 miles.',
      demoSource: 'ASSISTments / Sample Algebra Item'
    },
    {
      id: 'math-alg-05',
      question: 'What is the slope of the line represented by the equation 2y = 6x - 8?',
      options: ['6', '3', '2', '-4'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Convert to slope-intercept form (y = mx + b) by dividing all terms by 2: y = 3x - 4. The slope (m) is 3.',
      demoSource: 'ASSISTments / Sample Algebra Item'
    }
  ],
  'math-geometry': [
    {
      id: 'math-geo-01',
      question: 'In a right-angled triangle, the two perpendicular sides measure 6 cm and 8 cm. What is the length of the hypotenuse?',
      options: ['9 cm', '10 cm', '12 cm', '14 cm'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Use the Pythagorean theorem: a^2 + b^2 = c^2. Here 6^2 + 8^2 = 36 + 64 = 100. Thus c = sqrt(100) = 10 cm.',
      demoSource: 'ASSISTments / Sample Geometry Item'
    },
    {
      id: 'math-geo-02',
      question: 'What is the area of a rectangle with a length of 14 meters and a width of 5 meters?',
      options: ['19 sq meters', '38 sq meters', '70 sq meters', '90 sq meters'],
      correctIndex: 2,
      difficulty: 'Easy',
      explanation: 'Area = length * width = 14 * 5 = 70 square meters.',
      demoSource: 'ASSISTments / Sample Geometry Item'
    },
    {
      id: 'math-geo-03',
      question: 'Two angles are supplementary. If one angle measures 65 degrees, what is the measure of the second angle?',
      options: ['25 degrees', '115 degrees', '125 degrees', '180 degrees'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Supplementary angles sum to 180 degrees. Second angle = 180 - 65 = 115 degrees.',
      demoSource: 'ASSISTments / Sample Geometry Item'
    },
    {
      id: 'math-geo-04',
      question: 'What is the perimeter of a regular hexagon with each side measuring 7 cm?',
      options: ['35 cm', '42 cm', '49 cm', '56 cm'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'A regular hexagon has 6 equal sides. Perimeter = 6 * 7 = 42 cm.',
      demoSource: 'ASSISTments / Sample Geometry Item'
    },
    {
      id: 'math-geo-05',
      question: 'The circumference of a circle is 31.4 cm. Using pi = 3.14, what is the diameter of the circle?',
      options: ['5 cm', '10 cm', '15 cm', '20 cm'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Circumference = pi * diameter. Therefore, diameter = 31.4 / 3.14 = 10 cm.',
      demoSource: 'ASSISTments / Sample Geometry Item'
    }
  ],
  'math-fractions': [
    {
      id: 'math-frac-01',
      question: 'What is 3/4 + 2/5 in simplest fraction form?',
      options: ['5/9', '23/20', '15/20', '1 1/20'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Find common denominator (20): (3*5)/20 + (2*4)/20 = 15/20 + 8/20 = 23/20 (or 1 3/20).',
      demoSource: 'ASSISTments / Sample Fractions Item'
    },
    {
      id: 'math-frac-02',
      question: 'Convert 0.35 into a simplified fraction.',
      options: ['7/20', '35/10', '3/10', '7/50'],
      correctIndex: 0,
      difficulty: 'Easy',
      explanation: '0.35 = 35/100. Divide numerator and denominator by 5: 35/5 = 7 and 100/5 = 20, yielding 7/20.',
      demoSource: 'ASSISTments / Sample Fractions Item'
    },
    {
      id: 'math-frac-03',
      question: 'What is 40% of 150?',
      options: ['45', '60', '75', '80'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: '40% of 150 = 0.40 * 150 = 60.',
      demoSource: 'ASSISTments / Sample Fractions Item'
    },
    {
      id: 'math-frac-04',
      question: 'Simplify the multiplication: (2/3) * (9/10)',
      options: ['3/5', '18/30', '4/15', '5/8'],
      correctIndex: 0,
      difficulty: 'Easy',
      explanation: 'Multiply across: (2*9)/(3*10) = 18/30. Simplifying by dividing both by 6 yields 3/5.',
      demoSource: 'ASSISTments / Sample Fractions Item'
    },
    {
      id: 'math-frac-05',
      question: 'A jacket originally priced at $80 is discounted by 25%. What is the sale price?',
      options: [' $55', '$60', '$65', '$70'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Discount = 25% of 80 = $20. Sale price = 80 - 20 = $60.',
      demoSource: 'ASSISTments / Sample Fractions Item'
    }
  ],
  'science-physics': [
    {
      id: 'sci-phys-01',
      question: "According to Newton's First Law of Motion, an object at rest will remain at rest unless acted upon by what?",
      options: ['Constant velocity', 'An unbalanced external force', 'Balanced friction', 'A gravitational wave'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: "Newton's First Law (Law of Inertia) states that an object continues in its state of rest or uniform motion unless compelled to change by an net unbalanced external force.",
      demoSource: 'Sample Science Item'
    },
    {
      id: 'sci-phys-02',
      question: 'Which type of energy is stored in an object due to its height above the ground?',
      options: ['Kinetic energy', 'Gravitational potential energy', 'Thermal energy', 'Nuclear energy'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Gravitational potential energy depends on mass, gravitational acceleration, and elevation (PE = mgh).',
      demoSource: 'Sample Science Item'
    },
    {
      id: 'sci-phys-03',
      question: 'If a cyclist travels 60 meters in 5 seconds at constant speed, what is their speed?',
      options: ['10 m/s', '12 m/s', '15 m/s', '30 m/s'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Speed = Distance / Time = 60 m / 5 s = 12 m/s.',
      demoSource: 'Sample Science Item'
    },
    {
      id: 'sci-phys-04',
      question: 'Which of the following is an example of an electrical insulator?',
      options: ['Copper wire', 'Aluminum foil', 'Rubber sheath', 'Salt water'],
      correctIndex: 2,
      difficulty: 'Easy',
      explanation: 'Rubber does not easily allow electric charges to flow, making it a standard insulating material.',
      demoSource: 'Sample Science Item'
    },
    {
      id: 'sci-phys-05',
      question: 'What happens to the kinetic energy of an automobile when its speed doubles?',
      options: ['It remains identical', 'It doubles', 'It quadruples', 'It decreases by half'],
      correctIndex: 2,
      difficulty: 'Hard',
      explanation: 'Kinetic energy is proportional to the square of velocity (KE = 1/2 * m * v^2). If v is multiplied by 2, KE is multiplied by 2^2 = 4.',
      demoSource: 'Sample Science Item'
    }
  ],
  'cs-algorithms': [
    {
      id: 'cs-algo-01',
      question: 'What prerequisite condition must be met before performing a Binary Search on a list?',
      options: ['The list must contain only unique items', 'The list must be sorted in order', 'The list must contain an even count of elements', 'The list must be stored as a linked list'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Binary search repeatedly halves the search space by comparing the target with the median element, which requires the elements to be sorted.',
      demoSource: 'Sample Computer Science Item'
    },
    {
      id: 'cs-algo-02',
      question: 'What is the worst-case time complexity of standard Bubble Sort for an array of n items?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctIndex: 3,
      difficulty: 'Medium',
      explanation: 'In the worst case (reversed array), bubble sort compares and swaps each adjacent pair through n passes, taking O(n^2) time.',
      demoSource: 'Sample Computer Science Item'
    },
    {
      id: 'cs-algo-03',
      question: 'Which algorithmic approach solves a problem by breaking it into identical smaller subproblems, solving them, and combining results?',
      options: ['Divide and Conquer', 'Greedy Selection', 'Brute Force Iteration', 'Random Walk'],
      correctIndex: 0,
      difficulty: 'Medium',
      explanation: 'Divide and conquer (such as Merge Sort or Quick Sort) divides the input into subproblems, recurses, and merges.',
      demoSource: 'Sample Computer Science Item'
    },
    {
      id: 'cs-algo-04',
      question: 'What data structure operation order does a Stack follow?',
      options: ['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Random Access', 'Priority Queue order'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'A stack operates on LIFO (Last In, First Out), meaning the last element pushed is the first to be popped.',
      demoSource: 'Sample Computer Science Item'
    },
    {
      id: 'cs-algo-05',
      question: 'If an algorithm takes 8 operations for n=2, 16 for n=4, and 32 for n=8, its growth is most likely:',
      options: ['Constant O(1)', 'Linear O(n)', 'Logarithmic O(log n)', 'Quadratic O(n^2)'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Doubling n doubles the operations (8 -> 16 -> 32). This is a linear relationship: operations = 4 * n.',
      demoSource: 'Sample Computer Science Item'
    }
  ],
  'english-reading_comprehension': [
    {
      id: 'eng-read-01',
      question: 'Read the sentence: "Despite the relentless gale and frost, the research expedition forged ahead toward the glacier." What is the main meaning?',
      options: ['The team turned around due to cold weather', 'The team persevered despite severe weather obstacles', 'The glacier melted before they arrived', 'The gale stopped them completely'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'The word "Despite" indicates a contrast: even though there was severe weather, the team continued forward ("forged ahead").',
      demoSource: 'Sample English Item'
    },
    {
      id: 'eng-read-02',
      question: 'Which literary device is used in the phrase: "The autumn leaves danced across the windy lawn"?',
      options: ['Hyperbole', 'Personification', 'Metaphor', 'Onomatopoeia'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Personification gives human qualities (dancing) to non-human objects (leaves).',
      demoSource: 'Sample English Item'
    },
    {
      id: 'eng-read-03',
      question: 'What is the primary purpose of an expository paragraph?',
      options: ['To entertain with fictional narratives', 'To explain, inform, or describe a factual topic', 'To rhyme and evoke emotion', 'To advertise a commercial product'],
      correctIndex: 1,
      difficulty: 'Easy',
      explanation: 'Expository writing aims to inform, instruct, or clarify factual information clearly and objectively.',
      demoSource: 'Sample English Item'
    },
    {
      id: 'eng-read-04',
      question: 'Which transition word best signals a contrast between two ideas?',
      options: ['Furthermore', 'Consequently', 'Conversely', 'Similarly'],
      correctIndex: 2,
      difficulty: 'Medium',
      explanation: '"Conversely" signals an opposite or contrasting perspective, unlike "furthermore" or "similarly" which indicate addition.',
      demoSource: 'Sample English Item'
    },
    {
      id: 'eng-read-05',
      question: 'Identify the tone of this passage: "With patient brushstrokes and relentless dedication, the conservator restored each delicate flake of the ancient canvas."',
      options: ['Cynical and dismissive', 'Reverent and admiring', 'Humorous and playful', 'Indifferent and detached'],
      correctIndex: 1,
      difficulty: 'Medium',
      explanation: 'Phrases like "patient brushstrokes," "relentless dedication," and "delicate flake" convey respect, admiration, and care.',
      demoSource: 'Sample English Item'
    }
  ]
};

class SubjectsManager {
  constructor() {
    this.subjects = SUBJECTS_DATA;
    this.questions = QUESTION_BANK;
  }

  getAllSubjects() {
    return this.subjects;
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id) || null;
  }

  getTopicsBySubject(subjectId) {
    const subject = this.getSubjectById(subjectId);
    return subject ? subject.topics : [];
  }

  getTopicById(subjectId, topicId) {
    const topics = this.getTopicsBySubject(subjectId);
    return topics.find(t => t.id === topicId) || null;
  }

  getQuestions(subjectId, topicId, count = 5) {
    const key = `${subjectId}-${topicId}`;
    let list = this.questions[key];
    
    // Fallback if specific topic bank not explicitly keyed
    if (!list || list.length === 0) {
      list = this.questions['math-algebra'];
    }

    const availableCount = Math.min(count, list.length);
    // Return a shallow copy of up to count items
    return list.slice(0, availableCount);
  }
}

// Global singleton instance
window.subjectsManager = new SubjectsManager();
