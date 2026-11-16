import sys
import os

# Add current directory to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

TOPIC = "Polymers"

def get_polymers_questions():
    questions = []

    # ----------------------------------------------------
    # Beginner Questions (chem_app_041 - chem_app_044)
    # ----------------------------------------------------

    # chem_app_041 (Beginner, Ans: A)
    pairs_041 = [
        ("Polythene", "II", "Ethene (CH2=CH2)", 
         "Polythene is an addition homopolymer formed by chain-growth addition polymerization of ethene monomers under high or low pressure"),
        ("Teflon (PTFE)", "III", "Tetrafluoroethene (CF2=CF2)", 
         "Teflon (polytetrafluoroethene) is prepared by heating tetrafluoroethene with a free radical or persulfate catalyst at high pressures"),
        ("Polyacrylonitrile (PAN/Orlon)", "IV", "Acrylonitrile / Vinyl cyanide (CH2=CH-CN)", 
         "Polyacrylonitrile is formed by peroxide-catalyzed addition polymerization of acrylonitrile, used as commercial acrylic fiber (Orlon or Acrilan)"),
        ("Polystyrene", "I", "Styrene / Phenylethene (C6H5-CH=CH2)", 
         "Polystyrene is an addition polymer obtained by radical polymerization of styrene (phenylethene), widely used in insulation and packaging materials")
    ]
    questions.append(make_matrix_q(
        "chem_app_041", TOPIC, "beginner",
        "Match each polymer in List I with its monomer(s) in List II:",
        pairs_041, "A"
    ))

    # chem_app_042 (Beginner, Ans: B)
    pairs_042 = [
        ("Elastomers", "III", "Polymeric chains held by the weakest intermolecular forces, allowing them to stretch and retract", 
         "Elastomers like Buna-S and natural rubber have randomly coiled chains held by weak van der Waals forces, which uncoil when pulled and retract due to cross-links"),
        ("Fibres", "IV", "Possess strong intermolecular hydrogen bonding or dipole-dipole forces, giving high tensile strength and crystalline structure", 
         "Fibres like Nylon-6,6 and Terylene possess strong intermolecular hydrogen bonds or dipole attractions, imparting high tensile strength, high melting points, and high modulus"),
        ("Thermoplastics", "I", "Linear or slightly branched polymers that soften repeatedly upon heating and harden upon cooling", 
         "Thermoplastics like polythene, polystyrene, and PVC have intermediate intermolecular forces and can be repeatedly melted, reshaped, and recycled"),
        ("Thermosetting polymers", "II", "Heavily cross-linked or network polymers that set permanently upon heating and cannot be remoulded", 
         "Thermosetting polymers like Bakelite and melamine undergo extensive irreversible covalent cross-linking upon initial heating and decompose rather than melt upon reheating")
    ]
    questions.append(make_matrix_q(
        "chem_app_042", TOPIC, "beginner",
        "Match each polymer classification in List I with its defining structural/mechanical characteristic in List II:",
        pairs_042, "B"
    ))

    # chem_app_043 (Beginner, Ans: C)
    pairs_043 = [
        ("Bakelite", "IV", "Electrical switches, plugs, and handles of cookware due to high electrical insulation and heat resistance", 
         "Bakelite is a rigid, infusible 3D cross-linked thermosetting resin with excellent thermal stability and electrical resistance, ideal for switches and saucepan handles"),
        ("Melamine-formaldehyde resin", "I", "Unbreakable dinnerware and crockery due to extreme hardness and resistance to chipping", 
         "Melamine resin is a dense, hard thermosetting plastic with high surface hardness and impact resistance, widely used in shatter-resistant crockery"),
        ("Glyptal", "II", "Paints, lacquers, and building materials synthesized from ethylene glycol and phthalic acid", 
         "Glyptal is an alkyd polyester resin that cross-links on air drying, forming durable, weather-resistant films in commercial paints and lacquers"),
        ("Terylene (Dacron)", "III", "Crease-resistant fabrics and safety belts blended with cotton or wool", 
         "Terylene (polyethylene terephthalate) fibers have high tensile strength and resilience, widely blended with natural fibers (terycot, terywool) for crease-resistant apparel")
    ]
    questions.append(make_matrix_q(
        "chem_app_043", TOPIC, "beginner",
        "Match each synthetic polymer in List I with its characteristic commercial application in List II:",
        pairs_043, "C"
    ))

    # chem_app_044 (Beginner, Ans: D)
    pairs_044 = [
        ("Natural rubber", "I", "cis-1,4-polyisoprene (derived from Hevea brasiliensis latex)", 
         "Natural rubber is an elastomer consisting of linear 1,4-addition chains of isoprene (2-methyl-1,3-butadiene) where all double bonds possess cis geometry"),
        ("Gutta-percha", "II", "trans-1,4-polyisoprene (non-elastic, crystalline natural polymer)", 
         "Gutta-percha is an all-trans isomer of 1,4-polyisoprene; the linear zigzag chains pack closely into a crystalline lattice, making it a non-elastic, rigid solid"),
        ("Neoprene", "III", "Poly-2-chloro-1,3-butadiene (synthetic chloroprene homopolymer)", 
         "Neoprene (polychloroprene) is a synthetic elastomer produced by free radical polymerization of chloroprene (2-chloro-1,3-butadiene)"),
        ("Buna-S", "IV", "Copolymer of 1,3-butadiene and styrene (75:25 ratio)", 
         "Buna-S (styrene-butadiene rubber / SBR) is an addition copolymer of 75% 1,3-butadiene and 25% styrene, synthesized using sodium or peroxide initiator")
    ]
    questions.append(make_matrix_q(
        "chem_app_044", TOPIC, "beginner",
        "Match each rubber type in List I with its chemical constitution in List II:",
        pairs_044, "D"
    ))

    # ----------------------------------------------------
    # Intermediate Questions (chem_app_045 - chem_app_052)
    # ----------------------------------------------------

    # chem_app_045 (Intermediate, Ans: A)
    pairs_045 = [
        ("Nylon-6,6", "II", "Polyamide formed via -CO-NH- amide linkages between hexamethylenediamine and adipic acid", 
         "Condensation of hexamethylenediamine and adipic acid under high pressure at 553 K forms Nylon-6,6, characterized by recurring amide (-CONH-) linkages"),
        ("Terylene (Dacron)", "I", "Polyester formed via -COO- ester linkages between ethylene glycol and terephthalic acid", 
         "Step-growth esterification between ethylene glycol and terephthalic acid with zinc acetate-antimony trioxide catalyst creates Dacron, a polyester with -COO- linkages"),
        ("Nylon-6", "IV", "Polyamide formed by ring-opening polymerization of caprolactam containing repeating -(CH2)5-CONH- units", 
         "Heating caprolactam with water at 533-543 K causes ring opening to ε-aminocaproic acid, which self-condenses into Nylon-6 polyamide containing -(CH2)5CONH- units"),
        ("PHBV", "III", "Biodegradable polyester containing ester linkages formed between 3-hydroxybutanoic acid and 3-hydroxypentanoic acid", 
         "PHBV is a bacterial biodegradable polyester featuring aliphatic ester links between 3-hydroxybutanoic acid and 3-hydroxypentanoic acid")
    ]
    questions.append(make_matrix_q(
        "chem_app_045", TOPIC, "intermediate",
        "Match each polyamide/polyester polymer in List I with its specific repeating functional linkage in List II:",
        pairs_045, "A"
    ))

    # chem_app_046 (Intermediate, Ans: B)
    pairs_046 = [
        ("Low-density polythene (LDPE)", "III", "Free radical addition polymerization under high pressure (1000-2000 atm) and 350-570 K resulting in highly branched chains", 
         "LDPE is produced by radical polymerization of ethene at 1000-2000 atm with trace O2; extensive intra- and intermolecular chain transfer generates branched, flexible chains"),
        ("High-density polythene (HDPE)", "IV", "Coordination addition polymerization using Ziegler-Natta catalyst [TiCl4 + Al(C2H5)3] at low pressure yielding linear crystalline chains", 
         "HDPE is synthesized at 6-7 atm and 333-343 K via coordination polymerization over TiCl4 + AlEt3; the absence of branching allows close packing and high density (~0.97 g/cm3)"),
        ("Novolac", "I", "Step-growth condensation polymerization of phenol with formaldehyde in acidic medium forming linear polymer", 
         "Acid-catalyzed condensation of phenol with formaldehyde (molar ratio < 1) yields Novolac, a linear fusible polymer where phenolic nuclei are bridged by ortho-ortho methylene links"),
        ("Buna-N", "II", "Free radical copolymerization of 1,3-butadiene and acrylonitrile in the presence of peroxide catalyst", 
         "Buna-N is synthesized by emulsion copolymerization of 1,3-butadiene with acrylonitrile via a free radical mechanism, creating an oil-resistant elastomer")
    ]
    questions.append(make_matrix_q(
        "chem_app_046", TOPIC, "intermediate",
        "Match the polymer in List I with its precise mode/category of polymerization in List II:",
        pairs_046, "B"
    ))

    # chem_app_047 (Intermediate, Ans: C)
    pairs_047 = [
        ("Chain Initiation", "IV", "Thermal decomposition of benzoyl peroxide generates phenyl radicals that add to ethene forming primary radical: C6H5• + CH2=CH2 -> C6H5-CH2-CH2•", 
         "Initiation involves homolytic cleavage of the peroxy bond in benzoyl peroxide to form benzoyloxy radicals, which lose CO2 to give phenyl radicals that add across the double bond"),
        ("Chain Propagation", "III", "Continuous sequential addition of growing radical to successive monomer molecules: R-CH2-CH2• + CH2=CH2 -> R-(CH2)3-CH2•", 
         "During propagation, the newly formed radical rapidly adds to another molecule of ethene, creating a new larger radical and regenerating the active center repeatedly"),
        ("Chain Termination by Combination", "II", "Coupling of two growing macromolecular radical chains forming a single non-radical polymer molecule", 
         "Two growing radical polymer chains can combine head-to-head (R1• + R2• -> R1-R2), destroying both radical centers and terminating chain growth"),
        ("Chain Termination by Disproportionation", "I", "Hydrogen atom transfer between two growing radicals producing one saturated and one unsaturated polymer chain", 
         "In disproportionation, a β-hydrogen atom is abstracted from one growing chain radical by another, yielding one macromolecule with a terminal alkane and one with a terminal alkene")
    ]
    questions.append(make_matrix_q(
        "chem_app_047", TOPIC, "intermediate",
        "Match each step of free radical vinyl polymerization of ethene in List I with its chemical equation / description in List II:",
        pairs_047, "C"
    ))

    # chem_app_048 (Intermediate, Ans: D)
    pairs_048 = [
        ("PHBV", "II", "3-hydroxybutanoic acid and 3-hydroxypentanoic acid", 
         "Poly-β-hydroxybutyrate-co-β-hydroxyvalerate (PHBV) is synthesized from 3-hydroxybutanoic acid and 3-hydroxypentanoic acid; used in drug delivery capsules"),
        ("Nylon-2-nylon-6", "IV", "Glycine (H2N-CH2-COOH) and ε-aminocaproic acid (H2N-(CH2)5-COOH)", 
         "Nylon-2-nylon-6 is an alternating biodegradable polyamide copolymer derived from the condensation of glycine and ε-aminocaproic acid"),
        ("Polyglycolic acid (PGA)", "I", "Glycolic acid (hydroxyacetic acid, HO-CH2-COOH)", 
         "Polyglycolic acid is a biodegradable aliphatic polyester derived from glycolic acid (or ring-opening of glycolide), extensively used in absorbable surgical sutures"),
        ("Polylactic acid (PLA)", "III", "Lactic acid (2-hydroxypropanoic acid, CH3-CH(OH)-COOH)", 
         "Polylactic acid is an eco-friendly biodegradable thermoplastic polyester derived from fermented plant starch via lactic acid condensation")
    ]
    questions.append(make_matrix_q(
        "chem_app_048", TOPIC, "intermediate",
        "Match each biodegradable polymer in List I with its monomeric precursors in List II:",
        pairs_048, "D"
    ))

    # chem_app_049 (Intermediate, Ans: A)
    pairs_049 = [
        ("Nylon-6,6", "II", "Extensive intermolecular hydrogen bonding between >C=O and -NH- groups of adjacent chains", 
         "In polyamides, the close spatial alignment of carbonyl oxygens and amide hydrogens creates dense linear networks of hydrogen bonds, conferring high tensile strength"),
        ("Polytetrafluoroethene (Teflon)", "IV", "Dipole-dipole interactions and rigid fluorocarbon packing giving high chemical inertness", 
         "The strong C-F bonds (~485 kJ/mol) and electrostatic repulsion between fluorine sheaths create a rigid, slippery fluorocarbon rod with supreme chemical and thermal resistance"),
        ("Natural rubber (cis-polyisoprene)", "I", "Weak London dispersion / van der Waals forces between coiled non-polar hydrocarbon chains", 
         "In cis-1,4-polyisoprene, the cis double bonds introduce bends that prevent close crystalline packing, leaving only weak van der Waals dispersion forces between chains"),
        ("Bakelite", "III", "Three-dimensional covalent cross-linking via -CH2- methylene bridges connecting aromatic rings", 
         "Bakelite is an infusible 3D network polymer held together entirely by strong covalent C-C bonds forming rigid cross-linked phenol-methylene structures")
    ]
    questions.append(make_matrix_q(
        "chem_app_049", TOPIC, "intermediate",
        "Match each polymer in List I with its characteristic intermolecular bonding / cohesive force in List II:",
        pairs_049, "A"
    ))

    # chem_app_050 (Intermediate, Ans: B)
    pairs_050 = [
        ("Neoprene", "III", "Exceptional resistance to vegetable and mineral oils, atmospheric oxidation, and aging compared to natural rubber", 
         "The presence of the electronegative chlorine atom in polychloroprene diminishes double bond reactivity, conferring superior resistance to oils, ozone, and weathering"),
        ("Buna-N (Nitrile rubber)", "IV", "Outstanding resistance to petrol, lubricating oils, and organic solvents used for fuel tank linings and oil seals", 
         "The polar cyano (-CN) groups in Buna-N impart resistance to swell in non-polar hydrocarbon fuels, gasoline, and industrial oils"),
        ("Buna-S (Styrene-butadiene rubber)", "I", "High abrasion resistance and high load-bearing capacity used extensively in automotive tire treads", 
         "The rigid phenyl pendant groups of the styrene monomer provide toughness and high abrasion resistance, making Buna-S ideal for passenger car tire treads"),
        ("Vulcanized rubber with 3-5% sulfur", "II", "Controlled allylic disulfide cross-links providing enhanced elasticity, stiffness, and thermal stability", 
         "Adding 3-5% sulfur forms covalent monosulfide and disulfide bridges (-Sx-) at allylic positions across polyisoprene chains, preventing plastic flow under stress")
    ]
    questions.append(make_matrix_q(
        "chem_app_050", TOPIC, "intermediate",
        "Match each synthetic rubber in List I with its key physical/chemical property and advantage in List II:",
        pairs_050, "B"
    ))

    # chem_app_051 (Intermediate, Ans: C)
    pairs_051 = [
        ("Melamine + Formaldehyde", "IV", "Melamine-formaldehyde resin (cross-linked thermosetting resin for unbreakable tableware)", 
         "Melamine (2,4,6-triamino-1,3,5-triazine) undergoes nucleophilic addition with formaldehyde to yield methylolmelamines, which cross-link into unbreakable melamine resin"),
        ("Phenol + Formaldehyde (excess formaldehyde + heat with acid/base)", "I", "Bakelite (infusible 3D network polymer)", 
         "When phenol is heated with excess formaldehyde in the presence of catalyst, condensation proceeds through Novolac/Resole intermediates to form infusible cross-linked Bakelite"),
        ("Ethylene glycol + Phthalic acid (1,2-benzenedicarboxylic acid)", "II", "Glyptal (cross-linkable branched polyester used in lacquers)", 
         "Esterification of ethylene glycol with phthalic anhydride or phthalic acid gives Glyptal; cross-linking via secondary hydroxyls produces durable protective lacquers"),
        ("Ethylene glycol + Terephthalic acid (1,4-benzenedicarboxylic acid)", "III", "Terylene / Dacron (linear crystalline polyester fiber)", 
         "Para-oriented terephthalic acid condenses linearly with ethylene glycol, forming highly symmetrical, crystalline polymer chains suitable for synthetic textile fibers")
    ]
    questions.append(make_matrix_q(
        "chem_app_051", TOPIC, "intermediate",
        "Match each condensation polymer precursor pair in List I with the resulting polymer in List II:",
        pairs_051, "C"
    ))

    # chem_app_052 (Intermediate, Ans: D)
    pairs_052 = [
        ("Homopolymer", "III", "Polythene and Polyvinyl chloride (PVC) (synthesized from a single monomer species)", 
         "Homopolymers are formed by the polymerization of a single monomer type (e.g. ethene -> polythene, vinyl chloride -> PVC)"),
        ("Copolymer", "IV", "Buna-S and Buna-N (synthesized from two different monomer species)", 
         "Copolymers are synthesized by polymerizing a mixture of two or more distinct monomer species (e.g., butadiene + styrene -> Buna-S)"),
        ("Semi-synthetic polymer", "I", "Cellulose diacetate (Rayon) and Cellulose nitrate (chemically modified natural polymers)", 
         "Semi-synthetic polymers are derived by chemically functionalizing natural macromolecules (e.g., acetylating natural cellulose with acetic anhydride)"),
        ("Natural polymer", "II", "Starch and Natural rubber (derived directly from botanical biological sources)", 
         "Natural polymers occur naturally in plants and animals; starch is a polyglucosan of amylose/amylopectin, and natural rubber is latex cis-polyisoprene")
    ]
    questions.append(make_matrix_q(
        "chem_app_052", TOPIC, "intermediate",
        "Match each polymer classification term in List I with the appropriate illustrative polymer pair in List II:",
        pairs_052, "D"
    ))

    # ----------------------------------------------------
    # Advanced Questions (chem_app_053 - chem_app_060)
    # ----------------------------------------------------

    # chem_app_053 (Advanced, Ans: A)
    pairs_053 = [
        ("Number-average molecular mass (M̄_n)", "II", "Defined as (Σ N_i M_i) / (Σ N_i), determined experimentally by colligative property measurements (osmometry)", 
         "M̄_n depends strictly on the total number of polymer molecules present regardless of their individual sizes; it is measured colligatively, most accurately by membrane osmometry"),
        ("Weight-average molecular mass (M̄_w)", "I", "Defined as (Σ N_i M_i^2) / (Σ N_i M_i), determined experimentally by ultracentrifugation and light scattering", 
         "M̄_w gives greater statistical weight to heavier macromolecules; it is determined experimentally by methods governed by mass or volume, such as static light scattering or sedimentation equilibrium"),
        ("Polydispersity Index (PDI)", "IV", "Ratio M̄_w / M̄_n; equals 1 for strictly monodisperse natural proteins and > 1 for synthetic polydisperse polymers", 
         "PDI = M̄_w / M̄_n measures molecular weight heterogeneity. For monodisperse polymers (like natural biopolymers), PDI = 1; for synthetic polymers, PDI > 1 (often 1.5 - 5)"),
        ("Degree of polymerization (DP)", "III", "Total molecular mass of polymer divided by the molecular mass of its repeating monomeric unit: M / M_0", 
         "DP indicates the total number of repeating monomeric residues incorporated in a macromolecular chain, related by DP = M_polymer / M_mer")
    ]
    questions.append(make_matrix_q(
        "chem_app_053", TOPIC, "advanced",
        "Match each polymer molecular weight concept / metric in List I with its quantitative expression or measurement method in List II:",
        pairs_053, "A"
    ))

    # chem_app_054 (Advanced, Ans: B)
    pairs_054 = [
        ("Cationic vinyl polymerization", "III", "Initiated by Lewis acids (e.g. BF3 + trace H2O, AlCl3), favored by monomers with electron-donating groups like isobutylene", 
         "Cationic polymerization proceeds via carbocation intermediates; electron-donating alkyl or alkoxy substituents stabilize the carbocation, making isobutylene an ideal monomer for polyisobutylene"),
        ("Anionic vinyl polymerization", "IV", "Initiated by strong bases (e.g. KNH2, n-BuLi), favored by monomers with electron-withdrawing groups like acrylonitrile or styrene", 
         "Anionic polymerization proceeds through carbanion intermediates; electron-withdrawing groups (-CN, -COOR, -NO2) disperse the negative charge, allowing 'living' polymerization without spontaneous termination"),
        ("Coordination polymerization (Ziegler-Natta)", "I", "Heterogeneous catalyst TiCl4 + Al(C2H5)3, produces stereoregular isotactic or syndiotactic linear polyolefins without chain branching", 
         "Ziegler-Natta catalysts insert α-olefins stereospecifically into the titanium-carbon bond via a coordination template, producing unbranched isotactic polypropylene and HDPE"),
        ("Ring-opening polymerization (ROP)", "II", "Heating caprolactam at 533-543 K with water initiator generates 6-aminohexanoic acid which propels step-growth to Nylon-6", 
         "Caprolactam undergoes ring opening triggered by nucleophilic water attack at 533-543 K, relieving cyclic ring strain and producing linear linear polyamide Nylon-6")
    ]
    questions.append(make_matrix_q(
        "chem_app_054", TOPIC, "advanced",
        "Match each specialized ionic/coordination polymerization mechanism in List I with its catalyst system and monomer selectivity in List II:",
        pairs_054, "B"
    ))

    # chem_app_055 (Advanced, Ans: C)
    pairs_055 = [
        ("Initial electrophilic aromatic substitution of phenol with formaldehyde", "IV", "Formation of a mixture of ortho- and para-hydroxymethylphenols (o- and p-methylolphenols)", 
         "Formaldehyde acts as an electrophile in acid (protonated as +CH2OH) or base (generating phenoxide), attacking ortho and para positions of phenol to yield mono-, di-, and tri-methylolphenols"),
        ("Acid-catalyzed condensation of o-hydroxymethylphenol", "I", "Novolac, a linear fusible polymer where phenolic rings are linked through -CH2- groups at ortho positions", 
         "Under acidic conditions with excess phenol, o-methylolphenol loses H2O to generate a resonance-stabilized benzylic cation that alkylates another phenol ring, creating linear Novolac"),
        ("Heating Novolac with hexamethylenetetramine (resole / excess formaldehyde)", "II", "Extensive 3D cross-linking via methylene (-CH2-) bridges yielding infusible, insoluble Bakelite", 
         "When linear Novolac is heated with hexamethylenetetramine (which supplies formaldehyde and ammonia), cross-linking bridges form between remaining ortho and para positions, locking it into rigid Bakelite"),
        ("Base-catalyzed reaction with excess formaldehyde (Resole stage)", "III", "Formation of resoles containing reactive pendant methylol groups (-CH2OH) that thermoset upon heating", 
         "Base-catalyzed condensation with formaldehyde/phenol ratio > 1 produces resoles with abundant -CH2OH end groups, which self-condense on heating into resol resins without extra crosslinker")
    ]
    questions.append(make_matrix_q(
        "chem_app_055", TOPIC, "advanced",
        "Match each intermediate or stage in the synthesis of phenol-formaldehyde resins (Bakelite) in List I with its chemical structure/role in List II:",
        pairs_055, "C"
    ))

    # chem_app_056 (Advanced, Ans: D)
    pairs_056 = [
        ("Isotactic polymer", "I", "All asymmetric pendant substituent groups (e.g., -CH3 in polypropylene) lie on the same side of the extended carbon backbone", 
         "In isotactic polymers (like isotactic polypropylene), all chiral carbon stereocenters have identical configuration, orienting all pendant groups on the same face, promoting high crystallinity"),
        ("Syndiotactic polymer", "II", "Asymmetric pendant substituent groups alternate regularly from one side of the carbon backbone to the other", 
         "In syndiotactic polymers, the pendant substituents regularly alternate positions (stereocenters alternate R and S configuration), forming crystalline, high-melting polymers"),
        ("Atactic polymer", "III", "Asymmetric pendant substituent groups are randomly distributed along both sides of the polymer carbon backbone", 
         "In atactic polymers, pendant groups are arranged randomly with no stereoregularity, preventing chain crystallization and producing soft, amorphous, low-melting materials"),
        ("Cis-trans isomerism in polyalkadienes", "IV", "Cis-1,4-polyisoprene has non-crystalline flexible coils, whereas trans-1,4-polyisoprene (gutta-percha) packs into rigid crystalline sheets", 
         "The cis isomer contains bent conformations that resist regular packing, conferring elasticity; the trans isomer has an extended planar zigzag conformation that crystallizes readily")
    ]
    questions.append(make_matrix_q(
        "chem_app_056", TOPIC, "advanced",
        "Match each stereochemical or structural isomerism in polymers in List I with its molecular orientation in List II:",
        pairs_056, "D"
    ))

    # chem_app_057 (Advanced, Ans: A)
    pairs_057 = [
        ("Role of sulfur in vulcanization at 373-415 K", "II", "Forms mono-, di-, and polysulfide (-Sx-) covalent cross-links at reactive allylic positions across polyisoprene chains", 
         "Heating raw rubber with sulfur at 373-415 K initiates radical attack at reactive allylic C-H bonds, establishing -Sx- disulfide and polysulfide cross-links between adjacent chains"),
        ("Ebonite / Hard rubber formation", "IV", "Achieved by incorporating ~30% sulfur, completely saturating double bonds and creating an intensely cross-linked rigid thermoset", 
         "When natural rubber is vulcanized with large quantities of sulfur (~30-35%), virtually all double bonds become heavily cross-linked, yielding ebonite, a rigid electrical insulator"),
        ("Role of ZnO in rubber vulcanization", "I", "Acts as an inorganic activator with fatty acid (stearic acid) to accelerate sulfur cross-linking kinetics", 
         "Zinc oxide reacts with stearic acid to form soluble zinc stearate complexes, which activate sulfur and accelerators (e.g. mercaptobenzothiazole), reducing curing time and temperature"),
        ("Elimination of tackiness and plastic flow in rubber", "III", "Cross-linking converts the thermoplastic, viscous unvulcanized rubber into an elastic, non-sticky 3D elastomer", 
         "Unvulcanized rubber is soft and tacky at high temperatures and brittle at low temperatures; sulfur cross-links prevent irreversible chain slippage, rendering the material elastic across wide temperatures")
    ]
    questions.append(make_matrix_q(
        "chem_app_057", TOPIC, "advanced",
        "Match each vulcanization mechanism / rubber chemistry detail in List I with its molecular description in List II:",
        pairs_057, "A"
    ))

    # chem_app_058 (Advanced, Ans: B)
    pairs_058 = [
        ("Kevlar (poly-p-phenyleneterephthalamide)", "III", "Aromatic polyamide featuring rigid linear phenylene rings and inter-chain hydrogen bonds, creating bulletproof fibers", 
         "Kevlar is an aramid synthesized from 1,4-diaminobenzene and terephthaloyl chloride; its rigid aromatic rings and extensive trans-amide hydrogen bonding give tensile strength 5x steel"),
        ("Polycarbonate (Lexan)", "IV", "Linear polyester of bisphenol A and phosgene with high impact resistance and optical clarity used in safety goggles", 
         "Condensation of bisphenol A with phosgene (COCl2) yields polycarbonates containing repeating carbonate (-O-CO-O-) linkages, renowned for transparency and extraordinary impact resistance"),
        ("Polymethyl methacrylate (PMMA / Plexiglas)", "I", "Transparent acrylic thermoplastic with outstanding light transmission and shatter resistance used as glass substitute", 
         "PMMA is formed by free radical polymerization of methyl methacrylate; with ~92% visible light transmittance and high UV resistance, it serves as shatterproof organic glass"),
        ("Polycyanoacrylate (Super Glue)", "II", "Rapidly undergoes anionic polymerization initiated by ambient surface moisture (OH-) to form strong instant adhesive bonds", 
         "Methyl or ethyl 2-cyanoacrylate has two strongly electron-withdrawing groups (-CN and -COOR); trace water or hydroxide on surfaces instantly initiates rapid anionic chain polymerization")
    ]
    questions.append(make_matrix_q(
        "chem_app_058", TOPIC, "advanced",
        "Match each specialized high-performance / biomedical polymer in List I with its unique structural feature and use in List II:",
        pairs_058, "B"
    ))

    # chem_app_059 (Advanced, Ans: C)
    pairs_059 = [
        ("Alternating copolymer", "IV", "Contains regularly alternating monomer units along the backbone: -A-B-A-B-A-B-A-B-", 
         "In alternating copolymerization (e.g. styrene and maleic anhydride), monomer reactivity ratios satisfy r1·r2 ~ 0, forcing perfectly alternating addition -(-A-B-)n-"),
        ("Block copolymer", "III", "Long contiguous homopolymer block of one monomer attached to a block of the second: -A-A-A-A-B-B-B-B-", 
         "Block copolymers are prepared by living anionic polymerization where a homopolymer block of A is sequentially grown, followed by addition and polymerization of monomer B"),
        ("Graft copolymer", "II", "Main homopolymer backbone of one monomer with covalently attached branched side chains of another monomer: -[A]n- with -[B]m branches", 
         "Graft copolymers (like high-impact polystyrene, HIPS) are formed by initiating radical polymerization of monomer B from radical sites generated along the preformed backbone of polymer A"),
        ("Statistical / Random copolymer", "I", "Monomer units are distributed along the chain according to reaction kinetics and monomer reactivity ratios: -A-B-B-A-B-A-A-B-", 
         "In random or statistical copolymers (like SBR), monomers A and B incorporate along the chain according to their relative concentrations and reactivity ratios without ordered sequence")
    ]
    questions.append(make_matrix_q(
        "chem_app_059", TOPIC, "advanced",
        "Match each copolymerization type / sequence in List I with its chain architecture in List II:",
        pairs_059, "C"
    ))

    # chem_app_060 (Advanced, Ans: D)
    pairs_060 = [
        ("Glass Transition Temperature (Tg)", "I", "Temperature above which amorphous polymer segments gain rotational mobility, transitioning from hard glassy to flexible rubbery state", 
         "Tg is the characteristic temperature at which long-range cooperative segmental motion of amorphous polymer chains begins; below Tg polymers are hard/brittle, above Tg they are flexible"),
        ("Melting Temperature (Tm)", "II", "Temperature at which ordered crystalline domains in semi-crystalline polymers collapse into a disordered liquid melt", 
         "Tm is a first-order thermodynamic phase transition where crystalline lamellae melt into an isotropic, disordered molten liquid phase with distinct latent heat of fusion"),
        ("Viscoelasticity in elastomers", "III", "Polymer chains uncoil upon stress application and recoil to original random coil conformation when stress is released due to entropic elasticity", 
         "When an elastomer is stretched, coiled chains align, decreasing conformational entropy; upon releasing stress, the entropic driving force (ΔS > 0) causes spontaneous retraction"),
        ("Chain transfer reaction in radical polymerization", "IV", "Abstraction of an atom (usually H) by growing radical from solvent, monomer, or polymer chain, modulating molecular weight or creating branches", 
         "In free radical polymerization, a growing chain radical abstracts an atom from another molecule, terminating itself while creating a new radical; intermolecular transfer generates branching (as in LDPE)")
    ]
    questions.append(make_matrix_q(
        "chem_app_060", TOPIC, "advanced",
        "Match each thermal and mechanical behavior of polymers in List I with its underlying molecular phenomenon in List II:",
        pairs_060, "D"
    ))

    return questions
