import sys
import os

# Add current directory to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

TOPIC = "Environmental Chemistry"

def get_environmental_questions():
    questions = []

    # ----------------------------------------------------
    # Beginner Questions (chem_app_021 - chem_app_024)
    # ----------------------------------------------------

    # chem_app_021 (Beginner, Ans: A)
    pairs_021 = [
        ("Troposphere", "II", "Lowest region extending up to ~10 km from sea level, containing ~80% of atmospheric mass and all weather phenomena", 
         "The troposphere is the lowest atmospheric layer where humans and other organisms live, containing water vapor, clouds, and turbulent air movement"),
        ("Stratosphere", "III", "Region extending from 10 to 50 km above sea level, containing the protective ozone layer", 
         "The stratosphere lies above the troposphere up to 50 km and houses the ozone layer (O3) which shields Earth from harmful solar ultraviolet radiation"),
        ("Mesosphere", "IV", "Region extending from 50 to 85 km where temperature drops to the lowest atmospheric levels (-90 °C)", 
         "The mesosphere extends from 50 to 85 km above the stratopause; temperatures decrease with altitude down to approximately -90 °C"),
        ("Thermosphere", "I", "Uppermost atmospheric layer containing ionized gases and experiencing temperature rise up to 1500 °C", 
         "The thermosphere (ionosphere) extends above 85 km, characterized by ionization of gases by high-energy solar radiation and rising temperatures")
    ]
    questions.append(make_matrix_q(
        "chem_app_021", TOPIC, "beginner",
        "Match each atmospheric layer/zone in List I with its characteristic boundary/feature in List II:",
        pairs_021, "A"
    ))

    # chem_app_022 (Beginner, Ans: B)
    pairs_022 = [
        ("Carbon monoxide (CO)", "III", "Binds to hemoglobin with ~300 times greater affinity than O2, forming carboxyhemoglobin and causing asphyxiation", 
         "CO binds tightly to iron(II) in hemoglobin forming stable carboxyhemoglobin, which reduces oxygen delivery to tissues, causing headaches, dizziness, and asphyxiation"),
        ("Sulfur dioxide (SO2)", "IV", "Causes severe respiratory irritation, stiffness of flower buds, and acid rain", 
         "SO2 gas causes respiratory irritation, bronchoconstriction in humans, causes stiffness and premature falling of flower buds in plants, and forms sulfuric acid in rain"),
        ("Nitrogen dioxide (NO2)", "I", "Causes acute respiratory distress in humans, leaf damage in plants, and contributes to photochemical smog", 
         "NO2 is a reddish-brown toxic gas that irritates lungs, damages living tissues, causes necrosis in leaves, and photolytically generates ozone in photochemical smog"),
        ("Carbon dioxide (CO2)", "II", "Major greenhouse gas that absorbs infrared radiation, contributing significantly to global warming", 
         "CO2 is a natural atmospheric gas whose elevated emissions from fossil fuel burning trap outgoing terrestrial IR radiation, driving global warming")
    ]
    questions.append(make_matrix_q(
        "chem_app_022", TOPIC, "beginner",
        "Match the major air pollutant in List I with its primary harmful environmental/biological effect in List II:",
        pairs_022, "B"
    ))

    # chem_app_023 (Beginner, Ans: C)
    pairs_023 = [
        ("Dissolved Oxygen (DO)", "IV", "Oxygen dissolved in water; concentrations below 6 ppm inhibit growth of fish and aquatic life", 
         "DO measures molecular oxygen dissolved in water; unpolluted cold water holds ~8-10 ppm O2; levels below 6 ppm stress fish, and below 4 ppm aquatic life dies"),
        ("Biochemical Oxygen Demand (BOD)", "I", "Amount of oxygen required by bacteria to decompose organic matter in a water sample over 5 days at 20 °C", 
         "BOD is a standard bioassay determining the amount of dissolved O2 consumed by aerobic microorganisms to biologically oxidize organic waste in water"),
        ("Chemical Oxygen Demand (COD)", "II", "Amount of oxygen equivalent required to chemically oxidize all organic and inorganic waste using acidified K2Cr2O7", 
         "COD measures total oxidizable pollutants using a boiling solution of strong chemical oxidant potassium dichromate in acidic medium, oxidizing non-biodegradable species too"),
        ("Eutrophication", "III", "Nutrient enrichment leading to dense algal bloom that chokes aquatic life by severely depleting dissolved oxygen", 
         "Excessive discharge of nitrates and phosphates stimulates dense algal blooms; when the algae die and decompose, bacteria consume all available DO, suffocating fish")
    ]
    questions.append(make_matrix_q(
        "chem_app_023", TOPIC, "beginner",
        "Match the water pollution parameter in List I with its standard definition/value in List II:",
        pairs_023, "C"
    ))

    # chem_app_024 (Beginner, Ans: D)
    pairs_024 = [
        ("Mixture of smoke, fog, and SO2 in cool, humid climate", "I", "Classical smog (London smog, reducing in nature)", 
         "Classical smog occurs in cool, damp climates from coal smoke containing SO2; chemically it is a reducing mixture and is known as London smog"),
        ("Unsaturated hydrocarbons, NO2, O3, and PAN in warm, sunny climate", "II", "Photochemical smog (Los Angeles smog, oxidizing in nature)", 
         "Photochemical smog forms under intense solar UV radiation via reaction of automobile exhaust (NOx and unburnt hydrocarbons), producing an oxidizing haze"),
        ("Acrolein (CH2=CHCHO)", "III", "Powerful eye irritant formed by free radical reactions in photochemical smog", 
         "Acrolein (2-propenal) is an unsaturated aldehyde formed when peroxy radicals react with alkenes in photochemical smog, causing intense ocular stinging"),
        ("Peroxyacetyl nitrate (PAN)", "IV", "Potent lachrymator and phytotoxic secondary pollutant characteristic of photochemical smog", 
         "PAN (CH3COOONO2) is synthesized photochemically from acetyl radicals, O2, and NO2; it causes severe eye tearing and bronchodamage in humans and glazes plant leaves")
    ]
    questions.append(make_matrix_q(
        "chem_app_024", TOPIC, "beginner",
        "Match the chemical component of smog in List I with the type of smog it characteristically defines in List II:",
        pairs_024, "D"
    ))

    # ----------------------------------------------------
    # Intermediate Questions (chem_app_025 - chem_app_032)
    # ----------------------------------------------------

    # chem_app_025 (Intermediate, Ans: A)
    pairs_025 = [
        ("Fluoride (F-) concentration up to 1 ppm", "II", "Converts enamel hydroxyapatite to harder fluorapatite [3Ca3(PO4)2·CaF2] preventing dental cavities", 
         "Fluoride up to 1 ppm (or 1 mg/L) replaces OH- in enamel hydroxyapatite [3Ca3(PO4)2·Ca(OH)2] to form harder, acid-resistant fluorapatite [3Ca3(PO4)2·CaF2]"),
        ("Fluoride (F-) concentration above 2 ppm", "I", "Causes brown mottling and discoloration of teeth", 
         "Excess fluoride (> 2 ppm) interferes with ameloblast enamel matrix formation, leading to dental fluorosis manifested as characteristic brown mottling of teeth"),
        ("Nitrate (NO3-) concentration above 50 ppm", "IV", "Causes methemoglobinemia ('blue baby syndrome') in infants", 
         "In infant gut, intestinal bacteria reduce excess nitrate to nitrite (NO2-), which oxidizes hemoglobin Fe(II) to Fe(III) (methemoglobin), causing cyanosis ('blue baby syndrome')"),
        ("Sulfate (SO4 2-) concentration above 500 ppm", "III", "Produces a severe laxative and cathartic effect on the gastrointestinal tract", 
         "Sulfate concentration in excess of 500 ppm exerts an osmotic purge effect in the intestines, causing acute purgative and laxative distress")
    ]
    questions.append(make_matrix_q(
        "chem_app_025", TOPIC, "intermediate",
        "Match the drinking water quality parameter in List I with the prescribed permissible limit / health effect in List II:",
        pairs_025, "A"
    ))

    # chem_app_026 (Intermediate, Ans: B)
    pairs_026 = [
        ("DDT (Dichlorodiphenyltrichloroethane)", "III", "Persistent organochlorine insecticide that bioaccumulates in adipose tissue and biomagnifies up trophic levels", 
         "DDT is chemically stable, fat-soluble, and non-biodegradable; it accumulates in fatty tissues of organisms and magnifies in concentration up the food chain, thinning birds' eggshells"),
        ("Malathion / Parathion", "IV", "Organophosphate insecticide that inhibits acetylcholinesterase, less persistent but highly toxic to nerves", 
         "Organophosphates degrade faster in the environment than organochlorines but act as potent neurotoxins by irreversibly inhibiting acetylcholinesterase enzyme"),
        ("Sodium chlorate (NaClO3) / Sodium arsenite", "I", "Non-selective inorganic herbicides used for total eradication of vegetation", 
         "Sodium chlorate and sodium arsenite are broad-spectrum, non-selective chemical herbicides that kill all plant foliage by disrupting cellular membrane transport"),
        ("2,4-D (2,4-dichlorophenoxyacetic acid)", "II", "Selective synthetic auxin herbicide primarily used to kill broadleaf weeds", 
         "2,4-D is a chlorinated phenoxy compound that mimics plant growth hormones (auxins), selectively overstimulating growth and killing dicotyledonous broadleaf weeds")
    ]
    questions.append(make_matrix_q(
        "chem_app_026", TOPIC, "intermediate",
        "Match the pesticide/herbicide in List I with its chemical class or environmental impact in List II:",
        pairs_026, "B"
    ))

    # chem_app_027 (Intermediate, Ans: C)
    pairs_027 = [
        ("Smoke particulates", "IV", "Solid or mixture of solid and liquid particles formed during combustion of organic matter (e.g., cigarette smoke, oil smoke)", 
         "Smoke particles consist of carbon soot and condensed volatile hydrocarbons formed during incomplete combustion of fuels like coal, oil, and wood"),
        ("Dust particulates", "III", "Fine solid particles produced by crushing or grinding of solids, diameter > 1 µm (e.g., cement dust, fly ash)", 
         "Dust consists of airborne solid particles with diameters larger than 1 µm generated by physical breakdown of matter such as mining, cement grinding, and sandblasting"),
        ("Mists", "II", "Liquid droplets produced by condensation of vapor in air or spraying (e.g., H2SO4 mist, herbicide spray)", 
         "Mists are formed by condensed liquid droplets dispersed in air, such as sulfuric acid mists from acid plants or agricultural aerosol sprays"),
        ("Fumes", "I", "Condensed vapors formed generally by sublimation, distillation, or metallurgical boiling (e.g., zinc oxide fumes)", 
         "Fumes are extremely fine solid particles formed when volatilized solids condense in the presence of air, typical of metallurgical smelting operations like ZnO fumes")
    ]
    questions.append(make_matrix_q(
        "chem_app_027", TOPIC, "intermediate",
        "Match each particulate pollutant type in List I with its physical characteristic and example in List II:",
        pairs_027, "C"
    ))

    # chem_app_028 (Intermediate, Ans: D)
    pairs_028 = [
        ("Liquid CO2 with suitable detergent", "II", "Replaces carcinogenic tetrachloroethene (Cl2C=CCl2) in dry cleaning of fabrics", 
         "Liquid supercritical or dense CO2 combined with non-ionic fluorinated surfactants serves as an eco-friendly non-flammable alternative to toxic perc in commercial dry cleaning"),
        ("Hydrogen peroxide (H2O2) with catalyst", "IV", "Replaces elemental chlorine gas (Cl2) in bleaching paper pulp, eliminating toxic dioxins", 
         "H2O2 in the presence of activators replaces elemental chlorine in paper mills, avoiding chlorination of lignin into carcinogenic polychlorinated dibenzodioxins"),
        ("Aqueous Pd(II)/Cu(II) catalyzed oxidation of ethene", "I", "Replaces multi-step commercial synthesis of ethanal (acetaldehyde) with single-step green oxidation", 
         "The Wacker process oxidizes ethene directly to ethanal with O2 in aqueous medium in ~90% yield without toxic chlorinated organic intermediates or heavy metal waste"),
        ("Supercritical water oxidation", "III", "Replaces toxic organic solvents for destruction of hazardous municipal and industrial chemical wastes", 
         "Supercritical water (> 374 °C, > 221 bar) completely dissolves organic wastes and O2, breaking down toxic wastes into clean CO2, H2O, and inorganic salts without incineration")
    ]
    questions.append(make_matrix_q(
        "chem_app_028", TOPIC, "intermediate",
        "Match the green chemistry replacement in List I with the traditional hazardous process it replaces in List II:",
        pairs_028, "D"
    ))

    # chem_app_029 (Intermediate, Ans: A)
    pairs_029 = [
        ("2SO2 + O2 + 2H2O -> 2H2SO4", "II", "Primary gas-phase and aerosol reaction generating sulfuric acid in acid precipitation", 
         "Atmospheric oxidation of SO2 catalyzed by airborne soot particulates, O3, or NO2 in cloud droplets generates sulfuric acid (H2SO4), dropping rainwater pH"),
        ("4NO2 + O2 + 2H2O -> 4HNO3", "IV", "Photochemically assisted dissolution of nitrogen dioxide producing nitric acid", 
         "NO2 generated from high-temperature vehicular and industrial combustion oxidizes in moisture to nitric acid (HNO3), contributing ~30% of rainwater acidity"),
        ("CaCO3 + H2SO4 -> CaSO4 + H2O + CO2", "I", "Marble cancer / degradation of historical monuments like the Taj Mahal", 
         "Sulfuric acid in acid rain attacks white marble (calcium carbonate) creating soluble/crusty calcium sulfate dihydrate (gypsum), known as stone leprosy or marble cancer"),
        ("Dissolved aluminum leaching into water bodies", "III", "Lowering soil pH frees toxic Al3+ ions from silicate minerals, poisoning fish gills", 
         "Acid rain leaches Al3+ from clay minerals; in acidified lakes, Al3+ precipitates on fish gills, causing mucus overproduction and asphyxiating aquatic fauna")
    ]
    questions.append(make_matrix_q(
        "chem_app_029", TOPIC, "intermediate",
        "Match each acid rain reaction/component in List I with its chemical role or consequence in List II:",
        pairs_029, "A"
    ))

    # chem_app_030 (Intermediate, Ans: B)
    pairs_030 = [
        ("Carbon dioxide (CO2)", "III", "Reference standard (GWP = 1), produced predominantly by combustion of fossil fuels and deforestation", 
         "CO2 is the primary anthropogenic greenhouse gas baseline against which other gases are compared, having GWP = 1 and long atmospheric residence time"),
        ("Methane (CH4)", "IV", "GWP ~ 25-30 times that of CO2, released by anaerobic decomposition in paddy fields and enteric fermentation in ruminants", 
         "CH4 absorbs IR radiation much more intensely than CO2 per molecule, produced biogenically by methanogens in flooded rice paddies and bovine rumens"),
        ("Nitrous oxide (N2O)", "I", "GWP ~ 270-300 times that of CO2, emitted from intensive agricultural fertilizer usage and nylon manufacturing", 
         "N2O is an extremely potent greenhouse gas with GWP ~298 over 100 years, released via microbial denitrification of synthetic nitrogen fertilizers"),
        ("Chlorofluorocarbons (CFCs)", "II", "GWP ~ 1000s of times greater than CO2, anthropogenic refrigerants that also catalytically destroy stratospheric ozone", 
         "CFCs have massive radiative forcing with GWP values exceeding 5000 to 10000, and their atmospheric persistence enables diffusion into the stratosphere")
    ]
    questions.append(make_matrix_q(
        "chem_app_030", TOPIC, "intermediate",
        "Match the greenhouse gas in List I with its relative global warming potential (GWP) and source in List II:",
        pairs_030, "B"
    ))

    # chem_app_031 (Intermediate, Ans: C)
    pairs_031 = [
        ("Lead (Pb)", "IV", "0.05 ppm (50 ppb); causes damage to brain, liver, kidneys, and interferes with hemoglobin synthesis", 
         "The permissible limit of lead in drinking water is 0.05 ppm (50 ppb); chronic ingestion damages the central nervous system and inhibits ALA dehydratase"),
        ("Cadmium (Cd)", "I", "0.005 ppm (5 ppb); chronic exposure causes 'Itai-itai' disease and renal tubular dysfunction", 
         "The prescribed limit for cadmium is 0.005 ppm; Cd accumulates in renal cortex, replaces Ca2+ in bone minerals, and causes painful osteomalacia (Itai-itai disease)"),
        ("Copper (Cu)", "II", "3.0 ppm; excessive levels cause damage to liver and kidney, causing Wilson's disease-like toxicity", 
         "The upper permissible limit for copper in drinking water is 3.0 ppm; excess copper causes gastrointestinal distress, liver cirrhosis, and renal damage"),
        ("Zinc (Zn)", "III", "5.0 ppm; astringent taste and digestive disorders at higher concentrations", 
         "The standard limit for zinc is 5.0 ppm; while zinc is an essential trace nutrient, higher concentrations impart an unpalatable metallic astringency")
    ]
    questions.append(make_matrix_q(
        "chem_app_031", TOPIC, "intermediate",
        "Match the toxic metal pollutant in drinking water in List I with its maximum permissible limit (BIS/WHO) in List II:",
        pairs_031, "C"
    ))

    # chem_app_032 (Intermediate, Ans: D)
    pairs_032 = [
        ("Clean drinking water BOD value", "III", "Less than 5 ppm (indicates low organic biodegradable contamination)", 
         "Clean, potable water has a 5-day BOD value of less than 5 ppm, indicating virtually no biodegradable sewage or putrescible organic matter"),
        ("Highly polluted water BOD value", "IV", "17 ppm or greater (indicates heavy sewage or organic effluent loading)", 
         "Water with a BOD value of 17 ppm or higher is classified as heavily polluted, typical of untreated municipal sewage or dairy/paper industrial wastewater"),
        ("Natural unpolluted rainwater pH", "I", "Approximately 5.6 (slightly acidic due to dissolved atmospheric CO2 forming H2CO3)", 
         "Pure unpolluted rain is naturally acidic with pH ~5.6 because atmospheric CO2 dissolves to form carbonic acid: CO2 + H2O <=> H2CO3 <=> H+ + HCO3-"),
        ("Threshold pH defining Acid Rain", "II", "Below 5.6 (due to contribution from strong sulfuric and nitric acids)", 
         "Precipitation with a measured pH below 5.6 is formally designated as acid rain, caused by anthropogenic emissions of sulfur and nitrogen oxides")
    ]
    questions.append(make_matrix_q(
        "chem_app_032", TOPIC, "intermediate",
        "Match each environmental test/standard parameter in List I with its numerical benchmark in List II:",
        pairs_032, "D"
    ))

    # ----------------------------------------------------
    # Advanced Questions (chem_app_033 - chem_app_040)
    # ----------------------------------------------------

    # chem_app_033 (Advanced, Ans: A)
    pairs_033 = [
        ("Photodissociation of chlorofluorocarbon (e.g. CF2Cl2)", "II", "CF2Cl2 + hν (λ < 220 nm) -> •CF2Cl + Cl• (generates chlorine free radical)", 
         "In the stratosphere, high-energy UV-C photolyzes the C-Cl bond of CF2Cl2, generating reactive chlorine radicals (Cl•)"),
        ("Propagation cycle of ozone destruction", "I", "Cl• + O3 -> ClO• + O2 followed by ClO• + O -> Cl• + O2 (regenerates Cl• radical catalyst)", 
         "The catalytic cycle consists of chlorine radical attacking O3 to form chlorine monoxide radical (ClO•), which reacts with atomic oxygen to regenerate Cl•"),
        ("Formation of chlorine reservoir species", "IV", "ClO• + NO2 -> ClONO2 and Cl• + CH4 -> •CH3 + HCl (temporarily sequestering reactive chlorine)", 
         "Under normal mid-latitude stratospheric conditions, Cl• and ClO• are converted into inert reservoir species chlorine nitrate (ClONO2) and hydrogen chloride (HCl)"),
        ("Heterogeneous surface reaction on Polar Stratospheric Clouds (PSCs)", "III", "ClONO2 + HCl -> Cl2 + HNO3 (converts reservoir species back to photolabile chlorine)", 
         "In the Antarctic winter, cold ice surfaces of PSCs catalyze the reaction between reservoir species ClONO2 and HCl, yielding molecular chlorine (Cl2) and HNO3")
    ]
    questions.append(make_matrix_q(
        "chem_app_033", TOPIC, "advanced",
        "Match each step of the stratospheric ozone depletion cycle in List I with its chemical equation / catalytic mechanism in List II:",
        pairs_033, "A"
    ))

    # chem_app_034 (Advanced, Ans: B)
    pairs_034 = [
        ("Type I Polar Stratospheric Clouds", "III", "Composed of nitric acid trihydrate (HNO3·3H2O) crystals formed under extreme Antarctic cold (< 195 K)", 
         "Type I PSCs condense at ~195 K in polar winter, composed of solid nitric acid trihydrate (NAT); they deplete gaseous NO2 and facilitate chlorine activation"),
        ("Type II Polar Stratospheric Clouds", "IV", "Composed of pure water ice crystals formed when temperature falls below 188 K", 
         "Type II PSCs form at temperatures below 188 K consisting of pure H2O ice crystals, providing larger surface areas for heterogeneous chlorine liberation"),
        ("Polar vortex dynamics in winter", "I", "Tight cyclonic circulation isolating Antarctic stratosphere, preventing air exchange and keeping temperatures ultra-low", 
         "The winter polar vortex is a massive whirl of circumpolar stratospheric winds that isolates the polar air mass, preventing warmer ozone-rich mid-latitude air from entering"),
        ("Sunlight return in Antarctic spring (September-October)", "II", "Rapid photolysis of Cl2 and HOCl releases surge of Cl• radicals, causing massive catalytic ozone destruction", 
         "When sunlight returns to Antarctica in austral spring (September), molecular chlorine photolyzes (Cl2 + hν -> 2Cl•), initiating rapid runaway ozone hole formation")
    ]
    questions.append(make_matrix_q(
        "chem_app_034", TOPIC, "advanced",
        "Match each feature of Polar Stratospheric Clouds (PSCs) and ozone hole formation in List I with its scientific description in List II:",
        pairs_034, "B"
    ))

    # chem_app_035 (Advanced, Ans: C)
    pairs_035 = [
        ("NO2 + hν -> NO + O(3P)", "IV", "Primary initiation step triggered by sunlight (λ < 400 nm) producing highly reactive atomic oxygen", 
         "Solar irradiation of NO2 at wavelengths below 400 nm initiates photochemical smog by homolytic cleavage of the N-O bond into nitric oxide and ground-state triplet oxygen atom O(3P)"),
        ("O(3P) + O2 + M -> O3 + M", "I", "Rapid three-body collision generating ground-level ozone in the troposphere", 
         "The released atomic oxygen combines with molecular O2 in the presence of an inert third body (M = N2 or O2) to absorb excess energy and form ozone"),
        ("RH + •OH -> R• + H2O followed by R• + O2 -> ROO•", "II", "Hydrocarbon oxidation producing peroxyalkyl radicals that convert NO to NO2 without consuming O3", 
         "Hydroxyl radicals abstract H from unburnt hydrocarbons; the resulting alkyl radical rapidly reacts with O2 to form peroxy radicals (ROO•), which oxidize NO to NO2, allowing O3 to accumulate"),
        ("CH3COO• + NO2 -> CH3COOONO2", "III", "Radical termination reaction forming peroxyacetyl nitrate (PAN), a stable lachrymatory reservoir", 
         "Peroxyacetyl radicals (formed by oxidation of ethanal) combine with nitrogen dioxide in a termination step to produce peroxyacetyl nitrate (PAN), a powerful eye irritant")
    ]
    questions.append(make_matrix_q(
        "chem_app_035", TOPIC, "advanced",
        "Match each reaction sequence in photochemical smog formation in List I with its mechanistic significance in List II:",
        pairs_035, "C"
    ))

    # chem_app_036 (Advanced, Ans: D)
    pairs_036 = [
        ("COD value is invariably higher than BOD value for the same sample", "I", "Acidified dichromate oxidizes both biodegradable and non-biodegradable organics, whereas microorganisms only oxidize biodegradable matter", 
         "Boiling acidic K2Cr2O7 chemically oxidizes refractory substances (lignin, cellulose, phenols) that bacteria cannot biochemically degrade within the 5-day BOD incubation"),
        ("Addition of excess phosphate detergents triggers severe hypoxia in lakes", "II", "Phosphate is the limiting nutrient; its abundance causes explosive algal growth, whose bacterial decay exhausts dissolved O2", 
         "In freshwater ecosystems, phosphorus is the limiting growth nutrient; excessive polyphosphate builders induce rapid eutrophication, and bacterial decomposition of dead biomass consumes all DO"),
        ("Dissolved oxygen decreases as water temperature increases", "III", "Gas solubility is inversely proportional to temperature (Henry's law with exothermic dissolution), stressing cold-water aquatic species", 
         "Dissolution of gas in water is an exothermic process (ΔH_sol < 0); raising temperature shifts equilibrium toward the gaseous state, reducing maximum saturation DO"),
        ("Presence of free chlorine in treated drinking water", "IV", "Provides residual disinfecting power against recontamination in the distribution network by forming bactericidal HOCl", 
         "Chlorination forms hypochlorous acid (Cl2 + H2O <=> HOCl + H+ + Cl-); maintaining a residual 0.2-0.5 ppm of free chlorine prevents microbial recontamination in transit pipes")
    ]
    questions.append(make_matrix_q(
        "chem_app_036", TOPIC, "advanced",
        "Match each comparative water quality evaluation in List I with its precise chemical rationale in List II:",
        pairs_036, "D"
    ))

    # chem_app_037 (Advanced, Ans: A)
    pairs_037 = [
        ("Polychlorinated biphenyls (PCBs)", "II", "Chemically inert dielectric fluids with high lipophilicity that resist metabolic breakdown and cause hepatotoxicity", 
         "PCBs were widely used in transformer cooling oils; their high lipid solubility and chemical inertness cause profound bioaccumulation and severe endocrine/liver toxicity"),
        ("Polycyclic aromatic hydrocarbons (PAHs)", "IV", "Formed by incomplete combustion of fossil fuels; metabolic epoxide intermediates bind to DNA causing potent carcinogenesis", 
         "PAHs like benzo[a]pyrene are enzymatically activated by cytochrome P450 to electrophilic diol-epoxides that covalently alkylate guanine bases in DNA, initiating cancer"),
        ("Dioxins (e.g. 2,3,7,8-TCDD)", "I", "Unintentional by-products of chlorine bleaching and waste incineration, causing extreme teratogenicity and chloracne", 
         "Polychlorinated dibenzo-p-dioxins (PCDDs) are ultra-toxic persistent pollutants formed during incineration of chlorinated polymers and chlorine bleaching, causing chloracne and immune failure"),
        ("Organotins (e.g., Tributyltin / TBT)", "III", "Antifouling paint additives that leach into marine waters causing endocrine disruption and imposex in snails", 
         "TBT was used in marine anti-fouling coatings; even at nanogram per liter concentrations, it disrupts steroid metabolism, inducing masculinization (imposex) in female marine gastropods")
    ]
    questions.append(make_matrix_q(
        "chem_app_037", TOPIC, "advanced",
        "Match each specific organic pollutant class in List I with its environmental transport and biological consequence in List II:",
        pairs_037, "A"
    ))

    # chem_app_038 (Advanced, Ans: B)
    pairs_038 = [
        ("Atom Economy", "III", "Percentage ratio of molecular weight of desired product to total molecular weight of all reactants: (MW_desired / Σ MW_reactants) × 100", 
         "Atom economy measures synthetic efficiency by calculating the proportion of reactant atoms incorporated into the final desired product, penalizing stoichiometric byproduct mass"),
        ("Environmental Factor (E-factor)", "IV", "Ratio of mass of total waste generated to mass of desired final product produced (kg waste / kg product)", 
         "Sheldon's E-factor quantifies waste intensity: E-factor = (total mass of raw materials - mass of product) / (mass of product); lower E-factors signify greener industrial processes"),
        ("Design for Degradation", "I", "Designing synthetic chemical products that break down into innocuous environmental degradation products after functional use", 
         "Principle 10 of Green Chemistry requires synthesizing molecules (like PHBV or biodegradable polycarbonates) with cleavable bonds to ensure complete degradation into CO2, H2O, and biomass"),
        ("Catalysis over Stoichiometric reagents", "II", "Using substoichiometric, highly selective catalytic reagents to minimize activation energy and eliminate stoichiometric byproduct waste", 
         "Principle 9 advocates catalytic reagents (especially homogeneous, heterogeneous, or enzymatic) over stoichiometric reagents, dramatically lowering reaction temperatures and waste generation")
    ]
    questions.append(make_matrix_q(
        "chem_app_038", TOPIC, "advanced",
        "Match each principle of Green Chemistry (Anastas & Warner) in List I with its quantitative or operational metric in List II:",
        pairs_038, "B"
    ))

    # chem_app_039 (Advanced, Ans: C)
    pairs_039 = [
        ("2NO -> N2 + O2 (over Rhodium catalyst)", "IV", "Catalytic reduction of toxic nitrogen oxides into harmless molecular nitrogen and oxygen", 
         "In modern three-way catalytic converters, the reduction catalyst uses rhodium (Rh) to catalyze the dissociation of NO into harmless N2 and O2 gases"),
        ("2CO + O2 -> 2CO2 (over Platinum/Palladium catalyst)", "III", "Catalytic oxidation of toxic carbon monoxide into carbon dioxide", 
         "The oxidation catalyst containing platinum (Pt) and palladium (Pd) promotes rapid combustion of deadly carbon monoxide gas to carbon dioxide"),
        ("CxH2x+2 + (1.5x + 0.5)O2 -> xCO2 + (x+1)H2O (over Pt/Pd catalyst)", "II", "Catalytic complete oxidation of unburnt volatile hydrocarbons into carbon dioxide and steam", 
         "Unburnt fuel hydrocarbons exiting the combustion chamber are oxidized over Pt/Pd catalyst beds to carbon dioxide and water vapor, preventing smog formation"),
        ("2NO + 2CO -> N2 + 2CO2 (simultaneous redox over dual-bed catalyst)", "I", "Simultaneous conversion of two primary toxic combustion pollutants into non-toxic gaseous products", 
         "The redox reaction between NO and CO converts two severe criteria pollutants simultaneously into benign N2 and CO2 over noble-metal catalyst surfaces")
    ]
    questions.append(make_matrix_q(
        "chem_app_039", TOPIC, "advanced",
        "Match each catalytic converter reaction in modern automobiles in List I with its environmental objective in List II:",
        pairs_039, "C"
    ))

    # chem_app_040 (Advanced, Ans: D)
    pairs_040 = [
        ("Phytoremediation", "I", "Use of hyperaccumulating plants (e.g., Brassica juncea) to extract, sequester, or detoxify heavy metals from contaminated soil", 
         "Phytoremediation employs deep-rooting hyperaccumulator flora to translocate and biosequester heavy metal ions (Pb, Cd, Ni, Zn) from contaminated soils into plant biomass"),
        ("Bioremediation by Pseudomonas putida", "II", "Microbial enzymatic biodegradation of aromatic hydrocarbons and xenobiotic compounds into harmless metabolic intermediates", 
         "Genetically adapted bacteria like Pseudomonas putida possess oxygenase enzymes that ring-cleave recalcitrant toluene, benzene, and petroleum hydrocarbons into Krebs cycle metabolites"),
        ("Electrokinetic remediation", "III", "Application of low-intensity direct electric current through soil electrodes to mobilize and transport ionic pollutants via electromigration", 
         "Electrokinetic soil decontamination uses embedded anode-cathode electric fields to migrate heavy metal cations and oxyanions toward electrode sumps in low-permeability clays"),
        ("Activated carbon adsorption", "IV", "High surface area microporous solid that removes synthetic dyes, pesticides, and odor compounds from aqueous effluents via physical and chemical adsorption", 
         "Granular activated carbon possesses massive specific surface areas (~1000 m2/g) that capture non-polar xenobiotics and aromatic micropollutants via van der Waals and π-π adsorption")
    ]
    questions.append(make_matrix_q(
        "chem_app_040", TOPIC, "advanced",
        "Match each industrial effluent / soil remediation technique in List I with its underlying physicochemical mechanism in List II:",
        pairs_040, "D"
    ))

    return questions
