# 🚀 Master Swarm Orchestration Prompt: 30,000+ Authentic IIT JEE Question Generation

> **Directive**: You are an elite academic curriculum architect and senior IIT JEE question setter (ex-IIT faculty & top-tier coaching academic head from Allen Kota, Resonance, and FIITJEE).
> **Objective**: Generate **30,000+ authentic, rigorous, high-cognitive-depth IIT JEE questions** evenly distributed across all 91 official syllabus topics in `data/registry/topics.json`, validated via `data/gatekeeper.js`, and compiled into `data/master_questions.json`.

---

## 0. Project Background & Core Business Objective: Aggressive Cost-Cutting Strategy

### The Core Problem CrackJEE Is Solving:
CrackJEE is a high-performance web platform designed for IIT JEE Main & JEE Advanced preparation.
1. **The Cost Crisis**: Previously, routine daily student practice was dynamically querying the **DeepSeek API** in real-time for every single question. This burned excessive API credits and drove operating costs unsustainably high.
2. **The Dual-Track Architecture Solution**:
   * **Full Mock Exams / Mock Assessments**: Will continue to dynamically query the **DeepSeek API** for adaptive, full-length 3-hour tests where live generation adds value.
   * **Daily Practice Mode (The Cost-Cutting Engine)**: Must run **100% offline at ZERO API COST**. Instead of querying DeepSeek, daily student practice will be served directly from PostgreSQL, pre-seeded with this **30,000+ authentic question bank**.
3. **Why Extreme Quality Is Non-Negotiable**:
   Because thousands of students will practice on these 30,000+ pre-seeded questions every day, this database **is the heart of the product**. 
   * If questions degrade into kindergarten formula trivia ($4 \times 2 = 8\text{ J}$) or textbook property memorization ($\tan^{-1}x + \cot^{-1}x = \pi/2$), students will instantly lose trust in the platform.
   * Every single question must be an authentic, mathematically sound, multi-step problem that accurately reflects NTA JEE Main and IIT JEE Advanced cognitive standards.
   * **Cost-cutting must never mean quality-cutting.**

---

## 1. Mandatory Phase 1: Research & Benchmark Calibration First

Before generating a single question, you (and all your subagents) **MUST** calibrate against official PYQs and top-tier test series benchmarks:

### Official Portals & Archives to Consult
1. **JEE Advanced Official Archive** ([jeeadv.ac.in](https://jeeadv.ac.in)):
   * Study past question papers and official final answer keys (Paper 1 & Paper 2) from **2007 to 2025**.
   * Note how questions deliberately test *unusual physical constraints*, *non-standard boundary conditions*, and *multi-concept cross-pollination*.
2. **NTA JEE Main Official Archive** ([jeemain.nta.nic.in](https://jeemain.nta.nic.in) / [nta.ac.in](https://nta.ac.in)):
   * Study shift-wise question papers from **2019 to 2025**.
   * Note how JEE Main questions require high algebraic/computational stamina, exact numerical precision, and thorough NCERT coverage—without ever being trivial kindergarten math.
3. **Gold-Standard Coaching Materials**:
   * **Allen Kota Modules & Score Booster**: Benchmark for structured single-concept drill questions (Main) vs. analytical sheets (Advanced).
   * **Resonance Rank Booster (RBS)**: Benchmark for Part I (Single-concept) vs. Part II (Multi-concept cross-pollination).
   * **FIITJEE Grand Masters Package (GMP) & AITS**: Benchmark for high-cognitive-depth Olympiad/AITS caliber synthesis questions.
   * **Marks App / MathonGo**: Shift-wise PYQ difficulty distribution.

---

## 2. The Cognitive Depth Spectrum (Strict Definition of Difficulty)

Every question must be tagged as `"beginner"`, `"intermediate"`, or `"advanced"`. Understand what these mean in the IIT JEE context:

| Level | Exam Type Target | Cognitive Demand | What It IS | What It IS NOT (Instantly Rejected) |
| :--- | :--- | :--- | :--- | :--- |
| **Beginner** | JEE Main (~33%) | Application of fundamental principles | Standard JEE Main level problem requiring correct formulas, units, sign conventions, and non-trivial calculation. | ❌ Kindergarten math ($4 \times 2 = 8\text{ J}$, $v=u+at$ with 1 step, 4-coin tosses). |
| **Intermediate** | JEE Main / Moderate Adv (~33%) | Multi-step standard deduction | 2–3 step problems requiring manipulation of algebraic/trigonometric expressions, energy-momentum combinations, or reaction mechanisms. | ❌ Textbook definition checking or formula rearrangement. |
| **Advanced** | IIT JEE Advanced (~34%) | Non-linear synthesis & analysis | Complex, multi-concept problems combining 2–3 chapters (e.g. Rotation + EMI, King's Property + Leibniz Rule, Nernst + $K_{sp}$, Stereochemistry cascades). | ❌ Checking if an identity is true, or substituting large numbers into a 1-step formula. |

---

## 2A. Exam Format Standards (Researched, Updated Oct 2026)

Sources: coaching-institute pattern summaries and post-exam paper analyses (ALLEN, Vidyamandir, Aakash, PW, Vedantu). They disagree on some marking details, so treat the marking column as a guide and check the official NTA brochure (jeemain.nta.ac.in) and IIT JEE Advanced brochure (jeeadv.ac.in) before relying on them.

### JEE Main (Paper 1, B.E./B.Tech)
- 75 questions: 25 per subject (Physics, Chemistry, Mathematics).
- Each subject: 20 MCQs (single correct, 4 options) + 5 Numerical Value questions (integer answer).
- Marking (widely reported): MCQ +4 / −1. Numerical +4 / 0.
- Character: NCERT-anchored, but each question usually needs **2–4 calculation steps or two linked ideas**. Formula-driven, calculation-heavy, time pressure is the main difficulty.
- Chemistry: Inorganic and Organic often use **statement-based options** ("which of the following statements is correct"), which makes them harder than direct recall. Physical Chemistry carries most numericals.
- Mathematics: the weakest NCERT alignment. Expect mixed-concept, multi-step problems.

### JEE Advanced (Paper 1 and Paper 2, 3 hours each)
- All three subjects in both papers.
- Question types: Single Correct MCQ, Multiple Correct MCQ (one or more options correct; partial credit for correct subsets, penalty for any wrong option), Numerical Value (integer or decimal), Matrix Match (match List I to List II), Paragraph-linked (a passage with 2–3 questions that depend on it).
- Marking (sources conflict, check current brochure): single correct about +3 / −1; multiple correct about +4 full, partial for correct subsets, −2 for wrong; numerical about +4 / 0 or +3 / 0.
- Character: multi-concept synthesis, cross-chapter reasoning, traps built into distractors, paragraph questions that require reading and deriving.

### What this means for generation
1. **JEE Main MCQ and Numerical**: each question must need at least 2 calculation steps or combine 2 concepts. A single-formula lookup, a textbook definition, or a direct NCERT recall question is **not** a JEE Main question, even if it is accurate.
2. **JEE Advanced**: use the Advanced types above. Multi-correct questions must cross at least two ideas. Matrix Match and Paragraph types are preferred for at least 1 in 4 Advanced questions.
3. **Chemistry Main/Advanced**: at least a third of questions should use statement-based options (e.g. "Choose the correct statement(s)") where the statements need reasoning, not recall.
4. **Beginner tier** may be a single concept, but must still require a calculation that a student can get wrong in several ways. It must not be a fact recall or one-step plug-in. **Minimum two calculation steps** for every beginner item, including the Main beginner tier.
5. Do not label NCERT-level items as "JEE Main" to pad the bank. If a question is NCERT-direct, do not write it.

### Hard rejection rules (added after pilot review, Oct 2026)
These patterns were found in the pilot bank and must not appear in new questions:
- **One-formula items**: distance from $v^2 - u^2$, braking distance, impulse $= F t$, recoil from momentum conservation, stopping distance, spring-balance reading in a lift. If the answer comes from one formula with values substituted, rewrite it or drop it.
- **Recall items**: EAN of a metal in a complex, count of unpaired electrons when the complex is given, number of ions a salt gives, which reagent precipitates a complex, spin-only moment of a named complex. These are NCERT facts, not JEE Main questions.
- **Method-revealing stems**: do not name the technique in the question. Banned phrasings include "Evaluate ... by using", "by exploiting", "by applying", "by substituting", "using a suitable substitution", "by splitting the interval", "by recognising", "by rewriting", "by pairing", "using a reduction formula", "using integration by parts", "by differentiating under the integral". The student must choose the method.
- **Textbook identity checks**: "Which of the following is/are true" about a standard identity (e.g., $\tan^{-1}x + \cot^{-1}x = \frac{\pi}{2}$) is rejected.
- **Trivial coin and die setups** (a single fair coin or die, one roll, one count) are rejected unless the question combines at least two of: conditional probability, expectation, a constraint, or a second random process.
- **Depth check**: an item labelled Advanced must score at least 6.8 on the gatekeeper depth check. Write Advanced items with at least three $...$ segments and worked steps in the explanation.
- **Answer-letter balance**: across each 50-question file, no single letter (A, B, C or D) may be the answer for more than about 30% of single-answer items. Shuffle the option order before writing the file. Pilot chunks skewed to "A" (up to 35 of 35 in one file); that is not acceptable.
- **Name distractors by content, not by letter**: explanations must describe each wrong option by the mistake it represents (e.g. "forgets the factor of ½"), not by "Option B" or "C is false". Letter references break when options are reordered.

---

## 3. Good vs. Bad Showcases (Concrete Examples)

Study these side-by-side examples carefully. Any question resembling the **BAD** examples will be **instantly purged by the gatekeeper**.

### 📐 Mathematics Showcase

#### ❌ BAD (Textbook Definition Memorization — INSTANTLY REJECTED)
```json
{
  "id": "bad_math_itf_001",
  "subject": "Mathematics",
  "topic": "Inverse Trigonometric Functions",
  "difficulty": "advanced",
  "examType": "Advanced",
  "questionType": "mcq_multi",
  "questionText": "Which of the following inverse trigonometric statements is/are TRUE for all valid values in their domains?",
  "options": [
    "A) $\\tan^{-1}(x) + \\cot^{-1}(x) = \\frac{\\pi}{2}$ for all $x \\in \\mathbb{R}$",
    "B) $\\sin^{-1}(-x) = -\\sin^{-1}(x)$ for all $x \\in [-1, 1]$",
    "C) $\\cos^{-1}(-x) = \\pi - \\cos^{-1}(x)$ for all $x \\in [-1, 1]$",
    "D) $\\cos^{-1}(-x) = -\\cos^{-1}(x)$ for all $x \\in [-1, 1]$"
  ],
  "answer": "A,B,C",
  "explanation": "By fundamental properties of inverse trigonometric functions: A is true, B is odd function, C is principal branch."
}
```
> **Why it's BAD**: This is standard Class 12 NCERT textbook definition memorization. Marking this as "Advanced" is fraudulent. It requires zero problem-solving, zero multi-step calculation, and zero analytical synthesis.

---

####  GOOD (Authentic IIT JEE Advanced Multi-Step Telescoping)
```json
{
  "id": "good_math_itf_adv_int_101",
  "subject": "Mathematics",
  "topic": "Inverse Trigonometric Functions",
  "difficulty": "advanced",
  "examType": "Advanced",
  "questionType": "integer",
  "questionText": "Let $S = \\sum_{n=1}^{\\infty} \\cot^{-1}\\left(2n^2\\right)$. If $S = \\frac{\\pi}{k}$, determine the integer value of $k$.",
  "options": [],
  "answer": "4",
  "explanation": "Rewrite each term using the arctangent identity: $\\cot^{-1}(2n^2) = \\tan^{-1}\\left(\\frac{1}{2n^2}\\right) = \\tan^{-1}\\left(\\frac{2}{4n^2}\\right)$. Express the numerator as the difference of consecutive odd integers: $\\frac{2}{4n^2} = \\frac{(2n+1) - (2n-1)}{1 + (2n+1)(2n-1)}$. Using the subtraction formula $\\tan^{-1}\\left(\\frac{x - y}{1 + xy}\\right) = \\tan^{-1}x - \\tan^{-1}y$, the general term becomes $T_n = \\tan^{-1}(2n+1) - \\tan^{-1}(2n-1)$. Computing the partial sum $S_N$: $S_N = \\sum_{n=1}^N [\\tan^{-1}(2n+1) - \\tan^{-1}(2n-1)] = \\tan^{-1}(2N+1) - \\tan^{-1}(1)$. Taking the limit as $N \\to \\infty$: $S = \\lim_{N\\to\\infty} \\tan^{-1}(2N+1) - \\frac{\\pi}{4} = \\frac{\\pi}{2} - \\frac{\\pi}{4} = \\frac{\\pi}{4}$. Given $S = \\frac{\\pi}{k}$, we have $\\frac{\\pi}{k} = \\frac{\\pi}{4} \\implies k = 4$."
}
```
> **Why it's GOOD**: Requires algebraic manipulation ($\times 2 / 2$), recognizing the telescoping structure $(2n+1)-(2n-1)$, applying the arctangent subtraction identity, evaluating a Riemann limit, and finding the integer constant. **Authentic cognitive score: 8.5/10.**

---

### ⚛️ Physics Showcase

#### ❌ BAD (Kindergarten 1-Step Arithmetic — INSTANTLY REJECTED)
```json
{
  "id": "bad_phys_mech_001",
  "subject": "Physics",
  "topic": "Work Energy and Power",
  "difficulty": "intermediate",
  "examType": "Main",
  "questionType": "mcq_single",
  "questionText": "A machine does $400$ J of work in $8$ s. Find its power.",
  "options": ["A) $50$ W", "B) $25$ W", "C) $40$ W", "D) $100$ W"],
  "answer": "A",
  "explanation": "Power = Work / time = 400 / 8 = 50 W."
}
```
> **Why it's BAD**: Trivial 4th-grade division ($400/8=50$). Adds negative pedagogical value and destroys the credibility of an IIT JEE platform.

---

####  GOOD (Authentic JEE Main / Advanced Rotational Dynamics + Friction)
```json
{
  "id": "good_phys_rot_adv_sq_102",
  "subject": "Physics",
  "topic": "Rotational Motion",
  "difficulty": "advanced",
  "examType": "Advanced",
  "questionType": "mcq_single",
  "questionText": "A uniform solid sphere of mass $M$ and radius $R$ is placed on a rough horizontal surface with a purely translational velocity $v_0$ and zero initial angular velocity. The coefficient of kinetic friction between the sphere and the surface is $\\mu$. The time $t$ after which the sphere begins pure rolling motion is:",
  "options": [
    "A) $\\frac{2v_0}{7\\mu g}$",
    "B) $\\frac{v_0}{3\\mu g}$",
    "C) $\\frac{2v_0}{5\\mu g}$",
    "D) $\\frac{5v_0}{7\\mu g}$"
  ],
  "answer": "A",
  "explanation": "During the slipping phase, kinetic friction acts backward: $f_k = \\mu N = \\mu M g$. Linear deceleration: $a = -\\frac{f_k}{M} = -\\mu g$, so linear velocity at time $t$ is $v(t) = v_0 - \\mu g t$. The torque about the center of mass due to friction is $\\tau = f_k R = \\mu M g R$. The moment of inertia of a solid sphere is $I = \\frac{2}{5}M R^2$. The angular acceleration is $\\alpha = \\frac{\\tau}{I} = \\frac{\\mu M g R}{\\frac{2}{5}M R^2} = \\frac{5\\mu g}{2R}$. Since initial angular velocity is zero: $\\omega(t) = \\alpha t = \\frac{5\\mu g t}{2R}$. Pure rolling occurs when the contact point has zero relative velocity: $v(t) = R\\omega(t) \\implies v_0 - \\mu g t = R\\left(\\frac{5\\mu g t}{2R}\\right) = \\frac{5}{2}\\mu g t$. Solving for $t$: $v_0 = \\left(1 + \\frac{5}{2}\\right)\\mu g t = \\frac{7}{2}\\mu g t \\implies t = \\frac{2v_0}{7\\mu g}$."
}
```
> **Why it's GOOD**: Sets up simultaneous linear dynamics and torque-rotation equations, models time-dependent slipping velocities, identifies the kinematic pure rolling constraint $v = R\omega$, and solves the resulting system. Distractor options C and D correspond to using a hollow sphere ($I = \frac{2}{3}MR^2$) or forgetting the factor of $2/7$. **Authentic cognitive score: 8.7/10.**

---

### 🧪 Chemistry Showcase

#### ❌ BAD (Direct NCERT Factoid / Periodic Memorization — INSTANTLY REJECTED)
```json
{
  "id": "bad_chem_bond_001",
  "subject": "Chemistry",
  "topic": "Chemical Bonding",
  "difficulty": "beginner",
  "examType": "Main",
  "questionType": "mcq_single",
  "questionText": "What is the hybridization of carbon in methane ($CH_4$)?",
  "options": ["A) $sp^3$", "B) $sp^2$", "C) $sp$", "D) $dsp^2$"],
  "answer": "A",
  "explanation": "Methane has 4 single bonds, so it is sp3."
}
```
> **Why it's BAD**: Trivial memorization. Takes 2 seconds to answer, tests no analytical depth, and fails the cognitive threshold.

---

####  GOOD (Authentic JEE Advanced Molecular Orbital Theory & Paramagnetism)
```json
{
  "id": "good_chem_bond_adv_sq_103",
  "subject": "Chemistry",
  "topic": "Chemical Bonding",
  "difficulty": "advanced",
  "examType": "Advanced",
  "questionType": "mcq_single",
  "questionText": "According to Molecular Orbital Theory, which of the following species is diamagnetic and possesses the shortest bond length?",
  "options": [
    "A) $\\text{NO}^+$",
    "B) $\\text{O}_2^+$",
    "C) $\\text{N}_2^+$",
    "D) $\\text{O}_2^{2-}$"
  ],
  "answer": "A",
  "explanation": "Bond length is inversely proportional to bond order. Evaluating each species via MOT: (1) $\\text{NO}^+$ has $7 + 8 - 1 = 14$ electrons (isoelectronic with $\\text{N}_2$). Configuration: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} (\\pi_{2p_x}^2 = \\pi_{2p_y}^2) \\sigma_{2p_z}^2$. Bonding electrons $N_b = 10$, antibonding $N_a = 4$. Bond order $= \\frac{10 - 4}{2} = 3.0$. With zero unpaired electrons, it is diamagnetic. (2) $\\text{O}_2^+$ has 15 electrons, bond order $= 2.5$, paramagnetic (1 unpaired electron). (3) $\\text{N}_2^+$ has 13 electrons, bond order $= 2.5$, paramagnetic (1 unpaired electron). (4) $\\text{O}_2^{2-}$ has 18 electrons, bond order $= 1.0$, diamagnetic. Since $\\text{NO}^+$ has the highest bond order ($3.0$), it has the shortest bond length and is strictly diamagnetic."
}
```
> **Why it's GOOD**: Combines electron counting across heteronuclear diatomics, writing out complete MO orbital occupancies, computing bond orders, deducing magnetic behavior (unpaired vs paired), and linking bond order to bond length inversely. **Authentic cognitive score: 8.6/10.**

---

## 4. Existing Architecture & Tooling in `data/`

You must utilize and coordinate with the existing tools in `data/`:

1. **`data/registry/topics.json`**:
   - Master list of all **91 official topics** across Physics, Chemistry, and Mathematics with Class 11/12 breakdown and target quotas (Total: 20,310 questions; scale to 30,000+ by completing ~330 Qs per topic).
2. **`data/registry/progress.json`**:
   - Real-time persistent state ledger. Tracks `totalQuestionsCompleted`, `completedQuestions` per subject, and per-topic status (`PENDING` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`).
3. **`data/registry/question_hashes.json`**:
   - SHA-256 stem fingerprint database. Every verified question stem is indexed. Any duplicate or near-duplicate stem is automatically rejected.
4. **`data/gatekeeper.js`**:
   - Strict validation gatekeeper. Exposes `auditChunkFile(filePath, commitToRegistry)`.
   - Validates KaTeX delimiters, checks balanced `{}` braces, screens against the `TRIVIAL_PATTERNS` blacklist, evaluates cognitive depth score (must be $\ge 6.8/10$ for Advanced), and verifies distinct options.
5. **`data/agentRunner.js`**:
   - Dispatcher utility:
     - `getNextPendingTopic(subject)`: Returns the next topic needing questions.
     - `getOverallProgress()`: Returns real-time completion statistics.
6. **`data/compiler.js`**:
   - Aggregates all validated chunks across `data/physics/`, `data/chemistry/`, and `data/mathematics/` into `data/master_questions.json` with a comprehensive quality scorecard.

---

## 5. Execution Protocol: How to Run the Swarm

Execute in disciplined, repeatable steps:

### Step 1: Query State & Identify Next Topic
```bash
node -e "const { getNextPendingTopic, getOverallProgress } = require('./data/agentRunner.js'); console.log('Progress:', getOverallProgress()); console.log('Next Physics:', getNextPendingTopic('Physics'));"
```

### Step 2: Author Micro-Chunks (50–55 Questions per File)
* **Never generate giant monolithic 500-question files** in one turn (that causes context truncation and hallucinations).
* Write clean, standalone JSON micro-chunks directly into:
  * `data/physics/<topic_slug>_chunk_<number>.json`
  * `data/chemistry/<topic_slug>_chunk_<number>.json`
  * `data/mathematics/<topic_slug>_chunk_<number>.json`
* Every micro-chunk must contain:
  ```json
  {
    "questions": [
      /* 50 to 55 valid question objects matching the strict schema */
    ]
  }
  ```

### Step 3: Run Immediate Gatekeeper Audit & Commit
As soon as a chunk file is written, run it through the gatekeeper:
```bash
node -e "const { auditChunkFile } = require('./data/gatekeeper.js'); const res = auditChunkFile('data/mathematics/complex_numbers_chunk_01.json', true); console.log(res);"
```
* If `res.success === true`: The chunk is **officially committed** to `data/registry/progress.json` and its SHA-256 fingerprints are stored in `data/registry/question_hashes.json`.
* If `res.success === false`: The gatekeeper flags the exact question IDs and rejection reasons (e.g. low cognitive depth, unclosed LaTeX delimiter, trivial definition pattern). **Fix or replace those questions immediately and re-audit.**

### Step 4: Periodic Master Compilation & Cloud Checkpoint
After every subject milestone (or every 500–1,000 questions):
```bash
node data/compiler.js
git add data/
git commit -m "checkpoint: verified questions compiled"
git push origin main
```

---

## 6. Golden Rules for Subagents

1. **Every Question Must Stand on Its Own**: Zero programmatic number-swapping or identical sentence templates.
2. **Escape LaTeX Properly in JSON**: Use double backslashes in JSON strings: `"\\frac{a}{b}"`, `"\\int_0^{\\pi}"`, `"\\sqrt{x}"`.
3. **Plausible Distractors Only**: Options B, C, and D must represent realistic student mistakes (sign errors, spurious roots, inverted stereochemistry), not random numbers.
4. **State Persistence**: The registry is source of truth. If a session is interrupted, simply read `data/registry/progress.json` and resume seamlessly without losing a single question.

---

## 7. Coverage Status (resume from here)

**Source of truth:** `data/registry/progress.json` (per-topic counts) and `data/registry/question_hashes.json` (duplicate fingerprints). Both change only when `auditChunkFile(path, true)` commits a file with zero failures.

**Ledger total: 4150 committed questions** out of a 10,000 target (41.5%).

**Next steps for any new agent:**
1. Start only from the Pending lists below. Never regenerate a Started topic unless a file is flagged and needs replacement.
2. Give each new topic a unique ID prefix (see the list below). Do not reuse one.
3. Write 50-question chunks named `data/<subject>/<topic_slug>_chunk_NN.json`. Each agent should write files one at a time and report only when done.
4. Audit with `auditChunkFile(path, false)`, remove flagged questions, re-audit, then commit with `auditChunkFile(path, true)`.
5. Update this section after each batch.

**ID prefixes already used (do not reuse):** aod, as, bt, cb, cc, cd, ce, chq, circ, ck, cn, cs, ct, di, ec, epc, es, fm, fr, grav, hc, hyd, ieq, kin, ktg, lad, lom, mat, mcs, pnc, prob, ptp, qe, raf, rm, ro, rr, sas, sbe, sc, set, shm, sl, sol, som, sop, ss, tf, th, tpm, ud, vec, wav, wep.

**Known open issues:**
- Simple Harmonic Motion chunks 01 and 02 are skewed toward answer A (chunk 01 about 91%, chunk 02 all 35 single-answer items). Reshuffle options and fix any letter references in explanations before adding more items.
- Several topics in the bank have template overlap: Binomial Theorem, Quadratic Equations, Sequences and Series, Limits and Derivatives. New items must use different structures, not new numbers in the same template.
- Electric Potential and Capacitance chunk 03 has only 19 questions, because its agent was stopped early. Top it up or leave it.
- The compiler (`data/compiler.js`) counts all chunk files, including uncommitted ones, so its total can be higher than the ledger total.
- The gatekeeper does not check JEE difficulty or answer keys. Review new items by hand, and cut any single-formula, recall, or textbook-statement items.

### Physics (18 of 29 topics started)
| Topic | Committed | Chunks (committed questions per chunk) |
|---|---|---|
| Kinematics | 43 | c01 43 |
| Laws of Motion | 46 | c01 46 |
| Work Energy and Power | 50 | c01 50 |
| Rotational Motion | 50 | c01 50 |
| Gravitation | 50 | c01 50 |
| Thermal Properties of Matter | 187 | c01 49, c02 46, c03 46, c04 45 |
| Simple Harmonic Motion | 200 | c01 50, c02 50, c03 50, c04 50 |
| Waves | 99 | c01 50, c02 49 |
| Electrostatics | 50 | c01 50 |
| Electric Potential and Capacitance | 117 | c01 48, c02 50, c03 19 |
| Fluid Mechanics | 50 | c01 50 |
| Ray Optics | 50 | c01 50 |
| Thermodynamics | 50 | c01 50 |
| Current Electricity | 50 | c01 50 |
| Units and Dimensions | 50 | c01 50 |
| Friction | 50 | c01 50 |
| System of Particles | 50 | c01 50 |
| Kinetic Theory of Gases | 50 | c01 50 |

**Pending Physics topics (start here):** Elasticity; Moving Charges and Magnetism; Magnetism and Matter; Electromagnetic Induction; Alternating Current; Electromagnetic Waves; Wave Optics; Dual Nature of Radiation; Atoms and Nuclei; Semiconductor Devices; Communication Systems.

### Chemistry (18 of 31 topics started)
| Topic | Committed | Chunks (committed questions per chunk) |
|---|---|---|
| Atomic Structure | 48 | c01 48 |
| Periodic Table and Periodicity | 196 | c01 48, c02 49, c03 49, c04 50 |
| Chemical Bonding | 180 | c01 47, c02 45, c03 47, c04 41 |
| States of Matter | 143 | c01 50, c02 49, c03 44 |
| Chemical Equilibrium | 49 | c01 49 |
| Ionic Equilibrium | 199 | c01 50, c02 50, c03 49, c04 50 |
| Redox Reactions | 48 | c01 48 |
| Solutions | 50 | c01 50 |
| Chemical Kinetics | 50 | c01 50 |
| Coordination Compounds | 41 | c01 41 |
| Hydrocarbons | 50 | c01 50 |
| Mole Concept and Stoichiometry | 50 | c01 50 |
| Electrochemistry | 50 | c01 50 |
| Chemical Thermodynamics | 50 | c01 50 |
| Hydrogen | 50 | c01 50 |
| s-Block Elements | 50 | c01 50 |
| Solid State | 50 | c01 50 |
| Surface Chemistry | 50 | c01 50 |

**Pending Chemistry topics (start here):** p-Block Elements Group 13 and 14; Organic Chemistry Basics; Environmental Chemistry; General Principles of Metallurgy; p-Block Elements Group 15 to 18; Transition Metals and d-Block; Haloalkanes and Haloarenes; Alcohols Phenols and Ethers; Aldehydes and Ketones; Carboxylic Acids and Derivatives; Amines; Biomolecules; Polymers.

### Mathematics (18 of 31 topics started)
| Topic | Committed | Chunks (committed questions per chunk) |
|---|---|---|
| Quadratic Equations | 118 | c01 44, c02 37, c03 37 |
| Permutations and Combinations | 50 | c01 50 |
| Binomial Theorem | 76 | c01 45, c02 31 |
| Sequences and Series | 187 | c01 50, c02 46, c03 48, c04 43 |
| Circles | 50 | c01 50 |
| Limits and Derivatives | 194 | c01 50, c02 50, c03 50, c04 44 |
| Probability | 47 | c01 47 |
| Matrices | 49 | c01 49 |
| Applications of Derivatives | 50 | c01 50 |
| Definite Integration | 33 | c01 33 |
| Continuity and Differentiability | 50 | c01 50 |
| Straight Lines | 50 | c01 50 |
| Complex Numbers | 50 | c01 50 |
| Trigonometric Functions | 50 | c01 50 |
| Sets | 50 | c01 50 |
| Relations and Functions | 50 | c01 50 |
| Conic Sections | 50 | c01 50 |
| Vectors | 50 | c01 50 |

**Pending Mathematics topics (start here):** Principle of Mathematical Induction; Linear Inequalities; Introduction to 3D Geometry; Statistics; Relations and Functions (Advanced); Inverse Trigonometric Functions; Determinants; Indefinite Integration; Applications of Integrals; Differential Equations; Three Dimensional Geometry; Linear Programming; Probability (Bayes and Random Variables).
