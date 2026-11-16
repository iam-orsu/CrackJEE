from builder import make_matrix_q

def get_questions():
    qs = []
    
    # ==========================================
    # TOPIC 1: Electromagnetic Waves (20 questions)
    # ==========================================
    t = "Electromagnetic Waves"
    prefix = "phy_mat_emw"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match Maxwell's equations in electrodynamics in List I with their physical law / meaning in List II:",
        [
            ("∮ E · dA = q_encl / ε0", "III", "Gauss's law for electrostatics (Electric flux through a closed surface equals enclosed charge divided by ε0)", "Gauss's law for electrostatics relates electric flux through a closed surface to net enclosed charge"),
            ("∮ B · dA = 0", "I", "Gauss's law for magnetism (Absence of magnetic monopoles; magnetic field lines are continuous closed loops)", "Gauss's law for magnetism states net magnetic flux through any closed surface is zero"),
            ("∮ E · dl = -dΦ_B/dt", "IV", "Faraday's law of induction (A time-varying magnetic flux induces an electric field with non-zero circulation)", "Faraday's law shows that changing magnetic flux generates an induced electromotive force"),
            ("∮ B · dl = μ0(I_c + ε0 dΦ_E/dt)", "II", "Ampere-Maxwell law (Magnetic fields are produced by both conduction currents and time-varying electric fields)", "Ampere-Maxwell law shows displacement current produces magnetic field alongside conduction current")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the electromagnetic wave regions in List I with their typical vacuum wavelength ranges in List II:",
        [
            ("Radio waves", "IV", "λ > 0.1 m", "Radio waves occupy the longest wavelength region, typically greater than 0.1 m"),
            ("Microwaves", "II", "1 mm < λ < 0.1 m", "Microwaves range from about 1 mm to 0.1 m"),
            ("Ultraviolet rays", "I", "1 nm < λ < 400 nm", "Ultraviolet wavelengths range between roughly 1 nm and 400 nm"),
            ("Gamma rays", "III", "λ < 10^-11 m", "Gamma rays have extremely high frequencies and wavelengths below 10^-11 m")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each type of electromagnetic radiation in List I with its primary practical application in List II:",
        [
            ("Infrared radiation", "II", "Night-vision devices and television remote controls", "Infrared radiation is emitted by warm objects and detected by thermal imaging sensors"),
            ("Ultraviolet radiation", "IV", "Water purification and sterilization of surgical instruments", "UV radiation destroys microorganisms by damaging their cellular DNA"),
            ("X-rays", "I", "Diagnostic imaging of bone fractures and dental inspection", "X-rays penetrate soft tissue but are absorbed by dense bone structures"),
            ("Microwaves", "III", "Radar navigation and satellite telecommunication links", "Microwaves penetrate clouds and atmosphere with minimal scatter, making them ideal for radar")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the physical quantities of a plane electromagnetic wave in vacuum in List I with their exact mathematical relations in List II:",
        [
            ("Wave propagation speed c", "III", "1 / √(μ0 ε0)", "The speed of light in vacuum is defined by c = 1 / √(μ0 ε0)"),
            ("Ratio of peak amplitudes E0 / B0", "I", "c", "In free space, electric and magnetic field amplitudes satisfy E0 / B0 = c"),
            ("Total average energy density u_avg", "IV", "(1/2) ε0 E0² = B0² / (2 μ0)", "Total average energy density is shared equally between electric and magnetic fields"),
            ("Poynting vector S", "II", "(1/μ0) (E × B)", "The Poynting vector gives the rate of energy transport per unit area: S = (1/μ0)(E × B)")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A parallel plate capacitor with circular plates of radius R is being charged by a steady current I_c. Match the quantities at a distance r from the central axis between the plates in List I with their values in List II:",
        [
            ("Total displacement current between the plates", "II", "I_c", "By continuity of total current, total displacement current between the plates equals conduction current I_c"),
            ("Displacement current enclosed within radius r < R", "IV", "I_c (r² / R²)", "Electric flux enclosed inside radius r is Φ_E = E π r² = (Q/(ε0 π R²)) π r² = Q r² / R², so Id,encl = I_c r² / R²"),
            ("Magnetic field magnitude at r < R", "I", "μ0 I_c r / (2π R²)", "Applying Ampere-Maxwell law: 2π r B = μ0 I_c (r²/R²) gives B = μ0 I_c r / (2π R²)"),
            ("Magnetic field magnitude at r = R", "III", "μ0 I_c / (2π R)", "At the plate boundary r = R, B reaches maximum value μ0 I_c / (2π R)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "An electromagnetic wave in vacuum has electric field E(z, t) = (120 V/m) sin(kz - ωt) i^. Match the wave parameters and related vectors in List I with their values in List II (c = 3 × 10^8 m/s):",
        [
            ("Magnetic field vector B(z, t)", "III", "(4.0 × 10^-7 T) sin(kz - ωt) j^", "B0 = E0/c = 120 / (3 × 10^8) = 4.0 × 10^-7 T; wave travels in +k^ and E is in +i^, so B is in +j^ since i^ × j^ = k^"),
            ("Direction of Poynting vector S", "I", "Along +z-axis (+k^)", "Energy flows in the direction of propagation E × B = i^ × j^ = +k^"),
            ("Ratio of angular frequency to wave number ω / k", "IV", "3.0 × 10^8 m/s", "Phase velocity ω/k equals the speed of light c = 3.0 × 10^8 m/s"),
            ("Average intensity I_avg", "II", "19.1 W/m²", "I_avg = (1/2) ε0 c E0² = 0.5 × 8.854 × 10^-12 × 3 × 10^8 × (120)² ≈ 19.1 W/m²")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "A plane electromagnetic wave of intensity I and cross-sectional area A is normally incident on various flat surfaces. Match the surface condition in List I with the corresponding radiation pressure or force in List II:",
        [
            ("Radiation pressure on a perfectly absorbing surface", "IV", "I / c", "Momentum p = U/c transferred per unit time per unit area is I/c"),
            ("Radiation pressure on a perfectly reflecting surface", "I", "2I / c", "Reflected momentum changes by 2p, imparting pressure 2I/c"),
            ("Radiation pressure on a surface with reflection coefficient R = 0.6", "II", "1.6 I / c", "Radiation pressure is (1 + R)I/c = (1 + 0.6)I/c = 1.6 I/c"),
            ("Total force on a perfectly reflecting surface of area A", "III", "2 I A / c", "Total force equals radiation pressure times area: F = (2I/c) × A = 2IA/c")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A sinusoidal plane EM wave has peak electric field amplitude E0 and peak magnetic field amplitude B0 in vacuum. Match the energy and field quantities in List I with their values in List II:",
        [
            ("RMS electric field Erms", "II", "E0 / √2", "For a sinusoidal wave, root-mean-square amplitude is Erms = E0 / √2"),
            ("Average electric energy density <u_E>", "IV", "(1/4) ε0 E0²", "Time average of sin²(kx - ωt) is 1/2, so <u_E> = (1/2) ε0 (E0² / 2) = (1/4) ε0 E0²"),
            ("Ratio of average electric to magnetic energy density <u_E> / <u_B>", "I", "1", "In a plane EM wave, energy is equally divided between electric and magnetic fields"),
            ("Total average energy density in terms of Erms", "III", "ε0 (Erms)²", "Total average energy density <u_total> = 2 <u_E> = ε0 Erms²")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A plane EM wave enters a non-magnetic dielectric medium with relative permittivity εr = 4.0 and μr = 1.0. Match the medium parameters in List I with their values in List II:",
        [
            ("Refractive index of the medium n", "III", "2.0", "n = √(εr μr) = √(4.0 × 1.0) = 2.0"),
            ("Speed of propagation v in the medium", "I", "1.5 × 10^8 m/s", "v = c / n = 3.0 × 10^8 / 2.0 = 1.5 × 10^8 m/s"),
            ("Wavelength in medium λ_med (for vacuum wavelength λ0 = 600 nm)", "IV", "300 nm", "λ_med = λ0 / n = 600 nm / 2.0 = 300 nm"),
            ("Ratio of field amplitudes E0 / B0 in the medium", "II", "1.5 × 10^8 m/s", "In any linear medium, E0 / B0 = v = 1.5 × 10^8 m/s")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "The electric field of an EM wave in vacuum is given by E = 30 sin(2π × 10^8 t - k x) j^ N/C (with t in s, x in m). Match the wave characteristics in List I with their values in List II (c = 3 × 10^8 m/s):",
        [
            ("Propagation wave number k", "IV", "(2π / 3) rad/m", "k = ω / c = (2π × 10^8) / (3 × 10^8) = 2π / 3 rad/m"),
            ("Wavelength λ", "II", "3.0 m", "λ = 2π / k = 3.0 m"),
            ("Peak magnetic field amplitude B0", "I", "1.0 × 10^-7 T", "B0 = E0 / c = 30 / (3 × 10^8) = 1.0 × 10^-7 T"),
            ("Direction of the magnetic field vector B", "III", "Along +z-axis (+k^)", "Wave travels in +i^ and E is in +j^; since E × B || +i^, j^ × k^ = i^, so B is in +k^")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the type of electromagnetic radiation in List I with the physical mechanism of its generation in List II:",
        [
            ("Radio waves", "III", "Accelerated motion of charges in conducting wires or transmitting antennas", "Rapid acceleration and deceleration of electrons in antennas produces radio waves"),
            ("X-rays", "I", "Deceleration of high-speed electrons striking a heavy metal target", "Bremsstrahlung and transitions of inner shell electrons in target atoms yield X-rays"),
            ("Infrared radiation", "IV", "Thermal vibrations and rotations of atoms and molecules in matter", "Molecules at temperatures above absolute zero radiate infrared through vibrational modes"),
            ("Gamma rays", "II", "De-excitation and transitions between energy states of atomic nuclei", "Nuclear transitions involve high energy changes emitting gamma ray photons")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A sinusoidal alternating voltage V(t) = V0 sin(ωt) is applied across a parallel plate capacitor of capacitance C with plate area A and separation d. Match the electrodynamic quantities in List I with their expressions in List II:",
        [
            ("Conduction current supplying the capacitor", "I", "ω C V0 cos(ωt)", "Conduction current is Ic = dQ/dt = C dV/dt = ω C V0 cos(ωt)"),
            ("Total displacement current between the plates", "III", "ω C V0 cos(ωt)", "Total displacement current Id = ε0 dΦ_E/dt equals conduction current Ic at every instant"),
            ("Maximum displacement current density j_d,max", "IV", "ε0 ω V0 / d", "jd,max = Id,max / A = (ω C V0)/A = ε0 ω V0 / d since C = ε0 A / d"),
            ("Phase difference between applied voltage V(t) and displacement current I_d(t)", "II", "π / 2 rad", "Current leads voltage by 90° (π/2 rad) in a purely capacitive system")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A cylindrical wire of radius a, length L, and electrical resistance R carries a steady direct current I. The potential difference across its ends is V = IR. Match the field quantities at the surface of the wire in List I with their expressions in List II:",
        [
            ("Electric field at the wire surface E", "III", "V / L directed parallel to the wire axis", "Electric field along the wire is uniform with magnitude E = V / L = I R / L"),
            ("Magnetic field at the wire surface B", "I", "μ0 I / (2π a) directed azimuthally around the wire", "By Ampere's law, ∮ B · dl = 2π a B = μ0 I, so B = μ0 I / (2π a)"),
            ("Poynting vector S at the wire surface", "IV", "(V I) / (2π a L) directed radially inward into the wire", "S = (1/μ0)(E × B); E is longitudinal and B is azimuthal, so E × B points radially inward"),
            ("Surface integral of Poynting vector ∮ S · (-dA) over lateral surface", "II", "I² R", "Total power entering lateral surface is S × (2π a L) = V I = I² R, equal to Joule heat dissipation")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A collimated beam of electromagnetic radiation with intensity I is incident at an angle θ with respect to the surface normal on a flat surface. Match the configurations in List I with the net radiation pressure normal to the surface in List II:",
        [
            ("Partially reflecting surface with reflection coefficient R = 0.5", "I", "(1.5 I / c) cos² θ", "Radiation pressure is (1 + R)(I/c) cos² θ = 1.5 (I/c) cos² θ"),
            ("Perfectly absorbing surface", "II", "(I / c) cos² θ", "Momentum component normal to surface absorbed per unit time and unit area is (I/c) cos² θ"),
            ("Shear (parallel) radiation pressure on a perfectly absorbing surface", "III", "(I / c) sin θ cos θ", "Tangential momentum transferred per unit area per unit time is (I/c) cos θ sin θ"),
            ("Perfectly reflecting surface", "IV", "(2I / c) cos² θ", "Normal momentum reverses upon reflection, imparting normal pressure (2I/c) cos² θ")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A parallel plate capacitor with circular plates of radius R separated by distance d is charged with a constant current I0. At time t, charge is Q(t) = I0 t. Match the energy and field quantities in List I with their expressions in List II:",
        [
            ("Displacement current density j_d", "III", "I0 / (π R²)", "Displacement current I0 is distributed uniformly over plate area π R², so jd = I0 / (π R²)"),
            ("Total magnetic energy stored between the plates U_B", "I", "μ0 I0² d / (16π)", "B(r) = μ0 I0 r / (2π R²); integrating B²/(2μ0) over volume 2π r dr d gives μ0 I0² d / (16π)"),
            ("Ratio of stored magnetic energy to electric energy U_B / U_E", "II", "R² / (8 c² t²)", "UB/UE = [μ0 I0² d / (16π)] / [I0² t² d / (2 ε0 π R²)] = μ0 ε0 R² / (8 t²) = R² / (8 c² t²)"),
            ("Electric energy stored in the capacitor U_E", "IV", "I0² t² d / (2 ε0 π R²)", "UE = Q² / (2C) = I0² t² / [2 (ε0 π R² / d)] = I0² t² d / (2 ε0 π R²)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A plane electromagnetic wave traveling in vacuum along +z is normally incident on a perfectly conducting wall at z = 0. The standing wave has electric field E(z, t) = 2 E0 sin(kz) sin(ωt) i^. Match the properties in List I with their descriptions in List II:",
        [
            ("Magnetic field standing wave B(z, t)", "I", "2 (E0 / c) cos(kz) cos(ωt) j^", "From Faraday's law ∇ × E = -∂B/∂t, B(z,t) = 2 (E0/c) cos(kz) cos(ωt) j^"),
            ("Positions of magnetic field nodes (zero amplitude)", "II", "z = (2n + 1) λ / 4 (kz = (2n + 1)π/2)", "cos(kz) = 0 when kz = (2n + 1)π/2, giving z = (2n + 1) λ / 4"),
            ("Positions of electric field nodes (zero amplitude)", "III", "z = n λ / 2 (kz = nπ, n = 0, 1, 2, ...)", "sin(kz) = 0 when kz = nπ, giving z = n λ / 2"),
            ("Time-averaged Poynting vector <S>", "IV", "0 (Zero net energy flux)", "A pure standing wave transports zero net energy over a period, so <S> = 0")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A vertically directed, focused laser beam of total power P is used to levitate a small spherical particle of radius r, density ρ, and mass m = (4/3)π r³ ρ. The beam cross-sectional area matches the particle projection π r². Match the cases in List I with the levitation conditions in List II:",
        [
            ("Upward radiation force on a perfectly absorbing particle", "III", "P / c", "For complete absorption of the power intercepted, force F = P / c"),
            ("Upward radiation force on a perfectly reflecting mirror particle", "I", "2P / c", "For complete normal reflection, force F = 2P / c"),
            ("Laser power P_min required to levitate an absorbing particle of mass m", "IV", "m g c", "Equating gravity m g to radiation force P / c gives P_min = m g c"),
            ("Ratio of radiation forces for reflection vs absorption F_refl / F_abs", "II", "2", "A perfectly reflecting surface experiences exactly twice the radiation force of an absorbing one")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Two orthogonal linearly polarized electromagnetic waves of identical frequency ω propagate along +z: E1 = E0 cos(kz - ωt) i^ and E2 = E0 cos(kz - ωt + δ) j^. Match the phase difference δ in List I with the resulting polarization state in List II:",
        [
            ("δ = 0", "IV", "Linearly polarized at 45° to the x-axis", "E_y = E_x at all times, tracing a straight line along y = x"),
            ("δ = π / 2", "II", "Left-circularly polarized", "E_x² + E_y² = E0², with tip of electric field vector rotating in a circle"),
            ("δ = π", "I", "Linearly polarized at 135° to the x-axis", "E_y = -E_x at all times, tracing a line along y = -x"),
            ("δ = π / 4", "III", "Elliptically polarized with major axis tilted at 45°", "Components differ in phase by 45°, tracing an ellipse in the xy plane")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "In a collisionless plasma with electron density n_e, the plasma frequency is ω_p = √(n_e e² / (m_e ε0)). The effective refractive index for an EM wave of frequency ω is n(ω) = √(1 - ω_p² / ω²). Match the wave behaviors in List I with their physical outcomes in List II:",
        [
            ("Product of phase velocity and group velocity v_p · v_g", "I", "c²", "v_p = c / √(1 - ω_p²/ω²) and v_g = c √(1 - ω_p²/ω²), giving v_p v_g = c²"),
            ("Wave angular frequency ω > ω_p", "II", "Wave propagates freely with phase velocity v_p > c", "Refractive index is real and less than 1, allowing propagation without attenuation"),
            ("Critical cutoff frequency for normal reflection f_c", "III", "(1 / (2π)) √(n_e e² / (m_e ε0))", "Cutoff frequency where n = 0, below which waves cannot penetrate the plasma layer"),
            ("Wave angular frequency ω < ω_p", "IV", "Wave is totally reflected; evanescent decay inside plasma", "Refractive index is purely imaginary, leading to exponential spatial attenuation without ohmic absorption")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "An oscillating electric dipole has time-dependent dipole moment p(t) = p0 cos(ωt) k^. In the far-field radiation zone (r >> λ), match the radiation characteristics in List I with their proportionalities in List II:",
        [
            ("Radiation electric field amplitude E_rad at distance r", "I", "Proportional to (ω² p0 sin θ) / r", "Radiation field is proportional to the second time derivative of dipole moment: p''(t) ∝ ω² p0"),
            ("Phase relationship between E_rad and B_rad in far zone", "II", "In phase with E_rad = c B_rad", "E and B oscillate in phase in the radiation zone, maintaining E = c B"),
            ("Radiation intensity distribution I(θ) with polar angle θ", "III", "Proportional to sin² θ / r²", "Intensity is maximum in the equatorial plane θ = 90° and zero along the dipole axis θ = 0"),
            ("Total time-averaged radiated power P_avg", "IV", "Proportional to ω⁴ p0²", "Larmor/dipole radiation formula gives P = μ0 p0² ω⁴ / (12π c)")
        ], "D"))

    # ==========================================
    # TOPIC 2: Ray Optics (20 questions)
    # ==========================================
    t = "Ray Optics"
    prefix = "phy_mat_ropt"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the type of mirror in List I with its optical focal properties in List II (using standard Cartesian sign convention):",
        [
            ("Concave spherical mirror", "III", "Real focus with focal length f < 0", "A converging mirror that forms real images of distant objects in front of the reflecting surface"),
            ("Convex spherical mirror", "I", "Virtual focus with focal length f > 0", "A diverging mirror whose focal point lies behind the reflecting surface"),
            ("Plane mirror", "IV", "Focal length f = ∞ with lateral magnification m = +1", "Zero curvature produces virtual, erect images of identical size at equal distance behind mirror"),
            ("Spherical mirror paraxial relation between R and f", "II", "f = R / 2", "For paraxial rays incident on a spherical mirror of radius of curvature R, f = R / 2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "A light ray travels from an optical medium of refractive index n into air (n_air = 1.0). Match the refractive index n in List I with its critical angle for total internal reflection in List II:",
        [
            ("Water (n = 4 / 3)", "II", "arcsin(3 / 4) ≈ 48.6°", "sin θ_c = 1 / n = 3 / 4, so θ_c ≈ 48.6°"),
            ("Dense flint glass (n = √2)", "I", "45.0°", "sin θ_c = 1 / √2, so θ_c = 45.0°"),
            ("Ordinary crown glass (n = 1.5)", "IV", "arcsin(2 / 3) ≈ 41.8°", "sin θ_c = 1 / 1.5 = 2 / 3, so θ_c ≈ 41.8°"),
            ("Diamond (n = 2.42)", "III", "arcsin(1 / 2.42) ≈ 24.4°", "sin θ_c = 1 / 2.42 ≈ 0.413, giving θ_c ≈ 24.4°")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each thin lens configuration in List I with its focal length or power characteristic in List II:",
        [
            ("Two thin lenses of powers P1 and P2 placed in contact", "I", "Net power P_eq = P1 + P2", "Effective optical power of thin lenses in contact is the algebraic sum P1 + P2"),
            ("Diverging (concave) thin lens", "II", "Negative focal length (f < 0) and negative optical power (P < 0)", "Causes parallel rays to diverge as if originating from a virtual focus"),
            ("SI unit of optical power of a lens", "III", "Dioptre (1 D = 1 m^-1)", "Power is the reciprocal of focal length measured in metres: 1 D = 1 m^-1"),
            ("Converging (convex) thin lens", "IV", "Positive focal length (f > 0) and positive optical power (P > 0)", "Brings parallel paraxial rays to a real focus on the opposite side")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the optical instrument in List I with its standard magnifying power formula in List II:",
        [
            ("Astronomical telescope in normal adjustment", "I", "m = f0 / fe", "Magnifying power in normal adjustment is the ratio of objective to eyepiece focal lengths"),
            ("Simple microscope with image formed at near point D", "II", "m = 1 + D / f", "Virtual image formed at least distance of distinct vision D gives m = 1 + D/f"),
            ("Length of astronomical telescope tube in normal adjustment", "III", "L = f0 + fe", "Separation between objective and eyepiece equals the sum of their focal lengths"),
            ("Simple microscope with image formed at infinity (relaxed eye)", "IV", "m = D / f", "Normal adjustment forms image at infinity with angular magnification m = D/f")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "An object is placed at various positions in front of a concave mirror of focal length magnitude |f|. Match the object distance u in List I with the resulting image properties in List II:",
        [
            ("Object placed at u = 2|f| (center of curvature)", "III", "Real, inverted, same size (|m| = 1), formed at v = 2|f|", "1/v + 1/(2f) = 1/f gives v = 2f; magnification m = -v/u = -1"),
            ("Object placed at |f| < u < 2|f| (between F and C)", "I", "Real, inverted, magnified (|m| > 1), formed beyond 2|f|", "v > 2|f| and image size is larger than the object"),
            ("Object placed at u > 2|f| (beyond C)", "IV", "Real, inverted, diminished (|m| < 1), formed between |f| and 2|f|", "Image is formed between focus and center of curvature with |m| < 1"),
            ("Object placed at u < |f| (between pole and focus)", "II", "Virtual, erect, magnified (|m| > 1), formed behind mirror", "v is positive (behind mirror); m = -v/u > 1 produces magnified erect image")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A glass slab of thickness t and refractive index n is placed in air. Match the optical phenomena in List I with their quantitative expressions in List II:",
        [
            ("Lateral displacement x of a ray incident at angle i on slab of thickness t", "I", "t sin(i - r) / cos r", "Geometry of refraction gives perpendicular shift x = t sin(i - r) / cos r"),
            ("Normal apparent shift Δt of an object seen through a slab of thickness t", "II", "t (1 - 1 / n)", "The apparent position is shifted towards the observer by Δt = t(1 - 1/n)"),
            ("Time taken by light to travel normally through a slab of thickness t", "III", "n t / c", "Speed of light in slab is c / n, so travel time is t / (c / n) = n t / c"),
            ("Apparent depth d' of an object viewed normally through medium of depth d and index n", "IV", "d / n", "Refraction at a flat interface gives apparent depth d' = d / n")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "A thin glass lens (n_g = 1.5) has various surface geometries in air. Match the lens geometry in List I with its focal length in List II:",
        [
            ("Equiconvex lens with both radii of curvature equal to R", "I", "f = R", "1/f = (1.5 - 1)(1/R - (-1/R)) = 0.5 × (2/R) = 1/R, so f = R"),
            ("Equiconcave lens with both radii of curvature equal to R", "II", "f = -R", "1/f = (1.5 - 1)(-1/R - 1/R) = 0.5 × (-2/R) = -1/R, so f = -R"),
            ("Plano-convex lens with curved surface radius R", "III", "f = 2R", "1/f = (1.5 - 1)(1/R - 0) = 0.5 / R, so f = 2R"),
            ("Equiconvex lens of focal length f in air, immersed in water (n_w = 4/3)", "IV", "f_w = 4f", "1/f_w = (1.5/(4/3) - 1)(2/R) = (1/8)(2/R) = 1/(4R), so f_w = 4R = 4f")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A light ray passes through a triangular glass prism of refracting angle A and refractive index n. Match the prism relations in List I with their descriptions in List II:",
        [
            ("Refractive index formula at minimum deviation n", "I", "sin((A + δ_m) / 2) / sin(A / 2)", "Snell's law at first face gives n = sin i / sin r1 = sin((A + δ_m)/2) / sin(A/2)"),
            ("Net angle of deviation δ", "II", "i + e - A", "From geometry of refraction at two prism faces, total deviation is δ = i + e - A"),
            ("Deviation produced by a thin prism of small angle A", "III", "(n - 1) A", "For small angles, sin θ ≈ θ, leading to deviation δ ≈ (n - 1) A"),
            ("Condition for minimum deviation δ_m", "IV", "Angle of incidence equals angle of emergence (i = e, and r1 = r2 = A / 2)", "Ray passes symmetrically through prism parallel to base, minimizing path difference")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "An optical fiber consists of a cylindrical core of refractive index n1 surrounded by a cladding of index n2 (with n1 > n2) in air (n0 = 1). Match the fiber parameters in List I with their expressions in List II:",
        [
            ("Critical angle θ_c at the core-cladding boundary", "III", "arcsin(n2 / n1)", "Total internal reflection at core-cladding interface requires incidence angle θ ≥ arcsin(n2/n1)"),
            ("Numerical aperture (NA) of the fiber", "I", "√(n1² - n2²)", "Light gathering power is NA = sin θ_a = √(n1² - n2²)"),
            ("Maximum acceptance angle θ_a in air", "IV", "arcsin(√(n1² - n2²))", "Rays entering within cone of semi-vertical angle θ_a are guided through core by TIR"),
            ("Fractional refractive index change Δ", "II", "(n1 - n2) / n1", "Normalized core-cladding refractive index difference defined as Δ = (n1 - n2) / n1")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Light from a medium of index n1 strikes a convex spherical interface of radius R bounding a medium of index n2. Match the situations in List I with their expressions from n2/v - n1/u = (n2 - n1)/R in List II:",
        [
            ("Ratio of second focal length to first focal length f2 / f1", "I", "-n2 / n1", "Dividing the two focal lengths yields f2 / f1 = -n2 / n1"),
            ("Second focal length f2 (image distance for object at u = -∞)", "II", "n2 R / (n2 - n1)", "Setting u = -∞ gives n2 / f2 = (n2 - n1) / R, so f2 = n2 R / (n2 - n1)"),
            ("Transverse magnification m for refraction at a spherical surface", "III", "(n1 v) / (n2 u)", "From paraxial ray geometry and Snell's law, magnification is m = (n1 v) / (n2 u)"),
            ("First focal length f1 (object distance for image at v = ∞)", "IV", "-n1 R / (n2 - n1)", "Setting v = ∞ gives -n1 / f1 = (n2 - n1) / R, so f1 = -n1 R / (n2 - n1)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A compound microscope has an objective of focal length f0 and an eyepiece of focal length fe separated by a tube of length L. Match the microscope parameters in List I with their expressions in List II:",
        [
            ("Total magnification M in normal adjustment (image at infinity)", "I", "(L / f0) × (D / fe)", "Objective magnification is v0/u0 ≈ L/f0 and eyepiece angular magnification is D/fe"),
            ("Desired design criteria for objective and eyepiece focal lengths", "II", "Both f0 and fe should be small, with f0 < fe", "Small focal lengths maximize magnifying power M ∝ 1/(f0 fe)"),
            ("Total magnification M when image is formed at near point D", "III", "(L / f0) × (1 + D / fe)", "Eyepiece acts as simple magnifier at near point giving m_e = 1 + D/fe"),
            ("Nature of intermediate image formed by the objective", "IV", "Real, inverted, and magnified", "Object placed just outside first focus of objective forms real magnified image")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Two thin coaxial lenses of focal lengths f1 and f2 are separated by a distance d in air. Match the combination properties in List I with their formulas in List II:",
        [
            ("Equivalent power when the two lenses are placed in direct contact (d = 0)", "I", "P_eq = P1 + P2", "In contact, lens powers add directly: P_eq = 1/f1 + 1/f2"),
            ("Equivalent focal length F of the separated combination", "II", "1 / F = 1 / f1 + 1 / f2 - d / (f1 f2)", "General Gullstrand formula for equivalent focal length of two separated thin lenses"),
            ("Separation d for which the combination has zero net power (F = ∞)", "III", "d = f1 + f2", "When d = f1 + f2, 1/F = 0 and system becomes telescopic (afocal)"),
            ("Condition for combination to be achromatic when made of same glass", "IV", "d = (f1 + f2) / 2", "Separation equal to mean focal length eliminates lateral chromatic aberration")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A thin glass lens (n = 1.5) has one of its surfaces silvered so that it functions as a mirror. Match the silvered lens system in List I with its effective focal length F in List II:",
        [
            ("Plano-convex lens (radius R) with flat surface silvered", "I", "F = -R / (2(n - 1)) = -R", "P = 2 P_lens + P_mirror = 2(0.5/R) + 0 = 1/R, so F = -1/P = -R"),
            ("Plano-concave lens (radius R) with curved surface silvered", "II", "F = +R / (2n) = +R / 3", "System acts as convex mirror with positive effective focal length F = R / 3"),
            ("Plano-convex lens (radius R) with curved surface silvered", "III", "F = -R / (2n) = -R / 3", "P = 2 P_lens + P_mirror = 2(0.5/R) + 2/R = 3/R, so F = -R / 3"),
            ("Equiconvex lens (radii R) with one curved surface silvered", "IV", "F = -R / (4n - 2) = -R / 4", "P = 2(2(n-1)/R) + 2/R = 2(1/R) + 2/R = 4/R, so F = -R / 4")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A light ray propagates in the xy-plane in an inhomogeneous medium whose refractive index varies along y as n(y). Snell's law requires n(y) sin θ(y) = constant = C. Match the index profile in List I with its ray trajectory property in List II:",
        [
            ("Condition for ray to undergo turning / reflection at height y_turn", "I", "n(y_turn) = C", "At the turning point, ray becomes horizontal (θ = 90°), so sin θ = 1, meaning n(y_turn) = C"),
            ("Constant product n(y) sin θ(y) along ray path", "II", "Invariant of ray trajectory according to Fermat's principle", "Translational invariance along x implies conserved horizontal wave vector component"),
            ("Ray launched in a medium where n(y) decreases with height", "III", "Ray bends downwards towards region of higher refractive index", "Continuous refraction curves rays towards denser regions, creating mirage phenomena"),
            ("n(y) = n0 √(1 + y / H) for a ray launched horizontally at y = 0", "IV", "Parabolic trajectory y(x) ∝ x²", "n(y) cos α = n0 gives dy/dx = tan α = √(n²/n0² - 1) = √(y/H), integrating gives y = x²/(4H)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A solid glass sphere of radius R and refractive index n = 1.5 is placed in air. Match the optical situations in List I with their focal or image locations in List II:",
        [
            ("Distance from center of sphere to the focus for a paraxial beam incident from infinity", "I", "3R / 2", "Refraction at first surface gives v1 = 3R; second surface gives focus at R/2 from back vertex, so 3R/2 from center"),
            ("Apparent position of a small air bubble at the center of the sphere", "II", "At the center itself, distance R from surface", "Rays from center strike interface normally (angle of incidence = 0), emerging undeviated"),
            ("Distance of final focus from the rear surface of the sphere", "III", "R / 2", "Using spherical refraction formula at rear surface gives distance v2 = R / 2 from vertex"),
            ("Refractive index n of sphere required to focus parallel rays precisely on rear surface", "IV", "n = 2.0", "For focus on rear surface v2 = 0, formula gives (2 - n)/(2(n - 1)) = 1, so n = 2.0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Two thin prisms made of crown glass (index n1, dispersive power ω1, angle A1) and flint glass (index n2, dispersive power ω2, angle A2) are combined. Match the conditions and results in List I with their formulas in List II:",
        [
            ("Net angular dispersion produced in dispersion without deviation", "I", "(n1 - 1) A1 (ω1 - ω2)", "Substituting A2 into net dispersion gives θ_net = (n1 - 1) A1 (ω1 - ω2)"),
            ("Condition for dispersion without deviation (net mean deviation δ = 0)", "II", "A2 / A1 = -(n1 - 1) / (n2 - 1)", "Net deviation δ = (n1 - 1)A1 + (n2 - 1)A2 = 0 requires opposite prism orientations"),
            ("Dispersive power ω of a prism material", "III", "(n_v - n_r) / (n_y - 1)", "Ratio of angular dispersion between violet and red to mean yellow deviation"),
            ("Condition for deviation without dispersion (achromatic combination)", "IV", "A2 / A1 = -[(n1 - 1) ω1] / [(n2 - 1) ω2]", "Net angular dispersion θ = (n1 - 1)ω1 A1 + (n2 - 1)ω2 A2 = 0")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A point source of light is located at depth h below the flat surface of water of refractive index n (with n > 1) in air. Match the optical quantities in List I with their exact formulas in List II:",
        [
            ("Area A of the circle of illuminance", "I", "π h² / (n² - 1)", "Area = π r² = π [h / √(n² - 1)]² = π h² / (n² - 1)"),
            ("Solid angle Ω subtended by the cone of escaping light at the source", "II", "2π (1 - √(1 - 1/n²))", "Ω = 2π(1 - cos θ_c) = 2π(1 - √(1 - sin² θ_c)) = 2π(1 - √(1 - 1/n²))"),
            ("Radius r of the circular patch through which light escapes into air", "III", "h / √(n² - 1)", "At edge of circle, angle of incidence equals critical angle: tan θ_c = r/h, sin θ_c = 1/n, so r = h / √(n² - 1)"),
            ("Semi-vertical angle θ_c of the light cone escaping into air", "IV", "arcsin(1 / n)", "Rays incident at angles θ ≤ θ_c escape, while rays with θ > θ_c undergo total internal reflection")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A small spherical air bubble (n_in = 1.0) of radius R is embedded inside a large glass block (n_out = 1.5). Match the bubble refraction scenarios in List I with their optical parameters in List II:",
        [
            ("Focal length of the spherical bubble inside glass", "I", "-3R / 2", "Using thick lens formula with relative index n_rel = 1/1.5 = 2/3 gives f = -1.5 R"),
            ("Effective optical power of the spherical air bubble inside glass", "II", "Diverging power (P < 0)", "Since n_in < n_out, the bubble acts as a diverging spherical lens in the medium"),
            ("Image of an object at the center of the bubble", "III", "Formed at the center itself with magnification m = 1", "Rays originating from center strike spherical interface normally, suffering zero deviation"),
            ("Apparent depth of bubble center when viewed from outside flat surface at distance d", "IV", "d / 1.5 = 2d / 3", "Apparent depth through flat glass-air interface is d' = d / n = d / 1.5")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the type of optical aberration in List I with its cause, characteristic, or corrective technique in List II:",
        [
            ("Coma", "I", "Off-axis aberration where image of off-axis point appears flared like a comet; minimized by proper stop placement", "Asymmetric magnification for different zones of lens creates comet-like flare"),
            ("Spherical aberration", "II", "Marginal rays focus closer to lens than paraxial rays; minimized using plano-convex lens with curved side facing parallel rays", "Caused by non-paraxial spherical geometry refracting marginal rays more strongly"),
            ("Astigmatism", "III", "Asymmetric focal surfaces for tangential and sagittal ray fans of off-axis object points; corrected by anastigmatic lens systems", "Rays in tangential and sagittal planes focus at different longitudinal positions"),
            ("Chromatic aberration", "IV", "Different wavelengths focus at different points due to dispersion (f_blue < f_red); corrected using an achromatic doublet", "Material dispersion makes focal length wavelength-dependent")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each type of astronomical telescope design in List I with its structural or optical feature in List II:",
        [
            ("Cassegrain reflecting telescope", "I", "Concave parabolic primary mirror with convex hyperbolic secondary mirror reflecting light through a central hole in primary", "Folded optical path allows large focal length in compact tube with zero chromatic aberration"),
            ("Angular resolution limit of telescope of circular aperture diameter D", "II", "θ_min = 1.22 λ / D", "Rayleigh criterion for diffraction-limited resolution of circular aperture"),
            ("Newtonian reflecting telescope", "III", "Concave spherical or parabolic primary mirror with a flat secondary mirror tilted at 45° reflecting light to side eyepiece", "Simple reflector design with flat diagonal mirror directing beam out of telescope tube side"),
            ("Galilean telescope", "IV", "Converging objective lens combined with a diverging eyepiece, producing an erect final image with tube length L = f0 - |fe|", "Produces an upright image without an extra inverting lens, but with small field of view")
        ], "D"))

    # ==========================================
    # TOPIC 3: Wave Optics (20 questions)
    # ==========================================
    t = "Wave Optics"
    prefix = "phy_mat_wopt"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the source or optical element in List I with the corresponding shape of the wavefront in List II:",
        [
            ("Linear slit source of light", "I", "Cylindrical wavefront", "Wavefronts expand as coaxial cylindrical surfaces centered on the line source"),
            ("Plane wave reflected from a concave spherical mirror", "II", "Converging spherical wavefront", "The reflected wavefront converges towards the real focal point of the concave mirror"),
            ("Point source of light in an isotropic homogeneous medium", "III", "Spherical wavefront", "Wavefronts expand symmetrically in all three dimensions as concentric spheres"),
            ("Point source located at an infinite distance (parallel beam)", "IV", "Plane wavefront", "At very large distances from a source, the curvature becomes zero and wavefronts are planar")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the interference condition or concept in List I with its physical principle in List II:",
        [
            ("Incoherent sources of intensities I1 and I2", "I", "Resulting intensity is simply I1 + I2 everywhere", "No interference pattern is observed; intensities add in scalar fashion without cross-terms"),
            ("Condition for maximum fringe contrast / visibility", "II", "Amplitudes of the two interfering waves are equal", "When a1 = a2, I_min = 0, giving perfect fringe contrast V = (I_max - I_min)/(I_max + I_min) = 1"),
            ("Reason why two independent sodium lamps cannot produce interference", "III", "Phase of emitted light changes randomly every ~10^-10 s", "Independent atomic emissions undergo spontaneous random phase jumps, washing out fringes"),
            ("Coherent sources", "IV", "Maintain a constant phase difference over time", "Sustained interference fringes require sources whose relative phase does not fluctuate")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "In a standard YDSE with slit separation d, slit-to-screen distance D, and wavelength λ in air, match each parameter in List I with its formula or property in List II:",
        [
            ("Fringe width β", "I", "λ D / d", "Linear distance between any two consecutive bright or dark fringes on the screen"),
            ("Path difference Δx for m-th bright fringe", "II", "m λ", "Constructive interference occurs when path difference is an integer multiple of wavelength"),
            ("Angular fringe width θ", "III", "λ / d", "Angular separation between consecutive fringes, independent of screen distance D"),
            ("Fringe width β' when entire apparatus is immersed in liquid of index n", "IV", "β / n", "Wavelength reduces to λ / n in the medium, so fringe width decreases by factor n")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the polarization law or phenomenon in List I with its mathematical statement or description in List II:",
        [
            ("Malus's Law for transmitted intensity through an analyzer", "I", "I = I0 cos² θ", "Transmitted intensity varies as the square of the cosine of angle between transmission axes"),
            ("Brewster's Law", "II", "tan θ_p = μ", "Reflected light is completely linearly polarized when incident at Brewster's angle, where tan θ_p = μ"),
            ("Intensity of unpolarized light of intensity I0 passing through an ideal linear polarizer", "III", "I0 / 2", "Averaging cos² θ over all random polarization angles gives half the incident intensity"),
            ("Angle between reflected and refracted rays at Brewster's incidence", "IV", "90°", "The reflected and refracted rays are mutually perpendicular: θ_p + r = 90°")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Two coherent light beams of intensities I1 = 9 I0 and I2 = I0 interfere on a screen. Match the interference quantities in List I with their values in List II:",
        [
            ("Minimum intensity on the screen I_min", "I", "4 I0", "I_min = (√I1 - √I2)² = (3√I0 - √I0)² = (2√I0)² = 4 I0"),
            ("Intensity at a point where phase difference is φ = π / 2", "II", "10 I0", "I = I1 + I2 + 2√(I1 I2) cos(π/2) = 9 I0 + I0 + 0 = 10 I0"),
            ("Maximum intensity on the screen I_max", "III", "16 I0", "I_max = (√I1 + √I2)² = (3√I0 + √I0)² = (4√I0)² = 16 I0"),
            ("Ratio of maximum to minimum intensity I_max / I_min", "IV", "4", "16 I0 / (4 I0) = 4")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "In a YDSE with wavelength λ, a thin transparent sheet of thickness t and refractive index μ is placed in front of one of the slits. Match the fringe shift quantities in List I with their expressions in List II:",
        [
            ("Number of fringes shifted N across the central position", "I", "(μ - 1) t / λ", "Each shift of one fringe width β = λD/d corresponds to path difference λ: N = Δy / β = (μ - 1)t / λ"),
            ("Linear shift of the fringe pattern on the screen Δy", "II", "(μ - 1) t D / d", "Central fringe shifts by Δy = (D / d) Δx = (μ - 1) t D / d"),
            ("Direction of shift of the entire fringe pattern", "III", "Towards the side of the slit containing the sheet", "Light through the sheet is delayed, so the path through the other slit must be longer to equalize path length"),
            ("Additional optical path difference introduced by the sheet", "IV", "(μ - 1) t", "Optical path through sheet is μ t, compared to t in air, giving extra path (μ - 1)t")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "In a single-slit Fraunhofer diffraction experiment with slit width a, screen distance D, and wavelength λ, match the diffraction features in List I with their expressions in List II:",
        [
            ("Angular half-width θ1 of the central diffraction maximum", "I", "λ / a", "Condition for first diffraction minimum is a sin θ1 = λ, so θ1 ≈ λ / a"),
            ("Ratio of intensity of first secondary maximum to central maximum I1 / I0", "II", "≈ 4 / (9π²) ≈ 0.045 (4.5%)", "Secondary maximum occurs at α ≈ 3π/2: I1/I0 = sin²(3π/2) / (3π/2)² = 1 / (9π²/4) ≈ 0.045"),
            ("Full linear width w of the central diffraction maximum on the screen", "III", "2 λ D / a", "Central maximum extends from first minimum on left to first minimum on right: w = 2 θ1 D = 2 λ D / a"),
            ("Condition for the n-th diffraction minimum", "IV", "a sin θ = n λ, where n = ±1, ±2, ...", "Path difference between wavelets from top and bottom edges of slit equals integer multiples of λ")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the characteristics of optical patterns in List I with the correct phenomenon in List II:",
        [
            ("Minimum intensity is strictly zero when slit amplitudes are equal", "I", "Two-slit interference with equal slits", "Complete destructive interference occurs where path difference is odd multiple of λ/2"),
            ("Equal fringe widths β for all bright and dark bands", "II", "Two-slit interference pattern (YDSE)", "Fringe width β = λD/d is completely uniform across all orders in paraxial approximation"),
            ("Superposition of waves from a continuous distribution of wavelets on a single wavefront", "III", "Diffraction of light", "Huygens-Fresnel wavelets across the aperture interfere to produce diffraction"),
            ("Central maximum is twice as wide as secondary maxima", "IV", "Single-slit Fraunhofer diffraction pattern", "Central maximum width is 2λD/a, whereas secondary maxima have width λD/a")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "An unpolarized light beam of intensity I0 passes through a linear polarizer P1, followed by one or more analyzers. Match the optical setup in List I with the final transmitted intensity in List II:",
        [
            ("Light passes through P1 and then P2 with angle θ = 45° between transmission axes", "I", "(1 / 4) I0", "After P1: I1 = I0/2. After P2: I2 = (I0/2) cos²(45°) = (I0/2)(1/2) = (1/4) I0"),
            ("Light passes through crossed polarizers (θ = 90°) with a third polarizer at 45° between them", "II", "(1 / 8) I0", "After P1: I0/2. After P3: (I0/2) cos²(45°) = I0/4. After P2: (I0/4) cos²(45°) = I0/8"),
            ("Light passes through P1 and then P2 with angle θ = 30° between transmission axes", "III", "(3 / 8) I0", "After P1: I1 = I0/2. After P2: I2 = (I0/2) cos²(30°) = (I0/2)(3/4) = (3/8) I0"),
            ("Light passes through P1 and then P2 with angle θ = 0° between transmission axes", "IV", "I0 / 2", "After P1: I1 = I0/2. After P2: I2 = (I0/2) cos²(0°) = I0 / 2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the interference setups in List I with their defining experimental properties in List II:",
        [
            ("Determination of slit separation d by displacement method in biprism", "I", "d = √(d1 d2)", "Convex lens forms real images of virtual slits at two positions giving d = √(d1 d2)"),
            ("Fresnel's biprism virtual source separation d", "II", "2 d1 (μ - 1) α", "Virtual sources produced by small refracting angle α of biprism separated by d = 2 d1 (μ - 1) α"),
            ("Nature of fringes in Fresnel's biprism", "III", "Hyperbolic in general, but straight and parallel near the center", "Fringes formed by two coherent point/slit sources are hyperboloids intersecting screen as straight lines"),
            ("Lloyd's single mirror interference pattern", "IV", "Central fringe is dark due to π phase change upon reflection", "Light reflected from a denser medium suffers a phase shift of π (path difference λ/2)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the optical instrument in List I with its limit of resolution or resolving power in List II:",
        [
            ("Resolving power of an astronomical telescope", "I", "D / (1.22 λ)", "Reciprocal of angular limit of resolution: RP = 1 / dθ = D / (1.22 λ)"),
            ("Resolving power of an optical microscope", "II", "(2 n sin α) / λ", "Reciprocal of linear limit of resolution: RP = 1 / dx = 2 n sin α / λ"),
            ("Limit of resolution of an astronomical telescope of objective diameter D", "III", "dθ = 1.22 λ / D", "Rayleigh criterion for angular resolution of circular aperture"),
            ("Limit of resolution of an optical microscope (Abbe's criterion)", "IV", "dx = λ / (2 n sin α)", "Linear distance between two barely resolvable point objects, where n sin α is numerical aperture")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A YDSE is illuminated simultaneously by two wavelengths λ1 = 600 nm and λ2 = 400 nm. Match the fringe superposition conditions in List I with their values in List II:",
        [
            ("Minimum non-zero distance y_min from central bright fringe for coincidence", "I", "2 λ1 D / d = 3 λ2 D / d = 1200 D / d (nm)", "First coincidence occurs at y = 2 β1 = 3 β2 = 1200 D / d nm"),
            ("Smallest order n1 of λ1 that coincides with a bright fringe of λ2", "II", "n1 = 2", "n1 λ1 = n2 λ2 gives n1 / n2 = 400 / 600 = 2 / 3, so lowest order coincidence is n1 = 2"),
            ("Appearance of the central zero-order fringe on the screen", "III", "Bright and white", "All wavelengths have zero path difference at center, constructively interfering to produce white light"),
            ("Order n2 of λ2 that coincides with the n1 = 2 bright fringe of λ1", "IV", "n2 = 3", "At the point of coincidence, n2 = 3")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "In a YDSE with slit separation d and screen distance D, the monochromatic source S is shifted transversely by distance y_s at distance D_s before the slit plane. Match the optical results in List I with their formulas in List II:",
        [
            ("Position of the central bright fringe y0 on the screen", "I", "-y_s (D / D_s)", "Net path difference zero: d y_s/D_s + d y0/D = 0 implies y0 = -y_s D / D_s, shifting oppositely"),
            ("Condition to keep central fringe at geometrical center when slab of thickness t is inserted in one slit", "II", "(μ - 1) t = d y_s / D_s", "The optical path introduced by the slab balances the initial path difference from source shift"),
            ("Initial path difference between rays reaching the two slits", "III", "d y_s / D_s", "Source shift introduces path difference Δx_initial = d sin α ≈ d (y_s / D_s) at slit plane"),
            ("Effect on the fringe width β", "IV", "Unchanged (β = λ D / d)", "Fringe width depends only on λ, D, and d, so pattern merely translates without changing spacing")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A thin dielectric film of thickness t and refractive index μ is illuminated by light of wavelength λ at near-normal incidence (cos r ≈ 1). Match the thin film conditions in List I with their expressions in List II:",
        [
            ("Minimum non-zero thickness t_min of a non-reflecting coating (μ_film = √μ_glass)", "I", "λ / (4 μ_film)", "Destructive interference between reflections from top and bottom boundaries requires 2 μ_film t = λ / 2"),
            ("Condition for destructive interference in reflected light for a film in air", "II", "2 μ t = n λ, where n = 1, 2, 3, ...", "Phase shift of π at upper surface requires 2μt - λ/2 = (2n - 1)λ/2, giving 2μt = nλ"),
            ("Cause of brilliant colors observed in soap bubbles under white light", "III", "Constructive interference for different wavelengths at different film thicknesses and viewing angles", "Varying thickness causes different spectral colors to interfere constructively at different angles"),
            ("Condition for constructive interference in reflected light for a film in air", "IV", "2 μ t = (2n + 1) λ / 2, where n = 0, 1, 2, ...", "Reflection at top surface introduces π phase shift (λ/2 path), so net path is 2μt - λ/2 = nλ")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Three identical narrow slits with equal adjacent separation d are illuminated normally by a plane wave of wavelength λ. The phase difference between adjacent slits is φ = (2π / λ) d sin θ. Match the intensity and angle conditions in List I with their values in List II (I0 is intensity of a single slit):",
        [
            ("Maximum intensity at principal maxima (φ = 2nπ)", "I", "9 I0", "Three wave amplitudes add in phase: E_max = 3 E0, so I_max = 9 I0"),
            ("Condition for principal maxima", "II", "d sin θ = n λ, where n = 0, ±1, ±2, ...", "All three waves arrive in phase when path difference between adjacent slits is an integer multiple of λ"),
            ("Minimum intensity (complete darkness, I = 0) occurs at phase differences", "III", "φ = 2π / 3 and φ = 4π / 3", "Amplitudes form an equilateral triangle in the phasor diagram: 1 + e^(i 2π/3) + e^(i 4π/3) = 0"),
            ("Intensity of the secondary maximum between principal maxima (at φ = π)", "IV", "I0", "Phasors: E0 - E0 + E0 = E0, giving intensity I = I0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "In a double-slit experiment, each slit has finite width a and the center-to-center slit separation is d = 3a. The pattern is a combination of two-slit interference modulated by single-slit diffraction. Match the pattern characteristics in List I with their values in List II:",
        [
            ("Ratio of slit separation to slit width d / a", "I", "3", "Given d = 3a"),
            ("Number of interference bright fringes contained within central diffraction maximum", "II", "5", "Central diffraction peak has angular width 2λ/a; interference maxima occur at d sin θ = mλ = 3a sin θ, giving m = -2, -1, 0, 1, 2"),
            ("Second missing order of interference", "III", "m = ±6", "Second diffraction minimum occurs at a sin θ = 2λ, giving d sin θ = 3(2λ) = 6λ, so m = 6 is missing"),
            ("First missing order of interference", "IV", "m = ±3", "First diffraction minimum occurs at a sin θ = λ, giving d sin θ = 3(a sin θ) = 3λ, so m = 3 is missing")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A uniaxial birefringent crystal has principal refractive indices n_o (ordinary) and n_e (extraordinary). Light of wavelength λ propagates perpendicular to the optic axis. Match the wave plate type and thickness in List I with its optical action in List II:",
        [
            ("Half-wave plate (HWP) thickness t = λ / (2 |n_o - n_e|)", "I", "Rotates the plane of polarization of linearly polarized light by 2θ", "Introduces a phase difference of Δφ = π (path difference λ / 2), mirroring polarization across optic axis"),
            ("Ordinary ray (o-ray) propagation property in uniaxial crystal", "II", "Spherical wavefront with refractive index n_o independent of propagation direction", "Obeys Snell's law in all directions of propagation"),
            ("Quarter-wave plate (QWP) thickness t = λ / (4 |n_o - n_e|)", "III", "Converts linearly polarized light (at 45° to optic axis) into circularly polarized light", "Introduces a phase difference of Δφ = π / 2 (path difference λ / 4) between o- and e-components"),
            ("Full-wave plate thickness t = λ / |n_o - n_e|", "IV", "Introduces 2π phase shift, leaving polarization state completely unchanged", "Path difference λ produces no net change in polarization state for wavelength λ")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the coherence concepts and fringe visibility parameters in List I with their mathematical expressions or physical meanings in List II:",
        [
            ("Maximum permissible source width s for observing clear fringes in YDSE", "I", "s ≤ λ D_s / d", "Spatial coherence requires source angular size s/D_s to be smaller than fringe angular spacing λ/d"),
            ("Temporal coherence length L_c of a quasi-monochromatic source of spectral width Δλ", "II", "λ² / Δλ", "Length over which phase correlation persists: L_c = c τ_c ≈ c / Δν = λ² / Δλ"),
            ("Effect on fringes when path difference exceeds temporal coherence length (Δx > L_c)", "III", "Fringes wash out and disappear completely", "Wave packets no longer overlap in time, destroying phase correlation between interfering beams"),
            ("Fringe visibility V in an interference pattern", "IV", "(I_max - I_min) / (I_max + I_min)", "Standard Michelson definition of fringe contrast; V = 1 for pure interference, V = 0 for no fringes")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A solution of an optically active substance (e.g. sugar in water) rotates the plane of polarization of linearly polarized light. Match the polarimetry parameters in List I with their definitions or formulas in List II:",
        [
            ("Laurent half-shade device in a polarimeter", "I", "Divides field of view into two halves with different polarization angles for high-precision extinction matching", "Enables high-precision matching of two halves of unequal brightness to find optical extinction"),
            ("Angle of optical rotation θ", "II", "[α] × l × c", "Biot's law: rotation is proportional to specific rotation [α], path length l (dm), and concentration c (g/cm³)"),
            ("Dextrorotatory vs Levorotatory substances", "III", "Rotates plane of polarization clockwise (right) vs counterclockwise (left) facing oncoming beam", "Dextrorotatory rotates rightwards (+) while levorotatory rotates leftwards (-)"),
            ("Specific rotation [α] at temperature T and wavelength D", "IV", "θ / (l × c)", "Optical rotation produced by 1 decimeter of solution containing 1 g/cm³ of active substance")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A convex lens of focal length f is cut along its principal axis into two halves, which are separated by a small gap s. A monochromatic point source is placed on the axis at distance u = 2f in front of the lens. Match the Billet split lens parameters in List I with their expressions in List II:",
        [
            ("Distance v of the two real images (coherent sources S1, S2) from the lens", "I", "2f", "Using thin lens formula 1/v - 1/(-2f) = 1/f gives 1/v = 1/f - 1/(2f) = 1/(2f), so v = 2f"),
            ("Nature of the coherent sources S1 and S2", "II", "Real coherent images formed by refraction through the two lens halves", "The two halves form two distinct real point images in space that act as coherent sources"),
            ("Separation d between the two coherent source images S1 and S2", "III", "2s", "Each half-lens is displaced by s/2 from the source, so images are separated by d = s(1 + v/u) = s(1 + 1) = 2s"),
            ("Fringe width β on a screen placed at distance D from the split lens (D > 2f)", "IV", "λ (D - 2f) / (2s)", "Distance from coherent source plane to screen is D' = D - 2f; slit separation is d = 2s, giving β = λ D' / d")
        ], "D"))

    return qs
