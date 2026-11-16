import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_alcohol_questions():
    qs = []
    t = "Alcohols Phenols and Ethers"

    # ==========================================
    # BEGINNER (chem_org1_061 - chem_org1_064)
    # ==========================================

    # chem_org1_061 (A)
    qs.append(make_matrix_q(
        "chem_org1_061", t, "beginner",
        "Match the analytical tests for distinguishing 1°, 2°, and 3° alcohols in List I with their observable behavior and chemistry in List II:",
        [
            ("Lucas reagent (conc. HCl + anhydrous ZnCl2) with 3° alcohol", "IV", "Immediate appearance of turbidity/cloudiness at room temperature", "Tertiary alcohols undergo instantaneous SN1 reaction via stable 3° carbocations to form insoluble tertiary alkyl chlorides, giving immediate turbidity"),
            ("Lucas reagent with 2° alcohol", "II", "Turbidity appears within 5 to 10 minutes at room temperature", "Secondary alcohols react at a moderate rate through 2° carbocations; cloudiness develops within several minutes upon standing at ambient temperature"),
            ("Victor Meyer's test with 1° alcohol", "I", "Blood-red coloration upon treatment with HNO2 followed by alkali", "Primary nitroalkane formed reacts with nitrous acid to yield nitrolic acid [R-C(=NOH)NO2], which dissolves in alkali to give an intensely red sodium salt"),
            ("Hot copper (Cu) catalyst at 573 K with 3° alcohol", "III", "Dehydration to an alkene (2-methylpropene from tert-butanol) instead of dehydrogenation", "Tertiary alcohols lack an alpha-hydrogen atom required for dehydrogenation; over hot copper at 300°C they undergo facile catalytic dehydration to alkenes")
        ],
        "A"
    ))

    # chem_org1_062 (B)
    qs.append(make_matrix_q(
        "chem_org1_062", t, "beginner",
        "Match the industrial and laboratory preparations of Phenol in List I with their characteristic reagents and steps in List II:",
        [
            ("Cumene (Isopropylbenzene) process", "III", "Air oxidation to cumene hydroperoxide followed by dilute H2SO4 cleavage yielding Phenol and Acetone", "Autoxidation of cumene gives cumene hydroperoxide; acid treatment catalyzes a phenyl migration to oxygen, breaking the molecule cleanly into phenol and valuable acetone"),
            ("Dow's industrial process", "I", "Chlorobenzene heated with 6-8% aqueous NaOH at 623 K and 300 atm followed by acidification", "Under extreme temperature and pressure, chlorobenzene hydrolyzes via an addition-elimination / benzyne pathway to sodium phenoxide, which gives phenol upon acidification"),
            ("From Aniline via Diazotization", "IV", "Reaction with NaNO2 + HCl at 273-278 K followed by warming with water or dilute acid", "Aniline forms benzenediazonium chloride at 0-5°C; gentle warming with water causes nucleophilic displacement of N2 gas by water, yielding phenol"),
            ("From Benzenesulfonic acid (Alkali fusion)", "II", "Fusion of sodium benzenesulfonate with solid NaOH at 573-623 K followed by acidification", "High-temperature fusion displaces the sulfonate group with oxide to form sodium phenoxide and sodium sulfite, affording phenol on acid workup")
        ],
        "B"
    ))

    # chem_org1_063 (C)
    qs.append(make_matrix_q(
        "chem_org1_063", t, "beginner",
        "Match the diagnostic chemical tests for Phenols in List I with their observable results in List II:",
        [
            ("Phenol + Neutral aqueous FeCl3 solution", "II", "Characteristic violet / purple coloration due to coordination complex formation", "Phenol coordinates to Fe3+ forming a colored hexakis(phenolate)ferrate(III) complex anion [Fe(OC6H5)6]3- with absorption in the visible region"),
            ("Phenol + Bromine water [Br2(aq)]", "IV", "Immediate decolourization and precipitation of white 2,4,6-tribromophenol", "In aqueous medium, phenol ionizes significantly to the phenoxide ion, which activates the ring immensely and undergoes rapid electrophilic tribromination at all ortho and para positions"),
            ("Phenol heated with Phthalic anhydride + conc. H2SO4, then poured into NaOH", "I", "Intense pink / magenta coloration of the indicator Phenolphthalein", "Condensation of two molecules of phenol with phthalic anhydride produces phenolphthalein, which develops a vivid pink color in alkaline solution due to extended quinonoid conjugation"),
            ("Liebermann's nitroso reaction of phenol", "III", "Deep blue / green coloration, turning red on dilution with water and restoring blue with excess alkali", "Phenol reacts with nitrous acid to form p-nitrosophenol, which condenses with another phenol molecule to form indophenol, an indicator whose conjugate base is intensely blue")
        ],
        "C"
    ))

    # chem_org1_064 (D)
    qs.append(make_matrix_q(
        "chem_org1_064", t, "beginner",
        "Match the Williamson ether synthesis reactants in List I with their primary reaction pathway and product in List II:",
        [
            ("Sodium ethoxide (CH3CH2ONa) + Ethyl bromide (CH3CH2Br)", "III", "Diethyl ether [(C2H5)2O] formed cleanly via standard bimolecular SN2 substitution", "Unshielded primary ethoxide attacks the unhindered primary carbon of bromoethane, displacing bromide via a clean SN2 pathway with minimal elimination"),
            ("Sodium tert-butoxide [(CH3)3CONa] + Methyl iodide (CH3I)", "I", "tert-Butyl methyl ether (MTBE) formed cleanly via SN2 attack on methyl carbon", "Methyl iodide possesses zero beta-hydrogens and cannot undergo elimination; the bulky tert-butoxide nucleophile displaces iodide cleanly via backside attack on methyl"),
            ("Sodium phenoxide (C6H5ONa) + Methyl iodide (CH3I)", "IV", "Anisole (Methoxybenzene) formed via SN2 attack of phenoxide on methyl iodide", "Phenoxide is an effective nucleophile that displaces iodide from methyl iodide cleanly, yielding the aromatic ether anisole without side-reactions"),
            ("Sodium ethoxide (CH3CH2ONa) + tert-Butyl bromide [(CH3)3CBr]", "II", "2-Methylpropene (Isobutylene) formed exclusively via E2 elimination (zero ether formed)", "Strongly basic ethoxide encounters severe steric crowding at the tertiary carbon; instead of substitution, it abstracts a beta-proton to trigger rapid E2 elimination")
        ],
        "D"
    ))

    # ==========================================
    # INTERMEDIATE (chem_org1_065 - chem_org1_072)
    # ==========================================

    # chem_org1_065 (A)
    qs.append(make_matrix_q(
        "chem_org1_065", t, "intermediate",
        "Match the ether cleavage reactions with concentrated Hydroiodic acid (HI) in List I with their stoichiometric products in List II:",
        [
            ("Anisole (Methoxybenzene) + 1 equivalent of HI heated", "IV", "Phenol (C6H5OH) and Methyl iodide (CH3I)", "Protonation yields methylphenyl oxonium ion. The phenyl C-O bond has partial double-bond character due to resonance and cannot be cleaved; iodide attacks the methyl carbon via SN2 to yield phenol and CH3I"),
            ("tert-Butyl ethyl ether + 1 equivalent of cold HI", "II", "tert-Butyl iodide [(CH3)3CI] and Ethanol (CH3CH2OH)", "Cleavage proceeds through an SN1 mechanism because the tertiary tert-butyl carbocation is exceptionally stable; heterolysis yields (CH3)3C+ which captures iodide, leaving ethanol"),
            ("Methyl isopropyl ether + 1 equivalent of cold HI", "I", "Propan-2-ol (Isopropyl alcohol) and Methyl iodide (CH3I)", "Both groups are primary/secondary; cleavage proceeds through an SN2 pathway where iodide attacks the less sterically hindered methyl carbon preferentially"),
            ("Diethyl ether + excess concentrated HI heated", "III", "2 equivalents of Ethyl iodide (CH3CH2I) and 1 equivalent of Water", "First step yields ethyl iodide and ethanol; under excess hot HI, ethanol is protonated and converted into a second equivalent of ethyl iodide via nucleophilic substitution")
        ],
        "A"
    ))

    # chem_org1_066 (B)
    qs.append(make_matrix_q(
        "chem_org1_066", t, "intermediate",
        "Match the epoxide ring-opening reactions in List I with their regiochemical products and pathway descriptions in List II:",
        [
            ("2,2-Dimethyloxirane (Isobutylene oxide) + CH3OH in the presence of trace H2SO4 (acidic)", "III", "2-Methoxy-2-methylpropan-1-ol formed by nucleophilic attack at the more substituted tertiary carbon", "Under acidic conditions, the epoxide oxygen is protonated; the C-O bond to the tertiary carbon weakens substantially, developing significant carbocation character, directing nucleophile attack to C-2"),
            ("2,2-Dimethyloxirane + Sodium methoxide (CH3ONa) in CH3OH (basic/nucleophilic)", "I", "1-Methoxy-2-methylpropan-2-ol formed by nucleophilic attack at the less substituted primary carbon", "Under basic conditions, the strong methoxide nucleophile attacks the epoxide ring via a pure SN2 mechanism, attacking exclusively at the less sterically hindered primary carbon"),
            ("2-Methyloxirane (Propylene oxide) + HBr (acidic)", "IV", "1-Bromo-2-propanol formed predominantly by bromide attack at the more substituted secondary carbon", "Protonation of the oxygen atom polarizes the ring; partial positive charge develops preferentially at the secondary carbon, which is attacked by bromide"),
            ("Styrene oxide + Lithium aluminum hydride (LiAlH4) followed by H3O+", "II", "1-Phenylethanol formed by hydride attack at the primary CH2 carbon", "Hydride from LiAlH4 acts as a powerful unhindered nucleophile under basic conditions, attacking the less substituted terminal CH2 group via SN2 to leave the benzylic alcohol")
        ],
        "B"
    ))

    # chem_org1_067 (C)
    qs.append(make_matrix_q(
        "chem_org1_067", t, "intermediate",
        "Match the oxidation reagents in List I with their selective action on alcohols in List II:",
        [
            ("Pyridinium chlorochromate (PCC) in anhydrous CH2Cl2", "II", "Oxidizes 1° alcohols selectively to Aldehydes without over-oxidation to carboxylic acids", "PCC operates under strictly anhydrous non-aqueous conditions; because water is absent, the aldehyde cannot form a gem-diol hydrate, preventing further oxidation to carboxylic acid"),
            ("Jones reagent (CrO3 in aqueous H2SO4 and acetone)", "IV", "Oxidizes 1° alcohols to Carboxylic acids and 2° alcohols to Ketones rapidly", "In the presence of aqueous acid, the intermediate aldehyde forms a chromate ester through its gem-diol hydrate, undergoing immediate oxidation to a carboxylic acid"),
            ("Active Manganese dioxide (MnO2) in acetone", "I", "Selectively oxidizes allylic and benzylic alcohols while leaving saturated aliphatic alcohols untouched", "MnO2 is a mild heterogeneous oxidant whose radical mechanism selectively abstracts weak benzylic or allylic C-H bonds, preserving simple aliphatic hydroxyl groups"),
            ("Vapors of tert-Butanol passed over heated Copper at 573 K", "III", "Undergoes catalytic dehydration to 2-Methylpropene (Isobutylene) instead of dehydrogenation", "Tertiary alcohols lack an alpha-hydrogen atom needed for carbonyl formation; heated copper acts as a mild Lewis acid catalyst, promoting E1 dehydration to alkene")
        ],
        "C"
    ))

    # chem_org1_068 (D)
    qs.append(make_matrix_q(
        "chem_org1_068", t, "intermediate",
        "Match the named reactions of Phenol in List I with their principal products and reaction conditions in List II:",
        [
            ("Kolbe-Schmitt reaction: Phenol + NaOH + CO2 at 400 K and 4-7 atm followed by H3O+", "III", "Salicylic acid (2-hydroxybenzoic acid) formed via electrophilic carboxylation of phenoxide", "Sodium phenoxide reacts with weak electrophile CO2; chelation of sodium ion with carbonyl oxygen directs electrophilic attack specifically to the ortho position to yield salicylic acid"),
            ("Reimer-Tiemann reaction: Phenol + CHCl3 + aqueous KOH at 340 K followed by H3O+", "I", "Salicylaldehyde (2-hydroxybenzaldehyde) formed via electrophilic attack of :CCl2 carbene", "Dichlorocarbene generated in situ from chloroform attacks the activated phenoxide ring at the ortho position; alkaline hydrolysis of the resulting benzal chloride intermediate gives salicylaldehyde"),
            ("Azo coupling: Phenol + Benzenediazonium chloride at pH 9-10 and 273-278 K", "IV", "p-Hydroxyazobenzene (orange azo dye) formed via electrophilic aromatic substitution", "In weakly alkaline medium, phenol exists as phenoxide, which couples with benzenediazonium ion at the unhindered para position to form a brightly colored conjugated azo dye"),
            ("Nitration of Phenol with dilute HNO3 at 298 K", "II", "Mixture of ortho- and para-nitrophenol, easily separable by steam distillation", "Dilute nitric acid mononitrates phenol at room temperature; ortho-nitrophenol is steam-volatile due to intramolecular H-bonding, whereas para-nitrophenol has intermolecular H-bonding")
        ],
        "D"
    ))

    # chem_org1_069 (A)
    qs.append(make_matrix_q(
        "chem_org1_069", t, "intermediate",
        "Match the alcohol dehydration reactions in List I with their major alkene product and rearrangement mechanism in List II:",
        [
            ("3,3-Dimethylbutan-2-ol heated with conc. H2SO4", "IV", "2,3-Dimethylbut-2-ene formed as major tetrasubstituted alkene via 1,2-methide shift", "Protonation and loss of water yields a 2° carbocation [(CH3)3C-CH(+)-CH3]; rapid 1,2-methyl shift creates the more stable 3° carbocation [(CH3)2C(+)-CH(CH3)2], followed by Zaitsev elimination"),
            ("Butan-2-ol heated with 85% H3PO4 at 373 K", "II", "trans-But-2-ene formed as major disubstituted alkene following Zaitsev's rule", "Dehydration via a secondary butyl carbocation produces but-2-ene as the thermodynamic product, with trans favored over cis due to minimal steric hindrance"),
            ("Cyclopentylmethanol heated with concentrated acid", "I", "Cyclohexene formed as major product via Wagner-Meerwein ring expansion", "Loss of water gives a primary cyclobutylcarbinyl-like carbocation; migration of an endocyclic C-C sigma bond expands the 5-membered ring into a strain-free 6-membered cyclohexyl cation"),
            ("Ethanol heated with concentrated H2SO4 at 443 K (170°C)", "III", "Ethene (CH2=CH2) formed via bimolecular or unimolecular elimination of protonated ethanol", "At 443 K, beta-elimination dominates to produce ethene gas; at lower temperature (413 K), nucleophilic substitution by a second ethanol molecule produces diethyl ether")
        ],
        "A"
    ))

    # chem_org1_070 (B)
    qs.append(make_matrix_q(
        "chem_org1_070", t, "intermediate",
        "Match the substituted phenols in List I with their relative acidity (pKa values) and electronic rationale in List II:",
        [
            ("4-Nitrophenol (para-Nitrophenol)", "III", "pKa ~ 7.15; strongly acidic due to powerful combined -M and -I electron delocalization", "The para-nitro group can participate in direct through-resonance with the phenoxide negative charge, placing electron density directly onto the electronegative nitro oxygen atoms"),
            ("3-Nitrophenol (meta-Nitrophenol)", "I", "pKa ~ 8.36; moderately acidic due to -I effect only (mesomeric -M cannot operate from meta)", "At the meta position, the nitro group cannot directly conjugate with the phenoxide negative charge; stabilization of the phenoxide occurs solely through inductive electron withdrawal"),
            ("Phenol (unsubstituted)", "IV", "pKa ~ 9.95; baseline reference acidity stabilized by phenyl ring resonance delocalization", "Phenol is substantially more acidic than aliphatic alcohols because phenoxide negative charge is resonance-delocalized over the ortho and para positions of the aromatic ring"),
            ("4-Methylphenol (para-Cresol)", "II", "pKa ~ 10.26; less acidic than phenol due to electron donation by hyperconjugation and +I", "The methyl group donates electron density into the ring through hyperconjugation and inductive effect, increasing electron density on oxygen and destabilizing the phenoxide anion")
        ],
        "B"
    ))

    # chem_org1_071 (C)
    qs.append(make_matrix_q(
        "chem_org1_071", t, "intermediate",
        "Match the reduction transformations yielding alcohols in List I with their selective reducing agents in List II:",
        [
            ("Ethyl benzoate (C6H5COOCH2CH3) reduced to Benzyl alcohol and Ethanol", "II", "Lithium aluminum hydride (LiAlH4) in dry ether followed by acidic workup", "LiAlH4 is a powerful nucleophilic hydride donor capable of reducing esters cleanly to primary alcohols; milder reducing agents like NaBH4 are completely unreactive toward esters"),
            ("Acetophenone (C6H5COCH3) reduced to 1-Phenylethanol", "IV", "Sodium borohydride (NaBH4) in ethanol at room temperature", "NaBH4 is a mild and chemoselective reducing agent that rapidly reduces ketones and aldehydes to alcohols without reducing esters, amides, or carboxylic acids"),
            ("Crotonaldehyde (CH3-CH=CH-CHO) reduced selectively to Crotyl alcohol (CH3-CH=CH-CH2OH)", "I", "Sodium borohydride (NaBH4) in ethanol at low temperature", "NaBH4 selectively reduces the carbonyl group of alpha,beta-unsaturated aldehydes via 1,2-addition, preserving the conjugated carbon-carbon double bond intact"),
            ("Cyclohex-2-enone reduced selectively to Cyclohex-2-enol", "III", "Diisobutylaluminum hydride (DIBAL-H) at -78°C or Luche reagent (NaBH4 / CeCl3)", "Luche reduction or controlled DIBAL-H reduction cleanly conducts 1,2-hydride addition to the enone carbonyl, avoiding conjugate 1,4-reduction of the alkene")
        ],
        "C"
    ))

    # chem_org1_072 (D)
    qs.append(make_matrix_q(
        "chem_org1_072", t, "intermediate",
        "Match the vicinal polyols and alpha-hydroxy compounds in List I with their oxidative cleavage products with Periodic acid (HIO4) in List II:",
        [
            ("Ethane-1,2-diol (Ethylene glycol) + 1 mole of HIO4", "III", "2 moles of Methanal (Formaldehyde, HCHO)", "Periodic acid cleaves the C-C bond of 1,2-diols via a cyclic periodate ester intermediate; each primary alcohol carbon is oxidized to formaldehyde"),
            ("Propane-1,2,3-triol (Glycerol) + 2 moles of HIO4", "I", "2 moles of Formaldehyde (HCHO) and 1 mole of Methanoic acid (Formic acid, HCOOH)", "Glycerol has two adjacent vicinal diol linkages, requiring 2 moles of HIO4; the two terminal 1° carbons yield formaldehyde, while the central 2° carbon is oxidized to formic acid"),
            ("Pinacol (2,3-dimethylbutane-2,3-diol) + 1 mole of HIO4", "IV", "2 moles of Propan-2-one (Acetone)", "Cleavage of the central C-C bond between the two tertiary alcohol carbons oxidizes both carbinol centers to acetone molecules"),
            ("Benzoin [C6H5-CH(OH)-CO-C6H5] + 1 mole of HIO4", "II", "1 mole of Benzaldehyde (C6H5CHO) and 1 mole of Benzoic acid (C6H5COOH)", "HIO4 cleaves alpha-hydroxy ketones cleanly: the secondary alcohol carbon is oxidized to an aldehyde, while the carbonyl carbon is oxidized to a carboxylic acid")
        ],
        "D"
    ))

    # ==========================================
    # ADVANCED (chem_org1_073 - chem_org1_080)
    # ==========================================

    # chem_org1_073 (A)
    qs.append(make_matrix_q(
        "chem_org1_073", t, "advanced",
        "Match the pinacol-pinacolone rearrangement systems in List I with their mechanistic pathway and dominant ketone product in List II:",
        [
            ("1,2-Diphenylpropane-1,2-diol treated with concentrated H2SO4", "IV", "1,1-Diphenylpropan-2-one formed via preferential phenyl migration over methyl", "Protonation occurs preferentially at the tertiary benzylic carbon to generate the more stable benzylic cation; migration of the phenyl group occurs faster than methyl due to superior migratory aptitude"),
            ("1,1-Diphenyl-2-methylpropane-1,2-diol treated with acid", "II", "3,3-Diphenylbutan-2-one formed via regioselective carbocation formation and methyl migration", "Protonation and water loss occurs selectively at the carbon with two phenyl groups to form a resonance-stabilized benzhydryl cation; 1,2-methyl shift follows to give an oxocarbenium ion"),
            ("1-(p-Methoxyphenyl)-1-phenylethane-1,2-diol treated with acid", "I", "p-Anisyl group migrates faster than phenyl group by a factor of ~500", "The strong electron-donating (+M) methoxy group stabilizes the developing positive charge in the bridged phenonium ion transition state, dramatically accelerating aryl migration"),
            ("1,1'-Bicyclopentyl-1,1'-diol treated with concentrated acid", "III", "Spiro[4.5]decan-6-one formed via pinacol rearrangement with ring expansion", "Protonation and dehydration of one cyclopentyl carbinol creates a tertiary carbocation; migration of an adjacent ring C-C bond expands one cyclopentane into a cyclohexane, yielding a spiro ketone")
        ],
        "A"
    ))

    # chem_org1_074 (B)
    qs.append(make_matrix_q(
        "chem_org1_074", t, "advanced",
        "Match the thermal and Lewis acid-catalyzed rearrangements of phenol derivatives in List I with their reaction characteristics in List II:",
        [
            ("Phenyl acetate + anhydrous AlCl3 at 298 K (room temperature)", "III", "4-Hydroxyacetophenone (para-isomer) formed as major product under kinetic control", "At lower temperatures, electrophilic attack of the acylium ion on the phenol ring is kinetically favored at the unhindered para position, giving predominantly the p-isomer"),
            ("Phenyl acetate + anhydrous AlCl3 at 433 K (160°C)", "I", "2-Hydroxyacetophenone (ortho-isomer) formed as major product under thermodynamic control", "At elevated temperatures, the Fries rearrangement is reversible; the ortho-hydroxy isomer is thermodynamically stabilized by a strong six-membered intramolecular hydrogen bond"),
            ("Allyl phenyl ether heated to 473 K (200°C) without catalyst", "IV", "2-Allylphenol formed via concerted [3,3]-sigmatropic Claisen rearrangement with chain inversion", "Thermal rearrangement proceeds through a cyclic 6-membered pericyclic transition state, migrating the allyl group to the ortho position with inversion of the allylic chain (gamma-carbon attaches to ring)"),
            ("Allyl 2,6-dimethylphenyl ether heated to 473 K", "II", "4-Allyl-2,6-dimethylphenol formed via tandem Claisen-Cope rearrangements (double inversion)", "Both ortho positions are blocked by methyl groups; initial Claisen shift gives a 6-allyl-2,6-dienone, which undergoes a second [3,3]-Cope rearrangement to the para position, restoring the original allyl orientation")
        ],
        "B"
    ))

    # chem_org1_075 (C)
    qs.append(make_matrix_q(
        "chem_org1_075", t, "advanced",
        "Match the Reimer-Tiemann and related abnormal reactions in List I with their specialized mechanistic outcome in List II:",
        [
            ("Phenol + Carbon tetrachloride (CCl4) + aqueous KOH at 340 K", "II", "Salicylic acid (2-hydroxybenzoic acid) formed instead of salicylaldehyde", "Trichloromethyl cation/radical intermediate adds to phenoxide; hydrolysis of the resulting gem-trichloride (-CCl3) yields a carboxylic acid directly rather than an aldehyde"),
            ("4-Methylphenol (p-Cresol) + CHCl3 + aqueous KOH", "IV", "2-Hydroxy-5-methylbenzaldehyde plus abnormal 4-methyl-4-(dichloromethyl)cyclohexa-2,5-dien-1-one", "Dichlorocarbene attacks the para-position bearing the methyl group; because no hydrogen is available at C-4 for rearomatization, the intermediate is trapped as a stable dienone adduct"),
            ("Pyrrole + CHCl3 + sodium ethoxide", "I", "3-Chloropyridine formed via dichlorocarbene addition and ring expansion", "Dichlorocarbene adds across the C=C bond of pyrrole to form a bicyclic cyclopropane intermediate, which undergoes spontaneous ring expansion with elimination of HCl to yield 3-chloropyridine"),
            ("Phenol + CHCl3 + KOH conducted in D2O solvent", "III", "Forms salicylaldehyde with deuterium incorporated exclusively into the formyl (-CDO) group", "The alpha-hydrogen abstracted from chloroform is replaced during hydrolysis; incorporation of D from solvent confirms that the formyl hydrogen originates from the chloroform C-H bond")
        ],
        "C"
    ))

    # chem_org1_076 (D)
    qs.append(make_matrix_q(
        "chem_org1_076", t, "advanced",
        "Match the oxidative coupling and quinone synthesis reactions of phenols in List I with their chemical transformations in List II:",
        [
            ("Phenol + alkaline Potassium persulfate [K2S2O8] (Elbs persulfate oxidation)", "III", "Quinol (Hydroquinone / Benzene-1,4-diol) formed as major dihydric phenol", "Persulfate attacks the phenoxide ion at the para position to form a potassium phenyl sulfate ester, which hydrolyzes under acid to yield hydroquinone"),
            ("Phenol + Fremy's salt [Potassium nitrosodisulfonate, (KSO3)2NO.]", "I", "Cyclohexa-2,5-diene-1,4-dione (1,4-Benzoquinone) formed cleanly under mild neutral conditions", "Fremy's salt is a persistent radical that abstracts a phenolic hydrogen to generate a phenoxy radical, which is subsequently oxidized to 1,4-benzoquinone in high yield"),
            ("Phenol + acidified Sodium dichromate (Na2Cr2O7 / H2SO4)", "IV", "1,4-Benzoquinone formed by extensive oxidative degradation of the aromatic ring", "Chromic acid oxidizes phenol across the 1,4-positions with dearomatization, yielding conjugated yellow 1,4-benzoquinone"),
            ("2,6-Di-tert-butylphenol + alkaline Potassium ferricyanide [K3Fe(CN)6]", "II", "3,3',5,5'-Tetra-tert-butyldiphenoquinone formed via persistent phenoxy radical coupling", "Bulky tert-butyl groups sterically shield the phenoxy radical, preventing ortho coupling; two phenoxy radicals couple selectively at the para positions, followed by oxidation to diphenoquinone")
        ],
        "D"
    ))

    # chem_org1_077 (A)
    qs.append(make_matrix_q(
        "chem_org1_077", t, "advanced",
        "Match the stereospecific epoxide ring-opening reactions in List I with their exact stereochemical products in List II:",
        [
            ("trans-2,3-Dimethyloxirane + aqueous H3O+ (acidic hydrolysis)", "IV", "meso-Butane-2,3-diol formed stereospecifically via anti-ring-opening with inversion", "Protonation creates a symmetric oxonium ion; water attacks from the backside opposite the epoxide C-O bond (inversion at one carbon), transforming the trans isomer into the meso diol"),
            ("cis-2,3-Dimethyloxirane + aqueous H3O+ (acidic hydrolysis)", "II", "Racemic (±)-butane-2,3-diol formed via anti-ring-opening with inversion", "Backside attack of water on the symmetric cis-epoxide occurs with equal probability at C-2 or C-3, producing an equimolar mixture of (2R,3R) and (2S,3S) enantiomers"),
            ("(R)-2-Methyloxirane + Sodium methoxide (CH3ONa) in CH3OH", "I", "(R)-1-Methoxypropan-2-ol formed with complete retention of stereocenters at C-2", "Under basic conditions, methoxide attacks the sterically accessible primary C-1 carbon via SN2; the chiral center at C-2 is untouched, retaining its (R) configuration"),
            ("(R)-2-Methyloxirane + CH3OH / catalytic H2SO4", "III", "(S)-2-Methoxypropan-1-ol formed with predominant inversion of configuration at C-2", "Under acidic conditions, methanol attacks preferentially at the more substituted secondary C-2 carbon (which bears more positive charge), inverting configuration from (R) to (S)")
        ],
        "A"
    ))

    # chem_org1_078 (B)
    qs.append(make_matrix_q(
        "chem_org1_078", t, "advanced",
        "Match the dihydroxylation and diol cleavage systems in List I with their stereochemical mechanisms in List II:",
        [
            ("Cyclohexene + OsO4 / NMO (Upjohn dihydroxylation)", "III", "cis-Cyclohexane-1,2-diol formed stereospecifically via cyclic osmate ester (syn-addition)", "OsO4 adds both oxygens simultaneously to the same face of the alkene in a concerted [3+2] cycloaddition, forming a cyclic osmate ester that hydrolyzes to cis-diol"),
            ("Cyclohexene + m-CPBA followed by aqueous H3O+", "I", "trans-Cyclohexane-1,2-diol formed stereospecifically via anti-dihydroxylation", "Epoxidation yields cyclohexene oxide; subsequent acid-catalyzed nucleophilic ring opening by water occurs with anti-periplanar backside attack, giving the trans-diol"),
            ("Rate of HIO4 cleavage: cis-Cyclohexane-1,2-diol vs trans-Cyclohexane-1,2-diol", "IV", "cis-Diol oxidizes ~10^3 times faster because both OH groups can form a planar cyclic periodate ester", "Periodic acid cleavage requires forming a bidentate cyclic 5-membered periodate intermediate; in the rigid cis isomer both hydroxyls point favorably to bridge the iodine atom"),
            ("Cyclohexene + I2 / CH3COOAg in wet acetic acid (Woodward dihydroxylation)", "II", "cis-Cyclohexane-1,2-diol formed via neighboring group participation and acetoxonium hydrolysis", "Trans-iodoacetate forms initially; neighboring group participation of acetate displaces iodide to form a cyclic acetoxonium ion, which hydrolyzes under wet conditions with retention to give cis-diol")
        ],
        "B"
    ))

    # chem_org1_079 (C)
    qs.append(make_matrix_q(
        "chem_org1_079", t, "advanced",
        "Match the ether autoxidation, safety hazards, and crown ethers in List I with their physical/chemical principles in List II:",
        [
            ("Diethyl ether standing in transparent glass bottle exposed to air and light", "II", "Forms dangerously explosive 1-Ethoxyethyl hydroperoxide via free-radical autoxidation", "Light initiates hydrogen abstraction from the ether alpha-carbon (stabilized by adjacent ether oxygen lone pair), generating an alpha-radical that combines with molecular oxygen to form explosive peroxides"),
            ("Testing diethyl ether for hazardous organic peroxides", "IV", "Addition of acidified FeSO4 followed by aqueous KCNS yields an intense blood-red color", "Peroxides oxidize Fe2+ to Fe3+; the newly formed Fe3+ reacts with thiocyanate (SCN-) to produce the characteristic deep blood-red complex [Fe(SCN)]2+"),
            ("18-Crown-6 selective binding and phase transfer catalysis", "I", "Selectively complexes Potassium cation (K+) inside its 2.6-3.2 A cavity, producing 'purple benzene'", "The cavity size of 18-crown-6 perfectly accommodates K+ (ionic diameter 2.66 A); complexing K+ solubilizes KMnO4 in non-polar benzene, creating unsolvated super-reactive permanganate"),
            ("15-Crown-5 selective binding", "III", "Selectively coordinates Sodium cation (Na+) due to matching ionic cavity diameter (~1.7-2.2 A)", "The cavity of the 15-membered ring is tailored specifically to encapsulate Na+ cations, facilitating the dissolution of sodium salts in organic media")
        ],
        "C"
    ))

    # chem_org1_080 (D)
    qs.append(make_matrix_q(
        "chem_org1_080", t, "advanced",
        "Match the steps and mechanisms of the Cumene Hydroperoxide rearrangement in List I with their chemical basis in List II:",
        [
            ("Protonation of cumene hydroperoxide: [Ph-C(CH3)2-O-OH + H+ -> Ph-C(CH3)2-O-OH2+]", "III", "Triggers concerted 1,2-phenyl migration to electron-deficient oxygen with simultaneous departure of H2O", "Water is a good leaving group; as water departs from oxygen, the phenyl group migrates concerted with its pair of bonding electrons, avoiding an energetically prohibitive free oxyl cation (O+)"),
            ("Exclusive migration of phenyl over methyl in cumene hydroperoxide", "I", "Aryl migratory aptitude vastly exceeds alkyl due to bridging phenonium-like transition state", "The pi-electrons of the benzene ring actively participate in forming a stabilized bridged phenonium ion transition state, making phenyl migration infinitely faster than methyl migration"),
            ("Hydrolysis of the resulting oxonium hemiketal intermediate", "IV", "Addition of water followed by proton transfer cleaves the intermediate into Phenol and Propan-2-one", "Attack of water generates a hemiacetal-like species [Ph-O-C(OH)(CH3)2], which collapses rapidly to eject stable phenol and form the carbonyl group of acetone"),
            ("Rearrangement of 1-(p-nitrophenyl)-1-methylethyl hydroperoxide", "II", "Reacts at an extremely slow rate because the electron-withdrawing nitro group deactivates phenyl migration", "The strong -M and -I effects of the nitro group deplete electron density from the migrating ring, destabilizing the bridged phenonium transition state and retarding rearrangement")
        ],
        "D"
    ))

    return qs
