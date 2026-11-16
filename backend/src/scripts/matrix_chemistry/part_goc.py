import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_goc_questions():
    qs = []
    t = "Organic Chemistry Basics"

    # ==========================================
    # BEGINNER (chem_org1_001 - chem_org1_004)
    # ==========================================

    # chem_org1_001 (A)
    qs.append(make_matrix_q(
        "chem_org1_001", t, "beginner",
        "Match the organic functional groups in List I with their correct IUPAC seniority (priority) ranking order in List II (where 1st is highest priority):",
        [
            ("Carboxylic acid (-COOH)", "III", "Highest priority among listed (Rank 1)", "Carboxylic acids (-COOH) contain carbon in a high oxidation state (+3) and take the highest principal functional group priority among all groups listed according to IUPAC nomenclature guidelines"),
            ("Sulfonic acid (-SO3H)", "I", "Second highest priority among listed (Rank 2)", "Sulfonic acids (-SO3H) are placed immediately below carboxylic acids in the IUPAC hierarchy of principal characteristic groups"),
            ("Ester (-COOR)", "IV", "Third highest priority among listed (Rank 3)", "Esters (-COOR) are carboxylic acid derivatives that follow carboxylic and sulfonic acids in IUPAC priority ranking"),
            ("Aldehyde (-CHO)", "II", "Lowest priority among listed (Rank 4)", "Carbonyl compounds like aldehydes (-CHO) have lower priority than carboxylic acids, sulfonic acids, and carboxylic acid esters")
        ],
        "A"
    ))

    # chem_org1_002 (B)
    qs.append(make_matrix_q(
        "chem_org1_002", t, "beginner",
        "Match the electronic effects in organic chemistry in List I with their fundamental defining characteristics in List II:",
        [
            ("Inductive Effect", "IV", "Permanent polarization through sigma bonds that attenuates rapidly with distance", "The inductive effect is a permanent displacement of sigma electrons along a carbon chain caused by electronegativity differences, diminishing to negligible levels beyond 3 carbons"),
            ("Electromeric Effect", "II", "Temporary polarization of pi electrons operating only in the presence of an attacking reagent", "The electromeric effect is a purely temporary effect involving the complete transfer of a shared pair of pi electrons to one of the atoms in the presence of an attacking reagent"),
            ("Resonance / Mesomeric Effect", "I", "Permanent delocalization of pi or non-bonding electrons through conjugated p-orbitals", "The mesomeric effect operates through conjugated systems via overlap of parallel p-orbitals, causing permanent charge delocalization"),
            ("Hyperconjugation", "III", "No-bond resonance involving sigma C-H electron delocalization into an adjacent vacant/partially filled p-orbital", "Hyperconjugation involves the stabilizing interaction of electrons in a sigma bond (usually C-H or C-C) with an adjacent empty or partially filled p-orbital or pi* orbital")
        ],
        "B"
    ))

    # chem_org1_003 (C)
    qs.append(make_matrix_q(
        "chem_org1_003", t, "beginner",
        "Match the isomeric pairs in List I with the type of structural isomerism they exhibit in List II:",
        [
            ("Propan-1-ol and Propan-2-ol", "II", "Position isomerism", "Both compounds share the identical carbon chain (propane) and functional group (-OH), differing only in the locant position of the hydroxyl group (C-1 vs C-2)"),
            ("Ethanol and Dimethyl ether", "IV", "Functional group isomerism", "Both have the molecular formula C2H6O but belong to completely different homologous series with different functional groups (alcohol vs ether)"),
            ("Diethyl ether and Methyl propyl ether", "I", "Metamerism", "These isomers have the same functional group (-O-) but differ in the distribution of alkyl groups on either side of the divalent heteroatom"),
            ("Pentane and 2-Methylbutane", "III", "Chain isomerism", "Both possess the molecular formula C5H12 but differ in the branching and skeletal structure of the carbon backbone (unbranched n-pentane vs branched isopentane)")
        ],
        "C"
    ))

    # chem_org1_004 (D)
    qs.append(make_matrix_q(
        "chem_org1_004", t, "beginner",
        "Match each reactive intermediate in List I with its typical hybridization and geometry in List II:",
        [
            ("Methyl carbocation (CH3+)", "III", "sp2 hybridized, trigonal planar with an empty p-orbital", "The central carbon in CH3+ forms 3 sigma bonds with zero lone pairs (steric number 3), adopting sp2 hybridization with a planar geometry and a vacant 2p-orbital perpendicular to the plane"),
            ("Methyl carbanion (CH3-)", "I", "sp3 hybridized, trigonal pyramidal with a localized lone pair", "The central carbon in CH3- forms 3 sigma bonds and bears one non-bonding lone pair (steric number 4), resulting in sp3 hybridization and a trigonal pyramidal shape"),
            ("Methyl radical (CH3.)", "IV", "sp2 hybridized, planar or nearly planar with an unpaired electron in a p-orbital", "The methyl radical has 3 bonding pairs and 1 single electron; it adopts an essentially planar sp2 geometry with the unpaired electron residing in the unhybridized 2p-orbital"),
            ("Singlet methylene carbene (:CH2)", "II", "sp2 hybridized, bent with a paired electron lone pair in an sp2 hybrid orbital", "In singlet carbene, the two non-bonding electrons are spin-paired in an sp2 hybrid orbital, while the unhybridized 2p-orbital remains completely empty, giving a bent geometry with a bond angle of ~102°")
        ],
        "D"
    ))

    # ==========================================
    # INTERMEDIATE (chem_org1_005 - chem_org1_012)
    # ==========================================

    # chem_org1_005 (A)
    qs.append(make_matrix_q(
        "chem_org1_005", t, "intermediate",
        "Match the carbocations in List I with their relative thermodynamic stability order and stabilizing factors in List II:",
        [
            ("Cycloheptatrienyl (Tropylium) cation", "IV", "Exceptionally stable aromatic carbocation satisfying Huckel's (4n+2) rule with 6 pi electrons", "Tropylium cation contains a planar 7-membered cyclic conjugated ring with 6 pi electrons, fulfilling Huckel's rule (n=1) and exhibiting immense aromatic resonance stabilization"),
            ("Triphenylmethyl (Trityl) cation", "II", "High stability due to extensive resonance delocalization across three benzene rings", "The positive charge on the central carbon is delocalized over 3 phenyl rings via 10 canonical resonance contributors, forming a propeller-shaped highly stable cation"),
            ("tert-Butyl cation", "I", "Stable aliphatic cation stabilized by 9 hyperconjugative alpha-hydrogens and +I effect", "The (CH3)3C+ cation has 9 alpha-C-H bonds contributing to hyperconjugation as well as inductive electron donation from 3 methyl groups"),
            ("Vinyl cation (CH2=CH+)", "III", "Extremely unstable cation with positive charge on an electronegative sp-hybridized carbon", "Placing a positive charge on an sp-hybridized carbon (50% s-character) is thermodynamically highly disfavored due to strong electronegativity, making vinyl carbocations exceptionally unstable")
        ],
        "A"
    ))

    # chem_org1_006 (B)
    qs.append(make_matrix_q(
        "chem_org1_006", t, "intermediate",
        "Match the acidic compounds in List I with their comparative pKa values and conjugate base stabilization factors in List II:",
        [
            ("2,4,6-Trinitrophenol (Picric acid)", "III", "pKa ~ 0.38; extremely acidic due to strong -M and -I effects of three nitro groups", "Picric acid is a remarkably strong organic acid (comparable to mineral acids) because the three ortho/para -NO2 groups strongly stabilize the phenoxide anion via both mesomeric (-M) and inductive (-I) electron withdrawal"),
            ("Formic acid (HCOOH)", "I", "pKa ~ 3.75; stronger than acetic acid due to absence of an electron-donating alkyl group", "Formic acid lacks the +I methyl group present in acetic acid, which destabilizes the carboxylate anion; thus formate is more stable than acetate, making formic acid more acidic"),
            ("Phenol (C6H5OH)", "IV", "pKa ~ 9.95; moderately acidic due to phenoxide resonance delocalization", "Phenol is much more acidic than aliphatic alcohols because the conjugate base (phenoxide) is resonance-stabilized by delocalization of the negative charge into the benzene ring"),
            ("Ethanol (CH3CH2OH)", "II", "pKa ~ 15.9; weakly acidic due to localized negative charge and +I destabilization", "In ethoxide (CH3CH2O-), the negative charge is fully localized on oxygen and is further destabilized by the electron-donating inductive (+I) effect of the ethyl group")
        ],
        "B"
    ))

    # chem_org1_007 (C)
    qs.append(make_matrix_q(
        "chem_org1_007", t, "intermediate",
        "Match the substituted amines in List I with their basicity ranking and determining balance of electronic/solvation factors in List II:",
        [
            ("(CH3)2NH in aqueous medium", "II", "Highest basicity among methylamines due to optimal balance of +I and hydration", "In aqueous solution, the basicity order of methylamines is (CH3)2NH (2°) > CH3NH2 (1°) > (CH3)3N (3°) > NH3. The secondary amine achieves the optimum balance between inductive electron donation and steric freedom for water hydration"),
            ("(C2H5)2NH in aqueous medium", "IV", "Highest basicity among ethylamines (order: 2° > 3° > 1° > NH3)", "For ethyl-substituted amines in water, the order is (C2H5)2NH (2°) > (C2H5)3N (3°) > C2H5NH2 (1°) > NH3 due to the greater +I effect of ethyl overcoming moderate steric hindrance compared to methyl"),
            ("Aniline (C6H5NH2)", "I", "Very weak base due to resonance delocalization of nitrogen lone pair into the aromatic ring", "In aniline, the lone pair on nitrogen is conjugated with the aromatic ring and delocalized over ortho and para positions, significantly diminishing its availability for protonation"),
            ("Guanidine [(H2N)2C=NH]", "III", "Exceptionally strong organic base due to symmetric resonance delocalization in its conjugate acid", "Guanidine readily accepts a proton to form the guanidinium cation, which has three equivalent, highly stable resonance structures with the positive charge distributed equally across three nitrogen atoms")
        ],
        "C"
    ))

    # chem_org1_008 (D)
    qs.append(make_matrix_q(
        "chem_org1_008", t, "intermediate",
        "Match the cyclic conjugated molecules and ions in List I with their aromaticity classification and electronic structure in List II:",
        [
            ("Cyclooctatetraene (COT)", "III", "Non-aromatic; adopts a non-planar tub-shaped conformation to avoid anti-aromaticity", "COT has 8 pi electrons, which would be anti-aromatic if planar. To relieve anti-aromatic destabilization, it puckers into a non-planar 'tub' conformation, behaving as a conjugated non-aromatic polyene"),
            ("Cyclopentadienyl anion (C5H5-)", "I", "Aromatic; planar cyclic ring with 6 pi electrons satisfying Huckel's rule (4n+2, n=1)", "The conjugate base of cyclopentadiene has 6 pi electrons (4 from two double bonds and 2 from the carbanionic lone pair) fully delocalized across a planar 5-membered ring, making it strongly aromatic"),
            ("Cyclopropenyl cation (C3H3+)", "IV", "Aromatic; planar cyclic system with 2 pi electrons (4n+2, n=0)", "With 2 pi electrons delocalized over 3 sp2 carbon atoms in a planar three-membered ring, it obeys Huckel's rule for n=0 and displays remarkable aromatic stability"),
            ("Cyclopentadienyl cation (C5H5+)", "II", "Anti-aromatic; planar cyclic system with 4 pi electrons (4n pi system)", "Possesses 4 pi electrons in a completely conjugated planar ring, fulfilling the 4n anti-aromaticity criterion (n=1) and exhibiting high reactivity and instability")
        ],
        "D"
    ))

    # chem_org1_009 (A)
    qs.append(make_matrix_q(
        "chem_org1_009", t, "intermediate",
        "Match the carbonyl compounds in List I with their equilibrium enol content and dominant stabilizing factor in List II:",
        [
            ("Pentane-2,4-dione (Acetylacetone)", "IV", "~76-80% enol content; stabilized by strong intramolecular hydrogen bonding and conjugated chelate ring", "In acetylacetone, the enol form features a conjugated system between the C=C and C=O double bonds, further locked into a stable pseudo-six-membered ring by a strong intramolecular O-H...O hydrogen bond"),
            ("Ethyl acetoacetate (EAA)", "II", "~7-8% enol content; moderately stabilized by conjugated ester resonance and H-bonding", "EAA forms an enol stabilized by a 6-membered H-bonded ring, but the enol percentage is substantially lower than in acetylacetone because ester resonance competes with enol conjugation"),
            ("Phenol (from cyclohexadienone)", "I", "~100% enol content; driven by aromatic stabilization energy (~36 kcal/mol)", "The enol form of cyclohexadienone is phenol, which possesses a fully aromatic benzene ring, driving the keto-enol equilibrium almost 100% towards the enol form"),
            ("Cyclohexanone", "III", "< 0.02% enol content; equilibrium heavily favors the keto form due to greater C=O bond strength", "Simple monocarbonyl compounds lack extra conjugation or chelation in the enol tautomer; because the C=O pi bond is significantly stronger than C=C, the keto tautomer dominates overwhelmingly (>99.9%)")
        ],
        "A"
    ))

    # chem_org1_010 (B)
    qs.append(make_matrix_q(
        "chem_org1_010", t, "intermediate",
        "Match the geometrical isomer pairs and dicarboxylic acids in List I with their physical/chemical property comparison in List II:",
        [
            ("cis-But-2-ene vs trans-But-2-ene", "III", "cis has higher dipole moment and boiling point; trans has higher melting point due to crystal packing symmetry", "In cis-but-2-ene, dipole moments of the two C-CH3 bonds add vectorially (mu > 0), giving higher polarity and boiling point, whereas trans has higher molecular symmetry, allowing tighter crystal packing and higher melting point"),
            ("Maleic acid (cis-butenedioic acid)", "I", "Forms cyclic anhydride upon gentle heating; significantly higher first dissociation constant (Ka1)", "Due to the proximity of the two -COOH groups on the same side, maleic acid readily undergoes dehydration at ~160°C to yield maleic anhydride; its monoanion is strongly stabilized by intramolecular H-bonding, boosting Ka1"),
            ("Fumaric acid (trans-butenedioic acid)", "IV", "Resists cyclic anhydride formation; possesses significantly higher melting point (~287°C)", "The trans configuration keeps the carboxyl groups far apart, requiring severe heating (~300°C) with isomerization to form maleic anhydride; its high symmetry affords a much higher melting point than maleic acid (130°C)"),
            ("cis-1,2-Dichloroethene vs trans-1,2-Dichloroethene", "II", "cis is polar with net dipole moment (~1.9 D); trans is non-polar (mu = 0 D)", "In trans-1,2-dichloroethene, the two opposing C-Cl bond dipoles cancel out completely by inversion symmetry (mu = 0 D), whereas in the cis isomer they reinforce each other, yielding a large permanent dipole moment")
        ],
        "B"
    ))

    # chem_org1_011 (C)
    qs.append(make_matrix_q(
        "chem_org1_011", t, "intermediate",
        "Match the stereoisomeric relationships and optical properties in List I with their structural definitions in List II:",
        [
            ("Enantiomers", "II", "Non-superimposable mirror images with equal magnitude and opposite signs of specific optical rotation", "Enantiomers have identical physical properties (boiling point, density, refractive index) in achiral environments but rotate plane-polarized light in equal and opposite directions (+ and -)"),
            ("Diastereomers", "IV", "Stereoisomers that are not mirror images of each other, having different physical and chemical properties", "Diastereomers differ in spatial configuration at one or more (but not all) stereocenters, possessing different boiling points, melting points, solubilities, and distinct optical rotations"),
            ("Meso compound", "I", "Achiral molecule containing multiple stereocenters with an internal plane of symmetry (Ci or sigma)", "A meso compound contains stereocenters but is optically inactive due to internal compensation (the optical rotation of one half is cancelled by the other half through an internal symmetry plane or center)"),
            ("Racemic mixture (dl pair)", "III", "Equimolar mixture of enantiomers displaying zero net optical rotation due to external compensation", "A 1:1 mixture of (+) and (-) enantiomers is optically inactive because the clockwise rotation caused by molecules of one enantiomer is cancelled by the counterclockwise rotation of the other (external compensation)")
        ],
        "C"
    ))

    # chem_org1_012 (D)
    qs.append(make_matrix_q(
        "chem_org1_012", t, "intermediate",
        "Match the organic molecules in List I with the absolute configuration (R/S) of their chiral centers in List II according to Cahn-Ingold-Prelog (CIP) priority rules:",
        [
            ("(+)-Glyceraldehyde [CHO on top, OH on right, CH2OH at bottom, H on left]", "III", "(2R) configuration", "CIP priority: -OH (1) > -CHO (2) > -CH2OH (3) > -H (4). In Fischer projection with H on horizontal bond (left), 1 -> 2 -> 3 is counterclockwise, so horizontal rule reverses it to R"),
            ("L-Lactic acid [COOH on top, OH on left, CH3 at bottom, H on right]", "I", "(2S) configuration", "CIP priority: -OH (1) > -COOH (2) > -CH3 (3) > -H (4). With -OH on left and -H on right (horizontal), 1 -> 2 -> 3 is clockwise; since lowest priority group H is horizontal, reversing clockwise gives (2S)"),
            ("(R)-2-Bromobutane", "IV", "Chiral carbon with priority: -Br (1) > -CH2CH3 (2) > -CH3 (3) > -H (4)", "Priority at C-2: -Br has highest atomic number (1), ethyl has higher priority than methyl due to C-C branching (2 vs 3), -H is lowest (4). Viewing with H away, 1 -> 2 -> 3 clockwise gives (2R)"),
            ("(2S,3S)-Tartaric acid", "II", "Both chiral carbons (C-2 and C-3) possess (S) absolute configuration", "At both C-2 and C-3, priority is -OH (1) > -CH(OH)COOH (2) > -COOH (3) > -H (4). Correct evaluation under CIP rules assigns (2S, 3S) to the levorotatory tartaric acid enantiomer")
        ],
        "D"
    ))

    # ==========================================
    # ADVANCED (chem_org1_013 - chem_org1_020)
    # ==========================================

    # chem_org1_013 (A)
    qs.append(make_matrix_q(
        "chem_org1_013", t, "advanced",
        "Match the carbocation rearrangement processes in List I with their mechanistic driving forces and pathway descriptions in List II:",
        [
            ("Neopentyl cation [(CH3)3C-CH2+] rearrangement", "IV", "1,2-Methyl shift converting an unstable 1° carbocation to a stable 3° tert-pentyl carbocation", "The primary neopentyl cation undergoes an instantaneous 1,2-methide shift to relieve steric crowding and generate the far more stable tertiary carbocation (CH3)2C(+)-CH2CH3"),
            ("Cyclobutylcarbinyl cation rearrangement", "II", "Ring expansion to cyclopentyl cation driven by dramatic relief of 4-membered ring strain", "The four-membered cyclobutane ring has ~26 kcal/mol of angle and torsional strain; 1,2-sigma bond migration expands the ring into a cyclopentyl cation, releasing significant strain energy"),
            ("3,3-Dimethylbutan-2-ol dehydration intermediate", "I", "1,2-Hydride / 1,2-methide shift forming 2,3-dimethylbut-2-ene as the tetrasubstituted major product", "Loss of water yields a 2° carbocation, which undergoes a 1,2-methyl shift to a 3° carbocation. Subsequent deprotonation yields the thermodynamic tetrasubstituted Saytzeff alkene"),
            ("Pinacol carbocation rearrangement", "III", "1,2-Alkyl/aryl migration driven by oxocarbenium ion resonance stabilization by an adjacent oxygen atom", "Protonation and loss of water from a vicinal diol gives a beta-hydroxy carbocation; 1,2-migration yields a resonance-stabilized protonated ketone (oxocarbenium ion) where all atoms have complete octets")
        ],
        "A"
    ))

    # chem_org1_014 (B)
    qs.append(make_matrix_q(
        "chem_org1_014", t, "advanced",
        "Match the cyclohexane conformations and substituted derivatives in List I with their conformational analysis parameters in List II:",
        [
            ("Methylcyclohexane equatorial vs axial", "III", "Equatorial conformer favored by ~1.74 kcal/mol (A-value) due to absence of 1,3-diaxial steric strain", "In axial methylcyclohexane, steric repulsion between the axial methyl group and the axial hydrogens at C-3 and C-5 (two gauche-butane interactions) destabilizes it by ~1.74 kcal/mol relative to equatorial"),
            ("cis-1,4-Di-tert-butylcyclohexane", "I", "Forced to adopt a twist-boat conformation to avoid placing a bulky tert-butyl group in an axial position", "Because the A-value of tert-butyl is extremely large (~4.9 kcal/mol), having one axial tert-butyl in a chair form is energetically prohibitive; the molecule flips to a twist-boat where both tert-butyl groups occupy pseudo-equatorial positions"),
            ("trans-1,2-Dibromocyclohexane in non-polar solvent", "IV", "Diaxial conformer is unusually populated due to minimization of C-Br dipole-dipole repulsion", "Although equatorial bonds are usually favored, the diequatorial conformer has aligned, strongly repulsive C-Br dipoles; in non-polar solvents, the diaxial conformer (with anti-parallel dipoles) is significantly stabilized"),
            ("Ethylene glycol (ethane-1,2-diol) in gas phase", "II", "Gauche conformation is more stable than anti due to an intramolecular hydrogen bond", "Unlike typical alkanes where anti is most stable, vicinal diols establish an intramolecular O-H...O hydrogen bond in the gauche conformation, which lowers enthalpy and stabilizes gauche over anti")
        ],
        "B"
    ))

    # chem_org1_015 (C)
    qs.append(make_matrix_q(
        "chem_org1_015", t, "advanced",
        "Match the substituted benzene derivatives in List I with their steric/electronic phenomena (ortho effect, SIR, SIP) in List II:",
        [
            ("o-Toluic acid (2-methylbenzoic acid)", "II", "Stronger acid than benzoic acid due to ortho effect (steric relief and loss of coplanarity of -COOH)", "Steric hindrance from the ortho-methyl group forces the -COOH out of the aromatic plane, inhibiting resonance between the ring and carboxyl group (-M effect reduced), allowing the carboxylate to stabilize independently without competing ring cross-conjugation"),
            ("2,6-Dimethylaniline", "IV", "Steric Inhibition of Resonance (SIR) prevents amine lone pair from entering aromatic conjugation efficiently", "Two bulky ortho-methyl groups twist the -NH2 group out of coplanarity with the phenyl ring, suppressing resonance delocalization of the nitrogen lone pair and altering basicity/reactivity"),
            ("2,6-Di-tert-butylpyridine", "I", "Steric Inhibition of Protonation (SIP) makes it an exceptionally weak Bronsted base despite alkyl groups", "Although tert-butyl groups donate electron density inductively, the enormous steric crowding surrounding the pyridine nitrogen atom blocks hydronium ions from approaching, drastically reducing proton affinity in solution"),
            ("2,6-Dimethyl-4-nitroaniline", "III", "Suppressed dipole moment and shifted UV absorption due to steric inhibition of resonance by ortho-methyls", "Bulky substituents ortho to -N(CH3)2 force the dimethylamino group out of the aromatic plane, preventing through-resonance with the para-nitro group and drastically altering spectral characteristics")
        ],
        "C"
    ))

    # chem_org1_016 (D)
    qs.append(make_matrix_q(
        "chem_org1_016", t, "advanced",
        "Match the non-classical or uniquely stabilized carbocations in List I with their bonding and structural features in List II:",
        [
            ("Cyclopropylmethyl carbocation (CPM+)", "III", "Remarkably stable due to 'bent' banana C-C sigma-orbital overlap with the vacant p-orbital", "The bent C-C sigma bonds of the cyclopropane ring have high p-character (sp^5) and project electron density outward, overlapping effectively with the adjacent empty 2p-orbital to provide extraordinary stabilization (tricyclopropylmethyl cation is more stable than trityl)"),
            ("2-Norbornyl cation", "I", "Classic non-classical carbocation with a 3-center 2-electron (3c-2e) bridged sigma bond", "The norbornyl cation features delocalization of the C1-C6 sigma bond into the C-2 empty orbital, forming a symmetric 3c-2e bridged structure confirmed definitively by X-ray crystallography at low temperature"),
            ("Phenonium ion", "IV", "Bridged benzenium intermediate in solvolysis of beta-phenylethyl systems with retention of configuration", "The phenyl ring acts as a neighboring group (anchimeric assistance), using its pi electrons to attack the adjacent carbon with displacement of the leaving group, forming a spiro-cyclopropyl phenonium bridge"),
            ("1-Norbornyl carbocation", "II", "Extremely unstable bridgehead carbocation violating Bredt's rule and unable to achieve planar sp2 geometry", "Because the bridgehead position in the bicyclic norbornyl skeleton cannot achieve a planar 120° trigonal geometry without immense bridge strain, it resists carbocation formation under standard conditions")
        ],
        "D"
    ))

    # chem_org1_017 (A)
    qs.append(make_matrix_q(
        "chem_org1_017", t, "advanced",
        "Match the annulenes and non-benzenoid aromatics in List I with their aromatic character and physical properties in List II:",
        [
            ("Azulene (C10H8)", "IV", "Aromatic bicyclic non-benzenoid hydrocarbon with a substantial dipole moment (~1.08 D)", "Azulene consists of a fused 7-membered and 5-membered ring; it exhibits a major resonance contributor consisting of a 6-pi tropylium cation fused to a 6-pi cyclopentadienyl anion, giving both rings aromaticity and creating a strong dipole moment"),
            ("[10]Annulene", "II", "Non-aromatic due to steric clash of internal trans hydrogens preventing molecular planarity", "Although it possesses 10 pi electrons (4n+2 for n=2), the (E,Z,Z,Z,Z) isomer experiences strong van der Waals repulsion between the two internal hydrogens, forcing the ring to twist out of planarity and destroying aromatic conjugation"),
            ("[14]Annulene", "I", "Aromatic; planar enough to allow diatropic ring current in NMR at low temperatures", "With 14 pi electrons, the ring is large enough that internal hydrogen repulsions are tolerable, allowing an aromatic ring current where outer protons appear downfield (~7.6 ppm) and inner protons appear upfield (~0 ppm)"),
            ("[16]Annulene", "III", "Anti-aromatic 4n pi system that puckers out of planarity at room temperature to avoid instability", "Possesses 16 pi electrons (4n, n=4); in a planar geometry it would suffer severe anti-aromatic destabilization, so it adopts an alternating, non-planar conformation at standard temperatures")
        ],
        "A"
    ))

    # chem_org1_018 (B)
    qs.append(make_matrix_q(
        "chem_org1_018", t, "advanced",
        "Match the polyfunctional organic structures in List I with their total count of stereoisomers in List II:",
        [
            ("Tartaric acid [HOOC-CH(OH)-CH(OH)-COOH]", "III", "3 stereoisomers (one pair of enantiomers and one meso compound)", "With 2 similar chiral centers (n=2, even), the number of enantiomers is 2^(n-1) = 2, and meso forms is 2^(n/2 - 1) = 1, giving a total of 3 stereoisomers (d, l, and meso)"),
            ("Pentane-2,3,4-triol [CH3-CH(OH)-CH(OH)-CH(OH)-CH3]", "I", "4 stereoisomers (two pairs of enantiomers and two meso forms involving a pseudoasymmetric center)", "C-3 is a pseudoasymmetric center whose stereogenicity depends on whether C-2 and C-4 have identical (R,R / S,S) or opposite (R,S / S,R) configurations, yielding 4 total stereoisomers"),
            ("1,2-Dimethylcyclopropane", "IV", "3 stereoisomers (one pair of cis-trans isomers: trans is a pair of enantiomers, cis is meso)", "The cis isomer has an internal plane of symmetry and is an optically inactive meso form, while the trans isomer lacks symmetry and exists as a pair of non-superimposable (1R,2R) and (1S,2S) enantiomers"),
            ("Hexa-2,4-diene [CH3-CH=CH-CH=CH-CH3]", "II", "3 geometrical stereoisomers (cis-cis, trans-trans, cis-trans)", "For a symmetric conjugated diene with identical terminal groups, the number of geometrical isomers is given by 2^(n-1) + 2^(p-1) = 2 + 1 = 3 isomers: (2E,4E), (2Z,4Z), and (2E,4Z)")
        ],
        "B"
    ))

    # chem_org1_019 (C)
    qs.append(make_matrix_q(
        "chem_org1_019", t, "advanced",
        "Match the isomeric alkenes and hydrocarbons in List I with their heat of hydrogenation (HOH) and thermodynamic stability ranking in List II:",
        [
            ("2,3-Dimethylbut-2-ene", "II", "Lowest Heat of Hydrogenation (~26.6 kcal/mol); highest stability due to 12 alpha-hydrogens", "Being a tetrasubstituted alkene with 12 hyperconjugative alpha-hydrogens, it possesses the lowest ground-state energy, releasing the least amount of heat per mole upon catalytic hydrogenation to 2,3-dimethylbutane"),
            ("trans-But-2-ene", "IV", "Lower HOH (~27.6 kcal/mol) than cis-but-2-ene due to absence of steric clash between methyl groups", "In trans-but-2-ene, the two methyl groups are oriented anti to each other, avoiding the van der Waals steric repulsion (eclipsing/gauche-like strain) present in cis-but-2-ene (~28.6 kcal/mol)"),
            ("cis-But-2-ene", "I", "Higher HOH (~28.6 kcal/mol) than trans-but-2-ene due to steric hindrance between cis-methyl groups", "The steric crowding between adjacent methyl groups destabilizes the cis isomer by ~1.0 kcal/mol relative to trans, resulting in a higher exothermic heat of hydrogenation"),
            ("But-1-ene", "III", "Highest Heat of Hydrogenation (~30.3 kcal/mol) among butene isomers; least stable monosubstituted alkene", "As a terminal monosubstituted alkene with only 2 hyperconjugative alpha-C-H bonds, it has the least stabilization and releases the greatest amount of heat upon hydrogenation to butane")
        ],
        "C"
    ))

    # chem_org1_020 (D)
    qs.append(make_matrix_q(
        "chem_org1_020", t, "advanced",
        "Match the multi-functional acids in List I with their anomalous pKa dissociation trends and explanations in List II:",
        [
            ("Salicylic acid (2-hydroxybenzoic acid)", "III", "pKa1 = 2.98; significantly more acidic than benzoic acid due to intramolecular H-bonding in its conjugate base", "The salicylate monoanion is stabilized by a very strong 6-membered intramolecular hydrogen bond between the phenolate-like OH hydrogen and the carboxylate oxygen, shifting the dissociation equilibrium to the right"),
            ("2,6-Dihydroxybenzoic acid", "I", "pKa1 = 1.30; extremely strong carboxylic acid stabilized by two symmetrical intramolecular H-bonds", "With two ortho-hydroxyl groups flanking the carboxylate, the monoanion is bridged by two simultaneous intramolecular hydrogen bonds, creating exceptional stabilization and an extraordinarily low pKa1"),
            ("Maleic acid (pKa1 = 1.9, pKa2 = 6.2)", "IV", "Huge difference between pKa1 and pKa2 (delta pKa ~ 4.3) due to H-bonding in monoanion and electrostatic repulsion in dianion", "Loss of the first proton produces a monoanion stabilized by a strong internal H-bond (very low pKa1); removing the second proton requires breaking this H-bond and placing two negative charges in close proximity, making pKa2 unusually high"),
            ("Fumaric acid (pKa1 = 3.0, pKa2 = 4.4)", "II", "Much smaller difference between pKa1 and pKa2 (delta pKa ~ 1.4) due to trans separation of carboxyl groups", "Because the carboxyl groups are on opposite sides of the double bond, there is no intramolecular H-bonding to stabilize the monoanion or strong direct repulsion in the dianion, leading to a normal electrostatic separation of pKa values")
        ],
        "D"
    ))

    return qs
