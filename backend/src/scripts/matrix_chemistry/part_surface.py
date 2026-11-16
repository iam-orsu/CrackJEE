from builder import make_matrix_q

def get_surface_questions():
    qs = []
    t = "Surface Chemistry"

    # 4 Beginner: A, B, C, D
    qs.append(make_matrix_q("chem_pc3_061", t, "beginner",
        "Match the characteristics of physisorption and chemisorption in List I with their descriptions in List II:",
        [
            ("Physisorption (Physical adsorption)", "III", "Weak van der Waals forces, low enthalpy of adsorption (20 - 40 kJ/mol), reversible, forms multimolecular layers", "Physisorption is non-specific, involves weak dispersion forces, and can form multilayer adsorption at high pressure."),
            ("Chemisorption (Chemical adsorption)", "I", "Strong chemical bond formation, high enthalpy of adsorption (80 - 240 kJ/mol), irreversible, strictly unimolecular layer", "Chemisorption involves electron transfer or sharing to form chemical bonds with specific surface sites, ceasing once the monolayer is complete."),
            ("Effect of increasing temperature on Physisorption", "IV", "Decreases continuously because physical adsorption is exothermic with near-zero activation energy", "As temperature increases, kinetic energy of gas molecules overcomes weak van der Waals forces, causing rapid desorption."),
            ("Effect of increasing temperature on Chemisorption", "II", "First increases (due to requirement of activation energy) and then decreases at higher temperatures", "Chemisorption requires activation energy (activated adsorption); heating initially overcomes this barrier, but higher temperature promotes desorption.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_062", t, "beginner",
        "Match the colloidal systems in List I with their correct classification based on the physical states of dispersed phase and dispersion medium in List II:",
        [
            ("Smoke and dust in air (Solid dispersed in Gas)", "IV", "Solid aerosol", "Solid particles dispersed in a gaseous medium form a solid aerosol."),
            ("Milk and face cream (Liquid dispersed in Liquid)", "II", "Emulsion", "A colloid of liquid dispersed in another immiscible liquid is termed an emulsion."),
            ("Cheese, butter, and jellies (Liquid dispersed in Solid)", "I", "Gel", "Liquid dispersed in a continuous solid framework constitutes a gel."),
            ("Paints, cell fluids, and gold sol (Solid dispersed in Liquid)", "III", "Sol", "Solid particles suspended in a liquid continuous dispersion medium form a sol.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_063", t, "beginner",
        "Match the classes of colloidal sols in List I with their defining physicochemical behaviors in List II:",
        [
            ("Lyophilic sols (e.g., gelatin, starch, gum arabic in water)", "II", "Reversible sols; highly solvated, stable, surface tension lower and viscosity higher than medium", "Strong affinity between dispersed phase and dispersion medium makes lyophilic sols spontaneously form and regenerate upon evaporating and re-adding solvent."),
            ("Lyophobic sols (e.g., metals, metal sulfides like As₂S₃ in water)", "IV", "Irreversible sols; poorly solvated, easily coagulated by small amounts of electrolytes, require stabilizers", "Little or no interaction between particles and medium; once precipitated, they do not reconstitute on simple mixing."),
            ("Multimolecular colloids (e.g., sulfur sol S₈, gold sol)", "I", "Formed by aggregation of thousands of small atoms or molecules (diameter < 1 nm) held by van der Waals forces", "Individual S₈ or Au atoms aggregate together into particles having colloidal dimensions (1 - 1000 nm)."),
            ("Macromolecular colloids (e.g., proteins, cellulose, polyethylene)", "III", "Consist of individual gigantic polymer molecules whose individual molecular size lies in the colloidal range", "Large single macromolecules dissolved in suitable solvents naturally have colloidal dimensions (1 - 1000 nm).")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_064", t, "beginner",
        "Match the optical, kinetic, and electrical properties of colloids in List I with their phenomena and mechanisms in List II:",
        [
            ("Tyndall effect", "II", "Scattering of light by colloidal particles in all directions, illuminating the path of the beam as a luminous cone", "Tyndall effect occurs when the diameter of colloidal particles is comparable to the wavelength of light and refractive indices of phase and medium differ substantially."),
            ("Brownian motion", "IV", "Continuous, random zig-zag motion of colloidal particles caused by unequal bombardment of solvent molecules", "First observed by Robert Brown, this kinetic agitation prevents colloidal particles from settling down under gravity, conferring stability."),
            ("Electrophoresis (Cataphoresis / Anaphoresis)", "I", "Migration of charged colloidal particles toward an oppositely charged electrode under an applied external electric field", "Positively charged particles move toward the cathode (cataphoresis) while negatively charged particles move toward the anode (anaphoresis)."),
            ("Dialysis", "III", "Purification of colloidal sol by separation of crystalloid ions/molecules through a semipermeable animal or parchment membrane", "True solute ions diffuse readily through membrane pores, while larger colloidal particles are retained inside.")
        ], "D"))

    # 8 Intermediate: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_065", t, "intermediate",
        "Match the pressure regimes and linear logarithmic relations of the Freundlich adsorption isotherm in List I with their mathematical forms in List II (x/m = k P^(1/n)):",
        [
            ("Logarithmic Freundlich equation: log(x/m)", "III", "log(x/m) = log k + (1/n) log P; plot of log(x/m) vs log P gives slope = 1/n and intercept = log k", "Taking logarithms of x/m = k P^(1/n) yields a straight line with slope 1/n and intercept log k."),
            ("Low pressure limit (1/n = 1)", "I", "x/m = k P; extent of adsorption is directly proportional to pressure", "At very low pressure, gas molecules adsorb linearly on available sites, so x/m ∝ P¹."),
            ("High pressure limit (1/n = 0 / saturation)", "IV", "x/m = k (independent of pressure); adsorption reaches a saturation plateau", "At high pressure, all accessible surface sites are occupied, so further increase in pressure does not increase adsorption: x/m = constant (P⁰)."),
            ("Normal physical range of exponent (1/n) in Freundlich isotherm", "II", "0.1 to 0.5 (strictly 0 ≤ 1/n ≤ 1)", "The Freundlich isotherm is valid over moderate pressure ranges where 1/n lies between 0.1 and 0.5.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_066", t, "intermediate",
        "Match the Langmuir adsorption isotherm states and constants in List I with their mathematical expressions and principles in List II:",
        [
            ("Langmuir fractional surface coverage (θ = (x/m) / (x/m)_max)", "IV", "θ = (K P) / (1 + K P)", "Equating rate of adsorption r_a = k_a P (1 - θ) to rate of desorption r_d = k_d θ at dynamic equilibrium yields θ = KP / (1 + KP), where K = k_a / k_d."),
            ("Langmuir adsorption equation at low pressure (K P << 1)", "II", "θ ≈ K P; first order with respect to pressure", "When KP << 1, 1 + KP ≈ 1, so θ ≈ KP, and x/m is directly proportional to pressure."),
            ("Langmuir adsorption equation at high pressure (K P >> 1)", "I", "θ ≈ 1; zero order with respect to pressure (monolayer completely saturated)", "When KP >> 1, KP / (1 + KP) ≈ KP / KP = 1. The surface is completely covered by a monolayer."),
            ("Linear form of Langmuir isotherm: P / (x/m)", "III", "P / (x/m) = 1 / [K (x/m)_max] + P / (x/m)_max; plot of P / (x/m) vs P has slope = 1/(x/m)_max", "Inverting θ gives (x/m)_max / (x/m) = 1 + 1/(KP). Multiplying by P gives P/(x/m) = 1/(K(x/m)_max) + P/(x/m)_max.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_067", t, "intermediate",
        "Match the colloidal surface charge mechanisms and electrical double layer parameters in List I with their descriptions in List II:",
        [
            ("Zeta potential (Electrokinetic potential, ζ)", "II", "Potential difference between the fixed Stern layer of adsorbed ions and the mobile diffuse double layer in solution", "As a colloidal particle moves under an electric field, the shear plane slips relative to the bulk liquid; the potential at this slipping plane is the zeta potential."),
            ("Preferential adsorption when AgNO₃(aq) is added to excess KI(aq)", "IV", "AgI particles preferentially adsorb common I⁻ ions, acquiring a negative charge: [AgI]I⁻ : K⁺", "The precipitate AgI preferentially adsorbs the common ion present in excess (I⁻), imparting a negative surface charge stabilized by diffuse K⁺ counter-ions."),
            ("Preferential adsorption when KI(aq) is added to excess AgNO₃(aq)", "I", "AgI particles preferentially adsorb common Ag⁺ ions, acquiring a positive charge: [AgI]Ag⁺ : NO₃⁻", "In excess AgNO₃, Ag⁺ is the common lattice ion in solution, so AgI adsorbs Ag⁺, forming a positively charged sol with NO₃⁻ counter-ions."),
            ("Hydrated ferric oxide sol prepared by adding FeCl₃ to boiling water", "III", "Fe(OH)₃ particles adsorb Fe³⁺ ions preferentially, forming a positively charged sol: [Fe₂O₃·xH₂O]Fe³⁺", "Hydrolysis of FeCl₃ produces Fe(OH)₃ sol which preferentially adsorbs common Fe³⁺ ions, rendering the sol positively charged.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_068", t, "intermediate",
        "Match the coagulation principles and Hardy-Schulze rule applications in List I with their descriptions in List II:",
        [
            ("Hardy-Schulze Rule for coagulation", "II", "The coagulating power of an electrolyte is directly proportional to the 4th to 6th power of the valency of the active ion having charge opposite to the sol", "Hardy and Schulze discovered that ions carrying charge opposite to that of colloidal particles cause coagulation, and higher valency increases coagulating efficiency dramatically."),
            ("Order of coagulating power of anions for a positively charged Fe(OH)₃ sol", "IV", "[Fe(CN)₆]⁴⁻ > PO₄³⁻ > SO₄²⁻ > Cl⁻", "For a positive sol, coagulating ions are anions. By Hardy-Schulze rule: 4-valent [Fe(CN)₆]⁴⁻ > 3-valent PO₄³⁻ > 2-valent SO₄²⁻ > 1-valent Cl⁻."),
            ("Order of coagulating power of cations for a negatively charged As₂S₃ sol", "I", "Al³⁺ > Ba²⁺ > Na⁺", "For a negative sol, coagulating ions are cations. Coagulating power increases with ionic charge: Al³⁺ (trivalent) > Ba²⁺ (divalent) > Na⁺ (monovalent)."),
            ("Flocculation value (Coagulation value)", "III", "Minimum concentration of electrolyte in millimoles per litre (mmol/L) required to cause coagulation of a sol in 2 hours; inversely proportional to coagulating power", "By definition, flocculation value is measured in mmol/L. Lower flocculation value means greater coagulating power: Coagulating power ∝ 1 / (Flocculation value).")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_069", t, "intermediate",
        "Match the protective colloids and Gold Number concepts in List I with their definitions and values in List II:",
        [
            ("Gold Number definition (Zsigmondy)", "III", "Mass of dry lyophilic protective colloid in milligrams (mg) required to prevent coagulation of 10 mL standard red gold sol upon adding 1 mL of 10% NaCl solution", "Richard Zsigmondy formulated the Gold Number to quantify the protective efficiency of lyophilic colloids against electrolyte-induced flocculation of lyophobic gold sol."),
            ("Relationship between Gold Number and protective power", "I", "Inversely proportional; smaller Gold Number corresponds to greater protective power", "A smaller mass needed to prevent coagulation indicates higher efficiency and superior protective power."),
            ("Gelatin (Gold Number = 0.005 - 0.01 mg)", "IV", "Best protective colloid among standard natural substances (highest protective power)", "Gelatin has the smallest Gold Number (~0.005 mg), meaning an extremely minute quantity completely stabilizes 10 mL of gold sol."),
            ("Starch (Gold Number = 20 - 25 mg)", "II", "Very poor protective colloid with very low protective power", "Starch requires 20 to 25 mg to provide the same protection that 0.005 mg of gelatin provides, indicating very weak protective action.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_070", t, "intermediate",
        "Match the associated colloid and surfactant parameters in List I with their physical descriptions in List II:",
        [
            ("Critical Micelle Concentration (CMC)", "IV", "Minimum surfactant concentration above which individual amphiphilic molecules spontaneously aggregate into colloidal micelles", "Below the CMC, surfactants behave as ordinary 1:1 strong electrolytes; at and above the CMC, hydrophobic tails cluster to form micelles."),
            ("Kraft temperature (T_k)", "II", "Minimum temperature above which the solubility of surfactant equals the CMC, allowing micelle formation", "Below T_k, surfactant solubility is insufficient to reach the CMC; above T_k, solubility increases abruptly as micelles form."),
            ("Sodium stearate (C₁₇H₃₅COO⁻ Na⁺) micelle in aqueous medium", "I", "Spherical core of hydrophobic hydrocarbon tails (C₁₇H₃₅-) shielded by hydrophilic polar heads (-COO⁻) at the surface", "Hydrophobic interactions drive non-polar alkyl chains inward to minimize contact with water, while negatively charged carboxylate groups point outward into the aqueous phase."),
            ("Reverse micelle in non-polar organic solvent (e.g., in benzene or hexane)", "III", "Hydrophilic polar heads clustered at the internal core, with lipophilic hydrocarbon chains extending outward into the solvent", "In non-polar solvents, the hydrophilic polar heads aggregate in the interior to minimize exposure to the non-polar medium.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_071", t, "intermediate",
        "Match the stages and steps of the intermediate adsorption theory of heterogeneous catalysis in List I with their mechanistic descriptions in List II:",
        [
            ("Step 1: Mass transport to catalyst surface", "II", "Diffusion of gaseous or dissolved reactant molecules to the external and internal pore surface of the catalyst", "Heterogeneous catalysis begins with mass transfer across the fluid boundary layer to the catalyst boundary."),
            ("Step 2: Adsorption on active centers", "IV", "Chemisorption of reactant molecules on specific surface active sites (free valencies / defects)", "Reactant molecules form chemical bonds with unsaturated surface atoms, weakening their internal chemical bonds."),
            ("Step 3: Surface reaction", "I", "Chemical reaction between adsorbed species on the catalyst surface via an activated intermediate complex", "Adsorbed fragments react at low activation energy to form the chemisorbed product complex."),
            ("Step 4 & 5: Desorption and departure", "III", "Desorption of reaction products from surface active sites followed by diffusion away into bulk fluid", "Products desorb to regenerate vacant active sites for the next catalytic cycle, diffusing into the bulk stream.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_072", t, "intermediate",
        "Match the specific catalysts and catalytic phenomena in List I with their key industrial features in List II:",
        [
            ("Shape-selective zeolite catalyst ZSM-5", "II", "Microporous aluminosilicate with three-dimensional pore network; converts methanol directly into gasoline hydrocarbons", "ZSM-5 has specific channel dimensions (pore size ~5.5 Å) that geometrically permit only specific molecular sizes and shapes to react and diffuse out."),
            ("Enzyme catalysis lock-and-key / induced-fit specificity", "IV", "Highly stereospecific active sites with complementary shape; operate at physiological optimum T (310 K) and pH (7.4)", "Enzymes possess unique cavities with active chemical groups (-SH, -COOH, -NH₂) that bind only complementary substrate molecules."),
            ("Catalytic promoter (e.g., Mo in Haber process Fe catalyst)", "I", "Substance that is not a catalyst itself but enhances the activity and active site dispersion of the catalyst", "Promoters increase surface area or lattice defects of the main catalyst, increasing catalytic efficiency."),
            ("Catalytic poison (e.g., CO or H₂S in ammonia synthesis)", "III", "Substance that preferentially chemisorbs irreversibly on active sites, destroying catalytic activity", "Trace poisons block active sites permanently, deactivating the catalyst.")
        ], "D"))

    # 8 Advanced: A, B, C, D, A, B, C, D
    qs.append(make_matrix_q("chem_pc3_073", t, "advanced",
        "Match the BET (Brunauer-Emmett-Teller) multilayer adsorption isotherm parameters in List I with their descriptions in List II:",
        [
            ("Linear BET isotherm equation: P / [V (P₀ - P)]", "III", "P / [V (P₀ - P)] = 1 / (V_m C) + [(C - 1) / (V_m C)] · (P / P₀); plot vs P/P₀ has slope (C-1)/(V_m C) and intercept 1/(V_m C)", "Brunauer, Emmett, and Teller extended Langmuir theory to multilayer adsorption. A plot of P / [V(P₀ - P)] against P/P₀ yields both monolayer volume V_m and the BET parameter C."),
            ("Monolayer capacity (V_m) determination", "I", "V_m = 1 / (Slope + Intercept) of the linear BET plot", "Adding Slope + Intercept: (C - 1)/(V_m C) + 1/(V_m C) = C / (V_m C) = 1 / V_m. Therefore, V_m = 1 / (Slope + Intercept)."),
            ("Specific surface area (S_BET) of adsorbent", "IV", "S_BET = (V_m · N_A · σ₀) / V_molar (where σ₀ is molecular cross-sectional area of N₂ = 0.162 nm²)", "Total surface area is the number of molecules in the complete monolayer multiplied by the area occupied by one adsorbate molecule."),
            ("BET constant C", "II", "C ≈ exp((ΔH_ads,1 - ΔH_liquefaction) / (R T)); reflects net affinity of first adsorbed layer relative to condensation", "C is exponentially proportional to the difference between the heat of adsorption in the first layer and the latent heat of condensation in subsequent layers.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_074", t, "advanced",
        "Match the Gibbs adsorption isotherm parameters and surface tension behaviors in List I with their mathematical relationships in List II:",
        [
            ("Gibbs adsorption equation for surface excess (Γ)", "IV", "Γ = - (c / (R T)) · (dγ / dc)", "Derived from chemical thermodynamics: Γ is the surface excess concentration per unit area, where γ is surface tension and c is solute bulk concentration."),
            ("Positive adsorption (Γ > 0)", "I", "dγ / dc < 0; solute lowers the surface tension of the solvent (surfactants, soaps, aliphatic alcohols)", "When dγ/dc is negative, Γ = -(c/RT)(dγ/dc) > 0, meaning the solute concentrates preferentially at the liquid-gas interface to minimize free energy."),
            ("Negative adsorption (Γ < 0)", "II", "dγ / dc > 0; solute raises the surface tension of water (inorganic electrolytes like NaCl, sucrose)", "Strong hydration of ions pulls them into bulk water away from the interface, slightly increasing surface tension (dγ/dc > 0), resulting in surface depletion (Γ < 0)."),
            ("Surface pressure (Π_surf) of an insoluble surfactant monolayer", "III", "Π_surf = γ₀ - γ (where γ₀ is surface tension of pure water and γ is that of monolayer)", "Two-dimensional surface pressure Π_surf represents the lateral spreading force exerted by the surfactant monolayer against clean water.")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_075", t, "advanced",
        "Match the four fundamental electrokinetic phenomena in List I with their operational mechanisms in List II:",
        [
            ("Electrophoresis", "I", "Applied electric field causes movement of charged colloidal particles through a stationary liquid dispersion medium", "Charged particles migrate toward the cathode or anode under an electric potential gradient while the liquid remains stationary."),
            ("Electroosmosis", "III", "Applied electric field causes movement of the liquid dispersion medium through a stationary porous plug or membrane of colloidal material", "When colloidal particles are immobilized in a membrane plug, the mobile diffuse layer of the liquid moves under the electric field."),
            ("Streaming Potential", "IV", "Hydrostatic pressure forces liquid through a stationary porous plug, generating an electrical potential difference across the plug", "The reverse of electroosmosis: forced fluid flow sweeps counter-ions downstream, creating a streaming potential across the ends."),
            ("Sedimentation Potential (Dorn effect)", "II", "Gravity or centrifugal force causes charged particles to sediment through stationary liquid, inducing a potential difference", "The reverse of electrophoresis: falling charged particles leave behind their diffuse double layers, generating an electric field between top and bottom of the column.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_076", t, "advanced",
        "Match the thermodynamic parameters of adsorption in List I with their fundamental expressions in List II:",
        [
            ("Enthalpy change of adsorption (ΔH_ads)", "II", "Always negative (ΔH_ads < 0, exothermic process) because surface attractive forces are satisfied", "Molecules experience unbalanced residual forces at the surface; adsorption satisfies these valencies, releasing energy (ΔH < 0)."),
            ("Entropy change of adsorption (ΔS_ads)", "IV", "Always negative (ΔS_ads < 0) due to restriction of translational degrees of freedom upon sticking to surface", "Gaseous molecules lose three-dimensional freedom of movement when confined to a two-dimensional surface, decreasing entropy."),
            ("Spontaneity criterion for adsorption: ΔG_ads", "I", "ΔG = ΔH - T ΔS < 0; requires |ΔH| > T |ΔS|, so extent of adsorption decreases as temperature rises", "Since ΔS < 0, the -TΔS term is positive; adsorption is spontaneous only when exothermic enthalpy overcomes the unfavorable entropy penalty. Heating makes -TΔS more positive, suppressing adsorption."),
            ("Clausius-Clapeyron / isosteric heat of adsorption (q_st)", "III", "q_st = -R · [∂(ln P) / ∂(1/T)]_(x/m) = R T² · [∂(ln P) / ∂T]_(x/m)", "Isosteric heat of adsorption at constant coverage is derived directly from the differential Clausius-Clapeyron relation.")
        ], "D"))

    qs.append(make_matrix_q("chem_pc3_077", t, "advanced",
        "Match the emulsion types and identification tests in List I with their physical outcomes in List II:",
        [
            ("Bancroft's Rule for emulsion stability", "III", "The phase in which the emulsifying agent is preferentially soluble forms the continuous dispersion medium", "Hydrophilic emulsifiers (sodium soaps, proteins) favor Oil-in-Water (O/W) emulsions, while lipophilic emulsifiers (calcium/magnesium soaps, long-chain alcohols) favor Water-in-Oil (W/O) emulsions."),
            ("Dye test using oil-soluble dye (e.g., Sudan III)", "I", "Colored droplets on colorless background indicates O/W emulsion; uniformly colored background indicates W/O emulsion", "Sudan III dissolves only in oil; if background is colored, oil is the continuous phase (W/O)."),
            ("Dilution test with water", "IV", "Can be diluted with water without separation into layers indicates O/W; adding water forms a separate layer indicates W/O", "Adding the continuous phase dilutes smoothly without breaking the emulsion."),
            ("Conductivity test", "II", "High electrical conductivity indicates O/W emulsion (aqueous continuous phase); negligible conductivity indicates W/O emulsion", "Water containing dissolved electrolytes conducts electricity when it forms the continuous external phase.")
        ], "A"))

    qs.append(make_matrix_q("chem_pc3_078", t, "advanced",
        "Match the DLVO (Derjaguin-Landau-Verwey-Overbeek) colloidal stability theory terms in List I with their descriptions in List II:",
        [
            ("Total interaction potential energy curve: V_total(d) = V_A(d) + V_R(d)", "IV", "Sum of long-range attractive London-van der Waals energy (V_A ∝ -1/d) and repulsive electrical double layer energy (V_R ∝ e^(-κ d))", "DLVO theory quantitatively describes colloid stability as the interplay between attractive dispersion forces and electrostatic repulsion of overlapping double layers."),
            ("Primary minimum at very small inter-particle distance (d → 0)", "I", "Deep potential energy well leading to irreversible coagulation and close contact of particles", "At very short distances, van der Waals attraction overwhelms electrostatic repulsion, locking particles into permanent coagulation."),
            ("Primary maximum (Repulsive energy barrier, V_max)", "II", "Kinetic barrier preventing particles from coagulating; must be > 15-20 k_B T for sol stability", "Thermal Brownian motion cannot overcome this barrier if V_max >> k_B T, preserving colloidal suspension stability against aggregation."),
            ("Secondary minimum at larger separation distances", "III", "Shallow potential well causing weak, reversible flocculation that easily redisperses upon shaking", "At larger distances, screened repulsion falls faster than power-law attraction, creating a shallow dip where particles loosely assemble (flocculate).")
        ], "B"))

    qs.append(make_matrix_q("chem_pc3_079", t, "advanced",
        "Match the capillary condensation and pore adsorption phenomena in List I with their equations and characteristics in List II:",
        [
            ("Kelvin equation for capillary condensation in cylindrical mesopores", "I", "ln(P / P₀) = - (2 γ V_m) / (r_k R T) · cos θ", "Capillary condensation occurs in mesopores (2 - 50 nm) at vapor pressures P below saturation P₀ due to concave meniscus curvature, as given by the Kelvin equation."),
            ("Adsorption-desorption hysteresis loop", "III", "Desorption isotherm lies above adsorption isotherm due to differing meniscus geometries during filling (cylindrical) vs emptying (hemispherical)", "Capillary condensation fills pores via cylindrical core growth, while evaporation proceeds from hemispherical menisci at pore openings, causing a hysteresis loop."),
            ("IUPAC Type IV isotherm", "IV", "Characteristic of mesoporous adsorbents (e.g., silica gel, MCM-41); exhibits monolayer-multilayer adsorption followed by capillary condensation hysteresis", "Type IV isotherms show steep capillary condensation steps and hysteresis loops in the relative pressure range P/P₀ = 0.4 to 0.8."),
            ("IUPAC Type I isotherm", "II", "Characteristic of microporous solids (pore diameter < 2 nm, e.g., activated carbon, zeolites); rapid filling at low P/P₀ reaching plateau", "In micropores, pore walls overlap in potential, causing micropore filling at very low relative pressures without multilayer formation.")
        ], "C"))

    qs.append(make_matrix_q("chem_pc3_080", t, "advanced",
        "Match the surface reaction mechanisms in heterogeneous catalysis in List I with their kinetic characteristics in List II:",
        [
            ("Langmuir-Hinshelwood mechanism (reaction between two chemisorbed species: A_ads + B_ads → Products)", "II", "Rate = k θ_A θ_B = (k K_A K_B P_A P_B) / (1 + K_A P_A + K_B P_B)²; displays rate maximum as pressure of either reactant increases", "Both reacting molecules must adsorb on adjacent active sites. Excessive pressure of one reactant blocks sites from the other, causing the reaction rate to pass through a maximum."),
            ("Eley-Rideal mechanism (reaction between chemisorbed species and gas-phase molecule: A_ads + B(g) → Products)", "IV", "Rate = k θ_A P_B = (k K_A P_A P_B) / (1 + K_A P_A); rate increases monotonically with P_B without passing through a maximum", "Only reactant A chemisorbs on the surface while reactant B collides directly from the gas phase, so increasing P_B never blocks A from adsorbing."),
            ("Apparent activation energy for Langmuir-Hinshelwood at very high surface coverage (θ ≈ 1)", "I", "E_app = E_true - |ΔH_ads|; apparent activation energy can be much smaller than true surface barrier", "At high coverage, rate = (k / K_A) P_B. Since k ∝ e^(-E_true/RT) and K_A ∝ e^(-ΔH_ads/RT) = e^(|ΔH_ads|/RT), E_app = E_true - |ΔH_ads|."),
            ("Kinetic isotope effect in surface catalysis (e.g., substituting D₂ for H₂)", "III", "Used to distinguish whether hydrogen adsorption/dissociation (zero-point energy difference) is the rate-determining step", "If cleavage of C-H or H-H bond on the surface occurs in the RDS, the reaction rate slows substantially for deuterium (k_H / k_D > 2).")
        ], "D"))

    return qs
