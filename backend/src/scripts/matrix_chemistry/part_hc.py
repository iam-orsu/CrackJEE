import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_hc_questions():
    qs = []
    t = "Hydrocarbons"

    # ==========================================
    # BEGINNER (chem_org1_021 - chem_org1_024)
    # ==========================================

    # chem_org1_021 (A)
    qs.append(make_matrix_q(
        "chem_org1_021", t, "beginner",
        "Match the alkane reactions and preparation methods in List I with their characteristic products and features in List II:",
        [
            ("Methane + Cl2 in presence of diffuse sunlight (hv)", "IV", "Chloromethane (CH3Cl) along with HCl via a free-radical chain reaction", "Homolytic fission of Cl2 produces chlorine free radicals which abstract hydrogen from methane, propagating a chain reaction that yields chloromethane and successive chlorinated methanes"),
            ("Methyl iodide + Na in dry ether (Wurtz reaction)", "II", "Ethane (C2H6) formed by symmetrical coupling of alkyl radicals", "In the Wurtz reaction, sodium metal donates single electrons to methyl iodide, generating methyl radicals or carbanions that couple to produce symmetrical ethane"),
            ("Sodium acetate + Soda-lime (NaOH + CaO) heated", "I", "Methane (CH4) produced by decarboxylation with elimination of Na2CO3", "Heating sodium carboxylate with soda-lime causes loss of the carboxyl carbon as sodium carbonate, yielding the alkane with one less carbon atom (CH4)"),
            ("n-Hexane passed over Cr2O3-Al2O3 catalyst at 773 K and 10-20 atm", "III", "Benzene (C6H6) formed through simultaneous cyclization and dehydrogenation (aromatization)", "Catalytic reforming / aromatization of alkanes having 6 or more carbons at high temperature and pressure cyclizes n-hexane into benzene with evolution of hydrogen")
        ],
        "A"
    ))

    # chem_org1_022 (B)
    qs.append(make_matrix_q(
        "chem_org1_022", t, "beginner",
        "Match the alkyne transformations in List I with the stereochemical/structural nature of their products in List II:",
        [
            ("But-2-yne + H2 in the presence of Lindlar's catalyst (Pd/CaCO3, quinoline)", "III", "cis-But-2-ene formed stereospecifically via syn-addition of hydrogen", "Lindlar's catalyst is a poisoned palladium catalyst that arrests hydrogenation at the alkene stage, transferring two hydrogen atoms from the catalyst surface to the same face of the alkyne (syn-addition) to give the (Z) or cis-alkene"),
            ("But-2-yne + Na in liquid NH3 at -33°C (Birch reduction)", "I", "trans-But-2-ene formed stereoselectively via anti-addition through a trans-radical-anion", "Dissolving metal reduction in liquid ammonia proceeds via sequential electron and proton additions; steric repulsion in the radical-anion intermediate favors the trans conformation, yielding the (E) or trans-alkene"),
            ("Ethyne passed through a red-hot iron tube at 873 K", "IV", "Benzene (C6H6) produced through cyclic trimerization of three acetylene molecules", "Three ethyne molecules undergo thermal cyclotrimerization over red-hot iron to form the aromatic benzene ring"),
            ("Propyne passed through a red-hot iron tube at 873 K", "II", "1,3,5-Trimethylbenzene (Mesitylene) formed by symmetrical cyclic trimerization", "Cyclotrimerization of propyne yields 1,3,5-trimethylbenzene (mesitylene) as the predominant symmetrical aromatic isomer")
        ],
        "B"
    ))

    # chem_org1_023 (C)
    qs.append(make_matrix_q(
        "chem_org1_023", t, "beginner",
        "Match the diagnostic chemical tests in List I with their observable results and chemistry in List II:",
        [
            ("Propyne + Ammoniacal silver nitrate solution (Tollens' reagent)", "II", "Formation of a white precipitate of silver propynide (Ag-C#C-CH3)", "The sp-hybridized terminal alkyne carbon is sufficiently acidic (pKa ~ 25) to be deprotonated by ammoniacal AgNO3, precipitating an insoluble heavy metal acetylide"),
            ("Propyne + Ammoniacal cuprous chloride (Cu2Cl2) solution", "IV", "Formation of a characteristic red precipitate of copper propynide (Cu-C#C-CH3)", "Ammoniacal cuprous chloride reacts with terminal alkynes containing acidic acetylenic hydrogen to form a dense red precipitate of copper acetylide"),
            ("Ethene passed through Bromine in CCl4 solution", "I", "Decolourization of the reddish-brown bromine solution without evolution of HBr", "Electrophilic addition of Br2 across the C=C double bond forms 1,2-dibromoethane, consuming the reddish-brown molecular bromine rapidly"),
            ("But-2-ene + Cold, dilute, alkaline KMnO4 (Baeyer's reagent)", "III", "Disappearance of purple KMnO4 color and deposition of a dark brown MnO2 precipitate", "Baeyer's reagent causes syn-dihydroxylation of the alkene to yield butane-2,3-diol while permanganate is reduced to manganese dioxide")
        ],
        "C"
    ))

    # chem_org1_024 (D)
    qs.append(make_matrix_q(
        "chem_org1_024", t, "beginner",
        "Match each electrophilic aromatic substitution of benzene in List I with its generating reagent and active attacking electrophile in List II:",
        [
            ("Nitration of benzene", "III", "Nitronium ion (NO2+) generated from conc. HNO3 and conc. H2SO4", "Sulfuric acid acts as a Bronsted acid to protonate nitric acid; subsequent loss of water generates the linear nitronium electrophile (:O=N+=O:)"),
            ("Sulfonation of benzene", "I", "Neutral sulfur trioxide (SO3) present in fuming sulfuric acid (oleum)", "SO3 contains an intensely electron-deficient sulfur atom flanked by three strongly electronegative oxygen atoms, acting as a powerful neutral electrophile in EAS"),
            ("Halogenation (Chlorination) of benzene", "IV", "Chloronium-like polarized complex (Cl+ ... FeCl4-) generated using Cl2 and anhydrous FeCl3", "The Lewis acid FeCl3 polarizes the Cl-Cl bond, forming an electrophilic complex that transfers Cl+ to the aromatic pi system"),
            ("Friedel-Crafts alkylation of benzene", "II", "Carbocation / polarized alkyl complex (CH3+ ... AlCl4-) generated from CH3Cl and anhydrous AlCl3", "Anhydrous aluminum chloride abstracts chloride from methyl chloride, creating an incipient or free methyl carbocation electrophile that attacks the benzene ring")
        ],
        "D"
    ))

    # ==========================================
    # INTERMEDIATE (chem_org1_025 - chem_org1_032)
    # ==========================================

    # chem_org1_025 (A)
    qs.append(make_matrix_q(
        "chem_org1_025", t, "intermediate",
        "Match the alkene stereoisomers and addition reagents in List I with the exact stereochemical outcome in List II:",
        [
            ("cis-But-2-ene + Br2 in CCl4", "IV", "Racemic (±)-2,3-dibromobutane formed via anti-addition through a cyclic bromonium ion", "Bromination proceeds via anti-addition. Addition of Br2 from opposite faces across the cis-alkene generates a 1:1 mixture of non-superimposable (2R,3R) and (2S,3S) enantiomers (racemic pair)"),
            ("trans-But-2-ene + Br2 in CCl4", "II", "meso-2,3-Dibromobutane formed via stereospecific anti-addition", "Anti-addition of bromine across trans-but-2-ene yields the (2R,3S) stereoisomer, which possesses an internal plane of symmetry and is optically inactive (meso)"),
            ("cis-But-2-ene + Cold dilute alkaline KMnO4", "I", "meso-Butane-2,3-diol formed via stereospecific syn-dihydroxylation", "KMnO4 adds both hydroxyl groups to the same face (syn-addition) via a cyclic cyclic hypomanganate ester intermediate, converting the cis-alkene into the meso diol"),
            ("trans-But-2-ene + Cold dilute alkaline KMnO4", "III", "Racemic (±)-butane-2,3-diol formed via stereospecific syn-dihydroxylation", "Syn-addition of two OH groups to the trans alkene produces a pair of enantiomers (2R,3R and 2S,3S) resulting in an optically inactive racemic mixture")
        ],
        "A"
    ))

    # chem_org1_026 (B)
    qs.append(make_matrix_q(
        "chem_org1_026", t, "intermediate",
        "Match the alkene additions in List I with their mechanistic pathway and dominant product in List II:",
        [
            ("Propene + HBr (in dark, absence of peroxides)", "III", "2-Bromopropane formed via electrophilic addition following Markovnikov's rule", "Electrophilic protonation creates the more stable secondary isopropyl carbocation rather than the primary propyl carbocation; subsequent bromide attack yields 2-bromopropane"),
            ("Propene + HBr in presence of Benzoyl peroxide (hv)", "I", "1-Bromopropane formed via free-radical addition (Kharasch / Peroxide effect)", "Benzoyl peroxide generates bromine free radicals (Br.), which add regioselectively to C-1 to form the more stable secondary radical, followed by H-abstraction to yield 1-bromopropane"),
            ("3,3-Dimethylbut-1-ene + HCl", "IV", "2-Chloro-2,3-dimethylbutane formed via 1,2-methide shift in carbocation intermediate", "Protonation yields a 2° carbocation [(CH3)3C-CH(+)-CH3], which undergoes a rapid 1,2-methyl shift to the far more stable 3° carbocation [(CH3)2C(+)-CH(CH3)2], followed by chloride capture"),
            ("3-Methylbut-1-ene + HCl", "II", "2-Chloro-2-methylbutane formed via 1,2-hydride shift in carbocation intermediate", "Protonation gives a 2° carbocation [(CH3)2CH-CH(+)-CH3], which undergoes a rapid 1,2-hydride shift to form the tertiary carbocation [(CH3)2C(+)-CH2CH3], yielding 2-chloro-2-methylbutane")
        ],
        "B"
    ))

    # chem_org1_027 (C)
    qs.append(make_matrix_q(
        "chem_org1_027", t, "intermediate",
        "Match the alkyne reaction systems in List I with the major organic products formed in List II:",
        [
            ("Propyne + dil. H2SO4, HgSO4 at 333 K (Kucherov reaction)", "II", "Propan-2-one (Acetone) formed by Markovnikov hydration followed by keto-enol tautomerism", "Hg2+ catalyzes electrophilic addition of water across the triple bond according to Markovnikov's rule to give prop-1-en-2-ol, which rapidly tautomerizes to acetone"),
            ("Propyne + (Sia)2BH followed by alkaline H2O2", "IV", "Propanal formed by anti-Markovnikov hydroboration-oxidation followed by tautomerism", "Sterically bulky disiamylborane adds boron to the less hindered terminal carbon (anti-Markovnikov); oxidation with H2O2/OH- yields prop-1-en-1-ol, which tautomerizes to propanal"),
            ("Ethyne + dil. H2SO4, HgSO4 at 333 K", "I", "Ethanal (Acetaldehyde) formed via vinyl alcohol intermediate", "Addition of water across ethyne gives ethenol (vinyl alcohol), which undergoes instantaneous keto-enol tautomerization to yield ethanal"),
            ("But-2-yne + Hot alkaline KMnO4 followed by acidification", "III", "2 moles of Ethanoic acid (Acetic acid) formed by oxidative cleavage of the triple bond", "Hot KMnO4 oxidatively cleaves internal alkynes completely; cleavage of symmetric but-2-yne produces two molecules of acetic acid")
        ],
        "C"
    ))

    # chem_org1_028 (D)
    qs.append(make_matrix_q(
        "chem_org1_028", t, "intermediate",
        "Match the alkenes and ozonolysis conditions in List I with the resulting carbonyl cleavage products in List II:",
        [
            ("2-Methylbut-2-ene + (i) O3, (ii) Zn / H2O", "III", "Propan-2-one (Acetone) and Ethanal (Acetaldehyde) (reductive cleavage)", "Ozonolysis with reductive Zn workup cleaves the C=C bond to carbonyls without over-oxidation; the tetrasubstituted side gives acetone, and the trisubstituted side gives acetaldehyde"),
            ("2-Methylbut-2-ene + (i) O3, (ii) H2O2", "I", "Propan-2-one (Acetone) and Ethanoic acid (Acetic acid) (oxidative cleavage)", "Under oxidative ozonolysis conditions with H2O2, ketone products remain unaffected, while aldehydes are oxidized to their corresponding carboxylic acids"),
            ("Cyclohexene + (i) O3, (ii) Zn / H2O", "IV", "Hexane-1,6-dial (Adipic dialdehyde) formed by endocyclic double bond cleavage", "Ozonolysis of an unsubstituted cyclic alkene opens the ring to give a single open-chain dicarbonyl compound with aldehyde groups at both ends"),
            ("2,3-Dimethylbut-2-ene + (i) O3, (ii) Zn / H2O", "II", "2 moles of Propan-2-one (Acetone) formed by symmetric cleavage", "The fully methylated alkene (CH3)2C=C(CH3)2 cleaves symmetrically to yield two equivalents of acetone")
        ],
        "D"
    ))

    # chem_org1_029 (A)
    qs.append(make_matrix_q(
        "chem_org1_029", t, "intermediate",
        "Match the alkene functionalization reactions in List I with their defining regiochemical and stereochemical features in List II:",
        [
            ("Hydroboration-Oxidation (BH3:THF then H2O2 / NaOH)", "IV", "Anti-Markovnikov regiochemistry with concerted syn-addition of H and OH across the double bond", "Boron coordinates to the less hindered carbon in a 4-membered cyclic transition state (syn addition); alkaline peroxide replaces boron with OH with complete retention of configuration"),
            ("Oxymercuration-Demercuration [Hg(OAc)2, H2O then NaBH4]", "II", "Markovnikov regiochemistry with anti-addition and complete absence of carbocation rearrangements", "Reaction proceeds through a cyclic mercurinium ion, preventing skeletal rearrangements; water attacks the more substituted carbon (anti), followed by reductive demercuration"),
            ("Epoxidation with meta-Chloroperbenzoic acid (m-CPBA)", "I", "Stereospecific syn-addition of an oxygen atom across the pi bond preserving alkene geometry", "A concerted pericyclic transfer of oxygen from the peracid to the alkene preserves the cis/trans configuration of the substituents into the oxirane ring"),
            ("Halohydrin formation (Alkene + Br2 / H2O)", "III", "Regioselective anti-addition where OH attacks the more substituted carbon via cyclic bromonium ion", "Water acts as the nucleophile, opening the unsymmetrical cyclic bromonium ion at the more substituted carbon (which carries more partial positive charge) from the anti face")
        ],
        "A"
    ))

    # chem_org1_030 (B)
    qs.append(make_matrix_q(
        "chem_org1_030", t, "intermediate",
        "Match the substituted benzene derivatives in List I with their EAS reactivity and orienting influence in List II:",
        [
            ("Anisole (-OCH3)", "III", "Strongly activating, ortho/para-directing due to powerful +M mesomeric electron donation", "The oxygen atom donates its non-bonding lone pair into the aromatic ring (+M > -I), greatly stabilizing the arenium ion at the ortho and para positions"),
            ("Nitrobenzene (-NO2)", "I", "Strongly deactivating, meta-directing due to combined -M and -I electron withdrawal", "The positively charged nitrogen atom pulls pi and sigma electron density from the ring; ortho/para attack places a positive charge directly on the nitrogen-bearing carbon, making meta attack relatively favored"),
            ("Chlorobenzene (-Cl)", "IV", "Deactivating overall due to strong -I effect, but ortho/para-directing due to +M resonance", "Chlorine is more electronegative than carbon (-I > +M, deactivating the ring); however, its lone pairs provide resonance stabilization (+M) exclusively to the ortho/para arenium intermediates"),
            ("Toluene (-CH3)", "II", "Moderately activating, ortho/para-directing through hyperconjugation and +I effect", "The methyl group donates electron density into the ring through sigma-pi hyperconjugation (3 alpha-C-H bonds) and weak inductive (+I) effect, favoring electrophilic attack at ortho and para positions")
        ],
        "B"
    ))

    # chem_org1_031 (C)
    qs.append(make_matrix_q(
        "chem_org1_031", t, "intermediate",
        "Match the hydrocarbon preparation methods in List I with the primary hydrocarbon products obtained in List II:",
        [
            ("Electrolysis of aqueous potassium propanoate (Kolbe electrolysis)", "II", "Butane (CH3CH2CH2CH3) formed via anodic decarboxylation and radical dimerization", "Propanoate anion loses an electron at the anode to form propanoate radical, which spontaneously decarboxylates into ethyl radical; two ethyl radicals dimerize to give butane"),
            ("Electrolysis of aqueous potassium succinate (Kolbe synthesis)", "IV", "Ethene (CH2=CH2) formed via bis-decarboxylation of a saturated 1,4-dicarboxylate", "Kolbe electrolysis of succinate generates a 1,2-diradical intermediate that undergoes instantaneous bond formation to produce ethene gas"),
            ("Electrolysis of aqueous potassium maleate", "I", "Ethyne (CH#CH) formed via anodic bis-decarboxylation of an unsaturated dicarboxylate", "Maleate ion undergoes anodic oxidation and loss of two CO2 molecules to generate ethyne (acetylene) gas at the anode"),
            ("Corey-House synthesis: Lithium dimethylcuprate [(CH3)2CuLi] + 1-Bromopropane", "III", "Butane (CH3CH2CH2CH3) formed via cross-coupling without disproportionation", "Gilman reagent (CH3)2CuLi couples cleanly with primary alkyl halides via nucleophilic cross-coupling, cleanly yielding unsymmetrical or symmetrical alkanes without Wurtz side-products")
        ],
        "C"
    ))

    # chem_org1_032 (D)
    qs.append(make_matrix_q(
        "chem_org1_032", t, "intermediate",
        "Match the free-radical halogenation systems in List I with their selectivity and product distribution in List II:",
        [
            ("Isobutane [(CH3)3CH] + Br2 / hv at 400 K", "III", ">99% 2-Bromo-2-methylpropane (tert-butyl bromide) due to extreme bromine radical selectivity", "Bromination is endothermic and follows the Hammond postulate; the transition state resembles the radical, giving tertiary C-H abstraction selectivity of 1600:82:1 over primary"),
            ("Isobutane [(CH3)3CH] + Cl2 / hv at 300 K", "I", "~64% 1-Chloro-2-methylpropane and ~36% 2-chloro-2-methylpropane due to low selectivity", "Chlorination is exothermic and early; relative rates for 3°:2°:1° are only 5.0:3.8:1.0. With nine 1° hydrogens (9x1.0=9.0) and one 3° hydrogen (1x5.0=5.0), the 1° chloride is the major product (9/14 ~ 64%)"),
            ("Toluene + NBS (N-bromosuccinimide) / hv", "IV", "Benzyl bromide (C6H5CH2Br) formed selectively via resonance-stabilized benzylic radical", "NBS maintains a very low steady-state concentration of Br2; allylic/benzylic hydrogen abstraction produces a resonance-delocalized benzylic free radical that captures Br"),
            ("Propene + Cl2 at 773 K (high temperature allylic chlorination)", "II", "Allyl chloride (CH2=CH-CH2Cl) formed preferentially over 1,2-addition", "At high temperatures (500°C), electrophilic addition of chlorine is reversible (thermodynamically disfavored), while free-radical abstraction of the weak allylic C-H bond dominates")
        ],
        "D"
    ))

    # ==========================================
    # ADVANCED (chem_org1_033 - chem_org1_040)
    # ==========================================

    # chem_org1_033 (A)
    qs.append(make_matrix_q(
        "chem_org1_033", t, "advanced",
        "Match the Friedel-Crafts reaction phenomena and workarounds in List I with their mechanistic basis in List II:",
        [
            ("Benzene + 1-Chloropropane in presence of anhydrous AlCl3", "IV", "Cumene (Isopropylbenzene) is obtained as major product (~70%) instead of n-propylbenzene", "The primary 1-chloropropane-AlCl3 complex undergoes a 1,2-hydride shift to form the more stable secondary isopropyl carbocation before electrophilic attack on the ring"),
            ("Benzene + Propanoyl chloride / AlCl3 followed by Zn(Hg) / conc. HCl", "II", "Pure n-Propylbenzene obtained without carbocation rearrangement", "Acylium ions (CH3CH2C+=O) are resonance stabilized and do not rearrange; subsequent Clemmensen reduction reduces the keto group cleanly to give unbranched n-propylbenzene"),
            ("Polyalkylation tendency in Friedel-Crafts alkylation of benzene", "I", "Alkyl groups activate the benzene ring, making the monoalkylated product more reactive than benzene itself", "Introduction of an electron-donating alkyl group increases electron density in the ring, accelerating further electrophilic substitution and yielding dialkyl and polyalkyl benzenes"),
            ("Failure of Nitrobenzene or Aniline to undergo Friedel-Crafts alkylation", "III", "Nitrobenzene is excessively deactivated (-M), while aniline complexes with AlCl3 forming a deactivating salt", "The strong electron withdrawal of -NO2 prevents carbocation attack, while the Lewis base -NH2 coordinates strongly to Lewis acid AlCl3 forming -NH2+-AlCl3-, strongly deactivating the aromatic ring")
        ],
        "A"
    ))

    # chem_org1_034 (B)
    qs.append(make_matrix_q(
        "chem_org1_034", t, "advanced",
        "Match the benzyne reactions and trapping phenomena in List I with their mechanistic descriptions in List II:",
        [
            ("o-Chlorotoluene + KNH2 in liquid NH3", "III", "Equimolar mixture of ortho-toluidine and meta-toluidine formed via elimination-addition (benzyne)", "Deprotonation and chloride loss produces 2,3-dehydrotoluene (a substituted benzyne); nucleophilic attack of amide ion (NH2-) occurs with equal ease at both ends of the triple bond"),
            ("Chlorobenzene-1-[14C] + NaNH2 in liquid NH3", "I", "50% Aniline-1-[14C] and 50% Aniline-2-[14C] formed via symmetrical benzyne intermediate", "Elimination of HCl forms benzyne with the labeled carbon involved in the formal triple bond; subsequent addition of NH3 occurs equally at C-1 and C-2, giving exactly 50:50 isotopic distribution"),
            ("Benzyne generated in the presence of Furan", "IV", "1,4-Dihydronaphthalene-1,4-endoxide formed by Diels-Alder [4+2] cycloaddition", "The strained alkyne bond in benzyne has high reactivity, acting as an extremely potent dienophile that traps furan in a [4+2] concerted cycloaddition"),
            ("2-Bromobenzoic acid + heat with isoamyl nitrite (anthranilic acid method)", "II", "Generates benzyne efficiently via concerted loss of CO2 and N2 from benzenediazonium-2-carboxylate", "Diazotization of anthranilic acid produces a zwitterionic diazonium carboxylate that decomposes cleanly into gaseous CO2, N2, and reactive benzyne")
        ],
        "B"
    ))

    # chem_org1_035 (C)
    qs.append(make_matrix_q(
        "chem_org1_035", t, "advanced",
        "Match the Birch reduction systems in List I with their exact diene products and regiochemical rationale in List II:",
        [
            ("Anisole (Methoxybenzene) + Na in liquid NH3, EtOH", "II", "1-Methoxycyclohexa-1,4-diene (EDG resides on an sp2 carbon)", "The methoxy group donates electron density through resonance; electron addition occurs to form radical anions with charge localized at ortho and meta positions, directing protonation to ipso/meta positions"),
            ("Benzoic acid + Na in liquid NH3, EtOH", "IV", "Cyclohexa-1,5-diene-1-carboxylic acid (EWG resides on an sp3 carbon)", "The carboxylate group is electron-withdrawing; radical-anion electron density is highest at the ipso and para positions, directing protonation such that the -COOH group ends up on an sp3 carbon"),
            ("Toluene + Na in liquid NH3, EtOH", "I", "1-Methylcyclohexa-1,4-diene (alkyl EDG resides on an sp2 carbon)", "The electron-donating methyl group directs protonation away from the substituted position initially, preserving the methyl group on an unconjugated 1,4-diene sp2 carbon"),
            ("Naphthalene + Na in liquid NH3, EtOH at -33°C", "III", "1,4-Dihydronaphthalene (reduction confined to one ring preserving a stable 6-pi benzene ring)", "Reduction occurs preferentially in one ring across the 1,4-positions; the remaining benzene ring retains its 36 kcal/mol aromatic resonance stabilization")
        ],
        "C"
    ))

    # chem_org1_036 (D)
    qs.append(make_matrix_q(
        "chem_org1_036", t, "advanced",
        "Match the strained or bicyclic alkene additions in List I with their rearrangement pathways and products in List II:",
        [
            ("Methylenecyclobutane + H3O+ (aqueous acid)", "III", "1-Methylcyclobutanol and Cyclopentanol formed via ring expansion of cyclobutylcarbinyl cation", "Protonation gives a cyclobutylcarbinyl carbocation that undergoes rapid Wagner-Meerwein ring expansion to the cyclopentyl cation, driven by relief of ~26 kcal/mol of ring strain"),
            ("alpha-Pinene + dry HCl gas", "I", "Bornyl chloride formed via Wagner-Meerwein bicyclic skeletal rearrangement", "Protonation of the endocyclic double bond of pinene creates a carbocation that undergoes deep skeletal migration of the cyclobutane bridge to relieve 4-membered ring strain, forming bornyl chloride"),
            ("Norbornene + HBr", "IV", "exo-2-Bromonorbornane formed predominantly via non-classical 2-norbornyl carbocation", "Protonation yields the bridged non-classical norbornyl cation; nucleophilic attack of bromide occurs stereospecifically from the less hindered exo face"),
            ("1-Methylcyclopentene + HBr (cold, dry)", "II", "1-Bromo-1-methylcyclopentane formed without ring rearrangement via stable 3° cation", "Protonation generates a tertiary cyclopentyl carbocation directly; because the 5-membered ring is largely strain-free, it undergoes direct bromide capture without skeletal rearrangement")
        ],
        "D"
    ))

    # chem_org1_037 (A)
    qs.append(make_matrix_q(
        "chem_org1_037", t, "advanced",
        "Match the polycyclic aromatic substitutions in List I with their mechanistic control and orientation in List II:",
        [
            ("Naphthalene + conc. H2SO4 at 353 K (80°C)", "IV", "Naphthalene-1-sulfonic acid formed under kinetic control (alpha-substitution)", "Attack at the alpha (C-1) position proceeds through an arenium intermediate having two resonance structures that preserve the intact benzene ring, yielding a lower activation energy than beta-attack"),
            ("Naphthalene + conc. H2SO4 at 433 K (160°C)", "II", "Naphthalene-2-sulfonic acid formed under thermodynamic control (beta-substitution)", "At high temperature, sulfonation is reversible; the alpha-isomer suffers steric peri-interaction with the C-8 hydrogen, so equilibrium shifts to the less strained beta-isomer"),
            ("Anthracene + Br2 in CS2 at 273 K", "I", "9,10-Dibromoanthracene formed by attack at C-9 and C-10 positions", "Electrophilic substitution at the central 9,10-positions leaves two fully aromatic, isolated 6-pi benzene rings intact (retaining 72 kcal/mol aromatic resonance energy)"),
            ("Phenanthrene + Br2 in CCl4 at room temperature", "III", "9,10-Dibromo-9,10-dihydrophenanthrene formed by electrophilic addition across C9-C10", "The C9-C10 bond in phenanthrene has significant localized double-bond character (bond length 1.35 A); addition across this bond preserves two biphenyl-like aromatic sextets")
        ],
        "A"
    ))

    # chem_org1_038 (B)
    qs.append(make_matrix_q(
        "chem_org1_038", t, "advanced",
        "Match the halogenated substrates and elimination conditions in List I with their mechanistic pathway and product distribution in List II:",
        [
            ("2-Bromopentane + NaOEt in EtOH at 350 K", "III", "trans-Pent-2-ene is the major product formed via an E2 mechanism with Zaitsev orientation", "A small, unhindered strong base abstracts a beta-proton from the more substituted carbon via an anti-periplanar transition state, yielding the thermodynamically more stable trans-alkene"),
            ("2-Bromopentane + Potassium tert-butoxide (t-BuOK) in t-BuOH", "I", "Pent-1-ene is the major product formed via an E2 mechanism with Hofmann orientation", "The bulky tert-butoxide base cannot easily access the sterically shielded internal secondary beta-hydrogens, selectively deprotonating the more accessible primary methyl hydrogens"),
            ("2-Fluoropentane + NaOEt in EtOH", "IV", "Pent-1-ene is the major product formed via an E1cB-like transition state", "Fluoride is a very poor leaving group with strong -I effect, making the beta-hydrogens acidic; the transition state develops extensive carbanion character, favoring the less substituted, more stable primary carbanion"),
            ("DDT + ethanolic KOH heated", "II", "1,1-Dichloro-2,2-bis(p-chlorophenyl)ethene (DDE) formed via an E1cB elimination", "The benzylic proton is strongly acidified by two chlorophenyl rings; base deprotonates to form a stable carbanion, which then expels a chloride ion from the adjacent trichloromethyl carbon")
        ],
        "B"
    ))

    # chem_org1_039 (C)
    qs.append(make_matrix_q(
        "chem_org1_039", t, "advanced",
        "Match the conjugated diene additions and cycloadditions in List I with their mechanistic governing rules in List II:",
        [
            ("Buta-1,3-diene + HBr at 193 K (-80°C)", "II", "3-Bromobut-1-ene formed as major product under kinetic control (1,2-addition)", "At low temperature, the reaction is irreversible and controlled by the rate of product formation; the 1,2-product forms faster because bromide attacks the adjacent carbon (proximity effect) in the ion pair"),
            ("Buta-1,3-diene + HBr at 313 K (+40°C)", "IV", "1-Bromobut-2-ene formed as major product under thermodynamic control (1,4-addition)", "At higher temperature, the addition is reversible; the system equilibrates to the most stable product, which is the internal, more substituted disubstituted alkene (1,4-adduct)"),
            ("Cyclopentadiene + Maleic anhydride at 298 K", "I", "endo-Bicyclo[2.2.1]hept-5-ene-2,3-dicarboxylic anhydride formed via endo-rule", "In the Diels-Alder [4+2] cycloaddition, secondary orbital overlap between the carbonyl pi-orbitals of maleic anhydride and the diene pi-system stabilizes the endo transition state over exo"),
            ("Buta-1,3-diene + Ethyne heated", "III", "Cyclohexa-1,4-diene formed via thermal [4+2] Diels-Alder cycloaddition", "Concerted suprafacial [4pi_s + 2pi_s] cycloaddition of a conjugated diene in s-cis conformation with an alkyne dienophile generates an unconjugated six-membered cyclic diene")
        ],
        "C"
    ))

    # chem_org1_040 (D)
    qs.append(make_matrix_q(
        "chem_org1_040", t, "advanced",
        "Match the hydrocarbon oxidative degradations in List I with their stoichiometric cleavage products in List II:",
        [
            ("Toluene + alkaline KMnO4 heated, then acidified", "III", "Benzoic acid (C6H5COOH) formed by complete benzylic oxidation", "The presence of benzylic C-H bonds allows free radical/oxidative attack by permanganate, degrading the alkyl side chain completely to a carboxyl group"),
            ("tert-Butylbenzene + alkaline KMnO4 heated, then acidified", "I", "No reaction; substrate remains completely unaffected by oxidation", "tert-Butylbenzene lacks benzylic hydrogen atoms (the benzylic carbon is quaternary); without benzylic C-H bonds, permanganate cannot initiate oxidation"),
            ("o-Xylene + (i) O3, (ii) Zn / H2O", "IV", "Glyoxal, Methylglyoxal, and Dimethylglyoxal in 3:2:1 molar ratio", "Because benzene oscillates between two Kekule structures in 1:1 ratio, ozonolysis cleaves alternating double bonds, yielding three dialdehydes in a precise 3:2:1 ratio, confirming aromatic resonance"),
            ("Benzene + V2O5 / O2 at 773 K", "II", "Maleic anhydride formed by catalytic ring cleavage and air oxidation", "Under drastic heterogeneous catalytic conditions at 500°C over vanadium pentoxide, two carbons of benzene are lost as CO2 and water, while four carbons are oxidized into maleic anhydride")
        ],
        "D"
    ))

    return qs
