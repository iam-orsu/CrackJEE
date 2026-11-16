from builder import make_matrix_q

def get_bonding_questions():
    qs = []
    t = "Chemical Bonding"
    prefix = "chem_ioc1"

    # =========================================================================
    # BEGINNER (4 questions: 021 - 024)
    # =========================================================================

    # 021 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_021", t, "beginner",
        "Match the molecules with no lone pairs on the central atom in List I with their VSEPR geometries and bond angles in List II:",
        [
            ("Beryllium chloride (BeCl2, gas)", "III",
             "Linear geometry, sp hybridization, bond angle 180°",
             "In BeCl2, the central beryllium atom has 2 valence electrons forming 2 bond pairs with chlorine atoms and zero lone pairs. Steric number = 2 corresponds to sp hybridization with a linear 180° geometry"),
            ("Boron trifluoride (BF3)", "I",
             "Trigonal planar geometry, sp2 hybridization, bond angle 120°",
             "BF3 has 3 valence electrons on boron forming 3 B-F sigma bonds and zero lone pairs. Steric number = 3 corresponds to sp2 hybridization and a symmetrical trigonal planar geometry with 120° bond angles"),
            ("Methane (CH4)", "IV",
             "Tetrahedral geometry, sp3 hybridization, bond angle 109.5°",
             "Carbon in CH4 has 4 valence electrons forming 4 C-H sigma bonds with zero lone pairs. Steric number = 4 gives sp3 hybridization and a regular tetrahedral geometry with bond angle 109°28'"),
            ("Phosphorus pentachloride (PCl5, gas)", "II",
             "Trigonal bipyramidal geometry, sp3d hybridization, bond angles 120° (equatorial) and 90° (axial)",
             "PCl5 possesses 5 bond pairs and zero lone pairs on phosphorus. Steric number = 5 corresponds to sp3d hybridization with a trigonal bipyramidal shape containing 3 equatorial bonds (120°) and 2 axial bonds (90°)")
        ],
        "B"
    ))

    # 022 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_022", t, "beginner",
        "Match the molecules having lone pairs in List I with their molecular geometries and lone pair counts in List II:",
        [
            ("Ammonia (NH3)", "IV",
             "Trigonal pyramidal geometry with 1 lone pair and 3 bond pairs (bond angle ~107°)",
             "Nitrogen has 5 valence electrons: 3 form single bonds with H and 2 form 1 lone pair. Steric number = 4 (sp3). Lone pair - bond pair repulsion compresses the tetrahedral angle from 109.5° to 107°"),
            ("Water (H2O)", "II",
             "Bent / V-shaped geometry with 2 lone pairs and 2 bond pairs (bond angle ~104.5°)",
             "Oxygen has 6 valence electrons: 2 form O-H bonds and 4 remain as 2 lone pairs. Steric number = 4 (sp3). Greater repulsion between the two lone pairs reduces the H-O-H angle to 104.5°"),
            ("Sulfur tetrafluoride (SF4)", "I",
             "See-saw geometry with 1 equatorial lone pair and 4 bond pairs (steric number = 5)",
             "Sulfur has 6 valence electrons: 4 form S-F bonds and 2 form 1 lone pair. In trigonal bipyramidal sp3d geometry, the lone pair occupies an equatorial position to minimize 90° lone pair-bond pair repulsions, giving a see-saw shape"),
            ("Chlorine trifluoride (ClF3)", "III",
             "T-shaped geometry with 2 equatorial lone pairs and 3 bond pairs (steric number = 5)",
             "Chlorine has 7 valence electrons: 3 form Cl-F bonds and 4 remain as 2 lone pairs. Both lone pairs reside in equatorial positions of the trigonal bipyramid, leaving 3 bonds in a bent T-shaped geometry")
        ],
        "A"
    ))

    # 023 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_023", t, "beginner",
        "Match the types of chemical bonding and intermolecular attractions in List I with their defining characteristics in List II:",
        [
            ("Ionic bonding (e.g., NaCl)", "II",
             "Non-directional electrostatic attraction between oppositely charged ions in a crystal lattice",
             "Ionic bonds arise from complete electron transfer from an electropositive metal to an electronegative non-metal, forming cations and anions held by non-directional Coulombic forces"),
            ("Covalent bonding (e.g., Cl2)", "IV",
             "Directional bond formed by mutual sharing of electron pairs between electronegative atoms",
             "Covalent bonding involves overlap of atomic orbitals to share valence electron pairs equally (homonuclear) or unequally (heteronuclear), exhibiting distinct bond lengths and bond angles"),
            ("Hydrogen bonding (e.g., in ice/water)", "I",
             "Dipole-dipole attraction where hydrogen is covalently bonded to highly electronegative N, O, or F",
             "When hydrogen is bound to a small, highly electronegative atom (N, O, F), the large bond dipole allows the partially positive H to interact electrostatically with a lone pair on an adjacent electronegative atom"),
            ("London dispersion forces (e.g., liquid Ar)", "III",
             "Weak attractions originating from instantaneous, temporary dipole - induced dipole interactions",
             "Non-polar atoms or molecules experience fleeting fluctuations in electron density creating temporary dipoles, which induce dipoles in neighboring atoms, producing weak, short-range London forces")
        ],
        "C"
    ))

    # 024 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_024", t, "beginner",
        "Match the diatomic molecules in List I with their molecular orbital bond orders and magnetic behaviors in List II:",
        [
            ("Dihydrogen (H2)", "III",
             "Bond order = 1, diamagnetic (configuration: σ1s^2)",
             "H2 has 2 electrons filling the bonding σ1s molecular orbital: BO = (2 - 0)/2 = 1. All electrons are paired, making it diamagnetic"),
            ("Dihelium (He2)", "I",
             "Bond order = 0, does not exist stably under normal conditions (configuration: σ1s^2 σ*1s^2)",
             "He2 has 4 electrons: 2 in bonding σ1s and 2 in antibonding σ*1s. BO = (2 - 2)/2 = 0, indicating zero net stabilization, so stable He2 molecules do not exist"),
            ("Dioxygen (O2)", "IV",
             "Bond order = 2, paramagnetic with 2 unpaired electrons in degenerate π*2p orbitals",
             "O2 has 16 electrons. The last 2 electrons occupy degenerate antibonding orbitals (π*2px^1, π*2py^1) with parallel spins according to Hund's rule, accounting for its observed paramagnetism"),
            ("Dinitrogen (N2)", "II",
             "Bond order = 3, diamagnetic with 1 σ and 2 π bonds (configuration: σ2s^2 σ*2s^2 π2px^2 π2py^2 σ2pz^2)",
             "N2 has 14 electrons: 10 bonding and 4 antibonding electrons. BO = (10 - 4)/2 = 3. All electrons are paired, giving a very stable triple bond with high bond dissociation energy (945 kJ/mol)")
        ],
        "D"
    ))

    # =========================================================================
    # INTERMEDIATE (8 questions: 025 - 032)
    # =========================================================================

    # 025 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_025", t, "intermediate",
        "Match the homonuclear diatomic molecules of the second period in List I with their valence MO electronic characteristics in List II:",
        [
            ("Diboron (B2)", "III",
             "Bond order = 1, paramagnetic due to 2 unpaired electrons in degenerate π2px and π2py orbitals",
             "Due to significant 2s-2p mixing in elements with Z ≤ 7, the π2p orbitals lie lower in energy than σ2pz. For B2 (6 valence electrons: σ2s^2 σ*2s^2 π2px^1 π2py^1), Hund's rule dictates 2 unpaired electrons in π2p, making it paramagnetic with BO = 1"),
            ("Dicarbon (C2)", "I",
             "Bond order = 2, diamagnetic with both bonds being pure π-bonds (π2px^2 π2py^2) and no σ-bond",
             "In C2 (8 valence electrons: σ2s^2 σ*2s^2 π2px^2 π2py^2), all valence bonding electrons reside in π2p orbitals. The double bond consists entirely of two π bonds with no net σ bond"),
            ("Dioxygen (O2)", "IV",
             "Bond order = 2, paramagnetic without 2s-2p mixing (σ2pz lies lower than π2px, π2py)",
             "For Z ≥ 8 (O2, F2), the energy gap between 2s and 2p is large, so 2s-2p mixing is negligible. The order is σ2pz < (π2px, π2py) < (π*2px, π*2py) < σ*2pz. The two π* electrons remain unpaired"),
            ("Dinitrogen (N2)", "II",
             "Bond order = 3, diamagnetic with highest bond dissociation energy (945 kJ/mol)",
             "In N2 (10 valence electrons), all bonding orbitals up to σ2pz are completely filled and antibonding orbitals are empty. The resulting triple bond (1 σ, 2 π) gives exceptional chemical inertness")
        ],
        "B"
    ))

    # 026 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_026", t, "intermediate",
        "Match the molecules in List I with their dipole moment features and directional vectors in List II:",
        [
            ("Carbon dioxide (CO2)", "IV",
             "Net dipole moment μ = 0 D due to cancellation of equal and opposite C=O bond dipoles in linear geometry",
             "CO2 has a linear symmetric O=C=O geometry (sp hybridization). The two strong C=O bond dipoles point in exactly opposite directions (180°), canceling each other to yield zero net dipole moment"),
            ("Nitrogen trifluoride (NF3)", "II",
             "Much lower dipole moment (0.24 D) than NH3 (1.47 D) because N-F bond dipoles oppose the nitrogen lone pair moment",
             "In NF3, fluorine is more electronegative than nitrogen, so the three N-F bond dipoles pull electron density away from nitrogen, partially opposing the upward dipole moment of the nitrogen lone pair"),
            ("Boron trifluoride (BF3)", "I",
             "Net dipole moment μ = 0 D because vector sum of three coplanar B-F dipoles at 120° is zero",
             "BF3 has a symmetrical trigonal planar structure (sp2 hybridization). The vector sum of three identical B-F bond dipoles directed at 120° in a plane results in complete cancellation (μ = 0)"),
            ("Sulfur dioxide (SO2)", "III",
             "Net dipole moment μ = 1.63 D because bent geometry and sulfur lone pair prevent dipole cancellation",
             "SO2 has a bent V-shaped geometry (sp2 hybridization, bond angle ~119.5°) with 1 lone pair on sulfur. The S=O bond dipoles reinforce the lone pair contribution, producing a substantial net dipole moment")
        ],
        "A"
    ))

    # 027 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_027", t, "intermediate",
        "Match the pairs of compounds in List I with the chemical property governed by Fajan's rules in List II:",
        [
            ("LiCl vs KCl", "II",
             "LiCl has much higher covalent character and is soluble in organic solvents (alcohol/pyridine)",
             "According to Fajan's rules, smaller cation Li+ has much higher polarizing power (charge/radius ratio) than K+. Li+ polarizes the electron cloud of Cl^-, imparting significant covalent character to LiCl"),
            ("AgCl vs NaCl", "IV",
             "AgCl is sparingly soluble and more covalent due to the pseudo-noble gas configuration ([Kr] 4d^10) of Ag+",
             "Ag+ has an 18-electron valence shell [Kr] 4d^10. The d-electrons shield nuclear charge poorly compared to the noble gas octet of Na+ ([Ne]), giving Ag+ greater polarizing power and AgCl higher covalent character"),
            ("SnCl4 vs SnCl2", "I",
             "SnCl4 is a volatile covalent liquid, whereas SnCl2 is a high-melting ionic solid",
             "Sn^4+ carries a +4 formal charge with very small radius, giving immense polarizing power that distorts chloride anions into shared covalent bonds, unlike Sn^2+ with lower charge"),
            ("BeCO3 vs BaCO3", "III",
             "BeCO3 decomposes at <100 °C, while BaCO3 is thermally stable up to >1300 °C",
             "The tiny Be^2+ cation heavily polarizes the large polyatomic carbonate ion CO3^2-, pulling electron density toward one oxygen to facilitate release of CO2 and form stable BeO")
        ],
        "C"
    ))

    # 028 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_028", t, "intermediate",
        "Match the coordination complexes and molecules in List I with their hybridization states and specific d-orbital involvement in List II:",
        [
            ("[PtCl4]^2-", "III",
             "dsp2 hybridization, square planar geometry involving the dx2-y2 orbital",
             "Pt(II) is a 5d^8 metal ion with large crystal field splitting, pairing electrons into lower d-orbitals. It adopts dsp2 hybridization using dx2-y2, producing a square planar complex"),
            ("[Fe(CO)5]", "I",
             "dsp3 hybridization, trigonal bipyramidal geometry involving the dz2 orbital",
             "Fe(0) has 3d^8 configuration in the presence of strong-field CO ligands. One 3d orbital (dz2), one 4s, and three 4p orbitals hybridize to form dsp3 trigonal bipyramidal structure"),
            ("Iodine heptafluoride (IF7)", "IV",
             "sp3d3 hybridization, pentagonal bipyramidal geometry involving dz2, dx2-y2, and dxy orbitals",
             "Iodine forms 7 I-F sigma bonds using sp3d3 hybridization with steric number 7. The axial bonds use dz2 while equatorial bonds involve dx2-y2 and dxy orbitals in a pentagonal bipyramid"),
            ("Xenon tetrafluoride (XeF4)", "II",
             "sp3d2 hybridization, square planar geometry with 2 trans lone pairs occupying axial positions",
             "Xe has 8 valence electrons: 4 bond pairs and 2 lone pairs (steric number = 6, sp3d2). The two lone pairs occupy opposite axial positions along the z-axis (using dz2) to minimize repulsion, yielding a square planar shape")
        ],
        "D"
    ))

    # 029 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_029", t, "intermediate",
        "Match the organic molecules in List I with the type and consequences of their hydrogen bonding in List II:",
        [
            ("o-Nitrophenol", "III",
             "Intramolecular H-bonding forming a 6-membered chelate ring; lower boiling point and steam volatile",
             "The phenolic -OH and nitro -NO2 groups are adjacent in the ortho-position, forming an intramolecular hydrogen bond. This prevents association with neighboring molecules, lowering boiling point and rendering it steam volatile"),
            ("p-Nitrophenol", "I",
             "Intermolecular H-bonding forming extensive polymeric chains; higher boiling point and non-steam volatile",
             "In p-nitrophenol, the -OH and -NO2 groups are far apart (para-position), precluding intramolecular bonding. Extensive intermolecular hydrogen bonding creates strong intermolecular forces, giving high boiling point and high water solubility"),
            ("Chloral hydrate (CCl3CH(OH)2)", "IV",
             "Stable gem-diol due to intramolecular H-bonding between OH hydrogens and electronegative Cl atoms",
             "Gem-diols are usually unstable with respect to loss of water. In chloral hydrate, the three chlorine atoms on adjacent carbon form strong intramolecular H-bonds with both -OH groups, stabilizing the gem-diol"),
            ("Acetic acid in benzene", "II",
             "Forms a cyclic dimer of apparent molecular weight ~120 due to two intermolecular H-bonds",
             "In non-polar solvents like benzene, acetic acid molecules pair up via two complementary C=O···H-O intermolecular hydrogen bonds to form a planar cyclic dimer, doubling the apparent molecular weight")
        ],
        "B"
    ))

    # 030 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_030", t, "intermediate",
        "Match the chemical species in List I with their formal charges and resonance bond orders in List II:",
        [
            ("Ozone (O3) central oxygen atom", "IV",
             "Formal charge = +1, average O-O bond order = 1.5, bent geometry (~116.8°)",
             "The Lewis structure of O3 has resonance contributors O=O^+-O^- and ^-O-O^+=O. The central oxygen forms 3 bonds and has 1 lone pair: Formal charge = 6 - 2 - (6/2) = +1. Bond order = 3/2 = 1.5"),
            ("Carbonate ion (CO3^2-)", "II",
             "Formal charge = -2/3 on each oxygen atom, average C-O bond order = 1.33 (4/3)",
             "CO3^2- has three equivalent resonance structures with one C=O double bond and two C-O single bonds. The net -2 charge is shared equally over 3 oxygens (-2/3 each), and bond order is (2 + 1 + 1)/3 = 4/3"),
            ("Nitrous oxide (N2O) central nitrogen", "I",
             "Formal charge = +1 in the major resonance contributor (:N≡N^+-O^-)",
             "In the dominant resonance structure :N≡N^+-O^-, the central nitrogen forms 4 covalent bonds with zero lone pairs: Formal charge = 5 - 0 - 4 = +1. The terminal nitrogen has 0 and oxygen has -1"),
            ("Nitrate ion (NO3^-)", "III",
             "Formal charge = +1 on nitrogen, average N-O bond order = 1.33, planar D3h symmetry",
             "NO3^- has three equivalent resonance structures where nitrogen forms 4 bonds with zero lone pairs (formal charge = +1). The -1 overall charge arises from +1 on N and -2/3 on each oxygen")
        ],
        "A"
    ))

    # 031 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_031", t, "intermediate",
        "Match the xenon compounds in List I with their shapes and lone pair distributions in List II:",
        [
            ("Xenon difluoride (XeF2)", "II",
             "Linear shape, sp3d hybridization with 3 equatorial lone pairs and 2 axial F atoms",
             "XeF2 has 2 bond pairs and 3 lone pairs (steric number = 5). All 3 lone pairs occupy equatorial positions at 120° to minimize repulsion, leaving the two F atoms in axial positions along a 180° line"),
            ("Xenon tetrafluoride (XeF4)", "IV",
             "Square planar shape, sp3d2 hybridization with 2 trans axial lone pairs and 4 equatorial F atoms",
             "XeF4 has 4 bond pairs and 2 lone pairs (steric number = 6). The 2 lone pairs occupy axial positions 180° apart, leaving 4 fluorine atoms at the corners of a square plane"),
            ("Xenon oxytetrafluoride (XeOF4)", "I",
             "Square pyramidal shape, sp3d2 hybridization with 1 axial lone pair opposite to the Xe=O bond",
             "XeOF4 has 5 sigma bonding partners (1 O and 4 F) and 1 lone pair (steric number = 6). The Xe=O double bond is axial, opposed by the lone pair, and 4 F atoms form the basal square"),
            ("Xenon trioxide (XeO3)", "III",
             "Trigonal pyramidal shape, sp3 hybridization with 1 lone pair and 3 Xe=O double bonds",
             "XeO3 has 3 sigma bonds to oxygen atoms and 1 lone pair (steric number = 4). It adopts a trigonal pyramidal structure analogous to ammonia, with explosive oxidizing properties")
        ],
        "C"
    ))

    # 032 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_032", t, "intermediate",
        "Match the Group 15 hydrides in List I with their bond angles and hybridization rationales (Drago's rule) in List II:",
        [
            ("Ammonia (NH3, bond angle 107.8°)", "III",
             "Hybridized sp3 with significant s-p mixing and strong bond pair-lone pair repulsions",
             "Due to the small size and high electronegativity of nitrogen (3.0), strong s-p hybridization occurs. The steric repulsion between bond pairs and the lone pair results in a pyramidal angle of 107.8°"),
            ("Phosphine (PH3, bond angle 93.5°)", "I",
             "Unhybridized p-orbitals participate in P-H bonding; Drago's rule applies due to lower electronegativity",
             "Drago's rule states that if the central atom is in Period 3 or below and bonded to a less electronegative substituent (like H), hybridization is negligible. P-H bonds use almost pure 3p orbitals (~90°)"),
            ("Arsine (AsH3, bond angle 91.8°)", "IV",
             "Pure p-orbital bonding with bond angle contracting closer to 90° as central atom size expands",
             "As the central atom size increases from P to As, the 4p orbitals become more diffuse, reducing steric repulsion between bonding pairs and further contracting the H-As-H angle toward 90°"),
            ("Stibine (SbH3, bond angle 91.3°)", "II",
             "Negligible hybridization where lone pair resides in almost pure, spherically symmetric 5s orbital",
             "In SbH3, bonding occurs almost entirely via orthogonal 5p orbitals. The lone pair is buried in a non-directional 5s orbital, explaining why SbH3 has practically zero Lewis basicity")
        ],
        "D"
    ))

    # =========================================================================
    # ADVANCED (8 questions: 033 - 040)
    # =========================================================================

    # 033 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_033", t, "advanced",
        "Match the 14- and 15-electron diatomic species in List I with their molecular orbital configurations and chemical features in List II:",
        [
            ("Carbon monoxide (CO, 14 electrons)", "III",
             "Bond order = 3; HOMO is a non-bonding weakly antibonding σ(2s/2p) carbon lone pair, acting as a σ-donor",
             "CO is isoelectronic with N2, but due to electronegativity difference, its HOMO is localized largely on carbon with significant s-character. CO binds to transition metals through carbon lone pair σ-donation"),
            ("Nitrosonium ion (NO^+, 14 electrons)", "I",
             "Bond order = 3; diamagnetic, with a shorter and stronger bond (106 pm) than neutral NO (115 pm)",
             "Neutral NO has 15 electrons with 1 electron in π*2p (BO = 2.5). Ionization to NO^+ removes the antibonding electron, increasing bond order to 3.0 and shrinking bond length to 106 pm"),
            ("Cyanide ion (CN^-, 14 electrons)", "IV",
             "Bond order = 3; strong-field ambidentate ligand with HOMO localized predominantly on carbon",
             "CN^- is isoelectronic with CO and N2 (BO = 3.0). The high negative charge density on carbon makes it a powerful carbon-centered nucleophile and strong-field ligand in coordination chemistry"),
            ("Dioxygenyl cation (O2^+, 15 electrons)", "II",
             "Bond order = 2.5; paramagnetic with 1 unpaired electron in π*2p, shorter bond length (112 pm) than O2 (121 pm)",
             "Removing one electron from the π*2p orbital of O2 increases the net bond order from 2.0 to 2.5, strengthening the O-O bond and leaving a single unpaired electron that gives paramagnetism")
        ],
        "B"
    ))

    # 034 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_034", t, "advanced",
        "Match the molecules in List I with the stereochemical manifestations of Bent's rule in List II:",
        [
            ("PCl3F2 (fluorine positions)", "IV",
             "Fluorine atoms preferentially occupy axial positions where orbitals have more p-character (no s-character)",
             "Bent's rule states that more electronegative substituents prefer hybrid orbitals having less s-character (more p-character). In sp3d (hybrid of equatorial sp2 + axial dp), axial orbitals have zero s-character, so electronegative F atoms occupy axial sites"),
            ("CH2F2 (bond angle comparison)", "II",
             "H-C-H angle > 109.5° while F-C-F angle < 109.5° because carbon directs more s-character toward H",
             "Fluorine is much more electronegative than H. Carbon directs higher p-character toward the C-F bonds (contracting the F-C-F angle) and higher s-character toward the C-H bonds (expanding the H-C-H angle above 109.5°)"),
            ("SF4 (axial vs equatorial S-F bond lengths)", "I",
             "Axial S-F bonds (~164 pm) are significantly longer than equatorial S-F bonds (~154 pm)",
             "Axial bonds are formed by p_z-d_z2 combinations with lower s-character and experience two 90° repulsions from the equatorial lone pair, making axial S-F bonds longer and weaker than equatorial bonds"),
            ("Chlorine dioxide (ClO2) vs Chlorite (ClO2^-)", "III",
             "ClO2 has a larger bond angle (117.6°) than ClO2^- (111°) due to single odd electron vs two lone pairs",
             "In ClO2, the odd electron resides in an sp2 hybrid orbital where it exerts less repulsion on bond pairs than the two full lone pairs in ClO2^-, allowing the O-Cl-O angle in ClO2 to widen to 117.6°")
        ],
        "A"
    ))

    # 035 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_035", t, "advanced",
        "Match the fluxional molecules in List I with their intramolecular rearrangement mechanisms in List II:",
        [
            ("Iron pentacarbonyl ([Fe(CO)5])", "II",
             "Undergoes rapid Berry pseudorotation at room temperature exchanging axial and equatorial CO ligands (single 13C-NMR peak)",
             "In trigonal bipyramidal Fe(CO)5, simultaneous pairwise bending converts the geometry into a square pyramidal transition state and back to a trigonal bipyramid, scrambling axial and equatorial CO ligands on NMR timescales"),
            ("Phosphorus pentafluoride (PF5)", "IV",
             "Undergoes Berry pseudorotation with very low energy barrier (~15 kJ/mol), showing a single doublet in 19F-NMR at 298 K",
             "PF5 has two axial and three equatorial fluorines. Rapid Berry pseudorotation averages all five fluorine environments, giving a single 19F NMR signal split only by coupling to the 31P nucleus (I=1/2)"),
            ("Sulfur tetrafluoride (SF4)", "I",
             "Fluxional at room temperature, but at -60 °C Berry pseudorotation freezes, resolving two distinct 19F-NMR peaks",
             "The see-saw geometry of SF4 has an energy barrier to pseudorotation of ~45 kJ/mol. At low temperature (-60 °C), the exchange is arrested, revealing separate resonances for axial and equatorial fluorines"),
            ("Chlorine trifluoride (ClF3)", "III",
             "Rigid T-shaped geometry where pseudorotation is suppressed due to high energy cost of placing lone pairs in axial sites",
             "In ClF3, the two lone pairs strongly prefer equatorial sites. Moving a lone pair to an axial position in a pseudorotation transition state costs substantial energy (>100 kJ/mol), making ClF3 stereochemically rigid")
        ],
        "C"
    ))

    # 036 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_036", t, "advanced",
        "Match the odd-electron nitrogen and chlorine oxides in List I with their dimerization behaviors in List II:",
        [
            ("Nitrogen dioxide (NO2)", "III",
             "Readily dimerizes to diamagnetic N2O4 (ΔH° = -57 kJ/mol) because the odd electron is localized in an sp2 hybrid on N",
             "In NO2, the unpaired electron is localized in an sp2 hybrid orbital on the small nitrogen atom with high spatial density, allowing facile overlap to form an unusually long and weak N-N sigma bond in N2O4"),
            ("Nitric oxide (NO)", "I",
             "Dimerizes to cis-(NO)2 only in liquid/solid phases at low temperatures because the odd electron is delocalized in π*2p",
             "In NO, the unpaired electron is delocalized across a π* antibonding molecular orbital. Delocalization reduces the pairing tendency, so gaseous NO remains monomeric and only associates weakly at low temperatures"),
            ("Chlorine dioxide (ClO2)", "IV",
             "Does not dimerize under ambient conditions because the odd electron is extensively delocalized over a 3c-5e π-system",
             "In ClO2, the single unpaired electron is delocalized over the entire O-Cl-O framework in a three-center five-electron π-system, preventing dimerization even down to liquid temperatures"),
            ("Chlorine trioxide (ClO3)", "II",
             "Readily dimerizes to diamagnetic Cl2O6, which in the solid state exists as the mixed salt [ClO2]^+ [ClO4]^-",
             "ClO3 is an unstable radical that dimerizes completely to dichlorine hexoxide (Cl2O6). In the solid crystal, it auto-ionizes into chloryl cation [ClO2]^+ and perchlorate anion [ClO4]^-")
        ],
        "D"
    ))

    # 037 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_037", t, "advanced",
        "Match the electron-deficient and hypervalent systems in List I with their multi-center bonding descriptions in List II:",
        [
            ("Diborane (B2H6)", "III",
             "Contains two 3-center 2-electron (3c-2e) B-H-B banana bonds and four 2-center 2-electron terminal B-H bonds",
             "Each boron in B2H6 is sp3 hybridized. Two bridging hydrogen 1s orbitals simultaneously overlap with sp3 orbitals from both boron atoms, sharing 2 electrons per bridge in curved 3c-2e banana bonds"),
            ("Trimethylaluminium dimer (Al2(CH3)6)", "I",
             "Contains two 3c-2e Al-C-Al bridging bonds involving carbon sp3 orbitals, and four terminal Al-CH3 bonds",
             "Unlike B(CH3)3, aluminium can dimerize using carbon sp3 hybrid orbitals from bridging methyl groups to form two 3c-2e Al-C-Al bonds, relieving electron deficiency on aluminium"),
            ("Triiodide ion ([I3]^-)", "IV",
             "Contains a linear 3-center 4-electron (3c-4e) hypervalent bond involving iodine 5p_z atomic orbitals",
             "In [I3]^-, a central I^- ion interacts with a terminal I2 molecule using collinear 5p_z orbitals. The resulting MO scheme yields 1 bonding, 1 non-bonding, and 1 antibonding orbital containing 4 electrons (3c-4e bond)"),
            ("Beryllium chloride solid ((BeCl2)_n)", "II",
             "Polymeric 1D chain where each beryllium atom is coordinated to four chlorines via coordinate 3c-4e / bridging bonds",
             "In solid BeCl2, each Be achieves an octet by accepting lone pairs from adjacent chlorine atoms, forming infinite polymeric chains of edge-sharing BeCl4 tetrahedra with bridging Be-Cl-Be bonds")
        ],
        "B"
    ))

    # 038 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_038", t, "advanced",
        "Match the molecules in List I with their back-bonding mechanisms and chemical consequences in List II:",
        [
            ("Boron trihalides (BF3, BCl3, BBr3, BI3)", "IV",
             "Lewis acidity order is BI3 > BBr3 > BCl3 > BF3 due to progressively poorer pπ-pπ back-bonding from larger halogens",
             "Fluorine 2p matches boron 2p in size and energy, providing strong 2pπ-2pπ back-donation that compensates boron's electron deficiency. As halogen size increases to 3p, 4p, and 5p, overlap efficiency plummets, making BI3 the strongest Lewis acid"),
            ("Trisilylamine ((SiH3)3N)", "II",
             "Planar geometry (bond angle ~120°) and virtually non-basic due to pπ-dπ back-donation into silicon 3d orbitals",
             "Unlike pyramidal, basic (CH3)3N, the nitrogen lone pair in (SiH3)3N delocalizes into vacant 3d orbitals of the three adjacent silicon atoms via pπ-dπ back-bonding, flattening the molecule to trigonal planar and quenching basicity"),
            ("Trimethylamine ((CH3)3N)", "I",
             "Trigonal pyramidal geometry with an unshared lone pair on sp3 nitrogen, acting as a strong Lewis base",
             "Carbon lacks accessible low-energy d-orbitals for back-bonding. The nitrogen lone pair remains localized in an sp3 hybrid orbital with high directional availability for protonation and coordination"),
            ("Disiloxane ((H3Si)2O)", "III",
             "Abnormally wide Si-O-Si bond angle (~144°) due to oxygen lone pair pπ-dπ back-donation into silicon 3d orbitals",
             "Oxygen lone pairs undergo pπ-dπ back-bonding into empty 3d orbitals of adjacent silicon atoms. This imparts partial double bond character to the Si-O bonds and opens the bond angle from ~105° to 144°")
        ],
        "A"
    ))

    # 039 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_039", t, "advanced",
        "Match the dioxygen-derived species in List I with their bond lengths, bond orders, and magnetic properties in List II:",
        [
            ("Dioxygen (O2)", "II",
             "Bond order = 2.0, paramagnetic (2 unpaired electrons), O-O bond length = 121 pm",
             "O2 has configuration KK (σ2s)^2 (σ*2s)^2 (σ2pz)^2 (π2px)^2 (π2py)^2 (π*2px)^1 (π*2py)^1. Two unpaired electrons in degenerate π* orbitals yield paramagnetism and bond order = (8 - 4)/2 = 2.0"),
            ("Superoxide ion (O2^-)", "IV",
             "Bond order = 1.5, paramagnetic (1 unpaired electron), O-O bond length = 128 pm",
             "Adding an electron to π*2p gives configuration (π*2px)^2 (π*2py)^1. Bond order decreases to (8 - 5)/2 = 1.5, weakening and lengthening the O-O bond to 128 pm, with 1 unpaired electron"),
            ("Peroxide ion (O2^2-)", "I",
             "Bond order = 1.0, diamagnetic (0 unpaired electrons), longest O-O bond length = 149 pm",
             "Adding two electrons fills both π*2px and π*2py orbitals. Bond order = (8 - 6)/2 = 1.0. All electrons are paired (diamagnetic) and the bond length expands to 149 pm"),
            ("Dioxygenyl cation (O2^+)", "III",
             "Bond order = 2.5, paramagnetic (1 unpaired electron), shortest O-O bond length = 112 pm",
             "Removing an electron from π*2p leaves only 1 antibonding electron. Bond order rises to (8 - 3)/2 = 2.5, contracting the bond length to 112 pm and raising the bond dissociation enthalpy to 643 kJ/mol")
        ],
        "C"
    ))

    # 040 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_040", t, "advanced",
        "Match the lattice energy concepts and formulas in List I with their physical significances in List II:",
        [
            ("NaCl lattice enthalpy (+788 kJ/mol)", "III",
             "Moderate lattice enthalpy for a 1:1 monovalent rock-salt lattice (Madelung constant M = 1.748)",
             "In NaCl, monovalent ions Na+ and Cl^- (charges +1 and -1) are arranged in a face-centered cubic lattice. The Coulombic attraction scaled by the Madelung constant yields a standard lattice enthalpy of 788 kJ/mol"),
            ("MgO lattice enthalpy (+3795 kJ/mol)", "I",
             "Nearly 5 times higher than NaCl due to product of ionic charges (|z+ z-| = 4) and smaller interionic distance",
             "Lattice energy scales with |z+ z-| / (r+ + r-). For MgO, charges are +2 and -2 (product = 4), and Mg^2+ and O^2- are significantly smaller than Na+ and Cl^-, multiplying lattice enthalpy to ~3795 kJ/mol"),
            ("Born-Lande repulsion exponent (n)", "IV",
             "Quantifies short-range inter-electron cloud repulsive potential energy scaling as B / r^n (n typically 5-12)",
             "In the Born-Lande equation U = -[N_A M z+ z- e^2 / (4πε0 r0)] × (1 - 1/n), the Born exponent n accounts for the steep Pauli repulsion when electron shells overlap at equilibrium separation r0"),
            ("Kapustinskii equation", "II",
             "Estimates lattice energy of any ionic crystal using only ionic radii, charges, and number of ions without knowing crystal geometry",
             "Kapustinskii noted that Madelung constant divided by the number of ions per formula unit is roughly constant for typical lattices: U_L = [1202 ν z+ z- / (r+ + r-)] × [1 - 34.5 / (r+ + r-)], valid within ~5% for any crystal structure")
        ],
        "D"
    ))

    return qs

get_questions = get_bonding_questions
