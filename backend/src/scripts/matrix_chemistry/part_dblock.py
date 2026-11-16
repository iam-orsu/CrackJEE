import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_dblock_questions():
    qs = []
    t = "Transition Metals and d-Block"

    # =========================================================================
    # BEGINNER (chem_ioc2_041 to chem_ioc2_044)
    # =========================================================================

    # Q41 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_041", t, "beginner",
        "Match the 3d series elements in List I with their valence electronic configurations and transition element definitions in List II:",
        [
            ("Scandium (Sc, Z=21)", "III", "[Ar] 3d¹ 4s²; the first 3d transition metal, forming exclusively +3 diamagnetic compounds", "Sc loses both 4s and the single 3d electron to form Sc³⁺ ([Ar] 3d⁰), which has no unpaired electrons and is colorless and diamagnetic"),
            ("Chromium (Cr, Z=24)", "I", "[Ar] 3d⁵ 4s¹; exhibits anomalous configuration due to extra exchange energy of half-filled d subshell", "Promoting one 4s electron to 3d achieves a spherically symmetrical half-filled 3d⁵ subshell, maximizing exchange stabilization energy"),
            ("Copper (Cu, Z=29)", "IV", "[Ar] 3d¹⁰ 4s¹; exhibits anomalous configuration due to extra stability of completely filled d subshell", "A completely filled 3d¹⁰ subshell minimizes electron repulsion and maximizes exchange energy; Cu²⁺ ([Ar] 3d⁹) has an incomplete d-subshell, making Cu a true transition metal"),
            ("Zinc (Zn, Z=30)", "II", "[Ar] 3d¹⁰ 4s²; not considered a typical transition element because d subshell is fully filled in both atom and Zn²⁺ ion", "By IUPAC definition, transition elements have an incomplete d subshell in ground state or in a common oxidation state; Zn ([Ar] 3d¹⁰ 4s²) and Zn²⁺ ([Ar] 3d¹⁰) do not qualify"),
        ], "A"
    ))

    # Q42 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_042", t, "beginner",
        "Match the transition metals in List I with their characteristic oxidation states in List II:",
        [
            ("Manganese (Mn, Z=25)", "IV", "Exhibits the maximum number of oxidation states in the 3d series, spanning from +2 to +7", "With five 3d and two 4s electrons, manganese can use all seven valence electrons, showing oxidation states +2, +3, +4, +5, +6, and +7 (in KMnO4)"),
            ("Scandium (Sc, Z=21)", "II", "Exhibits exclusively +3 oxidation state; no lower oxidation states are stable in aqueous solution", "Scandium has low IE1 + IE2 + IE3 values; loss of all three valence electrons yields the exceptionally stable noble-gas configuration of argon"),
            ("Iron (Fe, Z=26)", "I", "Commonly exhibits +2 (ferrous) and +3 (ferric) oxidation states, where +3 is stabilized by half-filled 3d⁵ subshell", "Fe²⁺ has [Ar] 3d⁶ configuration, while Fe³⁺ has [Ar] 3d⁵ configuration with extra stability from half-filled d-orbitals"),
            ("Osmium and Ruthenium (Os, Ru)", "III", "Exhibit the maximum oxidation state of +8 among all elements in their tetroxides (OsO4 and RuO4)", "In the 4d and 5d series, higher oxidation states are stabilized by greater spatial extension of d orbitals, enabling OsO4 and RuO4 with formal +8 oxidation states"),
        ], "B"
    ))

    # Q43 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_043", t, "beginner",
        "Match the transition metal ions in List I with their spin-only magnetic moments in List II (μ = √(n(n+2)) BM):",
        [
            ("Copper(II) ion (Cu²⁺, 3d⁹)", "II", "n = 1 unpaired electron; μ_eff = √(1×3) = √3 ≈ 1.73 BM", "Cu²⁺ has configuration [Ar] 3d⁹, leaving exactly one unpaired electron; spin-only formula gives μ = √(1×3) = 1.73 BM"),
            ("Nickel(II) ion (Ni²⁺, 3d⁸)", "IV", "n = 2 unpaired electrons; μ_eff = √(2×4) = √8 ≈ 2.83 BM", "Ni²⁺ has configuration [Ar] 3d⁸ with two unpaired electrons in eg orbitals in octahedral fields; spin-only formula gives μ = √(2×4) = 2.83 BM"),
            ("Chromium(III) ion (Cr³⁺, 3d³)", "I", "n = 3 unpaired electrons; μ_eff = √(3×5) = √15 ≈ 3.87 BM", "Cr³⁺ has configuration [Ar] 3d³ with three unpaired electrons occupying t2g orbitals; spin-only formula gives μ = √(3×5) = 3.87 BM"),
            ("Iron(II) high-spin ion (Fe²⁺, 3d⁶)", "III", "n = 4 unpaired electrons; μ_eff = √(4×6) = √24 ≈ 4.90 BM", "Fe²⁺ has configuration [Ar] 3d⁶; in high-spin weak ligand field (e.g., [Fe(H2O)6]²⁺), pairing occurs once leaving 4 unpaired electrons; μ = √(4×6) = 4.90 BM"),
        ], "C"
    ))

    # Q44 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_044", t, "beginner",
        "Match the important compounds of Manganese and Chromium in List I with their physical appearances and uses in List II:",
        [
            ("Potassium dichromate (K2Cr2O7)", "III", "Bright orange crystalline solid; primary standard in redox titrations, strongly oxidizing in acidic medium", "K2Cr2O7 is non-hygroscopic, crystallizes in orange triclinic form, and serves as a standard primary redox reagent without self-decomposition"),
            ("Potassium chromate (K2CrO4)", "I", "Bright yellow crystalline solid; stable in alkaline solutions, used as an indicator in Mohr argentometric titrations", "In neutral or basic solutions (pH > 7), yellow CrO4²⁻ is the predominant species, forming red-brown Ag2CrO4 precipitate at the endpoint of chloride titrations"),
            ("Potassium permanganate (KMnO4)", "IV", "Deep purple/dark bronze crystals; intense color due to LMCT, widely used as an analytical and medical disinfectant", "KMnO4 is an intensely purple solid due to O²⁻ -> Mn⁷⁺ charge transfer; it serves as a powerful self-indicating volumetric oxidant"),
            ("Manganese dioxide (MnO2)", "II", "Dark brown/black insoluble solid; acts as a heterogeneous catalyst in KClO3 decomposition and cathode depolarizer in dry cells", "MnO2 is a non-stoichiometric black solid that catalyzes 2KClO3 -> 2KCl + 3O2 at lower temperatures and oxidizes H2 to H2O in Leclanché cells"),
        ], "D"
    ))

    # =========================================================================
    # INTERMEDIATE (chem_ioc2_045 to chem_ioc2_052)
    # =========================================================================

    # Q45 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_045", t, "intermediate",
        "Match the chemical/physical consequences of Lanthanoid Contraction in List I with their manifestations in List II:",
        [
            ("Similarity in atomic/ionic radii of 4d and 5d elements", "III", "Zirconium (Zr, 160 pm) and Hafnium (Hf, 159 pm) have virtually identical radii and identical chemical properties", "Intervention of 14 poorly shielding 4f electrons before 5d elements cancels the expected size expansion from n=4 to n=5, making Zr and Hf twins in nature"),
            ("Dramatic increase in densities of 5d series elements", "I", "Osmium (22.59 g/cm³) and Iridium (22.56 g/cm³) exhibit the highest densities of all elements", "Nearly doubling the atomic mass from 4d to 5d while keeping the unit cell volume virtually unchanged leads to extraordinarily high densities in 5d elements"),
            ("Basicity variation of Lanthanoid hydroxides Ln(OH)3", "IV", "Basicity decreases steadily from La(OH)3 (most basic) to Lu(OH)3 (least basic)", "As Ln³⁺ ionic radius shrinks from La³⁺ (103 pm) to Lu³⁺ (86 pm), the covalent character of the Ln-OH bond increases according to Fajan's rules, decreasing basicity"),
            ("Difficulty in separation of Lanthanoids", "II", "Requires fractional crystallization, complexation with EDTA, or modern ion-exchange chromatography", "Because all trivalent lanthanoid ions possess nearly identical ionic radii and identical chemical behavior, simple chemical precipitation cannot separate them efficiently"),
        ], "A"
    ))

    # Q46 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_046", t, "intermediate",
        "Match the reactions of Potassium dichromate (K2Cr2O7) in List I with their observations and products in List II:",
        [
            ("Chromyl chloride test (K2Cr2O7 + solid NaCl + conc. H2SO4)", "IV", "Liberates deep red vapors of chromyl chloride (CrO2Cl2) that turn NaOH yellow", "Red vapors of CrO2Cl2 are formed: K2Cr2O7 + 4NaCl + 6H2SO4 -> 2CrO2Cl2 + 2KHSO4 + 4NaHSO4 + 3H2O; confirms presence of ionic chloride"),
            ("Confirmatory lead chromate test for CrO2Cl2 vapors", "I", "Yellow Na2CrO4 solution acidified with CH3COOH produces a bright yellow precipitate of PbCrO4 with (CH3COO)2Pb", "Absorbing CrO2Cl2 in NaOH yields yellow Na2CrO4: CrO2Cl2 + 4NaOH -> Na2CrO4 + 2NaCl + 2H2O; addition of lead acetate yields insoluble yellow PbCrO4"),
            ("Oxidation of acidified Iron(II) sulfate (FeSO4) by K2Cr2O7", "II", "Green Fe²⁺ is oxidized to yellow Fe³⁺ while orange Cr2O7²⁻ is reduced to green hydrated Cr³⁺", "Reaction: Cr2O7²⁻ + 14H⁺ + 6Fe²⁺ -> 2Cr³⁺ (green) + 6Fe³⁺ + 7H2O; each dichromate accepts 6 electrons (n-factor = 6)"),
            ("Reaction of acidified K2Cr2O7 with Hydrogen peroxide in ether", "III", "Forms an unstable, intense blue ethereal layer of chromium pentoxide (CrO5)", "Cr2O7²⁻ + 2H⁺ + 4H2O2 -> 2CrO5 + 5H2O; CrO5 is stabilized by coordinating to ether via its peroxo butterfly structure"),
        ], "B"
    ))

    # Q47 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_047", t, "intermediate",
        "Match the redox behaviors of Potassium permanganate (KMnO4) in List I with their electron transfers and medium conditions in List II:",
        [
            ("Acidic medium (e.g., dilute H2SO4)", "II", "MnO4⁻ is reduced to colorless Mn²⁺; n-factor = 5 (MnO4⁻ + 8H⁺ + 5e⁻ -> Mn²⁺ + 4H2O)", "In acidic medium, Mn(+7) is reduced by 5 electrons to Mn²⁺ (+2); used in titrations against oxalic acid, ferrous ammonium sulfate, etc."),
            ("Faintly alkaline or neutral medium (e.g., Baeyer's conditions)", "IV", "MnO4⁻ is reduced to brown/black insoluble MnO2; n-factor = 3 (MnO4⁻ + 2H2O + 3e⁻ -> MnO2 + 4OH⁻)", "In neutral or weakly alkaline medium, Mn(+7) is reduced by 3 electrons to insoluble MnO2 (+4), as in the oxidation of iodide to iodate (IO3⁻)"),
            ("Strongly alkaline medium (concentrated KOH)", "I", "MnO4⁻ is reduced to dark green manganate(VI) ion; n-factor = 1 (MnO4⁻ + e⁻ -> MnO4²⁻)", "In strongly basic solutions, Mn(+7) is reduced by a single electron to green manganate MnO4²⁻ (+6), which can further slowly reduce to MnO2"),
            ("Action of Baeyer's reagent on alkenes (cold 1% alkaline KMnO4)", "III", "Decolorizes purple KMnO4 and causes syn-dihydroxylation yielding vicinal cis-1,2-diols", "The cyclic manganate ester intermediate undergoes cis-hydrolysis, transferring two OH groups to the same face of the double bond with MnO2 precipitation"),
        ], "C"
    ))

    # Q48 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_048", t, "intermediate",
        "Match the standard reduction potentials (E°) of 3d elements in List I with their chemical significances in List II:",
        [
            ("E°(Cu²⁺/Cu) = +0.34 V (the only positive E°(M²⁺/M) in 3d series)", "III", "High sum of sublimation and ionization enthalpies (IE1 + IE2) is not compensated by the hydration enthalpy of Cu²⁺", "Copper does not liberate H2 gas from dilute non-oxidizing acids because the energetic cost to atomize and ionize copper exceeds its hydration enthalpy"),
            ("E°(Cr³⁺/Cr²⁺) = -0.41 V", "I", "Cr²⁺ is a strong reducing agent because oxidation produces the half-filled t2g³ configuration of Cr³⁺", "The negative potential shows Cr²⁺ readily loses an electron to form Cr³⁺, which possesses an extra-stable half-filled t2g³ subshell in octahedral coordination"),
            ("E°(Mn³⁺/Mn²⁺) = +1.57 V", "IV", "Mn³⁺ is a powerful oxidizing agent because reduction produces the half-filled 3d⁵ configuration of Mn²⁺", "Mn³⁺ (3d⁴) avidly gains an electron to reach the half-filled, spherically symmetric 3d⁵ state of Mn²⁺, giving a large positive reduction potential"),
            ("E°(Fe³⁺/Fe²⁺) = +0.77 V", "II", "Moderate positive potential allows Fe²⁺/Fe³⁺ couple to act as a versatile biological and chemical reversible redox carrier", "Fe³⁺ (3d⁵) is mildly oxidizing, while Fe²⁺ (3d⁶) is mildly reducing, making this couple ideal for electron transport in cytochromes and ferredoxins"),
        ], "D"
    ))

    # Q49 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_049", t, "intermediate",
        "Match the transition metal industrial catalysts in List I with their catalyzed processes in List II:",
        [
            ("Ziegler-Natta catalyst (TiCl4 + Al(C2H5)3)", "III", "Coordination polymerization of ethene into high-density polyethylene (HDPE) under mild conditions", "The titanium center coordinates ethylene and inserts it stereospecifically into the growing polymer chain, creating linear unbranched high-density polyethylene"),
            ("Vanadium(V) oxide (V2O5) in the Contact Process", "I", "Heterogeneous oxidation of sulfur dioxide (SO2) to sulfur trioxide (SO3)", "V2O5 operates via a two-step redox cycle: 2V2O5 + 2SO2 -> 2V2O4 + 2SO3, followed by rapid reoxidation: 2V2O4 + O2 -> 2V2O5"),
            ("Finely divided Iron with Molybdenum promoter in Haber Process", "IV", "Synthesis of ammonia from dinitrogen and dihydrogen: N2 + 3H2 -> 2NH3", "Iron provides low-activation-energy sites for dissociative adsorption of triple-bonded N2, while Mo acts as a structural promoter preventing sintering"),
            ("Finely divided Nickel (Raney Nickel)", "II", "Catalytic hydrogenation of unsaturated vegetable oils into solid fats (margarine/vanaspati)", "Nickel chemisorbs H2 on its surface, cleaving the H-H bond into active hydrogen adatoms that add across C=C double bonds in triglycerides"),
        ], "A"
    ))

    # Q50 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_050", t, "intermediate",
        "Match the colors of transition metal species in List I with the electronic origin of their colors in List II:",
        [
            ("Permanganate ion (MnO4⁻, intensely purple)", "IV", "Ligand-to-Metal Charge Transfer (LMCT) from filled 2p orbitals of O²⁻ to empty 3d orbitals of Mn⁷⁺", "Mn⁷⁺ has a 3d⁰ configuration with no d-electrons for d-d transitions; the intense absorption (ε > 10⁴) originates from charge transfer O²⁻(π) -> Mn⁷⁺(3d)"),
            ("Hexaaquacopper(II) ion ([Cu(H2O)6]²⁺, blue)", "I", "d-d electronic transition between crystal field split 3d levels of Cu²⁺ (3d⁹)", "The 3d⁹ electron configuration has one vacancy in the eg level; absorption of red-orange light promotes an electron from lower t2g to eg, transmitting blue"),
            ("Hexaaquatitanium(III) ion ([Ti(H2O)6]³⁺, violet)", "II", "Single d-electron transition from t2g to eg level in an octahedral ligand field", "Ti³⁺ has a 3d¹ configuration; absorption of yellow-green light (~20,300 cm⁻¹) excites the solitary electron from t2g to eg, transmitting complementary violet light"),
            ("Scandium(III) and Zinc(II) aqueous ions ([Sc(H2O)6]³⁺, [Zn(H2O)6]²⁺)", "III", "Completely colorless because Sc³⁺ is 3d⁰ and Zn²⁺ is 3d¹⁰, precluding any d-d electronic transitions", "With no d-electrons (3d⁰ in Sc³⁺) or completely filled d-subshell (3d¹⁰ in Zn²⁺), no d-d transitions are possible in the visible spectrum"),
        ], "B"
    ))

    # Q51 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_051", t, "intermediate",
        "Match the physical properties of transition metals in List I with their structural/electronic origins in List II:",
        [
            ("Tungsten (W) exhibits the highest melting point (3422 °C) among all metals", "II", "Maximum number of unpaired 5d electrons participating in exceptionally strong covalent metal-metal bonding", "With 5d⁴ 6s² configuration, tungsten has 6 valence electrons in diffuse, spatially extended 5d orbitals that overlap strongly to form covalent bonds"),
            ("Manganese (Mn) shows an anomalous dip in melting point in the 3d series", "IV", "Stable half-filled 3d⁵ subshell holds electrons more tightly, reducing their participation in interatomic metallic bonding", "The high exchange stability of half-filled 3d⁵ makes d-electrons localized and less available for delocalization, leading to a weaker metallic crystal lattice"),
            ("Mercury (Hg) is a liquid at room temperature (mp = -38.8 °C)", "I", "Fully filled 5d¹⁰ 6s² configuration with strong relativistic contraction of the 6s orbital prevents metallic orbital overlap", "Relativistic stabilization pulls the 6s² pair close to the nucleus, making mercury behave like a pseudo-noble gas with extremely weak metal-metal bonding"),
            ("Enthalpies of atomization of 4d and 5d series are higher than the 3d series", "III", "Greater spatial extension of 4d and 5d orbitals leads to significantly stronger metal-metal directional bonding", "Because 4d and 5d orbitals extend further from the nucleus than compact 3d orbitals, interatomic orbital overlap is much more effective, increasing atomization enthalpy"),
        ], "C"
    ))

    # Q52 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_052", t, "intermediate",
        "Match the Chromate-Dichromate equilibrium species in List I with their structural and chemical parameters in List II:",
        [
            ("Chromate ion (CrO4²⁻)", "II", "Discrete tetrahedral geometry with Cr(+6); stable in basic solution (pH > 7) exhibiting bright yellow color", "CrO4²⁻ consists of a central Cr⁶⁺ coordinated tetrahedrally to 4 oxygen atoms with average Cr-O bond length ~1.66 Å; it is the dominant species at high pH"),
            ("Dichromate ion (Cr2O7²⁻)", "IV", "Two corner-sharing CrO4 tetrahedra linked by a bridging oxygen (Cr-O-Cr angle ≈ 126°); stable in acidic solution (pH < 7)", "In acidic media, chromate protonates and condenses: 2CrO4²⁻ + 2H⁺ <=> Cr2O7²⁻ + H2O; the bridging Cr-O bond (1.79 Å) is longer than terminal Cr-O bonds (1.63 Å)"),
            ("Equilibrium response upon adding alkali (OH⁻) to an orange dichromate solution", "I", "Shifts equilibrium toward yellow chromate without change in oxidation state: Cr2O7²⁻ + 2OH⁻ -> 2CrO4²⁻ + H2O", "Adding OH⁻ consumes H⁺, shifting the equilibrium completely to the yellow chromate form; chromium remains in the +6 state throughout"),
            ("Oxidation state and d-electron count of Chromium in both CrO4²⁻ and Cr2O7²⁻", "III", "Cr is in +6 oxidation state with 3d⁰ electronic configuration in both ions", "In both ions, chromium has formally lost all six valence electrons (3d⁵ 4s¹); diamagnetism and lack of d-electrons confirm 3d⁰ configuration"),
        ], "D"
    ))

    # =========================================================================
    # ADVANCED (chem_ioc2_053 to chem_ioc2_060)
    # =========================================================================

    # Q53 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_053", t, "advanced",
        "Match the transition metal optical transitions and selection rules in List I with their spectroscopic characteristics in List II:",
        [
            ("Laporte selection rule (parity selection rule, Δl = ±1)", "III", "Centrosymmetric octahedral d-d transitions (g -> g) are Laporte-forbidden, giving low molar extinction (ε ~ 1-50 L/mol·cm)", "Since d orbitals have 'gerade' parity, a pure electric dipole d-d transition does not change parity (g -> g is forbidden); transitions occur weakly via vibronic coupling"),
            ("Spin selection rule (ΔS = 0)", "I", "Transitions involving a change in spin multiplicity are spin-forbidden, explaining the extremely pale pink color of high-spin [Mn(H2O)6]²⁺ (ε < 0.1)", "High-spin Mn²⁺ is 3d⁵ (⁶A1g); any d-d promotion forces spin pairing, producing doublet or quartet states (ΔS ≠ 0), rendering all d-d transitions doubly forbidden"),
            ("Charge-transfer transitions (e.g., in MnO4⁻ and Cr2O7²⁻)", "IV", "Both Laporte-allowed (p -> d, Δl = ±1) and spin-allowed (ΔS = 0), producing extremely high molar extinction coefficients (ε > 10⁴ L/mol·cm)", "Electron promotion from ligand molecular orbitals (primarily oxygen 2p) to metal d orbitals involves change in parity (u -> g) and no spin flip, producing intense absorption"),
            ("Inter-valence charge transfer (IVCT) in Prussian Blue (Fe4[Fe(CN)6]3)", "II", "Photo-induced electron transfer between Fe(II) and Fe(III) sites producing intense deep blue coloration", "Absorption of red light (~680 nm) induces charge transfer from low-spin Fe(II) (t2g⁶) in [Fe(CN)6]⁴⁻ to high-spin Fe(III) (t2g³ eg²) coordinated to nitrogen, producing intense blue color"),
        ], "A"
    ))

    # Q54 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_054", t, "advanced",
        "Match the Actinoid series characteristics in List I with their comparisons to Lanthanoids in List II:",
        [
            ("Range of oxidation states exhibited by early Actinoids (Th to Am)", "IV", "Much wider range (up to +7 in Np and Pu; +6 in U) because 5f, 6d, and 7s orbital energy levels are comparable", "Unlike 4f electrons which are deeply buried, 5f electrons have lower binding energies and extend spatially to participate directly in chemical bonding with 6d and 7s"),
            ("Magnitude of Actinoid contraction compared to Lanthanoid contraction", "I", "Significantly greater contraction from element to element due to poorer shielding by 5f orbitals than by 4f orbitals", "5f orbitals have diffuse angular distributions with less radial penetration, shielding the nuclear charge even more poorly than 4f, leading to larger successive size drops"),
            ("Formation of linear dioxo oxocations like Uranyl (UO2²⁺)", "II", "Readily formed by actinoids in high oxidation states due to strong covalent π-overlap of 5f/6d orbitals with oxygen 2p", "The linear [O=U=O]²⁺ ion contains strong U-O multiple bonds involving uranium 5f and 6d orbitals; lanthanoids do not form analogous stable oxocations"),
            ("Magnetic susceptibilities and crystal field interactions of 5f electrons", "III", "5f electrons experience much stronger crystal field splitting than 4f electrons due to direct exposure to ligand environments", "Because 5f orbitals extend into the coordination sphere, crystal field splitting is comparable to spin-orbit coupling, complicating magnetic moments unlike 4f ions"),
        ], "B"
    ))

    # Q55 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_055", t, "advanced",
        "Match the non-stoichiometric transition metal oxides in List I with their defect chemistry and electronic properties in List II:",
        [
            ("Magnetite (Fe3O4)", "II", "Inverse spinel structure formulated as (Fe³⁺)tet[Fe²⁺Fe³⁺]octO4 exhibiting ferrimagnetism and high conductivity via electron hopping", "All Fe²⁺ and half of Fe³⁺ ions occupy octahedral sites; fast thermally activated electron transfer between adjacent Fe²⁺ and Fe³⁺ in octahedral sites imparts high electrical conductivity"),
            ("Wüstite (Fe1-xO, typically Fe0.95O)", "IV", "Metal-deficient p-type semiconductor where Fe²⁺ cation vacancies are compensated by two Fe³⁺ ions per vacancy", "Missing Fe²⁺ ions create cation vacancies; charge neutrality is maintained by oxidizing two remaining Fe²⁺ to Fe³⁺, with positive holes providing electrical conduction"),
            ("Chromium dioxide (CrO2)", "I", "Half-metallic ferromagnetic oxide used extensively as the magnetic recording medium in audio and video cassettes", "CrO2 is a half-metal: conducting for majority-spin electrons and insulating for minority-spin electrons; its strong ferromagnetic coercivity is ideal for magnetic tapes"),
            ("Titanium monoxide (TiO) and Vanadium monoxide (VO)", "III", "Exhibit metallic electrical conductivity due to broad d-bands formed by direct t2g-t2g orbital overlap", "Direct overlap of adjacent metal t2g orbitals across the rock-salt lattice creates a continuous conduction band, resulting in electrical resistivity comparable to metallic Ti and V"),
        ], "C"
    ))

    # Q56 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_056", t, "advanced",
        "Match the Latimer diagram redox relationships in List I with their thermodynamic conclusions in List II:",
        [
            ("Latimer criterion for spontaneous disproportionation of an intermediate species", "II", "Disproportionation occurs spontaneously if E°(right) > E°(left) in the reduction potential diagram", "When E° of reduction to the lower state is more positive than E° of formation from the higher state, the Gibbs free energy change ΔG° for disproportionation is negative"),
            ("Disproportionation of Manganate(VI) (MnO4²⁻) in acidic solution", "IV", "Spontaneously disproportionates: 3MnO4²⁻ + 4H⁺ -> 2MnO4⁻ + MnO2 + 2H2O because E°(MnO4²⁻/MnO2) = +2.26 V > E°(MnO4⁻/MnO4²⁻) = +0.56 V", "Green manganate is stable only in concentrated alkali; upon lowering pH, it immediately disproportionates into purple permanganate and black MnO2 precipitate"),
            ("Spontaneous disproportionation of Copper(I) (Cu⁺) in aqueous solution", "I", "Disproportionates into Cu and Cu²⁺: 2Cu⁺ -> Cu + Cu²⁺ because E°(Cu⁺/Cu) = +0.52 V > E°(Cu²⁺/Cu⁺) = +0.15 V", "Although Cu⁺ has a stable 3d¹⁰ configuration, the large hydration enthalpy of Cu²⁺ (-2121 kJ/mol vs -580 kJ/mol for Cu⁺) drives disproportionation thermodynamically"),
            ("Reduction potential of Chromium(II) (Cr²⁺, E° = -0.41 V)", "III", "Fierce reducing agent that can reduce hydronium ions (H⁺) to liberate H2 gas and reduce atmospheric O2", "Cr²⁺ (3d⁴) readily loses an electron to attain the stable half-filled t2g³ state of Cr³⁺, making it an oxygen-sensitive reducing agent in non-oxidizing acids"),
        ], "D"
    ))

    # Q57 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_057", t, "advanced",
        "Match the extractive metallurgy and purification methods of 3d/4d metals in List I with their chemical equations and conditions in List II:",
        [
            ("Kroll process for Titanium extraction", "III", "TiO2 is chlorinated with C and Cl2 at 900 °C to TiCl4, followed by reduction with molten Mg under Ar at 850 °C: TiCl4 + 2Mg -> Ti + 2MgCl2", "Titanium cannot be reduced with carbon due to brittle carbide (TiC) formation; reduction of volatile TiCl4 with liquid Mg under inert gas yields titanium sponge"),
            ("Van Arkel-de Boer process for ultra-pure Zirconium / Titanium", "I", "Crude metal is heated with I2 at ~520 K to form volatile ZrI4, which thermal decomposes on a white-hot W filament at 1800 K: ZrI4 -> Zr + 2I2", "The reversible iodination selectively transports pure metal vapor to a tungsten filament, leaving non-volatile oxygen and nitrogen impurities behind"),
            ("Reduction of Vanadium pentoxide (V2O5) to Vanadium metal", "IV", "V2O5 is reduced by aluminium powder in an exothermic thermite reaction: 3V2O5 + 10Al -> 6V + 5Al2O3", "Thermite reduction produces vanadium metal or ferrovanadium alloy directly used in the manufacturing of high-strength alloy steels"),
            ("Colors of Vanadium oxidation states in aqueous solution (+2, +3, +4, +5)", "II", "V²⁺ is violet, V³⁺ is green, VO²⁺ (+4) is bright blue, and VO2⁺ (+5) is yellow", "Stepwise reduction of yellow VO2⁺ by zinc in acid sequentially yields blue VO²⁺, green V³⁺, and finally violet V²⁺, illustrating four distinct oxidation states"),
        ], "A"
    ))

    # Q58 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_058", t, "advanced",
        "Match the Platinum and Palladium catalytic systems in List I with their coordination mechanisms and stereochemistry in List II:",
        [
            ("Wacker process for oxidation of ethylene to acetaldehyde", "IV", "Homogeneous catalytic cycle utilizing [PdCl4]²⁻ and CuCl2 in aqueous solution where Pd(II) is reduced to Pd(0) and reoxidized by Cu(II)", "Coordination of C2H4 to Pd(II) activates it to nucleophilic attack by water, yielding CH3CHO and Pd(0); CuCl2 reoxidizes Pd(0) to Pd(II), and O2 regenerates Cu(II)"),
            ("Wilkinson's catalyst (RhCl(PPh3)3)", "I", "Square planar 16-electron Rh(I) complex that undergoes reversible oxidative addition of H2 for homogeneous alkene hydrogenation", "Dissociation of one PPh3 ligand creates a vacant coordination site; oxidative addition of H2 generates an octahedral 18-electron dihydrido rhodium(III) intermediate"),
            ("Cisplatin (cis-[Pt(NH3)2Cl2]) anticancer mechanism", "II", "Square planar complex where cis-chloro ligands undergo stepwise aquation to cross-link adjacent guanine bases in DNA", "Cis geometry allows the two coordination sites (after Cl⁻ hydrolysis) to bind intrastrand guanine N7 positions separated by ~3.4 Å, bending DNA and inducing apoptosis"),
            ("Lindlar's catalyst (Pd deposited on CaCO3 poisoned with Pb(OAc)2 and quinoline)", "III", "Selectively catalyzes the partial syn-hydrogenation of alkynes to yield exclusively cis-alkenes", "Poisoning the palladium active sites lowers its catalytic activity, halting hydrogenation after the addition of one mole of H2 and preventing over-reduction to alkanes"),
        ], "B"
    ))

    # Q59 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_059", t, "advanced",
        "Match the Peroxo and oxo complexes of 3d metals in List I with their structural and analytical features in List II:",
        [
            ("Chromium pentoxide (CrO5) in diethyl ether", "II", "Deep blue peroxo compound with butterfly structure containing one oxo (=O) and two peroxo (-O-O-) ligands; Cr is in +6 oxidation state", "Formed when acidified dichromate is treated with H2O2; ether molecules coordinate to the apex, stabilizing the otherwise explosive blue CrO(O2)2 species"),
            ("Decomposition of CrO5 in aqueous acidic solution", "IV", "Rapidly decomposes with effervescence to release O2 gas and green hydrated Chromium(III) ions: 4CrO5 + 12H⁺ -> 4Cr³⁺ + 7O2 + 6H2O", "In the absence of stabilizing ether, CrO5 acts as an internal redox system where peroxo oxygens (-1) reduce Cr(+6) to stable green Cr³⁺ (+3) and evolve O2"),
            ("Peroxovanadate complex formed with excess H2O2 in acid", "I", "Deep red-brown coloration due to the formation of peroxovanadium cation [VO(O2)(H2O)n]⁺", "Acidic vanadate solutions react with H2O2 to form monoperoxo and diperoxo complexes, used as a characteristic qualitative detection test for vanadium"),
            ("Peroxotitanate complex formed with H2O2 in dilute H2SO4", "III", "Intense yellow-orange coloration due to [Ti(O2)(OH)(H2O)4]⁺, used for sensitive spectrophotometric determination of Titanium", "Addition of H2O2 to acidic Ti(IV) solutions forms an intensely colored peroxo complex whose absorbance at 410 nm obeys Beer's law over a wide concentration range"),
        ], "C"
    ))

    # Q60 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_060", t, "advanced",
        "Match the Polyoxometalates and Molybdenum/Tungsten cluster species in List I with their structural features in List II:",
        [
            ("Ammonium phosphomolybdate ((NH4)3[PMo12O40]·xH2O)", "II", "Canary-yellow precipitate formed by treating orthophosphate with ammonium molybdate in concentrated HNO3", "Classic qualitative test for phosphate: HPO4²⁻ + 12MoO4²⁻ + 3NH4⁺ + 23H⁺ -> (NH4)3[PMo12O40] + 12H2O; confirms presence of PO4³⁻"),
            ("Keggin polyanion framework ([PMo12O40]³⁻)", "IV", "Centrally located PO4 tetrahedron surrounded by four Mo3O13 triplets composed of edge- and corner-sharing MoO6 octahedra", "Has Td point group symmetry; all 12 molybdenum atoms occupy distorted octahedral environments with Mo in its maximum +6 oxidation state"),
            ("Molybdenum Blue (colloidal mixed-valence oxide)", "I", "Formed by mild reduction of acidified molybdate solutions; intense blue color arises from inter-valence Mo(V) -> Mo(VI) charge transfer", "Reducing acidified Mo(VI) with Sn²⁺, SO2, or ascorbic acid yields a complex giant wheel/cluster polyoxomolybdate containing localized Mo(V) and Mo(VI) centers"),
            ("Tungsten Bronzes (e.g., NaxWO3 where 0 < x < 1)", "III", "Non-stoichiometric interstitial compounds of WO3 and alkali metals exhibiting metallic luster, high conductivity, and vibrant colors", "Electrons donated by intercalated Na atoms enter the empty 5d conduction band of the WO3 host lattice, producing metallic conduction and striking golden colors"),
        ], "D"
    ))

    return qs

get_questions = get_dblock_questions
