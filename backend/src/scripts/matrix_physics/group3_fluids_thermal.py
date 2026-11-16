from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC 1: Elasticity (20 questions)
    # ==========================================
    t = "Elasticity"
    prefix = "phy_ela"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the elastic moduli and ratio in List I with their defining mathematical expressions in List II (where F is normal force, A is area, L is length, ΔL is elongation, V is volume, ΔV is change in volume, ΔP is excess pressure, θ is shear angle, d is diameter, and Δd is lateral contraction):",
        [
            ("Young's modulus (Y)", "II", "FL / (A ΔL)", "Young's modulus is the ratio of tensile stress to longitudinal strain: Y = (F/A) / (ΔL/L) = FL / (A ΔL)"),
            ("Bulk modulus (B)", "IV", "-V ΔP / ΔV", "Bulk modulus is the ratio of hydraulic stress to volumetric strain: B = -ΔP / (ΔV/V) = -V ΔP / ΔV"),
            ("Shear modulus (η)", "I", "F / (A θ)", "Shear modulus is the ratio of shearing stress to shear strain: η = (F/A) / θ = F / (A θ)"),
            ("Poisson's ratio (σ)", "III", "-(L Δd) / (d ΔL)", "Poisson's ratio is the negative ratio of lateral strain to longitudinal strain: σ = -(Δd/d) / (ΔL/L) = -(L Δd) / (d ΔL)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the physical quantities in elasticity in List I with their SI units and dimensional formulas in List II:",
        [
            ("Modulus of elasticity (Y)", "III", "N/m² and [M L⁻¹ T⁻²]", "Modulus of elasticity has SI unit N/m² (or Pa) and dimensional formula [M L⁻¹ T⁻²]"),
            ("Longitudinal strain", "I", "Dimensionless and [M⁰ L⁰ T⁰]", "Strain is the ratio of two lengths (ΔL/L), so it is dimensionless [M⁰ L⁰ T⁰]"),
            ("Elastic energy density (u)", "IV", "J/m³ and [M L⁻¹ T⁻²]", "Elastic energy density is energy per unit volume with unit J/m³ = N/m² and dimensions [M L⁻¹ T⁻²]"),
            ("Torsional constant / couple per unit twist (C)", "II", "N·m/rad and [M L² T⁻²]", "Couple per unit twist is torque per unit angle with unit N·m/rad and dimensions [M L² T⁻²]")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A ductile metallic wire is stretched progressively until rupture. Match the landmark points on the standard stress-strain curve in List I with their physical significance in List II:",
        [
            ("Proportional limit", "IV", "Hooke's law is obeyed strictly; stress is directly proportional to strain", "Up to the proportional limit, the stress-strain curve is linear and Hooke's law is strictly obeyed"),
            ("Elastic limit (Yield point)", "II", "Material returns completely to original dimensions upon removal of load", "Up to the elastic limit, deformation is elastic with no permanent deformation (no permanent set)"),
            ("Ultimate tensile strength", "I", "Maximum tensile stress the material can sustain before necking begins", "Ultimate tensile strength is the maximum nominal stress on the engineering stress-strain curve"),
            ("Fracture point", "III", "Point where the wire actually ruptures or snaps into pieces", "The fracture point marks the complete physical breaking of the specimen")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "A uniform steel wire of length L = 2.0 m, cross-sectional area A = 1.0 mm² = 1.0 × 10⁻⁶ m², and Young's modulus Y = 2.0 × 10¹¹ N/m² is subjected to tensile load F = 100 N. Match the quantities in List I with their values in List II:",
        [
            ("Tensile stress in the wire", "I", "1.0 × 10⁸ N/m²", "Stress = F / A = 100 / (1.0 × 10⁻⁶) = 1.0 × 10⁸ N/m²"),
            ("Longitudinal strain produced", "III", "5.0 × 10⁻⁴", "Strain = stress / Y = (1.0 × 10⁸) / (2.0 × 10¹¹) = 5.0 × 10⁻⁴"),
            ("Elongation (ΔL) of the wire", "IV", "1.0 mm", "ΔL = strain × L = 5.0 × 10⁻⁴ × 2.0 m = 1.0 × 10⁻³ m = 1.0 mm"),
            ("Elastic potential energy stored (U)", "II", "0.05 J", "U = (1/2) F ΔL = 0.5 × 100 × 1.0 × 10⁻³ = 0.05 J")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the mathematical representations for elastic strain energy density u and total energy U in List I with their expressions in List II (stress σ, strain ε, Young's modulus Y, area A, length L, elongation ΔL):",
        [
            ("Energy density u in terms of σ and ε", "II", "(1/2) σ ε", "Elastic energy density is given by u = (1/2) × stress × strain = (1/2) σ ε"),
            ("Energy density u in terms of ε and Y", "IV", "(1/2) Y ε²", "Substituting σ = Y ε into u gives u = (1/2) Y ε²"),
            ("Energy density u in terms of σ and Y", "I", "σ² / (2Y)", "Substituting ε = σ / Y into u gives u = σ² / (2Y)"),
            ("Total elastic energy U in terms of Y, A, L, ΔL", "III", "Y A (ΔL)² / (2L)", "Total energy U = u × (A L) = (1/2) Y (ΔL/L)² (A L) = Y A (ΔL)² / (2L)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For an isotropic homogeneous elastic solid, Young's modulus is Y, Bulk modulus is B, Shear modulus is η, and Poisson's ratio is σ. Match the theoretical relations in List I with their formulas in List II:",
        [
            ("Relation connecting Y, B, and σ", "III", "Y = 3B(1 - 2σ)", "From 3D Hooke's law under hydrostatic pressure, volumetric strain yields Y = 3B(1 - 2σ)"),
            ("Relation connecting Y, η, and σ", "I", "Y = 2η(1 + σ)", "From resolution of pure shear into orthogonal tension and compression, Y = 2η(1 + σ)"),
            ("Elimination of σ connecting Y, B, and η", "IV", "9/Y = 1/B + 3/η", "Combining Y = 3B(1 - 2σ) and Y = 2η(1 + σ) by eliminating σ yields 9/Y = 1/B + 3/η"),
            ("Poisson's ratio σ in terms of B and η", "II", "σ = (3B - 2η) / (6B + 2η)", "Equating 3B(1 - 2σ) = 2η(1 + σ) gives 3B - 6Bσ = 2η + 2ησ, so σ = (3B - 2η) / (6B + 2η)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the mechanical systems in List I with their total elongation ΔL in List II (all wires have length L, cross-section A, and Young's modulus Y unless specified):",
        [
            ("Uniform heavy wire of mass M hanging vertically under self-weight", "IV", "M g L / (2 A Y)", "Tension at distance y from bottom is (M/L) g y; integrating gives ΔL = M g L / (2 A Y)"),
            ("Uniform massless wire supporting a suspended load of mass M at its lower end", "II", "M g L / (A Y)", "Tension is uniform throughout the wire: T = M g, so ΔL = M g L / (A Y)"),
            ("Uniform wire of mass m supporting an additional suspended mass M at its end", "I", "(M + m/2) g L / (A Y)", "Elongation is sum of extension due to end mass and self-weight: ΔL = (M + m/2) g L / (A Y)"),
            ("Uniform solid cone of density ρ, height L hanging vertically from its base under self-weight", "III", "ρ g L² / (6 Y)", "Tension at distance y from vertex is proportional to y³ while area is proportional to y²; integrating stress yields ΔL = ρ g L² / (6 Y)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A steel rod of length L = 1.0 m, area A = 2.0 × 10⁻⁴ m², Young's modulus Y = 2.0 × 10¹¹ N/m², and coefficient of linear expansion α = 1.2 × 10⁻⁵ K⁻¹ is heated by ΔT = 50 K. Match the responses in List I with their values in List II:",
        [
            ("Free thermal elongation if the rod is unrestricted", "I", "0.60 mm", "ΔL = L α ΔT = 1.0 × (1.2 × 10⁻⁵) × 50 = 6.0 × 10⁻⁴ m = 0.60 mm"),
            ("Compressive thermal strain if expansion is completely prevented", "III", "6.0 × 10⁻⁴", "Thermal strain = ΔL / L = α ΔT = 1.2 × 10⁻⁵ × 50 = 6.0 × 10⁻⁴"),
            ("Thermal stress developed in the rod when completely constrained", "IV", "1.2 × 10⁸ N/m²", "Thermal stress = Y α ΔT = 2.0 × 10¹¹ × 6.0 × 10⁻⁴ = 1.2 × 10⁸ N/m²"),
            ("Compressive force exerted by the rod on each rigid end-support", "II", "2.4 × 10⁴ N", "Force F = stress × A = 1.2 × 10⁸ × 2.0 × 10⁻⁴ = 2.4 × 10⁴ N")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Four wires made of the same elastic material are stretched by the same tensile force F. Wire 1 has length L₀ and radius r₀ with elongation ΔL₀. Match the modified wires in List I with their elongation ΔL in terms of ΔL₀ in List II:",
        [
            ("Wire with length 2L₀ and radius r₀", "II", "2 ΔL₀", "ΔL ∝ L / r². For L = 2L₀, r = r₀, elongation is 2 ΔL₀"),
            ("Wire with length L₀ and radius 2r₀", "IV", "0.25 ΔL₀", "For L = L₀, r = 2r₀, elongation is 1 / 2² = 0.25 ΔL₀"),
            ("Wire with length 2L₀ and radius 2r₀", "I", "0.5 ΔL₀", "For L = 2L₀, r = 2r₀, elongation is 2 / 2² = 0.5 ΔL₀"),
            ("Wire with length 4L₀ and radius r₀ / 2", "III", "16 ΔL₀", "For L = 4L₀, r = r₀/2, elongation is 4 / (0.5)² = 16 ΔL₀")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A solid spherical ball of volume V₀ = 1.0 × 10⁻³ m³ and Bulk modulus B = 1.0 × 10¹¹ N/m² is subjected to excess hydrostatic pressure ΔP = 2.0 × 10⁷ N/m². Match the parameters in List I with their values in List II:",
        [
            ("Fractional decrease in volume (-ΔV / V₀)", "III", "2.0 × 10⁻⁴", "-ΔV / V₀ = ΔP / B = (2.0 × 10⁷) / (1.0 × 10¹¹) = 2.0 × 10⁻⁴"),
            ("Magnitude of volume change (|ΔV|)", "I", "2.0 × 10⁻⁷ m³", "|ΔV| = V₀ (ΔP / B) = 1.0 × 10⁻³ × 2.0 × 10⁻⁴ = 2.0 × 10⁻⁷ m³"),
            ("Elastic energy density under hydrostatic pressure (u)", "IV", "2.0 × 10³ J/m³", "u = (ΔP)² / (2B) = (2.0 × 10⁷)² / (2 × 1.0 × 10¹¹) = 2.0 × 10³ J/m³"),
            ("Compressibility of the material (K)", "II", "1.0 × 10⁻¹¹ m²/N", "Compressibility K = 1 / B = 1.0 / (1.0 × 10¹¹) = 1.0 × 10⁻¹¹ m²/N")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Two wires 1 and 2 of identical length L and cross-sectional area A have Young's moduli Y₁ = 2.0 × 10¹¹ N/m² and Y₂ = 1.0 × 10¹¹ N/m² (spring constants k₁ and k₂). Match the combined properties in List I with their values in List II:",
        [
            ("Ratio of individual spring constants k₁ / k₂", "IV", "2", "k = Y A / L, so k₁ / k₂ = Y₁ / Y₂ = 2.0 / 1.0 = 2"),
            ("Equivalent spring constant k_series in terms of k₂", "II", "(2/3) k₂", "In series, 1/k_eq = 1/k₁ + 1/k₂ = 1/(2k₂) + 1/k₂ = 3/(2k₂), so k_eq = (2/3) k₂"),
            ("Equivalent spring constant k_parallel in terms of k₂", "I", "3 k₂", "In parallel, k_eq = k₁ + k₂ = 2k₂ + k₂ = 3 k₂"),
            ("Ratio of elastic energies stored U₁ / U₂ when connected in series under load W", "III", "0.5", "Under same series tension F = W, U = F² / (2k), so U₁ / U₂ = k₂ / k₁ = 1/2 = 0.5")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A solid metallic cube of edge a = 0.1 m has its bottom face fixed. A tangential shearing force F = 2.0 × 10⁵ N is applied to its top face. Shear modulus η = 4.0 × 10¹⁰ N/m². Match the parameters in List I with their values in List II:",
        [
            ("Shearing stress on the top face", "I", "2.0 × 10⁷ N/m²", "Area A = a² = 0.01 m². Shearing stress = F / A = (2.0 × 10⁵) / 0.01 = 2.0 × 10⁷ N/m²"),
            ("Shear strain (angle of shear θ)", "III", "5.0 × 10⁻⁴ rad", "θ = shear stress / η = (2.0 × 10⁷) / (4.0 × 10¹⁰) = 5.0 × 10⁻⁴ rad"),
            ("Lateral displacement Δx of the top face relative to base", "IV", "5.0 × 10⁻⁵ m", "Δx = a θ = 0.1 × 5.0 × 10⁻⁴ = 5.0 × 10⁻⁵ m"),
            ("Total shear strain energy stored in the cube", "II", "5.0 J", "U = (1/2) F Δx = 0.5 × (2.0 × 10⁵) × (5.0 × 10⁻⁵) = 5.0 J")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A uniform elastic wire of mass m, length L, cross-sectional area A, and Young's modulus Y hangs vertically from a ceiling with a block of mass M attached at its lower end. Let y be the downward distance from the ceiling (0 ≤ y ≤ L). Match List I with List II:",
        [
            ("Tension T(y) at distance y from the ceiling", "II", "[M + m(1 - y/L)] g", "Mass of wire hanging below y is m(1 - y/L), so suspended mass is M + m(1 - y/L), giving T(y) = [M + m(1 - y/L)] g"),
            ("Maximum tensile stress in the wire", "IV", "(M + m) g / A", "Maximum tension occurs at the ceiling y = 0 where T_max = (M + m) g, so stress is (M + m) g / A"),
            ("Minimum tensile stress in the wire", "I", "M g / A", "Minimum tension occurs at the bottom y = L where T_min = M g, so stress is M g / A"),
            ("Total elongation of the wire ΔL", "III", "(M + m/2) g L / (A Y)", "ΔL = ∫₀ᴸ [T(y) dy] / (A Y) = (M + m/2) g L / (A Y)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A uniform thin rod of mass M, length L, cross-sectional area A, and Young's modulus Y is rotated in a horizontal plane about a vertical axis through one end with uniform angular velocity ω. Match the quantities in List I with their formulas in List II (distance x from axis):",
        [
            ("Tension T(x) at distance x from the axis", "III", "M ω² (L² - x²) / (2L)", "T(x) = ∫_x^L (M/L) ω² r dr = M ω² (L² - x²) / (2L)"),
            ("Maximum tensile stress in the rod", "I", "M ω² L / (2A)", "Maximum tension occurs at x = 0 where T(0) = (1/2) M ω² L, so stress = M ω² L / (2A)"),
            ("Total elongation ΔL of the rotating rod", "IV", "M ω² L² / (3 A Y)", "ΔL = ∫₀ᴸ [T(x) dx] / (A Y) = (M ω² / (2L A Y)) ∫₀ᴸ (L² - x²) dx = M ω² L² / (3 A Y)"),
            ("Total elastic potential energy U stored in the rod", "II", "M² ω⁴ L³ / (15 A Y)", "U = ∫₀ᴸ [T²(x) dx] / (2 A Y) = [M² ω⁴ / (8 L² A Y)] ∫₀ᴸ (L² - x²)² dx = M² ω⁴ L³ / (15 A Y)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Two rods of equal cross-sectional area A and lengths L₁, L₂ have Young's moduli Y₁, Y₂ and thermal expansion coefficients α₁, α₂. They are fixed end-to-end between two immovable walls and heated by ΔT. Match List I with List II:",
        [
            ("Compressive force F developed in the composite rod", "IV", "A (α₁ L₁ + α₂ L₂) ΔT / (L₁/Y₁ + L₂/Y₂)", "Free expansion is (α₁ L₁ + α₂ L₂) ΔT. Elastic compression is F(L₁/(A Y₁) + L₂/(A Y₂)). Equating them gives F"),
            ("Compressive stress developed in Rod 1", "II", "(α₁ L₁ + α₂ L₂) ΔT / (L₁/Y₁ + L₂/Y₂)", "Since both rods have cross-section A, compressive stress σ₁ = F / A"),
            ("Displacement of the junction Δx toward Rod 2", "I", "L₁ L₂ (α₁ - α₂) ΔT / (L₁ + L₂ Y₁/Y₂)", "Displacement is expansion of rod 1: Δx = L₁ α₁ ΔT - F L₁ / (A Y₁) = L₁ L₂ (α₁ - α₂) ΔT / (L₁ + L₂ Y₁/Y₂)"),
            ("Condition for zero displacement of the junction (Δx = 0)", "III", "α₁ = α₂", "The junction remains stationary if each rod expands by the exact amount it is compressed, requiring α₁ = α₂")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "For a cylindrical bar under axial tensile stress, longitudinal strain is ε_L and lateral strain is ε_d = -σ ε_L, where σ is Poisson's ratio. Match the strain relations in List I with their formulas or values in List II:",
        [
            ("Volumetric strain ΔV / V in terms of ε_L and σ", "I", "ε_L (1 - 2σ)", "V = (π/4) d² L. Differentiating gives ΔV/V = ΔL/L + 2 Δd/d = ε_L - 2σ ε_L = ε_L (1 - 2σ)"),
            ("Value of σ for an incompressible material (constant volume under strain)", "III", "0.5", "For constant volume, ΔV = 0 implies 1 - 2σ = 0, so σ = 0.5"),
            ("Value of σ for a material with zero lateral contraction under tension", "IV", "0", "If diameter remains constant, ε_d = 0, so σ = 0"),
            ("Condition on σ for volume to increase under tensile stretching", "II", "σ < 0.5", "For ΔV/V > 0 when ε_L > 0, we require 1 - 2σ > 0, which means σ < 0.5")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A horizontal beam of length L supported at both ends is loaded at its center by weight W. The depression at the center is δ = W L³ / (48 Y I_g), where I_g is the geometric moment of inertia. Match the cross-sections in List I with their formulas in List II:",
        [
            ("Moment of inertia I_g for rectangular beam of breadth b and depth d", "II", "b d³ / 12", "For a rectangular cross-section bending about the neutral axis, I_g = ∫ y² (b dy) = b d³ / 12"),
            ("Depression δ at the center of the rectangular beam", "IV", "W L³ / (4 Y b d³)", "Substituting I_g = b d³ / 12 into δ = W L³ / (48 Y I_g) yields δ = W L³ / (4 Y b d³)"),
            ("Moment of inertia I_g for circular beam of radius r", "I", "π r⁴ / 4", "For circular cross-section, polar moment is π r⁴ / 2; by perpendicular axis theorem, I_g = π r⁴ / 4"),
            ("Depression δ at the center of the circular beam", "III", "W L³ / (12 π Y r⁴)", "Substituting I_g = π r⁴ / 4 into δ = W L³ / (48 Y I_g) yields δ = W L³ / (12 π Y r⁴)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "When a solid cylinder of radius R and length L is twisted by angle θ, restoring couple is C θ with C = π η R⁴ / (2L). A hollow cylinder of same material, length, and mass has inner radius R₁ and outer radius R₂. Match List I with List II:",
        [
            ("Couple per unit twist C_hollow for the hollow cylinder", "III", "π η (R₂⁴ - R₁⁴) / (2L)", "Integrating torque over annulus gives C_hollow = π η (R₂⁴ - R₁⁴) / (2L)"),
            ("Condition for same mass and length as solid cylinder of radius R", "I", "R₂² - R₁² = R²", "Mass M = ρ π (R₂² - R₁²) L = ρ π R² L implies R₂² - R₁² = R²"),
            ("Ratio of torsional rigidity C_hollow / C_solid for same mass and length", "IV", "(R₂² + R₁²) / R² > 1", "C_h / C_s = (R₂⁴ - R₁⁴) / R⁴ = (R₂² - R₁²)(R₂² + R₁²) / R⁴ = (R₂² + R₁²) / R² > 1"),
            ("Maximum shearing stress in the hollow cylinder twisted by angle θ", "II", "η R₂ θ / L", "Maximum shear strain occurs at outer surface: φ = R₂ θ / L, so max stress = η R₂ θ / L")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A load of mass M is attached to a vertical elastic wire of length L, area A, and Young's modulus Y (spring constant k = A Y / L). In Case 1, the mass is lowered gradually. In Case 2, it is released suddenly from rest. Match List I with List II:",
        [
            ("Equilibrium elongation ΔL₀ under gradual loading", "IV", "M g L / (A Y)", "At static equilibrium, k ΔL₀ = M g, so ΔL₀ = M g / k = M g L / (A Y)"),
            ("Maximum elongation ΔL_max when suddenly released from rest", "II", "2 M g L / (A Y)", "Energy conservation: M g ΔL_max = (1/2) k (ΔL_max)², giving ΔL_max = 2 M g / k = 2 M g L / (A Y)"),
            ("Maximum tension in the wire during sudden release oscillations", "I", "2 M g", "Maximum tension T_max = k ΔL_max = 2 k ΔL₀ = 2 M g"),
            ("Work done by gravity minus elastic energy at maximum sudden extension", "III", "0 J", "At maximum extension, kinetic energy is zero, so W_gravity - U_elastic = M g ΔL_max - (1/2) k (ΔL_max)² = 0 J")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A truncated solid cone of length L and circular end radii r₁ and r₂ (r₂ > r₁) has Young's modulus Y. A tensile force F is applied axially at both ends. Match the mechanical parameters in List I with their formulas in List II:",
        [
            ("Total elongation of the truncated cone ΔL", "I", "F L / (π r₁ r₂ Y)", "Radius at distance x is r(x) = r₁ + (r₂ - r₁) x/L. Area is π r²(x). Integrating gives ΔL = F L / (π r₁ r₂ Y)"),
            ("Maximum tensile stress in the cone", "III", "F / (π r₁²)", "Maximum stress occurs at the narrowest cross-section where area is smallest: σ_max = F / (π r₁²)"),
            ("Minimum tensile stress in the cone", "IV", "F / (π r₂²)", "Minimum stress occurs at the widest cross-section where area is largest: σ_min = F / (π r₂²)"),
            ("Radius of the section where stress equals geometric mean √(σ_max σ_min)", "II", "√(r₁ r₂)", "Geometric mean stress is F / (π r₁ r₂). Equating to F / (π r²) gives r = √(r₁ r₂)")
        ], "D"))


    # ==========================================
    # TOPIC 2: Fluid Mechanics (20 questions)
    # ==========================================
    t = "Fluid Mechanics"
    prefix = "phy_fluids"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the fundamental laws and principles of fluid mechanics in List I with their core physical statements in List II:",
        [
            ("Pascal's Law", "II", "Pressure applied to an enclosed incompressible fluid is transmitted undiminished throughout", "Pascal's law states that pressure changes in a confined incompressible fluid are transmitted equally in all directions"),
            ("Archimedes' Principle", "IV", "Buoyant force on a submerged body equals the weight of the displaced fluid", "Archimedes' principle states buoyant force equals weight of fluid displaced by the body"),
            ("Equation of Continuity", "I", "For incompressible steady flow, volume flow rate is conserved: A₁ v₁ = A₂ v₂", "Equation of continuity represents conservation of mass along a streamline"),
            ("Bernoulli's Theorem", "III", "For streamline flow of an ideal fluid, P + (1/2) ρ v² + ρ g h = constant", "Bernoulli's theorem expresses conservation of mechanical energy for steady ideal fluid flow")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the fluid mechanics quantities in List I with their SI units and dimensional formulas in List II:",
        [
            ("Dynamic viscosity (η)", "III", "Pa·s and [M L⁻¹ T⁻¹]", "Viscosity has SI unit N·s/m² = Pa·s and dimensions [M L⁻¹ T⁻¹]"),
            ("Surface tension (T)", "I", "N/m and [M L⁰ T⁻²]", "Surface tension is force per unit length with unit N/m and dimensions [M L⁰ T⁻²]"),
            ("Kinematic viscosity (ν = η / ρ)", "IV", "m²/s and [M⁰ L² T⁻¹]", "Kinematic viscosity is dynamic viscosity divided by density, with unit m²/s and dimensions [M⁰ L² T⁻¹]"),
            ("Reynolds number (Re)", "II", "Dimensionless and [M⁰ L⁰ T⁰]", "Reynolds number is a dimensionless ratio of inertial forces to viscous forces")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A wide open water tank of height H has a small orifice on its side wall at depth h below the water surface (0 < h < H). Match the efflux parameters in List I with their expressions in List II:",
        [
            ("Speed of efflux (v) from the orifice", "IV", "√(2gh)", "By Torricelli's theorem, speed of efflux from depth h is v = √(2gh)"),
            ("Time of flight (t) of escaping water jet before reaching the ground", "II", "√[2(H - h) / g]", "Vertical distance fallen is H - h = (1/2) g t², so t = √[2(H - h) / g]"),
            ("Horizontal range (R) of the water jet on the ground", "I", "2 √[h(H - h)]", "Horizontal range R = v t = √(2gh) √[2(H - h)/g] = 2 √[h(H - h)]"),
            ("Depth h of orifice for maximum horizontal range", "III", "H / 2", "Maximizing h(H - h) gives h = H / 2, producing maximum range R_max = H")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the curved liquid interfaces in List I with their excess pressure ΔP = P_in - P_out in List II (surface tension T, radius of curvature R, or gap thickness d):",
        [
            ("Spherical liquid drop of radius R in air", "I", "2T / R", "A liquid drop has a single spherical liquid-air interface, so ΔP = 2T / R"),
            ("Spherical soap bubble of radius R in air", "III", "4T / R", "A soap bubble has two spherical interfaces (inner and outer), so ΔP = 4T / R"),
            ("Cylindrical liquid jet of radius R in air", "IV", "T / R", "A cylindrical jet has principal radii R₁ = R and R₂ = ∞, giving ΔP = T(1/R + 0) = T / R"),
            ("Thin liquid film of thickness d wetting two parallel glass plates", "II", "2T / d", "Meniscus has radius of curvature r ≈ d/2, giving suction pressure ΔP = T / r = 2T / d")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A solid block of density ρ_s and volume V floats at the surface of a liquid of density ρ_L (ρ_L > ρ_s). Match the buoyant parameters in List I with their expressions in List II:",
        [
            ("Fraction of the block's volume submerged (V_sub / V)", "II", "ρ_s / ρ_L", "By flotation principle, weight = buoyancy: ρ_s V g = ρ_L V_sub g, so V_sub / V = ρ_s / ρ_L"),
            ("Fraction of the block's volume above the liquid surface", "IV", "1 - ρ_s / ρ_L", "Fraction above surface is 1 - V_sub / V = 1 - ρ_s / ρ_L"),
            ("Apparent weight of the block when completely submerged (if ρ_s > ρ_L)", "I", "V g (ρ_s - ρ_L)", "Apparent weight W_app = W - F_B = ρ_s V g - ρ_L V g = V g (ρ_s - ρ_L)"),
            ("Downward external force required to keep the floating block fully submerged", "III", "V g (ρ_L - ρ_s)", "Extra downward force needed is F_B(full) - W = ρ_L V g - ρ_s V g = V g (ρ_L - ρ_s)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A container filled with liquid of density ρ is subjected to various accelerations. Match the physical situations in List I with their hydrostatic outcomes in List II:",
        [
            ("Tank accelerated horizontally with constant acceleration a", "III", "Free surface tilts at angle θ = tan⁻¹(a/g) to horizontal", "Effective gravity is resultant of g downwards and a backwards, tilting surface at tan θ = a / g"),
            ("Tank in an elevator accelerating upwards with acceleration a", "I", "Hydrostatic pressure at depth h is P₀ + ρ(g + a)h", "Effective gravity is g_eff = g + a, increasing hydrostatic pressure to P₀ + ρ(g + a)h"),
            ("Tank in free fall (a = g downwards)", "IV", "Gauge pressure is zero everywhere: P = P₀", "In free fall, g_eff = 0, so hydrostatic gauge pressure and buoyant forces vanish completely"),
            ("Horizontal limbs of length L in an accelerated U-tube", "II", "Difference in liquid column heights is Δh = a L / g", "Horizontal pressure gradient gives ΔP = ρ a L = ρ g Δh, so Δh = a L / g")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Water flows steadily through a horizontal pipe whose diameter contracts from D₁ = 4 cm to D₂ = 2 cm. Match the hydrodynamic ratios in List I with their numerical values in List II:",
        [
            ("Ratio of cross-sectional areas A₁ / A₂", "IV", "4", "A₁ / A₂ = (D₁ / D₂)² = (4 / 2)² = 4"),
            ("Ratio of flow speed at wide section to narrow section v₁ / v₂", "II", "0.25", "By continuity A₁ v₁ = A₂ v₂ implies v₁ / v₂ = A₂ / A₁ = 1 / 4 = 0.25"),
            ("Ratio of dynamic pressures q₂ / q₁ = [(1/2) ρ v₂²] / [(1/2) ρ v₁²]", "I", "16", "Dynamic pressure ratio is (v₂ / v₁)² = 4² = 16"),
            ("Ratio of volume flow rates Q₁ / Q₂", "III", "1", "For steady incompressible flow, volume flow rate is constant throughout: Q₁ / Q₂ = 1")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the fluid mechanics devices and phenomena in List I with their operating principles or formulas in List II:",
        [
            ("Venturimeter volume flow rate Q", "I", "A₁ A₂ √[2 ΔP / (ρ (A₁² - A₂²))]", "From Bernoulli's equation and continuity, flow rate is Q = A₁ A₂ √[2 ΔP / (ρ (A₁² - A₂²))]"),
            ("Pitot-static tube flow speed v", "III", "√[2(P_stag - P_stat) / ρ]", "Pitot tube converts dynamic pressure into stagnation pressure: v = √[2(P_stag - P_stat) / ρ]"),
            ("Magnus Effect", "IV", "Dynamic lift on spinning object due to asymmetric velocity and Bernoulli pressure", "Spinning object creates faster air velocity on one side, generating transverse Bernoulli lift"),
            ("Carburetor / Atomizer", "II", "Constriction creates high speed and low pressure, drawing fuel into airstream", "Bernoulli principle lowers pressure at constriction, sucking liquid into the moving air stream")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A small spherical lead ball of radius r and density ρ falls vertically through a viscous liquid of density σ and dynamic viscosity η. Match the viscous parameters in List I with their formulas in List II:",
        [
            ("Viscous drag force on sphere at velocity v (Stokes' Law)", "II", "6 π η r v", "Stokes' law gives the retarding viscous force on a sphere as F_v = 6 π η r v"),
            ("Terminal velocity v_t of the falling sphere", "IV", "2 r² (ρ - σ) g / (9 η)", "Equating gravity to buoyancy plus viscous drag gives v_t = 2 r² (ρ - σ) g / (9 η)"),
            ("Rate of heat dissipation at terminal velocity", "I", "8 π r⁵ (ρ - σ)² g² / (27 η)", "Viscous power P = F_v v_t = (6 π η r v_t) v_t = 8 π r⁵ (ρ - σ)² g² / (27 η)"),
            ("Dependence of terminal velocity v_t on the radius r of the sphere", "III", "v_t ∝ r²", "Terminal velocity is directly proportional to r² from the Stokes terminal velocity equation")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A liquid of viscosity η flows under steady laminar conditions through horizontal capillary tubes. Match the Poiseuille flow concepts in List I with their formulas in List II:",
        [
            ("Poiseuille's formula for volume flow rate Q", "III", "π ΔP r⁴ / (8 η L)", "Poiseuille's formula gives volume flow rate through tube of radius r and length L as Q = π ΔP r⁴ / (8 η L)"),
            ("Fluid resistance R_f of a single capillary tube", "I", "8 η L / (π r⁴)", "Analogous to Ohm's law ΔP = Q R_f, fluid resistance is R_f = 8 η L / (π r⁴)"),
            ("Equivalent resistance R_eq for two identical tubes in series", "IV", "2 R_f", "In series, fluid resistances add directly: R_eq = R_f + R_f = 2 R_f"),
            ("Equivalent resistance R_eq for two identical tubes in parallel", "II", "R_f / 2", "In parallel, fluid conductances add: 1/R_eq = 1/R_f + 1/R_f = 2/R_f, so R_eq = R_f / 2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A clean glass capillary tube of radius r = 0.2 mm = 2.0 × 10⁻⁴ m is dipped vertically into water (T = 0.07 N/m, θ = 0°, ρ = 1000 kg/m³, g = 9.8 m/s²). Match List I with List II:",
        [
            ("Height of capillary rise h", "IV", "7.14 cm", "h = 2T cos θ / (ρ g r) = (2 × 0.07 × 1) / (1000 × 9.8 × 2.0 × 10⁻⁴) = 0.0714 m = 7.14 cm"),
            ("Length of liquid column in the tube if tilted at 60° to vertical", "II", "14.28 cm", "Vertical height remains h, so column length along tube is l = h / cos 60° = 7.14 / 0.5 = 14.28 cm"),
            ("Total weight of the liquid column supported by surface tension", "I", "8.80 × 10⁻⁵ N", "Weight W = 2 π r T cos θ = 2 × (22/7) × (2.0 × 10⁻⁴) × 0.07 = 8.80 × 10⁻⁵ N"),
            ("Gravitational potential energy of the raised water column", "III", "3.14 × 10⁻⁶ J", "U = m g (h/2) = (1/2) W h = 0.5 × (8.80 × 10⁻⁵) × 0.0714 = 3.14 × 10⁻⁶ J")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A large spherical liquid drop of radius R and surface tension T is broken isothermally into n = 1000 identical droplets of radius r. Match the parameters in List I with their values in List II:",
        [
            ("Radius of each small droplet r in terms of R", "I", "R / 10", "Volume conservation: (4/3) π R³ = 1000 × (4/3) π r³ implies r = R / 1000^(1/3) = R / 10"),
            ("Ratio of total final surface area to initial surface area A_f / A_i", "III", "10", "A_i = 4 π R², A_f = 1000 × 4 π (R/10)² = 10 × 4 π R² = 10 A_i"),
            ("Work done against surface tension to split the drop", "IV", "36 π R² T", "ΔA = A_f - A_i = 40 π R² - 4 π R² = 36 π R², so W = T ΔA = 36 π R² T"),
            ("Temperature change of liquid if no heat is exchanged with environment", "II", "Decreases by Δθ = 3T/(ρ s) × (1/r - 1/R)", "Surface energy increases by absorbing internal thermal energy, decreasing temperature by Δθ = 3T/(ρ s)(1/r - 1/R)")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A cylindrical tank of area A is filled with an ideal liquid to initial height H. A small hole of area a (a ≪ A) is opened at the bottom. Match the draining parameters in List I with their formulas in List II:",
        [
            ("Total time T required to completely empty the tank", "II", "(A/a) √(2H/g)", "Rate of fall is -dh/dt = (a/A) √(2gh). Integrating from H to 0 gives T = (A/a) √(2H/g)"),
            ("Time t₁ to drain the upper half of the tank (from H to H/2)", "IV", "(A/a) √(2H/g) (1 - 1/√2)", "Integrating from H to H/2 gives t₁ = (A/a) √(2/g) (√H - √(H/2)) = T (1 - 1/√2)"),
            ("Ratio of time to drain upper half to time to drain lower half (t₁ / t₂)", "I", "√2 - 1", "t₁ = T(1 - 1/√2), t₂ = T/√2. Ratio t₁/t₂ = (1 - 1/√2) / (1/√2) = √2 - 1 ≈ 0.414"),
            ("Horizontal thrust force on tank while liquid escapes from hole at depth h", "III", "2 ρ g h a", "Thrust force F = dp/dt = ρ a v² = ρ a (2gh) = 2 ρ g h a")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "An open cylindrical vessel of radius R filled with liquid of density ρ to initial height h₀ is rotated about its central vertical axis at constant angular velocity ω. Match List I with List II:",
        [
            ("Shape of liquid free surface z(r) relative to its lowest central point", "III", "ω² r² / (2g)", "Equipressure condition requires dz/dr = ω² r / g, integrating gives z(r) = ω² r² / (2g)"),
            ("Height difference Δz between liquid at the wall (r = R) and center (r = 0)", "I", "ω² R² / (2g)", "At the wall r = R, so Δz = z(R) - z(0) = ω² R² / (2g)"),
            ("Depression of the surface center below initial undisturbed height h₀", "IV", "ω² R² / (4g)", "Volume of paraboloid is (1/2) π R² Δz. Conservation of liquid volume implies center drops by Δz / 2 = ω² R² / (4g)"),
            ("Gauge pressure at the bottom of the cylinder at distance r from axis", "II", "ρ g h₀ + (1/2) ρ ω² (r² - R²/2)", "Pressure is P(r) = ρ g z_bot(r) = ρ g [h(0) + ω² r² / (2g)] = ρ g h₀ + (1/2) ρ ω² (r² - R²/2)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Two spherical soap bubbles of radii r₁ and r₂ (r₁ < r₂) in air (surface tension T) coalesce partially to form a common spherical interface. Match List I with List II:",
        [
            ("Radius of curvature r_c of the common interface separating bubbles", "IV", "r₁ r₂ / (r₂ - r₁)", "Pressure difference across interface is P₁ - P₂ = 4T/r₁ - 4T/r₂ = 4T/r_c, so r_c = r₁ r₂ / (r₂ - r₁)"),
            ("Curvature direction of the common interface", "II", "Bulges into the larger bubble (convex toward larger bubble)", "Since r₁ < r₂, internal pressure P₁ > P₂, so the interface bulges into the bubble with larger radius"),
            ("Angle between the three film surfaces at their junction line", "I", "120°", "Surface tensions are identical in all three films, so mechanical equilibrium requires three equal angles of 120°"),
            ("Radius R of single combined bubble formed if they coalesce in vacuum", "III", "√(r₁² + r₂²)", "In vacuum, P = 4T/r. Isothermal mole conservation P₁ V₁ + P₂ V₂ = P V implies r₁² + r₂² = R²")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the special capillary and surface phenomena in List I with their physical outcomes in List II (h₀ = 2T cos θ / (ρ g r) is normal Jurin rise):",
        [
            ("Capillary tube of insufficient height h < h₀", "I", "Liquid reaches the top edge without overflowing; radius of curvature increases to R' = r h₀ / h", "Liquid never overflows; meniscus flattens so that h R' = h₀ r = constant"),
            ("Capillary tube placed in an orbiting artificial satellite (g_eff = 0)", "III", "Liquid rises to the very top rim and forms a spherical surface of radius r", "With effective gravity zero, surface tension pulls liquid to completely fill the tube to the top"),
            ("Capillary rise between two vertical parallel glass plates separated by gap d", "IV", "h = 2T / (ρ g d)", "Surface tension force 2 T L balances weight ρ (L d h) g, yielding h = 2T / (ρ g d)"),
            ("Attractive force between two parallel glass plates separated by water film of thickness d over area A", "II", "F = 2 A T / d", "Suction pressure is ΔP = 2T / d, so attractive force holding plates together is F = A ΔP = 2 A T / d")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A small sphere of mass m, radius r, and density ρ is released from rest in a viscous fluid of density σ and viscosity η (effective gravity g' = g(1 - σ/ρ)). Match List I with List II:",
        [
            ("Terminal velocity v_t of the sphere", "II", "m g' / (6 π η r)", "At terminal velocity, viscous drag equals effective weight: 6 π η r v_t = m g', so v_t = m g' / (6 π η r)"),
            ("Characteristic time constant τ of the falling motion", "IV", "m / (6 π η r)", "Equation of motion is m dv/dt = m g' - 6 π η r v = (m/τ)(v_t - v) with τ = m / (6 π η r)"),
            ("Velocity v(t) as an explicit function of time t", "I", "v_t (1 - e^(-t/τ))", "Solving the differential equation with v(0) = 0 gives v(t) = v_t (1 - e^(-t/τ))"),
            ("Distance fallen y(t) before reaching terminal velocity as a function of time", "III", "v_t [t - τ(1 - e^(-t/τ))]", "Integrating v(t) gives y(t) = ∫₀ᵗ v_t (1 - e^(-t'/τ)) dt' = v_t [t - τ(1 - e^(-t/τ))]")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A siphon connects an upper reservoir to an outlet. The siphon crest is at height h₁ above the liquid surface, and the outlet is at depth h₂ below the surface. Liquid density is ρ and atmospheric pressure is P_atm. Match List I with List II:",
        [
            ("Speed of efflux from the siphon outlet", "III", "√(2 g h₂)", "Applying Bernoulli's theorem between reservoir surface and outlet yields v = √(2 g h₂)"),
            ("Absolute pressure at the highest point (crest) of the siphon", "I", "P_atm - ρ g (h₁ + h₂)", "Bernoulli equation between crest and outlet gives P_crest = P_atm - ρ g (h₁ + h₂)"),
            ("Maximum theoretical crest height h₁ for siphon operation (vapor pressure P_v)", "IV", "(P_atm - P_v) / (ρ g) - h₂", "Siphon stops operating if P_crest ≤ P_v, which requires h₁ ≤ (P_atm - P_v) / (ρ g) - h₂"),
            ("Volume flow rate through siphon tube of cross-sectional area a", "II", "a √(2 g h₂)", "Discharge rate through exit area a is Q = a v = a √(2 g h₂)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A horizontal water jet of area A, density ρ, and velocity v strikes various targets. Match the dynamic thrust force exerted on the target in List I with its formula in List II:",
        [
            ("Stationary flat plate held normal to the jet (water deflected sideways at 90°)", "IV", "ρ A v²", "Mass arriving per second is ρ A v. Momentum destroyed per second is (ρ A v) v = ρ A v²"),
            ("Stationary hemispherical cup deflecting the jet backwards by 180°", "II", "2 ρ A v²", "Velocity change is v - (-v) = 2v. Force is mass flow × Δv = (ρ A v)(2v) = 2 ρ A v²"),
            ("Flat plate moving away from the jet with speed u (u < v) along jet direction", "I", "ρ A (v - u)²", "Relative speed is v - u, mass hitting per second is ρ A (v - u), so force is ρ A (v - u)²"),
            ("Series of flat vanes mounted on a wheel moving at speed u (all water intercepted)", "III", "ρ A v (v - u)", "All nozzle water is intercepted, so mass per second is ρ A v, giving force ρ A v (v - u)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A solid cube of side L and density d floats at the interface between two immiscible liquids of densities ρ₁ and ρ₂ (ρ₁ < d < ρ₂), with liquid 1 on top and liquid 2 below. Match List I with List II:",
        [
            ("Height h₂ of the cube immersed in the denser liquid 2", "I", "L (d - ρ₁) / (ρ₂ - ρ₁)", "Weight = total buoyancy: d L³ g = ρ₁ L² (L - h₂) g + ρ₂ L² h₂ g implies h₂ = L (d - ρ₁) / (ρ₂ - ρ₁)"),
            ("Height h₁ of the cube immersed in the lighter liquid 1", "III", "L (ρ₂ - d) / (ρ₂ - ρ₁)", "h₁ = L - h₂ = L - L(d - ρ₁)/(ρ₂ - ρ₁) = L (ρ₂ - d) / (ρ₂ - ρ₁)"),
            ("Restoring force when the cube is pushed vertically downwards by small displacement y", "IV", "L² (ρ₂ - ρ₁) g y", "An extra volume L² y of liquid 2 is displaced instead of liquid 1, creating restoring force L² (ρ₂ - ρ₁) g y"),
            ("Time period of small vertical oscillations of the floating cube", "II", "2 π √[d L / ((ρ₂ - ρ₁) g)]", "Restoring spring constant is k = L² (ρ₂ - ρ₁) g, mass is m = d L³, so T = 2π √(m/k) = 2π √[d L / ((ρ₂ - ρ₁) g)]")
        ], "D"))


    # ==========================================
    # TOPIC 3: Thermal Properties of Matter (20 questions)
    # ==========================================
    t = "Thermal Properties of Matter"
    prefix = "phy_thermal"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the temperature scales and conversion milestones in List I with their corresponding values or expressions in List II:",
        [
            ("Relation between Celsius (C) and Fahrenheit (F) temperatures", "II", "C / 5 = (F - 32) / 9", "Standard conversion relation is C / 100 = (F - 32) / 180, which simplifies to C / 5 = (F - 32) / 9"),
            ("Temperature where both Celsius and Fahrenheit scales read the exact same value", "IV", "-40°", "Setting C = F = x: x / 5 = (x - 32) / 9 gives 9x = 5x - 160, so 4x = -160 and x = -40°"),
            ("Temperature where Fahrenheit and Kelvin scales read the exact same value", "I", "574.25°", "Setting F = K = x: (x - 32) / 180 = (x - 273.15) / 100 yields x = 574.25°"),
            ("Relation between Kelvin scale (T) and Celsius scale (T_C)", "III", "T = T_C + 273.15", "The Kelvin scale zero is absolute zero at -273.15°C, so T = T_C + 273.15")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the thermal expansion coefficients of an isotropic solid in List I with their definitions and relations in List II:",
        [
            ("Coefficient of linear expansion (α)", "III", "(1 / L₀) (ΔL / ΔT)", "Linear expansion coefficient is fractional change in length per degree temperature change: α = (ΔL / L₀) / ΔT"),
            ("Coefficient of superficial (areal) expansion (β)", "I", "2 α", "For an isotropic solid, the superficial expansion coefficient is twice the linear coefficient: β = 2 α"),
            ("Coefficient of volume (cubical) expansion (γ)", "IV", "3 α", "For an isotropic solid, the volume expansion coefficient is three times the linear coefficient: γ = 3 α"),
            ("Ratio of coefficients α : β : γ", "II", "1 : 2 : 3", "Since β = 2α and γ = 3α, the ratio is α : β : γ = 1 : 2 : 3")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the modes of heat transfer in List I with their defining physical characteristics in List II:",
        [
            ("Conduction", "IV", "Heat transfer through molecular vibrations and free electrons without bulk motion of matter", "Conduction is the transfer of thermal energy via microscopic collisions without macroscopic movement"),
            ("Convection", "II", "Heat transfer by the macroscopic bodily movement of warm fluid particles due to density gradients", "Convection involves the bulk physical motion of heated fluid carrying thermal energy"),
            ("Radiation", "I", "Heat transfer through electromagnetic waves that propagates freely across vacuum", "Thermal radiation propagates as electromagnetic waves at the speed of light without requiring any material medium"),
            ("Newton's Law of Cooling", "III", "Rate of heat loss of a body is directly proportional to temperature difference with surroundings", "Newton's law states dT/dt = -k(T - T₀) for small temperature differences with the surroundings")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the radiation laws in List I with their mathematical formulas in List II:",
        [
            ("Stefan-Boltzmann Law for a blackbody", "I", "E = σ T⁴", "Stefan-Boltzmann law states total emissive power of a blackbody is proportional to T⁴: E = σ T⁴"),
            ("Wien's Displacement Law", "III", "λ_max T = b", "Wien's law states wavelength of maximum emissive power is inversely proportional to temperature: λ_max T = b"),
            ("Kirchhoff's Law of Thermal Radiation", "IV", "e_λ / a_λ = E_λ", "At thermal equilibrium, the ratio of emissive power to absorptive power for any body equals that of a blackbody"),
            ("Net radiative power lost by body of area A, emissivity e in surroundings at T₀", "II", "e σ A (T⁴ - T₀⁴)", "Net radiant power lost by a real body to surroundings at T₀ is P_net = e σ A (T⁴ - T₀⁴)")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A liquid of real cubical expansion coefficient γ_r is heated in a glass vessel of linear expansion coefficient α_g. Match the expansion concepts in List I with their expressions in List II:",
        [
            ("Apparent coefficient of cubical expansion (γ_a)", "II", "γ_r - 3 α_g", "Apparent expansion is real expansion of liquid minus volume expansion of vessel: γ_a = γ_r - 3 α_g"),
            ("Fractional volume of liquid overflowing (ΔV_overflow / V₀) on heating by ΔT", "IV", "(γ_r - 3 α_g) ΔT", "Overflow volume is ΔV_liquid - ΔV_vessel = V₀(γ_r - 3 α_g) ΔT"),
            ("Condition for liquid level in vessel to remain completely unchanged on heating", "I", "γ_r = 3 α_g", "The liquid level remains unchanged if volume expansion of liquid matches volume expansion of vessel: γ_r = 3 α_g"),
            ("Fractional change in density of the liquid (Δρ / ρ₀) on heating by ΔT", "III", "-γ_r ΔT", "Density varies as ρ(T) ≈ ρ₀(1 - γ_r ΔT), so fractional change in density is -γ_r ΔT")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A pendulum clock with a metal rod of linear expansion coefficient α = 2.0 × 10⁻⁵ K⁻¹ keeps correct time at 20°C. Temperature rises to 30°C (Δθ = 10 K). Match List I with List II:",
        [
            ("Fractional change in the time period of the pendulum (ΔT_p / T_p)", "III", "1.0 × 10⁻⁴", "ΔT_p / T_p = (1/2) α Δθ = 0.5 × (2.0 × 10⁻⁵) × 10 = 1.0 × 10⁻⁴"),
            ("Time lost per second by the clock", "I", "1.0 × 10⁻⁴ s", "Time lost per second is ΔT_p / T_p = 1.0 × 10⁻⁴ s"),
            ("Time lost per day (86400 seconds) by the clock", "IV", "8.64 s", "Time lost per day is (1/2) α Δθ × 86400 = 1.0 × 10⁻⁴ × 86400 = 8.64 s"),
            ("Clock behavior when temperature drops below 20°C", "II", "Gains time (runs fast)", "When temperature drops, rod contracts, time period decreases, so the clock ticks faster and gains time")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the thermal capacities and latent heat concepts in List I with their standard values or formulas in List II:",
        [
            ("Specific heat capacity of liquid water in SI units", "IV", "4186 J/(kg·K)", "Specific heat capacity of water is 1 cal/(g·°C) = 4186 J/(kg·K)"),
            ("Latent heat of fusion of ice at 0°C in SI units", "II", "3.36 × 10⁵ J/kg", "Latent heat of fusion of ice is 80 cal/g = 80 × 4186 = 3.36 × 10⁵ J/kg"),
            ("Latent heat of vaporization of water at 100°C in SI units", "I", "2.26 × 10⁶ J/kg", "Latent heat of vaporization is 540 cal/g = 540 × 4186 = 2.26 × 10⁶ J/kg"),
            ("Dulong-Petit molar heat capacity of solid elements at high temperature", "III", "3R ≈ 24.9 J/(mol·K)", "Dulong-Petit law states classical molar heat capacity of solid metals is C_v = 3R ≈ 24.9 J/(mol·K)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "In an insulated calorimeter, m₁ = 100 g of ice at 0°C is mixed with m₂ = 200 g of water at 80°C (L_f = 80 cal/g, s_w = 1 cal/(g·°C)). Match the calorimetry quantities in List I with their values in List II:",
        [
            ("Heat required to melt all the ice into water at 0°C", "I", "8000 cal", "Q_melt = m₁ L_f = 100 × 80 = 8000 cal"),
            ("Heat released by warm water in cooling from 80°C to 0°C", "III", "16000 cal", "Q_release = m₂ s_w ΔT = 200 × 1 × 80 = 16000 cal"),
            ("Final equilibrium temperature of the mixture", "IV", "(80 / 3) °C", "Net heat remaining after melting ice is 16000 - 8000 = 8000 cal. Total water mass is 300 g. T_f = 8000 / (300 × 1) = (80/3) °C"),
            ("Total mass of liquid water at thermal equilibrium", "II", "300 g", "All 100 g of ice melts, joining 200 g of water for a total of 100 + 200 = 300 g of liquid water")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A liquid in a beaker cools from 80°C to 60°C in 5 minutes in a room at 20°C. Using Newton's law in average form (T₁ - T₂)/t = K[(T₁ + T₂)/2 - T₀], match List I with List II:",
        [
            ("Cooling constant K", "II", "0.08 min⁻¹", "Average temp is (80+60)/2 = 70°C, excess is 50°C. Rate is (80-60)/5 = 4°C/min. K = 4 / 50 = 0.08 min⁻¹"),
            ("Initial rate of cooling at 80°C", "IV", "4.8 °C/min", "At 80°C, temperature excess is 80 - 20 = 60°C. Instantaneous rate is K(T - T₀) = 0.08 × 60 = 4.8 °C/min"),
            ("Time taken to cool further from 60°C to 50°C", "I", "3.57 min", "Average temp is 55°C, excess is 35°C. Rate is 10/t = 0.08 × 35 = 2.8°C/min, so t = 10 / 2.8 = 3.57 min"),
            ("Temperature of the liquid after infinite time (t → ∞)", "III", "20°C", "As t → ∞, the liquid reaches thermal equilibrium with the ambient room at 20°C")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A cylindrical copper rod of length L = 0.5 m, area A = 1.0 × 10⁻³ m², and thermal conductivity K = 400 W/(m·K) connects reservoirs at 100°C and 0°C. Match List I with List II:",
        [
            ("Thermal resistance (R_th) of the rod", "III", "1.25 K/W", "R_th = L / (K A) = 0.5 / (400 × 1.0 × 10⁻³) = 1.25 K/W"),
            ("Steady heat current (H = dQ/dt) through the rod", "I", "80 W", "H = ΔT / R_th = (100 - 0) / 1.25 = 80 W"),
            ("Magnitude of the temperature gradient (|dT/dx|)", "IV", "200 K/m", "|dT/dx| = ΔT / L = 100 / 0.5 = 200 K/m"),
            ("Total heat transferred through the rod in 10 minutes (600 s)", "II", "4.8 × 10⁴ J", "Q = H t = 80 × 600 = 4.8 × 10⁴ J")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Two rods of equal cross-section A have lengths L₁ = 20 cm, L₂ = 10 cm and conductivities K₁ = 200 W/(m·K), K₂ = 100 W/(m·K). Joined in series between 100°C and 0°C, match List I with List II:",
        [
            ("Ratio of thermal resistances R₁ / R₂", "IV", "1", "R₁ = 0.2 / (200 A) = 0.001 / A; R₂ = 0.1 / (100 A) = 0.001 / A. Thus R₁ / R₂ = 1"),
            ("Temperature of the interface junction (T_j)", "II", "50°C", "Since R₁ = R₂, temperature drop divides equally: 100 - T_j = T_j - 0 implies T_j = 50°C"),
            ("Equivalent thermal conductivity (K_eq) of the composite rod", "I", "150 W/(m·K)", "K_eq = (L₁ + L₂) / (L₁/K₁ + L₂/K₂) = 0.3 / (0.001 + 0.001) = 0.3 / 0.002 = 150 W/(m·K)"),
            ("Ratio of temperature gradients (dT/dx)₁ / (dT/dx)₂", "III", "0.5", "Gradient in rod 1 is (100-50)/0.2 = 250 K/m; in rod 2 is (50-0)/0.1 = 500 K/m. Ratio is 250/500 = 0.5")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Two rods of equal length L and equal area A with conductivities K₁ = 300 W/(m·K) and K₂ = 100 W/(m·K) are joined in parallel between 100°C and 0°C. Match List I with List II:",
        [
            ("Ratio of heat currents H₁ / H₂ through the two rods", "I", "3", "H₁ / H₂ = K₁ / K₂ = 300 / 100 = 3"),
            ("Equivalent thermal conductivity (K_eq) of the parallel combination", "III", "200 W/(m·K)", "K_eq = (K₁ A + K₂ A) / (2A) = (300 + 100) / 2 = 200 W/(m·K)"),
            ("Ratio of equivalent resistance R_parallel to resistance of rod 2 (R₂)", "IV", "0.25", "1/R_eq = 1/R₁ + 1/R₂ = 3/R₂ + 1/R₂ = 4/R₂, so R_eq = 0.25 R₂"),
            ("Fraction of the total heat current carried by Rod 1 (H₁ / H_total)", "II", "0.75", "Since H₁ = 3 H₂, H_total = 4 H₂, so H₁ / H_total = 3 / 4 = 0.75")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A bimetallic strip consists of two metal strips 1 and 2 of equal thickness t, total thickness d = 2t, length L₀, and expansion coefficients α₁ and α₂ (α₂ > α₁) riveted together. Heated by ΔT, match List I with List II:",
        [
            ("Radius of curvature R of the bent bimetallic strip", "II", "d / [(α₂ - α₁) ΔT]", "Outer arc length (R+t)θ = L₀(1+α₂ΔT) and inner arc length (R-t)θ = L₀(1+α₁ΔT). Subtracting gives R ≈ 2t / [(α₂ - α₁)ΔT] = d / [(α₂ - α₁)ΔT]"),
            ("Direction of curvature upon heating", "IV", "Bends toward metal 1 (concave on the side of smaller α)", "Metal 2 with larger α expands more, forming the outer convex curve, bending toward metal 1"),
            ("Angle θ subtended by the circular arc at the center", "I", "L₀ (α₂ - α₁) ΔT / d", "θ = L₀ / R = L₀ (α₂ - α₁) ΔT / d"),
            ("Deflection δ of the free end if one end is rigidly clamped", "III", "L₀² (α₂ - α₁) ΔT / (2d)", "For small curvature, deflection δ ≈ L₀² / (2R) = L₀² (α₂ - α₁) ΔT / (2d)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A pond of water is at 0°C while ambient air is at -θ°C (θ > 0). An ice sheet of thickness x forms on the surface (conductivity K, density ρ, latent heat L_f). Match List I with List II:",
        [
            ("Rate of increase of ice thickness (dx/dt)", "III", "K θ / (ρ L_f x)", "Conducted heat is K A θ / x dt = ρ (A dx) L_f, so dx/dt = K θ / (ρ L_f x)"),
            ("Ice thickness x(t) as a function of time t from x = 0", "I", "√[2 K θ t / (ρ L_f)]", "Integrating x dx = [K θ / (ρ L_f)] dt gives x² / 2 = [K θ / (ρ L_f)] t, so x = √[2 K θ t / (ρ L_f)]"),
            ("Time t required for ice thickness to increase from x₁ to x₂", "IV", "[ρ L_f / (2 K θ)] (x₂² - x₁²)", "Integrating from x₁ to x₂ gives t = [ρ L_f / (2 K θ)] (x₂² - x₁²)"),
            ("Ratio of times t₁ : t₂ : t₃ to form successive layers of equal thickness y", "II", "1 : 3 : 5", "Times are proportional to (y² - 0) : (4y² - y²) : (9y² - 4y²) = 1 : 3 : 5")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the heat conduction geometries in List I with their steady-state heat current formulas in List II (conductivity K, inner temperature T₁ at r₁, outer temperature T₂ at r₂, T₁ > T₂):",
        [
            ("Cylindrical shell of length L (radial heat conduction)", "IV", "2 π K L (T₁ - T₂) / ln(r₂ / r₁)", "At radius r, area is 2π r L. Integrating H dr / (2π r L) = -K dT yields H = 2 π K L (T₁ - T₂) / ln(r₂ / r₁)"),
            ("Spherical shell (radial heat conduction)", "II", "4 π K r₁ r₂ (T₁ - T₂) / (r₂ - r₁)", "At radius r, area is 4π r². Integrating H dr / (4π r²) = -K dT yields H = 4 π K r₁ r₂ (T₁ - T₂) / (r₂ - r₁)"),
            ("Thermal resistance of the cylindrical shell", "I", "ln(r₂ / r₁) / (2 π K L)", "Thermal resistance is R_th = ΔT / H = ln(r₂ / r₁) / (2 π K L)"),
            ("Thermal resistance of the spherical shell", "III", "(r₂ - r₁) / (4 π K r₁ r₂)", "Thermal resistance is R_th = ΔT / H = (r₂ - r₁) / (4 π K r₁ r₂)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A spherical blackbody of radius R, density ρ, and specific heat capacity s cools by radiation in an evacuated chamber at absolute temperature T₀. Match List I with List II:",
        [
            ("Total rate of radiative heat loss (power) P at temperature T", "I", "4 π R² σ (T⁴ - T₀⁴)", "Surface area is 4π R². By Stefan-Boltzmann law, net power radiated is P = 4 π R² σ (T⁴ - T₀⁴)"),
            ("Rate of cooling (-dT/dt) when temperature difference ΔT = T - T₀ is small", "III", "[12 σ T₀³ / (ρ s R)] ΔT", "For small ΔT, T⁴ - T₀⁴ ≈ 4 T₀³ ΔT. Cooling rate is P / (m s) = 4π R² σ (4 T₀³ ΔT) / [(4/3) π R³ ρ s] = [12 σ T₀³ / (ρ s R)] ΔT"),
            ("Dependence of cooling rate on the radius R of the sphere", "IV", "-dT/dt ∝ 1 / R", "Cooling rate is proportional to surface area divided by mass: A / m = 4π R² / [(4/3) π R³ ρ] ∝ 1 / R"),
            ("Ratio of total energy emitted per second by the sphere at 2T₀ to that at T₀", "II", "16", "Total emission is proportional to T⁴. At 2T₀, E ∝ (2T₀)⁴ = 16 T₀⁴, so ratio is 16")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "The Sun is a spherical blackbody of radius R_s and surface temperature T_s. Earth-Sun distance is r_es, and Earth's radius is R_e. Match List I with List II:",
        [
            ("Total luminosity (total power radiated) of the Sun", "II", "4 π R_s² σ T_s⁴", "Total power emitted by the Sun's surface area 4π R_s² is L = 4 π R_s² σ T_s⁴"),
            ("Solar constant S (solar radiant power incident per unit area at Earth)", "IV", "σ T_s⁴ R_s² / r_es²", "Power L spreads over sphere of radius r_es: S = L / (4π r_es²) = σ T_s⁴ R_s² / r_es²"),
            ("Total solar radiant power intercepted by the Earth", "I", "π R_e² S", "Earth intercepts sunlight across its circular cross-sectional shadow area π R_e², receiving power π R_e² S"),
            ("Radiative equilibrium temperature of a planet at distance r from Sun", "III", "T_s √[R_s / (2r)]", "Equating absorbed power S π R_p² to emitted power 4π R_p² σ T_p⁴ yields T_p = T_s √[R_s / (2r)]")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A rod of length L and uniform area A has temperature-dependent conductivity K(T) = K₀(1 + a T), with ends at T₁ and T₂ (T₁ > T₂). Match List I with List II:",
        [
            ("Steady heat current H through the rod", "III", "(K₀ A / L) [(T₁ - T₂) + (a/2)(T₁² - T₂²)]", "Integrating H dx = -K₀(1 + aT) A dT from 0 to L gives H = (K₀ A / L) [(T₁ - T₂) + (a/2)(T₁² - T₂²)]"),
            ("Equivalent thermal conductivity K_eq of the rod", "I", "K₀ [1 + a (T₁ + T₂)/2]", "K_eq = H L / [A(T₁ - T₂)] = K₀ [1 + (a/2)(T₁ + T₂)] = K₀ [1 + a T_avg]"),
            ("Midpoint temperature T(L/2) compared to linear average T_avg = (T₁ + T₂)/2", "IV", "T(L/2) > T_avg (convex upward temperature profile)", "Since K(T) increases with T, conductivity is lower at the cold end, requiring a steeper gradient |dT/dx| there, so T(L/2) > T_avg"),
            ("Heat current in a truncated cone of radii r₁, r₂ and constant conductivity K₀", "II", "π K₀ r₁ r₂ (T₁ - T₂) / L", "Integrating dx / A(x) where r(x) varies linearly gives thermal resistance L / (π K₀ r₁ r₂), so H = π K₀ r₁ r₂ (T₁ - T₂) / L")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Steam at 100°C is passed into m_i = 100 g of ice at -10°C in a calorimeter of water equivalent W = 10 g until all is water at 100°C (s_ice = 0.5, L_f = 80, s_w = 1, L_v = 540 cal/g). Match List I with List II:",
        [
            ("Heat required to warm ice from -10°C to 0°C", "IV", "500 cal", "Q₁ = m_i s_ice ΔT = 100 × 0.5 × 10 = 500 cal"),
            ("Heat required to melt all the ice into water at 0°C", "II", "8000 cal", "Q₂ = m_i L_f = 100 × 80 = 8000 cal"),
            ("Heat required to warm resulting water and calorimeter from 0°C to 100°C", "I", "11000 cal", "Q₃ = (m_i + W) s_w (100 - 0) = (100 + 10) × 1 × 100 = 11000 cal"),
            ("Mass of steam at 100°C condensed to provide the total heat", "III", "36.1 g", "Total heat is 500 + 8000 + 11000 = 19500 cal. Steam mass is m_s = 19500 / 540 ≈ 36.1 g")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A steel ring of initial inner radius R₁ is heated and shrink-fitted onto a rigid cylinder of radius R₂ (R₂ > R₁). Linear expansion is α, Young's modulus is Y, cross-sectional area is A. Match List I with List II:",
        [
            ("Minimum temperature rise ΔT required to slip the ring over the cylinder", "I", "(R₂ - R₁) / (R₁ α)", "R₁ expands to R₂: R₂ = R₁(1 + α ΔT) implies ΔT = (R₂ - R₁) / (R₁ α)"),
            ("Tensile hoop strain in the cooled ring fitted onto the cylinder", "III", "(R₂ - R₁) / R₁", "Hoop strain is (2π R₂ - 2π R₁) / (2π R₁) = (R₂ - R₁) / R₁"),
            ("Tensile hoop force (circumferential tension T) in the fitted ring", "IV", "Y A (R₂ - R₁) / R₁", "Hoop stress is σ = Y (R₂ - R₁) / R₁. Tensile force is T = σ A = Y A (R₂ - R₁) / R₁"),
            ("Radial inward pressure P exerted by the ring on the cylinder", "II", "Y A (R₂ - R₁) / (R₁ R₂)", "Equilibrium of half the ring gives 2 T = P (2 R₂), so P = T / R₂ = Y A (R₂ - R₁) / (R₁ R₂)")
        ], "D"))

    return qs
