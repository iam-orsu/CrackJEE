from builder import make_matrix_q

def get_periodic_questions():
    qs = []
    t = "Periodic Table and Periodicity"
    prefix = "chem_ioc1"

    # =========================================================================
    # BEGINNER (4 questions: 001 - 004)
    # =========================================================================

    # 001 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_001", t, "beginner",
        "Match the historical milestones in the classification of elements in List I with their defining principles or observations in List II:",
        [
            ("Dobereiner's Law of Triads", "III",
             "Atomic weight of the central element was approximately the arithmetic mean of the weights of the other two elements",
             "Johann Dobereiner noted that in sets of three chemically similar elements (such as Li, Na, K or Cl, Br, I), the atomic weight of the middle element is approximately the arithmetic mean of the other two"),
            ("Newlands' Law of Octaves", "I",
             "Every eighth element possessed properties similar to the first, analogous to musical intervals",
             "John Newlands arranged elements in increasing order of atomic weight and observed that every eighth element exhibited recurring chemical and physical properties, like notes in an octave"),
            ("Mendeleev's Periodic Law", "IV",
             "The physical and chemical properties of elements are periodic functions of their atomic weights",
             "Dmitri Mendeleev formulated that properties of elements are periodic functions of their atomic masses, leaving gaps for undiscovered elements like eka-aluminium (gallium) and eka-silicon (germanium)"),
            ("Moseley's Modern Periodic Law", "II",
             "The square root of characteristic X-ray frequencies (√ν) is linearly related to the atomic number (Z)",
             "Henry Moseley examined characteristic X-ray spectra of metals and proved that √ν = a(Z - b), establishing atomic number Z, rather than atomic weight, as the fundamental property governing periodicity")
        ],
        "B"
    ))

    # 002 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_002", t, "beginner",
        "Match the elements in List I with their characteristic valence ground-state electronic configurations in List II:",
        [
            ("Potassium (K, Z = 19)", "IV",
             "[Ar] 4s^1",
             "Potassium has atomic number 19; its ground-state electronic configuration is 1s^2 2s^2 2p^6 3s^2 3p^6 4s^1, or [Ar] 4s^1"),
            ("Bromine (Br, Z = 35)", "II",
             "[Ar] 3d^10 4s^2 4p^5",
             "Bromine has atomic number 35; its complete electronic configuration is [Ar] 3d^10 4s^2 4p^5, belonging to group 17 (halogens)"),
            ("Krypton (Kr, Z = 36)", "I",
             "[Ar] 3d^10 4s^2 4p^6",
             "Krypton has atomic number 36; it has a closed-shell stable noble gas octet valence configuration [Ar] 3d^10 4s^2 4p^6"),
            ("Calcium (Ca, Z = 20)", "III",
             "[Ar] 4s^2",
             "Calcium has atomic number 20; it has two valence electrons in the 4s subshell with configuration [Ar] 4s^2")
        ],
        "A"
    ))

    # 003 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_003", t, "beginner",
        "Match the periodic properties across the third period (Na to Cl) in List I with their standard trends in List II:",
        [
            ("Atomic radius", "II",
             "Decreases across the period due to increasing effective nuclear charge (Z_eff)",
             "As nuclear charge increases by +1 with each successive element while electrons enter the same principal energy shell (n=3), screening is imperfect and Z_eff increases, causing contraction of atomic radius from Na to Cl"),
            ("First ionization enthalpy", "IV",
             "Overall increases across the period with dips at Mg→Al and P→S due to subshell stability",
             "First ionization enthalpy increases overall due to greater Z_eff and smaller size, but exhibits local drops at Al (removing a 3p^1 electron from outside 3s^2) and S (paired electron repulsion in 3p^4 compared to half-filled 3p^3 of P)"),
            ("Pauling electronegativity", "I",
             "Increases monotonically from Na (0.93) to Cl (3.16)",
             "Electronegativity measures the ability of an atom in a molecule to attract shared electron pairs; it increases steadily across Period 3 as atomic size decreases and effective nuclear charge increases"),
            ("Metallic character", "III",
             "Decreases from strongly electropositive metal (Na) to reactive non-metal (Cl)",
             "Electropositive metallic character declines across the period as ionization energy increases, shifting from alkali/alkaline earth metals (Na, Mg) through metalloid (Si) to non-metals (P, S, Cl)")
        ],
        "C"
    ))

    # 004 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_004", t, "beginner",
        "Match the isoelectronic species (each having 10 electrons) in List I with their relative ionic radii and nuclear charges in List II:",
        [
            ("N^3- (Z = 7)", "III",
             "Largest ionic radius (~171 pm) due to lowest nuclear charge (Z = 7) for 10 electrons",
             "In isoelectronic series, ionic radius decreases as nuclear charge Z increases. N^3- has only 7 protons holding 10 electrons (Z/e = 0.70), resulting in the lowest effective nuclear charge and the largest ionic radius"),
            ("O^2- (Z = 8)", "I",
             "Intermediate radius (~140 pm) with Z/e ratio of 0.80",
             "O^2- has 8 protons holding 10 electrons (Z/e = 0.80), yielding an ionic radius smaller than N^3- but larger than F^- and Na+"),
            ("F^- (Z = 9)", "IV",
             "Moderate radius (~133 pm) with Z/e ratio of 0.90",
             "F^- has 9 protons holding 10 electrons (Z/e = 0.90), giving greater nuclear pull on the electron cloud than in O^2-"),
            ("Na+ (Z = 11)", "II",
             "Smallest ionic radius (~102 pm) due to highest nuclear charge (Z = 11) for 10 electrons",
             "Na+ has 11 protons attracting 10 electrons (Z/e = 1.10); the high effective nuclear charge strongly pulls the electron cloud inward, making it the smallest among these species")
        ],
        "D"
    ))

    # =========================================================================
    # INTERMEDIATE (8 questions: 005 - 012)
    # =========================================================================

    # 005 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_005", t, "intermediate",
        "Match the pairs of second-period elements in List I with the rationale behind their first ionization enthalpy differences in List II:",
        [
            ("Be (899 kJ/mol) vs B (801 kJ/mol)", "III",
             "Removal of a 2s electron from a fully-filled subshell vs a 2p electron that is more shielded and of higher energy",
             "Beryllium has configuration 1s^2 2s^2; removing an electron requires breaking a stable, penetrating, fully filled 2s subshell. Boron (1s^2 2s^2 2p^1) loses its 2p^1 electron, which is shielded by the 2s electrons and has higher energy, making IE1(Be) > IE1(B)"),
            ("N (1402 kJ/mol) vs O (1314 kJ/mol)", "I",
             "Half-filled 2p^3 subshell stability in N vs inter-electronic repulsion in the doubly occupied 2p_x orbital of O (2p^4)",
             "Nitrogen possesses an extra stable half-filled 2p^3 subshell with high exchange energy. Oxygen (2p^4) has two electrons paired in one 2p orbital, where mutual electron-electron repulsion facilitates ionization, making IE1(N) > IE1(O)"),
            ("Li (520 kJ/mol) vs Be (899 kJ/mol)", "IV",
             "Increase in effective nuclear charge from Z = 3 to Z = 4 within the same principal quantum shell",
             "From Li to Be, the nuclear charge increases by 1 while electrons enter the same 2s orbital, increasing Z_eff and contracting atomic size, leading to a substantial increase in ionization enthalpy"),
            ("C (1086 kJ/mol) vs N (1402 kJ/mol)", "II",
             "Higher effective nuclear charge and transition from partially filled 2p^2 to half-filled 2p^3 configuration",
             "Ionization energy rises from C (2p^2) to N (2p^3) because nuclear charge increases from Z = 6 to 7 and nitrogen attains a stable half-filled subshell")
        ],
        "B"
    ))

    # 006 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_006", t, "intermediate",
        "Match the elements in List I with the characteristics of their electron gain enthalpies (Δ_eg H) in List II:",
        [
            ("Chlorine (Cl)", "IV",
             "Most negative Δ_eg H (-349 kJ/mol) due to lower electron-electron repulsion in the larger 3p subshell",
             "Chlorine has a more exothermic electron gain enthalpy than fluorine because its 3p subshell is more spacious than the compact 2p subshell of fluorine, minimizing electron-electron repulsion upon addition of an electron"),
            ("Fluorine (F)", "II",
             "Less negative Δ_eg H (-328 kJ/mol) than chlorine due to high interelectronic repulsion in the compact 2p subshell",
             "Although fluorine has higher electronegativity and smaller atomic radius, the incoming electron experiences intense interelectronic repulsion in the very small 2p orbital, lowering the net exothermicity compared to chlorine"),
            ("Nitrogen (N)", "I",
             "Positive or almost zero Δ_eg H (+31 kJ/mol) due to the extra stability of its half-filled 2p^3 subshell",
             "Nitrogen has a stable half-filled 2p^3 configuration. Adding an extra electron requires putting it into a singly occupied 2p orbital against pairing repulsion, making the process endothermic"),
            ("Neon (Ne)", "III",
             "Large positive Δ_eg H (+116 kJ/mol) because the incoming electron must enter the higher-energy 3s subshell",
             "Noble gases possess completely filled valence octets (2s^2 2p^6). An incoming electron must enter the next quantum shell (3s), requiring substantial energy input")
        ],
        "A"
    ))

    # 007 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_007", t, "intermediate",
        "Match the electronegativity scales and concepts in List I with their mathematical formulations or definitions in List II:",
        [
            ("Pauling scale", "II",
             "|χ_A - χ_B| = 0.208 × √(Δ), where Δ = E_d(A-B) - √[E_d(A-A) × E_d(B-B)] in kcal/mol",
             "Linus Pauling based his electronegativity scale on resonance extra-energy of heteronuclear bonds: Δ is the excess bond energy over the geometric mean of pure covalent homonuclear bond energies"),
            ("Mulliken scale", "IV",
             "χ_M = (IE + EA) / 2, representing the average of ionization energy and electron affinity",
             "Robert Mulliken defined electronegativity as the arithmetic mean of the first ionization energy (IE) and the electron affinity (EA) of an atom, measuring its tendency to hold onto and attract electrons"),
            ("Allred-Rochow scale", "I",
             "χ_AR = 0.359 × (Z_eff / r^2) + 0.744, where r is the covalent radius in Å",
             "Allred and Rochow defined electronegativity based on electrostatic force exerted by the effective nuclear charge Z_eff on the valence electrons at distance r"),
            ("Slater's shielding constant (σ)", "III",
             "Z_eff = Z - σ, where σ quantifies the screening of valence electrons by inner shells",
             "J.C. Slater formulated empirical rules to calculate the shielding constant σ, where each electron in inner and valence shells contributes specific screening values to determine the net effective nuclear charge Z_eff")
        ],
        "C"
    ))

    # 008 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_008", t, "intermediate",
        "Match the elements in List I with their second ionization enthalpy (IE_2) values and electronic explanations in List II:",
        [
            ("Sodium (Na, Z = 11)", "III",
             "Extremely high IE_2 (4562 kJ/mol) due to removal of an electron from the stable noble gas core [Ne] 2p^6",
             "After losing its 3s^1 electron, Na+ attains the stable neon octet [Ne] 2s^2 2p^6. Removing a second electron requires disrupting this noble gas core and pulling an electron from n=2, causing a huge surge in IE_2"),
            ("Magnesium (Mg, Z = 12)", "I",
             "Relatively moderate IE_2 (1451 kJ/mol) because losing the 3s^1 electron yields a stable octet [Ne]",
             "Mg+ has the electronic configuration [Ne] 3s^1. Removing this second electron yields the stable closed-shell noble gas configuration of Mg^2+ ([Ne]), so IE_2 is modest compared to alkali metals"),
            ("Copper (Cu, Z = 29)", "IV",
             "High IE_2 (1958 kJ/mol) because the second electron is removed from the completely filled 3d^10 subshell",
             "Cu+ has configuration [Ar] 3d^10. Removing the second electron requires breaking the fully filled 3d^10 subshell, which has high exchange energy and stability, making IE_2 higher than that of Zn"),
            ("Zinc (Zn, Z = 30)", "II",
             "Moderate IE_2 (1733 kJ/mol) because the second electron is removed from the 4s^1 subshell of Zn+",
             "Zn+ has configuration [Ar] 3d^10 4s^1. The second electron is lost from the 4s subshell, which leaves a stable pseudo-noble gas core [Ar] 3d^10, making its IE_2 lower than that of Cu")
        ],
        "D"
    ))

    # 009 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_009", t, "intermediate",
        "Match the diagonal relationship pairs in List I with their shared chemical or structural similarities in List II:",
        [
            ("Lithium (Li) and Magnesium (Mg)", "III",
             "Both form normal monoxides (Li2O, MgO) and nitrides (Li3N, Mg3N2) upon heating directly in nitrogen",
             "Li and Mg have similar charge-to-radius ratios (ionic potential). Both react directly with atmospheric N2 to form stable ionic nitrides, and both burn in oxygen to form monoxides rather than peroxides or superoxides"),
            ("Beryllium (Be) and Aluminium (Al)", "I",
             "Both form amphoteric oxides and hydroxides, and covalent polymeric/dimeric halides with bridging chlorides",
             "Be and Al have close electronegativities (1.5) and high polarizing power. Both oxides (BeO, Al2O3) are amphoteric, and their anhydrous halides (BeCl2, AlCl3) are covalent Lewis acids with chlorido bridges"),
            ("Boron (B) and Silicon (Si)", "IV",
             "Both form polymeric acidic oxides, flammable volatile hydrides, and behave as semiconductors",
             "B and Si exhibit diagonal similarity: both are non-metals with high melting points, form acidic network oxides (B2O3, SiO2), form flammable silanes and boranes, and form hydrolyzable covalent halides"),
            ("Carbon (C) and Phosphorus (P)", "II",
             "Both form multiple covalent allotropes and exhibit comparable Pauling electronegativities (~2.55 vs ~2.19)",
             "While diagonal relationships are prominent in Periods 2 and 3 for Li-Mg, Be-Al, and B-Si, C and P both exhibit rich allotropy (diamond/graphite/fullerene vs white/red/black P) and form covalent oxyacids")
        ],
        "B"
    ))

    # 010 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_010", t, "intermediate",
        "Match the third-period oxides in List I with their acid-base character and aqueous behavior in List II:",
        [
            ("Na2O", "IV",
             "Strongly basic oxide that dissolves exothermically in water to produce a strong alkali (NaOH)",
             "Na2O contains the strongly basic O^2- ion in an ionic lattice; it hydrolyzes completely in water via Na2O + H2O -> 2NaOH, yielding a strongly alkaline solution"),
            ("Al2O3", "II",
             "Amphoteric oxide that reacts with both mineral acids and strong aqueous bases",
             "Al2O3 reacts with acids to form hexaaqua aluminium ions [Al(H2O)6]^3+ and with bases to form aluminate ions [Al(OH)4]^-, demonstrating classic amphoteric behavior"),
            ("SiO2", "I",
             "Weakly acidic giant covalent network oxide that dissolves only in hot concentrated alkalis or HF",
             "SiO2 has a three-dimensional covalent lattice with high bond enthalpy; it does not dissolve in water but slowly reacts with hot concentrated NaOH to form sodium silicate (Na2SiO3)"),
            ("Cl2O7", "III",
             "Strongly acidic molecular oxide that dissolves in water to form perchloric acid (HClO4)",
             "Cl2O7 is the anhydride of perchloric acid (oxidation state +7 on Cl). It dissolves in water violently to yield the very strong acid HClO4: Cl2O7 + H2O -> 2HClO4")
        ],
        "A"
    ))

    # 011 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_011", t, "intermediate",
        "Match the consequences of lanthanoid contraction in List I with the chemical observations in List II:",
        [
            ("Zirconium (Zr) and Hafnium (Hf) atomic radii", "II",
             "Nearly identical covalent radii (Zr: 160 pm, Hf: 159 pm) leading to extremely similar chemical properties",
             "Due to the poor shielding of the 14 intervening 4f electrons in the lanthanoid series, Hf experiences an increased effective nuclear charge, canceling the expected size increase from 4d to 5d"),
            ("Ionization energies of 5d series vs 4d series", "IV",
             "Higher first ionization enthalpies in 5d elements than in 4d congeners (e.g., IE1 of Au > Ag)",
             "Lanthanoid contraction results in smaller atomic radii and higher Z_eff in the 5d transition series, causing valence electrons to be held more tightly and raising IE1 above the 4d series"),
            ("Basicity of lanthanoid hydroxides Ln(OH)3", "I",
             "Decreases steadily from La(OH)3 (most basic) to Lu(OH)3 (least basic)",
             "As the ionic radius of Ln^3+ contracts from La^3+ (103 pm) to Lu^3+ (86 pm), the covalent character of the Ln-OH bond increases according to Fajan's rules, reducing hydroxide dissociation"),
            ("Densities of 5d transition metals", "III",
             "Roughly double the densities of corresponding 4d transition metals",
             "Because atomic radii remain almost unchanged while atomic mass nearly doubles from 4d to 5d (due to lanthanoid contraction), the packing density of 5d metals increases drastically (e.g., Os and Ir ~22.6 g/cm^3)")
        ],
        "C"
    ))

    # 012 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_012", t, "intermediate",
        "Match the heavy p-block elements in List I with their oxidation state stabilities governed by the inert pair effect in List II:",
        [
            ("Thallium (Tl, Z = 81)", "III",
             "+1 oxidation state is much more stable than +3; Tl^3+ acts as a strong oxidizing agent",
             "In Group 13, the 6s^2 electron pair experiences poor shielding from 4f^14 and 5d^10 subshells, resisting unpairing. Thus, Tl+ is thermodynamically stable, while Tl^3+ readily reduces to Tl+"),
            ("Lead (Pb, Z = 82)", "I",
             "+2 oxidation state is more stable than +4; PbO2 is a powerful oxidizing agent",
             "In Group 14, inert pair effect makes Pb(II) compounds stable, whereas Pb(IV) compounds (such as PbO2) are strong oxidizing agents that reduce to Pb^2+ with release of oxygen or halogen"),
            ("Bismuth (Bi, Z = 83)", "IV",
             "+3 oxidation state is far more stable than +5; NaBiO3 acts as a potent oxidizing agent",
             "In Group 15, the reluctance of 6s^2 electrons to participate in bonding makes Bi(III) the stable state. Bi(V) compounds like sodium bismuthate (NaBiO3) oxidize Mn^2+ to MnO4^-"),
            ("Tin (Sn, Z = 50)", "II",
             "+4 oxidation state is more stable than +2; Sn^2+ acts as a reducing agent",
             "Tin belongs to period 5 where the inert pair effect is weaker than in lead. Consequently, Sn(IV) is more stable than Sn(II), so Sn^2+ salts act as reducing agents (e.g., SnCl2 reduces FeCl3 to FeCl2)")
        ],
        "D"
    ))

    # =========================================================================
    # ADVANCED (8 questions: 013 - 020)
    # =========================================================================

    # 013 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_013", t, "advanced",
        "Match the electronic orbitals in List I with their effective nuclear charges (Z_eff) calculated via Slater's rules in List II:",
        [
            ("4s electron in Zinc (Zn, Z = 30)", "III",
             "Z_eff = 4.35 (σ = 25.65 from 1×0.35 + 18×0.85 + 10×1.0)",
             "For Zn (1s^2 2s^2 2p^6 3s^2 3p^6 3d^10 4s^2): the other 4s electron contributes 0.35; the 18 electrons in n=3 (3s, 3p, 3d) contribute 18 × 0.85 = 15.30; the 10 electrons in n=1,2 contribute 10 × 1.0 = 10.0. Total σ = 0.35 + 15.30 + 10.0 = 25.65. Thus Z_eff = 30 - 25.65 = 4.35"),
            ("3d electron in Zinc (Zn, Z = 30)", "I",
             "Z_eff = 8.85 (σ = 21.15 from 9×0.35 + 18×1.0)",
             "For a 3d electron in Zn: the 4s electrons lie outside and contribute 0; the other nine 3d electrons contribute 9 × 0.35 = 3.15; all 18 inner electrons (1s, 2s, 2p, 3s, 3p) contribute 18 × 1.0 = 18.0. Total σ = 3.15 + 18.0 = 21.15. Thus Z_eff = 30 - 21.15 = 8.85"),
            ("2p electron in Carbon (C, Z = 6)", "IV",
             "Z_eff = 3.25 (σ = 2.75 from 3×0.35 + 2×0.85)",
             "For Carbon (1s^2 2s^2 2p^2): for a 2p electron, the other three electrons in the (2s, 2p) group contribute 3 × 0.35 = 1.05; the two 1s electrons contribute 2 × 0.85 = 1.70. Total σ = 1.05 + 1.70 = 2.75. Thus Z_eff = 6 - 2.75 = 3.25"),
            ("2s electron in Lithium (Li, Z = 3)", "II",
             "Z_eff = 1.30 (σ = 1.70 from 2×0.85)",
             "For Lithium (1s^2 2s^1): there are no other valence electrons in n=2; the two inner 1s electrons contribute 2 × 0.85 = 1.70. Total σ = 1.70. Thus Z_eff = 3 - 1.70 = 1.30")
        ],
        "B"
    ))

    # 014 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_014", t, "advanced",
        "Match the successive ionization enthalpies (in kJ/mol) of elements P, Q, R, S in List I with their periodic group classifications in List II:",
        [
            ("Element P: IE1 = 496, IE2 = 4562, IE3 = 6910", "IV",
             "Group 1 alkali metal (single valence electron, enormous leap from IE1 to IE2)",
             "A gigantic surge of ~4066 kJ/mol between IE1 and IE2 indicates the removal of an electron from a core noble gas configuration after losing 1 valence electron, characteristic of Group 1 (e.g., Sodium)"),
            ("Element Q: IE1 = 738, IE2 = 1451, IE3 = 7733", "II",
             "Group 2 alkaline earth metal (two valence electrons, enormous leap from IE2 to IE3)",
             "The first two ionization energies are relatively low, followed by a dramatic jump of ~6282 kJ/mol at IE3, indicating 2 valence electrons belonging to Group 2 (e.g., Magnesium)"),
            ("Element R: IE1 = 577, IE2 = 1816, IE3 = 2745, IE4 = 11577", "I",
             "Group 13 element (three valence electrons, enormous leap from IE3 to IE4)",
             "IE1, IE2, and IE3 correspond to the loss of 3 valence electrons (ns^2 np^1), followed by an immense jump of ~8832 kJ/mol to IE4, typical of Group 13 (e.g., Aluminium)"),
            ("Element S: IE1 = 1086, IE2 = 2353, IE3 = 4620, IE4 = 6222, IE5 = 37830", "III",
             "Group 14 element (four valence electrons, enormous leap from IE4 to IE5)",
             "There is a progressive increase over the first 4 ionization energies followed by a colossal leap (>31000 kJ/mol) at IE5, proving 4 valence electrons in Group 14 (e.g., Carbon)")
        ],
        "A"
    ))

    # 015 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_015", t, "advanced",
        "Match the alkali metals in List I with the thermodynamic factors governing their standard reduction potentials (E°_M+/M) in List II:",
        [
            ("Lithium (Li)", "II",
             "Most negative E° (-3.04 V) driven by an immense negative hydration enthalpy (-506 kJ/mol) compensating its high IE1",
             "Although Li has the highest sublimation energy and ionization energy among alkali metals, the extremely small radius of Li+ creates an enormous hydration enthalpy (Δ_hyd H = -506 kJ/mol) that drives the net Gibbs free energy ΔG° = Δ_sub H + IE1 + Δ_hyd H highly negative, making E° = -3.04 V"),
            ("Sodium (Na)", "IV",
             "Least negative E° (-2.71 V) among alkali metals due to modest hydration energy not fully offsetting its ionization energy",
             "Sodium has a higher ionization enthalpy and sublimation enthalpy than heavier congeners, but its hydration enthalpy (-406 kJ/mol) is far less negative than lithium's, making its standard reduction potential the least negative in the group"),
            ("Potassium (K)", "I",
             "Intermediate E° (-2.93 V) resulting from a balanced drop in ionization enthalpy and hydration enthalpy",
             "As size increases from Na to K, ionization enthalpy decreases significantly (from 496 to 419 kJ/mol), which outweighs the decline in hydration enthalpy, shifting E° to -2.93 V"),
            ("Cesium (Cs)", "III",
             "Highly negative E° (-2.92 V) primarily dominated by its exceptionally low ionization enthalpy (376 kJ/mol)",
             "In Cesium, the low lattice/sublimation enthalpy and very low ionization enthalpy compensate for its low hydration enthalpy (-264 kJ/mol), giving E° = -2.92 V, almost identical to potassium")
        ],
        "C"
    ))

    # 016 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_016", t, "advanced",
        "Match the 3d/5d transition metals in List I with their enthalpies of atomization and melting point profiles in List II:",
        [
            ("Chromium (Cr, 3d^5 4s^1)", "III",
             "Highest enthalpy of atomization (397 kJ/mol) and melting point (1907 °C) in the 3d series due to maximum unpaired electrons",
             "With 6 unpaired valence electrons (3d^5 4s^1), chromium forms exceptionally strong metal-metal covalent bonds in its metallic lattice, leading to peak melting point and atomization enthalpy in the 3d series"),
            ("Tungsten (W, 5d^4 6s^2)", "I",
             "Highest melting point (3422 °C) and atomization enthalpy (849 kJ/mol) among all elements due to powerful 5d-5d metallic bonding",
             "5d orbitals are more diffuse and extend further into space than 3d orbitals, enabling superior overlap and forming extremely strong covalent-metallic bonding networks in tungsten"),
            ("Zinc (Zn, 3d^10 4s^2)", "IV",
             "Lowest atomization enthalpy (126 kJ/mol) and lowest melting point (420 °C) in 3d series due to completely filled d-subshell",
             "Zinc has a fully filled 3d^10 configuration with all electrons paired; only 4s electrons weakly participate in metallic bonding, resulting in volatile and low-melting characteristics"),
            ("Scandium (Sc, 3d^1 4s^2)", "II",
             "Moderate atomization enthalpy (378 kJ/mol) with only 3 valence electrons participating in metallic bonding",
             "Scandium has only 1 d electron in 3d^1 4s^2, providing fewer unpaired electrons for interatomic bonding compared to mid-series transition metals")
        ],
        "D"
    ))

    # 017 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_017", t, "advanced",
        "Match the periodic series in List I with their underlying thermodynamic and electronic driving forces for acidity/basicity trends in List II:",
        [
            ("Group 16 hydrides (H2O to H2Te) acidity", "III",
             "Increases down the group primarily due to decreasing H-E bond dissociation energy (H2O << H2Te)",
             "From oxygen to tellurium, the central atom size increases, resulting in poorer orbital overlap with hydrogen 1s. The bond dissociation enthalpy drops from 463 kJ/mol (O-H) to 267 kJ/mol (Te-H), dominating over electronegativity and making H2Te the strongest acid"),
            ("Chlorine oxyacids (HOCl to HClO4) acidity", "I",
             "Increases with oxidation state (+1 to +7) due to resonance stabilization and charge delocalization in the conjugate oxyanion",
             "In ClO4^-, the negative charge is delocalized over four equivalent electronegative oxygen atoms via pπ-dπ back-bonding, creating a very stable conjugate base and making perchloric acid (HClO4) the strongest oxyacid"),
            ("Nitrogen oxides (N2O, NO, N2O3, N2O5) acidity", "IV",
             "Increases progressively with nitrogen oxidation state: N2O/NO are neutral, N2O3 is weakly acidic, N2O5 is strongly acidic",
             "As the formal oxidation state of the non-metal increases from +1 (N2O) and +2 (NO) to +3 (N2O3) and +5 (N2O5), the positive charge density on nitrogen polarizes the N-O bonds more strongly, producing more acidic anhydrides"),
            ("Group 15 hydrides (NH3 to BiH3) Lewis basicity", "II",
             "Decreases down the group as the lone pair occupies progressively larger, more diffuse orbitals with lower electron density",
             "In NH3, the lone pair resides in a concentrated sp3 hybrid orbital on small nitrogen with high electron density. Down the group, the lone pair occupies larger, more diffuse s-like orbitals (Drago's effect), greatly diminishing proton-accepting ability")
        ],
        "B"
    ))

    # 018 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_018", t, "advanced",
        "Match the chemical factors affecting atomic electronegativity in List I with their quantitative or qualitative impacts in List II:",
        [
            ("Hybridization state of Carbon (sp3 vs sp2 vs sp)", "IV",
             "Electronegativity increases with s-character: sp (3.29) > sp2 (2.75) > sp3 (2.48)",
             "s-orbitals have greater penetration and hold electrons closer to the nucleus than p-orbitals. Higher % s-character (50% in sp vs 33% in sp2 vs 25% in sp3) increases the effective attraction for bonding electrons"),
            ("Oxidation state of the central atom (e.g., Fe^2+ vs Fe^3+)", "II",
             "Higher positive oxidation state increases effective nuclear charge, raising electronegativity (Fe^3+ > Fe^2+)",
             "Removing electrons increases the net positive charge per remaining electron, contracting the ionic radius and increasing the electrostatic pull on shared electron pairs"),
            ("Pauling vs Mulliken scale conversion", "I",
             "χ_P ≈ 0.336 × (χ_M - 0.615) when energies are measured in electron-volts (eV)",
             "Pauling values are empirical and relative, whereas Mulliken values are absolute energies; empirical regression gives the linear conversion χ_P = 0.336(χ_M - 0.615) or χ_P ≈ χ_M / 2.8"),
            ("Halogen electronegativity gradient (F, Cl, Br, I)", "III",
             "Decreases down the group: F (4.0) > Cl (3.16) > Br (2.96) > I (2.66) as valence shell distance increases",
             "As principal quantum number increases from n=2 to n=5, screening increases and covalent radius expands, reducing the electrostatic force on shared bonding electrons according to Allred-Rochow principles")
        ],
        "A"
    ))

    # 019 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_019", t, "advanced",
        "Match the species undergoing disproportionation across the periodic table in List I with their reaction products and mechanisms in List II:",
        [
            ("Hypochlorite ion (ClO^-) on heating", "II",
             "Disproportionates into chloride (Cl^-) and chlorate (ClO3^-): 3ClO^- -> 2Cl^- + ClO3^-",
             "Chlorine in ClO^- is in the intermediate +1 oxidation state; upon thermal excitation, it disproportionates into the -1 state (Cl^-) and the thermodynamically favored +5 state (ClO3^-)"),
            ("Manganate ion (MnO4^2-) in acidic aqueous solution", "IV",
             "Disproportionates into permanganate (MnO4^-) and manganese dioxide (MnO2): 3MnO4^2- + 4H+ -> 2MnO4^- + MnO2 + 2H2O",
             "Manganese in MnO4^2- has oxidation state +6. In neutral or acidic solutions, it readily disproportionates into purple Mn(VII) (MnO4^-) and brown-black Mn(IV) precipitate (MnO2)"),
            ("Copper(I) ion (Cu+) in aqueous solution", "I",
             "Disproportionates into copper(II) (Cu^2+) and metallic copper (Cu): 2Cu+ -> Cu^2+ + Cu(s)",
             "Although Cu+ ([Ar] 3d^10) has a stable closed d-subshell in dry solids, in aqueous solution the hydration enthalpy of Cu^2+ (-2121 kJ/mol) is more than double that of Cu+, driving disproportionation with ΔG° < 0"),
            ("White phosphorus (P4) in hot aqueous alkali", "III",
             "Disproportionates into phosphine (PH3) and hypophosphite (H2PO2^-): P4 + 3OH^- + 3H2O -> PH3 + 3H2PO2^-",
             "Elemental phosphorus (oxidation state 0) simultaneously undergoes reduction to -3 in toxic PH3 gas and oxidation to +1 in the hypophosphite anion H2PO2^-")
        ],
        "C"
    ))

    # 020 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_020", t, "advanced",
        "Match the periodic groups in List I with their anomalous electron affinity / electron gain enthalpy phenomena in List II:",
        [
            ("Noble gases (Group 18: He, Ne, Ar)", "III",
             "Electron affinity is strictly endothermic (> 0) because the extra electron must occupy a new principal shell",
             "Noble gases have stable closed-shell octets (or duplet in He). An added electron must enter the next higher principal quantum shell (e.g., 3s for Ne), experiencing strong shielding and zero net binding energy without external excitation"),
            ("Alkaline earth metals (Group 2: Be, Mg, Ca)", "I",
             "Electron affinity is virtually zero or endothermic due to the stable fully-filled ns^2 subshell",
             "Group 2 elements have complete ns^2 subshells. An added electron must enter the higher-energy np subshell, which is well shielded by the ns electrons, resulting in positive or near-zero electron gain enthalpy"),
            ("Pnictogens (Group 15: N, P, As)", "IV",
             "Subdued electron gain enthalpies due to the high exchange energy of the half-filled np^3 subshell",
             "The half-filled np^3 subshell possesses maximum exchange energy and spherical symmetry. Adding an electron produces pairing in an already occupied p orbital, incurring pairing repulsion that offsets nuclear attraction"),
            ("Halogens (Group 17: F, Cl, Br, I)", "II",
             "Electron affinity peaks at period 3 (Cl) rather than period 2 (F) due to severe 2p electron-electron repulsion in fluorine",
             "Because of the extraordinarily compact size of fluorine's 2p orbital, incoming electron density suffers intense electrostatic repulsion, making Δ_eg H of F (-328 kJ/mol) less exothermic than Cl (-349 kJ/mol)")
        ],
        "D"
    ))

    return qs

get_questions = get_periodic_questions
