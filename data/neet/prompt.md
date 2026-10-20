# 🩺 Master Swarm Orchestration Prompt: NEET-UG Production Question Bank

> **Directive**: You are an elite medical entrance curriculum architect and senior NEET-UG question setter (ex-NTA expert panelist & senior academic faculty from Allen Kota, Aakash Institute, and Sri Chaitanya).
> **Objective**: Generate **17,940 authentic, rigorous, high-cognitive-depth NEET-UG questions** evenly distributed across all 78 official syllabus topics in `data/neet/registry/neet_topics.json`, validated, deduplicated, and compiled into `data/neet/neet_master_questions.json`.

---

## ⚡ LIVE STATUS & EXECUTION TRACKER (Updated October 2026)

Any agent or subagent that wakes up or loses conversational context **MUST read this section first**:

* **Master Compiled Questions**: **4,455 / 17,940 (24.83%)** (Tracked in `data/neet/neet_master_questions.json`)
* **Registry Progress Ledger**: `data/neet/registry/neet_progress.json`
* **Deduplication Hash Ledger**: `data/neet/registry/neet_hashes.json` (4,455 SHA-256 hashes recorded, 0 duplicates)
* **Master Compiler Command**: `node data/neet/neet_compiler.js`
* **Official Syllabus Coverage**: **78 / 78 Topics (100.0% FULL COVERAGE ACHIEVED!)**

### Topics Progress Status (81 Certified Chunks Completed across All 78 Topics):
1. **Botany (20/20 Topics Completed — 1,155 Questions; 100% COMPLETE)**:
   - ✅ All 20 topics completed (Chunk 01 = 1,100 Qs; Chunk 02 for *Principles of Inheritance* = 55 Qs).
2. **Zoology (12/12 Topics Completed — 715 Questions; 100% COMPLETE)**:
   - ✅ All 12 topics completed (Chunk 01 = 660 Qs; Chunk 02 for *Human Reproduction* = 55 Qs).
3. **Chemistry (21/21 Topics Completed — 1,210 Questions; 100% COMPLETE)**:
   - ✅ All 21 topics completed (Chunk 01 = 1,155 Qs; Chunk 02 for *Chemical Bonding* = 55 Qs).
4. **Physics (25/25 Topics Completed — 1,375 Questions; 100% COMPLETE)**:
   - ✅ All 25 topics completed (Chunk 01 = 1,375 Qs).
1. **Botany (20/20 Topics Completed — 1,100 Questions; 100% COMPLETE)**:
   - ✅ Topic 1: **The Living World** (`chunk_01`: **55 Qs**, depth: 6.5) — `data/neet/botany/the_living_world_chunk_01.json`
   - ✅ Topic 2: **Biological Classification** (`chunk_01`: **55 Qs**, depth: 6.5) — `data/neet/botany/biological_classification_chunk_01.json`
   - ✅ Topic 3: **Plant Kingdom** (`chunk_01`: **55 Qs**, depth: 7.8) — `data/neet/botany/plant_kingdom_chunk_01.json`
   - ✅ Topic 4: **Morphology of Flowering Plants** (`chunk_01`: **55 Qs**, depth: 8.1) — `data/neet/botany/morphology_of_flowering_plants_chunk_01.json`
   - ✅ Topic 5: **Anatomy of Flowering Plants** (`chunk_01`: **55 Qs**, depth: 7.5) — `data/neet/botany/anatomy_of_flowering_plants_chunk_01.json`
   - ✅ Topic 6: **Cell: The Unit of Life** (`chunk_01`: **55 Qs**, depth: 7.3) — `data/neet/botany/cell_the_unit_of_life_chunk_01.json`
   - ✅ Topic 7: **Cell Cycle and Cell Division** (`chunk_01`: **55 Qs**, depth: 7.7) — `data/neet/botany/cell_cycle_and_cell_division_chunk_01.json`
   - ✅ Topic 8: **Photosynthesis in Higher Plants** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/botany/photosynthesis_in_higher_plants_chunk_01.json`
   - ✅ Topic 9: **Respiration in Plants** (`chunk_01`: **55 Qs**, depth: 7.7) — `data/neet/botany/respiration_in_plants_chunk_01.json`
   - ✅ Topic 10: **Plant Growth and Development** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/botany/plant_growth_and_development_chunk_01.json`
   - ✅ Topic 11: **Sexual Reproduction in Flowering Plants** (`chunk_01`: **55 Qs**, depth: 7.9) — `data/neet/botany/sexual_reproduction_in_flowering_plants_chunk_01.json`
   - ✅ Topic 12: **Principles of Inheritance and Variation** (`chunk_01`: **55 Qs**, depth: 7.9) — `data/neet/botany/principles_of_inheritance_and_variation_chunk_01.json`
   - ✅ Topic 13: **Molecular Basis of Inheritance** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/botany/molecular_basis_of_inheritance_chunk_01.json`
   - ✅ Topic 14: **Microbes in Human Welfare** (`chunk_01`: **55 Qs**, depth: 8.6) — `data/neet/botany/microbes_in_human_welfare_chunk_01.json`
   - ✅ Topic 15: **Biotechnology: Principles and Processes** (`chunk_01`: **55 Qs**, depth: 7.6) — `data/neet/botany/biotechnology_principles_and_processes_chunk_01.json`
   - ✅ Topic 16: **Biotechnology and its Applications** (`chunk_01`: **55 Qs**, depth: 8.9) — `data/neet/botany/biotechnology_and_its_applications_chunk_01.json`
   - ✅ Topic 17: **Organisms and Populations** (`chunk_01`: **55 Qs**, depth: 8.9) — `data/neet/botany/organisms_and_populations_chunk_01.json`
   - ✅ Topic 18: **Ecosystem** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/botany/ecosystem_chunk_01.json`
   - ✅ Topic 19: **Biodiversity and Conservation** (`chunk_01`: **55 Qs**, depth: 9.0) — `data/neet/botany/biodiversity_and_conservation_chunk_01.json`
   - ✅ Topic 20: **Biomolecules (Botany)** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/botany/biomolecules_botany_chunk_01.json`
   - 🏆 **ALL 20 NEET BOTANY TOPICS ARE 100% COMPLETE!**
2. **Zoology (12/12 Topics Completed — 660 Questions; 100% COMPLETE)**:
   - ✅ Topic 1: **Animal Kingdom** (`chunk_01`: **55 Qs**, depth: 7.7) — `data/neet/zoology/animal_kingdom_chunk_01.json`
   - ✅ Topic 2: **Structural Organisation in Animals** (`chunk_01`: **55 Qs**, depth: 7.5) — `data/neet/zoology/structural_organisation_in_animals_chunk_01.json`
   - ✅ Topic 3: **Breathing and Exchange of Gases** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/zoology/breathing_and_exchange_of_gases_chunk_01.json`
   - ✅ Topic 4: **Body Fluids and Circulation** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/zoology/body_fluids_and_circulation_chunk_01.json`
   - ✅ Topic 5: **Excretory Products and their Elimination** (`chunk_01`: **55 Qs**, depth: 7.9) — `data/neet/zoology/excretory_products_and_their_elimination_chunk_01.json`
   - ✅ Topic 6: **Locomotion and Movement** (`chunk_01`: **55 Qs**, depth: 7.7) — `data/neet/zoology/locomotion_and_movement_chunk_01.json`
   - ✅ Topic 7: **Neural Control and Coordination** (`chunk_01`: **55 Qs**, depth: 7.4) — `data/neet/zoology/neural_control_and_coordination_chunk_01.json`
   - ✅ Topic 8: **Chemical Coordination and Integration** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/zoology/chemical_coordination_and_integration_chunk_01.json`
   - ✅ Topic 9: **Human Reproduction** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/zoology/human_reproduction_chunk_01.json`
   - ✅ Topic 10: **Reproductive Health** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/zoology/reproductive_health_chunk_01.json`
   - ✅ Topic 11: **Evolution** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/zoology/evolution_chunk_01.json`
   - ✅ Topic 12: **Human Health and Disease** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/zoology/human_health_and_disease_chunk_01.json`
   - 🏆 **ALL 12 NEET ZOOLOGY TOPICS ARE 100% COMPLETE! (ENTIRE NEET BIOLOGY CURRICULUM IS 100% COVERED: 32/32 TOPICS, 1,760 QUESTIONS)**
3. **Chemistry (15/21 Topics Completed — 825 Questions)**:
   - ✅ Topic 1: **Some Basic Concepts of Chemistry** (`chunk_01`: **55 Qs**, depth: 8.1) — `data/neet/chemistry/some_basic_concepts_of_chemistry_chunk_01.json`
   - ✅ Topic 2: **Structure of Atom** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/chemistry/structure_of_atom_chunk_01.json`
   - ✅ Topic 3: **Classification of Elements and Periodicity in Properties** (`chunk_01`: **55 Qs**, depth: 8.9) — `data/neet/chemistry/classification_of_elements_and_periodicity_in_properties_chunk_01.json`
   - ✅ Topic 4: **Chemical Bonding and Molecular Structure** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/chemistry/chemical_bonding_and_molecular_structure_chunk_01.json`
   - ✅ Topic 5: **Chemical Thermodynamics** (`chunk_01`: **55 Qs**, depth: 8.6) — `data/neet/chemistry/chemical_thermodynamics_chunk_01.json`
   - ✅ Topic 6: **Equilibrium** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/equilibrium_chunk_01.json`
   - ✅ Topic 7: **Redox Reactions** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/redox_reactions_chunk_01.json`
   - ✅ Topic 8: **Organic Chemistry - Some Basic Principles and Techniques** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/chemistry/organic_chemistry_some_basic_principles_and_techniques_chunk_01.json`
   - ✅ Topic 9: **Hydrocarbons** (`chunk_01`: **55 Qs**, depth: 8.6) — `data/neet/chemistry/hydrocarbons_chunk_01.json`
   - ✅ Topic 10: **Solutions** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/solutions_chunk_01.json`
   - ✅ Topic 11: **Electrochemistry** (`chunk_01`: **55 Qs**, depth: 8.6) — `data/neet/chemistry/electrochemistry_chunk_01.json`
   - ✅ Topic 12: **Chemical Kinetics** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/chemical_kinetics_chunk_01.json`
   - ✅ Topic 13: **The p-Block Elements** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/chemistry/the_p_block_elements_chunk_01.json`
   - ✅ Topic 14: **The d- and f-Block Elements** (`chunk_01`: **55 Qs**, depth: 8.1) — `data/neet/chemistry/the_d_and_f_block_elements_chunk_01.json`
   - ✅ Topic 15: **Coordination Compounds** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/coordination_compounds_chunk_01.json`
   - 🚀 **Wave 5 ACTIVE EXECUTION (Final 6 Chemistry + Final 11 Physics = 100% Full NEET Syllabus Coverage + 3 High-Yield Chunk 02s = 20 Chunks, 1,100 Questions)**:
     1. Chemistry: *Haloalkanes and Haloarenes* (`chunk_01`)
     2. Chemistry: *Alcohols, Phenols and Ethers* (`chunk_01`)
     3. Chemistry: *Aldehydes, Ketones and Carboxylic Acids* (`chunk_01`)
     4. Chemistry: *Amines* (`chunk_01`)
     5. Chemistry: *Biomolecules* (`chunk_01`)
     6. Chemistry: *Principles Related to Practical Chemistry* (`chunk_01`)
     7. Physics: *Electrostatics* (`chunk_01`)
     8. Physics: *Current Electricity* (`chunk_01`)
     9. Physics: *Moving Charges and Magnetism* (`chunk_01`)
     10. Physics: *Electromagnetic Induction and Alternating Currents* (`chunk_01`)
     11. Physics: *Electromagnetic Waves* (`chunk_01`)
     12. Physics: *Ray Optics and Optical Instruments* (`chunk_01`)
     13. Physics: *Wave Optics* (`chunk_01`)
     14. Physics: *Dual Nature of Radiation and Matter* (`chunk_01`)
     15. Physics: *Atoms and Nuclei* (`chunk_01`)
     16. Physics: *Semiconductor Electronics* (`chunk_01`)
     17. Physics: *Experimental Skills in Physics* (`chunk_01`)
     18. Botany: *Principles of Inheritance and Variation* (`chunk_02`)
     19. Zoology: *Human Reproduction* (`chunk_02`)
     20. Chemistry: *Chemical Bonding and Molecular Structure* (`chunk_02`)
     21. Gatekeeper Auditor Subagent overseeing verification and compilation to 4,455 questions (100% syllabus coverage across all 78 topics!).
4. **Physics (14/25 Topics Completed — 770 Questions)**:
   - ✅ Topic 1: **Units and Measurements** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/physics/units_and_measurements_chunk_01.json`
   - ✅ Topic 2: **Motion in a Straight Line** (`chunk_01`: **55 Qs**, depth: 8.1) — `data/neet/physics/motion_in_a_straight_line_chunk_01.json`
   - ✅ Topic 3: **Motion in a Plane** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/physics/motion_in_a_plane_chunk_01.json`
   - ✅ Topic 4: **Laws of Motion** (`chunk_01`: **55 Qs**, depth: 8.2) — `data/neet/physics/laws_of_motion_chunk_01.json`
   - ✅ Topic 5: **Work, Energy, and Power** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/physics/work_energy_and_power_chunk_01.json`
   - ✅ Topic 6: **System of Particles and Rotational Motion** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/physics/system_of_particles_and_rotational_motion_chunk_01.json`
   - ✅ Topic 7: **Gravitation** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/physics/gravitation_chunk_01.json`
   - ✅ Topic 8: **Mechanical Properties of Solids** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/physics/mechanical_properties_of_solids_chunk_01.json`
   - ✅ Topic 9: **Mechanical Properties of Fluids** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/physics/mechanical_properties_of_fluids_chunk_01.json`
   - ✅ Topic 10: **Thermal Properties of Matter** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/physics/thermal_properties_of_matter_chunk_01.json`
   - ✅ Topic 11: **Thermodynamics** (`chunk_01`: **55 Qs**, depth: 8.8) — `data/neet/physics/thermodynamics_chunk_01.json`
   - ✅ Topic 12: **Kinetic Theory of Gases** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/physics/kinetic_theory_of_gases_chunk_01.json`
   - ✅ Topic 13: **Oscillations** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/physics/oscillations_chunk_01.json`
   - ✅ Topic 14: **Waves** (`chunk_01`: **55 Qs**, depth: 8.2) — `data/neet/physics/waves_chunk_01.json`
   - 🎯 Wave 5 Next Queue (Final 11 Physics Topics): *Electrostatics*, *Current Electricity*, *Moving Charges and Magnetism*, *Electromagnetic Induction and Alternating Currents*, *Electromagnetic Waves*, *Ray Optics and Optical Instruments*, *Wave Optics*, *Dual Nature of Radiation and Matter*, *Atoms and Nuclei*, *Semiconductor Electronics*, *Experimental Skills in Physics*
   - ✅ Topic 6: **Equilibrium** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/equilibrium_chunk_01.json`
   - ✅ Topic 7: **Redox Reactions** (`chunk_01`: **55 Qs**, depth: 8.7) — `data/neet/chemistry/redox_reactions_chunk_01.json`
   - 🎯 Wave 4 Next Queue: *Hydrocarbons*, *Solutions*, *Electrochemistry*, *Chemical Kinetics*, *The p-Block Elements*
4. **Physics (7/25 Topics Completed — 385 Questions)**:
   - ✅ Topic 1: **Units and Measurements** (`chunk_01`: **55 Qs**, depth: 8.0) — `data/neet/physics/units_and_measurements_chunk_01.json`
   - ✅ Topic 2: **Motion in a Straight Line** (`chunk_01`: **55 Qs**, depth: 8.1) — `data/neet/physics/motion_in_a_straight_line_chunk_01.json`
   - ✅ Topic 3: **Motion in a Plane** (`chunk_01`: **55 Qs**, depth: 8.4) — `data/neet/physics/motion_in_a_plane_chunk_01.json`
   - ✅ Topic 4: **Laws of Motion** (`chunk_01`: **55 Qs**, depth: 8.2) — `data/neet/physics/laws_of_motion_chunk_01.json`
   - ✅ Topic 5: **Work, Energy, and Power** (`chunk_01`: **55 Qs**, depth: 8.5) — `data/neet/physics/work_energy_and_power_chunk_01.json`
   - ✅ Topic 6: **System of Particles and Rotational Motion** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/physics/system_of_particles_and_rotational_motion_chunk_01.json`
   - ✅ Topic 7: **Gravitation** (`chunk_01`: **55 Qs**, depth: 8.3) — `data/neet/physics/gravitation_chunk_01.json`
   - 🎯 Wave 4 Next Queue: *Mechanical Properties of Solids*, *Mechanical Properties of Fluids*, *Thermal Properties of Matter*, *Thermodynamics*, *Kinetic Theory of Gases*

### How to Resume Immediately:
1. **Check Live Progress**: Run `node data/neet/neet_compiler.js` to see exact verified question count across all 4 subjects.
2. **Find Next Topic**: Inspect `data/neet/registry/neet_progress.json` for topics marked `"PENDING"` or with `totalQuestions < 230`.
3. **Execution Rule (MANDATORY)**: Never stream 55 questions in a single response (causes Cloud Code SSE token cutoff). Always use the 3-phase modular script in `scratch/<topic_snake>/`:
   - `part1_beg.js`: 22 Beginner questions (NCERT traps, statement pairs, fundamental principles)
   - `part2_int.js`: 19 Intermediate questions (Match the column, multi-statement, biochemical pathways/mechanics)
   - `part3_adv.js`: 14 Advanced questions (Assertion-Reason, higher-order multi-concept synthesis, numericals)
   - `assemble.js`: Concatenates parts, balances option keys (A, B, C, D ~13–14 each), writes target JSON to `data/neet/<subject>/<topic_snake>_chunk_<nn>.json`, and audits via `data/neet/neet_gatekeeper.js`.
4. **Audit & Compile**:
   - Audit individual chunk:
     `node -e "const { auditChunkFile } = require('./data/neet/neet_gatekeeper.js'); console.log(JSON.stringify(auditChunkFile('data/neet/<subject>/<chunk_file>.json', true)));"`
   - Compile master question bank:
     `node data/neet/neet_compiler.js` (syncs `neet_master_questions.json`, `neet_progress.json`, and `neet_hashes.json`).

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

### 2.1 Physics Syllabus (25 Topics)
* **Class 11**: Units and Measurements, Motion in a Straight Line, Motion in a Plane, Laws of Motion, Work Energy and Power, System of Particles and Rotational Motion, Gravitation, Mechanical Properties of Solids, Mechanical Properties of Fluids, Thermal Properties of Matter, Thermodynamics (excluding heat engines & refrigerators), Kinetic Theory of Gases, Oscillations, Waves (excluding Doppler effect).
* **Class 12**: Electrostatics, Current Electricity, Moving Charges and Magnetism (excluding Earth magnetism & magnetic materials), Electromagnetic Induction and Alternating Currents, Electromagnetic Waves, Ray Optics and Optical Instruments, Wave Optics (excluding resolving power, scattering, Brewster's angle), Dual Nature of Radiation and Matter, Atoms and Nuclei, Semiconductor Electronics (excluding transistors and logic gates), Experimental Skills in Physics.
* **Experimental Skills (Added/Highlighted)**: Vernier callipers, screw gauge, simple pendulum, meter bridge, resonance tube, surface tension by capillary rise, coefficient of viscosity, Young's modulus, focal length of spherical mirrors/lenses using $u$-$v$ plots, diode characteristics.

### 2.2 Chemistry Syllabus (21 Topics)
* **Physical Chemistry**: Some Basic Concepts of Chemistry, Structure of Atom, Chemical Thermodynamics, Equilibrium, Redox Reactions, Solutions, Electrochemistry, Chemical Kinetics.
* **Inorganic Chemistry**: Classification of Elements and Periodicity in Properties, Chemical Bonding and Molecular Structure, The p-Block Elements (Groups 13 to 18 general trends), The d- and f-Block Elements, Coordination Compounds.
* **Organic Chemistry**: Organic Chemistry - Some Basic Principles and Techniques, Hydrocarbons, Haloalkanes and Haloarenes, Alcohols, Phenols and Ethers, Aldehydes, Ketones and Carboxylic Acids, Amines, Biomolecules.
* **Practical Chemistry (Added/Highlighted)**: Principles Related to Practical Chemistry (detection of extra elements N, S, halogens; functional groups; titrations: oxalic acid, Mohr's salt, $\text{KMnO}_4$; qualitative salt analysis).
* **BANNED DELETED CHAPTERS**: States of Matter, Solid State, Surface Chemistry, Hydrogen, s-Block Elements, General Principles of Metallurgy, Polymers, Chemistry in Everyday Life, Environmental Chemistry.

### 2.3 Botany Syllabus (20 Topics)
* **Class 11**: The Living World, Biological Classification, Plant Kingdom, Morphology of Flowering Plants (including family floral formulas & diagrams: Malvaceae, Brassicaceae, Fabaceae, Asteraceae, Poaceae), Anatomy of Flowering Plants, Cell: The Unit of Life, Biomolecules (Botany), Cell Cycle and Cell Division, Photosynthesis in Higher Plants, Respiration in Plants, Plant Growth and Development.
* **Class 12**: Sexual Reproduction in Flowering Plants, Principles of Inheritance and Variation, Molecular Basis of Inheritance, Microbes in Human Welfare, Biotechnology: Principles and Processes, Biotechnology and its Applications, Organisms and Populations, Ecosystem, Biodiversity and Conservation.
* **BANNED DELETED TOPICS**: Transport in Plants, Mineral Nutrition, Plant Succession, Strategies for Enhancement in Food Production (plant breeding).

### 2.4 Zoology Syllabus (12 Topics)
* **Class 11**: Animal Kingdom, Structural Organisation in Animals (Animal Tissues, Frog and Cockroach anatomy), Breathing and Exchange of Gases, Body Fluids and Circulation, Excretory Products and their Elimination, Locomotion and Movement, Neural Control and Coordination (excluding ear & eye histology), Chemical Coordination and Integration.
* **Class 12**: Human Reproduction, Reproductive Health, Evolution, Human Health and Disease.
* **BANNED DELETED TOPICS**: Digestion and Absorption, Reproduction in Organisms (intro chapter), Environmental Issues.

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
- Numbers must be clean ($g = 10\text{ m/s}^2$ or $9.8\text{ m/s}^2$, $R = 8.314\text{ J/mol}\cdot\text{K}$, $h = 6.63 \times 10^{-34}\text{ J}\cdot\text{s}$).
- Requires combining 2 linked concepts (e.g., De Broglie wavelength + photoelectric stopping potential).

---

## 4. Micro-Chunk Specification & Schema

### 4.1 Chunk Size & File Naming
- Each topic chunk contains exactly **55 questions**.
- Distribution per 55-question chunk:
  - **22 Beginner Questions** (40%)
  - **19 Intermediate Questions** (35%)
  - **14 Advanced Questions** (25%)
- File naming pattern:
  - `data/neet/<subject>/<topic_snake_case>_chunk_<nn>.json`
  - Example: `data/neet/botany/the_living_world_chunk_01.json`

### 4.2 Standard Question JSON Schema
```json
{
  "id": "bot_living_world_c01_001",
  "subject": "Botany",
  "topic": "The Living World",
  "difficulty": "beginner",
  "examType": "NEET",
  "questionType": "mcq_single",
  "questionText": "Question stem with $...$ KaTeX for all formulas.",
  "options": [
    "A) First option text",
    "B) Second option text",
    "C) Third option text",
    "D) Fourth option text"
  ],
  "answer": "B",
  "explanation": "Step 1: Why correct. Step 2: Specific error analysis for wrong options."
}
```

### 4.3 Subject Abbreviations for Question IDs:
* Botany: `bot` (e.g. `bot_plant_kingdom_c01_001`)
* Zoology: `zoo` (e.g. `zoo_animal_kingdom_c01_001`)
* Physics: `phy` (e.g. `phy_laws_of_motion_c01_001`)
* Chemistry: `chem` (e.g. `chem_chemical_bonding_c01_001`)

---

## 5. Gatekeeper & Quality Enforcement Rules

1. **Zero-NCERT-Trivia Violation**: Any direct 1-step definition check without application or discrimination is purged.
2. **Formula-Plug Violation**: Any Physics question requiring only a 1-step calculator plug-in (e.g., $F = ma$) is purged.
3. **KaTeX Delimiter Rule**: All math symbols, equations, units, chemical formulas, and variables must be enclosed in valid KaTeX (`$...$` or `$$...$$`). Unclosed or mismatched braces (`{` without `}`) cause instant rejection.
4. **Distractor Distribution Balance**: Across any 55-question chunk, correct answers must be evenly distributed across A, B, C, and D (~13–14 each; no single letter exceeding 35%).
5. **Content-Identified Distractors**: Explanations must explain the error represented by each distractor, never merely stating *"Option B is wrong"*.

---

## 6. Self-Resuming Subagent Execution Protocol

When launching a subagent swarm to author NEET questions, invoke subagents using the standardized template below:

```text
Generate an authentic, high-cognitive-depth micro-chunk of 55 NEET-UG questions for:
Subject: <Subject: Botany | Zoology | Physics | Chemistry>
Topic: <Exact Official Topic Name from data/neet/registry/neet_topics.json>
Target File: <Absolute Path to data/neet/<subject_lowercase>/<topic_snake_case>_chunk_01.json>

Execution Protocol (Mandatory):
- MUST write in 3 modular parts in scratch/:
  1. part1_beg.js (22 Beginner Qs: NCERT line discrimination, 2-step calculations)
  2. part2_int.js (19 Intermediate Qs: Assertion-Reason, Statement I & II, Match the Column)
  3. part3_adv.js (14 Advanced Qs: Multi-concept integration, multi-statement evaluation)
- Assemble, balance answers (A, B, C, D ~13-14 each), update neet_hashes.json and neet_progress.json, and run node data/neet/neet_compiler.js.
- Adhere strictly to the NMC revised syllabus (no deleted topics).
```

This prompt file is permanent and self-contained. Any agent reading this document has the full context, syllabus constraints, cognitive rubrics, and execution protocols required to resume generation seamlessly.
