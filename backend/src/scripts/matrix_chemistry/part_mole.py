import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_mole_questions():
    questions = []
    topic = "Mole Concept and Stoichiometry"

    # Q1: beginner, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_001",
        topic=topic,
        difficulty="beginner",
        lead="Match the sample of substance at STP in List I with its corresponding quantity/property in List II:",
        pairs=[
            ("0.5 mol of CO2 gas at STP", "I", "11.2 L volume at STP and 3.011 x 10^23 molecules", 
             "1 mol of an ideal gas occupies 22.4 L at STP. For 0.5 mol CO2, volume = 0.5 x 22.4 = 11.2 L, and number of molecules = 0.5 x N_A = 3.011 x 10^23"),
            ("16 g of O2 gas", "III", "0.5 mol of molecules containing 6.022 x 10^23 total oxygen atoms", 
             "Molar mass of O2 = 32 g/mol. Moles = 16 / 32 = 0.5 mol. Since each O2 molecule has 2 atoms, total oxygen atoms = 0.5 x 2 x N_A = 6.022 x 10^23"),
            ("1.8 g of liquid H2O", "IV", "0.1 mol of molecules and approximately 1.8 mL volume", 
             "Molar mass of H2O = 18 g/mol. Moles = 1.8 / 18 = 0.1 mol. With density = 1.0 g/mL, volume = 1.8 mL"),
            ("44.8 L of He gas at STP", "II", "2.0 mol of atoms and 8.0 g total mass", 
             "Helium is a monoatomic gas (molar mass = 4 g/mol). Moles = 44.8 / 22.4 = 2.0 mol, mass = 2.0 x 4 = 8.0 g")
        ],
        correct_choice="A"
    ))

    # Q2: beginner, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_002",
        topic=topic,
        difficulty="beginner",
        lead="Match the chemical compound in List I with the mass percentage of the specified element in List II:",
        pairs=[
            ("Urea (NH2CONH2), % of Nitrogen", "II", "46.67% Nitrogen", 
             "Molar mass of urea = 2(14) + 4(1) + 12 + 16 = 60 g/mol. Mass of N = 28 g. Mass % = (28 / 60) x 100% = 46.67%"),
            ("Glucose (C6H12O6), % of Carbon", "IV", "40.00% Carbon", 
             "Molar mass of glucose = 6(12) + 12(1) + 6(16) = 180 g/mol. Mass of C = 72 g. Mass % = (72 / 180) x 100% = 40.00%"),
            ("Methane (CH4), % of Hydrogen", "I", "25.00% Hydrogen", 
             "Molar mass of CH4 = 12 + 4(1) = 16 g/mol. Mass of H = 4 g. Mass % = (4 / 16) x 100% = 25.00%"),
            ("Calcium carbonate (CaCO3), % of Carbon and Oxygen", "III", "12.00% Carbon and 48.00% Oxygen", 
             "Molar mass of CaCO3 = 40 + 12 + 48 = 100 g/mol. Mass % of C = 12%, Mass % of O = 48%")
        ],
        correct_choice="B"
    ))

    # Q3: beginner, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_003",
        topic=topic,
        difficulty="beginner",
        lead="Match the concentration term in List I with its thermodynamic definition and behavior in List II:",
        pairs=[
            ("Molarity (M)", "III", "Moles of solute per liter of solution; temperature-dependent", 
             "Molarity M = n_solute / V_solution(L). Solution volume changes with temperature, making molarity temperature-dependent"),
            ("Molality (m)", "I", "Moles of solute per kilogram of solvent; temperature-independent", 
             "Molality m = n_solute / m_solvent(kg). Mass is temperature-independent, so molality does not vary with temperature"),
            ("Mole fraction (X)", "IV", "Ratio of moles of a component to total moles; dimensionless and temperature-independent", 
             "Mole fraction X_i = n_i / n_total. It is a dimensionless ratio of mole numbers and is independent of temperature"),
            ("Normality (N)", "II", "Gram equivalents of solute per liter of solution; temperature-dependent", 
             "Normality N = eq_solute / V_solution(L) = M x n-factor. Because volume depends on temperature, normality varies with temperature")
        ],
        correct_choice="C"
    ))

    # Q4: beginner, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_004",
        topic=topic,
        difficulty="beginner",
        lead="Match the law of chemical combination in List I with its illustrative example in List II:",
        pairs=[
            ("Law of Conservation of Mass", "IV", "100 g CaCO3 decomposes to yield exactly 56 g CaO and 44 g CO2 in a closed system", 
             "Total mass of reactants (100 g) equals total mass of products (56 g + 44 g = 100 g), demonstrating conservation of mass"),
            ("Law of Definite Proportions", "II", "Water from any source always contains hydrogen and oxygen in a fixed 1:8 mass ratio", 
             "A pure chemical compound always contains its constituent elements in a fixed ratio by mass regardless of origin"),
            ("Law of Multiple Proportions", "I", "Carbon forms CO and CO2, where masses of O combining with 12 g C are in 1:2 ratio (16 g : 32 g)", 
             "When two elements form more than one compound, the masses of one element combining with a fixed mass of the other are in simple integer ratio"),
            ("Gay-Lussac's Law of Gaseous Volumes", "III", "2 volumes of H2 react with 1 volume of O2 to form 2 volumes of H2O vapor at constant T and P", 
             "Gaseous reactants and products combine in simple integer ratios by volume under identical conditions of temperature and pressure")
        ],
        correct_choice="D"
    ))

    # Q5: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_005",
        topic=topic,
        difficulty="intermediate",
        lead="For the combustion reaction 2H2(g) + O2(g) -> 2H2O(g), match the initial reactant mixture in List I with the reaction outcome in List II:",
        pairs=[
            ("4 g H2 and 32 g O2", "I", "Stoichiometric mixture; 36 g (2.0 mol) H2O formed with no excess reactant", 
             "Moles H2 = 4/2 = 2.0 mol; moles O2 = 32/32 = 1.0 mol. Exactly 2 mol H2 reacts with 1 mol O2 to give 2 mol (36 g) H2O"),
            ("2 g H2 and 32 g O2", "III", "H2 is limiting; 18 g (1.0 mol) H2O formed and 16 g O2 remains unreacted", 
             "Moles H2 = 2/2 = 1.0 mol; moles O2 = 1.0 mol. 1.0 mol H2 requires 0.5 mol O2. H2 is limiting; 1.0 mol H2O forms and 0.5 mol (16 g) O2 remains"),
            ("6 g H2 and 16 g O2", "II", "O2 is limiting; 18 g (1.0 mol) H2O formed and 4 g H2 remains unreacted", 
             "Moles H2 = 3.0 mol; moles O2 = 0.5 mol. 0.5 mol O2 consumes 1.0 mol H2 to form 1.0 mol (18 g) H2O. Excess H2 = 3.0 - 1.0 = 2.0 mol (4 g)"),
            ("1 g H2 and 16 g O2", "IV", "H2 is limiting; 9 g (0.5 mol) H2O formed and 8 g O2 remains unreacted", 
             "Moles H2 = 0.5 mol; moles O2 = 0.5 mol. 0.5 mol H2 consumes 0.25 mol (8 g) O2 to yield 0.5 mol (9 g) H2O. Excess O2 = 16 - 8 = 8 g")
        ],
        correct_choice="A"
    ))

    # Q6: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_006",
        topic=topic,
        difficulty="intermediate",
        lead="Match the complete combustion products of 0.10 mol of gaseous hydrocarbon CxHy in List I with its molecular formula in List II:",
        pairs=[
            ("Produces 8.8 g CO2 and 5.4 g H2O", "II", "C2H6 (Ethane)", 
             "Moles CO2 = 8.8 / 44 = 0.20 mol -> x = 0.20 / 0.10 = 2. Moles H2O = 5.4 / 18 = 0.30 mol -> moles H = 0.60 mol -> y = 6. Formula is C2H6"),
            ("Produces 13.2 g CO2 and 7.2 g H2O", "IV", "C3H8 (Propane)", 
             "Moles CO2 = 13.2 / 44 = 0.30 mol -> x = 3. Moles H2O = 7.2 / 18 = 0.40 mol -> moles H = 0.80 mol -> y = 8. Formula is C3H8"),
            ("Produces 8.8 g CO2 and 3.6 g H2O", "I", "C2H4 (Ethene)", 
             "Moles CO2 = 8.8 / 44 = 0.20 mol -> x = 2. Moles H2O = 3.6 / 18 = 0.20 mol -> moles H = 0.40 mol -> y = 4. Formula is C2H4"),
            ("Produces 17.6 g CO2 and 9.0 g H2O", "III", "C4H10 (Butane)", 
             "Moles CO2 = 17.6 / 44 = 0.40 mol -> x = 4. Moles H2O = 9.0 / 18 = 0.50 mol -> moles H = 1.00 mol -> y = 10. Formula is C4H10")
        ],
        correct_choice="B"
    ))

    # Q7: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_007",
        topic=topic,
        difficulty="intermediate",
        lead="Match the redox active species in List I with its equivalent weight in terms of molar mass M in List II:",
        pairs=[
            ("KMnO4 in acidic medium (MnO4- -> Mn2+)", "III", "M / 5 (n-factor = 5)", 
             "Mn changes from +7 in MnO4- to +2 in Mn2+, gaining 5 electrons. Thus n-factor = 5 and Equivalent Weight = M / 5"),
            ("KMnO4 in strongly alkaline medium (MnO4- -> MnO4^2-)", "IV", "M / 1 (n-factor = 1)", 
             "Mn changes from +7 in permanganate to +6 in manganate, gaining 1 electron. Thus n-factor = 1 and Equivalent Weight = M / 1"),
            ("K2Cr2O7 in acidic medium (Cr2O7^2- -> 2Cr3+)", "I", "M / 6 (n-factor = 6)", 
             "Two Cr atoms change from +6 to +3, total electrons gained = 2 x 3 = 6. Thus n-factor = 6 and Equivalent Weight = M / 6"),
            ("KMnO4 in neutral or faintly alkaline medium (MnO4- -> MnO2)", "II", "M / 3 (n-factor = 3)", 
             "Mn changes from +7 to +4 in MnO2, gaining 3 electrons. Thus n-factor = 3 and Equivalent Weight = M / 3")
        ],
        correct_choice="C"
    ))

    # Q8: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_008",
        topic=topic,
        difficulty="intermediate",
        lead="Match the aqueous mixture at 25 °C in List I with the resultant ion concentration in List II:",
        pairs=[
            ("100 mL of 0.20 M HCl + 100 mL of 0.10 M NaOH", "II", "[H+] = 0.050 M", 
             "mmol H+ = 100 x 0.20 = 20; mmol OH- = 100 x 0.10 = 10. Net H+ = 10 mmol in 200 mL. [H+] = 10 / 200 = 0.050 M"),
            ("50 mL of 0.20 M H2SO4 + 50 mL of 0.20 M NaOH", "IV", "[H+] = 0.100 M", 
             "mmol H+ = 50 x 0.20 x 2 = 20; mmol OH- = 50 x 0.20 = 10. Net H+ = 10 mmol in 100 mL. [H+] = 10 / 100 = 0.100 M"),
            ("100 mL of 0.10 M Ba(OH)2 + 100 mL of 0.10 M HCl", "I", "[OH-] = 0.050 M", 
             "mmol OH- = 100 x 0.10 x 2 = 20; mmol H+ = 100 x 0.10 = 10. Net OH- = 10 mmol in 200 mL. [OH-] = 10 / 200 = 0.050 M"),
            ("200 mL of 0.05 M HNO3 + 300 mL of 0.10 M KOH", "III", "[OH-] = 0.040 M", 
             "mmol H+ = 200 x 0.05 = 10; mmol OH- = 300 x 0.10 = 30. Net OH- = 20 mmol in 500 mL. [OH-] = 20 / 500 = 0.040 M")
        ],
        correct_choice="D"
    ))

    # Q9: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_009",
        topic=topic,
        difficulty="intermediate",
        lead="Match the labeled hydrogen peroxide (H2O2) solution in List I with its concentration parameters in List II:",
        pairs=[
            ("'11.2 volume' H2O2", "I", "1.00 M and 2.00 N (34.0 g/L strength)", 
             "Volume strength = 11.2 x M. Thus M = 11.2 / 11.2 = 1.00 M. Normality = 2 x M = 2.00 N. Strength = 1.00 x 34 = 34.0 g/L"),
            ("'5.6 volume' H2O2", "III", "0.50 M and 1.00 N (1.70% w/v strength)", 
             "M = 5.6 / 11.2 = 0.50 M. Normality = 1.00 N. Strength = 0.50 x 34 = 17 g/L = 1.70% (w/v)"),
            ("'22.4 volume' H2O2", "IV", "2.00 M and 4.00 N (68.0 g/L strength)", 
             "M = 22.4 / 11.2 = 2.00 M. Normality = 2 x 2.00 = 4.00 N. Strength = 2.00 x 34 = 68.0 g/L"),
            ("'10.0 volume' H2O2", "II", "0.893 M and 1.786 N (3.036% w/v strength)", 
             "M = 10.0 / 11.2 = 0.893 M. Normality = 2 x 0.893 = 1.786 N. Strength = 0.893 x 34 = 30.36 g/L = 3.036% (w/v)")
        ],
        correct_choice="A"
    ))

    # Q10: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_010",
        topic=topic,
        difficulty="intermediate",
        lead="Match the thermal treatment of the salt sample in List I with the resulting decomposition products in List II:",
        pairs=[
            ("1.0 mol of CaCO3(s) strongly heated", "II", "1.0 mol CO2 gas (44 g) and 56 g CaO solid residue", 
             "CaCO3(s) -> CaO(s) + CO2(g). 1.0 mol (100 g) gives 56 g CaO and 44 g (1.0 mol) CO2 gas"),
            ("2.0 mol of NaHCO3(s) gently heated", "IV", "1.0 mol CO2 + 1.0 mol H2O vapor (62 g volatile loss) and 106 g Na2CO3 residue", 
             "2NaHCO3(s) -> Na2CO3(s) + CO2(g) + H2O(g). 2.0 mol (168 g) yields 106 g Na2CO3 and 62 g volatiles"),
            ("1.0 mol of MgCO3(s) strongly heated", "I", "1.0 mol CO2 gas (44 g) and 40.3 g MgO solid residue", 
             "MgCO3(s) -> MgO(s) + CO2(g). 1.0 mol (84.3 g) gives 40.3 g MgO and 44 g CO2 gas"),
            ("1.0 mol of Na2CO3(s) heated to 800 °C", "III", "No thermal decomposition; 0 g volatile loss and 106 g Na2CO3 remains", 
             "Alkali metal carbonates (except Li2CO3) are thermally stable and do not decompose at standard heating temperatures")
        ],
        correct_choice="B"
    ))

    # Q11: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_011",
        topic=topic,
        difficulty="intermediate",
        lead="Match the eudiometry observations for 10 mL of gaseous hydrocarbon CxHy exploded with excess O2 in List I with its identity in List II:",
        pairs=[
            ("Contraction on cooling = 20 mL; further contraction with KOH = 10 mL", "III", "CH4 (Methane)", 
             "Contraction with KOH = 10x = 10 mL -> x = 1. Contraction on cooling = 10(1 + y/4) = 20 mL -> y/4 = 1 -> y = 4. Formula is CH4"),
            ("Contraction on cooling = 20 mL; further contraction with KOH = 20 mL", "I", "C2H4 (Ethene)", 
             "Contraction with KOH = 10x = 20 mL -> x = 2. Contraction on cooling = 10(1 + y/4) = 20 mL -> y/4 = 1 -> y = 4. Formula is C2H4"),
            ("Contraction on cooling = 25 mL; further contraction with KOH = 30 mL", "IV", "C3H6 (Propene)", 
             "Contraction with KOH = 10x = 30 mL -> x = 3. Contraction on cooling = 10(1 + y/4) = 25 mL -> y/4 = 1.5 -> y = 6. Formula is C3H6"),
            ("Contraction on cooling = 15 mL; further contraction with KOH = 20 mL", "II", "C2H2 (Ethyne)", 
             "Contraction with KOH = 10x = 20 mL -> x = 2. Contraction on cooling = 10(1 + y/4) = 15 mL -> y/4 = 0.5 -> y = 2. Formula is C2H2")
        ],
        correct_choice="C"
    ))

    # Q12: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_012",
        topic=topic,
        difficulty="intermediate",
        lead="Match the labeled oleum sample (fuming sulfuric acid) in List I with its percentage of free SO3 in List II:",
        pairs=[
            ("109.0% Oleum", "IV", "40.0% free SO3 by mass", 
             "Percentage labeling = 100 + (18/80) x (% free SO3) = 100 + 0.225 x (% free SO3). % free SO3 = 9.0 / 0.225 = 40.0%"),
            ("104.5% Oleum", "II", "20.0% free SO3 by mass", 
             "% free SO3 = (104.5 - 100) / 0.225 = 4.5 / 0.225 = 20.0%"),
            ("118.0% Oleum", "I", "80.0% free SO3 by mass", 
             "% free SO3 = (118.0 - 100) / 0.225 = 18.0 / 0.225 = 80.0%"),
            ("113.5% Oleum", "III", "60.0% free SO3 by mass", 
             "% free SO3 = (113.5 - 100) / 0.225 = 13.5 / 0.225 = 60.0%")
        ],
        correct_choice="D"
    ))

    # Q13: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_013",
        topic=topic,
        difficulty="advanced",
        lead="Match the alkaline solution mixture titrated with standard HCl in List I with the relation between volume V1 (phenolphthalein) and volume V2 (subsequent methyl orange) in List II:",
        pairs=[
            ("Equimolar mixture of NaOH and Na2CO3 (n mol each)", "I", "V1 = 2 V2", 
             "Phenolphthalein end point neutralizes all NaOH and half of Na2CO3: V1 proportional to n + n = 2n. Methyl orange neutralizes remaining NaHCO3: V2 proportional to n. Thus V1 = 2 V2"),
            ("Pure aqueous Na2CO3 solution", "III", "V1 = V2", 
             "Stage 1 (phenolphthalein): Na2CO3 + HCl -> NaHCO3 + NaCl consumes V1. Stage 2 (methyl orange): NaHCO3 + HCl -> NaCl + H2O + CO2 consumes V2. By stoichiometry, V1 = V2"),
            ("Mixture containing 1 mol NaOH and 2 mol Na2CO3", "IV", "V1 = 1.5 V2", 
             "V1 corresponds to NaOH + half Na2CO3 = 1 + 2 = 3. V2 corresponds to second half of Na2CO3 = 2. Thus V1 / V2 = 3/2 = 1.5"),
            ("Pure aqueous NaHCO3 solution", "II", "V1 = 0 and V2 > 0", 
             "Aqueous NaHCO3 has pH approx 8.3, so phenolphthalein remains colorless (V1 = 0). Titration proceeds directly to methyl orange end point (V2 > 0)")
        ],
        correct_choice="A"
    ))

    # Q14: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_014",
        topic=topic,
        difficulty="advanced",
        lead="Match the nitrogen estimation experiment in List I with the calculated mass percentage of nitrogen in List II:",
        pairs=[
            ("0.50 g sample in Kjeldahl method; NH3 neutralized by 50 mL of 0.10 M H2SO4", "II", "28.00% Nitrogen", 
             "meq of acid = 50 x 0.10 x 2 = 10 meq. Moles NH3 = 0.010 mol. Mass of N = 0.010 x 14 = 0.14 g. % N = (0.14 / 0.50) x 100 = 28.00%"),
            ("0.28 g sample in Dumas method yields 44.8 mL of dry N2 gas at STP", "IV", "20.00% Nitrogen", 
             "Moles of N2 = 44.8 / 22400 = 0.0020 mol. Mass of N = 0.0020 x 28 = 0.056 g. % N = (0.056 / 0.28) x 100 = 20.00%"),
            ("0.30 g sample in Kjeldahl method; NH3 absorbed in 100 mL 0.1 N H2SO4; excess acid requires 20 mL 0.1 N NaOH", "I", "37.33% Nitrogen", 
             "Initial acid = 100 x 0.1 = 10 meq; unreacted = 20 x 0.1 = 2 meq. meq NH3 = 8 meq = 0.008 mol N. Mass N = 0.112 g. % N = (0.112 / 0.30) x 100 = 37.33%"),
            ("0.14 g sample in Dumas method yields 11.2 mL of dry N2 gas at STP", "III", "10.00% Nitrogen", 
             "Moles of N2 = 11.2 / 22400 = 0.0005 mol. Mass of N = 0.0005 x 28 = 0.014 g. % N = (0.014 / 0.14) x 100 = 10.00%")
        ],
        correct_choice="B"
    ))

    # Q15: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_015",
        topic=topic,
        difficulty="advanced",
        lead="Match the sequential chemical reaction sequence in List I with the theoretical yield from 1000 g of starting material in List II:",
        pairs=[
            ("FeS2 -> 2 SO2 -> 2 SO3 -> 2 H2SO4 (from 1000 g pure FeS2; M_FeS2 = 120 g/mol, M_H2SO4 = 98 g/mol)", "III", "1633.3 g H2SO4", 
             "1 mol FeS2 (120 g) produces 2 mol H2SO4 (196 g). From 1000 g FeS2, mass of H2SO4 = 1000 x (196 / 120) = 1633.3 g"),
            ("CaCO3 -> CaO -> CaC2 -> C2H2 (from 1000 g pure CaCO3; M_CaCO3 = 100 g/mol, M_C2H2 = 26 g/mol)", "IV", "260.0 g C2H2", 
             "1 mol CaCO3 (100 g) yields 1 mol C2H2 (26 g). From 1000 g CaCO3, mass of C2H2 = 1000 x (26 / 100) = 260.0 g"),
            ("P4 -> P4O10 -> 4 H3PO4 (from 1000 g pure P4; M_P4 = 124 g/mol, M_H3PO4 = 98 g/mol)", "I", "3161.3 g H3PO4", 
             "1 mol P4 (124 g) yields 4 mol H3PO4 (392 g). From 1000 g P4, mass of H3PO4 = 1000 x (392 / 124) = 3161.3 g"),
            ("KClO3 -> 1.5 O2; 3 O2 + 4 Fe -> 2 Fe2O3 (from 1000 g KClO3; M_KClO3 = 122.5 g/mol, M_Fe2O3 = 160 g/mol)", "II", "1306.1 g Fe2O3", 
             "1 mol KClO3 produces 1.5 mol O2. 1.5 mol O2 produces 1.0 mol Fe2O3. Mass = 1000 x (160 / 122.5) = 1306.1 g")
        ],
        correct_choice="C"
    ))

    # Q16: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_016",
        topic=topic,
        difficulty="advanced",
        lead="A 40 mL gaseous mixture of CO, CH4, and N2 is exploded with excess O2. Match the mixture composition in List I with the contraction behavior in List II:",
        pairs=[
            ("20 mL CO, 10 mL CH4, and 10 mL N2", "II", "Contraction on explosion = 30 mL; KOH contraction = 30 mL", 
             "CO: 20 mL consumes 10 mL O2, gives 20 mL CO2 (contraction = 10 mL). CH4: 10 mL consumes 20 mL O2, gives 10 mL CO2 (contraction = 20 mL). Total explosion contraction = 30 mL; CO2 absorbed = 20 + 10 = 30 mL"),
            ("10 mL CO, 20 mL CH4, and 10 mL N2", "IV", "Contraction on explosion = 45 mL; KOH contraction = 30 mL", 
             "CO: 10 mL consumes 5 mL O2 (contraction = 5 mL). CH4: 20 mL consumes 40 mL O2 (contraction = 40 mL). Total explosion contraction = 45 mL; CO2 absorbed = 10 + 20 = 30 mL"),
            ("30 mL CO, 0 mL CH4, and 10 mL N2", "I", "Contraction on explosion = 15 mL; KOH contraction = 30 mL", 
             "30 mL CO consumes 15 mL O2 (contraction = 15 mL) and produces 30 mL CO2 (absorbed by KOH = 30 mL)"),
            ("0 mL CO, 20 mL CH4, and 20 mL N2", "III", "Contraction on explosion = 40 mL; KOH contraction = 20 mL", 
             "20 mL CH4 consumes 40 mL O2 (contraction = 40 mL) and produces 20 mL CO2 (absorbed by KOH = 20 mL)")
        ],
        correct_choice="D"
    ))

    # Q17: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_017",
        topic=topic,
        difficulty="advanced",
        lead="Match the back-titration analysis of the mineral sample in List I with its percentage purity in List II:",
        pairs=[
            ("1.25 g limestone treated with 50 mL 0.50 M HCl; excess HCl requires 15 mL 0.50 M NaOH", "I", "70.0% CaCO3 purity", 
             "Total HCl = 25 mmol; excess = 7.5 mmol; reacted = 17.5 mmol. CaCO3 = 17.5 / 2 = 8.75 mmol = 0.875 g. % purity = (0.875 / 1.25) x 100 = 70.0%"),
            ("2.00 g impure Mg(OH)2 treated with 100 mL 1.0 M HCl; excess requires 40 mL 1.0 M NaOH", "III", "87.48% Mg(OH)2 purity", 
             "Reacted HCl = 100 - 40 = 60 mmol. Mg(OH)2 = 30 mmol = 30 x 10^-3 x 58.32 = 1.7496 g. % purity = (1.7496 / 2.00) x 100 = 87.48%"),
            ("1.00 g impure Zn treated with excess acid; evolved H2 reduces exactly 0.795 g CuO to Cu", "IV", "65.38% Zn purity", 
             "Moles CuO = 0.795 / 79.5 = 0.010 mol = moles H2 = moles Zn. Mass Zn = 0.010 x 65.38 = 0.6538 g. % purity = 65.38%"),
            ("0.50 g impure Ba(OH)2 neutralized by 25 mL of 0.20 M HNO3", "II", "85.67% Ba(OH)2 purity", 
             "HNO3 = 5.0 mmol. Ba(OH)2 = 2.5 mmol = 2.5 x 10^-3 x 171.34 = 0.4284 g. % purity = (0.4284 / 0.50) x 100 = 85.67%")
        ],
        correct_choice="A"
    ))

    # Q18: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_018",
        topic=topic,
        difficulty="advanced",
        lead="Match the aqueous solution concentration in List I with its converted equivalent in List II:",
        pairs=[
            ("3.0 M aqueous NaCl solution of density 1.10 g/mL", "II", "Molality m = 3.24 mol/kg", 
             "Mass of 1 L solution = 1100 g; NaCl = 3 x 58.44 = 175.32 g; solvent = 924.68 g = 0.9247 kg. Molality = 3.0 / 0.9247 = 3.24 mol/kg"),
            ("Aqueous solution of urea with mole fraction X_urea = 0.05", "IV", "Molality m = 2.92 mol/kg", 
             "X_water = 0.95. For 0.05 mol urea, mass of water = 0.95 x 18 = 17.1 g = 0.0171 kg. Molality = 0.05 / 0.0171 = 2.92 mol/kg"),
            ("20.0% (w/w) aqueous KI solution of density 1.202 g/mL", "I", "Molarity M = 1.45 M", 
             "M = (% w/w x d x 10) / Molar mass = (20 x 1.202 x 10) / 166 = 1.448 M approx 1.45 M"),
            ("1.00 m aqueous glucose solution of density 1.06 g/mL", "III", "Molarity M = 0.898 M", 
             "1 mol glucose (180 g) in 1000 g water = 1180 g solution. Volume = 1180 / 1.06 = 1113.2 mL = 1.1132 L. M = 1.00 / 1.1132 = 0.898 M")
        ],
        correct_choice="B"
    ))

    # Q19: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_019",
        topic=topic,
        difficulty="advanced",
        lead="Match the disproportionation reaction in List I with the equivalent weight of the specified reactant in terms of molar mass M in List II:",
        pairs=[
            ("Cl2 in cold dilute NaOH: Cl2 + 2OH- -> Cl- + ClO- + H2O (Eq. wt of Cl2)", "III", "M / 1 (n-factor = 1)", 
             "1 mol Cl2 disproportionates into 1 mol Cl- and 1 mol ClO-, transferring 1 mol of electrons. Thus n-factor = 1 and Eq. wt = M / 1"),
            ("Cl2 in hot concentrated NaOH: 3Cl2 + 6OH- -> 5Cl- + ClO3- + 3H2O (Eq. wt of Cl2)", "IV", "5M / 6 (n-factor = 5/3)", 
             "3 mol Cl2 transfers 5 mol electrons (5 reduced to Cl-, 1 oxidized to ClO3-). Thus per mol Cl2, n-factor = 5/3 and Eq. wt = M / (5/3) = 5M / 6"),
            ("White phosphorus in alkaline medium: P4 + 3OH- + 3H2O -> PH3 + 3H2PO2- (Eq. wt of P4)", "I", "M / 3 (n-factor = 3)", 
             "1 P atom reduced (0 to -3, 3 electrons) and 3 P oxidized (0 to +1, 3 electrons). Total electrons transferred per P4 = 3. Eq. wt = M / 3"),
            ("Disproportionation of H2O2: 2H2O2 -> 2H2O + O2 (Eq. wt of H2O2)", "II", "M / 1 (n-factor = 1)", 
             "2 mol H2O2 transfers 2 mol electrons (1 oxidized to O2, 1 reduced to H2O). Per mol H2O2, n-factor = 1 and Eq. wt = M / 1")
        ],
        correct_choice="C"
    ))

    # Q20: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_020",
        topic=topic,
        difficulty="advanced",
        lead="Match the salt concentrations in mineral water in List I with its hardness in ppm CaCO3 equivalents in List II:",
        pairs=[
            ("16.2 mg/L of Ca(HCO3)2 (M = 162 g/mol)", "IV", "10.0 ppm temporary hardness", 
             "16.2 mg/L Ca(HCO3)2 = (16.2 / 162) x 100 = 10.0 mg/L CaCO3 = 10.0 ppm temporary hardness"),
            ("12.0 mg/L of MgSO4 (M = 120 g/mol)", "II", "10.0 ppm permanent hardness", 
             "12.0 mg/L MgSO4 = (12.0 / 120) x 100 = 10.0 mg/L CaCO3 = 10.0 ppm permanent hardness"),
            ("11.1 mg/L CaCl2 (M = 111) and 9.5 mg/L MgCl2 (M = 95)", "I", "20.0 ppm permanent hardness", 
             "CaCl2: (11.1/111) x 100 = 10.0 ppm; MgCl2: (9.5/95) x 100 = 10.0 ppm. Total permanent hardness = 20.0 ppm"),
            ("16.2 mg/L Ca(HCO3)2 and 14.6 mg/L Mg(HCO3)2 (M = 146)", "III", "20.0 ppm temporary hardness", 
             "Ca(HCO3)2: (16.2/162) x 100 = 10.0 ppm; Mg(HCO3)2: (14.6/146) x 100 = 10.0 ppm. Total temporary hardness = 20.0 ppm")
        ],
        correct_choice="D"
    ))

    return questions
