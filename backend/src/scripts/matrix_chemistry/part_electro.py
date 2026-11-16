from builder import make_matrix_q

def get_electro_questions():
    qs = []
    t = "Electrochemistry"

    # 4 Beginner: A, B, C, D
    qs.append(make_matrix_q("chem_pc3_021", t, "beginner",
        "Match the fundamental cell terminology and conventions in electrochemistry in List I with their descriptions in List II:",
        [
            ("Anode in a Galvanic (Voltaic) cell", "III", "Negative electrode where oxidation occurs spontaneously (electrons leave cell)", "By definition, oxidation always occurs at the anode. In a galvanic cell, spontaneous oxidation produces electrons, making the anode the negative terminal."),
            ("Cathode in an Electrolytic cell", "I", "Negative electrode where reduction occurs driven by an external power source", "Reduction always occurs at the cathode. In an electrolytic cell, electrons are forced onto the cathode from the negative terminal of the external DC power supply."),
            ("Function of the Salt Bridge", "IV", "Maintains electrical neutrality of half-cell electrolytes and eliminates liquid junction potential", "The salt bridge supplies inert ions (such as K⁺ and NO₃⁻) of equal mobilities to neutralize excess charge without allowing bulk mixing of electrolyte solutions."),
            ("Direction of electronic current in external circuit of a Galvanic cell", "II", "Flows from cathode to anode (opposite to electron flow from anode to cathode)", "Electrons flow spontaneously from anode (negative) to cathode (positive) through the external wire; conventional current flows from cathode to anode.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_022", t, "beginner",
        "Match the standard reduction potentials E° (at 298 K) in List I with their redox chemical interpretations in List II:",
        [
            ("F₂(g) + 2e⁻ → 2F⁻, E° = +2.87 V (highest standard reduction potential)", "IV", "F₂ is the strongest oxidizing agent; F⁻ has zero tendency to act as a reducing agent in water", "The highest positive reduction potential indicates maximum thermodynamic tendency to gain electrons (be reduced), making molecular fluorine the strongest oxidizing agent."),
            ("Li⁺ + e⁻ → Li(s), E° = -3.05 V (most negative standard reduction potential)", "II", "Li(s) is the strongest reducing agent in aqueous medium due to its exceptionally high hydration enthalpy", "The highly negative standard reduction potential reflects the immense driving force for Li(s) to oxidize to Li⁺(aq), driven by the exceptionally large hydration enthalpy of the small Li⁺ ion."),
            ("Standard Hydrogen Electrode (SHE): 2H⁺ + 2e⁻ ⇌ H₂(g)", "I", "Arbitrarily assigned standard reduction potential E° = 0.00 V at all temperatures", "SHE is the international primary reference electrode against which all standard electrode potentials are measured and defined as 0.00 V at all temperatures."),
            ("Zn²⁺ / Zn (E° = -0.76 V) vs Cu²⁺ / Cu (E° = +0.34 V)", "III", "Zn can displace Cu²⁺ from aqueous solution spontaneously, generating E°_cell = +1.10 V", "Zn is more electropositive (more negative E°), so Zn(s) reduces Cu²⁺(aq) spontaneously: E°_cell = E°_cathode - E°_anode = +0.34 - (-0.76) = +1.10 V.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_023", t, "beginner",
        "Match the electrolysis quantities according to Faraday's laws in List I with their values in List II:",
        [
            ("Quantity of electricity carried by 1 mole of electrons (Faraday constant, F)", "II", "96,500 C (approx. 96,485 C/mol)", "1 Faraday = N_A × e = 6.022 × 10²³ × 1.602 × 10⁻¹⁹ C ≈ 96,485 C ≈ 96,500 C."),
            ("Number of Faradays required to deposit 1 mole of Al from molten Al₂O₃", "IV", "3 F", "Al³⁺ + 3e⁻ → Al(s). Deposition of 1 mole of aluminum requires 3 moles of electrons, which equals 3 Faradays of electrical charge."),
            ("Mass of Ag deposited by passing 1.0 A current for 965 seconds through AgNO₃(aq) (Ag = 108 g/mol)", "I", "1.08 g", "Q = I · t = 1.0 × 965 = 965 C. Moles of electrons = 965 / 96500 = 0.01 mol. Ag⁺ + e⁻ → Ag, so 0.01 mol Ag is deposited = 0.01 × 108 = 1.08 g."),
            ("Volume of O₂(g) at STP liberated at anode by passing 2 F of electricity through acidified water", "III", "11.2 L", "2 H₂O → O₂ + 4 H⁺ + 4e⁻. 4 Faradays liberate 1 mole of O₂ (22.4 L at STP). Thus 2 Faradays liberate 0.50 mole of O₂ = 0.50 × 22.4 = 11.2 L.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_024", t, "beginner",
        "Match the electrolytic conductance terms in List I with their SI / standard units and definitions in List II:",
        [
            ("Conductance (G)", "III", "Siemens (S or Ω⁻¹), inverse of resistance (G = 1/R)", "Conductance is the reciprocal of electrical resistance: G = 1/R, with unit Ohm⁻¹ or Siemens (S)."),
            ("Specific conductance / Conductivity (κ)", "I", "S·m⁻¹ or S·cm⁻¹, conductance of 1 m³ (or 1 cm³) of electrolytic solution", "Conductivity κ = G · (l/A), having units S·cm⁻¹ or S·m⁻¹. It is the conductance of unit volume of solution."),
            ("Cell constant (G* = l / A)", "IV", "cm⁻¹ or m⁻¹, ratio of distance between electrodes to electrode plate area", "Cell constant G* = l / A, where l is distance between plates and A is cross-sectional area, measured in cm⁻¹ or m⁻¹."),
            ("Molar conductivity (Λ_m)", "II", "S·cm²·mol⁻¹ or S·m²·mol⁻¹, conducting power of all ions produced by 1 mole of electrolyte", "Molar conductivity is defined as Λ_m = (1000 · κ) / M in CGS units (S·cm²·mol⁻¹) or κ / C in SI units (S·m²·mol⁻¹).")
        ], "D"))

    # 8 Intermediate: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_025", t, "intermediate",
        "Match the Kohlrausch law applications and conductance calculations in List I with their expressions or values in List II:",
        [
            ("Limiting molar conductivity of acetic acid Λ°_m(CH₃COOH)", "IV", "Λ°_m(CH₃COONa) + Λ°_m(HCl) - Λ°_m(NaCl)", "By Kohlrausch's law of independent migration of ions: Λ°_m(CH₃COOH) = λ°(CH₃COO⁻) + λ°(H⁺) = [λ°(CH₃COO⁻) + λ°(Na⁺)] + [λ°(H⁺) + λ°(Cl⁻)] - [λ°(Na⁺) + λ°(Cl⁻)]."),
            ("Degree of dissociation (α) of a weak electrolyte from molar conductivities", "I", "α = Λ_m / Λ°_m", "Arrhenius-Ostwald conductance relation gives the fraction of dissociated electrolyte as the ratio of molar conductivity at concentration c to that at infinite dilution."),
            ("Dissociation constant K_a of a weak monoprotic acid HA", "III", "K_a = [c · (Λ_m / Λ°_m)²] / [1 - (Λ_m / Λ°_m)]", "Substituting α = Λ_m / Λ°_m into Ostwald's dilution law K_a = c α² / (1 - α) gives this exact conductance equation."),
            ("Limiting molar conductivity of BaCl₂ from ionic conductivities λ°(Ba²⁺) = 127 S cm²/mol, λ°(Cl⁻) = 76 S cm²/mol", "II", "279 S·cm²·mol⁻¹", "Λ°_m(BaCl₂) = λ°(Ba²⁺) + 2 λ°(Cl⁻) = 127 + 2(76) = 127 + 152 = 279 S·cm²·mol⁻¹.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_026", t, "intermediate",
        "Match the electrochemical half-cells and full cells in List I with their Nernst equation representations at 298 K in List II:",
        [
            ("Hydrogen electrode: 2H⁺(aq) + 2e⁻ ⇌ H₂(g, 1 atm)", "III", "E = -0.0591 · pH", "E = E° - (0.0591/2) log (P_H2 / [H⁺]²) = 0 - (0.0591/2) log (1 / [H⁺]²) = -0.0591 log (1/[H⁺]) = -0.0591 pH."),
            ("Daniell cell: Zn(s) + Cu²⁺(aq) ⇌ Zn²⁺(aq) + Cu(s)", "I", "E_cell = E°_cell - (0.0591 / 2) log ([Zn²⁺] / [Cu²⁺])", "Two electrons are transferred (n = 2). Reaction quotient Q = [Zn²⁺] / [Cu²⁺]. Hence E_cell = E°_cell - (0.0591/2) log Q."),
            ("General half-cell: Mⁿ⁺(aq) + ne⁻ ⇌ M(s)", "IV", "E = E° + (0.0591 / n) log [Mⁿ⁺]", "E = E° - (0.0591 / n) log (1 / [Mⁿ⁺]) = E° + (0.0591 / n) log [Mⁿ⁺]."),
            ("Permanganate half-cell: MnO₄⁻ + 8H⁺ + 5e⁻ ⇌ Mn²⁺ + 4H₂O", "II", "E = E° - (0.0591 / 5) log ([Mn²⁺] / ([MnO₄⁻] · [H⁺]⁸))", "n = 5 electrons. Q = [Mn²⁺] / ([MnO₄⁻][H⁺]⁸). E = E° - (0.0591/5) log Q, showing strong pH dependence.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_027", t, "intermediate",
        "Match the thermodynamic parameters of electrochemical cells in List I with their fundamental mathematical relations in List II:",
        [
            ("Standard Gibbs free energy change (ΔG°)", "II", "ΔG° = -n F E°_cell = -R T ln K_c", "Electrical work done W_elec = n F E°_cell = -ΔG°. Equating with chemical equilibrium ΔG° = -RT ln K_c relates cell EMF directly to equilibrium constant."),
            ("Entropy of cell reaction (ΔS)", "IV", "ΔS = n F (∂E / ∂T)_P", "From Maxwell relations, (∂G/∂T)_P = -S, so ΔS = - [∂(ΔG)/∂T]_P = - [∂(-nFE)/∂T]_P = nF (∂E/∂T)_P, where (∂E/∂T)_P is the temperature coefficient of EMF."),
            ("Enthalpy of cell reaction (ΔH)", "I", "ΔH = -n F E + n F T (∂E / ∂T)_P", "Using Gibbs-Helmholtz equation ΔH = ΔG + T ΔS = -nFE + T [nF (∂E/∂T)_P] = -nFE + nFT (∂E/∂T)_P."),
            ("Equilibrium constant K_c at 298 K for n = 2 and E°_cell = 1.10 V", "III", "log₁₀ K_c = (2 × 1.10) / 0.0591 ≈ 37.22", "E°_cell = (0.0591 / n) log K_c => log K_c = n E° / 0.0591 = (2 × 1.10) / 0.0591 ≈ 37.22.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_028", t, "intermediate",
        "Match the types of concentration cells in List I with their EMF equations and characteristics in List II:",
        [
            ("Electrode concentration cell without transference: Pt, H₂(p₁) | H⁺(c) | H₂(p₂), Pt", "II", "E_cell = (0.0591 / 2) log (p₁ / p₂); spontaneous when p₁ > p₂", "Anode: H₂(p₁) → 2H⁺ + 2e⁻; Cathode: 2H⁺ + 2e⁻ → H₂(p₂). Net: H₂(p₁) → H₂(p₂). E = - (0.0591/2) log (p₂/p₁) = (0.0591/2) log (p₁/p₂)."),
            ("Electrolyte concentration cell: Cu | Cu²⁺(c₁) || Cu²⁺(c₂) | Cu", "IV", "E_cell = (0.0591 / 2) log (c₂ / c₁); spontaneous when c₂ > c₁", "Oxidation occurs in dilute solution (anode, c₁) and reduction occurs in concentrated solution (cathode, c₂). E = E° - (0.0591/2) log (c₁/c₂) = (0.0591/2) log (c₂/c₁)."),
            ("Standard EMF (E°_cell) of any concentration cell", "I", "E°_cell = 0.00 V", "Both half-cells have the identical chemical species in their standard states, so E°_cathode = E°_anode, meaning E°_cell = 0 identically."),
            ("Liquid junction potential (E_lj)", "III", "Arises at the liquid interface of two different electrolyte solutions due to unequal ionic diffusion speeds", "When two electrolytes meet, ions with higher mobilities diffuse faster across the boundary, generating a charge separation and potential difference called the liquid junction potential.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_029", t, "intermediate",
        "Match the commercial batteries and electrochemical accumulators in List I with their chemical reactions or characteristics in List II:",
        [
            ("Lead storage battery (discharging reaction at anode)", "III", "Pb(s) + SO₄²⁻(aq) → PbSO₄(s) + 2e⁻", "In the lead accumulator during discharge, spongy lead anode is oxidized to insoluble lead sulfate, consuming sulfuric acid."),
            ("Lead storage battery (discharging reaction at cathode)", "I", "PbO₂(s) + 4H⁺(aq) + SO₄²⁻(aq) + 2e⁻ → PbSO₄(s) + 2H₂O(l)", "Lead dioxide cathode is reduced to lead sulfate, consuming H⁺ and sulfate ions, which lowers the density of the H₂SO₄ electrolyte from ~1.30 g/mL to <1.20 g/mL."),
            ("Mercury button cell (anode and cathode overall reaction)", "IV", "Zn(Hg) + HgO(s) → ZnO(s) + Hg(l); voltage remains constant at 1.35 V throughout its life", "The overall reaction does not involve any dissolved ions whose concentrations could change during discharge; hence the cell potential remains exceptionally stable at 1.35 V."),
            ("Nickel-Cadmium (Ni-Cd) secondary cell (overall discharge reaction)", "II", "Cd(s) + 2Ni(OH)₃(s) → CdO(s) + 2Ni(OH)₂(s) + H₂O(l)", "Ni-Cd is a rechargeable alkaline cell delivering ~1.4 V, with longer cycle life than lead-acid batteries, although cadmium presents heavy metal toxicity.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_030", t, "intermediate",
        "Match the fuel cell and corrosion processes in List I with their chemical equations and physical parameters in List II:",
        [
            ("Cathode reaction in alkaline H₂-O₂ fuel cell (Apollo space mission cell)", "IV", "O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)", "At the porous carbon cathode infused with catalysts (Pt/Pd), oxygen gas is reduced in the presence of water to hydroxide ions."),
            ("Anode reaction in alkaline H₂-O₂ fuel cell", "II", "2H₂(g) + 4OH⁻(aq) → 4H₂O(l) + 4e⁻", "At the porous anode, hydrogen gas is oxidized by reacting with OH⁻ to form water and release 4 electrons."),
            ("Thermodynamic efficiency (η) of a fuel cell", "I", "η = (ΔG / ΔH) × 100%, can theoretically exceed 80%", "Unlike thermal heat engines bounded by the Carnot limit (1 - T_c/T_h), fuel cells directly convert chemical free energy to electrical work: η = ΔG / ΔH."),
            ("Cathodic protection of iron pipes using a sacrificial anode", "III", "Connecting iron to a more electropositive metal like Mg or Zn (which oxidizes preferentially)", "Magnesium or zinc has a more negative reduction potential than iron (E°_Mg = -2.37 V vs E°_Fe = -0.44 V), so it corrodes sacrificially, forcing iron to act as cathode.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_031", t, "intermediate",
        "Match the concentration dependence of electrolytic conductivity and molar conductivity in List I with the corresponding laws and phenomena in List II:",
        [
            ("Debye-Hückel-Onsager equation for strong electrolytes", "II", "Λ_m = Λ°_m - A √c", "For strong electrolytes, molar conductivity decreases linearly with √c at low concentrations due to inter-ionic electrostatic attractions (relaxation and electrophoretic effects)."),
            ("Specific conductivity (κ) upon dilution", "IV", "Decreases because the number of current-carrying ions per unit volume decreases", "Although degree of dissociation may increase slightly, dilution increases total volume much more, reducing ions per cm³, thus decreasing κ."),
            ("Molar conductivity (Λ_m) upon dilution", "I", "Increases because the volume containing 1 mole of electrolyte increases more than κ decreases (Λ_m = κ · V)", "Molar conductivity represents conductance of all ions from 1 mole; dilution increases ion mobility and dissociation, so Λ_m increases monotonically."),
            ("Molar conductivity (Λ_m) vs √c curve for weak electrolytes (e.g., CH₃COOH)", "III", "Shows a steep upward curve as c → 0; cannot be extrapolated to c = 0 to determine Λ°_m", "Weak electrolytes have low dissociation at higher c, but α surges sharply near infinite dilution, causing a steep asymptote that prevents linear graphical extrapolation.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_032", t, "intermediate",
        "Match the electrolytic systems in List I with their primary anode and cathode products in List II:",
        [
            ("Electrolysis of concentrated aqueous NaCl (brine) using inert Pt electrodes", "II", "Anode: Cl₂(g); Cathode: H₂(g) (solution becomes alkaline NaOH)", "At anode, chloride is oxidized to Cl₂ due to oxygen overvoltage. At cathode, H⁺ from water is reduced to H₂ because E°(H⁺/H₂) > E°(Na⁺/Na)."),
            ("Electrolysis of very dilute aqueous NaCl using inert Pt electrodes", "IV", "Anode: O₂(g); Cathode: H₂(g) (net decomposition of water)", "In highly dilute solution, chloride concentration is too low, so oxidation of water to O₂ predominates over chloride oxidation."),
            ("Electrolysis of aqueous CuSO₄ using inert Pt electrodes", "I", "Anode: O₂(g); Cathode: Cu(s) (solution becomes acidic H₂SO₄)", "At cathode, Cu²⁺ reduces to Cu (E° = +0.34 V). At anode, water oxidizes to O₂ + 4H⁺ (E° = +1.23 V), generating H₂SO₄."),
            ("Electrolysis of aqueous CuSO₄ using active Cu electrodes (electro-refining)", "III", "Anode: Cu(s) dissolves (Cu → Cu²⁺ + 2e⁻); Cathode: Pure Cu(s) deposits", "Using copper anode, copper dissolution requires lower potential than water oxidation; impure anode dissolves and pure copper deposits on cathode.")
        ], "D"))

    # 8 Advanced: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_033", t, "advanced",
        "Match the potentiometric titration parameters and equivalence point relations in List I with their mathematical formulas in List II:",
        [
            ("Equivalence point potential for titration of Fe²⁺ by Ce⁴⁺: Fe²⁺ + Ce⁴⁺ ⇌ Fe³⁺ + Ce³⁺", "III", "E_eq = (E°_Fe³⁺/Fe²⁺ + E°_Ce⁴⁺/Ce³⁺) / 2", "Since both half-reactions involve n = 1 electron, at equivalence point [Fe²⁺] = [Ce⁴⁺] and [Fe³⁺] = [Ce³⁺]. Adding the two Nernst equations yields E_eq = (E°₁ + E°₂) / 2."),
            ("General equivalence point potential for a redox reaction: n₁ Ox₁ + n₂ Red₂ ⇌ n₁ Red₁ + n₂ Ox₂", "I", "E_eq = (n₁ E°₁ + n₂ E°₂) / (n₁ + n₂)", "Adding n₁ × Nernst(1) and n₂ × Nernst(2) eliminates the concentration terms due to equivalence stoichiometry, giving E_eq = (n₁ E°₁ + n₂ E°₂) / (n₁ + n₂)."),
            ("Inflection point on the potentiometric curve (E vs volume V)", "IV", "Identified by (d²E / dV²) = 0 or maximum of (dE / dV)", "In potentiometric titrations, the equivalence point corresponds to the steepest slope (dE/dV is maximal), where the second derivative d²E/dV² changes sign through zero."),
            ("Redox indicator transition potential range", "II", "E_trans = E°_ind ± (0.0591 / n) V", "An indicator changes color over the ratio [In_ox]/[In_red] between 0.1 and 10, corresponding to E = E°_ind ± (0.0591/n) log 10 = E°_ind ± 0.0591/n V.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_034", t, "advanced",
        "A galvanic cell has temperature-dependent EMF given by E(T) = a + b(T - 298) + c(T - 298)². Match the thermodynamic quantities at 298 K in List I with their expressions in List II:",
        [
            ("Standard cell potential E° at 298 K", "IV", "a", "Setting T = 298 K in E(T) leaves E° = a."),
            ("Temperature coefficient of EMF (∂E / ∂T)_P at 298 K", "I", "b", "Differentiating E with respect to T gives ∂E/∂T = b + 2c(T - 298). At T = 298 K, (∂E/∂T)_P = b."),
            ("Entropy change of reaction (ΔS) at 298 K", "II", "n F b", "ΔS = n F (∂E / ∂T)_P = n F b."),
            ("Enthalpy change of reaction (ΔH) at 298 K", "III", "-n F a + 298 n F b", "ΔH = ΔG + T ΔS = -nFE + T(nF ∂E/∂T) = -n F a + 298 n F b.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_035", t, "advanced",
        "Match the electrochemical cell setups involving sparingly soluble salts and complexes in List I with their thermodynamic equations in List II:",
        [
            ("Cell: Ag(s) | AgCl(s), Cl⁻(1.0 M) || Ag⁺(1.0 M) | Ag(s)", "I", "E°_cell = (0.0591 / 1) log (1 / K_sp) = -0.0591 log K_sp", "Anode is Ag + Cl⁻ → AgCl + e⁻ (E° = +0.22 V); Cathode is Ag⁺ + e⁻ → Ag (E° = +0.80 V). E°_cell = 0.80 - 0.22 = 0.58 V = (0.0591) log (1/K_sp), allowing determination of K_sp."),
            ("Concentration cell with K_sp: Ag(s) | Ag⁺(sat. AgI) || Ag⁺(0.10 M) | Ag(s)", "III", "E_cell = 0.0591 log (0.10 / √K_sp)", "At cathode [Ag⁺] = 0.10 M; at anode [Ag⁺] = √K_sp (since AgI → Ag⁺ + I⁻). E_cell = 0.0591 log (0.10 / √K_sp)."),
            ("Complex formation cell: Ag | [Ag(NH₃)₂]⁺, NH₃ || Ag⁺ | Ag", "IV", "E°_cell = 0.0591 log K_f (where K_f is formation constant of [Ag(NH₃)₂]⁺)", "The difference between standard potentials of free Ag⁺ and complexed Ag⁺ directly yields the stability constant K_f: E° = (RT/F) ln K_f."),
            ("Standard calomel electrode (SCE): Hg(l) | Hg₂Cl₂(s) | KCl(saturated)", "II", "Potential E = +0.244 V vs SHE; widely used secondary reference electrode", "The standard calomel electrode has a fixed potential of +0.244 V at 298 K because chloride concentration is held constant by saturated KCl.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_036", t, "advanced",
        "Match the transport numbers and ionic mobility concepts in List I with their mathematical relationships in List II:",
        [
            ("Transport number (transference number) t₊ of cation", "II", "t₊ = u₊ / (u₊ + u₋) = λ°₊ / (λ°₊ + λ°₋)", "Transport number is the fraction of total electrical current carried by the cation: t₊ = I₊ / I_total = u₊ / (u₊ + u₋) = λ°₊ / Λ°_m."),
            ("Fundamental sum of transport numbers in any binary electrolyte", "IV", "t₊ + t₋ = 1", "Total current in the solution is carried entirely by cations and anions, hence t₊ + t₋ = 1 identically."),
            ("Relation between ionic mobility (u) and limiting molar ionic conductivity (λ°)", "I", "λ° = z · F · u", "Mobility u is ion drift velocity per unit electric field (m²·V⁻¹·s⁻¹). Current density J = z F u c E, leading directly to λ° = z F u."),
            ("Hittorf's rule for transport numbers in Hittorf cell", "III", "(Loss of electrolyte around anode) / (Loss around cathode) = t₊ / t₋ = u₊ / u₋", "Hittorf established that the loss in equivalents around an electrode compartment is directly proportional to the speed/mobility of the ion migrating away from it.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_037", t, "advanced",
        "Match the redox diagram concepts (Latimer, Frost, Pourbaix) in List I with their thermodynamic principles in List II:",
        [
            ("Latimer diagram: Skip-potential calculation E°(A → C) for A --(n₁, E°₁)--> B --(n₂, E°₂)--> C", "III", "E°(A → C) = (n₁ E°₁ + n₂ E°₂) / (n₁ + n₂)", "Standard potentials cannot be added directly because E° is intensive. Gibbs energies add: ΔG°_total = ΔG°₁ + ΔG°₂ => -(n₁+n₂)F E°_total = -n₁ F E°₁ - n₂ F E°₂."),
            ("Disproportionation criterion in a Latimer diagram (A --(E°_L)--> B --(E°_R)--> C)", "I", "Species B disproportions spontaneously if E°_R > E°_L", "For 2B → A + C, E°_cell = E°_R - E°_L. For spontaneity, E°_cell > 0, which requires E°_R > E°_L (potential on the right is higher than on the left)."),
            ("Frost diagram (Plot of n·E° vs Oxidation State)", "IV", "Slope between two points equals standard potential E°; peak represents instability towards disproportionation", "On a Frost diagram, ΔG°/F = -nE°. The slope between adjacent species is E°. A species lying above the line connecting its neighbors is unstable to disproportionation."),
            ("Pourbaix (E - pH) diagram", "II", "Maps phase stability regions of species as a function of potential E and pH; horizontal lines represent pure electron transfer", "Horizontal boundaries involve electrons only (no H⁺), vertical boundaries involve H⁺ only (no electrons), and sloping lines involve both electrons and protons.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_038", t, "advanced",
        "Match the electrochemical kinetics and overpotential terms in List I with their defining mathematical models in List II:",
        [
            ("Tafel equation for high overpotential (η > 0.1 V)", "IV", "η = a + b log₁₀ i (where b = 2.303 R T / (α n F))", "At high anodic or cathodic overpotential, the reverse current becomes negligible, reducing Butler-Volmer equation to the logarithmic Tafel form η = a + b log i."),
            ("Exchange current density (i₀)", "I", "Dynamic equilibrium rate of electron transfer across interface at zero overpotential (η = 0)", "At dynamic equilibrium, anodic and cathodic current densities are equal in magnitude: |i_a| = |i_c| = i₀. Higher i₀ indicates faster, more reversible electrode kinetics."),
            ("Hydrogen overpotential on mercury cathode (η_H2 ≈ 1.0 V) vs platinum black (η_H2 ≈ 0 V)", "II", "Allows electrochemical reduction of Na⁺ into Hg to form Na-Hg amalgam without liberating H₂ in Castner-Kellner process", "The exceptionally high hydrogen overpotential on mercury suppresses H₂ evolution, allowing deposition of sodium into Hg forming sodium amalgam."),
            ("Mass-transfer limited current density (i_L)", "III", "i_L = (n F D c_bulk) / δ; independent of further increase in overpotential", "When overpotential is high, surface concentration drops to zero, and the rate is governed solely by Fickian diffusion across boundary layer thickness δ: i_L = n F D c_bulk / δ.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_039", t, "advanced",
        "Match the membrane and liquid junction phenomena in List I with their governing electrochemical equations in List II:",
        [
            ("Donnan membrane equilibrium for a polyelectrolyte R⁻ Na⁺ separated by membrane from NaCl", "I", "[Na⁺]_in / [Na⁺]_out = [Cl⁻]_out / [Cl⁻]_in", "At equilibrium, chemical potential of the diffusible salt NaCl must be equal on both sides: a_Na⁺(in) · a_Cl⁻(in) = a_Na⁺(out) · a_Cl⁻(out), yielding [Na⁺]_in / [Na⁺]_out = [Cl⁻]_out / [Cl⁻]_in."),
            ("Henderson equation for liquid junction potential between two 1:1 electrolytes", "III", "E_lj = [(u₊ - u₋) / (u₊ + u₋)] · (R T / F) ln (a₁ / a₂)", "The liquid junction potential between two concentrations of a single 1:1 electrolyte depends on the difference in ionic mobilities: E_lj = (t₊ - t₋) (RT/F) ln(a₁/a₂)."),
            ("Membrane potential (Donnan potential, Δϕ_D)", "IV", "Δϕ_D = (R T / F) ln ([Na⁺]_out / [Na⁺]_in)", "The unequal distribution of diffusible ions across the membrane establishes an equilibrium electrical potential difference given by the Nernst-Donnan equation."),
            ("Why KCl is ideal in salt bridges (t_K⁺ ≈ t_Cl⁻)", "II", "u(K⁺) ≈ u(Cl⁻), minimizing the liquid junction potential to near zero (< 1 mV)", "In KCl, potassium and chloride ions have nearly identical mobilities (u_K⁺ = 7.62 × 10⁻⁸, u_Cl⁻ = 7.91 × 10⁻⁸ m²V⁻¹s⁻¹), ensuring almost zero charge separation.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_040", t, "advanced",
        "Match the industrial electrochemical processes in List I with their stoichiometric and energy calculations in List II:",
        [
            ("Chlor-alkali membrane cell: Current efficiency η_I = 90%, current I = 10,000 A running for 965 s", "II", "Moles of Cl₂ produced = 45 mol", "Charge Q = 10,000 × 965 = 9.65 × 10⁶ C = 100 F. Effective charge = 0.90 × 100 = 90 F. 2 Cl⁻ → Cl₂ + 2e⁻, so n_Cl2 = 90 / 2 = 45 moles."),
            ("Hall-Héroult aluminum smelting: Energy consumption for 1 kg Al (M = 27 g/mol) at cell voltage 4.5 V and 100% current efficiency", "IV", "Electrical energy ≈ 13.4 kW·h per kg Al", "1 kg Al = 1000/27 = 37.04 mol Al. Electrons = 3 × 37.04 = 111.11 F = 111.11 × 96,500 C = 1.072 × 10⁷ C. Energy W = V · Q = 4.5 × 1.072 × 10⁷ J = 4.825 × 10⁷ J = 13.4 kWh."),
            ("Electroplating of nickel (Ni = 58.7 g/mol, Ni²⁺ + 2e⁻ → Ni): Thickness of Ni deposit on 100 cm² plate at 5.0 A for 1930 s (density ρ = 8.9 g/cm³)", "I", "Deposit thickness ≈ 0.033 mm", "Q = 5 × 1930 = 9650 C = 0.10 F. Moles Ni = 0.05 mol. Mass = 0.05 × 58.7 = 2.935 g. Volume = 2.935 / 8.9 = 0.33 cm³. Thickness = 0.33 cm³ / 100 cm² = 0.0033 cm = 0.033 mm."),
            ("Faraday current efficiency (η_I) definition", "III", "η_I = (Actual mass of substance liberated / Theoretical mass from Faraday's law) × 100%", "Side reactions (such as concurrent hydrogen evolution during metal plating) reduce current efficiency below 100%: η_I = (w_actual / w_theoretical) × 100%.")
        ], "D"))

    return qs
