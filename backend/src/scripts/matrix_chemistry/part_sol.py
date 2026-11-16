from builder import make_matrix_q

def get_solutions_questions():
    qs = []
    t = "Solutions"

    # 4 Beginner: A, B, C, D
    qs.append(make_matrix_q("chem_pc3_001", t, "beginner",
        "Match the concentration terms in List I with their defining mathematical formulas or temperature dependence in List II:",
        [
            ("Molarity (M)", "III", "Moles of solute per litre of solution; temperature-dependent", "Molarity M = (moles of solute) / (volume of solution in L). Since volume expands with temperature, molarity decreases as temperature increases."),
            ("Molality (m)", "I", "Moles of solute per kilogram of solvent; temperature-independent", "Molality m = (moles of solute) / (mass of solvent in kg). Mass is invariant with temperature, making molality strictly temperature-independent."),
            ("Mole fraction (x_A)", "IV", "Ratio of moles of component A to total moles; dimensionless and temperature-independent", "Mole fraction x_A = n_A / (n_A + n_B). Being a ratio of moles, it is dimensionless and invariant with temperature."),
            ("Parts per million (ppm)", "II", "(Mass of solute / Total mass of solution) × 10⁶; used for trace quantities", "ppm is defined as (mass of solute / total mass of solution) × 10⁶, standard for reporting trace pollutant concentrations in water and atmosphere.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_002", t, "beginner",
        "Match the gas solubility phenomena and Henry's law concepts in List I with their corresponding physical explanations in List II:",
        [
            ("Higher value of Henry's law constant K_H at a given temperature", "IV", "Lower solubility of the gas in the liquid solvent", "According to Henry's law, P = K_H · x. At a fixed partial pressure P, a higher K_H implies a smaller mole fraction x, hence lower solubility."),
            ("Scuba divers breathing helium-oxygen mixture instead of air", "II", "Prevents the painful and dangerous condition known as 'bends' (decompression sickness)", "Helium has much lower solubility in blood and lipids under high pressure compared to nitrogen, avoiding bubble formation upon rapid ascent."),
            ("Bottles of carbonated soft drinks sealed under high pressure", "I", "Increases the dissolved concentration of CO₂ gas in the beverage", "In accordance with Henry's law, increasing the partial pressure of CO₂ above the liquid increases its dissolved mole fraction in the solution."),
            ("Anoxia experienced by climbers at high altitudes", "III", "Low partial pressure of oxygen leads to low concentration of oxygen in blood and brain tissues", "At high altitudes, atmospheric pressure is low, leading to diminished O₂ partial pressure and low dissolved oxygen concentration in blood, causing mental fatigue.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_003", t, "beginner",
        "Match the liquid binary mixtures in List I with their thermodynamic behavior with respect to Raoult's law in List II:",
        [
            ("Benzene + Toluene", "II", "Ideal solution (ΔH_mix = 0, ΔV_mix = 0, obeys Raoult's law over entire composition)", "Benzene and toluene have nearly identical molecular dimensions and London dispersion forces (A-B interactions ≈ A-A and B-B), forming an ideal solution."),
            ("Ethanol + Water", "IV", "Non-ideal solution showing positive deviation (ΔH_mix > 0, ΔV_mix > 0, P_total > P_ideal)", "Ethanol molecules disrupt the extensive three-dimensional hydrogen-bonding network of water, weakening average intermolecular attractions and raising vapor pressure."),
            ("Acetone + Chloroform", "I", "Non-ideal solution showing negative deviation (ΔH_mix < 0, ΔV_mix < 0, P_total < P_ideal)", "Chloroform and acetone form strong intermolecular hydrogen bonds (Cl₃C-H···O=C(CH₃)₂) that are stronger than original interactions, lowering vapor pressure."),
            ("n-Hexane + n-Heptane", "III", "Nearly ideal solution with intermolecular forces of identical dispersion type", "Both are non-polar aliphatic hydrocarbons of similar size with London dispersion forces, showing negligible enthalpy and volume changes upon mixing.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_004", t, "beginner",
        "Match the colligative properties in List I with their standard mathematical formulas in List II (for non-electrolyte dilute solutions):",
        [
            ("Relative lowering of vapor pressure", "III", "(P° - P) / P° = x_solute", "Raoult's law states that the relative lowering of vapor pressure (P° - P) / P° of a dilute solution containing a non-volatile solute equals the mole fraction of the solute."),
            ("Elevation of boiling point", "I", "ΔT_b = K_b · m", "Boiling point elevation is directly proportional to molal concentration: ΔT_b = K_b · m, where K_b is the molal boiling point elevation constant."),
            ("Depression of freezing point", "IV", "ΔT_f = K_f · m", "Freezing point depression is directly proportional to molal concentration: ΔT_f = K_f · m, where K_f is the molal freezing point depression constant."),
            ("Osmotic pressure", "II", "Π = C R T = (n / V) R T", "van 't Hoff equation for osmotic pressure states Π = C R T = (n / V) R T, where C is the molar concentration of the non-electrolyte solute.")
        ], "D"))

    # 8 Intermediate: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_005", t, "intermediate",
        "Match the solution mixing processes in List I with their corresponding thermodynamic parameters in List II:",
        [
            ("Mixing two ideal liquid components A and B", "IV", "ΔH_mix = 0, ΔV_mix = 0, ΔS_mix > 0, ΔG_mix < 0", "For an ideal solution, intermolecular forces are identical, so ΔH_mix = 0 and ΔV_mix = 0. Spontaneous mixing is driven purely by entropy of mixing (ΔS_mix > 0, ΔG_mix < 0)."),
            ("Mixing acetone and carbon disulfide (CS₂)", "I", "ΔH_mix > 0, ΔV_mix > 0, P_exp > P_calc", "Non-polar CS₂ disrupts the dipole-dipole interactions among polar acetone molecules, resulting in endothermic mixing (ΔH_mix > 0), volume expansion, and positive deviation."),
            ("Mixing phenol and aniline", "III", "ΔH_mix < 0, ΔV_mix < 0, P_exp < P_calc", "Phenolic -OH forms strong intermolecular hydrogen bonds with the lone pair on the nitrogen of aniline, causing exothermic mixing (ΔH_mix < 0), volume contraction, and negative deviation."),
            ("Mixing two completely immiscible liquids like water and chlorobenzene", "II", "P_total = P°_water + P°_organic, boiling occurs below the boiling point of either pure component", "For immiscible liquids, each component exerts its own saturated vapor pressure independently; boiling occurs when P°_water + P°_organic = 1 atm, below both boiling points.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_006", t, "intermediate",
        "Match the azeotropic mixtures and distillation properties in List I with their corresponding characteristics in List II:",
        [
            ("Minimum boiling azeotrope (e.g., 95.6% ethanol + 4.4% water)", "III", "Boils at a temperature lower than either component; formed by large positive deviation from Raoult's law", "Solutions showing large positive deviation show a maximum in the vapor pressure curve, which mathematically corresponds to a minimum in the boiling point curve."),
            ("Maximum boiling azeotrope (e.g., 68% HNO₃ + 32% H₂O)", "I", "Boils at a temperature higher than either component; formed by large negative deviation from Raoult's law", "Large negative deviation causes a deep minimum in the vapor pressure curve, corresponding to a maximum boiling point (120.5 °C for 68% nitric acid)."),
            ("Zeotropic binary mixture", "IV", "Can be separated completely into pure components by fractional distillation", "In zeotropic systems, vapor and liquid compositions differ across all compositions without an extremum, enabling complete separation by fractional distillation."),
            ("Vapor composition at the azeotropic composition", "II", "Identical to the liquid composition (y_A = x_A), boiling occurs at constant temperature without composition change", "At the azeotropic point, the liquid boils without any change in composition because the mole fraction in vapor equals that in liquid (y_A = x_A).")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_007", t, "intermediate",
        "Match the aqueous solutions of non-volatile solutes in List I with their relative lowering of vapor pressure (P° - P)/P° at 100 °C in List II (molar mass of water = 18 g/mol):",
        [
            ("Solution of 1 mol urea dissolved in 9 mol water", "II", "0.100", "(P° - P) / P° = x_urea = n_urea / (n_urea + n_water) = 1 / (1 + 9) = 1/10 = 0.100."),
            ("Solution of 180 g glucose (M = 180 g/mol) in 1000 g water", "IV", "0.0177", "n_glucose = 180/180 = 1.0 mol; n_water = 1000/18 = 55.55 mol. (P° - P)/P° = 1.0 / (1.0 + 55.55) = 1 / 56.55 ≈ 0.01768 ≈ 0.0177."),
            ("Solution with molality m = 2.0 mol/kg in water", "I", "0.0347", "In 1 kg water, n_water = 55.55 mol and n_solute = 2.0 mol. x_solute = 2.0 / (2.0 + 55.55) = 2.0 / 57.55 ≈ 0.03475 ≈ 0.0347."),
            ("Solution where mole fraction of water is 0.950", "III", "0.050", "x_solute = 1 - x_water = 1.000 - 0.950 = 0.050. Hence relative lowering of vapor pressure equals 0.050.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_008", t, "intermediate",
        "Match the expressions and constants for ebullioscopy and cryoscopy in List I with their definitions and thermodynamic relationships in List II:",
        [
            ("Molal boiling point elevation constant (K_b)", "II", "(R · T_b*² · M_solvent) / (1000 · ΔH_vap)", "Thermodynamic derivation yields K_b = (R · T_b*² · M) / (1000 · ΔH_vap), where M is solvent molar mass in g/mol and ΔH_vap is molar enthalpy of vaporization."),
            ("Molal freezing point depression constant (K_f)", "IV", "(R · T_f*² · M_solvent) / (1000 · ΔH_fus)", "Cryoscopic constant K_f = (R · T_f*² · M) / (1000 · ΔH_fus), where ΔH_fus is the molar enthalpy of fusion of the solvent."),
            ("Physical meaning of K_b", "I", "Boiling point elevation produced by dissolving 1 mole of non-volatile solute in 1 kg of solvent", "By definition, setting molality m = 1 mol/kg in ΔT_b = K_b · m yields ΔT_b = K_b."),
            ("Ratio K_f / K_b for water (K_f = 1.86 K kg/mol, K_b = 0.512 K kg/mol)", "III", "Approximately 3.63", "For water, K_f / K_b = 1.86 / 0.512 ≈ 3.633. K_f is significantly larger than K_b because the enthalpy of fusion is much smaller than the enthalpy of vaporization.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_009", t, "intermediate",
        "Match the biological and clinical osmotic phenomena in List I with their underlying osmotic conditions in List II:",
        [
            ("Red blood cells (RBCs) placed in 0.9% (m/v) aqueous NaCl solution", "III", "Isotonic environment; no net movement of water, cells maintain normal shape", "0.9% saline is isotonic with mammalian intracellular fluid, resulting in equal chemical potential of water across the erythrocyte cell membrane."),
            ("RBCs placed in pure distilled water or 0.2% NaCl solution", "I", "Hypotonic environment; endosmosis occurs leading to cellular swelling and hemolysis", "External chemical potential of water is higher than inside, causing net influx of water into the cell, building osmotic pressure until the cell ruptures (hemolysis)."),
            ("RBCs placed in 2.0% aqueous NaCl solution", "IV", "Hypertonic environment; exosmosis occurs leading to cellular shrinkage (crenation)", "External solution has a higher osmotic pressure, driving net outflow of water from the cytoplasm, causing the erythrocyte to shrink and shrivel (crenation)."),
            ("Desalination of seawater using a semipermeable cellulose acetate membrane", "II", "Reverse osmosis; hydrostatic pressure applied exceeding the osmotic pressure of seawater (P > Π)", "When an external hydrostatic pressure greater than the osmotic pressure Π of seawater is applied, pure water flows through the SPM against its concentration gradient.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_010", t, "intermediate",
        "Match the solutes and their solution behaviors in List I with their theoretical van 't Hoff factors (i) in List II:",
        [
            ("K₄[Fe(CN)₆] undergoing 100% complete dissociation in water", "IV", "i = 5.0", "K₄[Fe(CN)₆] dissociates into 4 K⁺ and 1 [Fe(CN)₆]⁴⁻, giving n = 5 particles per formula unit. With α = 1.0, i = 1 + (5 - 1)(1.0) = 5.0."),
            ("Benzoic acid (C₆H₅COOH) undergoing 100% dimerization in benzene", "I", "i = 0.50", "2 C₆H₅COOH ⇌ (C₆H₅COOH)₂. For complete dimerization (β = 1.0), i = 1 - β + β/2 = 1 - 1 + 0.50 = 0.50."),
            ("Weak monobasic acid HA with degree of dissociation α = 0.095", "II", "i = 1.095", "HA ⇌ H⁺ + A⁻ gives n = 2. i = 1 + (2 - 1)α = 1 + α = 1 + 0.095 = 1.095."),
            ("Al₂(SO₄)₃ undergoing 80% dissociation (α = 0.80) in water", "III", "i = 4.20", "Al₂(SO₄)₃ dissociates into 2 Al³⁺ and 3 SO₄²⁻, so n = 5. i = 1 + (n - 1)α = 1 + (5 - 1)(0.80) = 1 + 3.20 = 4.20.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_011", t, "intermediate",
        "Match the 0.10 m aqueous solutions in List I with their colligative property characteristics in List II (assuming complete dissociation of ionic salts):",
        [
            ("0.10 m Al₂(SO₄)₃ (aq)", "I", "Highest boiling point and largest depression of freezing point (effective molality = 0.50 m)", "i = 5, effective particle molality i·m = 5 × 0.10 = 0.50 m. Hence ΔT_b is maximum and ΔT_f is maximum (yielding the lowest freezing point)."),
            ("0.10 m BaCl₂ (aq)", "III", "Effective molality = 0.30 m; ΔT_f is exactly 1.5 times that of 0.10 m NaCl", "BaCl₂ gives 3 ions (i = 3, i·m = 0.30 m). NaCl gives 2 ions (i = 2, i·m = 0.20 m). The ratio of freezing point depressions is 0.30 / 0.20 = 1.50."),
            ("0.10 m Glucose (aq)", "IV", "Highest freezing point among the set (effective molality = 0.10 m, lowest ΔT_f)", "Glucose is a non-electrolyte (i = 1, i·m = 0.10 m). Having the smallest ΔT_f means its freezing point T_f = 0 - ΔT_f is the highest (closest to 0 °C)."),
            ("0.10 m NaCl (aq)", "II", "Osmotic pressure Π ≈ 2 × (0.10 R T) = 0.20 R T", "NaCl dissociates into Na⁺ and Cl⁻ (i = 2). The effective osmolarity is 0.20 M, yielding osmotic pressure Π = 0.20 R T.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_012", t, "intermediate",
        "For a binary ideal liquid mixture of A and B with pure vapor pressures P_A° = 100 mmHg and P_B° = 40 mmHg, match the liquid/vapor phase states in List I with their corresponding total vapor pressures or mole fractions in List II:",
        [
            ("Equimolar liquid mixture (x_A = 0.50, x_B = 0.50)", "II", "P_total = 70 mmHg", "P_total = x_A P_A° + x_B P_B° = (0.50 × 100) + (0.50 × 40) = 50 + 20 = 70 mmHg."),
            ("Mole fraction of A in vapor phase (y_A) for equimolar liquid mixture", "IV", "y_A = 0.714 (5/7)", "y_A = P_A / P_total = (0.50 × 100) / 70 = 50 / 70 = 5/7 ≈ 0.714."),
            ("Equimolar vapor mixture (y_A = 0.50, y_B = 0.50) at its dew point", "I", "P_total = 57.14 mmHg", "1 / P_total = y_A / P_A° + y_B / P_B° = 0.50/100 + 0.50/40 = 0.005 + 0.0125 = 0.0175 mmHg⁻¹. P_total = 1 / 0.0175 = 57.14 mmHg."),
            ("Liquid mole fraction x_A in equilibrium with equimolar vapor", "III", "x_A = 0.286 (2/7)", "x_A = y_A P_total / P_A° = (0.50 × 57.14) / 100 = 28.57 / 100 ≈ 0.286 (exactly 2/7).")
        ], "D"))

    # 8 Advanced: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_013", t, "advanced",
        "Match the complex association/dissociation equilibrium systems in List I with their exact van 't Hoff factor (i) expressions in List II:",
        [
            ("Dimerization of solute A where 2A ⇌ A₂ with degree of association β", "III", "i = 1 - β/2", "Initial: 1 mol A. At equilibrium: n_A = 1 - β, n_A2 = β/2. Total particles = (1 - β) + β/2 = 1 - β/2. Hence i = 1 - β/2."),
            ("Association of solute into an n-mer: n A ⇌ A_n with degree of association β", "I", "i = 1 - β (1 - 1/n)", "From 1 mol A, unassociated A is (1 - β) and n-mer formed is β/n. Total particles = 1 - β + β/n = 1 - β(1 - 1/n)."),
            ("Weak electrolyte AB₂ dissociating via AB₂ ⇌ A²⁺ + 2B⁻ with degree of dissociation α", "IV", "i = 1 + 2α", "From 1 mol AB₂, undissociated is (1 - α), producing α A²⁺ and 2α B⁻. Total particles = 1 - α + α + 2α = 1 + 2α."),
            ("Simultaneous partial dimerization (β) and partial ionization (α) of carboxylic acid in water", "II", "i = 1 + α - β/2", "If a fraction β associates into dimers and a separate fraction α ionizes into H⁺ and RCOO⁻, total moles of particles = 1 + α - β/2.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_014", t, "advanced",
        "Match Konovalov's rules and distillation phase equilibrium concepts in List I with their thermodynamic principles in List II:",
        [
            ("Konovalov's First Rule", "IV", "Vapor phase is richer in that component whose addition to the liquid increases total vapor pressure", "Konovalov's first rule states that dy_A / dx_A > 0, meaning the vapor phase is always richer in the more volatile component compared to the liquid."),
            ("Konovalov's Second Rule", "I", "At an extremum (maximum or minimum) of the vapor pressure curve, liquid and vapor compositions are identical", "Konovalov's second rule states that when dP/dx_A = 0, y_A = x_A, which mathematically establishes the existence of an azeotropic composition."),
            ("Lever Rule on a T-x-y boiling phase diagram", "II", "Determines the relative mole fractions of liquid and vapor phases in the two-phase region: n_L / n_V = (y - x_overall) / (x_overall - x)", "Derived from conservation of mass: the ratio of amounts of coexisting phases is inversely proportional to their tie-line distances from the overall mixture composition."),
            ("Relative volatility α_AB = (y_A / x_A) / (y_B / x_B)", "III", "Equals P_A° / P_B° for ideal solutions; measure of the ease of separation by distillation", "For an ideal solution, y_A = x_A P_A° / P and y_B = x_B P_B° / P, giving α_AB = P_A° / P_B°. Separation by distillation becomes impossible when α_AB = 1.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_015", t, "advanced",
        "An aqueous solution containing 60 g of urea (M = 60 g/mol) in 1000 g of water (K_f = 1.86 K kg/mol) is cooled to -3.72 °C. Match the freezing parameters in List I with their values in List II:",
        [
            ("Initial freezing point of the prepared solution", "I", "-1.86 °C", "n_urea = 60/60 = 1.0 mol. Initial molality m = 1.0 mol / 1.0 kg = 1.0 m. ΔT_f = K_f · m = 1.86 × 1.0 = 1.86 °C. Freezing commences at 0 - 1.86 = -1.86 °C."),
            ("Molality of the residual liquid solution at -3.72 °C", "III", "2.0 m", "At -3.72 °C, ΔT_f = 3.72 °C. Using ΔT_f = K_f · m_residual, m_residual = 3.72 / 1.86 = 2.0 mol/kg."),
            ("Mass of liquid water remaining in the solution at -3.72 °C", "IV", "500 g", "m_residual = 2.0 mol/kg. Solute amount is fixed at 1.0 mol. W_solvent = n_urea / m_residual = 1.0 / 2.0 = 0.500 kg = 500 g."),
            ("Mass of pure ice separated out from the solution at -3.72 °C", "II", "500 g", "Mass of ice separated = Initial water mass - remaining water mass = 1000 g - 500 g = 500 g.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_016", t, "advanced",
        "Match the macromolecular osmotic pressure relations and molecular weight definitions in List I with their formulations in List II:",
        [
            ("Virial expansion of osmotic pressure (Π / C)", "II", "Π / C = R T (1/M_n + B C + C' C² + ...)", "For high-molecular-weight polymer solutions, excluded volume effects lead to a concentration-dependent reduced osmotic pressure: Π/C = RT(1/M_n + B·C)."),
            ("Number-average molar mass (M_n) from osmometry", "IV", "M_n = (Σ N_i M_i) / (Σ N_i)", "Colligative properties depend strictly on the number of particles per unit volume regardless of particle size, thus osmometry uniquely determines M_n."),
            ("Theta (θ) temperature / Flory condition", "I", "Second virial coefficient B = 0, polymer-solvent interactions balance polymer-polymer interactions", "At the Flory θ-temperature, the second virial coefficient B vanishes, excluded-volume effects cancel, and the polymer solution displays ideal osmotic behavior."),
            ("Weight-average molar mass (M_w) from light scattering", "III", "M_w = (Σ N_i M_i²) / (Σ N_i M_i), always greater than or equal to M_n", "Light scattering intensity is proportional to particle mass squared, measuring M_w. For any polydisperse polymer system, M_w / M_n ≥ 1.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_017", t, "advanced",
        "Match the thermodynamic dissolution concepts in List I with their mathematical relationships in List II:",
        [
            ("Enthalpy of solution (ΔH_sol) in terms of Born-Haber cycle", "II", "ΔH_sol = ΔH_lattice + ΔH_hydration", "Dissolution of an ionic solid involves breaking the crystal lattice (absorbing ΔH_lattice > 0) followed by hydration of the gaseous ions (releasing ΔH_hydration < 0)."),
            ("Temperature dependence of solubility (van 't Hoff equation)", "IV", "d(ln s) / dT = ΔH_sol / (R T²)", "The van 't Hoff isochore for solubility s is d(ln s)/dT = ΔH_sol / (RT²). If dissolution is endothermic (ΔH_sol > 0), solubility s increases with temperature."),
            ("Exothermic dissolution (e.g., anhydrous Na₂SO₄ above 32.4 °C)", "I", "ΔH_sol < 0; solubility decreases with increasing temperature", "According to Le Chatelier's principle, for an exothermic dissolution process (ΔH_sol < 0), heating shifts the equilibrium backward, decreasing solubility."),
            ("Ideal solubility of a solid solute (Schröder-van Laar equation)", "III", "ln x_solute = (ΔH_fus / R) · (1/T_m - 1/T)", "The thermodynamic equilibrium mole fraction of a crystalline solid in an ideal liquid solvent depends on its enthalpy of fusion ΔH_fus and melting point T_m.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_018", t, "advanced",
        "An organic compound immiscible with water is purified by steam distillation at total pressure P = 760 mmHg. Match the steam distillation principles in List I with their formulas or values in List II:",
        [
            ("Condition for boiling during steam distillation", "IV", "P_total = P°_water + P°_organic = 760 mmHg", "Because the two liquid components are completely immiscible, each exerts its own saturated vapor pressure; boiling begins when the sum of their pure vapor pressures equals 760 mmHg."),
            ("Mass ratio of organic compound to water in distillate (w_org / w_water)", "I", "(P°_organic · M_organic) / (P°_water · M_water)", "In the vapor phase, n_org / n_water = P°_org / P°_water. Since mass w = n · M, the mass ratio in distillate is (P°_org · M_org) / (P°_water · M_water)."),
            ("Distillation temperature of aniline (b.p. 184 °C) with steam (b.p. 100 °C)", "II", "98.5 °C (strictly below 100 °C)", "Because P_total = P°_water + P°_aniline = 760 mmHg, P°_water must be less than 760 mmHg, meaning the distillation temperature is strictly below the normal boiling point of pure water."),
            ("Distillation of nitrobenzene (M = 123) with steam at 99 °C (P°_water = 733 mmHg, P°_nitro = 27 mmHg)", "III", "Mass percentage of nitrobenzene in distillate ≈ 20.1%", "w_nitro / w_water = (27 × 123) / (733 × 18) = 3321 / 13194 ≈ 0.2517. Mass percentage = 0.2517 / (1 + 0.2517) × 100% ≈ 20.1%.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_019", t, "advanced",
        "Match the non-ideal solution concepts of activity and ionic strength in List I with their expressions in List II:",
        [
            ("Ionic strength (I) of an electrolyte solution", "III", "I = (1/2) Σ c_i · z_i²", "Ionic strength accounts for the cumulative electrostatic field of all dissolved ions, defined by Lewis and Randall as I = (1/2) Σ c_i · z_i²."),
            ("Debye-Hückel limiting law for mean activity coefficient (log γ_±) at 25 °C in water", "I", "log γ_± = -0.509 |z₊ · z₋| √I", "In dilute aqueous electrolyte solutions, long-range Coulombic screening reduces the mean ionic activity coefficient according to log γ_± = -0.509 |z₊ · z₋| √I."),
            ("Ionic strength of 0.05 M BaCl₂ solution", "IV", "0.15 M", "BaCl₂ dissociates into Ba²⁺ (0.05 M, z = +2) and 2 Cl⁻ (0.10 M, z = -1). I = (1/2) [0.05 × 2² + 0.10 × (-1)²] = (1/2) [0.20 + 0.10] = 0.15 M."),
            ("Mean ionic activity (a_±) for an electrolyte A_x B_y", "II", "a_± = (a_A^x · a_B^y)^(1 / (x + y))", "By definition, the mean ionic activity is the geometric mean of individual ionic activities: a_± = (a_A^x · a_B^y)^(1 / (x + y)).")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_020", t, "advanced",
        "Match the thermodynamic models of real solutions and Margules equations in List I with their descriptions in List II:",
        [
            ("Excess Gibbs free energy (G^E) for a symmetric regular solution", "II", "G^E = Ω · x_A · x_B", "For a symmetric regular solution, excess entropy of mixing is zero, and excess free energy is parabolic in mole fraction: G^E = Ω x_A x_B, where Ω is the interaction parameter."),
            ("One-parameter Margules activity coefficient ln γ_A", "IV", "ln γ_A = (Ω / R T) · x_B²", "From partial molar thermodynamics, RT ln γ_A = ∂(n_total G^E)/∂n_A = Ω x_B², giving ln γ_A = (Ω / RT) x_B²."),
            ("Upper critical solution temperature (UCST) condition in regular solution", "I", "T_c = Ω / (2 R)", "Liquid-liquid phase separation occurs when d²(ΔG_mix)/dx² < 0. The critical point occurs when d²(ΔG)/dx² = d³(ΔG)/dx³ = 0 at x = 0.5, giving T_c = Ω / (2R)."),
            ("Henry's law constant related to Raoult's standard state", "III", "K_H,A = P_A° · exp(Ω / R T)", "At infinite dilution of A (x_A → 0, x_B → 1), γ_A^∞ = exp(Ω / RT). Hence Henry's constant K_H,A = lim (P_A / x_A) = P_A° · γ_A^∞ = P_A° · exp(Ω / RT).")
        ], "D"))

    return qs
