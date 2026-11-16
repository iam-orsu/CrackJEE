"""
Part 4: Redox Reactions (chem_pc2_061 to chem_pc2_080)
20 questions: 4 beginner, 8 intermediate, 8 advanced
Answers: 5 A, 5 B, 5 C, 5 D
"""
from builder import make_matrix_q

def get_redox_questions() -> list:
    qs = []
    topic = "Redox Reactions"

    # Q061 (beginner, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_061",
        topic,
        "beginner",
        "Match the chemical compound in List I with the oxidation state of the underlined atom in List II:",
        [
            ("CrO5 (butterfly structure with two peroxo linkages: CrO(O2)2)", "II", "+6", "Chromium has 4 peroxo oxygens (each -1) and 1 oxo oxygen (-2): x + 4(-1) + 1(-2) = 0 => x = +6."),
            ("H2_S_O5 (Caro's acid, containing one peroxo bond: H-O-O-SO2-OH)", "IV", "+6", "Sulfur has 2 hydroxy oxygens (-2 each from OH-), 2 oxo oxygens (-2 each), and 1 peroxo group (-1): x + 2(+1) + 3(-2) + 2(-1) = 0 => x - 6 = 0 => x = +6."),
            ("_Fe_3O4 (mixed oxide: FeO · Fe2O3)", "I", "+8/3 (average oxidation state, consisting of one Fe(+2) and two Fe(+3))", "3x + 4(-2) = 0 => 3x = +8 => x = +8/3. Microscopically, it is Fe^(2+)Fe2^(3+)O4."),
            ("Na2_S_4O6 (sodium tetrathionate: -O3S-S-S-SO3-)", "III", "+2.5 (average, with two sulfur atoms at +5 and two central sulfur atoms at 0)", "2(+1) + 4x + 6(-2) = 0 => 4x = 10 => x = +2.5. The structure has S-S central bond (ox state 0) and terminal SO3- groups (ox state +5)."),
        ],
        "A"
    ))

    # Q062 (beginner, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_062",
        topic,
        "beginner",
        "For the reaction: 2FeCl3 + SnCl2 -> 2FeCl2 + SnCl4, match the species / role in List I with its description in List II:",
        [
            ("FeCl3", "III", "Oxidizing agent (Fe is reduced from +3 to +2 by gaining 1 electron per Fe)", "Iron goes from +3 in FeCl3 to +2 in FeCl2 (decrease in oxidation number = reduction). Hence FeCl3 is the oxidizing agent."),
            ("SnCl2", "I", "Reducing agent (Sn is oxidized from +2 to +4 by losing 2 electrons)", "Tin goes from +2 in SnCl2 to +4 in SnCl4 (increase in oxidation number = oxidation). Hence SnCl2 is the reducing agent."),
            ("Oxidation half-reaction", "IV", "Sn^(2+) -> Sn^(4+) + 2e-", "Oxidation is loss of electrons; Sn^(2+) loses 2 electrons to become Sn^(4+)."),
            ("Reduction half-reaction", "II", "2Fe^(3+) + 2e- -> 2Fe^(2+)", "Reduction is gain of electrons; two Fe^(3+) ions accept 2 electrons to form two Fe^(2+) ions."),
        ],
        "B"
    ))

    # Q063 (beginner, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_063",
        topic,
        "beginner",
        "Match the redox reaction in List I with its classification type in List II:",
        [
            ("2KClO3(s) -> 2KCl(s) + 3O2(g)", "II", "Intramolecular redox decomposition", "Chlorine is reduced from +5 to -1, while oxygen is oxidized from -2 to 0 within the same compound; it is a decomposition redox reaction."),
            ("Cl2(g) + 2NaOH(cold, dilute) -> NaCl + NaClO + H2O", "IV", "Disproportionation reaction", "Elemental chlorine (0) is simultaneously oxidized to +1 (in NaClO) and reduced to -1 (in NaCl)."),
            ("Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)", "I", "Metal displacement reaction", "Zinc displaces copper from copper sulfate solution; Zn is oxidized (0 to +2) and Cu is reduced (+2 to 0)."),
            ("C(s) + O2(g) -> CO2(g)", "III", "Combination redox reaction", "Elemental carbon (0) combines with elemental oxygen (0) to form CO2 (+4 and -2); combination redox reaction."),
        ],
        "C"
    ))

    # Q064 (beginner, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_064",
        topic,
        "beginner",
        "Match the compound in List I with its equivalent weight in terms of molar mass M in List II:",
        [
            ("KMnO4 in acidic medium (MnO4- -> Mn^(2+))", "II", "M / 5", "Mn changes from +7 to +2 (change of 5 electrons). n-factor = 5. Equivalent weight = M / 5."),
            ("K2Cr2O7 in acidic medium (Cr2O7^(2-) -> 2Cr^(3+))", "IV", "M / 6", "Two Cr atoms change from +6 to +3 (change of 3 electrons per Cr, total 6 electrons). n-factor = 6. Equivalent weight = M / 6."),
            ("FeSO4 in redox titration (Fe^(2+) -> Fe^(3+))", "I", "M / 1", "Fe changes from +2 to +3 (loss of 1 electron). n-factor = 1. Equivalent weight = M / 1 = M."),
            ("H2C2O4 · 2H2O (oxalic acid dihydrate) in redox titration (C2O4^(2-) -> 2CO2)", "III", "M / 2", "Two carbon atoms change from +3 to +4 (total 2 electrons lost). n-factor = 2. Equivalent weight = M / 2."),
        ],
        "D"
    ))

    # Q065 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_065",
        topic,
        "intermediate",
        "Match the reaction of potassium permanganate (KMnO4, molar mass M) in List I with its n-factor and equivalent weight in List II:",
        [
            ("KMnO4 in strongly acidic medium (pH < 3)", "II", "n-factor = 5, Equivalent weight = M / 5 (MnO4- + 8H+ + 5e- -> Mn^(2+) + 4H2O)", "In acidic solution, Mn(+7) is reduced to Mn(+2), gaining 5 electrons. n-factor = 5."),
            ("KMnO4 in neutral or faintly alkaline medium (Baeyer's reagent)", "IV", "n-factor = 3, Equivalent weight = M / 3 (MnO4- + 2H2O + 3e- -> MnO2 + 4OH-)", "In neutral/faintly alkaline solution, Mn(+7) is reduced to insoluble MnO2 (+4), gaining 3 electrons. n-factor = 3."),
            ("KMnO4 in strongly alkaline medium ([OH-] > 1 M)", "I", "n-factor = 1, Equivalent weight = M / 1 (MnO4- + e- -> MnO4^(2-), manganate ion)", "In concentrated alkali, purple permanganate Mn(+7) is reduced to green manganate Mn(+6), gaining 1 electron. n-factor = 1."),
            ("K2Cr2O7 in acidic medium", "III", "n-factor = 6, Equivalent weight = M / 6 (Cr2O7^(2-) + 14H+ + 6e- -> 2Cr^(3+) + 7H2O)", "Each Cr(+6) is reduced to Cr(+3). For Cr2O7^(2-), total electrons gained = 2 · 3 = 6. n-factor = 6."),
        ],
        "A"
    ))

    # Q066 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_066",
        topic,
        "intermediate",
        "Match the disproportionation reaction in List I with the n-factor of the reactant undergoing disproportionation in List II:",
        [
            ("P4 + 3OH- + 3H2O -> PH3 + 3H2PO2-", "III", "n-factor = 3", "P4 (ox state 0) goes to 1 PH3 (-3, gain of 3e-) and 3 H2PO2- (+1, loss of 1e- per P, total 3e-). Total electrons transferred per P4 = 3. Hence n-factor = 3 (Equiv weight = M / 3)."),
            ("Cl2 + 2OH-(cold) -> Cl- + ClO- + H2O", "I", "n-factor = 1 (Equiv weight = M / 1 = M)", "Cl2 (0) -> 1 Cl- (-1, 1e- gained) + 1 ClO- (+1, 1e- lost). Total electrons transferred per mole of Cl2 = 1. n-factor = 1."),
            ("3Cl2 + 6OH-(hot, conc.) -> 5Cl- + ClO3- + 3H2O", "IV", "n-factor = 5/3 per mole of Cl2", "3 moles of Cl2 transfer 5 electrons (1 mole ClO3- formed from 1 Cl atom with change 0 -> +5). For 3 Cl2, electrons transferred = 5. Per mole of Cl2, n-factor = 5/3."),
            ("2H2O2 -> 2H2O + O2", "II", "n-factor = 1 per mole of H2O2", "Oxygen in H2O2 (-1) is oxidized to O2 (0) and reduced to H2O (-2). 2 moles of H2O2 transfer 2 electrons (1 electron per mole). Thus n-factor = 1."),
        ],
        "B"
    ))

    # Q067 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_067",
        topic,
        "intermediate",
        "For balancing the following skeleton redox reaction in acidic medium: a Cr2O7^(2-) + b Fe^(2+) + c H+ -> d Cr^(3+) + e Fe^(3+) + f H2O. Match the stoichiometric coefficient in List I with its balanced integer value in List II:",
        [
            ("Coefficient a of Cr2O7^(2-)", "II", "1", "The half-reactions are: Cr2O7^(2-) + 14H+ + 6e- -> 2Cr^(3+) + 7H2O and Fe^(2+) -> Fe^(3+) + e-. Multiplying the iron equation by 6 balances electrons: 1 Cr2O7^(2-) + 6 Fe^(2+) + 14 H+ -> 2 Cr^(3+) + 6 Fe^(3+) + 7 H2O. Thus a = 1."),
            ("Coefficient b of Fe^(2+)", "IV", "6", "6 moles of Fe^(2+) are oxidized by 1 mole of Cr2O7^(2-), so b = 6."),
            ("Coefficient c of H+", "I", "14", "14 H+ ions are required to combine with 7 oxygens of dichromate, so c = 14."),
            ("Coefficient f of H2O", "III", "7", "7 moles of H2O are produced on the product side, so f = 7."),
        ],
        "C"
    ))

    # Q068 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_068",
        topic,
        "intermediate",
        "For balancing the following redox reaction in basic medium: a MnO4- + b I- + c H2O -> d MnO2 + e IO3- + f OH-. Match the stoichiometric coefficient in List I with its balanced integer value in List II:",
        [
            ("Coefficient a of MnO4-", "II", "2", "Reduction: MnO4- + 2H2O + 3e- -> MnO2 + 4OH- (change = 3e-). Oxidation: I- + 6OH- -> IO3- + 3H2O + 6e- (change = 6e-). Multiplying Mn half-reaction by 2 gives: 2 MnO4- + I- + H2O -> 2 MnO2 + IO3- + 2 OH-. Thus a = 2."),
            ("Coefficient b of I-", "IV", "1", "The stoichiometric coefficient of iodide is 1."),
            ("Coefficient c of H2O", "I", "1", "4 H2O on left - 3 H2O on right = 1 H2O on left, so c = 1."),
            ("Coefficient f of OH-", "III", "2", "8 OH- on right - 6 OH- on left = 2 OH- on right, so f = 2."),
        ],
        "D"
    ))

    # Q069 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_069",
        topic,
        "intermediate",
        "Match the complex redox salt / compound in List I with its n-factor when oxidized completely in acidic medium in List II:",
        [
            ("FeC2O4 (ferrous oxalate -> Fe^(3+) + 2CO2)", "II", "n-factor = 3", "Both Fe^(2+) and C2O4^(2-) are oxidized: Fe^(2+) -> Fe^(3+) + e- (1e-) and C2O4^(2-) -> 2CO2 + 2e- (2e-). Total electrons lost = 1 + 2 = 3."),
            ("Fe2(C2O4)3 (ferric oxalate -> 2Fe^(3+) + 6CO2)", "IV", "n-factor = 6", "Iron is already in +3 oxidation state and does not change. Three oxalate ions C2O4^(2-) each lose 2 electrons: 3 · 2 = 6 electrons lost."),
            ("As2S3 (oxidized to AsO4^(3-) + SO4^(2-))", "I", "n-factor = 28", "Two As(+3) -> 2 As(+5) (4e- lost). Three S(-2) -> 3 S(+6) (3 · 8 = 24e- lost). Total electrons lost = 4 + 24 = 28."),
            ("Cu2S (oxidized to 2Cu^(2+) + SO4^(2-))", "III", "n-factor = 10", "Two Cu(+1) -> 2 Cu(+2) (2e- lost). One S(-2) -> S(+6) in SO4^(2-) (8e- lost). Total electrons lost = 2 + 8 = 10."),
        ],
        "A"
    ))

    # Q070 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_070",
        topic,
        "intermediate",
        "Match the term / reaction in iodometric and iodimetric titrations in List I with its description in List II:",
        [
            ("Iodimetry", "III", "Direct titration of a reducing agent with a standard solution of iodine (I2) in neutral or mildly acidic medium", "Direct titration using standard I2 solution to oxidize analytes like As(III), Sn(II), or H2S is known as iodimetry."),
            ("Iodometry", "I", "Two-step indirect method: analyte oxidizes excess I- to produce I2, which is then titrated with standard Na2S2O3", "In iodometry, an oxidizing agent (like Cu^(2+), Cr2O7^(2-), ClO-) reacts with excess KI to liberate I2, which is quantitatively titrated against standard thiosulfate."),
            ("Reaction of I2 with sodium thiosulfate: 2S2O3^(2-) + I2 -> S4O6^(2-) + 2I-", "IV", "n-factor of Na2S2O3 is 1; thiosulfate is oxidized to tetrathionate", "Two S2O3^(2-) ions lose 2 electrons to form S4O6^(2-) (tetrathionate). Per mole of Na2S2O3, 1 electron is lost (n-factor = 1)."),
            ("Starch indicator endpoint in iodometric titration", "II", "Added near the end of titration; deep blue starch-triiodide complex turns colorless at equivalence", "Starch forms a dark blue complex with I3-. Near the endpoint (straw yellow color), starch is added, and disappearance of blue color marks the endpoint."),
        ],
        "B"
    ))

    # Q071 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_071",
        topic,
        "intermediate",
        "For hydrogen peroxide (H2O2) solutions, match the concentration specification in List I with its calculated value in List II (molar mass H2O2 = 34 g/mol, molar gas volume at STP = 22.4 L):",
        [
            ("\"10 Volume\" H2O2 solution", "II", "Molarity M = 10 / 11.2 ≈ 0.893 M", "Volume strength = 11.2 · M. Hence M = 10 / 11.2 ≈ 0.893 M."),
            ("\"20 Volume\" H2O2 solution", "IV", "Normality N = 20 / 5.6 ≈ 3.57 N", "Volume strength = 5.6 · N. Hence N = 20 / 5.6 ≈ 3.57 N."),
            ("Percentage strength (w/v) of \"10 Volume\" H2O2", "I", "≈ 3.04% (w/v)", "Strength = M · 34 g/L = 0.893 · 34 ≈ 30.36 g/L = 3.036 g/100 mL ≈ 3.04%."),
            ("Volume of O2 gas liberated at STP by decomposition of 100 mL of \"20 Volume\" H2O2", "III", "2000 mL = 2.0 L", "By definition, 1 mL of \"20 Volume\" H2O2 produces 20 mL of O2 at STP. Thus 100 mL produces 100 · 20 = 2000 mL = 2.0 L."),
        ],
        "C"
    ))

    # Q072 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_072",
        topic,
        "intermediate",
        "Match the halogen oxoacid / oxoanion in List I with the oxidation state of the halogen and its redox property in List II:",
        [
            ("ClO- (hypochlorite ion)", "II", "Oxidation state +1; strong oxidizing agent, readily disproportionates into Cl- and ClO3- on warming", "Chlorine has oxidation state +1. It is a powerful oxidant and disproportionates: 3ClO- -> 2Cl- + ClO3-."),
            ("ClO4- (perchlorate ion)", "IV", "Oxidation state +7; highest oxidation state, cannot be oxidized further, acts only as an oxidizing agent", "Chlorine is at its maximum oxidation state (+7). It can only undergo reduction, never oxidation."),
            ("ClO2 (chlorine dioxide)", "I", "Oxidation state +4; odd-electron paramagnetic radical, disproportionates in alkaline medium into ClO2- and ClO3-", "Cl has oxidation state +4. It contains 19 valence electrons (odd-electron radical). In base: 2ClO2 + 2OH- -> ClO2- + ClO3- + H2O."),
            ("ClO3- (chlorate ion)", "III", "Oxidation state +5; can act as both oxidizing agent and undergo further oxidation to perchlorate (+7)", "In ClO3-, Cl is +5, an intermediate oxidation state, so it can be reduced (to Cl- or Cl2) or oxidized to ClO4-."),
        ],
        "D"
    ))

    # Q073 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_073",
        topic,
        "advanced",
        "From the Latimer diagram for manganese in acidic medium: MnO4- --(0.56 V)--> MnO4^(2-) --(2.26 V)--> MnO2 --(0.95 V)--> Mn^(3+) --(1.51 V)--> Mn^(2+) --(-1.18 V)--> Mn. Match the reduction couple in List I with its standard reduction potential E° or thermodynamic behavior in List II:",
        [
            ("Standard potential for MnO4- -> MnO2 (3-electron reduction)", "II", "E° = (1 · 0.56 + 2 · 2.26) / 3 = 1.693 V", "ΔG° = -n F E°. For MnO4- -> MnO4^(2-) (1e-, 0.56 V) and MnO4^(2-) -> MnO2 (2e-, 2.26 V): n_total E° = 1·(0.56) + 2·(2.26) = 0.56 + 4.52 = 5.08 V. E° = 5.08 / 3 ≈ 1.693 V."),
            ("Thermodynamic stability of manganate ion MnO4^(2-) in acidic medium", "IV", "Highly unstable; disproportionates spontaneously into MnO4- and MnO2 because E°_right (2.26 V) > E°_left (0.56 V)", "A species disproportionates if the potential to its right is greater than the potential to its left in a Latimer diagram (E°_right - E°_left = 2.26 - 0.56 = +1.70 V > 0)."),
            ("Thermodynamic stability of Mn^(3+) in aqueous acidic solution", "I", "Unstable; disproportionates into MnO2 and Mn^(2+) because E°(Mn3+/Mn2+) = 1.51 V > E°(MnO2/Mn3+) = 0.95 V", "E°_right (1.51 V) > E°_left (0.95 V), so 2Mn^(3+) + 2H2O -> MnO2 + Mn^(2+) + 4H+ has positive cell potential: ΔE° = 1.51 - 0.95 = +0.56 V > 0."),
            ("Standard potential for MnO4- -> Mn^(2+) (5-electron reduction)", "III", "E° = (1 · 0.56 + 2 · 2.26 + 1 · 0.95 + 1 · 1.51) / 5 = 7.54 / 5 = 1.51 V", "Sum of n_i E°_i = 0.56 + 4.52 + 0.95 + 1.51 = 7.54 V. E° = 7.54 / 5 = 1.508 ≈ 1.51 V."),
        ],
        "A"
    ))

    # Q074 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_074",
        topic,
        "advanced",
        "When potassium ferrocyanide K4[Fe(CN)6] is oxidized by KMnO4 in acidic medium: Fe^(2+) -> Fe^(3+), C(+2) -> C(+4) (as CO2), and N(-3) -> N(+5) (as NO3-). Match the species / factor in List I with its value in List II:",
        [
            ("n-factor of K4[Fe(CN)6] in this complete oxidation", "III", "61", "Fe^(2+) -> Fe^(3+) (1e-). Six carbon atoms C(+2) -> 6 CO2 (+4): 6 · 2 = 12e-. Six nitrogen atoms N(-3) -> 6 NO3- (+5): 6 · 8 = 48e-. Total electrons lost = 1 + 12 + 48 = 61."),
            ("n-factor of KMnO4 in acidic medium", "I", "5", "MnO4- + 8H+ + 5e- -> Mn^(2+) + 4H2O. Gain of 5 electrons, so n-factor = 5."),
            ("Moles of KMnO4 required to completely oxidize 1 mole of K4[Fe(CN)6]", "IV", "12.2 moles (61 / 5)", "Equivalents must be equal: n1 · M1 = n2 · M2 => 5 · moles(KMnO4) = 61 · 1 => moles(KMnO4) = 61 / 5 = 12.2 moles."),
            ("Equivalent weight of K4[Fe(CN)6] (molar mass M) in this reaction", "II", "M / 61", "Equivalent weight = Molar mass / n-factor = M / 61."),
        ],
        "B"
    ))

    # Q075 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_075",
        topic,
        "advanced",
        "A 0.50 g sample of iron ore containing Fe2O3 is dissolved in acid, and all iron is reduced to Fe^(2+). This solution requires 25.0 mL of 0.020 M K2Cr2O7 in acidic medium for complete oxidation. Match the parameter in List I with its calculated value in List II (atomic mass: Fe = 56, O = 16; molar mass Fe2O3 = 160 g/mol):",
        [
            ("Moles of K2Cr2O7 consumed in titration", "II", "5.0 × 10^(-4) mol", "Moles = M · V = 0.020 M · 0.025 L = 5.0 · 10^(-4) mol."),
            ("Moles of Fe^(2+) present in the sample solution", "IV", "3.0 × 10^(-3) mol", "1 mole of Cr2O7^(2-) reacts with 6 moles of Fe^(2+). Moles of Fe^(2+) = 6 · (5.0 · 10^(-4)) = 3.0 · 10^(-3) mol."),
            ("Mass of Fe2O3 in the sample", "I", "0.24 g", "2 moles of Fe come from 1 mole of Fe2O3. Moles of Fe2O3 = (3.0 · 10^(-3)) / 2 = 1.5 · 10^(-3) mol. Mass = 1.5 · 10^(-3) · 160 = 0.24 g."),
            ("Percentage purity of Fe2O3 in the iron ore sample", "III", "48.0%", "Percentage purity = (0.24 g / 0.50 g) · 100 = 48.0%."),
        ],
        "C"
    ))

    # Q076 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_076",
        topic,
        "advanced",
        "Match the organic redox transformation in List I with the change in oxidation number of the reactive carbon and its n-factor in List II:",
        [
            ("Oxidation of ethanol to acetic acid: CH3CH2OH -> CH3COOH", "II", "Carbon changes from -1 to +3; n-factor = 4 electrons", "In CH3CH2OH, the α-carbon has ox state: x + 2(+1) - 1(O) = 0 => x = -1. In CH3COOH, the carbonyl carbon has ox state: x - 2(O) - 1(OH) = 0 => x = +3. Change = +3 - (-1) = 4 electrons."),
            ("Oxidation of toluene to benzoic acid: C6H5CH3 -> C6H5COOH", "IV", "Methyl carbon changes from -3 to +3; n-factor = 6 electrons", "In toluene, methyl carbon is bonded to 3 H (+1 each) and 1 C (0): x + 3 = 0 => x = -3. In benzoic acid, carboxyl carbon is bonded to 2 O: x - 3 = 0 => x = +3. Change = +3 - (-3) = 6 electrons."),
            ("Oxidation of 2-propanol to acetone: (CH3)2CHOH -> (CH3)2C=O", "I", "Carbon changes from 0 to +2; n-factor = 2 electrons", "In 2-propanol, central carbon is bonded to 1 H (+1) and 1 OH (-1), so ox state = 0. In acetone, carbonyl carbon is bonded to =O (-2), so ox state = +2. Change = 2 electrons."),
            ("Complete combustion of glucose: C6H12O6 + 6O2 -> 6CO2 + 6H2O", "III", "Average carbon ox state changes from 0 to +4; n-factor = 24 electrons", "In C6H12O6, average ox state of C is 0. In CO2, C is +4. Total electrons transferred = 6 · 4 = 24 electrons."),
        ],
        "D"
    ))

    # Q077 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_077",
        topic,
        "advanced",
        "Given standard reduction potentials: E°(Zn^(2+)/Zn) = -0.76 V, E°(Fe^(2+)/Fe) = -0.44 V, E°(Cu^(2+)/Cu) = +0.34 V, E°(Ag+/Ag) = +0.80 V. Match the galvanic cell / combination in List I with its standard cell potential E°_cell in List II:",
        [
            ("Daniell cell: Zn(s) | Zn^(2+)(aq) || Cu^(2+)(aq) | Cu(s)", "II", "E°_cell = +0.34 - (-0.76) = +1.10 V", "E°_cell = E°_cathode - E°_anode = E°(Cu^(2+)/Cu) - E°(Zn^(2+)/Zn) = +0.34 - (-0.76) = +1.10 V."),
            ("Cell: Fe(s) | Fe^(2+)(aq) || Ag+(aq) | Ag(s)", "IV", "E°_cell = +0.80 - (-0.44) = +1.24 V", "E°_cell = E°(Ag+/Ag) - E°(Fe^(2+)/Fe) = +0.80 - (-0.44) = +1.24 V."),
            ("Cell: Zn(s) | Zn^(2+)(aq) || Fe^(2+)(aq) | Fe(s)", "I", "E°_cell = -0.44 - (-0.76) = +0.32 V", "E°_cell = E°(Fe^(2+)/Fe) - E°(Zn^(2+)/Zn) = -0.44 - (-0.76) = +0.32 V."),
            ("Cell: Cu(s) | Cu^(2+)(aq) || Ag+(aq) | Ag(s)", "III", "E°_cell = +0.80 - (+0.34) = +0.46 V", "E°_cell = E°(Ag+/Ag) - E°(Cu^(2+)/Cu) = +0.80 - 0.34 = +0.46 V."),
        ],
        "A"
    ))

    # Q078 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_078",
        topic,
        "advanced",
        "Match the non-stoichiometric compound or complex redox process in List I with its n-factor calculation in List II:",
        [
            ("Oxidation of wüstite Fe0.93O to Fe2O3 in acidic medium", "III", "n-factor = 0.79 per mole of Fe0.93O", "In Fe0.93O, total positive charge = +2. All 0.93 moles of Fe end up as Fe^(3+), with total charge = 0.93 · 3 = 2.79. Electrons lost = 2.79 - 2.00 = 0.79. Hence n-factor = 0.79."),
            ("Oxidation of Fe0.95O to Fe^(3+)", "I", "n-factor = 0.85 per mole of Fe0.95O", "Initial total positive charge = +2. Final charge of 0.95 Fe^(3+) = 0.95 · 3 = 2.85. Electrons lost = 2.85 - 2.00 = 0.85. n-factor = 0.85."),
            ("Oxidation of Cu2S to Cu^(2+) and SO2", "IV", "n-factor = 8 per mole of Cu2S", "2 Cu(+1) -> 2 Cu(+2) (2e- lost). S(-2) -> S(+4) in SO2 (6e- lost). Total electrons lost = 2 + 6 = 8."),
            ("Reduction of hydrazine: N2H4 -> 2NH3", "II", "n-factor = 2 per mole of N2H4", "In N2H4, nitrogen is in -2 oxidation state. In NH3, nitrogen is in -3 oxidation state. Two nitrogen atoms each gain 1 electron: total electrons gained = 2."),
        ],
        "B"
    ))

    # Q079 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_079",
        topic,
        "advanced",
        "Match the titration method / reagent property in List I with its chemical reason or operational principle in List II:",
        [
            ("Why HCl cannot be used to acidify KMnO4 solution in permanganometry", "II", "KMnO4 oxidizes Cl- to toxic Cl2 gas, consuming excess permanganate and introducing positive titration error", "Standard potential of MnO4-/Mn2+ (1.51 V) exceeds that of Cl2/Cl- (1.36 V). KMnO4 spontaneously oxidizes HCl to Cl2, causing erroneous titrant consumption."),
            ("Why dilute H2SO4 is the ideal acidifying agent for KMnO4", "IV", "SO4^(2-) contains sulfur in its highest oxidation state (+6) and cannot be oxidized by KMnO4", "Sulfate ion is completely inert toward oxidation by permanganate because sulfur has already reached its maximum valence (+6)."),
            ("Why K2Cr2O7 can be used in the presence of dilute HCl", "I", "Standard potential of Cr2O7^(2-)/Cr^(3+) (1.33 V) is slightly lower than Cl2/Cl- (1.36 V), so dichromate does not oxidize dilute Cl-", "Under moderate conditions, dichromate is thermodynamically incapable of oxidizing dilute hydrochloric acid, making it suitable for titrating iron in HCl digests."),
            ("Role of diphenylamine sodium sulfonate in dichromate titrations", "III", "Internal redox indicator; oxidized to intense violet-blue diphenylbenzidine sulfonate at the endpoint", "Diphenylamine undergoes irreversible oxidation followed by reversible oxidation to diphenylbenzidine violet when the first drop of excess dichromate is added."),
        ],
        "C"
    ))

    # Q080 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_080",
        topic,
        "advanced",
        "From the standard reduction potentials: E°(Cu^(2+)/Cu+) = +0.15 V, E°(Cu+/Cu) = +0.52 V, E°(Cu^(2+)/Cu) = +0.34 V. Match the thermodynamic / equilibrium property for the disproportionation: 2Cu+(aq) ⇌ Cu^(2+)(aq) + Cu(s) in List I with its value in List II (2.303 RT/F = 0.059 V at 298 K):",
        [
            ("Standard cell potential E° for the disproportionation reaction", "II", "+0.37 V", "Reduction: Cu+ + e- -> Cu (E° = +0.52 V). Oxidation: Cu+ -> Cu^(2+) + e- (E° = -0.15 V). Overall: 2Cu+ -> Cu^(2+) + Cu. E° = +0.52 - (+0.15) = +0.37 V."),
            ("Standard Gibbs energy change ΔG° for the disproportionation reaction", "IV", "-35.7 kJ/mol", "ΔG° = -n F E° = -1 · 96500 · 0.37 J = -35705 J ≈ -35.7 kJ/mol."),
            ("Equilibrium constant K = [Cu^(2+)] / [Cu+]^2 at 298 K", "I", "≈ 1.8 × 10^6", "log K = n E° / 0.059 = 1 · 0.37 / 0.059 = 6.271 => K = 10^(6.271) ≈ 1.87 · 10^6."),
            ("Spontaneity in aqueous solution", "III", "Highly spontaneous; explains why Cu+ cannot exist in significant concentration in uncomplexed aqueous solution", "Because E° > 0 and K is very large (~10^6), Cu+ ions spontaneously and quantitatively disproportionate into Cu^(2+) and metallic Cu in aqueous solution."),
        ],
        "D"
    ))

    return qs
