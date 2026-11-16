import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_halo_questions():
    qs = []
    t = "Haloalkanes and Haloarenes"

    # ==========================================
    # BEGINNER (chem_org1_041 - chem_org1_044)
    # ==========================================

    # chem_org1_041 (A)
    qs.append(make_matrix_q(
        "chem_org1_041", t, "beginner",
        "Match the named preparation methods for organic halides in List I with their reagents and driving principles in List II:",
        [
            ("Finkelstein reaction", "IV", "Alkyl chloride/bromide + NaI in dry acetone yielding alkyl iodide via precipitation of NaCl/NaBr", "Sodium iodide is soluble in dry acetone, whereas NaCl and NaBr are insoluble and precipitate out, driving the equilibrium forward according to Le Chatelier's principle"),
            ("Swarts reaction", "II", "Alkyl chloride/bromide heated with heavy metal fluorides (AgF, Hg2F2, CoF2, SbF3) yielding alkyl fluoride", "Fluorination of alkyl halides is best achieved by heating with metallic fluorides, which exchange halogen to provide pure fluoroalkanes"),
            ("Darzens process", "I", "Alcohol + SOCl2 in pyridine yielding pure alkyl chloride with gaseous byproducts (SO2 and HCl)", "Thionyl chloride reacts cleanly with alcohols; the byproducts SO2 and HCl escape as gases, driving completion and leaving the pure alkyl chloride"),
            ("Hunsdiecker reaction", "III", "Silver carboxylate (RCOOAg) + Br2 in refluxing CCl4 yielding alkyl bromide with loss of CO2", "Thermal decarboxylation of silver carboxylates in the presence of bromine proceeds via free radicals to give an alkyl bromide containing one less carbon atom")
        ],
        "A"
    ))

    # chem_org1_042 (B)
    qs.append(make_matrix_q(
        "chem_org1_042", t, "beginner",
        "Match the nucleophilic substitution mechanisms (SN1 vs SN2) in List I with their defining mechanistic and stereochemical characteristics in List II:",
        [
            ("SN1 Reaction Kinetics", "III", "First-order kinetics; rate = k[R-X], independent of nucleophile concentration and strength", "The rate-determining step is the unimolecular heterolytic dissociation of the carbon-halogen bond to generate a carbocation intermediate"),
            ("SN2 Reaction Kinetics", "I", "Second-order kinetics; rate = k[R-X][Nu-], dependent on both substrate and nucleophile", "The reaction occurs in a single concerted step where nucleophilic attack and leaving group departure take place simultaneously via a pentacoordinate transition state"),
            ("SN1 Stereochemical Outcome", "IV", "Racemization (formation of both enantiomers, often with slight excess of inversion due to ion pairing)", "The carbocation intermediate has a planar sp2 geometry; nucleophilic attack from the top face or bottom face occurs with comparable probability"),
            ("SN2 Stereochemical Outcome", "II", "Complete stereochemical inversion of configuration (Walden inversion) via backside attack", "The nucleophile approaches the electrophilic carbon from 180° opposite the leaving group, causing an umbrella-like inversion of the three remaining substituents")
        ],
        "B"
    ))

    # chem_org1_043 (C)
    qs.append(make_matrix_q(
        "chem_org1_043", t, "beginner",
        "Match the polyhalogen compounds in List I with their characteristic properties and practical applications in List II:",
        [
            ("Chloroform (CHCl3) on exposure to light and air", "II", "Slowly oxidized to poisonous Carbonyl chloride (Phosgene, COCl2); prevented by storing in dark bottles with 1% ethanol", "Light-induced free radical oxidation produces toxic phosgene; added ethanol reacts with any trace phosgene formed to convert it into harmless diethyl carbonate"),
            ("Iodoform (CHI3)", "IV", "Bright yellow crystalline solid with pungent odor, historically used as an antiseptic due to liberation of free iodine", "Iodoform was widely used in medicine because it gradually decomposes in contact with skin tissues to release free iodine, which acts as the active antiseptic agent"),
            ("Carbon tetrachloride (CCl4)", "I", "Non-flammable dense solvent formerly used under the name 'Pyrene' in fire extinguishers", "CCl4 vapors are dense and non-combustible, settling over flames to displace oxygen; however, at high temperatures it can generate toxic phosgene, limiting modern use"),
            ("DDT [p,p'-Dichlorodiphenyltrichloroethane]", "III", "Persistent non-biodegradable organochlorine insecticide that bioaccumulates through food chains", "DDT is highly lipid-soluble and resistant to environmental degradation, leading to severe bioaccumulation in fatty tissues of wildlife and eggshell thinning in birds")
        ],
        "C"
    ))

    # chem_org1_044 (D)
    qs.append(make_matrix_q(
        "chem_org1_044", t, "beginner",
        "Match the haloalkane reactions with ambident nucleophiles in List I with their primary organic products in List II:",
        [
            ("Alkyl halide (R-X) + KCN in aqueous ethanol", "III", "Alkyl cyanide / Alkane nitrile (R-CN) formed as major product", "Potassium cyanide is ionic ([K+] [:C#N:-]); the carbon atom has higher nucleophilicity and forms a stronger C-C bond than the C-N bond, making R-CN the major product"),
            ("Alkyl halide (R-X) + AgCN in aqueous ethanol", "I", "Alkyl isocyanide / Carbylamine (R-NC) formed as major product", "Silver cyanide is largely covalent (Ag-C#N:); the carbon atom is bonded to silver, leaving the unshared electron pair on nitrogen to attack the alkyl group"),
            ("Alkyl halide (R-X) + KNO2 in aqueous ethanol", "IV", "Alkyl nitrite (R-O-N=O) formed as major product", "Potassium nitrite is ionic (K+ [O-N=O]-); the negative charge is concentrated on oxygen, which attacks the alkyl group preferentially to form an alkyl nitrite"),
            ("Alkyl halide (R-X) + AgNO2 in aqueous ethanol", "II", "Nitroalkane (R-NO2) formed as major product", "Silver nitrite has significant covalent Ag-O character, leaving the lone pair of electrons on the nitrogen atom free to perform nucleophilic attack on the carbon atom")
        ],
        "D"
    ))

    # ==========================================
    # INTERMEDIATE (chem_org1_045 - chem_org1_052)
    # ==========================================

    # chem_org1_045 (A)
    qs.append(make_matrix_q(
        "chem_org1_045", t, "intermediate",
        "Match the alkyl halides in List I with their relative reactivity in SN1 and SN2 substitutions in List II:",
        [
            ("Neopentyl bromide [(CH3)3C-CH2Br]", "IV", "Extremely unreactive in SN2 (reacts ~10^-5 times slower than ethyl bromide) due to severe steric crowding by beta-methyl groups", "Even though the bromide is attached to a primary carbon, the bulky tert-butyl group on the adjacent beta-carbon blocks backside nucleophilic approach to the sigma* orbital"),
            ("Allyl bromide (CH2=CH-CH2Br)", "II", "Exceptionally reactive in both SN1 (resonance-stabilized allylic cation) and SN2 (pi-orbital overlap with TS)", "In SN1, heterolysis gives an allylic carbocation with charge delocalized over 3 carbons; in SN2, the adjacent pi-bond provides orbital conjugation that stabilizes the pentacoordinate TS"),
            ("Benzyl chloride (C6H5CH2Cl)", "I", "Highly reactive in both SN1 (benzylic carbocation resonance) and SN2 (phenyl conjugation in TS)", "Benzylic carbocation enjoys resonance over 4 canonical forms; similarly in SN2, the aromatic pi-electron cloud conjugates with the developing p-orbital in the transition state"),
            ("1-Bromobutane vs 2-Bromobutane in SN2 with NaI", "III", "1-Bromobutane reacts substantially faster than 2-bromobutane due to lower steric hindrance at 1° carbon", "Primary alkyl halides offer far less steric barrier to backside nucleophilic approach than secondary alkyl halides, resulting in a significantly lower activation energy")
        ],
        "A"
    ))

    # chem_org1_046 (B)
    qs.append(make_matrix_q(
        "chem_org1_046", t, "intermediate",
        "Match the chiral haloalkane substitutions in List I with their stereochemical outcome and mechanistic pathway in List II:",
        [
            ("(R)-2-Bromooctane + NaOH in aqueous acetone", "III", "(S)-Octan-2-ol formed with 100% stereochemical inversion via concerted bimolecular SN2", "Hydroxide attacks exclusively from the backside opposite the departing bromide ion, resulting in an umbrella inversion that flips (R) to (S) configuration cleanly"),
            ("(R)-3-Chloro-3-methylhexane solvolysis in 80% aqueous acetone", "I", "Racemic mixture (with slight excess of inversion) of (R) and (S) alcohols via SN1", "Ionization forms a planar 3° carbocation; frontside attack is slightly hindered by the departing chloride leaving group (intimate ion pair), leading to predominant racemization with minor net inversion"),
            ("(R)-Butan-2-ol + SOCl2 in dry ether", "IV", "(R)-2-Chlorobutane formed with retention of configuration via internal nucleophilic substitution (SNi)", "Reaction forms an alkyl chlorosulfite ester intermediate; decomposition occurs through a concerted 4-membered cyclic transition state where chlorine attacks from the same front face"),
            ("(R)-Butan-2-ol + SOCl2 in the presence of Pyridine", "II", "(S)-2-Chlorobutane formed with inversion of configuration via an SN2 displacement", "Pyridine reacts with HCl to form pyridinium chloride; the free nucleophilic chloride ion attacks the chlorosulfite intermediate from the backside, causing complete Walden inversion")
        ],
        "B"
    ))

    # chem_org1_047 (C)
    qs.append(make_matrix_q(
        "chem_org1_047", t, "intermediate",
        "Match the haloalkanes and elimination conditions in List I with the predominant alkene product and regiochemical rationale in List II:",
        [
            ("2-Bromobutane + ethanolic KOH heated", "II", "But-2-ene (major, ~80%) formed following Zaitsev's rule via E2 elimination", "A small strong base removes a proton from the more substituted beta-carbon, forming the more substituted, thermodynamically stable alkene (predominantly trans-but-2-ene)"),
            ("2-Bromobutane + Potassium tert-butoxide (t-BuOK) in t-BuOH", "IV", "But-1-ene (major, ~70%) formed following Hofmann's rule due to base steric hindrance", "The bulky tert-butoxide ion encounters steric clash when approaching the secondary beta-hydrogens, selectively abstracting the sterically accessible primary beta-hydrogens"),
            ("2-Fluorobutane + sodium ethoxide in ethanol", "I", "But-1-ene (major, ~70%) formed following Hofmann's rule due to poor leaving group ability", "Fluorine is a poor leaving group with a powerful -I effect; significant negative charge develops on the beta-carbon in the transition state (E1cB-like), favoring the less substituted carbanion"),
            ("sec-Butyltrimethylammonium hydroxide heated (pyrolysis)", "III", "But-1-ene (major, ~95%) formed via classic Hofmann elimination of quaternary ammonium salt", "The bulky positively charged -N+(CH3)3 leaving group causes steric repulsion and exerts strong electron withdrawal, directing deprotonation strictly to the less hindered primary carbon")
        ],
        "C"
    ))

    # chem_org1_048 (D)
    qs.append(make_matrix_q(
        "chem_org1_048", t, "intermediate",
        "Match the Grignard reagent (RMgX) reactions in List I with the resulting organic products in List II:",
        [
            ("Methylmagnesium bromide + Ethanol (CH3CH2OH)", "III", "Methane (CH4) gas formed via acid-base proton transfer from the acidic -OH group", "Grignard reagents are powerful Bronsted bases (carbanions); they immediately deprotonate active-hydrogen compounds to form alkanes quantitatively (Zerewitinoff determination)"),
            ("Methylmagnesium bromide + Solid Carbon dioxide (dry ice) followed by H3O+", "I", "Ethanoic acid (Acetic acid, CH3COOH) formed by nucleophilic addition to CO2", "The carbanionic methyl group attacks the electrophilic carbon of carbon dioxide, forming a magnesium carboxylate salt that yields acetic acid upon acidic hydrolysis"),
            ("Methylmagnesium bromide + Ethylene oxide (Oxirane) followed by H3O+", "IV", "Propan-1-ol (CH3CH2CH2OH) formed via nucleophilic ring-opening of the strained epoxide", "Nucleophilic attack on the less hindered carbon of the strained oxirane ring causes ring-opening, elongating the carbon chain by two carbons to yield a primary alcohol"),
            ("Methylmagnesium bromide + Propan-2-one (Acetone) followed by H3O+", "II", "2-Methylpropan-2-ol (tert-Butanol) formed by nucleophilic addition to the carbonyl group", "Addition of methyl carbanion to the electrophilic carbonyl carbon of acetone generates a tertiary alkoxide, which is protonated by aqueous acid to give a tertiary alcohol")
        ],
        "D"
    ))

    # chem_org1_049 (A)
    qs.append(make_matrix_q(
        "chem_org1_049", t, "intermediate",
        "Match the substituted haloarenes in List I with the required conditions for nucleophilic aromatic substitution (SNAr) in List II:",
        [
            ("2,4,6-Trinitrochlorobenzene (Picryl chloride)", "IV", "Hydrolyzes rapidly to Picric acid merely on warming with warm water at 323 K (50°C)", "Three nitro groups situated ortho and para to the chlorine strongly stabilize the Meisenheimer intermediate through extensive resonance delocalization of the negative charge onto all oxygen atoms"),
            ("2,4-Dinitrochlorobenzene", "II", "Hydrolyzes to 2,4-Dinitrophenol on heating with aqueous Na2CO3 at 370 K", "Two ortho/para nitro groups sufficiently lower the activation energy of nucleophilic addition, allowing replacement of chlorine using weak base under mild heating"),
            ("4-Nitrochlorobenzene", "I", "Requires heating with aqueous NaOH at 443 K (170°C) followed by acidification", "A single para-nitro group activates the ring moderately; harsher heating with strong sodium hydroxide is required to displace the chloride ion"),
            ("Chlorobenzene (unsubstituted)", "III", "Requires drastic industrial conditions (aqueous NaOH at 623 K and 300 atm, Dow's process)", "Unactivated haloarenes are extremely resistant to SNAr due to partial double-bond character of C-Cl bond, sp2 hybridization of carbon, and lack of resonance stabilization in intermediate")
        ],
        "A"
    ))

    # chem_org1_050 (B)
    qs.append(make_matrix_q(
        "chem_org1_050", t, "intermediate",
        "Match the leaving groups in List I with their relative leaving ability in nucleophilic substitutions in List II:",
        [
            ("Trifluoromethanesulfonate (Triflate, CF3SO3-)", "III", "Super leaving group; departs ~10^6 times faster than tosylate due to intense -I effect of CF3", "The conjugate base of triflic acid is extraordinarily stable because the negative charge is delocalized over 3 sulfonate oxygens and inductively withdrawn by 3 fluorine atoms"),
            ("p-Toluenesulfonate (Tosylate, TsO-)", "I", "Excellent leaving group; departs ~10^4 times faster than bromide in SN2 displacements", "Resonance stabilization of the sulfonate anion across three equivalent oxygen atoms makes tosylate a very weak base and an exceptional leaving group"),
            ("Iodide ion (I-)", "IV", "Best leaving group among halides (relative rate: I- > Br- > Cl- >> F-)", "Iodide has the largest ionic radius, lowest basicity, and forms the weakest carbon-halogen bond (~213 kJ/mol), making C-I cleavage easiest"),
            ("Fluoride ion (F-)", "II", "Poorest leaving group in aliphatic nucleophilic substitutions (essentially unreactive in SN2)", "Fluoride is the strongest base among halide ions and forms a very short, immensely strong C-F bond (~485 kJ/mol), presenting a huge kinetic barrier to heterolysis")
        ],
        "B"
    ))

    # chem_org1_051 (C)
    qs.append(make_matrix_q(
        "chem_org1_051", t, "intermediate",
        "Match the solvent and medium conditions in List I with their effect on nucleophilicity and substitution rates in List II:",
        [
            ("Halide nucleophilicity in Polar Protic Solvents (H2O, MeOH)", "II", "I- > Br- > Cl- > F- (reversal of basicity order due to strong hydrogen-bonding hydration)", "Small anions with concentrated charge (like F-) are tightly caged by a shell of hydrogen-bonded protic solvent molecules; larger, polarizable I- is weakly solvated and attacks freely"),
            ("Halide nucleophilicity in Polar Aprotic Solvents (DMF, DMSO, Acetone)", "IV", "F- > Cl- > Br- > I- (parallel to basicity order because anions remain desolvated and 'naked')", "Polar aprotic solvents solvate cations via dipole-dipole interactions but leave anions poorly solvated; the smaller fluoride ion retains high charge density and becomes the most nucleophilic"),
            ("Addition of 18-Crown-6 to Potassium fluoride in Benzene", "I", "Solubilizes KF in non-polar benzene, creating 'naked' fluoride with super-nucleophilic reactivity", "The cyclic crown ether specifically chelates the potassium cation (K+) inside its cavity, releasing unsolvated, highly reactive fluoride ions into the organic phase"),
            ("Solvolysis of tert-butyl chloride in 80% Water / 20% Ethanol vs 100% Ethanol", "III", "Rate accelerates by ~10^4 in water-rich solvent due to superior stabilization of the polar transition state", "The SN1 rate-determining transition state develops large partial positive and negative charges; a more polar, hydrogen-bonding solvent stabilizes this polarized TS, lowering activation energy")
        ],
        "C"
    ))

    # chem_org1_052 (D)
    qs.append(make_matrix_q(
        "chem_org1_052", t, "intermediate",
        "Match the chloroform reactions in List I with their mechanistic pathway and functional products in List II:",
        [
            ("Chloroform + aq. KOH with Phenol (Reimer-Tiemann reaction)", "III", "Salicylaldehyde (2-hydroxybenzaldehyde) formed via electrophilic attack of dichlorocarbene (:CCl2)", "Strong base deprotonates chloroform to form trichloromethyl carbanion, which loses Cl- to generate neutral electrophilic dichlorocarbene (:CCl2) that attacks phenoxide at the ortho position"),
            ("Primary amine + CHCl3 + alc. KOH (Carbylamine reaction)", "I", "Alkyl isocyanide / Carbylamine (R-NC) with extremely foul odor (specific test for 1° amines)", "Dichlorocarbene adds to the primary amine nitrogen; subsequent alpha-eliminations generate a triple bond between carbon and nitrogen, yielding the characteristic repulsive smelling isocyanide"),
            ("Chloroform + Propan-2-one (Acetone) in presence of solid KOH", "IV", "Chloretone [1,1,1-trichloro-2-methylpropan-2-ol] formed by nucleophilic addition to carbonyl", "Deprotonation by solid KOH yields trichloromethyl carbanion (:CCl3-), which adds to the electrophilic carbonyl group of acetone to give chloretone, used as a hypnotic"),
            ("Chloroform + conc. HNO3 heated", "II", "Chloropicrin (CCl3NO2, nitrochloroform), a powerful tear gas and fumigant", "Electrophilic nitration of chloroform by concentrated nitric acid replaces the acidic C-H hydrogen with a nitro group to give chloropicrin")
        ],
        "D"
    ))

    # ==========================================
    # ADVANCED (chem_org1_053 - chem_org1_060)
    # ==========================================

    # chem_org1_053 (A)
    qs.append(make_matrix_q(
        "chem_org1_053", t, "advanced",
        "Match the cyclohexyl halide stereoisomers in List I with their E2 elimination behavior in List II:",
        [
            ("Neomenthyl chloride + NaOEt in EtOH", "IV", "Reacts rapidly (~40 times faster than menthyl chloride) to give 3-menthene as major Zaitsev product", "In neomenthyl chloride, the chlorine atom occupies an axial position in the more stable chair conformer, having anti-periplanar hydrogens at both C-2 and C-4, enabling rapid Zaitsev elimination"),
            ("Menthyl chloride + NaOEt in EtOH", "II", "Reacts slowly to give 2-menthene exclusively (~100%) as the anti-Zaitsev product", "Chlorine is equatorial in the stable chair; to eliminate, it must flip to the less stable chair (all 3 groups axial). In that conformer, only the axial H at C-2 is anti-periplanar (C-4 has an isopropyl group)"),
            ("trans-1-Bromo-2-methylcyclohexane + NaOEt in EtOH", "I", "Yields 3-methylcyclohexene as major product because anti-periplanar beta-H exists only at C-6", "When bromine is axial, the trans-methyl group is equatorial; anti-coplanar coplanar relationship is impossible with the C-2 proton, directing elimination exclusively toward C-6"),
            ("cis-1-Bromo-2-methylcyclohexane + NaOEt in EtOH", "III", "Yields 1-methylcyclohexene (Zaitsev product) rapidly because axial beta-H is available at C-2", "In the chair conformer with axial bromine, the cis-methyl is equatorial, allowing the axial hydrogen at C-2 to assume an anti-periplanar geometry with Br, yielding the more substituted alkene")
        ],
        "A"
    ))

    # chem_org1_054 (B)
    qs.append(make_matrix_q(
        "chem_org1_054", t, "advanced",
        "Match the substrates undergoing Neighbouring Group Participation (NGP / Anchimeric Assistance) in List I with their mechanistic outcome in List II:",
        [
            ("2-Chloroethyl ethyl sulfide (Mustard gas analog) solvolysis in water", "III", "Accelerates by ~10^4 relative to chloroalkanes via a cyclic episulfonium ion intermediate", "The sulfur lone pair performs an internal backside displacement (intramolecular SN2) to form a strained 3-membered episulfonium ion, which is rapidly captured by water"),
            ("Acetolysis of trans-2-iodocyclohexyl brosylate", "I", "Yields exclusively trans-1,2-diacetoxycyclohexane with complete retention of configuration", "The trans-iodine atom acts as a neighboring group, attacking from the back to form a cyclic iodonium intermediate (first inversion); acetate then attacks the bridged ion (second inversion), giving net retention"),
            ("Acetolysis of erythro-3-bromo-2-butanol", "IV", "Yields meso-butane-2,3-diacetate via a symmetric bridged bromonium ion", "Participation of the neighboring bromine atom creates a symmetric bridged bromonium ion; nucleophilic attack by acetate at either carbon yields the meso stereoisomer"),
            ("Solvolysis of exo-2-norbornyl brosylate vs endo-2-norbornyl brosylate", "II", "exo-Isomer reacts 350 times faster than endo due to C1-C6 sigma-bond anchimeric assistance", "In the exo isomer, the backside of the C-2 bond is perfectly aligned with the C1-C6 sigma bonding electrons, assisting leaving group departure to form the bridged non-classical carbocation directly")
        ],
        "B"
    ))

    # chem_org1_055 (C)
    qs.append(make_matrix_q(
        "chem_org1_055", t, "advanced",
        "Match the haloalkane solvolysis systems in List I with their deep carbocation rearrangement pathway in List II:",
        [
            ("Solvolysis of 2-bromo-3,3-dimethylbutane in aqueous ethanol", "II", "Yields predominantly 2,3-dimethylbut-2-ene via 1,2-methide shift of 2° to 3° carbocation", "Ionization yields secondary cation (CH3)3C-CH(+)-CH3; instantaneous 1,2-methyl shift affords the tertiary cation (CH3)2C(+)-CH(CH3)2, which eliminates to the thermodynamic tetrasubstituted alkene"),
            ("Solvolysis of Neopentyl iodide [(CH3)3C-CH2I] with AgNO3", "IV", "Yields 2-methylbut-2-ene and tert-pentyl alcohol via concerted/instantaneous 1,2-methide shift", "Primary neopentyl cation cannot exist as a free intermediate; Ag+-assisted departure of iodide is concerted with 1,2-methyl migration to form the tertiary tert-pentyl carbocation"),
            ("Solvolysis of (Cyclobutylmethyl) bromide in aqueous formic acid", "I", "Yields cyclopentanol and cyclopentene via ring expansion driven by release of 4-membered ring strain", "Ionization triggers Wagner-Meerwein ring expansion from a strained 4-membered cyclobutane ring (~26 kcal/mol strain) into a stable 5-membered cyclopentyl carbocation"),
            ("Solvolysis of Pinacolyl chloride [(CH3)3C-CH(Cl)CH3] in water", "III", "Yields 2,3-dimethylbutan-2-ol as the major substitution product via 1,2-methyl migration", "Loss of chloride from the secondary carbon triggers a rapid 1,2-methide shift to generate the more stable tertiary carbocation before nucleophilic capture by water")
        ],
        "C"
    ))

    # chem_org1_056 (D)
    qs.append(make_matrix_q(
        "chem_org1_056", t, "advanced",
        "Match the multi-step Grignard and organometallic additions in List I with their final synthesized products in List II:",
        [
            ("Ethyl formate (HCOOCH2CH3) + 2 moles of CH3MgBr followed by H3O+", "III", "Propan-2-ol (secondary alcohol) formed via addition to formyl carbonyl and subsequent addition", "First mole of Grignard attacks the ester, eliminating ethoxide to generate acetaldehyde; the second mole adds to acetaldehyde to produce a secondary alcohol (isopropanol)"),
            ("Ethyl acetate (CH3COOCH2CH3) + 2 moles of CH3MgBr followed by H3O+", "I", "2-Methylpropan-2-ol (tert-Butanol) formed via ketone intermediate and subsequent addition", "First mole attacks the acetate ester, expelling ethoxide to form acetone; the second mole of Grignard immediately adds to acetone to generate a tertiary alcohol"),
            ("Diethyl carbonate [(EtO)2C=O] + 3 moles of CH3MgBr followed by H3O+", "IV", "tert-Butanol (2-methylpropan-2-ol) formed by three consecutive additions with loss of two ethoxides", "Sequential substitution of two ethoxy groups converts carbonate first to ethyl acetate, then to acetone, which finally adds the third methyl group to yield tert-butanol"),
            ("Acetyl chloride (CH3COCl) + 1 mole of Lithium dimethylcuprate [(CH3)2CuLi]", "II", "Propan-2-one (Acetone) cleanly obtained without over-addition to tertiary alcohol", "Gilman reagents are milder nucleophiles than Grignard reagents; they react cleanly with acid chlorides to give ketones, but do not add to ketones, preventing tertiary alcohol formation")
        ],
        "D"
    ))

    # chem_org1_057 (A)
    qs.append(make_matrix_q(
        "chem_org1_057", t, "advanced",
        "Match the unusual nucleophilic aromatic and aliphatic substitution phenomena in List I with their physical explanations in List II:",
        [
            ("SNAr rate order: Ar-F >> Ar-Cl > Ar-Br > Ar-I (The Element Effect)", "IV", "Confirms nucleophilic attack (addition) is rate-determining; C-X cleavage occurs in a subsequent fast step", "Fluorine has the greatest -I effect, strongly stabilizing the developing negative charge in the Meisenheimer intermediate; since C-X cleavage is not in the RDS, the high C-F bond strength does not impede rate"),
            ("Phenacyl chloride (Ph-CO-CH2Cl) unusually high reactivity in SN2 (~10^5 times ethyl chloride)", "II", "Stabilization of the SN2 pentacoordinate transition state by pi-conjugation with the adjacent carbonyl C=O LUMO", "The p-orbital at the reacting carbon in the SN2 transition state overlaps with the adjacent pi* orbital of the carbonyl group, significantly delocalizing charge and lowering activation energy"),
            ("Bridgehead 1-Bromoadamantane reactivity in SN1 solvolysis", "I", "Undergoes SN1 solvolysis readily because the rigid cage pre-forms a pyramidal-flattened bridgehead cation", "Unlike smaller bicyclic systems, the adamantyl cage is large and flexible enough to accommodate the bridgehead carbocation without excessive angle strain"),
            ("1-Bromobicyclo[2.2.1]heptane complete inertness to both SN1 and SN2", "III", "Cage geometry strictly prohibits backside attack for SN2 and violates Bredt's rule for planar SN1 carbocation", "The small bicyclic [2.2.1] framework is completely rigid: backside nucleophilic approach is blocked by bridge carbons, and the bridgehead carbon cannot flatten into a 120° planar sp2 cation")
        ],
        "A"
    ))

    # chem_org1_058 (B)
    qs.append(make_matrix_q(
        "chem_org1_058", t, "advanced",
        "Match the unreactive or specialized organic halides in List I with their mechanistic justification in List II:",
        [
            ("Vinyl chloride (CH2=CH-Cl)", "III", "Inert to SN1 and SN2 due to sp2 carbon hybridization, C-Cl partial double bond character, and pi repulsion", "The chlorine lone pair is conjugated with the double bond (CH2=CH-Cl <-> -CH2-CH=Cl+), shortening the C-Cl bond; backside attack on an sp2 carbon is sterically and electronically blocked"),
            ("Chlorobenzene (C6H5Cl)", "I", "Resistant to SN1 due to instability of phenyl cation and SN2 due to shielding by aromatic pi-cloud", "Heterolysis would form an sp-hybridized phenyl cation with positive charge in an sp2 hybrid orbital perpendicular to the pi-system, which is prohibitively high in energy"),
            ("1-Bromobicyclo[2.2.2]octane inertness to SN2", "IV", "Completely unreactive to SN2 because the cage interior completely blocks backside nucleophilic approach", "The nucleophile must attack at 180° opposite the C-Br bond, but that vector points directly into the hollow interior of the locked hydrocarbon cage"),
            ("Allyl chloride solvolysis rate compared to 1-chloropropane", "II", "Undergoes SN1 solvolysis ~10^6 times faster due to resonance stabilization of the allylic cation", "Departure of chloride produces an allylic carbocation [CH2=CH-CH2+ <-> +CH2-CH=CH2] where the empty p-orbital is fully conjugated across two equivalent resonance structures")
        ],
        "B"
    ))

    # chem_org1_059 (C)
    qs.append(make_matrix_q(
        "chem_org1_059", t, "advanced",
        "Match the haloform and alpha-halogenation mechanisms in List I with their kinetic and mechanistic features in List II:",
        [
            ("Kinetics of base-promoted halogenation: Rate = k[Ketone][OH-]^1 [X2]^0", "II", "Zero-order in halogen; removal of alpha-proton by base (enolate formation) is the rate-determining step", "The rate is identical whether chlorine, bromine, or iodine is used, proving that the halogen does not participate in the rate-determining step, which is solely enolate ion generation"),
            ("Acid-catalyzed halogenation of ketones (Monohalogenation dominance)", "IV", "Halogenation stops cleanly after one halogen atom because the electron-withdrawing halogen reduces carbonyl basicity", "The introduced alpha-halogen exerts a strong -I effect, decreasing basicity of the carbonyl oxygen and slowing down the second protonation required to form the second enol"),
            ("Base-catalyzed halogenation of methyl ketones (Trihalogenation runaway)", "I", "Each successive halogen atom increases the acidity of remaining alpha-protons, accelerating subsequent halogenations", "The strong -I effect of halogen makes the remaining alpha-C-H bonds progressively more acidic, so the mono- and di-halo ketones are deprotonated faster than the initial ketone"),
            ("Cleavage of trihalomethyl ketone by hydroxide ion", "III", "Hydroxide adds to carbonyl carbon to form tetrahedral intermediate which expels the stabilized :CX3- leaving group", "Addition of OH- produces a tetrahedral alkoxide; collapse of the C=O double bond expels the trihalomethyl carbanion (:CX3-), which is stabilized by three strongly electronegative halogens")
        ],
        "C"
    ))

    # chem_org1_060 (D)
    qs.append(make_matrix_q(
        "chem_org1_060", t, "advanced",
        "Match the substituted benzyne intermediates in List I with their regioselective nucleophilic addition products in List II:",
        [
            ("3-Methoxybenzyne + KNH2 in liquid NH3", "III", "meta-Anisidine (m-methoxyaniline) formed predominantly over ortho-anisidine", "The methoxy group exerts a strong inductive electron-withdrawing (-I) effect; nucleophilic attack of NH2- occurs at the meta position so that the developing carbanionic negative charge resides at the ortho carbon adjacent to the -I group"),
            ("3-Methylbenzyne + KNH2 in liquid NH3", "I", "ortho-Toluidine formed predominantly over meta-toluidine", "The methyl group exerts an electron-donating (+I) inductive effect; negative charge developing ortho to the methyl group is destabilized, directing the carbanion to the meta carbon and the NH2 group to the ortho carbon"),
            ("1,2-Dibromobenzene treated with Lithium amalgam in dry ether", "IV", "Biphenylene formed via [2+2] dimerization of two generated benzyne molecules", "Halogen-metal exchange followed by loss of LiBr generates benzyne in high concentration, which spontaneously dimerizes via formal [2+2] cycloaddition to form anti-aromatic-fused biphenylene"),
            ("1-Bromo-2-fluorobenzene treated with Magnesium in presence of Anthracene", "II", "Triptycene formed via [4+2] Diels-Alder cycloaddition across the 9,10-bridge of anthracene", "Benzyne generated in situ acts as an exceptionally reactive dienophile, adding stereospecifically across the 9,10-positions of anthracene to yield the rigid paddlewheel-shaped triptycene")
        ],
        "D"
    ))

    return qs
