import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_pblock2_questions():
    qs = []
    t = "p-Block Elements Group 15 to 18"

    # =========================================================================
    # BEGINNER (chem_ioc2_021 to chem_ioc2_024)
    # =========================================================================

    # Q21 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_021", t, "beginner",
        "Match the oxoacids of Phosphorus in List I with their basicity and structural characteristics in List II:",
        [
            ("Hypophosphorous acid (H3PO2)", "III", "Monobasic acid containing one P-OH bond and two P-H reducing bonds", "H3PO2 has one ionizable -OH group and two non-ionizable P-H bonds that impart strong reducing properties (e.g., reducing AgNO3 to metallic Ag)"),
            ("Orthophosphorous acid (H3PO3)", "I", "Dibasic acid containing two P-OH bonds and one P-H reducing bond", "H3PO3 has two ionizable -OH groups and one P-H bond; it ionizes in two stages with basicity = 2 and acts as a moderate reducing agent"),
            ("Orthophosphoric acid (H3PO4)", "IV", "Tribasic non-reducing acid containing three P-OH bonds and one P=O double bond", "H3PO4 has three ionizable -OH groups, zero P-H bonds, forms three series of salts (primary, secondary, tertiary), and is non-reducing"),
            ("Pyrophosphoric acid (H4P2O7)", "II", "Tetrabasic acid containing four P-OH bonds and one bridging P-O-P linkage", "Formed by condensation of two H3PO4 molecules with loss of water: 2 H3PO4 -> H4P2O7 + H2O, possessing a central P-O-P bridge and 4 ionizable P-OH groups"),
        ], "A"
    ))

    # Q22 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_022", t, "beginner",
        "Match the allotropes of Phosphorus and Sulfur in List I with their physical/chemical characteristics in List II:",
        [
            ("White Phosphorus (P4)", "IV", "Discrete tetrahedral P4 molecules with 60° bond angles, severe angular strain, and chemiluminescence in air", "White phosphorus consists of discrete P4 tetrahedra with PPP angles of 60° resulting in severe ring strain, high reactivity, insolubility in water, and glowing in the dark"),
            ("Red Phosphorus", "II", "Polymeric chains of P4 tetrahedra linked by P-P bonds, insoluble in CS2, non-poisonous, and stable in air", "Formed by heating white phosphorus at 573 K in an inert atmosphere; its polymeric cross-linked structure makes it significantly less reactive and non-toxic"),
            ("Rhombic Sulfur (α-sulfur)", "I", "Crown-shaped puckered S8 rings forming yellow crystals thermodynamically stable below 369 K", "α-sulfur is the most stable allotrope at room temperature, crystallizing in rhombic form consisting of puckered S8 rings with S-S bond distance 204 pm"),
            ("Monoclinic Sulfur (β-sulfur)", "III", "Needle-shaped crystalline allotrope consisting of puckered S8 rings stable above 369 K", "Above the transition temperature (369 K), rhombic sulfur transforms into monoclinic β-sulfur, which also contains puckered S8 rings packed differently"),
        ], "B"
    ))

    # Q23 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_023", t, "beginner",
        "Match the Oxides of Nitrogen in List I with their oxidation states and magnetic/physical states in List II:",
        [
            ("Dinitrogen monoxide (N2O)", "II", "+1 oxidation state; neutral, colorless, linear diamagnetic laughing gas", "N2O is neutral to litmus, isoelectronic with CO2, linear in shape (N=N=O), diamagnetic, and has nitrogen in +1 oxidation state"),
            ("Nitrogen monoxide (NO)", "IV", "+2 oxidation state; neutral, colorless, paramagnetic gas containing an odd electron", "NO has 11 valence electrons; the odd electron resides in a π* antibonding orbital, making monomeric gas paramagnetic, though it dimerizes at low temperatures"),
            ("Nitrogen dioxide (NO2)", "I", "+4 oxidation state; acidic, brown, paramagnetic angular gas that readily dimerizes to colorless N2O4", "NO2 has an odd electron on nitrogen making it brown and paramagnetic; it readily dimerizes via pairing of odd electrons into planar diamagnetic N2O4"),
            ("Dinitrogen pentoxide (N2O5)", "III", "+5 oxidation state; colorless acidic solid that exists in ionic form as [NO2]⁺[NO3]⁻", "In the solid state, N2O5 crystallizes as nitronium nitrate [NO2]⁺[NO3]⁻; it is the acidic anhydride of HNO3 and reacts violently with water"),
        ], "C"
    ))

    # Q24 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_024", t, "beginner",
        "Match the Xenon compounds in List I with their molecular geometries and electron pair distributions in List II:",
        [
            ("Xenon difluoride (XeF2)", "III", "Linear shape with sp³d hybridization having 2 bond pairs and 3 equatorial lone pairs", "Xe has 8 valence electrons; bonding with 2 F atoms leaves 3 lone pairs which occupy the equatorial positions of a trigonal bipyramid to minimize repulsion, yielding a linear F-Xe-F molecule"),
            ("Xenon tetrafluoride (XeF4)", "I", "Square planar shape with sp³d² hybridization having 4 bond pairs and 2 trans lone pairs", "XeF4 has 4 bond pairs and 2 lone pairs arranged octahedrally; the two lone pairs occupy axial positions trans to each other, giving a planar square structure"),
            ("Xenon hexafluoride (XeF6)", "IV", "Distorted octahedral shape with sp³d³ hybridization having 6 bond pairs and 1 stereochemically active lone pair", "XeF6 possesses 7 electron pairs (6 bonding pairs and 1 lone pair); repulsion from the stereochemically active lone pair distorts the octahedral geometry (C3v symmetry)"),
            ("Xenon trioxide (XeO3)", "II", "Trigonal pyramidal shape with sp³ hybridization having 3 bond pairs and 1 lone pair", "XeO3 has 3 Xe=O double bonds and 1 lone pair on xenon, adopting a trigonal pyramidal geometry analogous to NH3 and exhibiting explosive oxidizing properties"),
        ], "D"
    ))

    # =========================================================================
    # INTERMEDIATE (chem_ioc2_025 to chem_ioc2_032)
    # =========================================================================

    # Q25 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_025", t, "intermediate",
        "Match the oxoacids of Sulfur in List I with their bonding features and oxidation states in List II:",
        [
            ("Sulfurous acid (H2SO3)", "III", "Sulfur in +4 oxidation state; dibasic reducing acid containing one lone pair on sulfur", "H2SO3 contains two S-OH bonds, one S=O bond, and one lone pair on sulfur (+4 state), making it a reducing agent that easily oxidizes to sulfate"),
            ("Sulfuric acid (H2SO4)", "I", "Sulfur in +6 oxidation state; high-boiling dibasic acid containing two S-OH and two S=O bonds", "Known as oil of vitriol, H2SO4 has tetrahedral geometry around S(+6) with two S=O double bonds (pπ-dπ) and two ionizable S-OH groups"),
            ("Pyrosulfuric acid / Oleum (H2S2O7)", "IV", "Sulfur in +6 oxidation state; contains an S-O-S bridge formed by condensation of two H2SO4 molecules", "H2S2O7 is formed by absorbing SO3 in concentrated H2SO4; its structure contains two tetrahedral SO3 groups linked through an oxygen bridge: HO-SO2-O-SO2-OH"),
            ("Peroxodisulfuric acid / Marshall's acid (H2S2O8)", "II", "Sulfur in +6 oxidation state; contains a peroxy (-O-O-) bridge connecting two sulfonic acid groups", "In H2S2O8, two -SO3H groups are linked by an -O-O- peroxy bond: HO-SO2-O-O-SO2-OH; the peroxy oxygen atoms have oxidation number -1, keeping sulfur in +6"),
        ], "A"
    ))

    # Q26 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_026", t, "intermediate",
        "Match the Halogen properties and anomalies in List I with their correct orders and underlying causes in List II:",
        [
            ("Negative electron gain enthalpy magnitude order: Cl > F > Br > I", "IV", "Due to compact 2p subshell in fluorine causing strong interelectronic repulsions", "The small size of the 2p orbitals in fluorine leads to high electron-electron repulsions when an incoming electron is added, making Cl release more energy upon electron capture"),
            ("Bond dissociation enthalpy order: Cl2 > Br2 > F2 > I2", "I", "Due to intense lone pair-lone pair repulsions in the extremely compact F2 molecule", "Non-bonding electron pairs on adjacent fluorine atoms repel each other strongly across the short 142 pm F-F bond, dramatically weakening the F-F bond compared to Cl2 and Br2"),
            ("Oxidizing power order: F2 > Cl2 > Br2 > I2", "II", "Governed by very low bond dissociation enthalpy and exceptionally large hydration enthalpy of F⁻", "Standard reduction potential E° is dictated by the thermodynamic cycle: sublimation/atomization, ionization/electron gain, and hydration. The high hydration enthalpy and low bond energy make F2 the strongest oxidant"),
            ("Boiling point order of hydrogen halides: HF > HI > HBr > HCl", "III", "Due to strong intermolecular hydrogen bonding in HF, followed by van der Waals forces scaling with molecular weight", "HF molecules associate into zigzag chains via strong F-H···F hydrogen bonds, giving HF an anomalously high boiling point (293 K) compared to other hydrogen halides"),
        ], "B"
    ))

    # Q27 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_027", t, "intermediate",
        "Match the Interhalogen compounds in List I with their hybridization, geometry, and lone pair counts in List II:",
        [
            ("Iodine heptafluoride (IF7)", "II", "sp³d³ hybridization; pentagonal bipyramidal geometry with 0 lone pairs on central iodine", "IF7 has 7 bond pairs and 0 lone pairs on iodine; the 5 equatorial F atoms lie in a plane (72° angles) with 2 axial F atoms perpendicular (90° angles)"),
            ("Bromine pentafluoride (BrF5)", "IV", "sp³d² hybridization; square pyramidal geometry with 1 lone pair on central bromine", "BrF5 has 5 bond pairs and 1 lone pair; the lone pair occupies one octahedral vertex, causing slight distortion of the four basal fluorine atoms away from the lone pair"),
            ("Chlorine trifluoride (ClF3)", "I", "sp³d hybridization; T-shaped geometry with 2 lone pairs occupying equatorial positions", "ClF3 has 3 bond pairs and 2 lone pairs; equatorial placement of the two lone pairs in the trigonal bipyramid minimizes 90° lone pair-bond pair repulsions, giving a bent T-shape"),
            ("Iodine monochloride (ICl)", "III", "sp³ hybridized diatomic interhalogen; polar electrophilic chlorinating reagent in organic reactions", "ICl is a reddish-brown liquid with a dipole moment due to EN difference (I=2.5, Cl=3.0); it reacts with alkenes to add I⁺ and Cl⁻ across the double bond"),
        ], "C"
    ))

    # Q28 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_028", t, "intermediate",
        "Match the hydrolysis reactions of Xenon fluorides in List I with their products and reaction types in List II:",
        [
            ("Hydrolysis of Xenon difluoride (XeF2 + H2O)", "II", "Redox reaction yielding Xe gas, HF, and liberating O2 gas: 2XeF2 + 2H2O -> 2Xe + 4HF + O2", "Xe(+2) is reduced to elemental Xe(0) while oxygen in water (-2) is oxidized to O2(0), demonstrating that XeF2 acts as an oxidizing agent in water"),
            ("Hydrolysis of Xenon tetrafluoride (XeF4 + H2O)", "IV", "Disproportionation reaction yielding Xe gas, XeO3, HF, and O2: 6XeF4 + 12H2O -> 4Xe + 2XeO3 + 24HF + 3O2", "Xe(+4) simultaneously disproportionates into elemental Xe(0) and Xe(+6) in XeO3, accompanied by oxidation of some water to O2 gas"),
            ("Complete hydrolysis of Xenon hexafluoride (XeF6 + excess H2O)", "I", "Non-redox hydrolysis yielding explosive white solid XeO3 and HF: XeF6 + 3H2O -> XeO3 + 6HF", "Xe remains in the +6 oxidation state throughout; all six fluorine atoms are replaced by three oxo groups, yielding hazardous crystalline XeO3"),
            ("Partial hydrolysis of Xenon hexafluoride (XeF6 + 1 mol H2O)", "III", "Yields colorless volatile liquid xenon oxytetrafluoride: XeF6 + H2O -> XeOF4 + 2HF", "Partial replacement of two fluorine atoms by one oxygen produces XeOF4 (square pyramidal geometry), which upon further partial hydrolysis gives XeO2F2"),
        ], "D"
    ))

    # Q29 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_029", t, "intermediate",
        "Match the Phosphorus halides and their phase behaviors in List I with their structural descriptions in List II:",
        [
            ("Phosphorus pentachloride (PCl5 in gas phase)", "III", "Trigonal bipyramidal molecule where the two axial P-Cl bonds are longer than the three equatorial bonds", "Axial P-Cl bonds (214 pm) experience greater repulsion from equatorial pairs at 90° than equatorial bonds (202 pm) at 120°, making axial bonds longer and weaker"),
            ("Phosphorus pentachloride (PCl5 in solid state)", "I", "Ionic crystal consisting of tetrahedral [PCl4]⁺ cations and octahedral [PCl6]⁻ anions", "X-ray diffraction reveals solid PCl5 is an ionic solid [PCl4]⁺[PCl6]⁻, explaining its high electrical conductivity in polar non-aqueous solvents"),
            ("Phosphorus pentabromide (PBr5 in solid state)", "IV", "Ionic crystal composed of tetrahedral [PBr4]⁺ cations and discrete Br⁻ anions", "Due to steric crowding of large bromine atoms, the octahedral [PBr6]⁻ cannot form; hence PBr5 solidifies as [PBr4]⁺Br⁻"),
            ("Hydrolysis of Phosphorus trichloride (PCl3 + 3H2O)", "II", "Yields dibasic phosphorous acid (H3PO3) and dense fumes of hydrogen chloride (HCl)", "PCl3 hydrolyzes smoothly: PCl3 + 3H2O -> H3PO3 + 3HCl; the nucleophilic attack of water on phosphorus displaces chloride ions"),
        ], "A"
    ))

    # Q30 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_030", t, "intermediate",
        "Match the Chlorine oxoacids and chlorine-alkali reactions in List I with their chemical properties in List II:",
        [
            ("Acid strength order: HClO < HClO2 < HClO3 < HClO4", "IV", "Increases with number of terminal oxygen atoms due to greater resonance delocalization of negative charge in conjugate base", "The conjugate base ClO4⁻ has four equivalent resonance structures distributing the negative charge over four oxygen atoms, making it extraordinarily stable and HClO4 a superacid"),
            ("Reaction of Cl2 with cold, dilute NaOH solution", "I", "Disproportionates into sodium chloride and sodium hypochlorite: Cl2 + 2NaOH -> NaCl + NaOCl + H2O", "Chlorine (0) is simultaneously reduced to Cl⁻ (-1) in NaCl and oxidized to ClO⁻ (+1) in NaOCl (household bleach)"),
            ("Reaction of Cl2 with hot, concentrated NaOH solution", "II", "Disproportionates into sodium chloride and sodium chlorate: 3Cl2 + 6NaOH -> 5NaCl + NaClO3 + 3H2O", "At elevated temperatures, hypochlorite is unstable and further oxidizes to chlorate, yielding NaCl and NaClO3 with chlorine in +5 state"),
            ("Bleaching action of bleaching powder (CaOCl2)", "III", "Caused by nascent oxygen liberated from hypochlorite ions: OCl⁻ -> Cl⁻ + [O]", "In the presence of moisture and dilute acid, bleaching powder releases hypochlorous acid, which decomposes to liberate nascent oxygen, bleaching colored organic matter by oxidation"),
        ], "B"
    ))

    # Q31 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_031", t, "intermediate",
        "Match the reactions of metals with Nitric acid in List I with their specific nitrogen reduction products in List II:",
        [
            ("Reaction of Copper metal with dilute HNO3 (~1:1)", "II", "Produces nitric oxide (NO) gas and copper(II) nitrate: 3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O", "Dilute HNO3 oxidizes copper to Cu²⁺ while nitrogen (+5) is reduced by 3 units to colorless nitric oxide NO (+2)"),
            ("Reaction of Copper metal with concentrated HNO3", "IV", "Produces dense brown nitrogen dioxide (NO2) fumes: Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O", "Concentrated HNO3 is a stronger oxidant, oxidizing copper to Cu²⁺ while nitrogen (+5) is reduced by only 1 unit to brown NO2 (+4)"),
            ("Reaction of Zinc metal with dilute HNO3 (~20%)", "I", "Produces nitrous oxide (N2O) gas: 4Zn + 10HNO3 -> 4Zn(NO3)2 + N2O + 5H2O", "More electropositive zinc reduces nitrogen extensively from +5 down to +1 in nitrous oxide (laughing gas N2O)"),
            ("Action of concentrated HNO3 on Iron, Chromium, or Aluminium", "III", "Renders the metals chemically passive due to formation of a thin, insoluble protective oxide film", "The intense oxidizing action of conc. HNO3 forms an impervious, unreactive surface film of metal oxide (e.g., Al2O3, Cr2O3, Fe3O4) that halts further reaction"),
        ], "C"
    ))

    # Q32 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_032", t, "intermediate",
        "Match the Noble gas phenomena and compounds in List I with their scientific descriptions in List II:",
        [
            ("Noble gas clathrate compounds of β-quinol", "II", "Formed by Ar, Kr, and Xe trapped in cavities of hydrogen-bonded host lattices without chemical bonds", "Host quinol molecules crystallize into a cage framework with cavities ~4 Å wide that can trap Ar, Kr, or Xe atoms; small He and Ne escape easily"),
            ("Neil Bartlett's discovery of the first noble gas compound", "IV", "Noticed that PtF6 oxidizes O2 to O2⁺[PtF6]⁻ and reasoned that Xe has almost the identical first ionization enthalpy (1170 kJ/mol)", "Bartlett realized IE1 of O2 (1175 kJ/mol) was nearly identical to that of Xe (1170 kJ/mol), successfully reacting Xe with PtF6 vapor to obtain orange-yellow Xe⁺[PtF6]⁻"),
            ("Helium-Neon gas laser mixture (~10:1 He:Ne)", "I", "Uses electrical discharge to excite He atoms, which transfer energy resonantly to Ne atoms emitting red light at 632.8 nm", "Energetic electrons excite He to metastable 2s states; resonant collision transfers energy to 3s levels of Ne, achieving population inversion for 632.8 nm laser transition"),
            ("Liquid Helium-4 below lambda point (2.17 K)", "III", "Transitions into a superfluid state (He-II) exhibiting zero viscosity and infinite thermal conductivity", "Below 2.17 K, liquid ⁴He undergoes Bose-Einstein condensation into a macroscopic quantum superfluid phase capable of creeping up container walls without resistance"),
        ], "D"
    ))

    # =========================================================================
    # ADVANCED (chem_ioc2_033 to chem_ioc2_040)
    # =========================================================================

    # Q33 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_033", t, "advanced",
        "Match the advanced sulfur and phosphorus oxoacids in List I with their structural linkages and oxidation states in List II:",
        [
            ("Peroxomonosulfuric acid / Caro's acid (H2SO5)", "III", "Sulfur in +6 oxidation state; contains one peroxy (-O-O-) group bonded to sulfur and hydrogen", "Structure is HO-SO2-O-O-H; contains one peroxy linkage where oxygens have -1 state, keeping sulfur in its maximum +6 oxidation state"),
            ("Dithionic acid (H2S2O6)", "I", "Sulfur in +5 oxidation state; contains a direct S-S single bond with no peroxy or bridging oxygen", "Structure is HO-SO2-SO2-OH; the two tetrahedral sulfur atoms are directly linked by an S-S bond (2.15 Å) with no bridging oxygen, giving S an oxidation state of +5"),
            ("Hypophosphoric acid (H4P2O6)", "IV", "Phosphorus in +4 oxidation state; tetrabasic acid containing a direct P-P single bond", "Structure is (HO)2(O)P-P(O)(OH)2; contains four ionizable P-OH groups and a direct P-P bond, resulting in a +4 formal oxidation state for phosphorus"),
            ("Thiosulfuric acid (H2S2O3)", "II", "Contains two sulfur atoms in unequal oxidation states (+5 and -1, or +6 and -2) linked via S=S", "One oxygen of sulfuric acid is replaced by a terminal sulfur atom; treatment with mineral acids precipitates elemental sulfur and releases SO2 gas"),
        ], "A"
    ))

    # Q34 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_034", t, "advanced",
        "Match the polyhalide and interhalogen ions in List I with their VSEPR geometries and lone pair placements in List II:",
        [
            ("Triiodide ion ([I3]⁻)", "IV", "Linear geometry with sp³d hybridization having 3 lone pairs in the equatorial plane", "Central iodine has 2 bonding pairs and 3 lone pairs; placing all 3 lone pairs in equatorial positions of a trigonal bipyramid minimizes repulsions, yielding a strictly linear [I-I-I]⁻ ion"),
            ("Tetrachloroiodate(III) ion ([ICl4]⁻)", "I", "Square planar geometry with sp³d² hybridization having 2 lone pairs in trans axial positions", "Central iodine has 4 bond pairs and 2 lone pairs; the lone pairs occupy trans positions of an octahedron, resulting in a centrosymmetric square planar ion"),
            ("Dichloroiodate(I) ion ([ICl2]⁻)", "II", "Linear geometry with sp³d hybridization having 3 lone pairs in equatorial positions", "Isoelectronic with [I3]⁻, central iodine is surrounded by 2 bond pairs to chlorine and 3 equatorial lone pairs, adopting linear geometry"),
            ("Tetrafluorobromate(III) ion ([BrF4]⁻)", "III", "Square planar geometry with sp³d² hybridization having 2 lone pairs trans to each other", "Central bromine has 7 + 4 + 1 = 12 valence electrons (6 pairs: 4 bonding, 2 lone pairs); the lone pairs occupy trans axial sites, giving a square planar shape"),
        ], "B"
    ))

    # Q35 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_035", t, "advanced",
        "Match the Nitrogen redox species and tests in List I with their electronic mechanisms and descriptions in List II:",
        [
            ("Brown ring complex ([Fe(H2O)5(NO)]SO4)", "II", "Iron is in +1 oxidation state (3d⁷) with NO coordinated as a nitrosonium cation (NO⁺), exhibiting μ_eff ≈ 3.87 BM", "In the brown ring test, electron transfer occurs from NO to Fe²⁺ yielding Fe⁺ (3d⁷, t2g⁵ eg²) and NO⁺; three unpaired electrons give a magnetic moment of ~3.87 BM"),
            ("Nitrous acid (HNO2) dual redox behavior", "IV", "Oxidizes I⁻ to I2 (acting as oxidizing agent) while reducing acidified KMnO4 to Mn²⁺ (acting as reducing agent)", "With nitrogen in intermediate +3 oxidation state, HNO2 is oxidized to HNO3 (+5) by strong oxidants like KMnO4 and reduced to NO (+2) by reductants like KI"),
            ("Hydrazoic acid (HN3) and Azide ion (N3⁻)", "I", "HN3 is a weak, explosive acid (pKa ≈ 4.7); N3⁻ is a linear, centrosymmetric 16-valence-electron species isoelectronic with CO2", "Azide ion [N=N=N]⁻ is stabilized by resonance between [:N≡N-N:]²⁻, [N=N=N]⁻, and [:N-N≡N:]²⁻, with equal N-N bond lengths of 1.16 Å"),
            ("Hydrazine (N2H4) reducing behavior", "III", "Bifunctional base and powerful reductant that reduces Ag⁺ to metallic mirror and Cu²⁺ to Cu2O/Cu without leaving ionic ash", "N2H4 is oxidized cleanly to inert N2 gas and water: N2H4 + 4Ag⁺ + 4OH⁻ -> N2 + 4Ag + 4H2O; its oxidation leaves no contaminating ionic byproducts"),
        ], "C"
    ))

    # Q36 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_036", t, "advanced",
        "Match the reactions of Xenon fluorides with Lewis acids/bases in List I with their ionic products and geometries in List II:",
        [
            ("Reaction of XeF2 with fluoride ion acceptors like PF5 or SbF5", "III", "Acts as a fluoride donor yielding [XeF]⁺[PF6]⁻ or [XeF]⁺[SbF6]⁻ containing the linear/bent [XeF]⁺ cation", "XeF2 readily transfers F⁻ to strong Lewis acids: XeF2 + PF5 -> [XeF]⁺[PF6]⁻; the [XeF]⁺ cation is stabilized by the non-coordinating fluoroanion"),
            ("Reaction of XeF6 with strong fluoride ion acceptors like SbF5 (1:1 ratio)", "I", "Acts as a fluoride donor yielding [XeF5]⁺[SbF6]⁻ containing the square pyramidal [XeF5]⁺ cation", "XeF6 transfers F⁻ to SbF5 forming [XeF5]⁺; the [XeF5]⁺ cation has 5 bond pairs and 1 lone pair on xenon, adopting a square pyramidal geometry with C4v symmetry"),
            ("Reaction of XeF6 with alkali metal fluorides MF (M = Cs, Rb)", "IV", "Acts as a fluoride acceptor yielding octafluoroxenate precursor salts M⁺[XeF7]⁻", "XeF6 acts as a Lewis acid toward hard fluoride donors: XeF6 + CsF -> Cs[XeF7]; the [XeF7]⁻ anion contains 7 bond pairs and 1 lone pair"),
            ("Thermal decomposition of 2 Cs[XeF7] at ~300 °C", "II", "Disproportionates into Cs2[XeF8] (containing square antiprismatic [XeF8]²⁻) and volatile XeF6", "Heating Cs[XeF7] drives off XeF6: 2Cs[XeF7] -> Cs2[XeF8] + XeF6; the resulting [XeF8]²⁻ ion adopts a regular square antiprismatic geometry (D4d symmetry)"),
        ], "D"
    ))

    # Q37 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_037", t, "advanced",
        "Match the advanced Ozone and liquid Sulfur phenomena in List I with their chemical mechanisms in List II:",
        [
            ("Reaction of Ozone with dry solid Iodine", "IV", "Oxidizes dry I2 to yellow powdered iodine tetroxide / iodic iodate (I4O9 or I(IO3)3)", "In the absence of water, ozone oxidizes dry iodine gas or solid directly to yellow hygroscopic I4O9: 2I2 + 9O3 -> 2I4O9 + 9O2, which decomposes on warming to I2O5"),
            ("Quantitative estimation of Ozone using neutral buffered KI solution", "II", "Liberates stoichiometric I2 from KI buffered with borate (pH 9.2), titrated against standard Na2S2O3", "Ozone reacts with iodide: O3 + 2I⁻ + H2O -> O2 + I2 + 2OH⁻; the liberated iodine is quantitatively titrated with sodium thiosulfate using starch indicator"),
            ("Viscosity surge of liquid Sulfur between 160 °C and 180 °C", "I", "Rupture of S8 crown rings into open diradicals (·S-S6-S·) that polymerize into long tangled macromolecular chains", "At 159.4 °C (the λ-transition), thermal energy breaks S-S bonds of S8 rings; the resulting diradicals polymerize into chains exceeding 100,000 sulfur atoms, dramatically increasing viscosity"),
            ("Reaction of Ozone with Lead(II) sulfide (PbS)", "III", "Oxidizes black lead sulfide to white lead sulfate: PbS + 4O3 -> PbSO4 + 4O2", "Used historically in restoring blackened lead-containing oil paintings where PbS formed from atmospheric H2S is converted back to white PbSO4"),
        ], "A"
    ))

    # Q38 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_038", t, "advanced",
        "Match the Pseudohalogens and pseudohalides in List I with their chemical similarities to halogens in List II:",
        [
            ("Cyanogen ((CN)2)", "IV", "Symmetrical gas N≡C-C≡N that disproportionates in aqueous alkali into cyanide (CN⁻) and cyanate (CNO⁻)", "Cyanogen mimics halogens closely: (CN)2 + 2OH⁻ -> CN⁻ + CNO⁻ + H2O, in exact analogy to Cl2 + 2OH⁻ -> Cl⁻ + OCl⁻ + H2O"),
            ("Thiocyanogen ((SCN)2)", "I", "Unstable pseudohalogen synthesized by oxidizing lead(II) thiocyanate with bromine in cold anhydrous ether", "Pb(SCN)2 + Br2 -> PbBr2 + (SCN)2; thiocyanogen behaves as a pseudohalogen with oxidizing power intermediate between bromine and iodine"),
            ("Precipitation of silver pseudohalides (AgCN, AgSCN)", "II", "Form curdy white insoluble precipitates that dissolve in excess cyanide or thiosulfate via complexation", "Like AgCl, AgCN and AgSCN have low solubility products and dissolve in excess CN⁻ to form linear dicyanoargentate(I) [Ag(CN)2]⁻"),
            ("Iron(III) thiocyanate complex ([Fe(H2O)5(SCN)]²⁺)", "III", "Forms an intensely blood-red complex ion used as an ultrasensitive qualitative test for Fe³⁺", "Fe³⁺ coordinates with thiocyanate ion SCN⁻ through nitrogen/sulfur to produce blood-red [Fe(SCN)]²⁺ (λmax ≈ 480 nm) with very high extinction coefficient"),
        ], "B"
    ))

    # Q39 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_039", t, "advanced",
        "Match the condensed metaphosphoric acids and Calgon in List I with their structural formulas and functions in List II:",
        [
            ("Cyclotrimetaphosphoric acid ((HPO3)3)", "II", "Cyclic trimer containing a puckered 6-membered P3O3 ring with three bridging P-O-P bonds", "Consists of three corner-sharing PO4 tetrahedra in a ring where each phosphorus is bonded to one terminal =O, one -OH, and two bridging oxygens in the P3O3 ring"),
            ("Pyrophosphoric acid (H4P2O7) preparation", "IV", "Formed by thermal dehydration of pure orthophosphoric acid at ~250 °C: 2H3PO4 -> H4P2O7 + H2O", "Heating H3PO4 gently expels water, linking two phosphate tetrahedra through a single shared oxygen atom to form tetrabasic pyrophosphoric acid"),
            ("Calgon / Sodium hexametaphosphate ((NaPO3)6)", "I", "Glassy polymeric polyphosphate used for domestic and industrial water softening by sequestrating Ca²⁺ and Mg²⁺", "Calgon is actually a complex mixture of long-chain sodium polyphosphates (NaPO3)n with n ≈ 12-14, colloquially termed hexametaphosphate"),
            ("Mechanism of calcium ion sequestration by Calgon", "III", "Forms a highly soluble stable complex anion: [Na4P6O18]²⁻ + Ca²⁺ -> [Na2CaP6O18]²⁻ + 2Na⁺", "The hard water divalent cation Ca²⁺ displaces two sodium ions from the polyphosphate ring/chain, remaining locked inside a soluble chelate complex that cannot form scum with soap"),
        ], "C"
    ))

    # Q40 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_040", t, "advanced",
        "Match the highest-oxidation-state Noble Gas compounds in List I with their synthesis, geometry, and properties in List II:",
        [
            ("Krypton difluoride (KrF2)", "III", "Volatile linear solid prepared by electric discharge/photolysis at -196 °C; exceptionally powerful fluorinating agent capable of oxidizing Au to Au(V)", "KrF2 is thermodynamically unstable (ΔHf° = +60 kJ/mol); it oxidizes gold metal to [KrF]⁺[AuF6]⁻ and then AuF5, and oxidizes Xe to XeF6"),
            ("Xenon tetroxide (XeO4)", "I", "Volatile yellow explosive gas with regular tetrahedral geometry (sp³) containing four Xe=O double bonds", "Formed by treating sodium perxenate with concentrated H2SO4: Na4XeO6 + 2H2SO4 -> XeO4 + 2Na2SO4 + 2H2O; it contains xenon in its maximum +8 state and is violently explosive"),
            ("Perxenate anion ([XeO6]⁴⁻)", "IV", "Centrosymmetric regular octahedral anion (sp³d²) containing Xe in +8 oxidation state", "Prepared by disproportionation of XeO3 in strongly alkaline solution: 2XeO3 + 4OH⁻ -> [XeO6]⁴⁻ + Xe + O2 + 2H2O; it is an octahedral species and a fierce oxidizing agent"),
            ("Electrophilic fluorination of Benzene by XeF2", "II", "Reacts under mild conditions without catalyst to yield fluorobenzene (C6H5F) and gaseous Xe", "XeF2 acts as a mild, selective electrophilic source of 'F⁺': C6H6 + XeF2 -> C6H5F + HF + Xe, avoiding overfluorination or ring degradation"),
        ], "D"
    ))

    return qs

get_questions = get_pblock2_questions
