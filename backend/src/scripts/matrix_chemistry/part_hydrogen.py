from builder import make_matrix_q

def get_hydrogen_questions():
    qs = []
    t = "Hydrogen"
    prefix = "chem_ioc1"

    # =========================================================================
    # BEGINNER (4 questions: 041 - 044)
    # =========================================================================

    # 041 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_041", t, "beginner",
        "Match the isotopes and nuclear spin forms of hydrogen in List I with their defining nuclear characteristics in List II:",
        [
            ("Protium (1H)", "III",
             "Most abundant isotope (>99.98%), nucleus contains 1 proton and 0 neutrons",
             "Ordinary hydrogen (protium) has mass number 1. Its nucleus consists of a single proton with no neutrons, giving it an atomic mass of ~1.008 amu"),
            ("Deuterium (2H or D)", "I",
             "Heavy isotope, nucleus contains 1 proton and 1 neutron; used as a moderator in nuclear reactors",
             "Deuterium constitutes ~0.0156% of natural hydrogen. Its nucleus (deuteron) has 1 proton and 1 neutron. Heavy water (D2O) is used to moderate neutron speeds in nuclear power plants"),
            ("Tritium (3H or T)", "IV",
             "Radioactive isotope, nucleus contains 1 proton and 2 neutrons; emits low-energy β^- particles (t_1/2 ≈ 12.33 years)",
             "Tritium is an unstable isotope found in minute trace amounts in the upper atmosphere. It undergoes beta decay (3H -> 3He + e^- + ν_e) with a half-life of 12.33 years"),
            ("Ortho and Para Hydrogen", "II",
             "Nuclear spin isomers: ortho has parallel nuclear spins (I = 1), while para has antiparallel nuclear spins (I = 0)",
             "Molecular dihydrogen exists in two isomeric spin states based on proton nuclear spins: ortho-hydrogen has symmetric parallel spins (triplet), whereas para-hydrogen has antisymmetric antiparallel spins (singlet)")
        ],
        "B"
    ))

    # 042 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_042", t, "beginner",
        "Match the classes of hydrides in List I with their representative examples and chemical natures in List II:",
        [
            ("Saline / Ionic hydrides", "IV",
             "High-melting crystalline solids containing the hydride ion (H^-) that react violently with water to liberate H2 (e.g., NaH, CaH2)",
             "Formed by strongly electropositive alkali and alkaline earth metals (s-block except Be/Mg). They have rock-salt structures containing hydride ions (H^-) and act as powerful reducing agents and bases"),
            ("Electron-deficient covalent hydrides", "II",
             "Molecules with insufficient valence electrons to form conventional two-center two-electron bonds; act as Lewis acids (e.g., B2H6)",
             "Formed predominantly by Group 13 elements. In diborane (B2H6), boron cannot satisfy its octet with available electrons, forming 3-center 2-electron bridge bonds and readily accepting electron pairs"),
            ("Electron-precise covalent hydrides", "I",
             "Molecules containing the exact number of valence electrons to form conventional covalent bonds; Lewis neutral (e.g., CH4, SiH4)",
             "Formed primarily by Group 14 elements. Methane (CH4) has 4 valence electron pairs forming 4 C-H sigma bonds in a tetrahedral geometry with no lone pairs or empty orbitals"),
            ("Electron-rich covalent hydrides", "III",
             "Molecules possessing non-bonding lone pairs on the central electronegative atom; act as Lewis bases (e.g., NH3, H2O, HF)",
             "Formed by Groups 15, 16, and 17. The presence of 1, 2, or 3 lone pairs on the central atom allows these hydrides to donate electron pairs or participate in strong hydrogen bonding")
        ],
        "A"
    ))

    # 043 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_043", t, "beginner",
        "Match the laboratory and industrial methods for preparing dihydrogen in List I with their chemical equations in List II:",
        [
            ("Water gas / Syngas reaction", "II",
             "C(s) + H2O(g) -> CO(g) + H2(g) at 1270 K over nickel catalyst",
             "Passing steam over red-hot coke at 1270 K yields an equimolar mixture of carbon monoxide and dihydrogen known as water gas or synthesis gas (syngas)"),
            ("Water gas shift reaction (Bosch process)", "IV",
             "CO(g) + H2O(g) -> CO2(g) + H2(g) at 673 K over Fe2O3-Cr2O3 catalyst",
             "To increase the yield of H2 from syngas, CO is oxidized to CO2 by reaction with steam in the presence of an iron-chromium oxide catalyst; CO2 is subsequently scrubbed with sodium arsenite or water under pressure"),
            ("Electrolysis of acidified water", "I",
             "2H2O(l) -> 2H2(g) + O2(g) using platinum electrodes and dilute H2SO4",
             "Electrolysis of acidified water using inert platinum electrodes produces high-purity dihydrogen gas at the cathode and oxygen gas at the anode"),
            ("Lane's process", "III",
             "3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g) followed by regeneration with water gas",
             "Steam is passed over red-hot iron scrap at 823-1023 K to produce dihydrogen and magnetic iron oxide (Fe3O4); the oxide is then reduced back to iron using water gas (CO + H2) in an alternating cycle")
        ],
        "C"
    ))

    # 044 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_044", t, "beginner",
        "Match the properties and preparations of hydrogen peroxide (H2O2) in List I with their descriptions in List II:",
        [
            ("Auto-oxidation of 2-ethylanthraquinol", "III",
             "Modern industrial process involving cyclic aerial oxidation followed by catalytic hydrogenation over Pd",
             "2-Ethylanthraquinol is oxidized by air to 2-ethylanthraquinone, producing ~1% aqueous H2O2. The quinone is then catalytically reduced back to quinol with H2 over palladium catalyst for continuous reuse"),
            ("Molecular geometry of H2O2", "I",
             "Non-planar open-book structure with dihedral angle 111.5° in gas phase and 90.2° in solid crystal",
             "H2O2 has a chiral C2 symmetry. The O-O single bond has a dihedral angle of 111.5° in the isolated vapor state, which narrows to 90.2° in the solid state due to intermolecular hydrogen bonding forces"),
            ("Volume strength: '10 Volume H2O2'", "IV",
             "1 liter of solution liberates 10 liters of O2 gas at STP; corresponds to ~0.89 M or ~3.03% (w/v)",
             "From 2H2O2 -> 2H2O + O2, 2 moles (68 g) of H2O2 yield 22.4 L (or 22.7 L) of O2 at STP. Thus, 10 V corresponds to M = 10 / 11.2 ≈ 0.89 M and strength = 0.89 × 34 ≈ 30.3 g/L = 3.03%"),
            ("Hydrated barium peroxide laboratory preparation", "II",
             "BaO2·8H2O + H2SO4 (cold, dilute) -> BaSO4(s) + H2O2 + 8H2O",
             "Treating cold hydrated barium peroxide with ice-cold dilute sulfuric acid precipitates insoluble barium sulfate (BaSO4), leaving an aqueous solution of hydrogen peroxide after filtration")
        ],
        "D"
    ))

    # =========================================================================
    # INTERMEDIATE (8 questions: 045 - 052)
    # =========================================================================

    # 045 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_045", t, "intermediate",
        "Match the interstitial/metallic hydrides in List I with their structural and chemical features in List II:",
        [
            ("Palladium hydride (PdH_x)", "III",
             "Can absorb up to ~900 times its volume of H2, used in hydrogen storage and purification",
             "Palladium lattice accommodates atomic hydrogen in interstitial tetrahedral/octahedral voids, forming non-stoichiometric PdH_x (x < 1). Upon heating, pure dihydrogen is desorbed reversibly"),
            ("Titanium hydride (TiH_1.7)", "I",
             "Non-stoichiometric interstitial hydride that retains metallic luster, electrical conductivity, and magnetic properties",
             "Hydrogen atoms occupy interstitial holes in the d-block metal lattice without changing crystal lattice symmetry significantly. Electrons from H populate the d-band, preserving metallic conductivity"),
            ("Hydride gap (Groups 7, 8, 9)", "IV",
             "Elements of groups 7, 8, and 9 (Mn, Fe, Co, Ni congeners) do not form hydrides under normal conditions",
             "Transition metals in Groups 7, 8, and 9 fail to form hydrides due to unfavorable thermodynamics (low affinity of mid-to-late transition metals for hydrogen), creating the famous 'hydride gap'"),
            ("Group 6 hydride (CrH)", "II",
             "Chromium is the only element in Group 6 that forms a hydride under standard conditions",
             "Among Group 6 elements (Cr, Mo, W), only chromium forms a distinct hydride (CrH), while molybdenum and tungsten do not form interstitial hydrides under normal pressures")
        ],
        "B"
    ))

    # 046 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_046", t, "intermediate",
        "Match the types and removal methods of water hardness in List I with their chemical principles in List II:",
        [
            ("Temporary hardness", "IV",
             "Caused by soluble bicarbonates of calcium and magnesium [Ca(HCO3)2, Mg(HCO3)2]; removed by boiling",
             "On heating, soluble bicarbonates decompose into insoluble carbonates: Ca(HCO3)2 -> CaCO3(s) + H2O + CO2, and Mg(HCO3)2 -> Mg(OH)2(s) + 2CO2, which are readily filtered off"),
            ("Permanent hardness", "II",
             "Caused by soluble chlorides and sulfates of calcium and magnesium (CaCl2, MgCl2, CaSO4, MgSO4); cannot be removed by boiling",
             "The chlorides and sulfates of Ca^2+ and Mg^2+ remain soluble upon boiling and require chemical precipitating agents or ion exchangers to be removed"),
            ("Clark's method", "I",
             "Addition of calculated quantity of slaked lime: Ca(HCO3)2 + Ca(OH)2 -> 2CaCO3(s) + 2H2O",
             "Clark's process uses slaked lime Ca(OH)2 to precipitate temporary hardness: Ca^2+ precipitates as CaCO3 while Mg^2+ precipitates as Mg(OH)2 due to its lower solubility product"),
            ("Washing soda method", "III",
             "Addition of Na2CO3 precipitates both temporary and permanent hardness cations as insoluble carbonates",
             "Sodium carbonate converts soluble Ca/Mg salts into insoluble carbonates: MCl2 + Na2CO3 -> MCO3(s) + 2NaCl; MSO4 + Na2CO3 -> MCO3(s) + Na2SO4, effectively softening hard water")
        ],
        "A"
    ))

    # 047 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_047", t, "intermediate",
        "Match the modern water softening processes in List I with their operational mechanisms in List II:",
        [
            ("Zeolite / Permutit process", "II",
             "Hydrated sodium aluminium silicate (Na2Z) exchanges Na+ for Ca^2+ and Mg^2+; regenerated using 10% brine (NaCl)",
             "Zeolite has an open aluminosilicate framework: Na2Z + Ca^2+ -> CaZ + 2Na+. Once exhausted, the zeolite bed is regenerated by washing with a concentrated aqueous NaCl solution: CaZ + 2NaCl -> Na2Z + CaCl2"),
            ("Calgon process", "IV",
             "Sodium hexametaphosphate (Na2[Na4(PO3)6]) sequesters Ca^2+ into soluble complex anion [Na2Ca(PO3)6]^2-",
             "'Calgon' (calcium gone) sequesters hardness ions by replacing two Na+ ions from inside the complex anion with Ca^2+, keeping calcium locked in a soluble non-precipitating complex"),
            ("Synthetic cation exchange resin", "I",
             "Sulfonated polystyrene (R-SO3H) exchanges Ca^2+ and Mg^2+ for H+ ions; regenerated with dilute mineral acid (HCl)",
             "Cation exchange resin contains active -SO3H groups: 2R-SO3H + Ca^2+ -> (R-SO3)2Ca + 2H+. The exhausted resin is regenerated by eluting with aqueous HCl or H2SO4"),
            ("Synthetic anion exchange resin", "III",
             "Basic resin (R-NH3+ OH^-) exchanges Cl^- and SO4^2- for OH^- ions; produces fully demineralized water",
             "The water containing H+ ions from cation exchange passes through anion exchange resin: R-NH3+OH^- + Cl^- -> R-NH3+Cl^- + OH^-. The H+ and OH^- neutralize to form pure deionized water; resin is regenerated with NaOH")
        ],
        "C"
    ))

    # 048 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_048", t, "intermediate",
        "Match the redox reactions of hydrogen peroxide in List I with their redox half-reaction pathways in List II:",
        [
            ("Oxidizing agent in acidic medium (e.g., Fe^2+ to Fe^3+)", "III",
             "2Fe^2+ + 2H+ + H2O2 -> 2Fe^3+ + 2H2O (oxygen is reduced from -1 to -2)",
             "In acidic solution, H2O2 acts as an oxidant via H2O2 + 2H+ + 2e^- -> 2H2O (E° = +1.77 V), oxidizing ferrous ions to ferric ions with no gas evolution"),
            ("Reducing agent in acidic medium (e.g., KMnO4 reduction)", "I",
             "2MnO4^- + 6H+ + 5H2O2 -> 2Mn^2+ + 8H2O + 5O2 (oxygen is oxidized from -1 to 0)",
             "In the presence of strong oxidants like permanganate, H2O2 undergoes oxidation: H2O2 -> O2 + 2H+ + 2e^- (E° = -0.68 V), decolorizing purple KMnO4 with rapid evolution of O2 gas"),
            ("Oxidizing agent in alkaline medium (e.g., Mn^2+ to MnO2)", "IV",
             "Mn^2+ + H2O2 + 2OH^- -> MnO2(s) + 2H2O (manganese is oxidized from +2 to +4)",
             "In basic solution, H2O2 functions as an effective oxidant: H2O2 + 2e^- -> 2OH^- (E° = +0.87 V), precipitating dark brown MnO2 from aqueous Mn^2+ solutions"),
            ("Reducing agent in alkaline medium (e.g., [Fe(CN)6]^3- reduction)", "II",
             "2[Fe(CN)6]^3- + H2O2 + 2OH^- -> 2[Fe(CN)6]^4- + 2H2O + O2 (iron is reduced from +3 to +2)",
             "In alkaline medium, H2O2 reduces yellow potassium ferricyanide to potassium ferrocyanide: 2[Fe(CN)6]^3- + 2OH^- + H2O2 -> 2[Fe(CN)6]^4- + 2H2O + O2")
        ],
        "D"
    ))

    # 049 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_049", t, "intermediate",
        "Match the reactions and properties of heavy water (D2O) in List I with their chemical descriptions in List II:",
        [
            ("Maximum density temperature", "III",
             "Reaches maximum density at 11.2 °C (compared to 3.98 °C for normal water H2O)",
             "Due to stronger deuterium bonding and greater molecular mass, the collapse of the open ice-like cage structure is shifted to a significantly higher temperature in D2O (11.2 °C)"),
            ("Reaction with calcium carbide (CaC2)", "I",
             "CaC2 + 2D2O -> Ca(OD)2 + C2D2 (produces deuteroacetylene)",
             "Hydrolysis of calcium carbide by heavy water yields calcium deuteroxide and deuteroacetylene (dideuteroethyne, C2D2), confirming complete replacement of exchangeable hydrogen"),
            ("Reaction with aluminium carbide (Al4C3)", "IV",
             "Al4C3 + 12D2O -> 4Al(OD)3 + 3CD4 (produces deuteromethane)",
             "Methanide carbide Al4C3 reacts with heavy water to release completely deuterated methane (CD4), used extensively in deuterated NMR solvent synthesis"),
            ("Nuclear reactor moderator mechanism", "II",
             "Slows down high-energy fission neutrons via elastic collisions without excessive neutron capture",
             "Deuterium has a very low neutron capture cross-section compared to protium. Collisions with D nuclei efficiently thermalize fast neutrons, allowing natural uranium to be used as nuclear fuel")
        ],
        "B"
    ))

    # 050 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_050", t, "intermediate",
        "Match the physical constants of H2O vs D2O in List I with their relative comparative values in List II:",
        [
            ("Molecular mass and Freezing point", "IV",
             "D2O has higher molecular mass (20.027 g/mol) and higher freezing point (3.82 °C / 276.8 K) than H2O (0.0 °C)",
             "The presence of deuterium increases molecular weight from 18.015 to 20.027 g/mol. Stronger D-bonds stabilize the crystal lattice, elevating the melting point to 3.82 °C"),
            ("Boiling point and Heat of vaporization", "II",
             "D2O has higher boiling point (101.42 °C / 374.4 K) and higher ΔH_vap (41.61 kJ/mol vs 40.66 kJ/mol)",
             "Stronger intermolecular deuterium bonds require more thermal energy to break during vaporization, giving D2O a boiling point of 101.42 °C and higher enthalpy of vaporization"),
            ("Dynamic viscosity at 298 K", "I",
             "D2O has significantly higher viscosity (1.107 cP vs 0.890 cP for H2O)",
             "The greater mass of deuterium and stronger hydrogen bonding network create greater internal frictional resistance to shear flow, increasing the viscosity of D2O by ~24% over H2O"),
            ("Standard enthalpy of formation (Δ_f H°)", "III",
             "D2O(l) is more exothermic (-294.6 kJ/mol vs -285.8 kJ/mol for H2O(l)) reflecting stronger O-D bonds",
             "Because of lower zero-point vibrational energy, the covalent O-D bond is stronger and has a higher dissociation energy than the O-H bond, making formation of D2O more exothermic")
        ],
        "A"
    ))

    # 051 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_051", t, "intermediate",
        "Match the quantitative concentration expressions of H2O2 in List I with their calculated values in List II:",
        [
            ("Molarity of '20 Volume' H2O2 solution", "II",
             "Molarity = 20 / 11.2 ≈ 1.785 M (or 20 / 11.35 ≈ 1.76 M under IUPAC STP)",
             "From 2H2O2 -> 2H2O + O2, 1 mole of H2O2 produces 11.2 L of O2 at STP. Thus, Molarity = Volume strength / 11.2 = 20 / 11.2 = 1.785 M"),
            ("Percentage strength (% w/v) of '20 Volume' H2O2", "IV",
             "Percentage strength = 1.785 M × 34 g/mol / 10 ≈ 6.07% (w/v)",
             "A 1.785 M solution contains 1.785 × 34 = 60.7 g of H2O2 in 1000 mL, which equals 6.07 g per 100 mL, or 6.07% (w/v)"),
            ("Molarity of '100 Volume' Perhydrol solution", "I",
             "Molarity = 100 / 11.2 ≈ 8.93 M, representing ~30% (w/w) commercial concentrated H2O2",
             "Commercial 'Perhydrol' is a ~30% by weight aqueous solution. 1 liter generates 100 liters of O2 gas at STP, giving M = 100 / 11.2 ≈ 8.93 M"),
            ("Normality of '28 Volume' H2O2 solution", "III",
             "Normality = Volume strength / 5.6 = 28 / 5.6 = 5.0 N",
             "Since 1 mole of H2O2 provides 2 equivalents (n-factor = 2 for redox), Normality = 2 × Molarity = 2 × (Volume strength / 11.2) = Volume strength / 5.6. For 28 V: 28 / 5.6 = 5.0 N")
        ],
        "C"
    ))

    # 052 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_052", t, "intermediate",
        "Match the analytical tests for detecting hydrogen peroxide in List I with their observable chemical transformations in List II:",
        [
            ("Acidified potassium dichromate in ether test", "III",
             "Forms deep blue perchromic acid (CrO5) which extracts and stabilizes in the ether layer",
             "K2Cr2O7 + H2SO4 + 4H2O2 -> 2CrO5 + K2SO4 + 5H2O. Chromium peroxide (CrO5) has a butterfly structure with two peroxo groups. It rapidly decomposes in water but forms a stable deep-blue etherate complex"),
            ("Acidified titanium sulfate test", "I",
             "Forms an intense orange-red / yellow coloration of pertitanic acid ([TiO(O2)(H2O)_n]^2+)",
             "Reaction of Ti(SO4)2 with H2O2 in dilute H2SO4 produces pertitanic acid [TiO(O2)]SO4, giving a sensitive, distinct orange-yellow color used for spectrophotometric estimation"),
            ("Starch-iodide paper test", "IV",
             "Oxidizes iodide (I^-) to iodine (I2) in acidic medium, producing an intense blue starch-polyiodide complex",
             "H2O2 + 2I^- + 2H+ -> I2 + 2H2O. The liberated elemental iodine inserts into the helical amylose framework of starch, producing an intense dark blue color"),
            ("Lead sulfide test (restoration of oil paintings)", "II",
             "Oxidizes black lead sulfide (PbS) to white lead sulfate (PbSO4)",
             "PbS(s) [black] + 4H2O2 -> PbSO4(s) [white] + 4H2O. This reaction is utilized in art conservation to restore antique oil paintings darkened by airborne H2S")
        ],
        "D"
    ))

    # =========================================================================
    # ADVANCED (8 questions: 053 - 060)
    # =========================================================================

    # 053 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_053", t, "advanced",
        "Match the quantum states and thermodynamic equilibria of ortho- and para-hydrogen in List I with their physical properties in List II:",
        [
            ("Ortho-hydrogen spin state", "III",
             "Symmetric nuclear spin wave function, nuclear spin triplet (I = 1, degeneracy 3), odd rotational states (J = 1, 3, 5...)",
             "Proton spins are parallel (↑↑). The total nuclear spin I = 1 gives spin multiplicity 2I+1 = 3. Pauli exclusion principle requires the total molecular wave function to be antisymmetric, coupling it with odd rotational quantum numbers (J=1,3...)"),
            ("Para-hydrogen spin state", "I",
             "Antisymmetric nuclear spin wave function, nuclear spin singlet (I = 0, degeneracy 1), even rotational states (J = 0, 2, 4...)",
             "Proton spins are antiparallel (↑↓ - ↓↑). The total nuclear spin I = 0 has spin multiplicity 1. Antisymmetric spin wave function couples with symmetric even rotational states (J=0,2...), with J=0 as the ground state"),
            ("Equilibrium composition at room temperature (298 K)", "IV",
             "75% ortho-hydrogen and 25% para-hydrogen (3:1 ratio determined by nuclear spin degeneracies)",
             "At ambient temperature, thermal energy kT is much larger than the rotational energy gap between J=0 and J=1. The equilibrium ratio is governed strictly by the 3:1 nuclear spin statistical weight"),
            ("Equilibrium composition at near absolute zero (0 K)", "II",
             "100% para-hydrogen because the J = 0 rotational level is the lowest accessible quantum state",
             "At 0 K, all molecules relax to the rotational ground state (J = 0), which can only be occupied by para-hydrogen. Ortho-to-para conversion is exothermic (ΔH = -1.06 kJ/mol) and catalyzed by paramagnets (e.g., Fe2O3, charcoal)")
        ],
        "B"
    ))

    # 054 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_054", t, "advanced",
        "Match the structural and thermodynamic anomalies of water and ice in List I with their molecular explanations in List II:",
        [
            ("Hexagonal ice (Ice-Ih) crystal lattice", "IV",
             "Open cage-like tetrahedral network where each oxygen is bonded to 4 others with O···O distance 276 pm",
             "In Ice-Ih, each oxygen is sp3 hybridized and surrounded tetrahedrally by four other oxygens via hydrogen bonds, enclosing wide hexagonal open channels that give ice its low density (0.917 g/cm^3)"),
            ("Density maximum of liquid water at 3.98 °C", "II",
             "Breakdown of open ice cage upon melting increases packing density, competing with thermal expansion",
             "Between 0 °C and 3.98 °C, melting collapses the open ice lattice into more closely packed clusters of water molecules, increasing density. Above 3.98 °C, ordinary thermal kinetic expansion dominates"),
            ("Methane clathrate hydrate (CH4·5.75H2O)", "I",
             "Non-stoichiometric host-guest inclusion compound where methane gas is trapped inside hydrogen-bonded polyhedral water cages",
             "Under high pressure and low temperature on oceanic continental shelves, water forms dodecahedral and tetrakaidecahedral hydrogen-bonded polyhedral cages encaging guest methane molecules without chemical bonds"),
            ("Supercritical water (>374 °C, >218 atm)", "III",
             "Drastic reduction in dielectric constant (~2-6) making it miscible with non-polar hydrocarbons and gases",
             "Above the critical point, hydrogen bonding networks largely collapse. The dielectric constant plummets from 78 to ~2-6, transforming water into an aggressive non-polar solvent capable of dissolving oils and organic pollutants")
        ],
        "A"
    ))

    # 055 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_055", t, "advanced",
        "Match the deuteration and isotopic exchange reactions in List I with their mechanistic outcomes in List II:",
        [
            ("Ammonium chloride in heavy water: NH4Cl + D2O", "II",
             "Rapid complete isotopic exchange yielding ND4Cl and HOD due to labile protons on ammonium nitrogen",
             "All four N-H protons are acidic and exchange rapidly with solvent deuterons via proton-transfer equilibria: NH4Cl + 4D2O ⇌ ND4Cl + 4HOD"),
            ("Acetic acid in heavy water: CH3COOH + D2O", "IV",
             "Selective exchange of the acidic carboxylic proton to yield CH3COOD, while methyl C-H bonds remain unchanged",
             "Only the polar, highly acidic carboxylic proton undergoes facile exchange with D2O: CH3COOH + D2O ⇌ CH3COOD + HOD. The C-H bonds of the methyl group are non-acidic and kinetically inert"),
            ("Hydrolysis of phosphorus trichloride: PCl3 + 3D2O", "I",
             "PCl3 + 3D2O -> D3PO3 + 3DCl (forming deuterated phosphorous acid with one non-exchangeable P-D bond)",
             "PCl3 hydrolyzes to deuterated phosphorous acid D3PO3 (specifically DPO(OD)2). The two P-OD protons are readily exchangeable, while the P-D proton directly bonded to phosphorus does not rapidly exchange in neutral water"),
            ("Hydrolysis of calcium phosphide: Ca3P2 + 6D2O", "III",
             "Ca3P2 + 6D2O -> 3Ca(OD)2 + 2PD3 (produces completely deuterated phosphine gas)",
             "The phosphide ion P^3- acts as a powerful Bronsted base, abstracting deuterons quantitatively to release toxic deuterated phosphine gas (PD3) and precipitate calcium deuteroxide")
        ],
        "C"
    ))

    # 056 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_056", t, "advanced",
        "Match the mechanistic factors in hydrogen peroxide decomposition in List I with their kinetic features in List II:",
        [
            ("Homogeneous catalysis by iodide (I^-) ions", "III",
             "Two-step catalytic mechanism via hypoiodite intermediate: H2O2 + I^- -> IO^- + H2O (slow), then H2O2 + IO^- -> H2O + O2 + I^- (fast)",
             "The reaction is first-order in [H2O2] and first-order in [I^-]. The hypoiodite ion (IO^-) acts as a transient intermediate that rapidly reacts with a second H2O2 molecule to regenerate I^-"),
            ("Heterogeneous surface catalysis by solid MnO2", "I",
             "Rapid surface electron-transfer cycle lowering the decomposition activation energy from 75 kJ/mol to ~50 kJ/mol",
             "Finely divided MnO2 provides surface active sites where chemisorbed H2O2 undergoes fast catalytic decomposition to water and oxygen, exhibiting zero-order kinetics at high surface saturation"),
            ("Stabilization by urea or sodium pyrophosphate", "IV",
             "Negative catalysts and chelating agents that sequester catalytic trace heavy metal ions (e.g., Fe^3+, Cu^2+)",
             "Decomposition is catalyzed by trace heavy metal impurities leached from glass. Adding urea, acetanilide, or pyrophosphate chelates these ions, suppressing radical chain decomposition"),
            ("Photochemical decomposition pathway", "II",
             "2H2O2 -> 2H2O + O2 initiated by homolytic O-O bond cleavage by UV photons to generate hydroxyl radicals (·OH)",
             "Absorption of light (λ < 380 nm) cleaves the weak peroxo O-O bond (dissociation energy ~210 kJ/mol) into ·OH radicals, propagating explosive radical decomposition chains; hence H2O2 is stored in dark wax-lined bottles")
        ],
        "D"
    ))

    # 057 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_057", t, "advanced",
        "Match the thermodynamic and kinetic parameters of syngas reactions in List I with their industrial operating conditions in List II:",
        [
            ("Steam reforming of methane: CH4 + H2O ⇌ CO + 3H2", "III",
             "Highly endothermic (ΔH° = +206 kJ/mol); favored at high temperatures (1000-1100 K), moderate pressure, over Ni-Al2O3 catalyst",
             "Because Δn_gas > 0 and ΔH° > 0, Le Chatelier's principle dictates high temperatures to maximize conversion. The reaction is carried out in reformer furnaces over nickel supported on alumina"),
            ("Water gas shift reaction: CO + H2O ⇌ CO2 + H2", "I",
             "Moderately exothermic (ΔH° = -41 kJ/mol); favored at lower temperatures, operated in two stages (Fe-Cr at 673 K and Cu-Zn at 493 K)",
             "Because ΔH° < 0, equilibrium conversion decreases at higher temperatures. Industry uses a High-Temperature Shift (HTS) reactor over Fe2O3-Cr2O3 followed by a Low-Temperature Shift (LTS) reactor over CuO-ZnO-Al2O3"),
            ("Coal gasification: C(s) + H2O(g) ⇌ CO(g) + H2(g)", "IV",
             "Strongly endothermic (ΔH° = +131 kJ/mol); requires high temperatures (~1270 K) to produce synthesis gas",
             "Reaction of incandescent carbon with steam produces syngas. Because ΔH° is strongly positive, immense thermal energy must be continuously supplied to maintain gasifier temperatures"),
            ("Methanation cleanup: CO + 3H2 ⇌ CH4 + H2O", "II",
             "Highly exothermic (ΔH° = -206 kJ/mol); used to remove trace carbon monoxide down to <10 ppm to protect fuel cell catalysts",
             "PEM fuel cells are poisoned by trace CO. Methanation over ruthenium or nickel catalysts selectively converts residual CO into non-toxic CH4 at 473-573 K")
        ],
        "B"
    ))

    # 058 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_058", t, "advanced",
        "Match the water samples in List I with their calculated total hardness in ppm CaCO3 equivalent in List II:",
        [
            ("Sample containing 12.0 mg of MgSO4 per liter", "IV",
             "10.0 ppm CaCO3 equivalent [12.0 mg/L × (100 g/mol / 120 g/mol) = 10.0 mg/L]",
             "Equivalence factor of MgSO4 = Molar mass of CaCO3 / Molar mass of MgSO4 = 100 / 120. Hardness = 12.0 × (100 / 120) = 10.0 ppm CaCO3"),
            ("Sample containing 16.2 mg of Ca(HCO3)2 per liter", "II",
             "10.0 ppm CaCO3 equivalent [16.2 mg/L × (100 g/mol / 162 g/mol) = 10.0 mg/L]",
             "Equivalence factor of Ca(HCO3)2 = 100 / 162. Hardness = 16.2 × (100 / 162) = 10.0 ppm CaCO3"),
            ("Sample containing 11.1 mg of CaCl2 per liter", "I",
             "10.0 ppm CaCO3 equivalent [11.1 mg/L × (100 g/mol / 111 g/mol) = 10.0 mg/L]",
             "Equivalence factor of CaCl2 = 100 / 111. Hardness = 11.1 × (100 / 111) = 10.0 ppm CaCO3"),
            ("Sample containing 9.5 mg of MgCl2 per liter", "III",
             "10.0 ppm CaCO3 equivalent [9.5 mg/L × (100 g/mol / 95 g/mol) = 10.0 mg/L]",
             "Equivalence factor of MgCl2 = 100 / 95. Hardness = 9.5 × (100 / 95) = 10.0 ppm CaCO3")
        ],
        "A"
    ))

    # 059 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_059", t, "advanced",
        "Match the electrochemical steps in the historical persulfate route to H2O2 in List I with their reaction mechanisms in List II:",
        [
            ("Anodic oxidation of 50% H2SO4 at high current density", "II",
             "2HSO4^- -> H2S2O8 + 2e^- (peroxydisulfuric acid formed at cooled platinum anode)",
             "Using a high current density (>1 A/cm^2) on platinum wire anodes, bisulfate ions are oxidized to peroxydisulfuric acid (Marshall's acid, H2S2O8) with high overpotential preventing O2 evolution"),
            ("Cathodic reduction in the electrolytic cell", "IV",
             "2H+ + 2e^- -> H2(g) (dihydrogen gas evolved at lead/graphite cathode)",
             "At the cathode, hydrogen ions are reduced to gaseous dihydrogen, which is vented safely to prevent explosive contact with atmospheric oxygen"),
            ("Hydrolysis of peroxydisulfuric acid under reduced pressure", "I",
             "H2S2O8 + 2H2O -> 2H2SO4 + H2O2 (proceeds via Caro's acid H2SO5 intermediate)",
             "Hydrolysis occurs in two consecutive steps: H2S2O8 + H2O -> H2SO5 + H2SO4, followed by H2SO5 + H2O -> H2SO4 + H2O2. Rapid vacuum distillation yields aqueous H2O2"),
            ("Ammonium peroxydisulfate ((NH4)2S2O8) modification", "III",
             "Electrolysis of acidified (NH4)2SO4 yields (NH4)2S2O8, which is hydrolyzed and distilled to yield H2O2",
             "Weckerle process: acidic ammonium sulfate solution is electrolyzed to yield more soluble ammonium persulfate, minimizing side reactions and delivering higher current efficiency (~85%)")
        ],
        "C"
    ))

    # 060 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_060", t, "advanced",
        "Match the isotopic physical and quantum parameters of H2 vs D2 in List I with their theoretical explanations in List II:",
        [
            ("Bond dissociation enthalpy of H2 (435.9 kJ/mol) vs D2 (443.5 kJ/mol)", "III",
             "D2 has higher bond dissociation energy because its lower zero-point vibrational energy sits deeper in the potential well",
             "Both isotopologues share the identical electronic Born-Oppenheimer potential energy curve. However, because deuterium has twice the mass, its zero-point energy is lower (18.5 kJ/mol vs 25.9 kJ/mol for H2), requiring more energy to dissociate"),
            ("First ionization enthalpy of H (1312.0 kJ/mol) vs D (1314.5 kJ/mol)", "I",
             "Deuterium has slightly higher IE because greater nuclear mass increases the reduced mass (μ) of the electron-nucleus system",
             "The Rydberg constant R = R_∞ / (1 + m_e / M_nucleus). Because M_deuteron ≈ 2 M_proton, the reduced mass μ is slightly larger in deuterium, pulling the electron closer and increasing ionization energy by 2.5 kJ/mol"),
            ("Zero-point vibrational energy (ZPVE)", "IV",
             "H2 has higher ZPVE (25.9 kJ/mol) than D2 (18.5 kJ/mol) because vibrational frequency ν = (1/2π)√(k/μ) scales inversely with √μ",
             "Since the chemical force constant k is identical for H2 and D2, the vibrational frequency of H-H is √2 times higher than D-D, giving H2 a significantly higher ground-state vibrational zero-point energy (1/2 hν)"),
            ("Born-Oppenheimer potential energy surface", "II",
             "Completely identical potential energy curves for H2 and D2 since electronic Hamiltonian depends only on nuclear charge Z = 1",
             "Under the Born-Oppenheimer approximation, electrons move in the electrostatic field of stationary nuclei. Since H and D have identical nuclear charge (+1), their electronic potential wells are completely identical")
        ],
        "D"
    ))

    return qs

get_questions = get_hydrogen_questions
