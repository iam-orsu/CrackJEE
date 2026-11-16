from builder import make_matrix_q

def get_kinetics_questions():
    qs = []
    t = "Chemical Kinetics"

    # 4 Beginner: A, B, C, D
    qs.append(make_matrix_q("chem_pc3_041", t, "beginner",
        "For the general homogeneous gaseous reaction: 2N₂O₅(g) → 4NO₂(g) + O₂(g), match the stoichiometric rate expressions in List I with their mathematical equalities in List II:",
        [
            ("Overall rate of reaction (r)", "III", "-(1/2) d[N₂O₅]/dt = +(1/4) d[NO₂]/dt = +d[O₂]/dt", "Overall reaction rate is uniquely defined by dividing the rate of change of each component by its signed stoichiometric coefficient: r = -(1/2) d[N₂O₅]/dt = (1/4) d[NO₂]/dt = d[O₂]/dt."),
            ("Rate of disappearance of N₂O₅ (-d[N₂O₅]/dt) in terms of d[O₂]/dt", "I", "2 × (d[O₂]/dt)", "From -(1/2) d[N₂O₅]/dt = d[O₂]/dt, multiplying across by 2 yields -d[N₂O₅]/dt = 2 d[O₂]/dt."),
            ("Rate of appearance of NO₂ (d[NO₂]/dt) in terms of -d[N₂O₅]/dt", "IV", "2 × (-d[N₂O₅]/dt)", "From (1/4) d[NO₂]/dt = -(1/2) d[N₂O₅]/dt, multiplying across by 4 yields d[NO₂]/dt = 2 (-d[N₂O₅]/dt)."),
            ("Ratio of rate of formation of NO₂ to rate of formation of O₂", "II", "4 : 1", "(d[NO₂]/dt) / (d[O₂]/dt) = 4 / 1 = 4.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_042", t, "beginner",
        "Match the characteristics of order of reaction and molecularity in List I with their descriptions in List II:",
        [
            ("Order of reaction", "IV", "Experimentally determined sum of powers of concentration terms in the differential rate law; can be zero, fractional, or negative", "Reaction order is strictly an empirical property obtained by fitting experimental rate data, reflecting how rate responds to reactant concentrations."),
            ("Molecularity of a reaction", "II", "Theoretical integer (1, 2, or 3) representing the number of reacting species colliding simultaneously in an elementary step", "Molecularity is defined solely for elementary steps and must be a positive integer because fractional or zero molecules cannot participate in a collision."),
            ("Molecularity of a complex (multi-step) reaction", "I", "Has no physical meaning for the overall reaction; defined only for individual elementary steps", "A complex reaction involves multiple sequential or parallel steps, so molecularity cannot be assigned to the overall balanced equation."),
            ("Rate-determining step (RDS) in a multi-step mechanism", "III", "The slowest elementary step that controls the overall kinetic rate of the reaction", "The slowest step has the highest activation barrier and bottlenecks the overall flux, defining the overall reaction rate law.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_043", t, "beginner",
        "Match the reaction order (n) in List I with the corresponding SI / standard units of rate constant (k) in List II (concentration in mol/L, time in s):",
        [
            ("Zero-order reaction (n = 0)", "II", "mol·L⁻¹·s⁻¹", "Unit of k = (mol/L)^(1-n) s⁻¹. For n = 0: (mol/L)¹ s⁻¹ = mol·L⁻¹·s⁻¹."),
            ("First-order reaction (n = 1)", "IV", "s⁻¹", "For n = 1: (mol/L)^(1-1) s⁻¹ = s⁻¹, completely independent of concentration units."),
            ("Second-order reaction (n = 2)", "I", "L·mol⁻¹·s⁻¹", "For n = 2: (mol/L)^(1-2) s⁻¹ = L·mol⁻¹·s⁻¹."),
            ("Third-order reaction (n = 3)", "III", "L²·mol⁻²·s⁻¹", "For n = 3: (mol/L)^(1-3) s⁻¹ = L²·mol⁻²·s⁻¹.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_044", t, "beginner",
        "Match the kinetic integrated rate laws and half-lives in List I with their mathematical formulas in List II:",
        [
            ("Zero-order half-life (t_1/2)", "III", "t_1/2 = [A]₀ / (2k)", "At t_1/2, [A] = [A]₀ / 2. From [A] = [A]₀ - kt, we get [A]₀/2 = [A]₀ - kt_1/2 => t_1/2 = [A]₀ / (2k). Directly proportional to initial concentration."),
            ("First-order half-life (t_1/2)", "I", "t_1/2 = (ln 2) / k ≈ 0.693 / k", "From ln([A]₀/[A]) = kt, at [A] = [A]₀/2, kt_1/2 = ln 2 => t_1/2 = ln 2 / k. Completely independent of initial concentration."),
            ("Integrated rate equation for zero-order reaction", "IV", "[A] = [A]₀ - k t", "-d[A]/dt = k => ∫ d[A] = -k ∫ dt => [A] = [A]₀ - kt."),
            ("Integrated rate equation for first-order reaction", "II", "ln [A] = ln [A]₀ - k t, or [A] = [A]₀ · e^(-k t)", "-d[A]/dt = k[A] => ∫ d[A]/[A] = -k ∫ dt => ln [A] = ln [A]₀ - kt.")
        ], "D"))

    # 8 Intermediate: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_045", t, "intermediate",
        "Match the reaction orders in List I with their characteristic linear graphical plots in List II:",
        [
            ("Zero-order reaction", "IV", "[A] vs t gives a straight line with slope = -k and intercept = [A]₀", "[A] = -kt + [A]₀ is of the form y = mx + c with slope m = -k and intercept c = [A]₀."),
            ("First-order reaction", "I", "ln [A] vs t gives a straight line with slope = -k and intercept = ln [A]₀", "ln [A] = -kt + ln [A]₀ yields a linear plot with slope = -k and y-intercept = ln [A]₀."),
            ("Second-order reaction (2A → Products)", "III", "1 / [A] vs t gives a straight line with slope = +k and intercept = 1 / [A]₀", "Integrated form is 1/[A] = kt + 1/[A]₀, yielding a straight line with positive slope m = +k."),
            ("General dependence of half-life on initial concentration: t_1/2 vs [A]₀", "II", "t_1/2 ∝ [A]₀^(1 - n); log(t_1/2) vs log [A]₀ gives slope = 1 - n", "Since t_1/2 = [2^(n-1) - 1] / [(n - 1) k [A]₀^(n-1)], t_1/2 ∝ [A]₀^(1-n). Plotting log(t_1/2) vs log [A]₀ has slope 1 - n.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_046", t, "intermediate",
        "Match the second-order reaction conditions in List I with their kinetic expressions and parameters in List II:",
        [
            ("Reaction 2A → Products with rate = k [A]²: Time required for 75% completion (t_75%)", "III", "t_75% = 3 × t_50% = 3 / (k [A]₀)", "1/[A] - 1/[A]₀ = kt. At 50%, [A] = [A]₀/2 => t_50% = 1/(k[A]₀). At 75%, [A] = [A]₀/4 => 4/[A]₀ - 1/[A]₀ = 3/[A]₀ = kt_75% => t_75% = 3/(k[A]₀) = 3 t_50%."),
            ("Reaction A + B → Products with [A]₀ ≠ [B]₀: Integrated rate law", "I", "k t = [1 / ([A]₀ - [B]₀)] · ln ([B]₀ [A] / ([A]₀ [B]))", "Integrating dx / (([A]₀ - x)([B]₀ - x)) = k dt yields the standard unequal initial concentration formula."),
            ("Reaction 2A → Products: Ratio of half-life at [A]₀ = 0.2 M to half-life at [A]₀ = 0.4 M", "IV", "2 : 1", "t_1/2 = 1/(k[A]₀). When concentration is halved, half-life doubles: (t_1/2)₁ / (t_1/2)₂ = 0.4 / 0.2 = 2."),
            ("Second-order reaction: Fractional conversion x = ([A]₀ - [A]) / [A]₀ as function of time", "II", "x = (k [A]₀ t) / (1 + k [A]₀ t)", "[A] = [A]₀ / (1 + k[A]₀ t) => x = 1 - [A]/[A]₀ = 1 - 1/(1 + k[A]₀ t) = (k[A]₀ t)/(1 + k[A]₀ t).")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_047", t, "intermediate",
        "Match the Arrhenius equation components and plots in List I with their thermodynamic/kinetic interpretations in List II:",
        [
            ("Arrhenius equation: k = A · e^(-E_a / (R T))", "II", "Relates reaction rate constant k to activation energy E_a and absolute temperature T", "Svante Arrhenius proposed that only molecules possessing energy greater than or equal to E_a can overcome the activation barrier to form products."),
            ("Plot of ln k vs 1 / T", "IV", "Straight line with slope = -E_a / R and intercept = ln A", "Taking natural logarithm: ln k = ln A - (E_a / R)(1/T). The slope is m = -E_a / R."),
            ("Two-temperature Arrhenius relation: ln(k₂ / k₁)", "I", "ln(k₂ / k₁) = (E_a / R) · [(T₂ - T₁) / (T₁ T₂)]", "ln k₂ - ln k₁ = (-E_a / R T₂) - (-E_a / R T₁) = (E_a / R) (1/T₁ - 1/T₂) = (E_a / R) [(T₂ - T₁) / (T₁ T₂)]."),
            ("Pre-exponential factor (frequency factor, A)", "III", "Represents the total collision frequency having proper spatial orientation per unit time", "A has the same units as the rate constant k and represents the rate constant if the activation barrier were zero (at infinite temperature).")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_048", t, "intermediate",
        "Match the reaction energy profile parameters in List I with their mathematical relationships in List II:",
        [
            ("Enthalpy of reaction (ΔH) for an elementary reversible reaction", "II", "ΔH = E_a(forward) - E_a(backward)", "The net energy change of reaction is the difference in activation barriers: ΔH = E_a,f - E_a,b."),
            ("Endothermic reaction condition (ΔH > 0)", "IV", "E_a(forward) > E_a(backward); Products have higher potential energy than reactants", "When ΔH > 0, the transition state lies higher above reactants than above products, so E_a,f > E_a,b."),
            ("Exothermic reaction condition (ΔH < 0)", "I", "E_a(forward) < E_a(backward); E_a(forward) can be smaller than |ΔH|", "When ΔH < 0, products are more stable than reactants, hence backward activation energy is larger than forward activation energy by |ΔH|."),
            ("Activated complex (Transition State, TS)", "III", "Chemical species at the potential energy maximum along the minimum energy reaction coordinate", "The transition state corresponds to a saddle point on the potential energy surface where bonds are partially broken and formed.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_049", t, "intermediate",
        "Match the collision theory parameters and concepts in List I with their physical descriptions in List II:",
        [
            ("Steric factor (probability factor, P or ρ)", "III", "Accounts for the fraction of collisions having the correct spatial orientation of reacting bonds", "In modified collision theory, rate = P · Z_AB · e^(-E_a/RT), where P < 1 accounts for steric shielding and required orientation."),
            ("Collision frequency (Z_AB)", "I", "Number of binary collisions per second per unit volume of the reaction mixture", "For hard-sphere gas molecules, Z_AB = n_A n_B σ_AB² √(8 k_B T / (π μ)), measuring total collision encounters per cm³ per second."),
            ("Boltzmann factor e^(-E_a / (R T))", "IV", "Fraction of collisions possessing kinetic energy equal to or exceeding activation energy E_a", "Derived from Maxwell-Boltzmann distribution, this exponential term gives the probability that a collision has collision energy E_coll ≥ E_a."),
            ("Requirement for an effective (fruitful) collision", "II", "Collision must satisfy both sufficient kinetic energy (≥ E_a) and proper mutual steric orientation", "An encounter leads to chemical reaction only when colliding molecules meet both energy and orientation criteria simultaneously.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_050", t, "intermediate",
        "Match the catalytic effects on chemical reaction kinetics in List I with their physical consequences in List II:",
        [
            ("Addition of a positive catalyst", "IV", "Provides an alternative reaction pathway with a lower activation energy, exponentially increasing rate", "Since k = A e^(-E_a/RT), lowering E_a by ΔE_a increases the rate by a factor of exp(ΔE_a / RT)."),
            ("Effect of catalyst on equilibrium constant (K_c) and Gibbs energy (ΔG°)", "I", "No effect whatsoever; K_c and ΔG° remain completely unchanged", "A catalyst accelerates forward and reverse rates by the exact same factor, leaving the equilibrium position and state functions (ΔG°, ΔH°, ΔS°) identical."),
            ("Effect of catalyst on activation energies E_a(f) and E_a(b)", "II", "Lowers both forward and reverse activation energies by the exact same amount ΔE_a", "Because ΔH = E_a,f - E_a,b is unchanged, the reduction in forward barrier must equal the reduction in reverse barrier: ΔE_a,f = ΔE_a,b."),
            ("Negative catalyst (inhibitor / poison)", "III", "Increases the effective activation energy or destroys active catalytic centers, slowing down the reaction", "Inhibitors either block active sites or provide pathways with higher activation energies, diminishing overall rate.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_051", t, "intermediate",
        "Match the methods for determining the order of a chemical reaction in List I with their operational procedures in List II:",
        [
            ("Initial rate method", "II", "Vary the initial concentration of one reactant while keeping all others constant, measuring initial rate r₀", "If doubling [A]₀ quadruples initial rate r₀ while [B]₀ is fixed, the partial order with respect to A is 2."),
            ("Half-life method", "IV", "Determine t_1/2 at different initial concentrations and calculate n from: n = 1 + [log(t_1/2,1 / t_1/2,2)] / [log([A]₀,₂ / [A]₀,₁)]", "Since t_1/2 ∝ [A]₀^(1-n), taking ratios and logs allows direct evaluation of reaction order n."),
            ("Ostwald's isolation method", "I", "Take all reactants except one in large excess, so their concentrations remain effectively constant", "If reactants B and C are in huge excess, rate = k' [A]^a where k' = k [B]₀^b [C]₀^c, isolating the true order with respect to A."),
            ("Integrated rate equation trial method", "III", "Substitute concentration vs time data into integrated equations of different orders to see which gives a constant k", "Experimental [A] at different times t is plugged into 0th, 1st, and 2nd order formulas; constancy of calculated k identifies the true order.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_052", t, "intermediate",
        "Match the pseudo-first order and polarimetric kinetics systems in List I with their equations in List II:",
        [
            ("Acid-catalyzed hydrolysis of ethyl acetate: CH₃COOC₂H₅ + H₂O --(H⁺)--> CH₃COOH + C₂H₅OH", "II", "Pseudo-first order; rate = k' [ester] where k' = k [H₂O] is constant due to large excess of water", "Water acts as both solvent and reactant ([H₂O] ≈ 55.5 M), remaining virtually unchanged throughout the reaction, so rate = k'[ester]."),
            ("Inversion of cane sugar (sucrose) monitored by polarimetry: angle of rotation r₀, r_t, r_∞", "IV", "k = (1 / t) · ln [(r₀ - r_∞) / (r_t - r_∞)]", "Sucrose is dextrorotatory, while the equimolar glucose + fructose product mixture is levorotatory. Concentration of unreacted sucrose is proportional to (r_t - r_∞), giving k = (1/t) ln[(r₀ - r_∞)/(r_t - r_∞)]."),
            ("Optical rotation at infinite time (r_∞) in cane sugar inversion", "I", "Negative (levorotatory) because D-(-)-fructose has greater specific rotation (-92.4°) than D-(+)-glucose (+52.5°)", "The net specific rotation of invert sugar is levorotatory, so optical sign inverts from (+) to (-), explaining the term 'inversion of cane sugar'."),
            ("Acid hydrolysis of ester monitored by titrating reaction aliquots with standard NaOH (V₀, V_t, V_∞)", "III", "k = (1 / t) · ln [(V_∞ - V₀) / (V_∞ - V_t)]", "At time t, acid titer is V_t = V_catalyst + V_acetic_acid. V₀ corresponds to catalyst alone, and V_∞ corresponds to complete hydrolysis, so [ester] ∝ (V_∞ - V_t).")
        ], "D"))

    # 8 Advanced: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_053", t, "advanced",
        "For parallel / competing first-order reactions where reactant A decomposes concurrently via A --(k₁)--> B and A --(k₂)--> C with activation energies E_a1 and E_a2, match the kinetic parameters in List I with their expressions in List II:",
        [
            ("Overall rate constant for disappearance of A (-d[A]/dt = k_overall [A])", "III", "k_overall = k₁ + k₂", "-d[A]/dt = k₁[A] + k₂[A] = (k₁ + k₂)[A]. Thus the overall decay constant is k = k₁ + k₂."),
            ("Molar ratio of products formed at any time t ([B] / [C])", "I", "[B] / [C] = k₁ / k₂", "d[B]/dt = k₁[A] and d[C]/dt = k₂[A]. Dividing the rates gives d[B]/d[C] = k₁/k₂, integrating to [B]/[C] = k₁/k₂, invariant with time."),
            ("Effective overall activation energy (E_a,overall)", "IV", "E_a,overall = (k₁ E_a1 + k₂ E_a2) / (k₁ + k₂)", "Differentiating ln k = ln(k₁ + k₂) with respect to T: (1/k) dk/dT = (1/k) [dk₁/dT + dk₂/dT] => E_a / (RT²) = (1/(k₁+k₂)) [k₁ E_a1 / (RT²) + k₂ E_a2 / (RT²)], yielding the weighted average."),
            ("Fractional yield of product B at completion", "II", "Yield_B = k₁ / (k₁ + k₂)", "[B]_∞ = (k₁ / (k₁ + k₂)) [A]₀. Thus fractional yield of B is k₁ / (k₁ + k₂).")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_054", t, "advanced",
        "For consecutive first-order reactions A --(k₁)--> B --(k₂)--> C with [A]₀ = a and [B]₀ = [C]₀ = 0, match the kinetic quantities in List I with their mathematical expressions in List II:",
        [
            ("Concentration of intermediate B at time t ([B]_t)", "IV", "[B]_t = [k₁ a / (k₂ - k₁)] · [e^(-k₁ t) - e^(-k₂ t)]", "Solving the linear differential equation d[B]/dt + k₂[B] = k₁ a e^(-k₁ t) with integrating factor e^(k₂ t) yields this standard solution."),
            ("Time at which intermediate B reaches its maximum concentration (t_max)", "I", "t_max = [ln(k₁ / k₂)] / (k₁ - k₂)", "Setting d[B]/dt = 0 gives k₁ e^(-k₁ t_max) = k₂ e^(-k₂ t_max) => (k₁/k₂) = e^((k₁ - k₂)t_max) => t_max = ln(k₁/k₂) / (k₁ - k₂)."),
            ("Maximum concentration of intermediate B ([B]_max)", "II", "[B]_max = a · (k₂ / k₁)^(k₂ / (k₁ - k₂))", "Substituting t_max into the expression for [B]_t simplifies algebraically to [B]_max = a (k₂/k₁)^(k₂/(k₁-k₂))."),
            ("Steady-state approximation condition when k₁ << k₂", "III", "[B] remains very small throughout; d[B]/dt ≈ 0; [B] ≈ (k₁ / k₂) [A]", "When the second step is much faster than the first (k₂ >> k₁), the intermediate decomposes as rapidly as it forms, keeping its steady-state concentration low: [B] ≈ (k₁/k₂)[A].")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_055", t, "advanced",
        "Match the reversible / opposing reaction kinetics and relaxation techniques in List I with their mathematical formulas in List II:",
        [
            ("First-order reversible reaction A ⇌ B (forward k_f, backward k_b): Integrated rate equation", "I", "ln [x_eq / (x_eq - x)] = (k_f + k_b) · t", "dx/dt = k_f(a - x) - k_b x. At equilibrium, k_f(a - x_eq) = k_b x_eq. Substituting k_b gives dx/dt = (k_f + k_b)(x_eq - x), which integrates to ln[x_eq / (x_eq - x)] = (k_f + k_b) t."),
            ("Relaxation time (τ) for A ⇌ B following a small temperature-jump (T-jump)", "III", "τ = 1 / (k_f + k_b)", "For a small perturbation Δx = x - x_eq, d(Δx)/dt = -(k_f + k_b) Δx => Δx(t) = Δx₀ e^(-t/τ), where relaxation time τ = 1/(k_f + k_b)."),
            ("Relaxation time (τ) for second-order dimerization 2A ⇌ A₂", "IV", "τ = 1 / (4 k_f [A]_eq + k_b)", "Linearizing the rate equation d(Δ[A])/dt = - (4 k_f [A]_eq + k_b) Δ[A] yields the reciprocal relaxation time 1/τ = 4 k_f [A]_eq + k_b."),
            ("Relationship between forward/reverse rate constants and equilibrium constant K_c", "II", "K_c = k_f / k_b; ln K_c = ln k_f - ln k_b", "At dynamic equilibrium forward rate equals reverse rate: k_f [A]_eq = k_b [B]_eq, hence K_c = [B]_eq / [A]_eq = k_f / k_b.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_056", t, "advanced",
        "Match the Lindemann-Hinshelwood unimolecular reaction mechanism stages in List I with their kinetic rate laws in List II (A + M ⇌ A* + M with k₁, k₋₁; A* → P with k₂):",
        [
            ("Steady-state concentration of energized intermediate A* ([A*])", "II", "[A*] = (k₁ [A] [M]) / (k₋₁ [M] + k₂)", "Applying SSA: d[A*]/dt = k₁[A][M] - k₋₁[A*][M] - k₂[A*] = 0 => [A*](k₋₁[M] + k₂) = k₁[A][M], yielding this exact relation."),
            ("High-pressure limit ([M] → ∞, k₋₁ [M] >> k₂)", "IV", "Rate = (k₁ k₂ / k₋₁) [A] = k_∞ [A] (First order in A, independent of [M])", "When deactivation collisions dominate (k₋₁[M] >> k₂), the denominator approximates k₋₁[M], so [M] cancels: rate = (k₁ k₂ / k₋₁) [A]."),
            ("Low-pressure limit ([M] → 0, k₂ >> k₋₁ [M])", "I", "Rate = k₁ [A] [M] (Second order overall: first order in A and first order in M)", "At low pressure, collision excitation is rate-determining (k₂ >> k₋₁[M]), so denominator ≈ k₂, yielding rate = k₁ [A][M]."),
            ("Effective unimolecular rate constant k_eff where rate = k_eff [A]", "III", "1 / k_eff = 1 / k_∞ + 1 / (k₁ [M]); 1/k_eff vs 1/[M] gives a straight line", "k_eff = k₁ k₂ [M] / (k₋₁ [M] + k₂). Taking the reciprocal yields 1/k_eff = (k₋₁ / (k₁ k₂)) + 1 / (k₁ [M]) = 1/k_∞ + 1/(k₁ [M]).")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_057", t, "advanced",
        "Match the enzyme kinetic parameters and representations in the Michaelis-Menten mechanism in List I with their descriptions in List II:",
        [
            ("Michaelis constant (K_m) definition: E + S ⇌ ES → E + P (k₁, k₋₁, k₂)", "III", "K_m = (k₋₁ + k₂) / k₁; substrate concentration at which reaction rate v = V_max / 2", "Briggs-Haldane steady-state derivation defines K_m = (k₋₁ + k₂)/k₁. When [S] = K_m, v = V_max [S] / (2 [S]) = V_max / 2."),
            ("Lineweaver-Burk double-reciprocal equation", "I", "1 / v = (K_m / V_max) · (1 / [S]) + 1 / V_max", "Taking the reciprocal of Michaelis-Menten equation v = V_max [S] / (K_m + [S]) gives 1/v = K_m/(V_max [S]) + 1/V_max. Slope = K_m/V_max, y-intercept = 1/V_max."),
            ("Catalytic constant / Turnover number (k_cat)", "IV", "k_cat = V_max / [E]₀; number of substrate molecules converted to product per enzyme active site per second", "Under saturating substrate conditions, all enzyme is bound as ES, so V_max = k₂ [E]₀ = k_cat [E]₀."),
            ("Catalytic efficiency of an enzyme", "II", "k_cat / K_m; second-order rate constant at low substrate concentrations, upper limit set by diffusion (10⁸ - 10⁹ M⁻¹·s⁻¹)", "At [S] << K_m, v = (k_cat / K_m) [E]₀ [S], so k_cat / K_m measures overall catalytic proficiency.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_058", t, "advanced",
        "Match the Transition State Theory (Eyring-Polanyi) equations in List I with their thermodynamic and Arrhenius relationships in List II:",
        [
            ("Eyring equation for rate constant k", "IV", "k = (k_B T / h) · exp(ΔS^‡ / R) · exp(-ΔH^‡ / (R T))", "According to transition state theory, rate constant k = (k_B T / h) K^‡ = (k_B T / h) e^(ΔS^‡/R) e^(-ΔH^‡/RT), where k_B is Boltzmann constant and h is Planck constant."),
            ("Relationship between Arrhenius E_a and enthalpy of activation ΔH^‡ for a bimolecular gas reaction", "I", "E_a = ΔH^‡ + 2 R T", "From Arrhenius definition E_a = R T² (d ln k / dT). For bimolecular gas reactions (Δn^‡ = -1), E_a = ΔH^‡ - Δn^‡ R T + R T = ΔH^‡ + 2 R T."),
            ("Relationship between E_a and ΔH^‡ for reactions in solution", "II", "E_a = ΔH^‡ + R T", "For condensed phase reactions, volume changes are negligible (ΔV^‡ ≈ 0), so ΔH^‡ ≈ ΔU^‡ and E_a = ΔH^‡ + RT."),
            ("Entropy of activation (ΔS^‡) for an associative transition state", "III", "Highly negative (ΔS^‡ < 0) due to loss of translational and rotational degrees of freedom", "When two free reactant molecules combine to form a single tightly ordered activated complex, entropy decreases substantially (ΔS^‡ << 0).")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_059", t, "advanced",
        "Match the photochemical kinetics and chain reaction concepts in List I with their governing laws and equations in List II:",
        [
            ("Stark-Einstein Law of Photochemical Equivalence", "I", "Each reacting molecule absorbs exactly one quantum (photon) of light in the primary photochemical step", "Stark and Einstein established that the primary photochemical activation is a 1-to-1 quantum process: 1 molecule + 1 photon hν → 1 activated molecule."),
            ("Quantum yield (quantum efficiency, Φ)", "III", "Φ = (Number of molecules reacting or formed) / (Number of quanta of light absorbed)", "By definition, Φ = moles of product / einsteins of light absorbed. Can be << 1 (deactivation) or >> 1 (chain reactions)."),
            ("Photochemical reaction H₂(g) + Cl₂(g) --(hν)--> 2HCl(g) with Φ = 10⁴ - 10⁶", "IV", "High quantum yield driven by exothermic free-radical chain propagation (Cl• + H₂ → HCl + H•; H• + Cl₂ → HCl + Cl•)", "A single photon produces two Cl• radicals, which propagate a self-sustaining catalytic cycle producing thousands of HCl molecules before termination."),
            ("Stern-Volmer equation for fluorescence quenching", "II", "I₀ / I = 1 + K_SV [Q] = 1 + k_q τ₀ [Q]", "Describes collisional quenching of fluorescence by quencher Q, where I₀ and I are fluorescence intensities in absence and presence of Q, and K_SV is the Stern-Volmer quenching constant.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_060", t, "advanced",
        "Match the polymerization kinetics and molecular weight growth mechanisms in List I with their mathematical models in List II:",
        [
            ("Carothers equation for step-growth (condensation) polymerization", "II", "DP_n = 1 / (1 - p); high molar mass requires fractional conversion p > 0.99", "For stoichiometric bifunctional monomers, number-average degree of polymerization DP_n = N₀ / N = 1 / (1 - p), where p is fractional conversion of functional groups."),
            ("Rate of propagation (R_p) in free radical chain-growth polymerization", "IV", "R_p = k_p [M] · (f k_d [I] / k_t)^(1/2); proportional to [M] and [I]^(1/2)", "In free-radical polymerization, equating initiation rate R_i = 2 f k_d [I] to bimolecular termination rate R_t = 2 k_t [M•]² gives [M•] ∝ [I]^(1/2), hence R_p = k_p [M][M•] ∝ [M][I]^(1/2)."),
            ("Kinetic chain length (ν) in free radical polymerization", "I", "ν = R_p / R_i = (k_p [M]) / (2 √(f k_d k_t [I]))", "Kinetic chain length is the average number of monomer units incorporated per initiated radical center: ν = R_p / R_i = R_p / R_t."),
            ("Gel effect (Trommsdorff-Norrish effect / autoacceleration)", "III", "Surge in polymerization rate and molecular weight due to increased viscosity hindering radical termination (k_t drops sharply)", "At high conversion, macroradicals become diffusion-limited and cannot collide to terminate, drastically decreasing k_t while small monomers still diffuse to propagate, causing rate autoacceleration.")
        ], "D"))

    return qs
