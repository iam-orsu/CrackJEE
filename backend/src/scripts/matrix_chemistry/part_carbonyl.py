from builder import make_matrix_q

def get_carbonyl_questions():
    qs = []
    
    # -------------------------------------------------------------------------
    # chem_org2_001 (Beginner, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_001",
        topic="Aldehydes and Ketones",
        difficulty="beginner",
        lead="Match the carbonyl reduction transformation in List I with its characteristic reagent and condition in List II:",
        pairs=[
            (
                "Clemmensen reduction (conversion of >C=O to >CH2)",
                "II",
                "Zn-Hg / concentrated HCl under reflux",
                "Clemmensen reduction employs amalgamated zinc (Zn-Hg) in concentrated hydrochloric acid to reduce aldehydes and ketones to alkanes via electron transfer on the zinc metal surface"
            ),
            (
                "Wolff-Kishner reduction (conversion of >C=O to >CH2)",
                "IV",
                "NH2NH2 followed by heating with KOH in ethylene glycol",
                "Wolff-Kishner reduction condenses the carbonyl compound with hydrazine to form a hydrazone intermediate, which upon heating with strong base (KOH) in high-boiling ethylene glycol eliminates N2 gas to yield an alkane"
            ),
            (
                "Rosenmund reduction (conversion of acyl chloride RCOCl to aldehyde RCHO)",
                "I",
                "H2 over Pd-BaSO4 poisoned with quinoline or sulfur",
                "Rosenmund reduction selectively hydrogenates acid chlorides to aldehydes using Lindlar-type poisoned palladium on barium sulfate catalyst (Pd-BaSO4 / quinoline), preventing further reduction to primary alcohols"
            ),
            (
                "Stephen reduction (conversion of nitrile R-CN to aldehyde RCHO)",
                "III",
                "SnCl2 / HCl followed by hydrolysis with warm water",
                "Stephen reaction reduces alkyl or aryl nitriles with stannous chloride and gaseous HCl to form an aldimine hydrochloride salt [R-CH=NH2]+ Cl-, which on steam distillation / warm water hydrolysis gives the corresponding aldehyde"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_002 (Beginner, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_002",
        topic="Aldehydes and Ketones",
        difficulty="beginner",
        lead="Match the diagnostic qualitative test for carbonyl functional groups in List I with its observable analytical result in List II:",
        pairs=[
            (
                "Tollens' reagent test with ethanal (CH3CHO)",
                "III",
                "Formation of a shining silver mirror (Ag(s)) on the inner wall of the test tube",
                "Tollens' reagent [Ag(NH3)2]+ oxidizes aliphatic and aromatic aldehydes to carboxylate ions while Ag+ is reduced to metallic silver, depositing as a brilliant specular silver mirror"
            ),
            (
                "Fehling's solution test with propanal (CH3CH2CHO)",
                "I",
                "Deposition of a red precipitate of cuprous oxide (Cu2O)",
                "Fehling's alkaline copper(II) tartrate complex selectively oxidizes aliphatic aldehydes to carboxylates, during which Cu2+ is reduced to cuprous oxide (Cu2O), yielding an unmistakable red-brown precipitate"
            ),
            (
                "Iodoform test (I2 / NaOH) with acetone (CH3COCH3)",
                "IV",
                "Formation of a yellow crystalline precipitate of CHI3 with an antiseptic odor",
                "Acetone contains a methyl ketone group (CH3-C=O), which undergoes base-promoted polyhalogenation and carbon-carbon cleavage by hydroxide to produce a bright yellow precipitate of iodoform (CHI3, mp ~119 °C)"
            ),
            (
                "Reaction of benzaldehyde with Brady's reagent (2,4-dinitrophenylhydrazine)",
                "II",
                "Formation of an orange-yellow crystalline hydrazone precipitate",
                "2,4-DNP reacts with both aldehydes and ketones via nucleophilic addition of the primary amino group followed by elimination of H2O to furnish insoluble, highly colored 2,4-dinitrophenylhydrazone crystals"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_003 (Beginner, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_003",
        topic="Aldehydes and Ketones",
        difficulty="beginner",
        lead="Match the nucleophilic addition reaction of acetone in List I with the resulting organic adduct/derivative in List II:",
        pairs=[
            (
                "Reaction of acetone with hydrogen cyanide (HCN / catalytic base)",
                "IV",
                "Acetone cyanohydrin ((CH3)2C(OH)CN)",
                "Cyanide ion (CN-) attacks the electrophilic carbonyl carbon of acetone to form an alkoxide, which is then protonated by HCN to generate acetone cyanohydrin (2-hydroxy-2-methylpropanenitrile)"
            ),
            (
                "Reaction of acetone with saturated aqueous sodium bisulfite (NaHSO3)",
                "II",
                "White crystalline bisulfite addition adduct ((CH3)2C(OH)SO3Na)",
                "Bisulfite ion acts as a sulfur nucleophile attacking the carbonyl carbon to form a tetrahedral intermediate, which upon proton transfer precipitates as a crystalline water-soluble sodium sulfonate salt"
            ),
            (
                "Reaction of acetone with methylmagnesium bromide followed by hydronium workup",
                "I",
                "tert-Butyl alcohol ((CH3)3C-OH)",
                "Nucleophilic addition of the methyl carbanion equivalent from CH3MgBr to acetone generates a magnesium alkoxide, which upon acidic workup yields 2-methylpropan-2-ol (tert-butanol)"
            ),
            (
                "Reaction of acetone with hydroxylamine hydrochloride (NH2OH.HCl / weak base)",
                "III",
                "Acetone oxime ((CH3)2C=N-OH)",
                "Hydroxylamine undergoes nucleophilic attack on the carbonyl carbon followed by proton transfers and dehydrative elimination of water to afford the crystalline oxime (CH3)2C=N-OH"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_004 (Beginner, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_004",
        topic="Aldehydes and Ketones",
        difficulty="beginner",
        lead="Match the oxidation reaction of carbonyl compounds in List I with the characteristic reagent/product in List II:",
        pairs=[
            (
                "Oxidation of benzyl alcohol to benzaldehyde without over-oxidation to benzoic acid",
                "I",
                "Pyridinium chlorochromate (PCC) in anhydrous CH2Cl2",
                "PCC is a mild, non-aqueous chromium(VI) oxidant that cleanly oxidizes primary alcohols to aldehydes without hydrating the intermediate to a gem-diol, thus preventing over-oxidation to carboxylic acids"
            ),
            (
                "Conversion of acetophenone (PhCOCH3) to phenyl acetate (CH3COOC6H5) via Baeyer-Villiger oxidation",
                "III",
                "Peroxy acid (e.g., m-CPBA or CF3COOOH)",
                "Baeyer-Villiger oxidation of acetophenone involves peroxy acid attack followed by selective migration of the phenyl group over the methyl group to oxygen, producing phenyl acetate"
            ),
            (
                "Vigorous oxidation of pentan-3-one with hot concentrated HNO3 (Popoff's rule)",
                "IV",
                "Equimolar mixture of propanoic acid (CH3CH2COOH) and acetic acid (CH3COOH)",
                "Oxidation of unsymmetrical or symmetrical dialkyl ketones cleaves the C-C bond adjacent to carbonyl; for pentan-3-one, cleavage of the C2-C3 bond produces propanoic acid and acetic acid according to Popoff's rule"
            ),
            (
                "Mild selective oxidation of toluene to benzaldehyde using chromyl chloride (Etard reaction)",
                "II",
                "CrO2Cl2 in CS2 followed by aqueous hydrolysis",
                "Etard reaction uses chromyl chloride in carbon disulfide to oxidize the benzylic methyl group to a brown insoluble chromium complex [PhCH(OCrOHCl2)2], which on aqueous hydrolysis gives benzaldehyde"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_005 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_005",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the specific aldol or enolate condensation reaction in List I with its final dehydrated organic product in List II:",
        pairs=[
            (
                "Self-aldol condensation of acetaldehyde (CH3CHO) upon heating with dilute NaOH",
                "II",
                "Crotonaldehyde (but-2-enal, CH3-CH=CH-CHO)",
                "Hydroxide deprotonates acetaldehyde to generate its resonance-stabilized enolate, which nucleophilically attacks another acetaldehyde molecule to form 3-hydroxybutanal; heating dehydrates this beta-hydroxyaldehyde to the conjugated E-alkene crotonaldehyde"
            ),
            (
                "Crossed aldol condensation of benzaldehyde with excess acetone under alkaline conditions (Claisen-Schmidt)",
                "I",
                "4-Phenylbut-3-en-2-one (benzylideneacetone, Ph-CH=CH-COCH3)",
                "Benzaldehyde lacks alpha-hydrogens and acts exclusively as an electrophilic acceptor; enolate generated from acetone attacks benzaldehyde, and subsequent dehydration affords conjugated benzylideneacetone"
            ),
            (
                "Intramolecular aldol condensation of hexane-2,5-dione with aqueous base upon heating",
                "IV",
                "3-Methylcyclopent-2-en-1-one",
                "Deprotonation of the terminal methyl group yields an enolate that attacks the internal carbonyl carbon, forming a stable 5-membered cyclic beta-hydroxyketone which rapidly dehydrates to 3-methylcyclopent-2-en-1-one"
            ),
            (
                "Crossed aldol reaction between benzaldehyde and acetophenone with dilute alkali followed by heat",
                "III",
                "1,3-Diphenylprop-2-en-1-one (chalcone, Ph-CH=CH-CO-Ph)",
                "Acetophenone enolate attacks benzaldehyde to yield 3-hydroxy-1,3-diphenylpropan-1-one, which upon base-catalyzed E1cB dehydration produces the intensely conjugated trans-chalcone"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_006 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_006",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the Cannizzaro or related rearrangement transformation in List I with its key product distribution in List II:",
        pairs=[
            (
                "Disproportionation of pure benzaldehyde (PhCHO) with 50% concentrated aqueous KOH",
                "IV",
                "Equimolar mixture of potassium benzoate (PhCOOK) and benzyl alcohol (PhCH2OH)",
                "In the Cannizzaro reaction, hydroxide attacks one benzaldehyde molecule to form a dianionic or monoanionic tetrahedral hydrate that transfers a hydride ion directly to a second benzaldehyde molecule, yielding benzoate and benzyl alcohol"
            ),
            (
                "Crossed Cannizzaro reaction between benzaldehyde (PhCHO) and excess formaldehyde (HCHO)",
                "III",
                "Sodium formate (HCOONa) and benzyl alcohol (PhCH2OH)",
                "Formaldehyde possesses a much higher electrophilicity and lacks steric hindrance, so OH- attacks HCHO preferentially; the resulting tetrahedral adduct transfers hydride to benzaldehyde, reducing PhCHO to PhCH2OH while HCHO oxidizes to formate"
            ),
            (
                "Intramolecular Cannizzaro reaction of phenylglyoxal (PhCOCHO) with concentrated base",
                "II",
                "Mandelic acid salt (PhCH(OH)COO-)",
                "Hydroxide preferentially attacks the more electrophilic formyl carbonyl carbon of PhCOCHO; intramolecular hydride transfer from the formyl carbon to the adjacent keto carbonyl yields the alpha-hydroxy acid mandelate"
            ),
            (
                "Treatment of benzil (Ph-CO-CO-Ph) with hot aqueous KOH (Benzil-benzilic acid rearrangement)",
                "I",
                "Potassium benzilate (Ph2C(OH)COOK)",
                "Hydroxide nucleophilically adds to one keto carbonyl group of benzil, followed by 1,2-migration of a phenyl carbanion to the adjacent carbonyl carbon with simultaneous proton transfer, generating the stable alpha-hydroxy acid benzilate"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_007 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_007",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the carbonyl-ammonia derivative condensation reaction in List I with its resulting derivative in List II:",
        pairs=[
            (
                "Condensation of benzaldehyde with hydroxylamine (NH2OH) at pH ~4.5",
                "III",
                "Benzaldoxime (PhCH=N-OH), exhibiting syn- and anti- geometrical isomerism",
                "Hydroxylamine adds to benzaldehyde to give a carbinolamine intermediate, which undergoes acid-catalyzed dehydration to afford benzaldoxime; the restricted rotation about C=N gives rise to isolable syn- and anti- diastereomers"
            ),
            (
                "Condensation of cyclohexanone with semicarbazide hydrochloride in sodium acetate buffer",
                "I",
                "Cyclohexanone semicarbazone (C6H10=N-NH-CO-NH2)",
                "Semicarbazide (H2N-CO-NH-NH2) reacts selectively via its hydrazine terminal -NH2 because the amide -NH2 is deactivated by amide resonance; dehydration gives crystalline cyclohexanone semicarbazone"
            ),
            (
                "Condensation of acetophenone with 2,4-dinitrophenylhydrazine in ethanol/acid",
                "IV",
                "Acetophenone 2,4-dinitrophenylhydrazone (red-orange crystalline solid)",
                "The nucleophilic terminal amino group of 2,4-DNP attacks acetophenone's carbonyl group, followed by water elimination to yield a high-melting, intensely colored 2,4-dinitrophenylhydrazone derivative used for characterization"
            ),
            (
                "Reaction of ethanal with ethylamine (CH3CH2NH2) in the presence of molecular sieves",
                "II",
                "Schiff base / imine (CH3-CH=N-CH2CH3)",
                "Primary aliphatic amines react with aldehydes to form carbinolamines that rapidly eliminate water to furnish N-substituted imines (Schiff bases), which are stabilized under anhydrous conditions"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_008 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_008",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the carbonyl protection/deprotection or acetal transformation in List I with the corresponding product or intermediate in List II:",
        pairs=[
            (
                "Reaction of cyclohexanone with ethylene glycol (HO-CH2CH2-OH) in dry benzene with p-TsOH catalyst",
                "I",
                "1,4-Dioxaspiro[4.5]decane (cyclic ethylene ketal)",
                "Acid-catalyzed nucleophilic addition of both hydroxyl groups of ethylene glycol with continuous azeotropic removal of water converts cyclohexanone into a stable 5-membered cyclic ketal protecting group"
            ),
            (
                "Treatment of an ethylene ketal with aqueous dilute HCl at room temperature",
                "IV",
                "Regeneration of the parent ketone and ethylene glycol via hydrolytic cleavage",
                "Ketals are inert to bases and nucleophiles but undergo facile acid-catalyzed hydrolysis: reversible protonation of the ketal oxygens followed by water attack cleaves both C-O bonds to restore the carbonyl group"
            ),
            (
                "Reaction of acetone with ethane-1,2-dithiol in the presence of BF3.OEt2 (thioacetal formation)",
                "II",
                "Cyclic dithioketal (1,3-dithiolane derivative)",
                "Dithiols react readily with ketones under Lewis acid catalysis (BF3 etherate) to form cyclic 1,3-dithiolanes, which protect carbonyl groups against both acidic and basic reagents"
            ),
            (
                "Mozingo reduction: treatment of a cyclic dithioketal with Raney nickel (H2 / Raney Ni)",
                "III",
                "Direct desulfurization to yield the corresponding methylene hydrocarbon (>CH2)",
                "Raney nickel contains adsorbed hydrogen and readily cleaves carbon-sulfur bonds homolytically, achieving reductive desulfurization of dithioketals to alkanes under neutral, non-acidic conditions"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_009 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_009",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the chemoselective carbonyl reduction in List I with its unique reagent/condition in List II:",
        pairs=[
            (
                "Reduction of an alpha,beta-unsaturated ketone selectively to an allylic alcohol without reducing the C=C double bond",
                "II",
                "NaBH4 in the presence of CeCl3.7H2O in MeOH (Luche reduction)",
                "Luche reduction uses lanthanide Lewis acid CeCl3 to coordinate to the carbonyl oxygen, dramatically increasing the rate of 1,2-hydride addition by sodium borohydride over competitive 1,4-conjugate reduction"
            ),
            (
                "Reduction of an ester or nitrile to an aldehyde at -78 °C in toluene without over-reduction",
                "IV",
                "Diisobutylaluminum hydride (DIBAL-H, 1 equivalent) followed by low-temperature aqueous workup",
                "DIBAL-H at -78 °C adds one hydride equivalent to esters/nitriles to form a stable tetrahedral hemiacetal alkoxide or aldimine aluminum intermediate that does not collapse until aqueous hydrolytic quench"
            ),
            (
                "Selective reduction of an aldehyde in the presence of a ketone in the same molecule",
                "I",
                "NaBH4 in ethanol at -78 °C or NaBH4 in presence of cerium salts",
                "Aldehydes possess significantly higher electrophilicity and lower steric hindrance than ketones; kinetic control at low temperature enables NaBH4 to reduce aldehydes preferentially"
            ),
            (
                "Meerwein-Ponndorf-Verley (MPV) reduction of ketones to secondary alcohols under thermodynamic equilibrium",
                "III",
                "Al(OiPr)3 in isopropyl alcohol with continuous distillation of formed acetone",
                "MPV reduction transfers hydride from aluminum isopropoxide to the ketone via a cyclic 6-membered transition state; equilibrium is shifted to completion by distilling out the lower-boiling byproduct acetone"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_010 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_010",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the alpha-functionalization or oxidation of carbonyls in List I with its characteristic product/outcome in List II:",
        pairs=[
            (
                "Bromination of acetone in glacial acetic acid with 1 equivalent of Br2 (acid-catalyzed)",
                "IV",
                "Bromoacetone (monobromination with no polybromination)",
                "Under acid catalysis, the rate-determining step is enol formation; introduction of the electronegative bromine atom into bromoacetone decreases the basicity of the carbonyl oxygen, slowing subsequent enolization and preventing polybromination"
            ),
            (
                "Bromination of acetone in aqueous sodium hydroxide with excess Br2 (base-catalyzed)",
                "III",
                "Bromoform (CHBr3) and sodium acetate (polyhalogenation and C-C cleavage)",
                "Under basic conditions, the alpha-bromo ketone has more acidic alpha-hydrogens than acetone, making successive deprotonation and halogenation progressively faster until tribromoacetone forms and undergoes haloform cleavage"
            ),
            (
                "Oxidation of acetophenone (PhCOCH3) with selenium dioxide (SeO2) in refluxing dioxane",
                "II",
                "Phenylglyoxal (PhCOCHO)",
                "Selenium dioxide selectively oxidizes active alpha-methyl or alpha-methylene groups adjacent to carbonyl to dicarbonyl compounds via an enol selenite ester intermediate followed by Pummerer-like elimination"
            ),
            (
                "Reaction of cyclohexanone with SeO2 in ethanol upon heating",
                "I",
                "Cyclohexane-1,2-dione",
                "SeO2 oxidizes the alpha-methylene carbon of cyclohexanone directly to a 1,2-diketone (cyclohexane-1,2-dione), which predominantly exists in its mono-enol tautomeric form"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_011 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_011",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the named condensation transformation of aldehydes/ketones in List I with its core reagent and product in List II:",
        pairs=[
            (
                "Perkin reaction: heating benzaldehyde with acetic anhydride and sodium acetate at 180 °C",
                "II",
                "Cinnamic acid (Ph-CH=CH-COOH) after aqueous acidification",
                "Acetate ion deprotonates acetic anhydride to generate an enolate that attacks benzaldehyde; intramolecular acyl transfer followed by dehydration and anhydride hydrolysis affords cinnamic acid"
            ),
            (
                "Knoevenagel condensation: benzaldehyde with diethyl malonate catalyzed by piperidine",
                "IV",
                "Diethyl benzylidenemalonate (Ph-CH=C(COOEt)2)",
                "The active methylene hydrogens of malonic ester (pKa ~13) are readily deprotonated by amine bases like piperidine; addition to benzaldehyde followed by facile dehydration yields the alkylidene malonate"
            ),
            (
                "Reformatsky reaction: benzaldehyde with ethyl bromoacetate in the presence of metallic zinc",
                "I",
                "Ethyl 3-hydroxy-3-phenylpropanoate (beta-hydroxy ester)",
                "Zinc metal inserts into the C-Br bond to form an organozinc enolate (Reformatsky reagent BrZnCH2COOEt), which is less basic and selectively adds to the aldehyde carbonyl without self-condensation"
            ),
            (
                "Benzoin condensation: heating benzaldehyde with catalytic sodium or potassium cyanide in aqueous ethanol",
                "III",
                "Benzoin (Ph-CH(OH)-CO-Ph)",
                "Cyanide ion acts as a specific nucleophilic catalyst that adds to PhCHO, inverts the polarity of the formyl carbon (umpolung) via carbanion stabilization, attacks a second PhCHO molecule, and departs to produce benzoin"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_012 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_012",
        topic="Aldehydes and Ketones",
        difficulty="intermediate",
        lead="Match the organometallic addition to carbonyl compounds in List I with its regiochemical/functional outcome in List II:",
        pairs=[
            (
                "Reaction of cyclohex-2-en-1-one with lithium dimethylcuprate ((CH3)2CuLi) followed by aqueous NH4Cl",
                "I",
                "3-Methylcyclohexan-1-one (exclusive 1,4-conjugate addition)",
                "Gilman reagents (soft organocuprates) deliver methyl groups selectively to the beta-position of conjugated enones via single-electron transfer / d-orbital interaction, giving the 1,4-addition product exclusively"
            ),
            (
                "Reaction of cyclohex-2-en-1-one with methylmagnesium bromide (CH3MgBr) followed by aqueous acid",
                "III",
                "1-Methylcyclohex-2-en-1-ol (predominant 1,2-carbonyl addition)",
                "Hard organolithium and Grignard reagents possess high charge density on the carbanionic carbon and preferentially attack the hard, highly electrophilic carbonyl carbon (1,2-addition)"
            ),
            (
                "Reaction of benzaldehyde with methylenetriphenylphosphorane (Ph3P=CH2, Wittig reagent)",
                "IV",
                "Styrene (PhCH=CH2) and triphenylphosphine oxide (Ph3P=O)",
                "The nucleophilic carbanion of the phosphonium ylide attacks benzaldehyde to form an oxaphosphetane 4-membered ring intermediate, which collapses driven by the immense P=O bond strength to yield styrene"
            ),
            (
                "Reaction of cyclohexanone with dimethylsulfonium methylide (Me2S+=CH2, Corey-Chaykovsky reagent)",
                "II",
                "1-Oxaspiro[2.5]octane (spiro-epoxide / oxirane)",
                "Non-stabilized dimethylsulfonium methylide undergoes nucleophilic 1,2-addition to cyclohexanone to yield a betaine alkoxide; intramolecular displacement of dimethyl sulfide (Me2S) delivers the epoxide"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_013 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_013",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the stereoselective carbonyl addition or model in List I with its governing mechanistic principle in List II:",
        pairs=[
            (
                "Addition of MeMgBr to 2-phenylpropanal under non-chelating conditions",
                "II",
                "Felkin-Anh transition state with perpendicular alignment of largest group (Ph) to C=O",
                "In the Felkin-Anh open-chain model, the largest group (phenyl) adopts a conformation perpendicular to the carbonyl pi* orbital; nucleophile attacks at the Burgi-Dunitz angle (~107°) anti to the large group, minimizing steric and torsional strain"
            ),
            (
                "Addition of MeMgBr to 2-benzyloxypropanal in the presence of Mg(II) or Ti(IV) Lewis acids",
                "IV",
                "Cram-chelation controlled attack yielding the anti-1,2-diol derivative as major diastereomer",
                "Bidentate Lewis acids coordinate simultaneously to both the carbonyl oxygen and the alpha-benzyloxy oxygen, locking the molecule into a rigid 5-membered cyclic chelate; nucleophile attacks from the less hindered face opposite the alpha-methyl group"
            ),
            (
                "Zimmerman-Traxler chair-like transition state in (Z)-enolate aldol additions",
                "I",
                "Selective formation of the syn-aldol adduct driven by equatorial placement of substituents",
                "The Zimmerman-Traxler model organizes the enolate and aldehyde around a coordinated metal cation (Li+ or B(III)) in a chair conformation; for (Z)-enolates, equatorial aldehyde orientation leads selectively to syn-beta-hydroxy carbonyl adducts"
            ),
            (
                "Asymmetric reduction of prochiral ketones using Corey-Bakshi-Shibata (CBS) oxazaborolidine catalyst",
                "III",
                "Face-selective hydride delivery from BH3 coordinated to chiral proline-derived Lewis acid",
                "The CBS catalyst coordinates both borane and the ketone in a well-defined steric pocket; hydride is transferred intramolecularly to the Re- or Si-face of the carbonyl, achieving enantiomeric excesses typically >95%"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_014 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_014",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the regioselective enolate generation / alkylation of 2-methylcyclohexanone in List I with its outcome in List II:",
        pairs=[
            (
                "Treatment of 2-methylcyclohexanone with LDA in THF at -78 °C followed by chlorotrimethylsilane (TMSCl)",
                "IV",
                "6-Methyl-1-(trimethylsilyloxy)cyclohex-1-ene (kinetic silyl enol ether)",
                "Lithium diisopropylamide (LDA) is a bulky, strong, non-nucleophilic base; at -78 °C under kinetic control, it deprotonates the less hindered alpha-methylene carbon (C6) rather than the more substituted tertiary carbon (C2)"
            ),
            (
                "Heating 2-methylcyclohexanone with triethylamine and TMSCl in DMF at 130 °C (thermodynamic control)",
                "III",
                "2-Methyl-1-(trimethylsilyloxy)cyclohex-1-ene (thermodynamic silyl enol ether)",
                "Under reversible equilibrating conditions at elevated temperature, the more highly substituted, thermodynamically more stable enol silyl ether (tetrasubstituted double bond) is formed predominantly"
            ),
            (
                "Alkylation of 2-methylcyclohexanone: treatment with LDA at -78 °C followed by allyl bromide",
                "I",
                "2-Allyl-6-methylcyclohexan-1-one",
                "Kinetic deprotonation at the less hindered C6 position generates the less substituted enolate, which undergoes subsequent SN2 attack on allyl bromide to yield the 2,6-disubstituted ketone cleanly"
            ),
            (
                "Robinson annulation of 2-methylcyclohexanone with methyl vinyl ketone in the presence of KOH",
                "II",
                "10-Methyl-1,4,4a,5,6,7-hexahydronaphthalen-2-one (bicyclic conjugated enone)",
                "Thermodynamic enolate generated at the more substituted C2 position undergoes Michael conjugate addition to methyl vinyl ketone, followed by intramolecular aldol condensation and dehydration to give the fused 6-6 bicyclic octalone"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_015 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_015",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the phosphorus or sulfur ylide reaction in List I with its stereochemical / mechanistic outcome in List II:",
        pairs=[
            (
                "Reaction of benzaldehyde with non-stabilized ylide Ph3P=CHCH3 in salt-free THF (Wittig)",
                "IV",
                "Predominantly (Z)-1-phenylprop-1-ene (cis-alkene)",
                "Non-stabilized alkylidene phosphoranes react with aldehydes via kinetic puckered cis-oxaphosphetane transition states; in the absence of lithium salts, irreversible cyclo-reversion occurs with retention of geometry to yield (Z)-alkenes"
            ),
            (
                "Horner-Wadsworth-Emmons (HWE) reaction of benzaldehyde with triethyl phosphonoacetate in presence of NaH",
                "II",
                "Predominantly ethyl (E)-cinnamate (trans-alkene)",
                "Phosphonate-stabilized carbanions add reversibly to aldehydes; the reversible retro-aldol equilibration permits conversion to the thermodynamically favored trans-oxaphosphetane, yielding the (E)-alpha,beta-unsaturated ester and water-soluble dialkyl phosphate"
            ),
            (
                "Reaction of cyclohex-2-en-1-one with dimethylsulfoxonium methylide (Me2S(=O)=CH2)",
                "I",
                "Bicyclo[4.1.0]heptan-2-one (cyclopropanation across the conjugated C=C bond)",
                "The stabilized sulfoxonium ylide is a soft, reversible nucleophile that selectively undergoes 1,4-conjugate addition to enones; subsequent intramolecular enolate SN2 ring closure displaces DMSO to form a cyclopropane"
            ),
            (
                "Reaction of cyclohex-2-en-1-one with dimethylsulfonium methylide (Me2S+=CH2)",
                "III",
                "1-Oxaspiro[2.5]oct-4-ene (epoxidation selectively at the carbonyl group)",
                "The non-stabilized sulfonium ylide is a hard, kinetic nucleophile that undergoes direct 1,2-addition to the carbonyl group; rapid collapse of the alkoxide intermediate expels dimethyl sulfide to yield an allylic epoxide"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_016 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_016",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the Baeyer-Villiger oxidation in List I with its specific migratory aptitude / product in List II:",
        pairs=[
            (
                "Oxidation of camphor with peracetic acid or m-CPBA",
                "I",
                "Migration of the bridgehead tertiary carbon to give a bicyclic lactone",
                "In Baeyer-Villiger oxidation, migratory aptitude follows the order tertiary alkyl > secondary alkyl > benzyl ~ phenyl > primary alkyl > methyl; in camphor, the tertiary bridgehead carbon migrates preferentially with complete retention of configuration"
            ),
            (
                "Oxidation of 4-methoxyacetophenone with m-CPBA in dichloromethane",
                "IV",
                "4-Methoxyphenyl acetate (migration of the electron-rich aryl ring)",
                "Electron-donating p-methoxy group stabilizes the developing partial positive charge in the migratory transition state; aryl group migrates exclusively over the methyl group to furnish the aryl ester"
            ),
            (
                "Oxidation of 4-nitroacetophenone with trifluoroperacetic acid (CF3COOOH)",
                "II",
                "Methyl 4-nitrobenzoate (migration of methyl group over deactivated aryl ring)",
                "The strongly electron-withdrawing p-nitro group destabilizes positive charge accumulation on the aromatic ring during migration, depressing the aryl migratory aptitude below that of the methyl group"
            ),
            (
                "Oxidation of cyclobutanone with aqueous hydrogen peroxide or m-CPBA",
                "III",
                "gamma-Butyrolactone (5-membered cyclic ester) driven by release of 4-membered ring strain",
                "Baeyer-Villiger insertion of oxygen into cyclobutanone is exceptionally facile because migration relieves substantial ring strain (~26 kcal/mol) of the 4-membered ring, generating stable gamma-butyrolactone"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_017 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_017",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the complex intramolecular condensation/cyclization in List I with its mechanistic pathway in List II:",
        pairs=[
            (
                "Intramolecular aldol condensation of heptane-2,6-dione treated with aqueous alkali",
                "II",
                "3-Methylcyclohex-2-en-1-one via 6-endo-trig/exo-trig enolate cyclization and dehydration",
                "Deprotonation at C1 gives an enolate that attacks C6 to form a favored 6-membered ring; deprotonation at C3 would lead to a strained 4-membered ring, so 6-membered cyclic enone formation occurs exclusively"
            ),
            (
                "Intramolecular aldol condensation of octane-2,7-dione treated with aqueous base",
                "IV",
                "1-(2-Methylcyclopent-1-en-1-yl)ethan-1-one (5-membered ring rather than 7-membered ring)",
                "Deprotonation at C3 produces an internal enolate that attacks the C7 carbonyl, closing a thermodynamically and kinetically favored 5-membered ring over the alternative 7-membered ring"
            ),
            (
                "Nazarov cyclization: treatment of divinyl ketone with strong Lewis or Bronsted acid",
                "I",
                "Conrotatory 4-pi electrocyclic ring closure yielding a cyclopent-2-en-1-one derivative",
                "Protonation of divinyl ketone generates a pentadienyl cation possessing 4 pi electrons; under thermal conditions, orbital symmetry dictates a conrotatory 4-pi electrocyclization to give an oxyallyl cation that deprotonates to a cyclopentenone"
            ),
            (
                "Dieckmann condensation of diethyl pimelate (heptanedioic acid diester) with sodium ethoxide",
                "III",
                "Ethyl 2-oxocyclohexanecarboxylate via intramolecular Claisen condensation",
                "Ethoxide generates an ester enolate that attacks the opposite ester carbonyl, eliminating ethoxide to close a strain-free 6-membered beta-keto ester ring in high yield"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_018 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_018",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the pinacol-pinacolone or related rearrangement in List I with its mechanistic outcome in List II:",
        pairs=[
            (
                "Pinacol rearrangement of 1,1,2-triphenylethane-1,2-diol in concentrated H2SO4",
                "IV",
                "Selective protonation/loss of OH at the diphenylic carbon and hydride shift from C2 to give Ph2CH-CO-Ph",
                "Protonation occurs preferentially at the benzylic carbon carrying two phenyl groups because it generates the far more stable resonance-stabilized tertiary benzylic carbocation; subsequent 1,2-hydride shift from the adjacent carbon gives diphenylmethyl phenyl ketone"
            ),
            (
                "Pinacol rearrangement of 2,3-diphenylbutane-2,3-diol with acid catalyst",
                "III",
                "Phenyl group migrates preferentially over methyl group to yield 3,3-diphenylbutan-2-one",
                "Both carbinol centers are identical; upon dehydration to a benzylic carbocation, the phenyl group migrates preferentially due to its higher migratory aptitude (anchimeric assistance via a phenonium ion intermediate) over the methyl group"
            ),
            (
                "Favorskii rearrangement of 2-chlorocyclohexanone upon treatment with sodium methoxide",
                "II",
                "Methyl cyclopentanecarboxylate via a symmetrical cyclopropanone intermediate",
                "Methoxide abstracts an alpha-hydrogen from the non-halogenated side to generate an enolate, which internally displaces chloride to form a bicyclic cyclopropanone intermediate; ring-opening by methoxide attacks the carbonyl to give the ring-contracted ester"
            ),
            (
                "Benzil-benzilic acid rearrangement in D2O / NaOD medium",
                "I",
                "No deuterium incorporation into the migrated phenyl ring confirming an intramolecular shift",
                "Hydroxide attack is reversible, but the 1,2-phenyl shift is concerted and irreversible; crossover experiments and lack of isotopic exchange demonstrate that the migrating phenyl group never becomes a free carbanion"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_019 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_019",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the photochemical / radical carbonyl transformation in List I with its mechanistic description in List II:",
        pairs=[
            (
                "Norrish Type I cleavage of acyclic ketones upon UV irradiation",
                "IV",
                "Homolytic alpha-cleavage of the C-C bond adjacent to carbonyl yielding acyl and alkyl radical pairs",
                "Photoexcitation to the n->pi* triplet state promotes homolytic fission of the alpha C-C bond; the resulting acyl radical can undergo decarbonylation (loss of CO) or disproportionation"
            ),
            (
                "Norrish Type II cleavage of ketones possessing gamma-hydrogens (e.g., hexan-2-one) upon UV irradiation",
                "II",
                "Intramolecular 1,5-hydrogen atom abstraction via 6-membered cyclic transition state yielding an alkene and an enol",
                "The photoexcited carbonyl oxygen abstracts a hydrogen atom from the gamma-carbon through a 6-membered ring transition state to create a 1,4-biradical; beta-scission then splits this into an alkene and an enol (which tautomerizes to ketone)"
            ),
            (
                "Photochemical Paterno-Buchi reaction of benzophenone with 2-methylbut-2-ene",
                "I",
                "[2+2] Photocycloaddition yielding an oxetane (4-membered oxacyclobutane)",
                "The triplet excited state of benzophenone adds to the alkene double bond to generate the most stable 1,4-biradical intermediate; subsequent spin inversion and radical recombination form the 4-membered oxetane ring"
            ),
            (
                "Reductive dimerization of acetone with magnesium amalgam (Mg-Hg) in benzene followed by water",
                "III",
                "Pinacol (2,3-dimethylbutane-2,3-diol) via single electron transfer and ketyl radical coupling",
                "Magnesium transfers one electron to each of two acetone molecules, generating two ketyl radical anions coordinated to Mg2+; dimerization of these radicals forms a pinacolate salt, which on hydrolysis yields pinacol"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_020 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_020",
        topic="Aldehydes and Ketones",
        difficulty="advanced",
        lead="Match the multi-component or tandem named carbonyl transformation in List I with its defining feature in List II:",
        pairs=[
            (
                "Mannich reaction: acetophenone + formaldehyde + dimethylamine hydrochloride in acidic ethanol",
                "I",
                "Formation of a beta-aminoketone (Mannich base, PhCOCH2CH2N(CH3)2) via an iminium ion intermediate",
                "Formaldehyde and dimethylamine condense in acid to form an electrophilic iminium ion (H2C=N+(CH3)2), which is trapped by the enol of acetophenone to deliver the beta-amino carbonyl product"
            ),
            (
                "Stobbe condensation: benzophenone with diethyl succinate in the presence of potassium tert-butoxide",
                "III",
                "Formation of an alkylidene succinic acid monoester via a paraconic acid lactone intermediate",
                "Enolate of diethyl succinate attacks benzophenone; the resulting alkoxide attacks the neighboring ester carbonyl to form a cyclic lactone (paraconic ester), which opens via base-promoted E2 elimination to a half-ester"
            ),
            (
                "Darzens glycidic ester condensation: acetophenone with ethyl chloroacetate in the presence of NaOEt",
                "IV",
                "Formation of an alpha,beta-epoxy ester (glycidic ester) via intramolecular enolate displacement of chloride",
                "Deprotonation of ethyl chloroacetate gives an alpha-chloro enolate that nucleophilically attacks the ketone; the generated alkoxide executes an internal SN2 displacement of chloride to close an oxirane ring"
            ),
            (
                "Eschenmoser salt (H2C=N+Me2 I-) reaction with cyclohexanone enol silyl ether",
                "II",
                "2-[(Dimethylamino)methyl]cyclohexan-1-one used as precursor for alpha-methylenation",
                "The dimethylmethyleneammonium cation acts as a powerful electrophile, reacting cleanly with the silyl enol ether without polyalkylation; quaternization with MeI followed by Hofmann elimination yields alpha-methylenecyclohexanone"
            ),
        ],
        correct_choice="D"
    ))

    return qs
