"""
Part 3: Ionic Equilibrium (chem_pc2_041 to chem_pc2_060)
20 questions: 4 beginner, 8 intermediate, 8 advanced
Answers: 5 A, 5 B, 5 C, 5 D
"""
from builder import make_matrix_q

def get_ioniceq_questions() -> list:
    qs = []
    topic = "Ionic Equilibrium"

    # Q041 (beginner, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_041",
        topic,
        "beginner",
        "Match the chemical species in List I with its conjugate acid / base identity in List II:",
        [
            ("Conjugate acid of NH3", "II", "NH4+", "A conjugate acid is formed when a Brønsted base accepts a proton (H+): NH3 + H+ -> NH4+."),
            ("Conjugate base of HCO3-", "IV", "CO3^(2-)", "A conjugate base is formed when a Brønsted acid donates a proton: HCO3- - H+ -> CO3^(2-)."),
            ("Conjugate acid of H2O", "I", "H3O+", "When H2O acts as a Brønsted base and accepts a proton, it forms the hydronium ion H3O+."),
            ("Conjugate base of HSO4-", "III", "SO4^(2-)", "When hydrogen sulfate ion HSO4- donates a proton (acting as an acid), it forms sulfate ion SO4^(2-)."),
        ],
        "A"
    ))

    # Q042 (beginner, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_042",
        topic,
        "beginner",
        "Match the aqueous strong acid or strong base solution at 25 °C in List I with its pH in List II:",
        [
            ("1.0 × 10^(-3) M HCl", "III", "pH = 3.0", "HCl is a strong monoprotic acid, completely dissociated: [H+] = 10^(-3) M => pH = -log(10^(-3)) = 3.0."),
            ("1.0 × 10^(-4) M NaOH", "I", "pH = 10.0", "NaOH is a strong base: [OH-] = 10^(-4) M => pOH = 4.0 => pH = 14.0 - pOH = 10.0."),
            ("5.0 × 10^(-4) M Ba(OH)2", "IV", "pH = 11.0", "Ba(OH)2 is a strong diacidic base: [OH-] = 2 · (5.0 · 10^(-4)) = 1.0 · 10^(-3) M => pOH = 3.0 => pH = 14 - 3 = 11.0."),
            ("5.0 × 10^(-3) M H2SO4 (assuming complete dissociation of both protons)", "II", "pH = 2.0", "[H+] = 2 · (5.0 · 10^(-3)) = 1.0 · 10^(-2) M => pH = -log(10^(-2)) = 2.0."),
        ],
        "B"
    ))

    # Q043 (beginner, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_043",
        topic,
        "beginner",
        "For a weak monoprotic acid HA (initial concentration C, dissociation constant Ka), match the parameter / formula in List I with its expression according to Ostwald's dilution law in List II (assuming α << 1):",
        [
            ("Degree of dissociation (α)", "II", "α = √(Ka / C)", "For HA ⇌ H+ + A-, Ka = C α^2 / (1 - α). For α << 1, 1 - α ≈ 1, so Ka ≈ C α^2 => α = √(Ka/C)."),
            ("Hydrogen ion concentration ([H+])", "IV", "[H+] = √(Ka · C)", "[H+] = C α = C √(Ka/C) = √(Ka · C)."),
            ("pH of the solution", "I", "pH = 1/2 [pKa - log C]", "pH = -log[H+] = -log(Ka · C)^(1/2) = 1/2 [-log Ka - log C] = 1/2 [pKa - log C]."),
            ("Value of α when dilution is infinite (C -> 0)", "III", "α -> 1 (100% ionization)", "Ostwald's dilution law states that as concentration approaches zero (infinite dilution), the degree of dissociation of a weak electrolyte approaches unity (1)."),
        ],
        "C"
    ))

    # Q044 (beginner, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_044",
        topic,
        "beginner",
        "Match the salt in List I with the nature of its aqueous solution at 25 °C in List II:",
        [
            ("CH3COONa (sodium acetate)", "II", "Basic solution (pH > 7) due to anionic hydrolysis of CH3COO-", "Formed from weak acid (CH3COOH) and strong base (NaOH). The acetate ion undergoes hydrolysis: CH3COO- + H2O ⇌ CH3COOH + OH-, producing OH- (pH > 7)."),
            ("NH4Cl (ammonium chloride)", "IV", "Acidic solution (pH < 7) due to cationic hydrolysis of NH4+", "Formed from strong acid (HCl) and weak base (NH4OH). NH4+ undergoes hydrolysis: NH4+ + H2O ⇌ NH4OH + H+, producing H+ (pH < 7)."),
            ("NaCl (sodium chloride)", "I", "Neutral solution (pH = 7) because neither ion undergoes significant hydrolysis", "Formed from strong acid (HCl) and strong base (NaOH). Neither Na+ nor Cl- hydrolyzes in water; solution remains neutral (pH = 7)."),
            ("CH3COONH4 (ammonium acetate, Ka(CH3COOH) = Kb(NH4OH) = 1.8 × 10^(-5))", "III", "Nearly neutral solution (pH ≈ 7.0) because Ka ≈ Kb", "Both cation and anion hydrolyze. pH = 7 + 1/2(pKa - pKb). Since pKa = pKb, pH = 7.0."),
        ],
        "D"
    ))

    # Q045 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_045",
        topic,
        "intermediate",
        "Match the type of salt in List I with the formula for the pH of its aqueous solution at 25 °C in List II (C is salt molarity):",
        [
            ("Salt of weak acid and strong base (e.g., CH3COONa)", "II", "pH = 7 + 1/2 pKa + 1/2 log C", "Anion hydrolysis produces OH-. [OH-] = √(Kh · C) = √[(Kw/Ka)C]. [H+] = Kw/[OH-] = √(Kw Ka / C). Taking -log: pH = 7 + 1/2 pKa + 1/2 log C."),
            ("Salt of strong acid and weak base (e.g., NH4Cl)", "IV", "pH = 7 - 1/2 pKb - 1/2 log C", "Cation hydrolysis produces H+. [H+] = √(Kh · C) = √[(Kw/Kb)C]. Taking -log: pH = 7 - 1/2 pKb - 1/2 log C."),
            ("Salt of weak acid and weak base (e.g., CH3COONH4)", "I", "pH = 7 + 1/2 pKa - 1/2 pKb, independent of C", "Both ions hydrolyze. Kh = Kw / (Ka · Kb). [H+] = √[Kw · Ka / Kb]. Taking -log: pH = 7 + 1/2 pKa - 1/2 pKb (independent of concentration C)."),
            ("Salt of strong acid and strong base (e.g., KNO3)", "III", "pH = 7.0 at 25 °C, independent of C", "Neither ion hydrolyzes; water autoionization determines [H+] = 10^(-7) M, so pH = 7.0."),
        ],
        "A"
    ))

    # Q046 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_046",
        topic,
        "intermediate",
        "Match the buffer system in List I with its Henderson-Hasselbalch formulation or pH calculation in List II:",
        [
            ("Acidic buffer: CH3COOH (0.1 M) + CH3COONa (0.1 M), pKa = 4.74", "III", "pH = pKa + log([salt]/[acid]) = 4.74", "Henderson-Hasselbalch equation: pH = pKa + log([salt]/[acid]). Since [salt] = [acid] = 0.1 M, log(1) = 0, so pH = 4.74."),
            ("Acidic buffer: CH3COOH (0.1 M) + CH3COONa (1.0 M), pKa = 4.74", "I", "pH = 4.74 + log(10) = 5.74", "[salt]/[acid] = 1.0 / 0.1 = 10. pH = 4.74 + log(10) = 4.74 + 1.0 = 5.74."),
            ("Basic buffer: NH4OH (0.1 M) + NH4Cl (0.1 M), pKb = 4.74", "IV", "pOH = 4.74, so pH = 14 - 4.74 = 9.26", "Henderson-Hasselbalch for basic buffer: pOH = pKb + log([salt]/[base]) = 4.74 + 0 = 4.74. Thus pH = 14 - 4.74 = 9.26."),
            ("Acidic buffer: Formic acid HCOOH (0.2 M) + HCOONa (0.02 M), pKa = 3.75", "II", "pH = 3.75 + log(0.1) = 2.75", "[salt]/[acid] = 0.02 / 0.2 = 0.1. pH = 3.75 + log(0.1) = 3.75 - 1.0 = 2.75."),
        ],
        "B"
    ))

    # Q047 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_047",
        topic,
        "intermediate",
        "Match the buffer property / concept in List I with its mathematical condition or definition in List II:",
        [
            ("Maximum buffer capacity (β_max) of an acidic buffer", "II", "[salt] = [acid], i.e., pH = pKa", "Van Slyke defined buffer capacity β = d(B)/d(pH) = 2.303 C [Ka[H+] / (Ka + [H+])^2]. Differentiating with respect to [H+] shows β is maximized when [H+] = Ka, i.e., pH = pKa."),
            ("Effective buffer range", "IV", "pH = pKa ± 1.0", "A buffer is effective when the ratio [salt]/[acid] lies between 0.1 and 10, corresponding to pH = pKa ± log(10) = pKa ± 1."),
            ("Addition of a small amount of strong acid (x mol/L) to an acidic buffer", "I", "Converts x moles of A- into HA: [HA] increases to [HA]0 + x, [A-] decreases to [A-]0 - x", "Added H+ reacts quantitatively with the conjugate base: H+ + A- -> HA, so [A-] decreases by x and [HA] increases by x."),
            ("Addition of a small amount of strong base (y mol/L) to an acidic buffer", "III", "Converts y moles of HA into A-: [HA] decreases to [HA]0 - y, [A-] increases to [A-]0 + y", "Added OH- reacts with undissociated acid: OH- + HA -> A- + H2O, decreasing [HA] by y and increasing [A-] by y."),
        ],
        "C"
    ))

    # Q048 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_048",
        topic,
        "intermediate",
        "Match the sparingly soluble salt formula in List I with the relation connecting its molar solubility s (mol/L) and solubility product Ksp in pure water in List II:",
        [
            ("AB type (e.g., AgCl, BaSO4)", "II", "Ksp = s^2, so s = √(Ksp)", "AB(s) ⇌ A+ + B-. [A+] = s, [B-] = s. Ksp = s · s = s^2 => s = √(Ksp)."),
            ("AB2 type (e.g., CaF2, PbCl2)", "IV", "Ksp = 4 s^3, so s = (Ksp / 4)^(1/3)", "AB2(s) ⇌ A^(2+) + 2B^-. [A^(2+)] = s, [B^-] = 2s. Ksp = (s)(2s)^2 = 4 s^3 => s = (Ksp/4)^(1/3)."),
            ("A2B3 type (e.g., Al2(SO4)3, As2S3)", "I", "Ksp = 108 s^5, so s = (Ksp / 108)^(1/5)", "A2B3(s) ⇌ 2A^(3+) + 3B^(2-). [A^(3+)] = 2s, [B^(2-)] = 3s. Ksp = (2s)^2 · (3s)^3 = 4s^2 · 27s^3 = 108 s^5."),
            ("AB3 type (e.g., Al(OH)3, Fe(OH)3)", "III", "Ksp = 27 s^4, so s = (Ksp / 27)^(1/4)", "AB3(s) ⇌ A^(3+) + 3B^-. [A^(3+)] = s, [B^-] = 3s. Ksp = (s)(3s)^3 = 27 s^4 => s = (Ksp/27)^(1/4)."),
        ],
        "D"
    ))

    # Q049 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_049",
        topic,
        "intermediate",
        "Given Ksp(AgCl) = 1.0 × 10^(-10) and Ksp(Ag2CrO4) = 4.0 × 10^(-12) at 25 °C. Match the system / condition in List I with its solubility value in List II:",
        [
            ("Molar solubility of AgCl in pure water", "II", "1.0 × 10^(-5) mol/L", "For AgCl, s = √(Ksp) = √(1.0 · 10^(-10)) = 1.0 · 10^(-5) M."),
            ("Molar solubility of AgCl in 0.1 M NaCl solution (common ion effect)", "IV", "1.0 × 10^(-9) mol/L", "[Cl-] ≈ 0.1 M. s' = Ksp / [Cl-] = 1.0 · 10^(-10) / 0.1 = 1.0 · 10^(-9) M."),
            ("Molar solubility of Ag2CrO4 in pure water", "I", "1.0 × 10^(-4) mol/L", "For Ag2CrO4 (AB2 type), Ksp = 4s^3 = 4.0 · 10^(-12) => s^3 = 1.0 · 10^(-12) => s = 1.0 · 10^(-4) M."),
            ("Molar solubility of Ag2CrO4 in 0.1 M AgNO3 solution", "III", "4.0 × 10^(-10) mol/L", "[Ag+] ≈ 0.1 M. Ksp = [Ag+]^2 [CrO4^(2-)] = (0.1)^2 · s' = 4.0 · 10^(-12) => 0.01 s' = 4.0 · 10^(-12) => s' = 4.0 · 10^(-10) M."),
        ],
        "A"
    ))

    # Q050 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_050",
        topic,
        "intermediate",
        "Match the comparison between ionic product (Qsp) and solubility product (Ksp) in List I with the physical state of the solution in List II:",
        [
            ("Qsp < Ksp", "III", "Unsaturated solution; no precipitate forms, and more solute can dissolve", "Ion concentrations are below saturation equilibrium; the forward dissolution process is favored if solid is added."),
            ("Qsp = Ksp", "I", "Saturated solution in dynamic equilibrium with undissolved solute", "The rate of dissolution equals rate of precipitation; no net change occurs."),
            ("Qsp > Ksp", "IV", "Supersaturated solution; precipitation occurs until Qsp decreases to Ksp", "Ion product exceeds solubility product, driving spontaneous precipitation of excess solute."),
            ("Mixing equal volumes of 2 × 10^(-4) M BaCl2 and 2 × 10^(-4) M Na2SO4 (Ksp of BaSO4 = 1.0 × 10^(-10))", "II", "Precipitate forms because Qsp = 1.0 × 10^(-8) > Ksp", "Upon mixing equal volumes, concentrations halve: [Ba2+] = 10^(-4) M, [SO4^(2-)] = 10^(-4) M. Qsp = 10^(-4) · 10^(-4) = 1.0 · 10^(-8) > 1.0 · 10^(-10), so BaSO4 precipitates."),
        ],
        "B"
    ))

    # Q051 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_051",
        topic,
        "intermediate",
        "Match the acid-base indicator in List I with its working pH range and transition color in List II:",
        [
            ("Phenolphthalein (pK_In ≈ 9.1)", "II", "pH 8.3 to 10.0; colorless in acid to pink in base", "Phenolphthalein changes from colorless (HIn) to pink (In-) in the pH range 8.3 - 10.0; ideal for weak acid vs strong base titration."),
            ("Methyl orange (pK_In ≈ 3.7)", "IV", "pH 3.1 to 4.4; red in acid to yellow in base", "Methyl orange changes from red (HIn) to yellow (In-) in the pH range 3.1 - 4.4; ideal for strong acid vs weak base titration."),
            ("Bromothymol blue (pK_In ≈ 7.0)", "I", "pH 6.0 to 7.6; yellow in acid to blue in base", "Bromothymol blue changes from yellow to blue across pH 6.0 - 7.6 (green at neutral); ideal for strong acid vs strong base titration."),
            ("General indicator formula for color change mid-point", "III", "pH = pK_In, where [In-] = [HIn]", "At the mid-point of color change, concentrations of acid and base forms are equal, so [In-]/[HIn] = 1, giving pH = pK_In."),
        ],
        "C"
    ))

    # Q052 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_052",
        topic,
        "intermediate",
        "For a diprotic acid H2A with dissociation constants Ka1 = 1.0 × 10^(-4) and Ka2 = 1.0 × 10^(-9) at concentration C = 0.1 M, match the species / parameter in List I with its calculated value in List II:",
        [
            ("Concentration of [H+] in aqueous solution", "II", "3.16 × 10^(-3) M (pH ≈ 2.5)", "Since Ka1 >> Ka2, first dissociation dominates: [H+] ≈ √(Ka1 · C) = √(10^(-4) · 0.1) = √(10^(-5)) ≈ 3.16 · 10^(-3) M."),
            ("Concentration of divalent anion [A^(2-)] in aqueous solution", "IV", "1.0 × 10^(-9) M (independent of C)", "From second dissociation HA- ⇌ H+ + A^(2-): Ka2 = [H+][A^(2-)] / [HA-]. Since [H+] ≈ [HA-], [A^(2-)] ≈ Ka2 = 1.0 · 10^(-9) M."),
            ("pH of sodium hydrogen salt NaHA solution (amphiprotic salt)", "I", "pH = 1/2 (pKa1 + pKa2) = 1/2 (4 + 9) = 6.5", "For an amphiprotic anion HA-, pH = 1/2(pKa1 + pKa2) = 1/2(4.0 + 9.0) = 6.5, independent of salt concentration."),
            ("Degree of first dissociation α1", "III", "α1 = √(Ka1 / C) = √(10^(-4) / 0.1) ≈ 0.0316 (3.16%)", "α1 = √(Ka1 / C) = √(10^(-3)) ≈ 0.0316 or 3.16%."),
        ],
        "D"
    ))

    # Q053 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_053",
        topic,
        "advanced",
        "Match the extremely dilute or temperature-dependent aqueous solution in List I with its accurate pH calculation taking water autoionization into account in List II:",
        [
            ("1.0 × 10^(-8) M HCl at 25 °C (Kw = 1.0 × 10^(-14))", "II", "pH = 6.98 (taking water autoionization into account)", "Total [H+] = 10^(-8) + x, where x is [H+] from H2O. (10^(-8) + x)x = 10^(-14) => x^2 + 10^(-8)x - 10^(-14) = 0 => x = 0.95 · 10^(-7) M. Total [H+] = 1.05 · 10^(-7) M => pH = -log(1.05 · 10^(-7)) = 6.98."),
            ("1.0 × 10^(-8) M NaOH at 25 °C", "IV", "pH = 7.02 (pOH = 6.98)", "Similarly, total [OH-] = 1.05 · 10^(-7) M => pOH = 6.98 => pH = 14.00 - 6.98 = 7.02."),
            ("Pure water at 80 °C where Kw = 2.5 × 10^(-13)", "I", "pH = 6.30 (solution is neutral because [H+] = [OH-])", "In pure water, [H+] = √(Kw) = √(2.5 · 10^(-13)) = 5.0 · 10^(-7) M => pH = -log(5.0 · 10^(-7)) = 6.30. Since [H+] = [OH-], water remains neutral."),
            ("1.0 × 10^(-7) M HCl at 25 °C", "III", "pH = 6.79", "[H+] = 10^(-7) + x. (10^(-7) + x)x = 10^(-14) => x^2 + 10^(-7)x - 10^(-14) = 0 => x = 0.618 · 10^(-7) M. Total [H+] = 1.618 · 10^(-7) M => pH = 6.79."),
        ],
        "A"
    ))

    # Q054 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_054",
        topic,
        "advanced",
        "A saturated solution contains two sparingly soluble silver salts in contact with excess solid: AgCl (Ksp1 = 1.8 × 10^(-10)) and AgBr (Ksp2 = 5.4 × 10^(-13)). Match the equilibrium quantity in List I with its value in List II:",
        [
            ("Ratio of concentrations [Cl-] / [Br-] in the solution", "III", "333.3", "[Ag+] is common to both equilibria. [Cl-] = Ksp1 / [Ag+] and [Br-] = Ksp2 / [Ag+]. Thus [Cl-] / [Br-] = Ksp1 / Ksp2 = (1.8 · 10^(-10)) / (5.4 · 10^(-13)) = 333.3."),
            ("Total [Ag+] concentration in the solution", "I", "1.34 × 10^(-5) M", "[Ag+] = [Cl-] + [Br-] = Ksp1/[Ag+] + Ksp2/[Ag+] => [Ag+]^2 = Ksp1 + Ksp2 ≈ 1.805 · 10^(-10) => [Ag+] = √(1.805 · 10^(-10)) ≈ 1.34 · 10^(-5) M."),
            ("Concentration of [Cl-] in the solution", "IV", "1.34 × 10^(-5) M", "[Cl-] = Ksp1 / [Ag+] = 1.8 · 10^(-10) / (1.34 · 10^(-5)) ≈ 1.34 · 10^(-5) M."),
            ("Concentration of [Br-] in the solution", "II", "4.03 × 10^(-8) M", "[Br-] = Ksp2 / [Ag+] = 5.4 · 10^(-13) / (1.34 · 10^(-5)) ≈ 4.03 · 10^(-8) M."),
        ],
        "B"
    ))

    # Q055 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_055",
        topic,
        "advanced",
        "A solution contains 0.01 M Cl- and 0.01 M CrO4^(2-). AgNO3 is slowly added. Ksp(AgCl) = 1.8 × 10^(-10), Ksp(Ag2CrO4) = 1.8 × 10^(-12). Match the event / parameter in List I with its calculated value in List II:",
        [
            ("[Ag+] required to start precipitation of AgCl", "II", "1.8 × 10^(-8) M", "Precipitation of AgCl begins when [Ag+][Cl-] = Ksp(AgCl) => [Ag+] = 1.8 · 10^(-10) / 0.01 = 1.8 · 10^(-8) M."),
            ("[Ag+] required to start precipitation of Ag2CrO4", "IV", "1.34 × 10^(-5) M", "Precipitation of Ag2CrO4 begins when [Ag+]^2 [CrO4^(2-)] = Ksp => [Ag+] = √(1.8 · 10^(-12) / 0.01) = √(1.8 · 10^(-10)) ≈ 1.34 · 10^(-5) M."),
            ("Salt that precipitates first upon adding AgNO3", "I", "AgCl precipitates first because it requires much lower [Ag+] (1.8 × 10^(-8) M vs 1.34 × 10^(-5) M)", "Since 1.8 · 10^(-8) M < 1.34 · 10^(-5) M, AgCl precipitates first."),
            ("[Cl-] remaining in solution when Ag2CrO4 just begins to precipitate", "III", "1.34 × 10^(-5) M", "At onset of Ag2CrO4 precipitation, [Ag+] = 1.34 · 10^(-5) M. Thus [Cl-] = Ksp(AgCl) / [Ag+] = (1.8 · 10^(-10)) / (1.34 · 10^(-5)) = 1.34 · 10^(-5) M (99.87% of Cl- has precipitated)."),
        ],
        "C"
    ))

    # Q056 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_056",
        topic,
        "advanced",
        "AgCl dissolves in aqueous ammonia due to complex formation: AgCl(s) + 2NH3(aq) ⇌ [Ag(NH3)2]+(aq) + Cl-(aq). Given Ksp(AgCl) = 1.8 × 10^(-10) and formation constant Kf of [Ag(NH3)2]+ is 1.7 × 10^7. Match the parameter in List I with its value in List II:",
        [
            ("Equilibrium constant K for the overall dissolution reaction", "II", "K = Ksp · Kf ≈ 3.06 × 10^(-3)", "Adding AgCl(s) ⇌ Ag+ + Cl- (Ksp) and Ag+ + 2NH3 ⇌ [Ag(NH3)2]+ (Kf) gives the net reaction with K = Ksp · Kf = 1.8 · 10^(-10) · 1.7 · 10^7 = 3.06 · 10^(-3)."),
            ("Molar solubility of AgCl in 1.0 M NH3 solution", "IV", "0.052 mol/L", "AgCl + 2NH3 ⇌ [Ag(NH3)2]+ + Cl-. Let solubility be s. [Ag(NH3)2]+ = s, [Cl-] = s, [NH3] = 1.0 - 2s. K = s^2 / (1 - 2s)^2 => s / (1 - 2s) = √(3.06 · 10^(-3)) ≈ 0.0553 => s = 0.0553 - 0.1106s => 1.1106s = 0.0553 => s ≈ 0.050 - 0.052 mol/L."),
            ("Solubility ratio of AgCl in 1.0 M NH3 compared to pure water (s_water = 1.34 × 10^(-5) M)", "I", "≈ 3900 times greater", "Ratio = 0.052 / (1.34 · 10^(-5)) ≈ 3880 ≈ 3900 times enhancement due to complexation."),
            ("Effect of adding HNO3 to the ammoniacal AgCl solution", "III", "Reprecipitates AgCl because H+ protonates NH3 to NH4+, destroying the complex", "H+ reacts with free NH3: NH3 + H+ -> NH4+, shifting complex equilibrium backward, releasing Ag+ which precipitates with Cl- as AgCl(s)."),
        ],
        "D"
    ))

    # Q057 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_057",
        topic,
        "advanced",
        "For the titration of 50 mL of 0.10 M CH3COOH (pKa = 4.74) with 0.10 M NaOH, match the titration stage in List I with the calculated pH in List II:",
        [
            ("Initial state (0 mL NaOH added)", "II", "pH = 2.87", "[H+] = √(Ka · C) = √(1.8 · 10^(-5) · 0.10) = 1.34 · 10^(-3) M => pH = 2.87."),
            ("Half-equivalence point (25 mL NaOH added)", "IV", "pH = pKa = 4.74", "At half-neutralization, [CH3COO-] = [CH3COOH], so log([salt]/[acid]) = 0 and pH = pKa = 4.74."),
            ("Equivalence point (50 mL NaOH added, total volume = 100 mL, [CH3COONa] = 0.05 M)", "I", "pH = 8.72", "Only CH3COONa present at C = 0.05 M. pH = 7 + 1/2 pKa + 1/2 log C = 7 + 2.37 + 1/2(-1.30) = 9.37 - 0.65 = 8.72."),
            ("Past equivalence point (60 mL NaOH added, 10 mL excess NaOH in 110 mL)", "III", "pH = 11.96", "Excess [OH-] = (10 mL · 0.10 M) / 110 mL = 0.00909 M. pOH = -log(0.00909) = 2.04 => pH = 14.00 - 2.04 = 11.96."),
        ],
        "A"
    ))

    # Q058 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_058",
        topic,
        "advanced",
        "For a diprotic acid H2A (total analytical concentration C = 0.1 M, Ka1 = 10^(-4), Ka2 = 10^(-8)), match the fraction of species α in List I with its formula or value at pH = 4.0 in List II (D = [H+]^2 + Ka1[H+] + Ka1 Ka2):",
        [
            ("Fraction of fully protonated acid α0 = [H2A] / C", "III", "[H+]^2 / D = 0.50 (at pH = 4.0, [H+] = 10^(-4))", "At [H+] = 10^(-4): [H+]^2 = 10^(-8), Ka1[H+] = 10^(-8), Ka1 Ka2 = 10^(-12). D = 2 · 10^(-8). α0 = 10^(-8) / (2 · 10^(-8)) = 0.50."),
            ("Fraction of monodeprotonated species α1 = [HA-] / C", "I", "Ka1 [H+] / D = 0.50 (at pH = 4.0)", "α1 = Ka1[H+] / D = 10^(-8) / (2 · 10^(-8)) = 0.50."),
            ("Fraction of fully deprotonated species α2 = [A^(2-)] / C", "IV", "Ka1 Ka2 / D = 5.0 × 10^(-5) (at pH = 4.0)", "α2 = Ka1 Ka2 / D = 10^(-12) / (2 · 10^(-8)) = 5.0 · 10^(-5)."),
            ("Condition where [H2A] = [A^(2-)]", "II", "[H+] = √(Ka1 · Ka2) = 1.0 × 10^(-6) M (pH = 6.0)", "Equating α0 and α2 gives [H+]^2 = Ka1 Ka2 => [H+] = √(Ka1 Ka2) = √(10^(-12)) = 10^(-6) M (pH = 6.0)."),
        ],
        "B"
    ))

    # Q059 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_059",
        topic,
        "advanced",
        "For solubility of salts of weak acids in acidic solution, match the sparingly soluble salt in List I with the effect of decreasing pH on its solubility in List II:",
        [
            ("CaF2 in aqueous acid (HF is weak acid, Ka = 6.8 × 10^(-4))", "II", "Solubility increases significantly because F- is protonated to HF, shifting dissolution forward", "F- + H+ ⇌ HF consumes F- ions, lowering [F-] and causing more CaF2 to dissolve."),
            ("AgCl in aqueous acid (HCl is strong acid, Ka >> 1)", "IV", "Solubility remains virtually unchanged because Cl- does not protonate in dilute aqueous acid", "Cl- is the conjugate base of a strong acid (HCl) and does not react with H+; thus acid has no effect on AgCl solubility."),
            ("BaCO3 in aqueous acid (H2CO3 decomposes to CO2(g) and H2O)", "I", "Dissolves completely with effervescence of CO2 gas", "Carbonate ion CO3^(2-) reacts with H+ to form HCO3- and H2CO3, which decomposes to CO2(g) + H2O, driving dissolution to completion."),
            ("ZnS in acidic solution (H2S is weak diprotic acid)", "III", "Solubility increases greatly; allows selective precipitation in qualitative analysis Group II vs Group IV", "S^(2-) + 2H+ ⇌ H2S decreases [S^(2-)], increasing ZnS solubility. This principle is exploited in qualitative inorganic analysis."),
        ],
        "C"
    ))

    # Q060 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_060",
        topic,
        "advanced",
        "Match the salt of weak acid and weak base in List I with its hydrolysis parameters and pH behavior in List II (Kw = 1.0 × 10^(-14)):",
        [
            ("Salt where Ka > Kb (e.g., ammonium formate, Ka(HCOOH) = 1.8 × 10^(-4), Kb(NH4OH) = 1.8 × 10^(-5))", "II", "pH = 7 + 1/2(pKa - pKb) = 7 + 1/2(3.74 - 4.74) = 6.50 (slightly acidic)", "Since Ka > Kb, the acid is stronger than the base, producing an excess of H+ over OH- upon hydrolysis (pH < 7)."),
            ("Salt where Ka < Kb (e.g., ammonium cyanide, Ka(HCN) = 4.9 × 10^(-10), Kb(NH4OH) = 1.8 × 10^(-5))", "IV", "pH = 7 + 1/2(pKa - pKb) = 7 + 1/2(9.31 - 4.74) = 9.28 (distinctly basic)", "Since Ka < Kb (pKa > pKb), cyanide hydrolyzes to OH- more than ammonium hydrolyzes to H+, making the solution basic (pH > 7)."),
            ("Salt where Ka = Kb (e.g., ammonium acetate, pKa = pKb = 4.74)", "I", "pH = 7.00, independent of temperature if Kw/(Ka·Kb) remains balanced", "When pKa = pKb, 1/2(pKa - pKb) = 0, giving pH = 7.00."),
            ("Hydrolysis constant Kh of a salt of weak acid and weak base", "III", "Kh = Kw / (Ka · Kb)", "Combining the equilibria A- + H2O ⇌ HA + OH- and B+ + H2O ⇌ BOH + H+ gives Kh = [HA][BOH]/([A-][B+]) = Kw / (Ka · Kb)."),
        ],
        "D"
    ))

    return qs
