# 🩺 Master Swarm Orchestration Prompt: Authentic NEET-UG Question Generation & Architecture

> **Directive**: You are an elite medical entrance curriculum architect and senior NEET-UG question setter (ex-NTA expert panelist & senior academic faculty from Allen Kota, Aakash Institute, and Sri Chaitanya).
> **Objective**: Generate authentic, rigorous, high-cognitive-depth NEET-UG questions evenly distributed across Physics, Chemistry, Botany, and Zoology in strict alignment with the updated National Medical Commission (NMC) rationalized syllabus, verified via Gatekeeper quality checks, and compiled into the master database.

---

## 0. Project Background & Core Business Objective: Offline High-Yield Engine

### The Core Problem CrackNEET Solves:
1. **The Cost Crisis**: Querying real-time LLM APIs (e.g., DeepSeek/GPT-4) for every single practice question burns excessive API credits and drives operating costs unsustainably high.
2. **The Dual-Track Architecture**:
   * **Live Adaptive Assessments**: Dynamic API generation for full-length 200-minute timed mock tests.
   * **Daily Practice Engine (Zero-Cost Offline Core)**: Served 100% offline at **ZERO API COST** from pre-seeded PostgreSQL databases containing thousands of pre-verified, high-yield questions.
3. **The Non-Negotiable Quality Standard**:
   * NEET is won or lost on **precision, time stamina, and active discrimination of NCERT statements**.
   * If questions degrade into trivial kindergarten recall (*"Which organelle is the powerhouse of the cell?"* or *$v = u + at$ with direct 1-step division*), students immediately lose trust in the platform.
   * Every question must be authentic, medically and scientifically rigorous, with carefully engineered distractors modeling real student traps.

---

## 1. Deep Research & Empirical Analysis of NEET (2024–2026 Reality)

### 1.1 The Exam Structure & Format
- **Mode of Examination**: Pen-and-Paper (OMR sheet based), conducted in 13 languages across India and international centers.
- **Duration**: 3 Hours (180 minutes) [in transitional years 3 Hours 20 Minutes (200 minutes)].
- **Question Volume**:
  - **Standard NMC Pattern**: **180 Compulsory MCQs** (45 Physics, 45 Chemistry, 45 Botany, 45 Zoology). Total Marks: **720**.
  - **Transitional Optional Pattern (Section A & B)**: 200 Questions total (Section A: 35 mandatory, Section B: 15 with attempt any 10 per subject).
- **Marking Scheme**:
  - Correct Answer: **+4 Marks**
  - Incorrect Answer: **-1 Mark** (Negative marking)
  - Unattempted / Blank: **0 Marks**
- **Weightage Distribution**:
  - **Biology (Botany + Zoology)**: 90 Questions / **360 Marks (50% of the entire exam)**.
  - **Physics**: 45 Questions / **180 Marks (25%)**.
  - **Chemistry**: 45 Questions / **180 Marks (25%)**.

### 1.2 Cut-Off Analysis & Competitive Realities
Understanding the marks distribution is crucial for calibrating difficulty:
- **Baseline Qualifying Cut-Off (NTA Eligibility - 50th Percentile UR, 40th Percentile Reserved)**:
  - **NEET 2024**: General/EWS: **164 – 720**, OBC/SC/ST: **129 – 163** (Marks inflation year with 67 candidates scoring 720/720).
  - **NEET 2025**: General/EWS: **144 – 686**, OBC/SC/ST: **113 – 143**.
  - **NEET 2026 Target**: General/EWS: **~140 – 165**, OBC/SC/ST: **~115 – 140**.
- **Actual Admission Cut-Off for Government Medical Colleges (MBBS via 15% All India Quota - AIQ)**:
  - **General (UR) / EWS**: Closing score ~**650 – 655+** (AIR ~24,000 – 25,500). Top institutes (AIIMS Delhi, MAMC, VMMC, JIPMER, KGMU) close between **685 and 720**.
  - **OBC**: Closing score ~**650 – 652+** (virtually identical to General).
  - **SC**: Closing score ~**540 – 555+** (AIR ~135,000).
  - **ST**: Closing score ~**515 – 530+** (AIR ~165,000).
- **Takeaway for Question Design**: Because top students score between 650 and 715+, the difference maker in NEET is **error traps** (distractors) and **speed under cognitive load**, not Olympiad-level math.

### 1.3 Post-2024 Exam Reforms & Security Architecture
Following the 2024 high-level review committee (headed by Dr. K. Radhakrishnan):
- Strict biometric and multi-stage facial verification.
- Tamper-evident digital tracking of question papers and OMR sheets.
- Zero tolerance for ambiguous questions: Questions with dual interpretations or contradictory textbook wording are eliminated. Every question must have an unequivocal, defensible correct answer.

---

## 2. Updated NMC Rationalized Syllabus Blueprint

All question setters and subagents **MUST strictly adhere** to the NMC rationalized curriculum. Do NOT generate questions from deleted chapters or trimmed subtopics.

### 2.1 Physics Syllabus
* **Class 11**: Physics & Measurement, Kinematics, Laws of Motion, Work Energy & Power, Rotational Motion, Gravitation, Properties of Bulk Matter (Solids, Fluids, Thermal Properties), Thermodynamics (excluding heat engines & refrigerators), Kinetic Theory of Gases, Oscillations & Waves (excluding Doppler effect).
* **Class 12**: Electrostatics, Current Electricity, Magnetic Effects of Current & Magnetism (excluding Earth magnetism & magnetic materials), Electromagnetic Induction & Alternating Currents, Electromagnetic Waves, Optics (Ray & Wave; excluding resolving power, scattering, Brewster's angle), Dual Nature of Matter & Radiation, Atoms & Nuclei, Semiconductor Electronics (excluding transistors and logic gates).
* **Experimental Skills (Added/Highlighted)**: Vernier callipers, screw gauge, simple pendulum, meter bridge, resonance tube, surface tension by capillary rise, coefficient of viscosity, Young's modulus, focal length of spherical mirrors/lenses using $u$-$v$ plots, diode characteristics.

### 2.2 Chemistry Syllabus
* **Physical Chemistry**: Some Basic Concepts of Chemistry, Atomic Structure, Chemical Thermodynamics, Chemical & Ionic Equilibrium, Redox Reactions, Solutions, Electrochemistry, Chemical Kinetics.
* **Inorganic Chemistry**: Classification of Elements & Periodicity, Chemical Bonding & Molecular Structure, p-Block Elements (Groups 13 to 18 general trends & representative chemistry), d- and f-Block Elements, Coordination Compounds.
* **Organic Chemistry**: Organic Chemistry: Some Basic Principles & Techniques, Hydrocarbons, Haloalkanes & Haloarenes, Alcohols, Phenols & Ethers, Aldehydes, Ketones & Carboxylic Acids, Amines (Organic Compounds Containing Nitrogen), Biomolecules.
* **Practical Chemistry (Added/Highlighted)**: Detection of extra elements (N, S, halogens), functional group identification, titrations (Mohr's salt, oxalic acid vs $\text{KMnO}_4$), qualitative inorganic salt analysis (cation/anion identification).
* **BANNED DELETED CHAPTERS**: States of Matter, Solid State, Surface Chemistry, Hydrogen, s-Block Elements, General Principles of Metallurgy, Polymers, Chemistry in Everyday Life, Environmental Chemistry.

### 2.3 Botany Syllabus
* **Class 11**: The Living World, Biological Classification, Plant Kingdom, Morphology of Flowering Plants (including family floral formulas & diagrams: Malvaceae, Brassicaceae/Cruciferae, Fabaceae/Leguminosae, Asteraceae/Compositae, Poaceae/Gramineae), Anatomy of Flowering Plants, Cell: The Unit of Life, Biomolecules, Cell Cycle & Cell Division, Photosynthesis in Higher Plants, Respiration in Plants, Plant Growth & Development.
* **Class 12**: Sexual Reproduction in Flowering Plants, Principles of Inheritance & Variation, Molecular Basis of Inheritance, Biotechnology: Principles & Processes, Biotechnology & its Applications, Organisms & Populations, Ecosystem, Biodiversity & Conservation.
* **BANNED DELETED TOPICS**: Transport in Plants, Mineral Nutrition, Plant Succession, Strategies for Enhancement in Food Production (plant breeding portions).

### 2.4 Zoology Syllabus
* **Class 11**: Animal Kingdom (non-chordates and chordates), Structural Organisation in Animals (Animal Tissues, Morphology & Anatomy of Frog and Cockroach), Breathing & Exchange of Gases, Body Fluids & Circulation, Excretory Products & their Elimination, Locomotion & Movement, Neural Control & Coordination (excluding detailed ear & eye histology), Chemical Coordination & Integration.
* **Class 12**: Human Reproduction, Reproductive Health, Evolution, Human Health & Disease.
* **BANNED DELETED TOPICS**: Digestion & Absorption, Reproduction in Organisms (intro chapter), Environmental Issues.

---

## 3. The 5 Core NEET Question Archetypes

NEET questions are not simple recall; they are structured into distinct cognitive archetypes:

### Archetype 1: Statement I and Statement II
Two statements are presented. The student evaluates the truth value of each independently.
```text
Given below are two statements:
Statement I: In C4 plants, photorespiration does not occur because they have a mechanism that increases the concentration of CO2 at the enzyme site.
Statement II: RuBisCO functions purely as an oxygenase in bundle sheath cells of C4 plants.
In the light of the above statements, choose the correct answer:
A) Both Statement I and Statement II are correct.
B) Both Statement I and Statement II are incorrect.
C) Statement I is correct but Statement II is incorrect.
D) Statement I is incorrect but Statement II is correct.
```

### Archetype 2: Assertion and Reason (A&R)
An Assertion (A) and a Reason (R) are provided. Requires testing independent veracity AND whether R is the causal mechanism of A.
```text
Assertion (A): Secondary growth does not occur in monocotyledonous stems.
Reason (R): Vascular bundles in monocotyledonous stems are conjoint, collateral, and closed, lacking an intrafascicular cambium.
A) Both A and R are true and R is the correct explanation of A.
B) Both A and R are true but R is NOT the correct explanation of A.
C) A is true but R is false.
D) A is false but R is true.
```

### Archetype 3: Match the Column (List I to List II)
Pairing items across two lists (e.g., cell organelles with functions, hormones with disorders, reagents with reactions, physical quantities with dimensional formulas). Engineered so simple 1-pair elimination is not trivial.

### Archetype 4: Multi-Statement Evaluation ("How many / Which of the following")
Presents 4 to 5 statements labeled (a), (b), (c), (d), (e). Asks:
- *"Which of the above statements are correct / incorrect?"* (Options: (a) and (c) only; (b), (c) and (d) only; etc.)
- *"How many of the above statements are correct?"* (Options: Only one, Only two, Only three, All four).

### Archetype 5: Rapid Multi-Step Numericals & Graphical Interpretations
For Physics and Physical Chemistry:
- Calculation must be solvable within **60 to 90 seconds** without a calculator.
- Numbers must be clean ($g = 10\text{ m/s}^2$ or $9.8\text{ m/s}^2$, $R = 8.314\text{ J/mol}\cdot\text{K}$ or $0.0821\text{ L}\cdot\text{atm/mol}\cdot\text{K}$, $h = 6.63 \times 10^{-34}\text{ J}\cdot\text{s}$, $e = 1.6 \times 10^{-19}\text{ C}$).
- Requires combining 2 linked concepts (e.g., De Broglie wavelength + photoelectric stopping potential, or buffer equation + solubility product).

---

## 4. Good vs. Bad Showcases (Zero-Kindergarten Guarantee)

### 🌿 Botany Showcase

#### ❌ BAD (Trivial 1-Second Rote Recall — REJECTED)
```json
{
  "questionText": "Which cell organelle is known as the powerhouse of the cell?",
  "options": ["A) Mitochondria", "B) Chloroplast", "C) Ribosome", "D) Golgi apparatus"],
  "answer": "A",
  "explanation": "Mitochondria produce ATP, so they are the powerhouse of the cell."
}
```
*Why it fails*: Zero cognitive depth. 5th-grade general science trivia.

#### ✅ GOOD (Authentic NEET Multi-Statement NCERT Discrimination)
```json
{
  "id": "neet_bot_cell_012",
  "subject": "Botany",
  "topic": "Cell: The Unit of Life",
  "difficulty": "intermediate",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "Given below are four statements regarding the structure and function of cell organelles:\n(a) The inner mitochondrial membrane is folded into cristae to increase surface area for ATP synthesis complexes.\n(b) Ribosomes of chloroplasts are 80S, identical to cytoplasmic ribosomes.\n(c) The cis and trans faces of the Golgi apparatus are entirely interconnected and identical in composition.\n(d) Peroxisomes and glyoxysomes are part of the endomembrane system.\nWhich of the following statement(s) is/are INCORRECT?",
  "options": [
    "A) (a) only",
    "B) (b), (c), and (d) only",
    "C) (b) and (c) only",
    "D) (a) and (d) only"
  ],
  "answer": "B",
  "explanation": "Statement (a) is correct: cristae in the inner mitochondrial membrane increase the surface area for electron transport chain complexes. Statement (b) is incorrect: chloroplast ribosomes are 70S (smaller, prokaryotic type), whereas cytoplasmic ribosomes of eukaryotes are 80S. Statement (c) is incorrect: the cis (forming) and trans (maturing) faces of the Golgi apparatus are entirely different in biochemical composition and polarity, though interconnected. Statement (d) is incorrect: the endomembrane system includes ER, Golgi apparatus, lysosomes, and vacuoles; peroxisomes, chloroplasts, and mitochondria are NOT part of the endomembrane system because their functions are not coordinated with these organelles. Thus, statements (b), (c), and (d) are incorrect. Option B is correct."
}
```

---

### 🧬 Zoology Showcase

#### ❌ BAD (Direct Definition Checking — REJECTED)
```json
{
  "questionText": "What is the structural and functional unit of the human kidney?",
  "options": ["A) Nephron", "B) Neuron", "C) Alveoli", "D) Glomerulus"],
  "answer": "A",
  "explanation": "Nephron is the basic functional unit of kidney."
}
```

#### ✅ GOOD (Authentic NEET Assertion-Reason Physiological Feedback)
```json
{
  "id": "neet_zoo_excr_018",
  "subject": "Zoology",
  "topic": "Excretory Products and their Elimination",
  "difficulty": "advanced",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): An excessive loss of body fluid activates osmoreceptors which stimulate the neurohypophysis to release Antidiuretic Hormone (ADH).\nReason (R): ADH facilitates water reabsorption from the distal parts of the tubule, thereby preventing diuresis and producing a hypertonic urine.\nIn the light of the above statements, choose the correct option:",
  "options": [
    "A) Both (A) and (R) are true and (R) is the correct explanation of (A).",
    "B) Both (A) and (R) are true but (R) is NOT the correct explanation of (A).",
    "C) (A) is true but (R) is false.",
    "D) (A) is false but (R) is true."
  ],
  "answer": "B",
  "explanation": "Step 1: Check Assertion (A): Osmoreceptors in the hypothalamus are activated by changes in blood volume, body fluid volume, and ionic concentration. An excessive loss of fluid from the body stimulates these osmoreceptors, which induce the release of ADH (vasopressin) from the neurohypophysis (posterior pituitary). Thus, (A) is factually true. Step 2: Check Reason (R): ADH acts on the distal convoluted tubule (DCT) and collecting duct to facilitate water reabsorption, conserving body water and preventing excessive urination (diuresis). Thus, (R) is also factually true. Step 3: Evaluate causal link: Reason (R) describes the physiological action and outcome of ADH on the renal tubules, but does NOT explain *how or why* the osmoreceptors are triggered by volume depletion in the assertion. Therefore, both (A) and (R) are true, but (R) is NOT the correct explanation of (A). Option B is correct."
}
```

---

### ⚛️ Physics Showcase

#### ❌ BAD (Single-Formula 4th-Grade Arithmetic — REJECTED)
```json
{
  "questionText": "A force of 10 N acts on a body of mass 2 kg. Find its acceleration.",
  "options": ["A) 5 m/s^2", "B) 20 m/s^2", "C) 2 m/s^2", "D) 0.2 m/s^2"],
  "answer": "A",
  "explanation": "a = F/m = 10/2 = 5 m/s^2."
}
```

#### ✅ GOOD (Authentic NEET Multi-Step Circuit with Internal Resistance & Power)
```json
{
  "id": "neet_phy_curr_024",
  "subject": "Physics",
  "topic": "Current Electricity",
  "difficulty": "intermediate",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "A storage battery of emf $\\mathcal{E} = 12\\text{ V}$ and internal resistance $r = 1.5\\;\\Omega$ is being charged by a $120\\text{ V}$ DC supply using a series ballast resistor $R = 22.5\\;\\Omega$. What is the terminal voltage across the storage battery during charging?",
  "options": [
    "A) $11.5\\text{ V}$",
    "B) $18.75\\text{ V}$",
    "C) $12.0\\text{ V}$",
    "D) $15.25\\text{ V}$"
  ],
  "answer": "B",
  "explanation": "Step 1: Determine net emf driving charging current into the battery. The external DC source opposes the battery emf: $\\mathcal{E}_{\\text{net}} = V_{\\text{supply}} - \\mathcal{E}_{\\text{battery}} = 120 - 12 = 108\\text{ V}$. Step 2: Calculate charging current $I$ through total loop resistance: $R_{\\text{total}} = R + r = 22.5 + 1.5 = 24.0\\;\\Omega$. Current $I = \\frac{\\mathcal{E}_{\\text{net}}}{R_{\\text{total}}} = \\frac{108}{24} = 4.5\\text{ A}$. Step 3: During charging, current flows *into* the positive terminal of the battery. The terminal potential difference $V$ across a battery being charged is: $V = \\mathcal{E} + I r$. Step 4: Substitute the values: $V = 12 + (4.5)(1.5) = 12 + 6.75 = 18.75\\text{ V}$. Distractor A results from using the discharging formula $V = \\mathcal{E} - I r$. Distractor C assumes terminal voltage equals emf. Option B is correct."
}
```

---

### 🧪 Chemistry Showcase

#### ❌ BAD (One-Line Periodic Memorization — REJECTED)
```json
{
  "questionText": "Which gas is evolved when zinc reacts with dilute sulfuric acid?",
  "options": ["A) Hydrogen", "B) Oxygen", "C) Nitrogen", "D) Chlorine"],
  "answer": "A",
  "explanation": "Zn + H2SO4 -> ZnSO4 + H2."
}
```

#### ✅ GOOD (Authentic NEET Organic Multi-Step Reaction with Reagent Stereospecificity)
```json
{
  "id": "neet_chem_org_031",
  "subject": "Chemistry",
  "topic": "Hydrocarbons",
  "difficulty": "advanced",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "An alkyne $X$ (molecular formula $\\text{C}_4\\text{H}_6$) reacts with dilute $\\text{H}_2\\text{SO}_4$ in the presence of $\\text{HgSO}_4$ at $333\\text{ K}$ to yield a compound $Y$. Compound $Y$ gives a positive iodoform test and does not reduce Tollens' reagent. When $X$ is treated with sodium in liquid ammonia (Birch reduction conditions), it does not yield a gas, but when treated with ammoniacal cuprous chloride, it forms no precipitate. The compound $X$ is:",
  "options": [
    "A) But-1-yne",
    "B) But-2-yne",
    "C) Buta-1,3-diene",
    "D) Cyclobutene"
  ],
  "answer": "B",
  "explanation": "Step 1: Molecular formula $\\text{C}_4\\text{H}_6$ indicates a degree of unsaturation of $4 - (6/2) + 1 = 2$, which corresponds to an alkyne, alkadiene, or cycloalkene. Step 2: Hydration with dilute $\\text{H}_2\\text{SO}_4/\\text{HgSO}_4$ (Kucherov reaction) is characteristic of alkynes. Hydration of But-1-yne gives butan-2-one (methyl ketone) via Markovnikov enol tautomerization. Hydration of But-2-yne also yields butan-2-one. Step 3: Compound $Y$ is butan-2-one ($\\text{CH}_3\\text{COCH}_2\\text{CH}_3$). Since it contains a $\\text{CH}_3\\text{C=O}$ group, it gives a positive iodoform test (yellow precipitate of $\\text{CHI}_3$) and, being a ketone, does not reduce Tollens' reagent. Step 4: The critical discrimination: Ammoniacal cuprous chloride ($\\text{Cu}_2\\text{Cl}_2 + \\text{NH}_4\\text{OH}$) forms a red precipitate of copper acetylide with *terminal alkynes* having acidic terminal $\\equiv\\text{C}-\\text{H}$ bonds. Since $X$ forms *no precipitate*, $X$ is an internal alkyne, NOT a terminal alkyne. This rules out But-1-yne (Option A). But-2-yne ($\text{CH}_3-\\text{C}\\equiv\\text{C}-\\text{CH}_3$) is an internal alkyne. Option B is correct."
}
```

---

## 5. Cognitive Depth Spectrum for NEET

Every question must be categorized into one of three difficulty tiers:

| Tier | Distribution Target | Cognitive Demand | Target Characteristics |
| :--- | :--- | :--- | :--- |
| **Beginner** | ~33% | Precise NCERT conceptual application | Tests accurate line-by-line understanding, dimensional reasoning, or standard 2-step calculations. Never single-word trivia. |
| **Intermediate** | ~34% | Multi-step analytical deduction | Assertion-Reason with subtle causal distractors, Statement I/II pairs, Match the Column with 4-5 pairs, or graphical slope/intercept checks. |
| **Advanced** | ~33% | Cross-concept integration under time limit | Integrates 2 distinct topics (e.g., Mendelian genetics + mathematical probability, Equilibrium + Electrochemistry, Mechanics + Thermodynamics) solvable in 90s. |

---

## 6. Micro-Chunk Specification & Execution Protocol

### 6.1 Chunk Size & File Naming
- Each topic chunk contains exactly **32 questions**.
- Distribution per 32-question chunk:
  - **10 Beginner Questions**
  - **10 Intermediate Questions**
  - **12 Advanced Questions**
- File naming pattern:
  - `data/neet/<subject>/<topic_snake_case>_chunk_01.json`
  - Example: `data/neet/botany/cell_the_unit_of_life_chunk_01.json`

### 6.2 The Modular 3-Part Script Protocol (Mandatory for Subagents)
To completely prevent Cloud Code Server-Sent Event (SSE) dropouts, output token cutoffs, and stream EOF errors, subagents must NEVER attempt to stream all 32 detailed questions in a single response.

Instead, subagents must write:
1. `scratch/part1_beg.js`: Defines array of 10 Beginner questions.
2. `scratch/part2_int.js`: Defines array of 10 Intermediate questions.
3. `scratch/part3_adv.js`: Defines array of 12 Advanced questions.
4. `scratch/assemble.js`: Imports parts 1, 2, 3, concatenates into 32 questions, writes the target JSON, and triggers the Gatekeeper audit.

### 6.3 Standard Question JSON Schema
```json
{
  "id": "neet_bot_cell_c01_001",
  "subject": "Botany",
  "topic": "Cell: The Unit of Life",
  "subtopic": "Mitochondria and Chloroplast Ultrastructure",
  "difficulty": "intermediate",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "Question stem here with complete mathematical and chemical notation in standard KaTeX delimiters like $...$ or $$...$$.",
  "options": [
    "A) First option text",
    "B) Second option text",
    "C) Third option text",
    "D) Fourth option text"
  ],
  "answer": "A",
  "explanation": "Step 1: Direct derivation and physiological logic. Step 2: Identification of why options B, C, and D are incorrect with specific distractor analysis."
}
```

---

## 7. Gatekeeper Validation & Strict Hard Rejection Rules

Any question violating the following rules will be rejected by the Gatekeeper auditor:
1. **Zero-NCERT-Trivia Violation**: Any direct 1-step definition check without application or discrimination is purged.
2. **Formula-Plug Violation**: Any Physics question requiring only a 1-step calculator plug-in (e.g., $F = ma$, $P = W/t$) is purged.
3. **KaTeX Delimiter Rule**: All math symbols, equations, units, chemical formulas, and variables must be enclosed in valid KaTeX (`$...$` or `$$...$$`). Unclosed or mismatched braces (`{` without `}`) cause instant rejection.
4. **Distractor Distribution Balance**: Across any 32-question chunk, correct answers must be evenly distributed across A, B, C, and D (no single letter exceeding 35%).
5. **Content-Identified Distractors**: Explanations must explain the error represented by each distractor (e.g., *"Option B represents forgetting that chloroplast ribosomes are 70S"*), never merely stating *"Option B is wrong"*.

---

## 8. Autonomous Self-Resuming Subagent Launching Protocol

When launching a subagent swarm to author NEET questions, invoke subagents using the standardized template below.

### Standard Subagent Prompt Template:
```text
Generate an authentic, high-cognitive-depth micro-chunk of 32 NEET-UG questions for:
Subject: <Subject: Physics | Chemistry | Botany | Zoology>
Topic: <Exact Official Topic Name>
Target File: <Absolute Path to data/neet/<subject>/<topic_snake_case>_chunk_01.json>

Execution Protocol (Mandatory):
- MUST write in 3 modular parts in scratch/:
  1. part1_beg.js (10 Beginner Qs: NCERT line discrimination, 2-step calculations)
  2. part2_int.js (10 Intermediate Qs: Assertion-Reason, Statement I & II, Match the Column)
  3. part3_adv.js (12 Advanced Qs: Multi-concept integration, multi-statement evaluation). Cognitive depth >= 6.8
- Assemble via assemble.js and audit with gatekeeper until 0 failures.
- Adhere strictly to the NMC revised syllabus (no deleted topics).
```

This prompt file is permanent and self-contained. Any agent reading this document has the full context, syllabus constraints, cognitive rubrics, and execution protocols required to generate authentic NEET-UG questions.
