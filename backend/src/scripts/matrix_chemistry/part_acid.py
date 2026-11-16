from builder import make_matrix_q

def get_acid_questions():
    qs = []

    # -------------------------------------------------------------------------
    # chem_org2_021 (Beginner, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_021",
        topic="Carboxylic Acids and Derivatives",
        difficulty="beginner",
        lead="Match the substituted acetic acid in List I with its relative pKa / acidity rationale in List II:",
        pairs=[
            (
                "Trichloroacetic acid (CCl3COOH)",
                "II",
                "pKa ~0.65; powerful -I effect of three chlorine atoms strongly stabilizes the trichloroacetate anion",
                "Three strongly electronegative chlorine atoms on the alpha-carbon exert an additive electron-withdrawing inductive effect (-I), dispersing the negative charge on the carboxylate conjugate base and rendering trichloroacetic acid the most acidic among chlorinated acetic acids"
            ),
            (
                "Dichloroacetic acid (CHCl2COOH)",
                "IV",
                "pKa ~1.29; strong -I effect of two chlorine atoms gives intermediate acid strength",
                "The presence of two alpha-chlorine substituents withdraws electron density inductively, stabilizing the conjugate base significantly more than monochloroacetic acid but less than trichloroacetic acid"
            ),
            (
                "Monochloroacetic acid (CH2ClCOOH)",
                "I",
                "pKa ~2.86; single chlorine atom provides moderate -I stabilization to the carboxylate",
                "A single chlorine atom withdraws electron density through sigma bonds, substantially increasing the ionization constant relative to unsubstituted acetic acid by stabilizing the carboxylate ion"
            ),
            (
                "Acetic acid (CH3COOH)",
                "III",
                "pKa ~4.76; electron-donating inductive effect (+I) of the methyl group slightly destabilizes the acetate anion",
                "The methyl group is weakly electron-donating via inductive (+I) and hyperconjugative effects, which increases electron density on the carboxylate group, making acetic acid the least acidic in this homologous series"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_022 (Beginner, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_022",
        topic="Carboxylic Acids and Derivatives",
        difficulty="beginner",
        lead="Match the synthetic precursor and reaction condition in List I with the resulting carboxylic acid in List II:",
        pairs=[
            (
                "Toluene treated with alkaline KMnO4 followed by heating and acidification",
                "III",
                "Benzoic acid (C6H5COOH)",
                "Alkaline potassium permanganate oxidizes the benzylic carbon of alkylbenzenes possessing at least one benzylic hydrogen to potassium benzoate, which upon acidification yields crystalline benzoic acid"
            ),
            (
                "Methylmagnesium bromide (CH3MgBr) poured onto crushed solid dry ice (CO2) followed by hydronium workup",
                "I",
                "Acetic acid (ethanoic acid, CH3COOH)",
                "Nucleophilic addition of the methyl Grignard reagent to carbon dioxide generates a magnesium carboxylate salt (CH3COOMgBr), which upon acidification with dilute mineral acid affords acetic acid"
            ),
            (
                "Acetonitrile (CH3CN) heated under reflux with aqueous dilute hydrochloric acid",
                "IV",
                "Acetic acid along with ammonium chloride byproduct",
                "Acid-catalyzed hydrolysis of nitriles proceeds through an intermediate acetamide, which undergoes rapid further hydrolytic cleavage to acetic acid and ammonium ion"
            ),
            (
                "Hydrolysis of acetic anhydride ((CH3CO)2O) with boiling water",
                "II",
                "Two molar equivalents of acetic acid (CH3COOH)",
                "Nucleophilic attack of water on the electrophilic carbonyl of acetic anhydride cleaves the anhydride linkage, regenerating two equivalents of acetic acid without needing harsh catalysts"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_023 (Beginner, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_023",
        topic="Carboxylic Acids and Derivatives",
        difficulty="beginner",
        lead="Match the carboxylic acid derivative in List I with its relative reactivity in nucleophilic acyl substitution in List II:",
        pairs=[
            (
                "Acetyl chloride (CH3COCl)",
                "IV",
                "Highest reactivity: chloride is a weak base and excellent leaving group (pKa of HCl is -7)",
                "The chloride substituent has minimal resonance donation (+M) to the carbonyl due to poor 2p-3p orbital overlap, while its strong -I effect makes the carbonyl carbon exceptionally electrophilic and Cl- an outstanding leaving group"
            ),
            (
                "Acetic anhydride ((CH3CO)2O)",
                "II",
                "Second highest reactivity: carboxylate is a good leaving group with delocalization across two carbonyls",
                "The bridging oxygen delocalizes electron density into two carbonyl groups, reducing the resonance stabilization of each individual carbonyl and making acetate a moderate leaving group"
            ),
            (
                "Ethyl acetate (CH3COOCH2CH3)",
                "I",
                "Moderate reactivity: ethoxide is a poor leaving group due to strong resonance donation from alkoxy oxygen",
                "Effective 2p-2p orbital overlap between the ester oxygen lone pair and the carbonyl pi* orbital stabilizes the ester resonance hybrid; ethoxide is a strong base and poor leaving group"
            ),
            (
                "Acetamide (CH3CONH2)",
                "III",
                "Lowest reactivity: amide nitrogen strongly donates lone pair density into the carbonyl group",
                "Nitrogen is less electronegative than oxygen, resulting in powerful resonance donation of its lone pair into the carbonyl carbon, creating significant C-N double bond character and making NH2- an extremely poor leaving group"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_024 (Beginner, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_024",
        topic="Carboxylic Acids and Derivatives",
        difficulty="beginner",
        lead="Match the decarboxylation reaction in List I with its primary organic product in List II:",
        pairs=[
            (
                "Heating anhydrous sodium acetate with soda-lime (NaOH + CaO) at 300 °C",
                "I",
                "Methane (CH4) gas",
                "Soda-lime decarboxylation involves carbanionic cleavage of the C-C bond between the methyl and carboxylate group driven by the thermodynamic stability of sodium carbonate (Na2CO3), producing methane"
            ),
            (
                "Gentle thermal heating of malonic acid (propanedioic acid, HOOC-CH2-COOH) at 150 °C",
                "III",
                "Acetic acid (CH3COOH) and CO2",
                "Beta-dicarboxylic acids undergo facile concerted unimolecular decarboxylation through a 6-membered cyclic transition state yielding the enol of acetic acid, which rapidly tautomerizes to stable acetic acid"
            ),
            (
                "Kolbe electrolytic decarboxylation of a concentrated aqueous solution of potassium acetate",
                "IV",
                "Ethane (CH3-CH3) gas at the anode along with CO2",
                "Anodic oxidation of acetate ions yields acetyloxy radicals, which rapidly eliminate CO2 to generate methyl radicals; dimerization of two methyl radicals at the electrode surface gives ethane"
            ),
            (
                "Heating ethyl acetoacetate with dilute aqueous H2SO4 (ketonic decarboxylation)",
                "II",
                "Acetone (propan-2-one, CH3COCH3) along with CO2 and ethanol",
                "Aqueous acid hydrolyzes the beta-keto ester to acetoacetic acid, which spontaneously undergoes decarboxylation via a 6-membered cyclic transition state to furnish acetone and carbon dioxide"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_025 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_025",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the Hell-Volhard-Zelinsky (HVZ) or related alpha-halogenation transformation in List I with its outcome in List II:",
        pairs=[
            (
                "Reaction of propanoic acid (CH3CH2COOH) with Br2 in the presence of catalytic red phosphorus",
                "II",
                "2-Bromopropanoic acid (alpha-bromination via propionyl bromide enol intermediate)",
                "Phosphorus reacts with Br2 to form PBr3 in situ, which converts a fraction of propanoic acid to propionyl bromide; the acyl bromide readily enolizes and reacts rapidly with Br2 to give 2-bromopropionyl bromide, which exchanges with unreacted acid to regenerate the catalyst"
            ),
            (
                "Treatment of 2,2-dimethylpropanoic acid (pivalic acid, (CH3)3CCOOH) with Br2 and red phosphorus",
                "IV",
                "No reaction (HVZ fails due to complete absence of alpha-hydrogens)",
                "The HVZ halogenation requires enolization of the intermediate acyl halide; because the alpha-carbon of pivalic acid is quaternary and lacks alpha-hydrogens, enolization is impossible and no reaction occurs"
            ),
            (
                "Reaction of 2-bromopropanoic acid with excess aqueous potassium hydroxide upon gentle heating",
                "I",
                "Lactic acid (2-hydroxypropanoic acid, CH3CH(OH)COOH)",
                "The alpha-bromo substituent is activated toward nucleophilic aliphatic substitution (SN2) by the adjacent electron-withdrawing carboxylate group, enabling hydroxide to displace bromide and produce lactic acid"
            ),
            (
                "Reaction of 2-bromopropanoic acid with concentrated ethanolic ammonia in excess",
                "III",
                "Alanine (2-aminopropanoic acid, CH3CH(NH2)COOH)",
                "Nucleophilic displacement of the alpha-bromine atom by ammonia installs the primary amino group at C2, affording the essential racemic amino acid alanine in good yield"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_026 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_026",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the esterification or ester cleavage transformation in List I with its mechanism / isotopic pathway in List II:",
        pairs=[
            (
                "Fischer esterification of benzoic acid with 18O-labeled methanol (CH3(18)OH) in dry HCl",
                "IV",
                "Methyl benzoate with 18O incorporated into the methoxy group: Ph-CO-(18)OCH3 via AAC2 mechanism",
                "Fischer esterification proceeds by acid-catalyzed nucleophilic acyl substitution (AAC2): protonation of the carbonyl oxygen is followed by nucleophilic attack of the alcohol oxygen; loss of water from the tetrahedral intermediate retains the 18O label exclusively in the ester methoxy group"
            ),
            (
                "Saponification of ethyl benzoate with aqueous NaOH containing 18O-labeled hydroxide (Na(18)OH)",
                "III",
                "Sodium benzoate containing the 18O label in the carboxylate group via BAC2 mechanism",
                "Alkaline hydrolysis occurs via the BAC2 pathway: (18)OH- attacks the carbonyl carbon to form a tetrahedral intermediate; departure of ethoxide leaves 18O bonded to the benzoyl carbon, which upon irreversible proton transfer forms the labeled benzoate"
            ),
            (
                "Acid-catalyzed hydrolysis of tert-butyl acetate in dilute aqueous H2SO4",
                "II",
                "Acetic acid and tert-butyl alcohol via alkyl-oxygen cleavage (AAL1 mechanism)",
                "Protonation of the ester oxygen is followed by unimolecular heterolysis of the alkyl-oxygen bond to generate the stable tertiary carbocation (CH3)3C+, which is subsequently trapped by water to yield tert-butanol"
            ),
            (
                "Treatment of benzoic acid with diazomethane (CH2N2) in diethyl ether",
                "I",
                "Methyl benzoate formed quantitatively with evolution of N2 gas under neutral conditions",
                "Benzoic acid rapidly protonates diazomethane to give a methanediazonium intermediate [CH3-N2]+; carboxylate then attacks the methyl carbon via SN2 with expulsion of molecular nitrogen as an exceptionally stable leaving group"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_027 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_027",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the ester condensation or transesterification reaction in List I with its primary product in List II:",
        pairs=[
            (
                "Self-condensation of ethyl acetate in the presence of sodium ethoxide followed by acidification (Claisen)",
                "III",
                "Ethyl acetoacetate (ethyl 3-oxobutanoate, CH3COCH2COOEt)",
                "Ethoxide abstracts an alpha-proton from ethyl acetate to generate an ester enolate, which attacks a second ester molecule; expulsion of ethoxide yields ethyl acetoacetate, whose acidic active methylene proton (pKa ~11) is deprotonated by ethoxide to drive the equilibrium to completion"
            ),
            (
                "Dieckmann cyclization of diethyl adipate (diethyl hexanedioate) with sodium ethoxide",
                "I",
                "Ethyl 2-oxocyclopentanecarboxylate (5-membered beta-keto ester)",
                "Intramolecular Claisen condensation of the C6 diester forms a stable, low-strain 5-membered beta-keto ester; deprotonation of the acidic bridge proton drives the reversible cyclization forward"
            ),
            (
                "Acid-catalyzed transesterification of methyl benzoate with a large excess of anhydrous ethanol",
                "IV",
                "Ethyl benzoate and methanol in dynamic equilibrium",
                "Protonation of the ester carbonyl facilitates reversible nucleophilic attack by ethanol; with a large stoichiometric excess of ethanol or removal of lower-boiling methanol, the equilibrium shifts to furnish ethyl benzoate"
            ),
            (
                "Reduction of ethyl hexanoate with 1 equivalent of DIBAL-H in toluene at -78 °C followed by aqueous quench",
                "II",
                "Hexanal (hexaldehyde, CH3(CH2)4CHO)",
                "At -78 °C, diisobutylaluminum hydride delivers a single hydride to the ester carbonyl, producing a stable tetrahedral hemiacetal aluminate intermediate that resists further reduction until hydrolyzed during workup"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_028 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_028",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the substituted benzoic acid in List I with its relative acidity behavior in List II:",
        pairs=[
            (
                "2-Methylbenzoic acid (o-toluic acid, pKa = 3.91)",
                "I",
                "More acidic than benzoic acid (pKa = 4.20) due to the ortho effect",
                "Steric crowding by the ortho-methyl group forces the carboxyl group out of the aromatic plane, disrupting the +M donation of the benzene ring into C=O and enhancing carboxylate stabilization through steric relief and local solvation"
            ),
            (
                "4-Nitrobenzoic acid (p-nitrobenzoic acid, pKa = 3.44)",
                "IV",
                "Strongly acidic due to powerful -M and -I electron-withdrawing effects of the nitro group",
                "The para-nitro group withdraws electron density via both inductive and direct mesomeric resonance pathways, substantially dispersing the negative charge of the conjugate carboxylate base"
            ),
            (
                "4-Methoxybenzoic acid (p-anisic acid, pKa = 4.47)",
                "II",
                "Less acidic than benzoic acid because +M electron donation overpowers the -I effect",
                "At the para position, the methoxy oxygen donates its lone pair into the ring through resonance (+M), increasing electron density on the carboxylate group and destabilizing the conjugate base despite a weak -I effect"
            ),
            (
                "3-Chlorobenzoic acid (m-chlorobenzoic acid, pKa = 3.83)",
                "III",
                "More acidic than 4-chlorobenzoic acid (pKa = 3.98) because the -I effect operates without resonance opposition",
                "At the meta position, resonance donation (+M) cannot reach the carboxyl-bearing carbon; the electronegative chlorine acts purely via its electron-withdrawing inductive effect (-I), stabilizing the conjugate base more effectively than at the para position"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_029 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_029",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the functional derivative interconversion in List I with its resulting organic product in List II:",
        pairs=[
            (
                "Reaction of acetyl chloride with ethylamine in the presence of pyridine",
                "II",
                "N-Ethylacetamide (CH3CONHCH2CH3)",
                "Nucleophilic addition of the primary amine to the highly electrophilic carbonyl carbon of acetyl chloride followed by elimination of chloride gives N-ethylacetamide; pyridine acts as a base to trap released HCl"
            ),
            (
                "Reaction of salicylic acid (2-hydroxybenzoic acid) with acetic anhydride catalyzed by conc. H2SO4",
                "IV",
                "Acetylsalicylic acid (aspirin, 2-CH3COO-C6H4COOH)",
                "The phenolic hydroxyl group of salicylic acid attacks the carbonyl of acetic anhydride, undergoing O-acylation to afford the widely used analgesic acetylsalicylic acid (aspirin)"
            ),
            (
                "Partial hydrolysis of benzonitrile with alkaline hydrogen peroxide (H2O2 / NaOH)",
                "I",
                "Benzamide (PhCONH2)",
                "Hydroperoxide anion (HOO-) adds nucleophilically to the nitrile carbon to form a peroxycarboximidic acid intermediate, which transfers oxygen to another substrate while cleanly hydrolyzing to benzamide without over-hydrolysis to benzoic acid"
            ),
            (
                "Dehydration of acetamide (CH3CONH2) upon heating with phosphorus pentoxide (P2O5)",
                "III",
                "Acetonitrile (methyl cyanide, CH3CN)",
                "Phosphorus pentoxide is a potent dehydrating agent that extracts the elements of water from the primary amide group via an imidate intermediate, producing acetonitrile in high yield"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_030 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_030",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the dicarboxylic acid in List I with its thermal decomposition product (Blanc's rule) in List II:",
        pairs=[
            (
                "Dry heating of oxalic acid (ethanedioic acid, HOOC-COOH) above 150 °C",
                "IV",
                "Formic acid (HCOOH) and CO2 (further decomposing to CO, CO2, and H2O)",
                "Oxalic acid has directly bonded carboxyl groups; thermal energy induces decarboxylation to formic acid and CO2, with formic acid subsequently dehydrating to carbon monoxide and steam"
            ),
            (
                "Heating succinic acid (butanedioic acid, HOOC-(CH2)2-COOH) at 200 °C",
                "III",
                "Succinic anhydride (5-membered cyclic anhydride) with elimination of water",
                "1,4-Dicarboxylic acids undergo facile intramolecular dehydration because ring closure forms a strain-free 5-membered cyclic anhydride ring without decarboxylation"
            ),
            (
                "Heating adipic acid (hexanedioic acid, HOOC-(CH2)4-COOH) in the presence of Ba(OH)2 / heat",
                "II",
                "Cyclopentanone (5-membered cyclic ketone) with loss of CO2 and H2O",
                "According to Blanc's rule, 1,6-dicarboxylic acids upon dry distillation with barium hydroxide undergo ketonic decarboxylation to produce stable 5-membered cyclic ketones (cyclopentanone)"
            ),
            (
                "Heating phthalic acid (benzene-1,2-dicarboxylic acid) strongly",
                "I",
                "Phthalic anhydride (fused 5-membered cyclic anhydride)",
                "The two adjacent ortho-carboxyl groups on the rigid benzene ring are held in close spatial proximity, undergoing rapid intramolecular dehydration upon heating to furnish sublimable phthalic anhydride"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_031 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_031",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the organometallic addition to carboxylic acid derivatives in List I with the resulting organic product in List II:",
        pairs=[
            (
                "Reaction of ethyl acetate with 2 equivalents of methylmagnesium bromide followed by hydronium workup",
                "III",
                "2-Methylpropan-2-ol (tert-butanol, a 3° alcohol)",
                "The first equivalent of CH3MgBr adds to the ester to form an unstable tetrahedral intermediate that expels ethoxide to generate acetone; acetone is more electrophilic than the ester and immediately reacts with the second equivalent to afford tert-butanol"
            ),
            (
                "Reaction of acetyl chloride with dimethylcadmium ((CH3)2Cd)",
                "I",
                "Acetone (isolated in high yield with no tertiary alcohol formation)",
                "Organocadmium reagents are much less nucleophilic than Grignards and react readily with acyl chlorides, but are too unreactive to attack the resulting ketone, allowing selective synthesis of ketones"
            ),
            (
                "Reaction of benzonitrile (PhCN) with phenylmagnesium bromide followed by aqueous acidic workup",
                "IV",
                "Benzophenone (Ph2C=O)",
                "Phenyl Grignard adds across the C≡N triple bond to form a magnesium ketimine salt (Ph2C=NMgBr); this intermediate is resistant to further nucleophilic addition and hydrolyzes upon aqueous acidic workup to benzophenone"
            ),
            (
                "Reaction of phenylmagnesium bromide with gaseous carbon dioxide followed by acidification",
                "II",
                "Benzoic acid (PhCOOH)",
                "Phenyl carbanion nucleophilically attacks the electrophilic carbon of CO2 to yield bromomagnesium benzoate, which on acidification gives benzoic acid"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_032 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_032",
        topic="Carboxylic Acids and Derivatives",
        difficulty="intermediate",
        lead="Match the selective reduction of carboxylic acid derivatives in List I with its outcome in List II:",
        pairs=[
            (
                "Rosenmund reduction: benzoyl chloride with H2 over Pd-BaSO4 poisoned with quinoline",
                "I",
                "Benzaldehyde (PhCHO)",
                "The sulfur/quinoline poison deactivates the palladium catalyst just enough to hydrogenate the reactive acid chloride while preventing subsequent reduction of the aldehyde to benzyl alcohol"
            ),
            (
                "Reduction of benzamide (PhCONH2) with excess LiAlH4 in dry diethyl ether followed by hydrolysis",
                "IV",
                "Benzylamine (PhCH2NH2)",
                "Lithium aluminum hydride reduces amides by hydride addition followed by oxygen expulsion assisted by aluminum complexation, generating an iminium ion that receives a second hydride to afford primary benzylamine"
            ),
            (
                "Reduction of a compound containing both a carboxylic acid and an ester group using diborane (B2H6) in THF",
                "II",
                "Selective reduction of the carboxylic acid to primary alcohol leaving the ester intact",
                "Diborane behaves as a Lewis acid that coordinates rapidly to the electron-rich carboxyl group, reducing carboxylic acids to primary alcohols much faster than esters or amides"
            ),
            (
                "Reduction of an aliphatic nitrile (RCN) with DIBAL-H at -78 °C followed by acidic hydrolysis",
                "III",
                "Aldehyde (RCHO)",
                "Diisobutylaluminum hydride delivers one hydride to the nitrile carbon, forming an aldimine aluminum complex that is stable at low temperatures; subsequent aqueous acid hydrolysis yields the aldehyde cleanly"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_033 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_033",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the ester solvolysis pathway in List I with its governing mechanistic characteristic in List II:",
        pairs=[
            (
                "Dissolution of methyl 2,4,6-trimethylbenzoate (methyl mesitoate) in conc. H2SO4 followed by pouring onto ice",
                "II",
                "AAC1 mechanism: unimolecular acyl-oxygen cleavage via a linear resonance-stabilized acylium ion",
                "Severe steric hindrance from the two ortho-methyl groups prevents bimolecular nucleophilic attack at the carbonyl; protonation in concentrated sulfuric acid leads to unimolecular cleavage (AAC1) generating a linear mesitoyl cation that traps water"
            ),
            (
                "Hydrolysis of tert-butyl acetate in dilute aqueous mineral acid",
                "IV",
                "AAL1 mechanism: unimolecular alkyl-oxygen heterolysis forming a stable 3° carbocation",
                "Protonation of the ester oxygen is followed by heterolysis of the alkyl-oxygen bond rather than the acyl-oxygen bond because the resulting tert-butyl carbocation is exceptionally stable; nucleophilic capture by water yields tert-butanol"
            ),
            (
                "Alkaline saponification of ethyl acetate in H2(18)O / NaOH",
                "I",
                "BAC2 mechanism: bimolecular attack of hydroxide forming a tetrahedral intermediate with acyl-oxygen cleavage",
                "Hydroxide attacks the carbonyl carbon to form a tetrahedral intermediate (rate-determining step); subsequent collapse expels ethoxide with acyl-oxygen bond cleavage, incorporating the 18O label into the acetate ion"
            ),
            (
                "Reaction of methyl benzoate with lithium iodide (LiI) in refluxing pyridine (Krapcho-type cleavage)",
                "III",
                "BAL2 mechanism: nucleophilic SN2 displacement at the methyl carbon by iodide displacing benzoate anion",
                "Iodide ion is a powerful nucleophile that attacks the methyl group via an SN2 displacement (alkyl-oxygen cleavage, BAL2); the benzoate anion acts as a stable leaving group, yielding benzoic acid upon acidification"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_034 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_034",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the molecular rearrangement of carboxylic acid derivatives in List I with its mechanistic feature in List II:",
        pairs=[
            (
                "Curtius rearrangement: thermal decomposition of an acyl azide (RCON3) in benzene",
                "IV",
                "Concerted 1,2-migration of R to electron-deficient nitrogen with loss of N2 to form an isocyanate (RN=C=O)",
                "Heating acyl azides induces concerted migration of the alkyl/aryl group with retention of configuration to nitrogen with simultaneous extrusion of molecular nitrogen, producing an isocyanate that can be trapped with water/alcohols"
            ),
            (
                "Hofmann bromamide rearrangement: primary amide treated with Br2 and excess KOH",
                "III",
                "N-Bromination followed by base-induced deprotonation and 1,2-migration to form isocyanate, hydrolyzing to 1° amine",
                "Base deprotonates the N-bromoamide to form a bromamide anion; concerted migration of R with retention of configuration expels bromide, generating an isocyanate that hydrolyzes to an amine with loss of carbonyl carbon as carbonate"
            ),
            (
                "Lossen rearrangement: base-induced decomposition of an O-acyl hydroxamic acid (RCONH-OCOR')",
                "II",
                "Migration of R group to nitrogen with carboxylate (R'COO-) acting as the leaving group",
                "Deprotonation of the hydroxamic nitrogen promotes concerted 1,2-migration of the R group to nitrogen accompanied by expulsion of the carboxylate leaving group, yielding an isocyanate intermediate"
            ),
            (
                "Schmidt reaction: carboxylic acid (RCOOH) treated with hydrazoic acid (HN3) in conc. H2SO4",
                "I",
                "Acyl azide formation in situ followed by rearrangement and decarboxylation to give a primary amine",
                "Protonation of the carboxylic acid generates an acylium ion that is trapped by HN3; elimination of water gives a protonated acyl azide, which undergoes Curtius-like rearrangement and hydrolysis to yield a primary amine and CO2"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_035 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_035",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the Arndt-Eistert homologation or Wolff rearrangement step in List I with its defining feature in List II:",
        pairs=[
            (
                "Reaction of an acyl chloride (RCOCl) with excess diazomethane (2 equivalents)",
                "III",
                "Formation of an alpha-diazoketone (RCOCHN2) along with chloromethane and N2",
                "The first equivalent of CH2N2 attacks the acyl chloride to form a tetrahedral adduct that collapses with chloride loss; the second equivalent acts as a base to deprotonate the chloromethyl cation, giving the alpha-diazoketone"
            ),
            (
                "Thermal or silver oxide (Ag2O) catalyzed decomposition of an alpha-diazoketone (Wolff rearrangement)",
                "I",
                "Extrusion of N2 and 1,2-migration of R group to generate a ketene (RCH=C=O)",
                "Extrusion of N2 produces an alpha-ketocarbene (or concerted transition state) that undergoes 1,2-migration of the R group with retention of stereochemistry to yield a reactive ketene intermediate"
            ),
            (
                "Reaction of the ketene intermediate with water during Arndt-Eistert synthesis",
                "IV",
                "Homologated carboxylic acid (RCH2COOH) possessing one additional carbon atom",
                "Water attacks the central sp-hybridized electrophilic carbon of the ketene to form an enol, which tautomerizes to the one-carbon homologated carboxylic acid"
            ),
            (
                "Trapping of the ketene intermediate with benzylamine (PhCH2NH2)",
                "II",
                "Homologated secondary amide (RCH2CONHCH2Ph)",
                "Nucleophilic addition of the primary amine to the electrophilic carbonyl carbon of the ketene followed by proton transfer affords the one-carbon extended amide in high yield"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_036 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_036",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the directed ester condensation or annulation in List I with its mechanism / product in List II:",
        pairs=[
            (
                "Crossed Claisen condensation of ethyl benzoate (no alpha-H) with ethyl acetate using NaOEt",
                "I",
                "Ethyl benzoylacetate (PhCOCH2COOEt)",
                "Ethyl benzoate acts exclusively as the electrophilic acceptor; ethoxide deprotonates ethyl acetate to form an enolate that attacks ethyl benzoate, expelling ethoxide to yield the beta-keto ester"
            ),
            (
                "Reaction of cyclohexanone with diethyl carbonate in the presence of NaH",
                "IV",
                "Ethyl 2-oxocyclohexanecarboxylate (alpha-carbethoxylation of a ketone)",
                "Sodium hydride cleanly generates the ketone enolate, which nucleophilically attacks the electrophilic carbonyl of diethyl carbonate, installing an ethoxycarbonyl group at the alpha-position"
            ),
            (
                "Darzens condensation: benzaldehyde with ethyl chloroacetate in the presence of potassium tert-butoxide",
                "II",
                "Ethyl 3-phenyloxirane-2-carboxylate (glycidic ester via alpha-halo enolate)",
                "Deprotonation of ethyl chloroacetate gives a carbanion that adds to benzaldehyde; the resulting alkoxide executes an internal SN2 displacement of chloride to generate an alpha,beta-epoxy ester"
            ),
            (
                "Reformatsky reaction of ethyl 2-bromopropanoate with cyclopentanone in the presence of activated zinc",
                "III",
                "Ethyl 2-(1-hydroxycyclopentyl)propanoate (beta-hydroxy ester adduct)",
                "Zinc inserts into the C-Br bond to form an organozinc enolate (Reformatsky reagent), which adds chemoselectively to the ketone carbonyl without competitive self-condensation"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_037 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_037",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the beta-dicarbonyl synthetic transformation in List I with its targeted organic product in List II:",
        pairs=[
            (
                "Mono-alkylation of diethyl malonate with benzyl chloride (NaOEt) followed by hydrolysis and heating at 180 °C",
                "II",
                "3-Phenylpropanoic acid (hydrocinnamic acid, PhCH2CH2COOH)",
                "Malonic ester enolate displaces chloride from benzyl chloride; saponification converts both esters to carboxylates, which upon acidification and heating decarboxylate to yield the mono-alkylated carboxylic acid"
            ),
            (
                "Dialkylation of diethyl malonate with 1,2-dibromoethane (2 eq NaOEt) followed by hydrolysis and heating",
                "IV",
                "Cyclopropanecarboxylic acid via intramolecular double alkylation and decarboxylation",
                "The malonate carbanion displaces the first bromine atom, and subsequent base deprotonation triggers intramolecular displacement of the second bromine to form a cyclopropane-1,1-diester; hydrolysis and heating yield cyclopropanecarboxylic acid"
            ),
            (
                "Mono-alkylation of ethyl acetoacetate with methyl iodide (NaOEt) followed by dilute aqueous acid hydrolysis",
                "I",
                "Butan-2-one (methyl ethyl ketone) via ketonic cleavage",
                "Methylation at the active methylene carbon yields ethyl 2-methylacetoacetate; heating with dilute acid hydrolyzes the ester to the beta-keto acid, which decarboxylates cleanly to furnish butan-2-one"
            ),
            (
                "Heating ethyl acetoacetate with concentrated alcoholic KOH (acid cleavage)",
                "III",
                "Two molar equivalents of potassium acetate",
                "Under concentrated basic conditions, hydroxide attacks the keto carbonyl carbon in a retro-Claisen pathway (acid cleavage), cleaving the C-C bond to regenerate two equivalents of acetate salts"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_038 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_038",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the decarboxylative functionalization in List I with its mechanistic pathway in List II:",
        pairs=[
            (
                "Hunsdiecker reaction: silver carboxylate (RCOOAg) refluxed with Br2 in dry CCl4",
                "IV",
                "Radical chain decarboxylation yielding alkyl bromide (RBr) with loss of CO2 and AgBr",
                "Silver carboxylate reacts with Br2 to form an unstable acyl hypobromite (RCOOBr); homolytic cleavage yields an acyloxy radical (RCOO.) that rapidly extrudes CO2 to generate an alkyl radical (R.), which abstracts bromine to afford RBr"
            ),
            (
                "Barton decarboxylation: photolysis of an N-hydroxypyridine-2-thione ester in presence of Bu3SnH",
                "III",
                "Radical decarboxylation reducing the carboxyl group to an alkane (RH) under mild neutral conditions",
                "Irradiation homolytically cleaves the weak N-O bond to generate an acyloxy radical; rapid loss of CO2 produces an alkyl radical, which abstracts hydrogen from tributyltin hydride to deliver the reduced alkane"
            ),
            (
                "Kochi reaction: heating carboxylic acid with lead(IV) acetate and lithium chloride in benzene",
                "II",
                "Decarboxylative chlorination giving alkyl chloride (RCl) via intermediate Pb(IV) carboxylate complex",
                "Lead tetraacetate coordinates to the carboxylate and exchanges with chloride; thermal homolysis generates alkyl radicals that abstract chlorine from Pb(III)-Cl species to furnish alkyl chlorides"
            ),
            (
                "Thermal resistance of bridgehead carboxylic acids (e.g., bicyclo[2.2.1]heptane-1-carboxylic acid) to radical decarboxylation",
                "I",
                "Severely disfavored because bridgehead radicals cannot easily achieve preferred planar or near-planar geometry",
                "Radical decarboxylation requires planarization of the incipient radical center; bridgehead cage geometries impose rigid pyramidal constraints, raising the activation barrier and suppressing decarboxylation"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_039 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_039",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the lactone / lactam or ring-closing transformation in List I with its defining feature in List II:",
        pairs=[
            (
                "Acid-catalyzed heating of 4-hydroxybutanoic acid (gamma-hydroxy acid)",
                "III",
                "Spontaneous intramolecular esterification to form gamma-butyrolactone (5-membered ring)",
                "The intramolecular cyclization has a highly favorable effective molarity and minimal ring strain; the reaction rapidly reaches equilibrium strongly favoring the 5-membered gamma-lactone"
            ),
            (
                "Thermal cyclization of 5-aminopentanoic acid (delta-amino acid)",
                "I",
                "Formation of delta-valerolactam (6-membered cyclic amide / 2-piperidone)",
                "The terminal amino group nucleophilically attacks the carboxyl carbonyl via a chair-like 6-membered transition state, eliminating water to produce a stable 6-membered lactam"
            ),
            (
                "Yamaguchi macrolactonization: long-chain omega-hydroxy acid treated with 2,4,6-trichlorobenzoyl chloride and DMAP",
                "IV",
                "Formation of a large-ring macrolactone under high-dilution conditions",
                "The Yamaguchi reagent forms a mixed anhydride that is activated regioselectively at the aliphatic carbonyl by DMAP; high dilution suppresses competitive intermolecular oligomerization, enabling efficient macrocyclization"
            ),
            (
                "Iodolactonization: treatment of 4-pentenoic acid with I2 and aqueous NaHCO3",
                "II",
                "Stereoselective 5-exo-tet cyclization forming 5-(iodomethyl)dihydrofuran-2-one",
                "Iodine coordinates to the alkene to form an iodonium ion; intramolecular attack of the carboxylate oxygen at the more substituted or Baldwin-favored 5-exo position opens the ring stereoselectively to afford an iodolactone"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_040 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_040",
        topic="Carboxylic Acids and Derivatives",
        difficulty="advanced",
        lead="Match the advanced stereoelectronic or steric effect in carboxylic systems in List I with its observed behavior in List II:",
        pairs=[
            (
                "Hammett reaction constant (rho = +1.00) for benzoic acid ionization in water at 25 °C",
                "I",
                "Reference benchmark: positive rho indicates reaction is accelerated by electron-withdrawing substituents",
                "Hammett equation log(K/K0) = rho * sigma defines rho = +1.00 for benzoic acid ionization; electron-withdrawing groups stabilize the negative charge in the carboxylate conjugate base, increasing the equilibrium ionization constant"
            ),
            (
                "Resistance of 2,6-dimethylbenzoic acid to standard Fischer esterification (MeOH / refluxing HCl)",
                "IV",
                "Extreme steric hindrance around carbonyl carbon blocks bimolecular tetrahedral intermediate formation",
                "Two ortho-methyl groups shield the carbonyl carbon from nucleophilic attack by methanol; esterification cannot proceed via BAC2 or AAC2 pathways, requiring dissolution in concentrated H2SO4 (AAC1 acylium ion mechanism) instead"
            ),
            (
                "Unusual acidity of squaric acid (3,4-dihydroxycyclobut-3-ene-1,2-dione, pKa1 ~1.5, pKa2 ~3.4)",
                "II",
                "Dianion possesses complete cyclic delocalization and aromatic stabilization (2 pi electrons over ring carbonyls)",
                "Deprotonation of both hydroxyl groups creates squarate dianion (C4O4)2-, which has D4h planar symmetry where negative charge is symmetrically distributed over all four oxygen atoms with aromatic electronic delocalization"
            ),
            (
                "Decarboxylation rate of 2,4,6-trinitrobenzoic acid upon gentle warming in water",
                "III",
                "Exceptionally fast decarboxylation yielding 1,3,5-trinitrobenzene via highly stabilized Meisenheimer-like carbanion",
                "Loss of CO2 leaves a carbanion on the aromatic ring that is stabilized by three strongly electron-withdrawing nitro groups through powerful inductive and mesomeric resonance, while relieving severe steric congestion between the ortho-nitro and carboxyl groups"
            ),
        ],
        correct_choice="D"
    ))

    return qs
