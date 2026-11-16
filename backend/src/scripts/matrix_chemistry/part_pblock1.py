import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_pblock1_questions():
    qs = []
    t = "p-Block Elements Group 13 and 14"

    # =========================================================================
    # BEGINNER (chem_ioc2_001 to chem_ioc2_004)
    # =========================================================================

    # Q1 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_001", t, "beginner",
        "Match the Group 13 elements in List I with their prominent oxidation states or stability characteristics in List II:",
        [
            ("Boron", "III", "Forms predominantly +3 covalent compounds due to high sum of first three ionization enthalpies", "Boron is small with very high ionization enthalpies, forming exclusively covalent +3 compounds such as BF3 and B2H6"),
            ("Thallium", "I", "+1 oxidation state is much more stable than +3 due to the inert pair effect", "Due to poor shielding by 4f and 5d electrons, the 6s² pair remains unshared (inert pair effect), making Tl+ significantly more stable than Tl3+"),
            ("Gallium", "IV", "Exhibits both +1 and +3 oxidation states, with +3 being the standard stable state in aqueous solutions", "Gallium shows both +1 and +3 states; in solid GaCl2 it exists as mixed valence Ga+[GaCl4]-, but Ga(III) is stable in aqueous solution"),
            ("Aluminium", "II", "Exhibits exclusively +3 oxidation state and forms an amphoteric oxide", "Aluminium loses all three valence electrons readily to form Al3+ compounds, and its oxide Al2O3 is amphoteric, reacting with both acids and bases"),
        ], "A"
    ))

    # Q2 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_002", t, "beginner",
        "Match the allotropes and forms of Carbon in List I with their structural or physical characteristics in List II:",
        [
            ("Diamond", "IV", "Each carbon is sp³ hybridized forming a rigid 3D tetrahedral network with no free mobile electrons", "In diamond, every carbon is covalently bonded to four other carbons in a tetrahedral arrangement with sp³ hybridization, making it extremely hard and an electrical insulator"),
            ("Graphite", "II", "Hexagonal planar layers of sp² carbons with delocalized π-electrons and weak van der Waals interlayer forces", "Graphite consists of 2D hexagonal planar sheets of sp² hybridized carbons separated by 3.35 Å held by van der Waals forces, acting as a lubricant and good electrical conductor"),
            ("Buckminsterfullerene (C60)", "I", "Soccer-ball shaped cage consisting of exactly 20 six-membered rings and 12 five-membered rings", "C60 possesses Ih icosahedral symmetry composed of 20 hexagonal and 12 pentagonal rings, where no two pentagons share an edge (isolated pentagon rule)"),
            ("Carbon monoxide (CO)", "III", "Neutral diatomic gas possessing a coordinate triple bond with carbon acting as a strong π-acceptor ligand", "CO has a formal C≡O triple bond with a lone pair on carbon, is neutral to litmus, highly toxic by binding to hemoglobin, and acts as a strong field ligand"),
        ], "B"
    ))

    # Q3 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_003", t, "beginner",
        "Match the hydrides and halides of Group 13 in List I with their structural/bonding descriptions in List II:",
        [
            ("Diborane (B2H6)", "II", "Contains two 3-center-2-electron (3c-2e) bridging B-H-B bonds and four terminal 2c-2e B-H bonds", "Diborane has two bridging hydrogens forming banana-shaped 3c-2e bonds and four coplanar terminal 2c-2e B-H bonds"),
            ("Aluminium chloride (Al2Cl6 in vapor)", "IV", "Dimeric species containing two 3-center-4-electron chlorine bridge bonds formed by coordinate donation", "In vapor phase and nonpolar solvents, AlCl3 dimerizes to Al2Cl6 where two chlorine atoms donate lone pairs into the vacant 3p orbitals of aluminium"),
            ("Boron trifluoride (BF3)", "I", "Planar trigonal monomer stabilized by strong 2pπ-2pπ back-bonding from fluorine to boron", "In BF3, effective 2pπ-2pπ overlap between filled 2p of fluorine and vacant 2p of boron partially satisfies electron deficiency, keeping it monomeric"),
            ("Borax (Na2B4O7·10H2O)", "III", "Contains the fundamental tetranuclear polyborate anionic unit [B4O5(OH)4]²⁻", "Borax crystals actually contain [B4O5(OH)4]²⁻ units with two tetrahedral BO4 and two planar BO3 units, formulated correctly as Na2[B4O5(OH)4]·8H2O"),
        ], "C"
    ))

    # Q4 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_004", t, "beginner",
        "Match the Group 14 oxides and oxo-species in List I with their chemical properties in List II:",
        [
            ("Carbon dioxide (CO2)", "III", "Acidic linear gas with sp hybridization that turns lime water milky due to CaCO3 precipitation", "CO2 is a linear non-polar molecule with sp hybridized carbon; it dissolves in water to form H2CO3 and reacts with Ca(OH)2 to precipitate white CaCO3"),
            ("Silicon dioxide (SiO2)", "I", "Giant 3D network covalent solid where each Si is tetrahedrally bonded to four bridging oxygen atoms", "Silica (quartz) forms a continuous 3D network of corner-sharing SiO4 tetrahedra where each Si is bonded to 4 O and each O bridges two Si atoms"),
            ("Lead(II) oxide (PbO)", "IV", "Amphoteric oxide displaying litharge and massicot polymorphic forms", "PbO exists as red tetragonal litharge and yellow orthorhombic massicot; it dissolves in both acids (giving Pb²⁺) and hot alkali (giving plumbite [Pb(OH)4]²⁻)"),
            ("Carbon suboxide (C3O2)", "II", "Malodorous linear gas having structure O=C=C=C=O prepared by dehydrating malonic acid with P4O10", "C3O2 is synthesized by dehydrating CH2(COOH)2 using P4O10 at 140 °C, possessing cumulative double bonds and sp hybridized carbon atoms"),
        ], "D"
    ))

    # =========================================================================
    # INTERMEDIATE (chem_ioc2_005 to chem_ioc2_012)
    # =========================================================================

    # Q5 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_005", t, "intermediate",
        "Match the Boron compounds/reactions in List I with their characteristics or reaction products in List II:",
        [
            ("Heating Borax strongly in a flame", "III", "Swells into a glassy bead consisting of sodium metaborate (NaBO2) and boric anhydride (B2O3)", "Upon heating, borax loses water of crystallization with swelling and melts into a clear transparent glassy bead of NaBO2 + B2O3"),
            ("Reaction of B2H6 with excess ammonia at high temperature (~200 °C)", "I", "Produces borazine (B3N3H6), often referred to as inorganic benzene", "A 1:2 molar ratio of B2H6 and NH3 heated to ~200 °C produces the cyclic planar trimer borazine (B3N3H6)"),
            ("Hydrolysis of BCl3 with water", "IV", "Undergoes complete and rapid hydrolysis to yield orthoboric acid (H3BO3) and HCl", "BCl3 reacts violently with water via nucleophilic attack of H2O on the empty 2p orbital of boron, producing B(OH)3 and HCl"),
            ("Orthoboric acid in aqueous medium", "II", "Acts as a weak monobasic Lewis acid by accepting OH⁻ from H2O rather than donating a proton", "B(OH)3 does not release its own proton; instead, it acts as a Lewis acid: B(OH)3 + 2H2O <=> [B(OH)4]⁻ + H3O⁺ (pKa = 9.25)"),
        ], "A"
    ))

    # Q6 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_006", t, "intermediate",
        "Match the Boron trihalides in List I with their Lewis acidity order, bond characteristics, or features in List II:",
        [
            ("Lewis acid strength order: BF3 < BCl3 < BBr3 < BI3", "IV", "Explained by progressively weaker (2p-np)π back-bonding as the halogen size increases", "In BF3, strong 2pπ-2pπ back-bonding relieves electron deficiency on boron; larger halogens (3p, 4p, 5p) have poor overlap, leaving boron more electron-deficient"),
            ("Reaction of BF3 with aqueous water", "I", "Forms fluoroboric acid (H[BF4]) and boric acid (H3BO3) rather than pure HF", "BF3 initially hydrolyzes to B(OH)3 and HF, but unreacted BF3 immediately coordinates with HF to form strong fluoroboric acid H[BF4]"),
            ("B-F bond length in BF3 (1.30 Å) compared to [BF4]⁻ (1.43 Å)", "II", "Significantly shorter in BF3 due to partial double bond character from 2pπ-2pπ back-bonding", "Back-donation of fluorine lone pairs into the vacant 2p orbital of boron introduces partial double bond character, shortening the B-F bond in planar BF3 compared to tetrahedral [BF4]⁻"),
            ("Adduct formation of BF3 with diethyl ether", "III", "Forms a stable distillable liquid etherate (C2H5)2O:->BF3", "BF3 readily acts as a Lewis acid towards Lewis bases like Et2O, forming boron trifluoride diethyl etherate with tetrahedral geometry around boron"),
        ], "B"
    ))

    # Q7 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_007", t, "intermediate",
        "Match the structural silicates in List I with their characteristic silicate anions and shared oxygen counts in List II:",
        [
            ("Orthosilicates (e.g., Phenacite Be2SiO4, Forsterite Mg2SiO4)", "II", "Isolated discrete SiO4⁴⁻ tetrahedral units sharing zero oxygen atoms", "Orthosilicates contain individual, unshared [SiO4]⁴⁻ tetrahedra where no corners are shared between tetrahedra"),
            ("Pyrosilicates (e.g., Thortveitite Sc2Si2O7)", "IV", "Si2O7⁶⁻ units formed by two SiO4 tetrahedra sharing exactly one oxygen vertex", "Pyrosilicates contain [Si2O7]⁶⁻ units where two tetrahedral SiO4 units share a single bridging oxygen atom"),
            ("Cyclic/Ring silicates (e.g., Beryl Be3Al2Si6O18)", "I", "Si6O18¹²⁻ ring units formed by sharing two oxygen atoms per tetrahedral unit", "In beryl, six SiO4 tetrahedra share two corners each to form a closed cyclic [Si6O18]¹²⁻ ring anion"),
            ("Sheet/Phyllosilicates (e.g., Talc, Kaolinite, Micas)", "III", "(Si2O5)n²ⁿ⁻ 2D sheets formed by sharing three oxygen vertices of each tetrahedron", "Sheet silicates share three corners of each SiO4 tetrahedron, creating an infinite 2D hexagonal network with repeating formula (Si2O5²⁻)n"),
        ], "C"
    ))

    # Q8 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_008", t, "intermediate",
        "Match the organosilicon monomers and silicones in List I with their polymer products and functions in List II:",
        [
            ("Dimethyldichlorosilane ((CH3)2SiCl2) upon complete hydrolysis and condensation", "II", "Yields straight-chain linear silicone polymers (silicone oils and elastomers)", "Hydrolysis of (CH3)2SiCl2 produces (CH3)2Si(OH)2, which undergoes intermolecular condensation polymerization to form linear poly(dimethylsiloxanes)"),
            ("Methyltrichlorosilane (CH3SiCl3) upon complete hydrolysis and condensation", "IV", "Yields highly cross-linked 3D silicone network resins", "Hydrolysis of trifunctional CH3SiCl3 gives CH3Si(OH)3, which undergoes three-dimensional condensation creating cross-linked silicone resins"),
            ("Trimethylchlorosilane ((CH3)3SiCl) added to the reaction mixture", "I", "Acts as a chain-terminating (chain-stopping) agent to control polymer molecular weight", "Monofunctional (CH3)3SiCl yields (CH3)3SiOH on hydrolysis, which possesses only one condensable -OH group, capping the growing chain end and terminating polymerization"),
            ("Silicones general chemical characteristics", "III", "High thermal stability, water repellency, and resistance to chemical oxidation due to strong Si-O-Si backbone and hydrophobic alkyl groups", "The high Si-O bond energy (~452 kJ/mol) combined with surrounding organic nonpolar methyl groups imparts thermal stability and water-repellent (hydrophobic) properties"),
        ], "D"
    ))

    # Q9 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_009", t, "intermediate",
        "Match the Group 14 tetrahalides in List I with their behavior towards hydrolysis and Lewis acidity in List II:",
        [
            ("Carbon tetrachloride (CCl4)", "III", "Completely inert to hydrolysis under normal conditions because carbon lacks accessible d orbitals", "Carbon has no vacant d orbitals in its valence shell (n=2) to accommodate the lone pair from attacking water molecules, rendering CCl4 resistant to hydrolysis"),
            ("Silicon tetrachloride (SiCl4)", "I", "Hydrolyzes rapidly in water to produce orthosilicic acid (H4SiO4) and HCl via expansion of coordination number", "Silicon has vacant 3d orbitals that accept a lone pair from water to form a pentacoordinate intermediate, facilitating rapid stepwise hydrolysis to Si(OH)4"),
            ("Lead(IV) chloride (PbCl4)", "IV", "Thermally unstable, decomposing easily into PbCl2 and Cl2 due to inert pair effect on Pb", "Because Pb(II) is far more stable than Pb(IV) owing to the inert pair effect, PbCl4 readily decomposes into PbCl2 and Cl2 upon mild heating"),
            ("Tin(II) chloride (SnCl2)", "II", "Acts as a powerful reducing agent, converting Fe³⁺ to Fe²⁺ and HgCl2 to white/grey Hg", "Sn²⁺ is readily oxidized to the more stable Sn⁴⁺ state in SnCl4, making SnCl2 a classic reducing agent (e.g., reducing HgCl2 to white Hg2Cl2 and then grey metallic Hg)"),
        ], "A"
    ))

    # Q10 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_010", t, "intermediate",
        "Match the metal carbides in List I with their hydrolysis hydrocarbon products and carbide anion types in List II:",
        [
            ("Aluminium carbide (Al4C3)", "IV", "Hydrolyzes to release methane (CH4); classified as a methanide containing discrete C⁴⁻ ions", "Al4C3 reacts with water according to Al4C3 + 12H2O -> 4Al(OH)3 + 3CH4; it contains isolated C⁴⁻ anions"),
            ("Calcium carbide (CaC2)", "II", "Hydrolyzes to release acetylene (C2H2); classified as an acetylide containing [C≡C]²⁻ ions", "CaC2 reacts with water according to CaC2 + 2H2O -> Ca(OH)2 + C2H2; it contains the diatomic dicarbide ion C2²⁻ with a triple bond"),
            ("Magnesium carbide (Mg2C3)", "I", "Hydrolyzes to release propyne (CH3-C≡CH); classified as an allylide containing [C=C=C]⁴⁻ ions", "Mg2C3 reacts with water according to Mg2C3 + 4H2O -> 2Mg(OH)2 + C3H4 (propyne); it contains the linear [C3]⁴⁻ anion"),
            ("Beryllium carbide (Be2C)", "III", "Hydrolyzes to release methane (CH4); exhibits antifluorite structure containing C⁴⁻ ions", "Be2C reacts with water according to Be2C + 4H2O -> 2Be(OH)2 + CH4, behaving like Al4C3 as a methanide due to the diagonal relationship"),
        ], "B"
    ))

    # Q11 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_011", t, "intermediate",
        "Match the anomalous and diagonal properties of Group 13 and 14 elements in List I with their descriptions in List II:",
        [
            ("Diagonal relationship between Boron and Silicon", "I", "Both form acidic oxides (B2O3 and SiO2), flammable hydrides, and volatile hydrolyzable covalent halides", "Boron and Silicon have similar electronegativities (2.0 and 1.8) and charge-to-radius ratios; both form network covalent oxides that are acidic and covalent halides"),
            ("Anomalous ionization enthalpy trend from Al to Ga", "III", "Ga has a slightly higher first ionization enthalpy than Al due to poor shielding of 3d¹⁰ electrons (d-block contraction)", "The intervention of ten 3d electrons in Ga poorly shields the nuclear charge, causing a contracted atomic radius and higher effective nuclear charge, making IE1(Ga) > IE1(Al)"),
            ("Density trend from Boron to Thallium", "IV", "Shows a dramatic surge from In to Tl due to the addition of 14 poorly shielding 4f electrons (lanthanoid contraction)", "Tl has a huge atomic mass increase combined with a contracted radius from lanthanoid contraction, causing its density (11.85 g/cm³) to jump far above In (7.31 g/cm³)"),
            ("Action of concentrated HNO3 on Aluminium metal", "II", "Renders the metal passive due to the instantaneous formation of an impervious surface film of Al2O3", "Conc. HNO3 is a strong oxidizing agent that oxidizes the outer surface of aluminium to an insoluble protective layer of Al2O3, halting further dissolution"),
        ], "C"
    ))

    # Q12 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_012", t, "intermediate",
        "Match the Group 14 elements in List I with their catenation capacity and allotropic features in List II:",
        [
            ("Carbon", "II", "Exhibits maximum catenation ability due to extraordinarily high C-C single bond energy (~348 kJ/mol)", "The small atomic radius of carbon permits close approach and strong orbital overlap, giving an exceptionally high C-C bond dissociation enthalpy and unparalleled catenation"),
            ("Silicon", "IV", "Shows moderate catenation limited to silanes of formula SinH2n+2 with n up to ~6 to 8", "Si-Si bond energy is significantly lower (~222 kJ/mol) than C-C, so catenation drops off quickly, forming silanes only up to a few silicon atoms"),
            ("Germanium and Tin", "I", "Show very limited catenation; Sn exhibits grey (α, diamond cubic) to white (β, tetragonal) allotropic transformation at 13.2 °C (tin pest)", "At low temperatures (< 13.2 °C), white metallic β-tin crumbles into brittle non-metallic grey α-tin possessing a diamond-like structure (known as tin disease or tin pest)"),
            ("Lead", "III", "Does not exhibit catenation due to very weak Pb-Pb bond energy (~100 kJ/mol)", "Owing to the large atomic radius and diffuse valence orbitals, the Pb-Pb bond is too weak to sustain catenated chains"),
        ], "D"
    ))

    # =========================================================================
    # ADVANCED (chem_ioc2_013 to chem_ioc2_020)
    # =========================================================================

    # Q13 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_013", t, "advanced",
        "Match the characteristics of Borazine (B3N3H6) compared with Benzene (C6H6) in List I with their descriptions in List II:",
        [
            ("Electronegativity difference between B and N", "III", "Causes polar B(δ+)-N(δ-) bonds, rendering borazine far more reactive toward addition reactions than benzene", "Nitrogen is more electronegative than boron (3.0 vs 2.0), making the π-electron cloud localized towards nitrogen and leaving boron electrophilic and nitrogen nucleophilic"),
            ("Addition of 3 moles of HCl to borazine", "I", "Forms B3N3H9Cl3 where Cl attaches to B and H attaches to N", "Due to bond polarity B(δ+)-N(δ-), the electrophile H⁺ attacks the nitrogen atom while the nucleophile Cl⁻ attacks the boron atom, yielding B3N3H9Cl3"),
            ("Hydrolysis of borazine in aqueous solution", "IV", "Yields orthoboric acid (H3BO3) and ammonia (NH3) under mild warming", "Unlike benzene which is inert to water, polar B-N bonds in borazine hydrolyze completely: B3N3H6 + 9H2O -> 3H3BO3 + 3NH3"),
            ("Aromatic resonance stabilization energy", "II", "Significantly lower in borazine (~67 kJ/mol) than in benzene (~152 kJ/mol) due to partial π-electron localization", "Because the π-electrons are polarized toward nitrogen rather than uniformly delocalized as in carbon rings, borazine has less than half the aromatic stabilization energy of benzene"),
        ], "A"
    ))

    # Q14 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_014", t, "advanced",
        "Match the cleavage modes and reactions of Diborane (B2H6) in List I with their reaction mechanisms and products in List II:",
        [
            ("Cleavage of B2H6 with small, hard Lewis bases (e.g., NH3, CH3NH2 at low temperature)", "IV", "Undergoes unsymmetrical cleavage yielding ionic species [H2B(L)2]⁺[BH4]⁻", "Small hard bases attack one boron atom twice, cleaving both bridge bonds unevenly to generate the ionic complex [H2B(NH3)2]⁺[BH4]⁻"),
            ("Cleavage of B2H6 with bulky, soft Lewis bases (e.g., CO, (CH3)3N, THF, PMe3)", "I", "Undergoes symmetrical cleavage yielding monomeric adducts 2 L:->BH3", "Bulky or softer bases coordinate to each boron atom individually, symmetrically cleaving the two bridge bonds to form two molecules of L·BH3 (e.g., 2 H3B:CO or 2 H3B:NMe3)"),
            ("Reaction of B2H6 with alkali metal hydrides (e.g., LiH or NaH in diethyl ether)", "II", "Yields tetrahydroborate salts (e.g., LiBH4 or NaBH4) used as versatile reducing agents", "Hydride ion H⁻ acts as a strong nucleophile, symmetrically cleaving diborane: 2LiH + B2H6 -> 2Li[BH4]"),
            ("Methylation of B2H6 with excess trimethylboron B(CH3)3", "III", "Produces tetramethyldiborane (CH3)4B2H2 leaving bridge hydrogens intact", "Only terminal hydrogens are replaced by methyl groups; bridge hydrogens are essential for holding the dimer together and cannot be replaced by methyl groups without dimer dissociation"),
        ], "B"
    ))

    # Q15 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_015", t, "advanced",
        "Match the higher silicate structures and aluminosilicates in List I with their structural formulas and applications in List II:",
        [
            ("Amphiboles / Double-chain silicates (e.g., Tremolite)", "II", "Infinite double chains with repeating empirical formula (Si4O11)n⁶ⁿ⁻", "Formed by cross-linking two single pyroxene chains such that alternately two and three oxygen vertices per tetrahedron are shared, giving (Si4O11⁶⁻)n"),
            ("Pyroxenes / Single-chain silicates (e.g., Diopside CaMg(SiO3)2)", "IV", "Infinite single chains with repeating empirical formula (SiO3)n²ⁿ⁻", "Formed by each SiO4 tetrahedron sharing two oxygen vertices continuously in a 1D chain, giving (SiO3²⁻)n"),
            ("Zeolites (e.g., ZSM-5)", "I", "Microporous 3D tectosilicates where Al³⁺ replaces some Si⁴⁺, used for shape-selective catalysis converting methanol to gasoline", "Replacement of Si⁴⁺ by Al³⁺ creates negative framework charges balanced by extra-framework cations (H⁺, Na⁺); ZSM-5 has specific channel diameters that convert MeOH to synthetic gasoline"),
            ("Ultramarine (Lapis lazuli)", "III", "Sodalite-cage aluminosilicate framework containing trapped S3⁻ radical anions giving deep blue color", "Ultramarine consists of an aluminosilicate framework enclosing radical polysulfide chromophores (chiefly trisulfur radical anion S3⁻), which absorb visible light producing an intense blue color"),
        ], "C"
    ))

    # Q16 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_016", t, "advanced",
        "Match the standard electrode potentials and redox behaviors of heavy p-block elements in List I with their descriptions in List II:",
        [
            ("Standard reduction potential E°(Pb⁴⁺/Pb²⁺) = +1.67 V", "III", "Strong oxidizing agent capable of oxidizing conc. HCl to chlorine gas", "Due to the reluctance of the 6s² electrons to participate in bonding (inert pair effect), Pb⁴⁺ readily gains 2e⁻ to form Pb²⁺, making PbO2 and Pb⁴⁺ powerful oxidizing agents"),
            ("Standard reduction potential E°(Sn⁴⁺/Sn²⁺) = +0.15 V", "I", "Sn²⁺ acts as a mild reducing agent, converting Fe³⁺ to Fe²⁺ and Cu²⁺ to Cu⁺", "The positive yet modest value means Sn²⁺ easily undergoes oxidation to Sn⁴⁺, making stannous salts widely used laboratory reducing agents"),
            ("Standard reduction potential E°(Tl³⁺/Tl⁺) = +1.25 V", "IV", "Tl³⁺ is a strong oxidizing agent, whereas Tl⁺ is thermodynamically very stable", "Tl⁺ is stabilized by the inert pair effect; hence Tl³⁺ readily oxidizes species like I⁻ to I2 while itself reducing to Tl⁺ (which is why TlI3 is Tl⁺(I3⁻) rather than Tl³⁺(I⁻)3)"),
            ("Standard reduction potential E°(In³⁺/In⁺) = -0.44 V", "II", "In⁺ is thermodynamically unstable toward disproportionation in aqueous solution: 3 In⁺ -> 2 In + In³⁺", "Because the potential for In⁺ -> In is more positive than In³⁺ -> In⁺, univalent indium spontaneously disproportionates in aqueous media into metallic indium and In³⁺"),
        ], "D"
    ))

    # Q17 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_017", t, "advanced",
        "Match the Boron hydride cluster formulas in List I with their Wade-Mingos electron count classifications in List II:",
        [
            ("[B6H6]²⁻", "IV", "Closo-borane cluster having (n + 1) = 7 skeletal electron pairs with an octahedral cage", "With n=6, [B6H6]²⁻ has 6×2 + 2 = 14 skeletal electrons (7 pairs = n+1), adopting a regular closed closo-octahedral geometry"),
            ("B5H9 (Pentaborane-9)", "II", "Nido-borane cluster having (n + 2) = 7 skeletal electron pairs with a square pyramidal cage", "With n=5, skeletal electrons = 5×(3-1) + 4 = 14 (7 pairs = n+2), corresponding to a nido geometry derived by removing one vertex from an octahedron"),
            ("B4H10 (Tetraborane-10)", "I", "Arachno-borane cluster having (n + 3) = 7 skeletal electron pairs with an open cage", "With n=4, skeletal electrons = 4×(3-1) + 6 = 14 (7 pairs = n+3), corresponding to an arachno geometry derived by removing two vertices from an octahedron"),
            ("[B12H12]²⁻", "III", "Closo-borane cluster having (n + 1) = 13 skeletal electron pairs with an icosahedral cage", "With n=12, skeletal electrons = 12×2 + 2 = 26 (13 pairs = n+1), forming an exceptionally stable, aromatic closed icosahedron (Ih symmetry)"),
        ], "A"
    ))

    # Q18 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_018", t, "advanced",
        "Match the hydrolysis pathways of Silicon halides and related compounds in List I with their reaction mechanisms and outcomes in List II:",
        [
            ("Hydrolysis of Silicon tetrafluoride (SiF4) in water", "I", "Yields orthosilicic acid (H4SiO4) and fluorosilicic acid (H2SiF6) via coordination of HF to unreacted SiF4", "SiF4 initially reacts with water to form H4SiO4 and HF: 3SiF4 + 4H2O -> H4SiO4 + 2H2SiF6. The HF produced coordinates with remaining SiF4 because Si can expand its octet to form [SiF6]²⁻"),
            ("Spontaneous combustion of Silane (SiH4) in air compared to Methane (CH4)", "III", "SiH4 ignites spontaneously (pyrophoric) due to lower Si-H bond energy, larger Si size, and available 3d orbitals lowering activation barrier", "The Si-H bond (318 kJ/mol) is weaker than C-H (414 kJ/mol), and the vacant 3d orbitals on silicon provide an accessible pathway for nucleophilic attack by oxygen, making SiH4 pyrophoric"),
            ("Hydrolysis of Hexachlorodisilane (Si2Cl6) with cold water", "IV", "Cleaves Si-Cl bonds while retaining the Si-Si bond, yielding insoluble polymeric silico-oxalic acid (H2Si2O4)", "Careful hydrolysis of Si2Cl6 with ice-cold water replaces the six chlorine atoms without cleaving the central Si-Si bond, producing hydrated silico-oxalic acid [(SiOOH)2]n"),
            ("Reaction of SiCl4 with lithium aluminium hydride (LiAlH4)", "II", "Reduces Si-Cl bonds quantitatively to produce volatile, flammable monosilane gas (SiH4)", "LiAlH4 serves as a powerful hydride donor: SiCl4 + LiAlH4 -> SiH4 + LiCl + AlCl3 in dry ether"),
        ], "B"
    ))

    # Q19 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_019", t, "advanced",
        "Match the unusual compounds of Thallium, Gallium, and Lead in List I with their electronic/structural facts in List II:",
        [
            ("Gallium dichloride (empirical formula GaCl2)", "IV", "Mixed-valence salt formulated correctly as Ga⁺[GaCl4]⁻ containing Ga(I) and Ga(III)", "GaCl2 is diamagnetic; Ga(II) would have an odd electron (4s¹), but crystal structure reveals univalent Ga⁺ cations and tetrahedral [GaCl4]⁻ anions"),
            ("Thallium triiodide (TlI3)", "I", "Formulated as Tl⁺(I3⁻) rather than Tl³⁺(I⁻)3 due to high oxidizing power of Tl³⁺", "Tl³⁺ has E° = +1.25 V and easily oxidizes iodide (E°(I2/I⁻) = +0.54 V); hence Tl³⁺ cannot coexist with I⁻, forming instead thallium(I) triiodide Tl⁺[I3]⁻"),
            ("Thallium(I) hydroxide (TlOH)", "II", "Readily soluble, strongly basic hydroxide behaving very similarly to alkali metal hydroxides (e.g., KOH)", "Tl⁺ has an ionic radius (1.50 Å) comparable to K⁺ (1.38 Å) and Rb⁺ (1.52 Å); TlOH is soluble in water and is a strong base, absorbing CO2 from air like KOH"),
            ("Lead(II,IV) oxide (Red lead / Minium, Pb3O4)", "III", "Mixed oxide formulated as 2PbO·PbO2, reacting with dilute HNO3 to precipitate brown PbO2", "Pb3O4 contains Pb in both +2 and +4 states. When treated with dilute HNO3, basic Pb(II) dissolves as Pb(NO3)2 while Pb(IV) remains undissolved as brown lead dioxide: Pb3O4 + 4HNO3 -> 2Pb(NO3)2 + PbO2 + 2H2O"),
        ], "C"
    ))

    # Q20 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_020", t, "advanced",
        "Match the advanced fullerenes, graphene, and carbon oxides in List I with their structural parameters and properties in List II:",
        [
            ("C60 Fullerene Euler's polyhedron theorem parameters", "II", "Possesses exactly 12 pentagonal rings, 20 hexagonal rings, 60 vertices, and 90 edges", "For any closed spherical trivalent polyhedron: 12 pentagons are mathematically required to close the cage, with n/2 - 10 = 20 hexagons for n=60; vertices = 60; edges = (60×3)/2 = 90"),
            ("Single-layer Graphene", "IV", "Zero band-gap 2D semimetal with sp² hybridized carbons exhibiting relativistic Dirac fermion charge carriers", "Graphene is a 2D honeycomb lattice of sp² carbons where the valence and conduction bands touch at the Dirac points, exhibiting extraordinary electronic mobility (> 200,000 cm²/V·s)"),
            ("Mellitic acid anhydride (C12O9)", "I", "Formed by complete dehydration of benzenehexacarboxylic acid, containing four fused rings of carbon and oxygen", "Dehydrating C6(COOH)6 with excess acetyl chloride or SOCl2 yields the cyclic trianhydride C12O9, an oxide of carbon consisting of a central benzene ring fused to three anhydride rings"),
            ("Fluorinated graphite ((CF)n)", "III", "Layered non-conductive covalent material where carbons are converted from sp² to sp³ hybridization", "Direct fluorination of graphite at ~500 °C disrupts the delocalized π-network, converting planar sp² sheets into puckered sp³ diamond-like sheets of (CF)n with high lubricity and electrical insulation"),
        ], "D"
    ))

    return qs

get_questions = get_pblock1_questions
