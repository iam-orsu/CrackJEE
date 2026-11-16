"""
Group 8: Modern Physics & Electronics Matrix Match Questions
Covers 4 topics (20 questions each, total 80 questions):
  1. Dual Nature of Radiation (4 beg, 8 inter, 8 adv)
  2. Atoms and Nuclei (4 beg, 8 inter, 8 adv)
  3. Semiconductor Devices (4 beg, 8 inter, 8 adv)
  4. Communication Systems (4 beg, 8 inter, 8 adv)
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_questions() -> list:
    qs = []
    prefix = "phy_mod"

    # Question 1: Dual Nature of Radiation (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_1",
        "Dual Nature of Radiation",
        "beginner",
        "Match the fundamental parameters of the photoelectric effect in List I with their defining physical descriptions in List II:",
        [
            ("Work function (phi_0)", "II", "Minimum energy required to liberate an electron from the metal surface with zero velocity", "The work function represents the binding energy of the most loosely bound conduction electrons to the metal lattice."),
            ("Threshold frequency (nu_0)", "III", "Minimum frequency of incident radiation below which no photoelectric emission takes place", "Photoemission requires photon energy h*nu >= phi_0, so nu_0 = phi_0 / h."),
            ("Stopping potential (V_0)", "IV", "Negative collector potential that reduces the photocurrent to zero", "At stopping potential, maximum kinetic energy of electrons equals the electrostatic work done: K_max = e * V_0."),
            ("Saturation photocurrent (I_sat)", "I", "Maximum current obtained when all photoelectrons emitted per second reach the anode", "Saturation current is directly proportional to the intensity of incident light for a given frequency."),
        ],
        "B"
    ))

    # Question 2: Dual Nature of Radiation (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_2",
        "Dual Nature of Radiation",
        "beginner",
        "Match the de Broglie wavelength expressions for particles with kinetic energy K or accelerating potential V in List I with their formula in List II:",
        [
            ("Electron accelerated from rest through potential difference V", "III", "lambda = 12.27 / sqrt(V) A = h / sqrt(2 m_e e V)", "For an electron, substituting h, m_e, e yields lambda = 1.227 / sqrt(V) nm = 12.27 / sqrt(V) A."),
            ("Proton accelerated from rest through potential difference V", "IV", "lambda = 0.286 / sqrt(V) A = h / sqrt(2 m_p e V)", "With proton mass m_p approx 1836 m_e, lambda_p = 0.286 / sqrt(V) A."),
            ("Alpha particle accelerated through potential difference V", "I", "lambda = 0.101 / sqrt(V) A = h / sqrt(8 m_p e V)", "With m_alpha = 4 m_p and q_alpha = 2 e, sqrt(2 m q) = sqrt(16 m_p e) = 4 sqrt(m_p e), giving lambda_alpha = 0.101 / sqrt(V) A."),
            ("Thermal neutron in equilibrium at absolute temperature T", "II", "lambda = h / sqrt(3 m_n k_B T)", "Average translational kinetic energy of thermal neutron is K = (3/2) k_B T, so p = sqrt(2 m_n (3/2 k_B T)) = sqrt(3 m_n k_B T)."),
        ],
        "C"
    ))

    # Question 3: Dual Nature of Radiation (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_3",
        "Dual Nature of Radiation",
        "beginner",
        "Match the observed photoelectric phenomena in List I with their physical significance in List II:",
        [
            ("Instantaneous emission (< 10^-9 s)", "IV", "Disproves classical wave theory where energy is absorbed continuously over the wavefront", "In classical theory, wavefront distributes energy continuously requiring hours, while in photon theory, absorption is a localized single collision."),
            ("Existence of threshold frequency", "I", "Demonstrates that radiation transfers energy in discrete packets (E = h*nu)", "If photon energy is less than phi_0, no electron can be liberated regardless of the wave intensity."),
            ("Linear variation of V_0 with frequency", "II", "Confirms Einstein's energy conservation equation e*V_0 = h*nu - phi_0", "The slope of V_0 vs nu is h/e, which is an invariant universal constant."),
            ("Photocurrent proportional to intensity", "III", "Reflects that number of emitted electrons is proportional to the incident photon arrival rate", "Intensity I = n*h*nu where n is photon flux; doubling intensity doubles the number of photons striking the plate per second."),
        ],
        "A"
    ))

    # Question 4: Dual Nature of Radiation (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_4",
        "Dual Nature of Radiation",
        "beginner",
        "Match the properties of a photon of frequency nu and wavelength lambda in List I with their expressions in List II:",
        [
            ("Energy of a single photon", "I", "E = h*nu = hc / lambda", "Energy of a quantum of light is proportional to frequency according to Planck."),
            ("Linear momentum of photon", "III", "p = h / lambda = h*nu / c", "According to de Broglie and relativistic energy-momentum relation E = pc for a massless particle."),
            ("Rest mass of photon", "IV", "Strictly zero", "Photons always travel at speed of light c in vacuum and have zero invariant rest mass."),
            ("Dynamic (effective) mass of photon", "II", "m = h*nu / c^2 = h / (c * lambda)", "From Einstein's mass-energy equivalence E = m c^2 = h*nu."),
        ],
        "D"
    ))

    # Question 5: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_5",
        "Dual Nature of Radiation",
        "intermediate",
        "Monochromatic light of wavelength lambda = 248 nm (photon energy hc/lambda = 5.0 eV) is incident on four different metals. Match each metal in List I with its maximum kinetic energy (K_max) and stopping potential (V_0) in List II:",
        [
            ("Metal A with work function phi_0 = 1.8 eV", "II", "K_max = 3.2 eV, V_0 = 3.2 V", "From Einstein's equation, K_max = E - phi_0 = 5.0 - 1.8 = 3.2 eV, hence V_0 = 3.2 V."),
            ("Metal B with work function phi_0 = 2.5 eV", "IV", "K_max = 2.5 eV, V_0 = 2.5 V", "K_max = 5.0 - 2.5 = 2.5 eV, so V_0 = 2.5 V."),
            ("Metal C with work function phi_0 = 3.7 eV", "I", "K_max = 1.3 eV, V_0 = 1.3 V", "K_max = 5.0 - 3.7 = 1.3 eV, so V_0 = 1.3 V."),
            ("Metal D with work function phi_0 = 4.4 eV", "III", "K_max = 0.6 eV, V_0 = 0.6 V", "K_max = 5.0 - 4.4 = 0.6 eV, so V_0 = 0.6 V."),
        ],
        "B"
    ))

    # Question 6: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_6",
        "Dual Nature of Radiation",
        "intermediate",
        "Match the graphical characteristics of the photoelectric effect in List I with their physical representations in List II:",
        [
            ("Slope of stopping potential V_0 versus frequency nu", "III", "h/e, a universal constant identical for all photosensitive metals", "Since V_0 = (h/e)*nu - phi_0/e, the slope is dV_0/dnu = h/e."),
            ("Intercept on the frequency axis of the V_0 vs nu graph", "I", "Threshold frequency nu_0 of the specific metal", "At V_0 = 0, nu = phi_0/h = nu_0."),
            ("Negative intercept on the potential axis of the V_0 vs nu graph", "IV", "-phi_0/e, directly proportional to the work function", "Extrapolating to nu = 0 gives V = -phi_0/e."),
            ("Slope of maximum kinetic energy K_max versus frequency nu", "II", "Planck's constant h", "Since K_max = h*nu - phi_0, the slope is dK_max/dnu = h."),
        ],
        "C"
    ))

    # Question 7: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_7",
        "Dual Nature of Radiation",
        "intermediate",
        "Match the pairs of particles and specified conditions in List I with the corresponding ratio of their de Broglie wavelengths in List II:",
        [
            ("Ratio lambda_p / lambda_alpha for proton and alpha particle with equal kinetic energy", "IV", "Ratio is 2", "lambda = h / sqrt(2 m K). With m_alpha = 4 m_p and K_p = K_alpha, lambda_p / lambda_alpha = sqrt(m_alpha / m_p) = sqrt(4) = 2."),
            ("Ratio lambda_e / lambda_p for electron and proton with equal linear momentum", "III", "Ratio is 1", "lambda = h/p. Since p_e = p_p, lambda_e / lambda_p = 1."),
            ("Ratio lambda_p / lambda_alpha for proton and alpha particle accelerated from rest through the same potential V", "II", "Ratio is 2*sqrt(2) approx 2.83", "lambda = h / sqrt(2 m q V). lambda_p / lambda_alpha = sqrt((m_alpha q_alpha)/(m_p q_p)) = sqrt(4 * 2) = sqrt(8) = 2*sqrt(2)."),
            ("Ratio lambda_1 / lambda_2 for a particle whose kinetic energy is increased to 9 times its initial value", "I", "Ratio is 3", "K_2 = 9 K_1 implies p_2 = 3 p_1 implies lambda_1 / lambda_2 = p_2 / p_1 = 3."),
        ],
        "A"
    ))

    # Question 8: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_8",
        "Dual Nature of Radiation",
        "intermediate",
        "A parallel beam of light of power P = 60 W falls on different surfaces in vacuum. Match the surface conditions in List I with the magnitude of the radiation force exerted on the surface in List II (c = 3 x 10^8 m/s):",
        [
            ("Perfectly absorbing surface at normal incidence", "II", "2.0 x 10^-7 N", "Force F = P/c = 60 / (3 x 10^8) = 2.0 x 10^-7 N."),
            ("Perfectly reflecting surface at normal incidence", "I", "4.0 x 10^-7 N", "Force F = 2P/c = 2 * 60 / (3 x 10^8) = 4.0 x 10^-7 N."),
            ("Surface with reflection coefficient r = 0.5 at normal incidence", "IV", "3.0 x 10^-7 N", "Force F = (1+r) P / c = 1.5 * 60 / (3 x 10^8) = 3.0 x 10^-7 N."),
            ("Perfectly reflecting surface at angle of incidence theta = 60 degrees", "III", "1.0 x 10^-7 N", "Force normal to surface is F = 2 P cos^2(60)/c = 2 P (1/4)/c = P / (2c) = 1.0 x 10^-7 N."),
        ],
        "D"
    ))

    # Question 9: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_9",
        "Dual Nature of Radiation",
        "intermediate",
        "Match the aspects of the Davisson-Germer electron diffraction experiment in List I with their descriptions and values in List II:",
        [
            ("Accelerating potential giving the most pronounced diffraction peak", "III", "54 V", "A distinct peak in the scattered electron intensity occurs at an accelerating voltage of 54 V."),
            ("Scattering angle phi between incident and scattered beam at peak", "II", "50 degrees", "The detector records a sharp maximum at a scattering angle of phi = 50 degrees."),
            ("Glancing angle theta with the Bragg crystal planes", "IV", "theta = 90 - phi/2 = 65 degrees", "The Bragg glancing angle is theta = 90 - 50/2 = 65 degrees."),
            ("de Broglie wavelength computed from accelerating potential", "I", "lambda = 12.27 / sqrt(54) A approx 1.67 A", "The de Broglie formula gives lambda = 1.67 A, matching Bragg's formula 2d sin(theta) = 2(0.91 A) sin(65) = 1.65 A."),
        ],
        "B"
    ))

    # Question 10: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_10",
        "Dual Nature of Radiation",
        "intermediate",
        "Match each light source of given power and wavelength in List I with the number of photons emitted per second in List II (h = 6.63 x 10^-34 J s, c = 3 x 10^8 m/s):",
        [
            ("Laser with power P = 3.315 mW and wavelength lambda = 600 nm", "I", "1.0 x 10^16 photons/s", "Energy per photon E = hc/lambda = (6.63e-34 * 3e8)/(600e-9) = 3.315e-19 J. Number of photons n = P/E = 3.315e-3 / 3.315e-19 = 1.0e16 s^-1."),
            ("Laser with power P = 6.63 mW and wavelength lambda = 500 nm", "IV", "1.67 x 10^16 photons/s", "Energy per photon E = (6.63e-34 * 3e8)/(500e-9) = 3.978e-19 J. Rate n = 6.63e-3 / 3.978e-19 approx 1.67e16 s^-1."),
            ("Laser with power P = 9.945 mW and wavelength lambda = 400 nm", "II", "2.0 x 10^16 photons/s", "Energy per photon E = (6.63e-34 * 3e8)/(400e-9) = 4.9725e-19 J. Rate n = 9.945e-3 / 4.9725e-19 = 2.0e16 s^-1."),
            ("Laser with power P = 19.89 mW and wavelength lambda = 300 nm", "III", "3.0 x 10^16 photons/s", "Energy per photon E = (6.63e-34 * 3e8)/(300e-9) = 6.63e-19 J. Rate n = 19.89e-3 / 6.63e-19 = 3.0e16 s^-1."),
        ],
        "C"
    ))

    # Question 11: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_11",
        "Dual Nature of Radiation",
        "intermediate",
        "Match the parameter variations in a photoelectric experiment in List I with their direct physical consequences in List II:",
        [
            ("Frequency of incident radiation is doubled while keeping intensity constant", "IV", "Stopping potential increases by more than a factor of 2, while saturation current decreases", "With constant intensity I = n*h*nu, doubling nu halves photon flux n, decreasing saturation current; e*V_2 = 2*h*nu - phi = 2*(e*V_1 + phi) - phi = 2*e*V_1 + phi > 2*e*V_1."),
            ("Intensity of incident radiation is doubled while keeping frequency constant", "II", "Saturation current doubles, while stopping potential remains strictly unchanged", "Saturation current is proportional to photon flux, which doubles with intensity, but V_0 depends only on nu."),
            ("Distance d of a small point light source from the cathode is doubled", "I", "Saturation current drops to one-fourth, while stopping potential remains unchanged", "By the inverse-square law, intensity on cathode becomes I/4, so saturation current is I_sat/4; frequency and hence V_0 are unaffected."),
            ("Cathode material is replaced with one having higher work function phi_0", "III", "Threshold frequency increases and stopping potential decreases for the same incident light", "Higher work function means higher nu_0 = phi_0/h and smaller maximum kinetic energy K_max = h*nu - phi_0."),
        ],
        "A"
    ))

    # Question 12: Dual Nature of Radiation (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_12",
        "Dual Nature of Radiation",
        "intermediate",
        "Match the particle relativistic conditions in List I with the relation for its de Broglie wavelength lambda in terms of rest mass m_0 and kinetic energy K in List II:",
        [
            ("Non-relativistic limit (K << m_0 c^2)", "II", "lambda = h / sqrt(2 m_0 K)", "In classical limit, p = sqrt(2 m_0 K), so lambda = h / sqrt(2 m_0 K)."),
            ("Particle with kinetic energy K = m_0 c^2", "IV", "lambda = h / (sqrt(3) m_0 c)", "Total energy E = K + m_0 c^2 = 2 m_0 c^2. Momentum p = (1/c) sqrt(E^2 - m_0^2 c^4) = sqrt(3) m_0 c, giving lambda = h / (sqrt(3) m_0 c)."),
            ("Particle with kinetic energy K = 3 m_0 c^2", "III", "lambda = h / (sqrt(15) m_0 c)", "Total energy E = 4 m_0 c^2. Momentum p = (1/c) sqrt(16 m_0^2 c^4 - m_0^2 c^4) = sqrt(15) m_0 c, so lambda = h / (sqrt(15) m_0 c)."),
            ("Ultra-relativistic limit (K >> m_0 c^2)", "I", "lambda approx h*c / K", "When K >> m_0 c^2, total energy E approx K approx p*c, hence p approx K/c and lambda approx hc/K."),
        ],
        "D"
    ))

    # Question 13: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_13",
        "Dual Nature of Radiation",
        "advanced",
        "Photoelectrons emitted with maximum kinetic energy K_max from a planar cathode enter a uniform transverse magnetic field B parallel to the plate. Match the parameters in List I with their expressions in List II:",
        [
            ("Radius of the circular trajectory of the fastest photoelectrons", "III", "R_max = sqrt(2 m_e K_max) / (e * B)", "Centripetal force e * v_max * B = m_e * v_max^2 / R, so R_max = m_e * v_max / (e * B) = sqrt(2 m_e K_max) / (e * B)."),
            ("Minimum magnetic field required to prevent photoelectrons from reaching a parallel anode at distance d", "IV", "B_min = sqrt(2 m_e K_max) / (e * d)", "To just miss the plate, the radius of the grazing orbit satisfies R_max <= d, giving B >= sqrt(2 m_e K_max) / (e * d)."),
            ("Time taken by the fastest electrons to return to the cathode", "II", "T_half = pi * m_e / (e * B)", "The electron executes a half-circle before striking back the cathode, taking time t = T/2 = pi * m_e / (e * B), independent of velocity."),
            ("Maximum magnetic Lorentz force acting on any emitted photoelectron", "I", "F_max = B * sqrt(2 e^2 K_max / m_e)", "F_max = e * v_max * B = e * sqrt(2 K_max / m_e) * B = B * sqrt(2 e^2 K_max / m_e)."),
        ],
        "B"
    ))

    # Question 14: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_14",
        "Dual Nature of Radiation",
        "advanced",
        "An isolated metal sphere of radius R and work function phi_0 is placed in vacuum and irradiated by monochromatic light of wavelength lambda (hc/lambda > phi_0). Match the electro-optical quantities in List I with their expressions in List II:",
        [
            ("Maximum electric potential attained by the sphere", "IV", "V_max = (1/e) * (hc/lambda - phi_0)", "Photoemission stops when the retarding electrostatic surface potential equals the stopping potential V_0."),
            ("Total positive charge accumulated on the sphere at cutoff", "III", "Q_max = [4*pi*epsilon_0*R / e] * (hc/lambda - phi_0)", "For an isolated conducting sphere, V_max = Q_max / (4 pi epsilon_0 R), hence Q_max = 4 pi epsilon_0 R V_max."),
            ("Total number of electrons ejected before photoemission ceases", "I", "N = [4*pi*epsilon_0*R / e^2] * (hc/lambda - phi_0)", "Total number of lost electrons is N = Q_max / e."),
            ("Effect of doubling the radius of the sphere", "II", "Potential V_max remains unchanged, while total accumulated charge doubles", "V_max depends solely on frequency and work function, whereas Q_max is proportional to R."),
        ],
        "C"
    ))

    # Question 15: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_15",
        "Dual Nature of Radiation",
        "advanced",
        "In Compton scattering, a photon of initial wavelength lambda_0 collides with a stationary free electron of rest mass m_e. Match each scattering angle theta or condition in List I with its resulting wavelength shift Delta lambda or kinetic energy in List II (where lambda_C = h / (m_e c) approx 0.0243 A):",
        [
            ("Scattering angle theta = 90 degrees", "II", "Delta lambda = lambda_C approx 0.0243 A", "The Compton formula gives Delta lambda = lambda_C (1 - cos 90) = lambda_C."),
            ("Scattering angle theta = 180 degrees (backscattering)", "I", "Delta lambda = 2*lambda_C approx 0.0485 A", "For theta = 180 degrees, Delta lambda = lambda_C (1 - (-1)) = 2 lambda_C, which is the maximum possible wavelength shift."),
            ("Scattering angle theta = 60 degrees", "III", "Delta lambda = 0.5*lambda_C approx 0.0121 A", "For theta = 60 degrees, Delta lambda = lambda_C (1 - cos 60) = lambda_C (1 - 0.5) = 0.5 lambda_C."),
            ("Kinetic energy acquired by recoil electron for theta = 180 degrees", "IV", "K_e = 2*h*c*lambda_C / [lambda_0 * (lambda_0 + 2*lambda_C)]", "By energy conservation, K_e = hc/lambda_0 - hc/(lambda_0 + 2 lambda_C) = 2 h c lambda_C / [lambda_0 (lambda_0 + 2 lambda_C)]."),
        ],
        "A"
    ))

    # Question 16: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_16",
        "Dual Nature of Radiation",
        "advanced",
        "Match the matter wave velocity concepts for a relativistic particle with energy E = hbar*omega = sqrt(p^2 c^2 + m_0^2 c^4) in List I with their expressions and properties in List II:",
        [
            ("Phase velocity of matter wave (v_p = omega / k)", "I", "v_p = c^2 / v > c", "Since omega = E/hbar and k = p/hbar, v_p = E/p = gamma m_0 c^2 / (gamma m_0 v) = c^2 / v, which exceeds the speed of light in vacuum."),
            ("Group velocity of matter wave (v_g = domega / dk)", "II", "v_g = dE/dp = v", "Differentiating E^2 = p^2 c^2 + m_0^2 c^4 gives 2E dE = 2p c^2 dp, so dE/dp = c^2 p / E = c^2 (gamma m_0 v) / (gamma m_0 c^2) = v."),
            ("Product of phase velocity and group velocity", "IV", "v_p * v_g = c^2", "v_p * v_g = (c^2 / v) * v = c^2."),
            ("Ratio v_g / v_p for a non-relativistic particle (E_k = p^2 / 2m)", "III", "v_g / v_p = 2", "In non-relativistic mechanics, v_p = E/p = (p^2 / 2m)/p = v/2, while v_g = dE/dp = p/m = v, hence v_g / v_p = 2."),
        ],
        "D"
    ))

    # Question 17: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_17",
        "Dual Nature of Radiation",
        "advanced",
        "A parallel beam of monochromatic light of intensity I, cross-sectional area A, and wavelength lambda is incident on a flat metal plate at angle of incidence theta. Match the physical quantities in List I with their expressions in List II:",
        [
            ("Number of photons striking the plate per second", "III", "N_ph = I * A * lambda / (h * c)", "Total power in the beam is P = I A. Since the entire beam is intercepted, photon arrival rate is P/E = (I A)/(hc/lambda) = I A lambda / (hc)."),
            ("Power incident per unit area of the plate surface", "I", "I_surface = I * cos(theta)", "The intercepted cross-sectional area spreads over surface area A / cos(theta), so surface intensity is I cos(theta)."),
            ("Saturation photocurrent for quantum efficiency eta", "IV", "i_sat = eta * e * I * A * lambda / (h * c)", "Photocurrent is i_sat = eta * e * N_ph = eta e I A lambda / (hc)."),
            ("Radiation force exerted on a perfectly absorbing plate", "II", "F = I * A / c in the direction of the incident beam", "Total beam momentum delivered per second is P/c = (I A)/c along the beam propagation vector."),
        ],
        "B"
    ))

    # Question 18: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_18",
        "Dual Nature of Radiation",
        "advanced",
        "In an electron microscope, electrons are accelerated by potential difference V. Match the microscope operational quantities in List I with their functional dependencies or values in List II:",
        [
            ("de Broglie wavelength for accelerating voltage V = 50 kV (non-relativistic approximation)", "II", "lambda approx 0.055 A = 5.5 pm", "lambda = 12.27 / sqrt(50000) A approx 12.27 / 223.6 approx 0.0549 A."),
            ("Functional dependence of limit of resolution d_min on accelerating potential V", "IV", "d_min proportional to V^(-1/2)", "By Abbe's criterion, d_min proportional to lambda proportional to 1/sqrt(V)."),
            ("Factor by which resolving power increases when V is quadrupled from 25 kV to 100 kV", "I", "Factor of 2", "Resolving power is 1/d_min proportional to sqrt(V). Quadrupling V doubles resolving power."),
            ("Ratio of resolving power using 50 kV electrons to an optical microscope using lambda = 5500 A", "III", "Approx 10^5 times greater", "Ratio is lambda_light / lambda_electron approx 5500 / 0.055 = 10^5."),
        ],
        "C"
    ))

    # Question 19: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_19",
        "Dual Nature of Radiation",
        "advanced",
        "A photocell is connected in series with a capacitor C and an illuminated metal surface of work function phi_0. When light of frequency nu > phi_0/h shines on it, match the steady-state electrical parameters in List I with their expressions in List II:",
        [
            ("Maximum potential difference across the capacitor", "IV", "V_C = (h*nu - phi_0) / e", "Electrons continue charging the capacitor until the potential barrier halts even the fastest photoelectrons, i.e., V_C = V_0 = (h*nu - phi_0)/e."),
            ("Maximum charge stored on the capacitor", "II", "Q_max = C * (h*nu - phi_0) / e", "From Q = C * V_C."),
            ("Electrostatic energy stored in the capacitor at equilibrium", "III", "U_E = C * (h*nu - phi_0)^2 / (2 * e^2)", "Energy stored is U = (1/2) C V_C^2 = C(h*nu - phi_0)^2 / (2 e^2)."),
            ("Ratio of stored energy if frequency is increased such that stopping potential is tripled", "I", "Increases by a factor of 9", "Since U is proportional to V_0^2, tripling the stopping potential increases the stored energy by 3^2 = 9."),
        ],
        "A"
    ))

    # Question 20: Dual Nature of Radiation (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_20",
        "Dual Nature of Radiation",
        "advanced",
        "A metal plate with work function phi_0 = 2.0 eV is simultaneously illuminated by two monochromatic light sources of wavelengths lambda_1 = 310 nm (E_1 = 4.0 eV) and lambda_2 = 620 nm (E_2 = 2.0 eV). Match the experimental observations in List I with their quantitative values in List II:",
        [
            ("Overall stopping potential V_0 required to completely reduce photocurrent to zero", "I", "2.0 V", "The stopping potential is determined by the most energetic photoelectrons produced by lambda_1: e * V_0 = E_1 - phi_0 = 4.0 - 2.0 = 2.0 eV, so V_0 = 2.0 V."),
            ("Maximum kinetic energy of photoelectrons expressed in Joules (1 eV = 1.6 x 10^-19 J)", "III", "3.2 x 10^-19 J", "K_max = 2.0 eV = 2.0 * 1.6e-19 = 3.2e-19 J."),
            ("Maximum speed of emitted photoelectrons (m_e = 9.1 x 10^-31 kg)", "II", "v_max approx 8.4 x 10^5 m/s", "v_max = sqrt(2 K_max / m_e) = sqrt(2 * 3.2e-19 / 9.1e-31) approx 8.38 x 10^5 m/s."),
            ("Maximum kinetic energy of photoelectrons emitted by source lambda_2", "IV", "0 eV (at threshold, emission with zero kinetic energy)", "For lambda_2, photon energy E_2 = 2.0 eV = phi_0, so photoelectrons are ejected with zero kinetic energy."),
        ],
        "D"
    ))

    # Question 21: Atoms and Nuclei (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_21",
        "Atoms and Nuclei",
        "beginner",
        "Match the physical quantities of an electron in the n-th Bohr orbit of a hydrogen-like atom of atomic number Z in List I with their proportionality in List II:",
        [
            ("Orbital radius r_n", "II", "Proportional to n^2 / Z", "r_n = epsilon_0 n^2 h^2 / (pi m Z e^2) proportional to n^2 / Z."),
            ("Orbital velocity v_n", "III", "Proportional to Z / n", "v_n = Z e^2 / (2 epsilon_0 n h) proportional to Z / n."),
            ("Total orbital energy E_n", "IV", "Proportional to -Z^2 / n^2", "E_n = -m Z^2 e^4 / (8 epsilon_0^2 n^2 h^2) proportional to -Z^2 / n^2."),
            ("Orbital angular momentum L_n", "I", "Proportional to n (independent of Z)", "Bohr's quantization postulate is L_n = n * h / (2 pi)."),
        ],
        "B"
    ))

    # Question 22: Atoms and Nuclei (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_22",
        "Atoms and Nuclei",
        "beginner",
        "Match the hydrogen spectral emission series in List I with the electromagnetic spectrum region in which they occur in List II:",
        [
            ("Lyman series (n_1 = 1, n_2 = 2, 3, ...)", "III", "Ultraviolet (UV) region", "Transitions to the ground state n=1 have energy >= 10.2 eV, corresponding to lambda <= 1216 A in the UV region."),
            ("Balmer series (n_1 = 2, n_2 = 3, 4, ...)", "IV", "Visible and near-ultraviolet region", "Transitions to n=2 have wavelengths from 6563 A to 3646 A, lying largely in the visible spectrum."),
            ("Paschen series (n_1 = 3, n_2 = 4, 5, ...)", "I", "Near-infrared (Near-IR) region", "Transitions to n=3 have wavelengths starting from 1875 nm in the near infrared."),
            ("Pfund series (n_1 = 5, n_2 = 6, 7, ...)", "II", "Far-infrared (Far-IR) region", "Transitions to n=5 have long wavelengths falling in the far infrared."),
        ],
        "C"
    ))

    # Question 23: Atoms and Nuclei (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_23",
        "Atoms and Nuclei",
        "beginner",
        "Match the nuclear terminology and properties in List I with their defining characteristics in List II:",
        [
            ("Nuclear radius R", "IV", "R = R_0 * A^(1/3) where R_0 approx 1.2 fm", "Nuclear volume is directly proportional to nucleon number A, so R is proportional to A^(1/3)."),
            ("Nuclear matter density rho", "I", "Roughly constant (~ 2.3 x 10^17 kg/m^3) for all nuclei", "Density rho = M / V = (A m_N) / [(4/3) pi R_0^3 A] = 3 m_N / (4 pi R_0^3), independent of mass number A."),
            ("Isotopes", "II", "Nuclides having identical atomic number Z but different mass numbers A", "They contain the same number of protons and exhibit identical chemical properties."),
            ("Isobars", "III", "Nuclides having identical mass number A but different atomic numbers Z", "They have the same total number of nucleons but belong to different chemical elements."),
        ],
        "A"
    ))

    # Question 24: Atoms and Nuclei (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_24",
        "Atoms and Nuclei",
        "beginner",
        "Match the radioactive decay relations in List I with their mathematical formulas in List II:",
        [
            ("Half-life T_half in terms of decay constant lambda", "I", "T_half = ln(2) / lambda approx 0.693 / lambda", "Time required for half of the initial radioactive nuclei to decay."),
            ("Mean lifetime tau in terms of decay constant lambda", "III", "tau = 1 / lambda = T_half / ln(2) approx 1.443 * T_half", "Average lifetime of a radioactive nucleus before decaying."),
            ("Sample activity A(t) at time t", "IV", "A(t) = lambda * N(t) = A_0 * e^(-lambda * t)", "Activity is the rate of nuclear disintegrations per second (-dN/dt)."),
            ("Fraction of nuclei remaining undecayed after n half-lives", "II", "N / N_0 = (1/2)^n = 2^(-n)", "Every half-life halves the remaining population of undecayed radioactive nuclei."),
        ],
        "D"
    ))

    # Question 25: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_25",
        "Atoms and Nuclei",
        "intermediate",
        "In Rutherford alpha scattering by a heavy nucleus of atomic number Z, match the scattering parameters in List I with their descriptions or dependencies in List II:",
        [
            ("Distance of closest approach r_0 for head-on collision (b=0)", "II", "r_0 = (1 / 4*pi*epsilon_0) * (2*Z*e^2 / K)", "All initial kinetic energy K converts into electrostatic potential energy at the turning point."),
            ("Dependence of r_0 on the kinetic energy K of alpha particle", "IV", "Inversely proportional to K (r_0 proportional to K^-1)", "Doubling the incident kinetic energy halves the distance of closest approach."),
            ("Differential scattering cross-section angular dependence dsigma/dOmega", "I", "Proportional to 1 / sin^4(theta / 2)", "Rutherford scattering formula predicts count rate falling steeply with scattering angle theta."),
            ("Impact parameter b for scattering angle theta = 180 degrees", "III", "b = 0", "A head-on collision has zero impact parameter, resulting in exact backward reflection."),
        ],
        "B"
    ))

    # Question 26: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_26",
        "Atoms and Nuclei",
        "intermediate",
        "Match the transitions in the hydrogen atom in List I with the emitted photon wavelength or energy in List II (Rydberg constant R approx 1.097 x 10^7 m^-1):",
        [
            ("First line of Lyman series (n=2 -> n=1, Lyman-alpha)", "III", "lambda = 4 / (3*R) approx 1216 A, Delta E = 10.2 eV", "1/lambda = R(1/1^2 - 1/2^2) = 3R/4, Delta E = 13.6(1 - 1/4) = 10.2 eV."),
            ("First line of Balmer series (n=3 -> n=2, H-alpha)", "I", "lambda = 36 / (5*R) approx 6563 A, Delta E = 1.89 eV", "1/lambda = R(1/4 - 1/9) = 5R/36, Delta E = 13.6(1/4 - 1/9) = 1.89 eV."),
            ("Series limit of Lyman series (n=infinity -> n=1)", "IV", "lambda = 1 / R approx 912 A, Delta E = 13.6 eV", "1/lambda = R(1 - 0) = R, Delta E = 13.6 eV."),
            ("Series limit of Balmer series (n=infinity -> n=2)", "II", "lambda = 4 / R approx 3646 A, Delta E = 3.4 eV", "1/lambda = R(1/4 - 0) = R/4, Delta E = 13.6/4 = 3.4 eV."),
        ],
        "C"
    ))

    # Question 27: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_27",
        "Atoms and Nuclei",
        "intermediate",
        "Match the energy quantities of an electron in orbit n of a hydrogen atom in List I with their relations and values in List II:",
        [
            ("Kinetic energy K_n", "IV", "K_n = -E_n = +13.6 / n^2 eV", "Kinetic energy is always positive and equals the magnitude of total energy."),
            ("Potential energy U_n", "III", "U_n = 2*E_n = -27.2 / n^2 eV", "By the virial theorem for 1/r electrostatic potential, U_n = 2 E_n = -2 K_n."),
            ("Total energy E_n", "II", "E_n = K_n + U_n = -13.6 / n^2 eV", "Negative bound state energy indicates stability of the atomic electron."),
            ("Change in kinetic and potential energy when transitioning from n=1 to n=2", "I", "Delta K = -10.2 eV and Delta U = +20.4 eV", "K_1 = 13.6, K_2 = 3.4 implies Delta K = -10.2 eV; U_1 = -27.2, U_2 = -6.8 implies Delta U = +20.4 eV."),
        ],
        "A"
    ))

    # Question 28: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_28",
        "Atoms and Nuclei",
        "intermediate",
        "Match the properties of single-electron hydrogen-like ions in List I with their values in List II (r_0 = 0.529 A is Bohr radius of hydrogen):",
        [
            ("Radius of the first Bohr orbit in He+ ion (Z=2)", "II", "r = r_0 / 2 approx 0.265 A", "Formula r_1 = r_0 / Z = 0.529 / 2 = 0.265 A."),
            ("Ionization energy of Li2+ ion (Z=3) from ground state", "I", "E = 13.6 x 3^2 = 122.4 eV", "Ionization energy is E_ion = 13.6 Z^2 = 13.6 * 9 = 122.4 eV."),
            ("Orbital speed of electron in first orbit of Be3+ ion (Z=4)", "IV", "v = 4*v_0 approx 8.76 x 10^6 m/s", "v_1 = Z v_0 = 4 * (2.19e6) = 8.76e6 m/s."),
            ("Ratio of orbital frequency of revolution f(He+, n=1) / f(H, n=1)", "III", "Ratio is 4", "Frequency of revolution f proportional to Z^2 / n^3. For Z=2 vs Z=1, ratio is 2^2 / 1^2 = 4."),
        ],
        "D"
    ))

    # Question 29: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_29",
        "Atoms and Nuclei",
        "intermediate",
        "Match the nuclear reactions and binding energy concepts in List I with their descriptions in List II:",
        [
            ("Mass defect Delta m of a nuclide (A, Z)X", "III", "Delta m = [Z*m_p + (A-Z)*m_n] - M_nucleus", "Difference between the sum of individual free nucleon masses and the actual bound nuclear mass."),
            ("Maximum of the binding energy per nucleon curve (A approx 56, Fe-56)", "II", "~ 8.75 MeV/nucleon, indicating maximum nuclear stability", "Nuclei near iron-56 have the highest binding energy per nucleon and cannot release energy via either fission or fusion."),
            ("Average energy released per fission of a U-235 nucleus", "IV", "approx 200 MeV", "Energy release arises because heavy nuclei (BE/A ~ 7.6 MeV) split into intermediate fragments (BE/A ~ 8.5 MeV)."),
            ("Energy released in D-T fusion (2H + 3H -> 4He + n)", "I", "approx 17.6 MeV", "Alpha particle receives 14.1 MeV and neutron carries away 3.5 MeV."),
        ],
        "B"
    ))

    # Question 30: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_30",
        "Atoms and Nuclei",
        "intermediate",
        "Match the nuclear radioactive decay modes in List I with their governing nuclear transformations in List II:",
        [
            ("Alpha (alpha) decay of parent (A, Z)X", "I", "Transforms to (A-4, Z-2)Y + alpha with monoenergetic alpha particles", "Loss of 2 protons and 2 neutrons; two-body decay yields discrete line spectrum."),
            ("Beta-minus (beta-) decay", "IV", "Neutron converts via n -> p + e^- + anti-nu_e, exhibiting continuous electron energy spectrum", "Three-body decay with antineutrino sharing the Q-value continuously."),
            ("Beta-plus (beta+) decay", "II", "Proton converts via p -> n + e^+ + nu_e inside proton-rich nucleus", "Accompanied by neutrino emission and reduction of atomic number Z by 1."),
            ("Gamma (gamma) decay", "III", "De-excitation from nuclear excited state emitting high-energy gamma photon without changing A or Z", "Nuclear isomer drops to a lower energy state by radiating a gamma ray photon."),
        ],
        "C"
    ))

    # Question 31: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_31",
        "Atoms and Nuclei",
        "intermediate",
        "In a radioactive series 1 -> 2 -> 3 (stable) with decay constants lambda_1 and lambda_2, match the decay conditions in List I with their mathematical consequences in List II:",
        [
            ("Secular equilibrium (lambda_1 << lambda_2, extremely long-lived parent)", "IV", "Activities become equal (A_1 = A_2), with population ratio N_2 / N_1 = lambda_1 / lambda_2", "Since dN_2/dt = lambda_1 N_1 - lambda_2 N_2 = 0, lambda_1 N_1 = lambda_2 N_2."),
            ("Time t_max at which daughter population N_2 reaches peak", "II", "t_max = ln(lambda_2 / lambda_1) / (lambda_2 - lambda_1)", "Setting dN_2/dt = 0 in the Bateman equation yields t_max."),
            ("Number of daughter nuclei when daughter is directly stable (lambda_2 = 0)", "I", "N_2(t) = N_1(0) * (1 - e^(-lambda_1 * t))", "Every decayed parent nucleus directly becomes a stable daughter nucleus."),
            ("Transient equilibrium (lambda_1 < lambda_2)", "III", "Daughter activity exceeds parent activity by constant factor lambda_2 / (lambda_2 - lambda_1)", "At long times, N_2(t) = [lambda_1 / (lambda_2 - lambda_1)] * N_1(t)."),
        ],
        "A"
    ))

    # Question 32: Atoms and Nuclei (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_32",
        "Atoms and Nuclei",
        "intermediate",
        "Match the radioactive sample conditions in List I with the corresponding time elapsed or ratio in List II:",
        [
            ("Sample activity drops to 12.5% of its initial activity", "II", "Time elapsed equals 3 half-lives (t = 3 * T_half)", "12.5% = 1/8 = (1/2)^3, which corresponds to exactly 3 half-lives."),
            ("Fraction of initial nuclei decayed during one mean life tau = 1 / lambda", "IV", "1 - e^(-1) approx 63.2%", "Undecayed fraction is e^(-lambda tau) = e^(-1) approx 0.368, so decayed fraction is 1 - 0.368 = 0.632."),
            ("Sample activity drops to 1% of initial activity", "III", "t = ln(100) / lambda approx 6.64 * T_half", "N/N_0 = 10^-2 implies lambda t = ln(100) approx 4.605 implies t = 4.605 / lambda approx 6.64 T_half."),
            ("Ratio of activities of two samples with equal initial nuclei, where T_1 = 2 h and T_2 = 4 h, after t = 4 h", "I", "Ratio A_1 / A_2 = 1", "N_1(4) = N_0/4, lambda_1 = ln(2)/2 implies A_1 = N_0 ln(2)/8. N_2(4) = N_0/2, lambda_2 = ln(2)/4 implies A_2 = N_0 ln(2)/8. Ratio is 1."),
        ],
        "D"
    ))

    # Question 33: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_33",
        "Atoms and Nuclei",
        "advanced",
        "When the finite mass M of the nucleus is taken into account, match the system in List I with its reduced mass and physical properties in List II:",
        [
            ("Reduced mass formula for an electron of mass m_e orbiting nucleus of mass M", "III", "mu = m_e * M / (m_e + M) = m_e / (1 + m_e / M)", "Two-body central force problem reduces to single particle of reduced mass mu."),
            ("Positronium atom (bound state of electron and positron, M = m_e)", "IV", "Reduced mass mu = m_e / 2, ground state binding energy is 6.8 eV", "Since mu = m_e / 2, all energy levels are halved compared to hydrogen: E_1 = -13.6 / 2 = -6.8 eV."),
            ("Muonic hydrogen (muon with mass m_mu approx 207 m_e orbiting a proton)", "II", "Bohr orbital radius is reduced by a factor of approx 186", "Reduced mass mu = (207 * 1836) / (207 + 1836) m_e approx 186 m_e. Radius r proportional to 1/mu shrinks by 186 times."),
            ("Rydberg constant correction for finite nuclear mass", "I", "R_M = R_infinity * [M / (m_e + M)]", "Since R proportional to mu, R_M = R_infinity (mu / m_e) = R_infinity * M / (m_e + M)."),
        ],
        "B"
    ))

    # Question 34: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_34",
        "Atoms and Nuclei",
        "advanced",
        "Match the nuclear recoil quantities in List I with their expressions in List II:",
        [
            ("Kinetic energy of alpha particle in alpha decay of stationary nucleus of mass number A", "IV", "K_alpha = [(A - 4) / A] * Q", "From momentum conservation p_D = p_alpha, K_alpha = [m_D / (m_D + m_alpha)] * Q = [(A-4)/A] * Q."),
            ("Recoil kinetic energy of daughter nucleus in alpha decay", "III", "K_D = (4 / A) * Q", "Daughter receives remaining energy: K_D = [m_alpha / (m_D + m_alpha)] * Q = (4/A) * Q."),
            ("Recoil kinetic energy of a nucleus of mass M emitting a gamma photon of energy E_0", "I", "K_recoil = E_0^2 / (2 * M * c^2)", "Photon momentum p = E_0 / c. Nucleus recoil kinetic energy is p^2 / (2M) = E_0^2 / (2 M c^2)."),
            ("Actual energy E_gamma of the emitted gamma photon", "II", "E_gamma = E_0 - E_0^2 / (2 * M * c^2)", "Conservation of energy requires E_0 = E_gamma + K_recoil approx E_gamma + E_0^2 / (2 M c^2)."),
        ],
        "C"
    ))

    # Question 35: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_35",
        "Atoms and Nuclei",
        "advanced",
        "Match the characteristics of continuous and characteristic X-ray spectra in List I with their formulas in List II:",
        [
            ("Duane-Hunt cutoff wavelength lambda_min for tube voltage V", "II", "lambda_min = hc / (eV) = 12400 / V(volts) A", "An electron converted entirely into a single bremsstrahlung photon yields lambda_min."),
            ("Moseley's law for K-alpha characteristic X-ray frequency", "I", "sqrt(nu) = a * (Z - 1)", "For K-alpha transition (n=2 -> n=1), screening constant is b=1 due to the single remaining 1s electron."),
            ("Wavelength of K-alpha X-ray line as a function of atomic number Z", "III", "1 / lambda_Kalpha = (3/4) * R * (Z - 1)^2", "1/lambda = R (Z-1)^2 (1/1^2 - 1/2^2) = (3/4) R (Z-1)^2."),
            ("Moseley's law for L-alpha line (n=3 -> n=2)", "IV", "sqrt(nu) = a' * (Z - 7.4)", "For L-shell transitions, shielding by inner K and L electrons yields screening constant b approx 7.4."),
        ],
        "A"
    ))

    # Question 36: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_36",
        "Atoms and Nuclei",
        "advanced",
        "In the thermal neutron fission of U-235 releasing approx 200 MeV, match the energy component in List I with its contribution in List II:",
        [
            ("Kinetic energy carried by the two main fission fragments", "I", "~ 168 MeV (approx 84% of total energy)", "The large Coulomb repulsion between the newly created fragment nuclei converts into massive fragment kinetic energy."),
            ("Kinetic energy carried by prompt fission neutrons", "II", "~ 5 MeV (average ~ 2 MeV per neutron)", "An average of 2.5 prompt neutrons are emitted per fission carrying approx 2 MeV each."),
            ("Energy carried by prompt and delayed gamma rays", "IV", "~ 15 MeV", "De-excitation of highly excited fission fragments emits both prompt and delayed gamma photons."),
            ("Energy carried away by antineutrinos from subsequent beta- decays", "III", "~ 12 MeV (unrecoverable as heat in reactor)", "Antineutrinos escape the reactor completely without interacting or contributing to thermal power."),
        ],
        "D"
    ))

    # Question 37: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_37",
        "Atoms and Nuclei",
        "advanced",
        "Match the nuclear fusion concepts in List I with their quantitative relations in List II:",
        [
            ("Proton-proton cycle net reaction in stars (4p -> 4He + 2e+ + 2nu_e + 2gamma)", "III", "Q = +26.7 MeV total energy released", "Mass difference between 4 protons and an alpha particle plus positrons corresponds to 26.7 MeV."),
            ("Height of Coulomb barrier between two colliding deuterons (R approx 2 fm)", "I", "V_C = e^2 / [4*pi*epsilon_0 * (2R)] approx 360 keV", "Electrostatic repulsion energy when two deuterons just touch at distance 2R."),
            ("Kinetic temperature required for fusion by quantum mechanical tunneling", "IV", "T ~ 1.5 x 10^7 K (core of the Sun)", "Wave nature of nucleons allows barrier penetration at energies ~ 10 keV, well below classical barrier."),
            ("Lawson criterion for D-T thermonuclear fusion power break-even", "II", "n * tau_E >= 1.5 x 10^20 s*m^-3 at T approx 10-20 keV", "Condition on plasma density n and confinement time tau_E for self-sustaining fusion."),
        ],
        "B"
    ))

    # Question 38: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_38",
        "Atoms and Nuclei",
        "advanced",
        "Match the spectral line broadening mechanisms in atomic physics in List I with their descriptions in List II:",
        [
            ("Natural linewidth from Heisenberg uncertainty principle (Delta E Delta t >= hbar/2)", "II", "Delta nu_nat approx 1 / (2*pi*tau), giving Delta lambda ~ 10^-4 A", "Finite radiative lifetime tau ~ 10^-8 s of excited states creates an intrinsic lower bound on spectral linewidth."),
            ("Doppler broadening due to thermal motion of emitting gas atoms", "IV", "Delta nu_D / nu_0 approx sqrt(8 * k_B * T * ln(2) / (M * c^2)) proportional to sqrt(T)", "Thermal Maxwellian velocity distribution shifts perceived frequencies via Doppler effect, scaling with sqrt(T)."),
            ("Pressure (collisional) broadening", "I", "Linewidth increases linearly with gas density and collision frequency", "Frequent collisions during radiative emission shorten effective coherent wave-train lifetime."),
            ("Recoil broadening in Mossbauer effect (unrecoiled emission)", "III", "Recoil momentum absorbed by entire crystal lattice, preserving natural linewidth", "Embedding nuclei in rigid crystal lattice eliminates recoil energy loss, allowing resonant gamma absorption."),
        ],
        "C"
    ))

    # Question 39: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_39",
        "Atoms and Nuclei",
        "advanced",
        "Match the magnetic dipole and Zeeman effect quantities in List I with their values and expressions in List II:",
        [
            ("Bohr magneton (mu_B) for electron orbital motion", "IV", "mu_B = e*hbar / (2*m_e) approx 9.274 x 10^-24 J/T", "Fundamental quantum of electronic magnetic dipole moment."),
            ("Nuclear magneton (mu_N)", "II", "mu_N = e*hbar / (2*m_p) approx 5.05 x 10^-27 J/T", "Nuclear magnetic moments are ~ 2000 times smaller than electronic moments due to large proton mass."),
            ("Normal Zeeman splitting of spectral line of frequency nu_0 in magnetic field B", "III", "Delta nu = e * B / (4 * pi * m_e)", "Spectral line splits into three components: nu_0 and nu_0 +/- Delta nu."),
            ("Larmor precession frequency of magnetic dipole in magnetic field B", "I", "omega_L = e * B / (2 * m_e)", "Torque tau = mu x B causes precession of angular momentum vector at Larmor frequency."),
        ],
        "A"
    ))

    # Question 40: Atoms and Nuclei (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_40",
        "Atoms and Nuclei",
        "advanced",
        "A radioisotope X decays simultaneously via two branching pathways: alpha decay with decay constant lambda_alpha and beta decay with decay constant lambda_beta. Match the composite decay quantities in List I with their expressions in List II:",
        [
            ("Total effective decay constant lambda_total", "I", "lambda_total = lambda_alpha + lambda_beta", "Total rate of disintegration is -dN/dt = (lambda_alpha + lambda_beta) N."),
            ("Total effective half-life T_total in terms of individual half-lives T_alpha and T_beta", "III", "T_total = T_alpha * T_beta / (T_alpha + T_beta)", "Since lambda_total = lambda_alpha + lambda_beta, ln(2)/T_total = ln(2)/T_alpha + ln(2)/T_beta."),
            ("Branching ratio (fraction) of decays that proceed via alpha emission", "II", "Fraction_alpha = lambda_alpha / (lambda_alpha + lambda_beta)", "Fraction of parent nuclei decaying by alpha mode is proportional to lambda_alpha."),
            ("Ratio of number of emitted alpha particles to beta particles at any elapsed time", "IV", "N_alpha(t) / N_beta(t) = lambda_alpha / lambda_beta", "At every instant, rate of alpha emission to beta emission is strictly lambda_alpha / lambda_beta."),
        ],
        "D"
    ))

    # Question 41: Semiconductor Devices (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_41",
        "Semiconductor Devices",
        "beginner",
        "Match the materials in List I with their forbidden energy band gap (E_g) characteristics at room temperature (300 K) in List II:",
        [
            ("Good conductor (e.g. Copper, Aluminum)", "II", "Valence and conduction bands overlap (E_g approx 0 eV)", "Conduction electrons can move freely under any electric field with no thermal activation required."),
            ("Insulator (e.g. Diamond)", "III", "Very wide band gap (E_g approx 5.4 eV)", "Thermal energy at room temperature (k_B T approx 0.026 eV) is far too small to bridge E_g > 3 eV."),
            ("Silicon crystal semiconductor", "IV", "Moderate band gap (E_g approx 1.1 eV)", "Moderate thermal excitation creates a usable number of electron-hole pairs."),
            ("Germanium crystal semiconductor", "I", "Moderate band gap (E_g approx 0.67 eV)", "Smaller band gap than silicon; higher intrinsic conductivity at room temperature."),
        ],
        "B"
    ))

    # Question 42: Semiconductor Devices (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_42",
        "Semiconductor Devices",
        "beginner",
        "Match the semiconductor types in List I with their majority charge carriers and properties in List II:",
        [
            ("Intrinsic semiconductor", "III", "Carrier densities are equal: n_e = n_h = n_i", "Thermally generated electrons in conduction band equal holes in valence band."),
            ("n-type extrinsic semiconductor", "IV", "Majority carriers are electrons (n_e >> n_h), doped with pentavalent donors", "Impurity atoms like P, As, Sb donate extra conduction electrons."),
            ("p-type extrinsic semiconductor", "I", "Majority carriers are holes (n_h >> n_e), doped with trivalent acceptors", "Impurity atoms like B, Al, In create vacant covalent bond positions (holes)."),
            ("Mass action law under thermal equilibrium", "II", "n_e * n_h = n_i^2, valid for both intrinsic and doped semiconductors", "Product of electron and hole concentrations is independent of doping level at a given temperature."),
        ],
        "C"
    ))

    # Question 43: Semiconductor Devices (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_43",
        "Semiconductor Devices",
        "beginner",
        "Match the basic two-input logic gates in List I with their Boolean operations in List II:",
        [
            ("AND gate", "IV", "Y = A * B (Output is 1 only when both inputs are 1)", "Logical conjunction; output is HIGH if and only if all inputs are HIGH."),
            ("OR gate", "I", "Y = A + B (Output is 1 if either or both inputs are 1)", "Logical disjunction; output is LOW only when all inputs are LOW."),
            ("NOT gate", "II", "Y = bar(A) (Output is the logical inversion of the single input)", "Inverter; changes 0 to 1 and 1 to 0."),
            ("NAND gate", "III", "Y = bar(A * B) (Universal gate; output is 0 only when both inputs are 1)", "Complement of AND gate; can be used to construct all other logic functions."),
        ],
        "A"
    ))

    # Question 44: Semiconductor Devices (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_44",
        "Semiconductor Devices",
        "beginner",
        "Match the p-n junction operating conditions in List I with their depletion layer behavior in List II:",
        [
            ("Unbiased p-n junction in equilibrium", "I", "Built-in potential barrier V_bi forms, with diffusion current balancing drift current", "Majority carrier diffusion establishes fixed donor/acceptor ion space charge."),
            ("Forward biased p-n junction (V > 0 applied to p-side)", "III", "Barrier height reduces to V_bi - V, depletion width narrows, and large diffusion current flows", "Applied field opposes built-in field, allowing majority carriers to cross junction easily."),
            ("Reverse biased p-n junction (V > 0 applied to n-side)", "IV", "Barrier height increases to V_bi + V, depletion width widens, and tiny minority drift current flows", "Applied field reinforces built-in field, shutting off majority carrier diffusion."),
            ("Depletion layer composition", "II", "Composed solely of unneutralized immobile ionized donor and acceptor ions, devoid of free carriers", "Free electrons and holes are swept away by the intense built-in electric field."),
        ],
        "D"
    ))

    # Question 45: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_45",
        "Semiconductor Devices",
        "intermediate",
        "Match the temperature dependence of electrical properties in List I with their physical descriptions in List II:",
        [
            ("Intrinsic carrier concentration n_i(T)", "II", "Increases exponentially as T^(3/2) * exp(-E_g / (2 * k_B * T))", "Rising temperature drastically boosts covalent bond rupture and electron-hole pair generation."),
            ("Temperature coefficient of resistance (TCR) for semiconductors", "IV", "Negative (alpha < 0), resistance decreases with increasing temperature", "Exponential surge in carrier density dominates over any reduction in carrier mobility."),
            ("Temperature coefficient of resistance (TCR) for pure metals", "I", "Positive (alpha > 0), resistance increases with increasing temperature", "Free carrier concentration is constant; increased lattice vibrations shorten mean relaxation time."),
            ("Extrinsic semiconductor in exhaustion (saturation) region", "III", "Carrier density remains roughly constant equal to dopant density N_D or N_A", "All dopant impurity atoms are already ionized, while intrinsic excitation is still negligible."),
        ],
        "B"
    ))

    # Question 46: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_46",
        "Semiconductor Devices",
        "intermediate",
        "Match the transport quantities in semiconductor physics in List I with their formulas and relations in List II:",
        [
            ("Total electrical conductivity sigma of a semiconductor", "III", "sigma = e * (n_e * mu_e + n_h * mu_h)", "Both conduction electrons and valence holes contribute additively to total current."),
            ("Mobility comparison between electrons mu_e and holes mu_h", "I", "mu_e > mu_h because electrons in conduction band have lower effective mass than holes", "Conduction band curvature is sharper than valence band, giving electrons higher mobility."),
            ("Einstein relation connecting diffusion constant D and mobility mu", "IV", "D_e / mu_e = D_h / mu_h = k_B * T / e", "Fundamental thermodynamic relationship between thermal diffusion and field drift."),
            ("Drift current density J in electric field E", "II", "vec(J) = sigma * vec(E) = e * (n_e * mu_e + n_h * mu_h) * vec(E)", "Ohm's law in point form for semiconductor transport."),
        ],
        "C"
    ))

    # Question 47: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_47",
        "Semiconductor Devices",
        "intermediate",
        "Match the rectifier circuits and parameters in List I with their quantitative characteristics in List II (for input AC frequency f):",
        [
            ("Maximum theoretical efficiency of half-wave rectifier", "IV", "40.6%", "eta_max = 0.406 / (1 + r_f/R_L) <= 40.6%."),
            ("Maximum theoretical efficiency of full-wave rectifier", "III", "81.2%", "eta_max = 0.812 / (1 + r_f/R_L) <= 81.2%, double that of a half-wave rectifier."),
            ("Output ripple frequency of full-wave rectifier", "II", "2f", "Output pulses twice every full AC cycle, so ripple frequency is 2f."),
            ("Ripple factor gamma of half-wave rectifier", "I", "1.21", "Ripple factor gamma = sqrt((I_rms / I_dc)^2 - 1) = sqrt((pi/2)^2 - 1) approx 1.21."),
        ],
        "A"
    ))

    # Question 48: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_48",
        "Semiconductor Devices",
        "intermediate",
        "Match the Zener diode features and breakdown mechanisms in List I with their descriptions in List II:",
        [
            ("Zener breakdown mechanism (V_Z < 6 V)", "II", "Direct quantum mechanical tunneling of valence electrons across narrow depletion region", "Occurs in heavily doped junctions where electric field exceeds 10^6 V/m."),
            ("Avalanche breakdown mechanism (V_Z > 6 V)", "I", "Impact ionization by accelerated minority carriers dislodging secondary electron-hole pairs", "Occurs in lightly doped junctions with wider depletion regions."),
            ("Temperature coefficient of breakdown voltage", "IV", "Negative for Zener breakdown, positive for Avalanche breakdown", "Tunneling improves with temperature (narrowing band gap), while mean free path decreases for avalanche."),
            ("Zener diode as a voltage regulator", "III", "Operates in reverse breakdown where voltage remains constant over wide variations in current", "Diode maintains constant terminal voltage V_Z while absorbing source current fluctuations."),
        ],
        "D"
    ))

    # Question 49: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_49",
        "Semiconductor Devices",
        "intermediate",
        "Match the optoelectronic semiconductor devices in List I with their operating principles in List II:",
        [
            ("Photodiode", "III", "Operated in reverse bias; incoming photons generate electron-hole pairs in depletion region", "Reverse leakage current changes proportionately with optical illumination intensity."),
            ("Light Emitting Diode (LED)", "II", "Operated in forward bias; electrons and holes recombine radiatively emitting photons with h*nu approx E_g", "Spontaneous photon emission from direct band gap semiconductors like GaAs."),
            ("Solar Cell", "IV", "Unbiased photovoltaic device generating open-circuit voltage V_oc under sunlight", "Internal built-in field separates photo-generated electron-hole pairs to create external voltage."),
            ("Optocoupler / Optoisolator", "I", "Combines an LED and a photodetector in one package for electrical isolation", "Transfers electrical signals between two isolated circuits using light waves."),
        ],
        "B"
    ))

    # Question 50: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_50",
        "Semiconductor Devices",
        "intermediate",
        "Match the Boolean algebra identities and gate equivalences in List I with their expressions in List II:",
        [
            ("First De Morgan's Law", "I", "bar(A + B) = bar(A) * bar(B) (NOR is equivalent to bubbled AND)", "Complement of an OR operation is the AND of individual complements."),
            ("Second De Morgan's Law", "IV", "bar(A * B) = bar(A) + bar(B) (NAND is equivalent to bubbled OR)", "Complement of an AND operation is the OR of individual complements."),
            ("Exclusive-OR (XOR) Boolean function", "II", "Y = A xor B = bar(A)*B + A*bar(B) (Output is 1 when inputs differ)", "Gives HIGH output if and only if one input is 1 and the other is 0."),
            ("Exclusive-NOR (XNOR) Boolean function", "III", "Y = bar(A xor B) = A*B + bar(A)*bar(B) (Output is 1 when inputs match)", "Equivalence gate; gives HIGH output when both inputs are identical."),
        ],
        "C"
    ))

    # Question 51: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_51",
        "Semiconductor Devices",
        "intermediate",
        "Match the rectifier configurations in List I with the Peak Inverse Voltage (PIV) across each diode in List II (V_m is peak secondary AC voltage):",
        [
            ("Half-wave rectifier with resistive load only", "IV", "PIV = V_m across single non-conducting diode during negative half-cycle", "During negative half-cycle, maximum reverse voltage across the single diode is V_m."),
            ("Center-tapped full-wave rectifier", "II", "PIV = 2 * V_m across non-conducting diode due to full secondary winding voltage", "When one diode conducts, the non-conducting diode experiences the full secondary peak voltage 2 V_m."),
            ("Full-wave bridge rectifier", "I", "PIV = V_m across each diode with two diodes conducting in series per half-cycle", "Each non-conducting diode experiences only one peak transformer voltage V_m."),
            ("Half-wave rectifier with shunt capacitor filter", "III", "PIV = 2 * V_m because capacitor holds peak voltage while AC input swings negative", "Capacitor charges to +V_m; during negative peak, total reverse voltage is V_m - (-V_m) = 2 V_m."),
        ],
        "A"
    ))

    # Question 52: Semiconductor Devices (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_52",
        "Semiconductor Devices",
        "intermediate",
        "Match the junction current and resistance quantities in List I with their physical descriptions in List II:",
        [
            ("Diffusion current in a p-n junction", "II", "Flows from p-side to n-side, driven by concentration gradients of majority carriers", "Holes diffuse from p to n, electrons diffuse from n to p, both producing net current from p to n."),
            ("Drift current in a p-n junction", "IV", "Flows from n-side to p-side, driven by built-in electric field sweeping minority carriers", "Minority electrons in p-region and minority holes in n-region are swept across junction."),
            ("Dynamic (AC) resistance r_d of a forward biased diode", "III", "r_d = dV / dI = eta * k_B * T / (e * I) = 26 mV / I at room temperature", "Slope of forward V-I characteristic curve at the operating Q-point."),
            ("Static (DC) resistance R_DC of a diode", "I", "R_DC = V / I at a specific operating voltage and current", "Ratio of total DC voltage across the diode to DC current flowing through it."),
        ],
        "D"
    ))

    # Question 53: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_53",
        "Semiconductor Devices",
        "advanced",
        "A Zener diode voltage regulator has V_Z = 10 V, minimum Zener current I_Z,min = 5 mA, and load resistance R_L = 1000 Omega. The unregulated DC input varies from 15 V to 25 V. For a series resistor R_S = 250 Omega, match the circuit quantities in List I with their values in List II:",
        [
            ("Constant load current I_L through R_L", "III", "I_L = 10 mA", "I_L = V_Z / R_L = 10 V / 1000 Omega = 10 mA."),
            ("Total source current I_S at minimum input voltage V_in = 15 V", "IV", "I_S = 20 mA", "I_S = (V_in - V_Z) / R_S = (15 - 10) / 250 = 5 / 250 = 20 mA."),
            ("Zener current I_Z at maximum input voltage V_in = 25 V", "II", "I_Z = 50 mA", "I_S = (25 - 10) / 250 = 15 / 250 = 60 mA. Zener current I_Z = I_S - I_L = 60 - 10 = 50 mA."),
            ("Maximum power dissipated in the Zener diode", "I", "P_Z,max = 0.5 W = 500 mW", "P_Z,max = V_Z * I_Z,max = 10 V * 50 mA = 500 mW = 0.5 W."),
        ],
        "B"
    ))

    # Question 54: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_54",
        "Semiconductor Devices",
        "advanced",
        "Match the diode capacitance and high-frequency effects in List I with their characteristics in List II:",
        [
            ("Transition (depletion layer) capacitance C_T under reverse bias", "IV", "C_T = epsilon * A / W proportional to (V_bi + V_R)^(-1/2) for abrupt junction", "Depletion layer acts as a parallel plate capacitor whose width W widens with reverse voltage."),
            ("Diffusion capacitance C_D under forward bias", "III", "C_D = tau_T * I_D / (eta * V_T) proportional to I_D", "Arises from storage of minority carriers near the junction edges during forward conduction."),
            ("Reverse recovery time t_rr of a p-n diode", "I", "Time required for stored minority carriers to be removed when switching from forward to reverse bias", "Limits the maximum switching frequency of p-n junction diodes in fast pulse circuits."),
            ("Varactor (Varicap) diode", "II", "Operated in reverse bias to utilize voltage-variable depletion capacitance C_T(V_R)", "Used as voltage-controlled tuning element in RF resonant LC tank circuits."),
        ],
        "C"
    ))

    # Question 55: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_55",
        "Semiconductor Devices",
        "advanced",
        "Match the Boolean expressions in List I with their simplified minimal forms in List II:",
        [
            ("Expression Y_1 = A * B + A * bar(B)", "II", "Y = A", "Y_1 = A(B + bar(B)) = A(1) = A."),
            ("Expression Y_2 = A + bar(A) * B", "I", "Y = A + B", "By distributive law, A + bar(A) B = (A + bar(A))(A + B) = 1 * (A + B) = A + B."),
            ("Expression Y_3 = A * (bar(A) + B)", "III", "Y = A * B", "Y_3 = A * bar(A) + A * B = 0 + A * B = A * B."),
            ("Expression Y_4 = bar(A)*bar(B) + bar(A)*B + A*B", "IV", "Y = bar(A) + B", "bar(A)(bar(B) + B) + A*B = bar(A) + A*B = bar(A) + B."),
        ],
        "A"
    ))

    # Question 56: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_56",
        "Semiconductor Devices",
        "advanced",
        "Match the logic gate implementations using only universal gates in List I with the minimum number of gates required in List II:",
        [
            ("NOT gate implemented using 2-input NAND gates", "I", "Exactly 1 NAND gate", "Connecting both inputs together: Y = bar(A * A) = bar(A)."),
            ("OR gate implemented using 2-input NOR gates", "II", "Exactly 2 NOR gates", "Connect inputs to first NOR gate to get bar(A+B), then feed both inputs of second NOR gate to invert: bar(bar(A+B)) = A+B."),
            ("XOR gate implemented using 2-input NAND gates", "IV", "Exactly 4 NAND gates", "Classic 4-NAND configuration produces A*bar(B) + bar(A)*B."),
            ("AND gate implemented using 2-input NOR gates", "III", "Exactly 3 NOR gates", "Invert inputs using 2 NOR gates, then feed to third NOR: bar(bar(A) + bar(B)) = A * B."),
        ],
        "D"
    ))

    # Question 57: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_57",
        "Semiconductor Devices",
        "advanced",
        "Match the bipolar junction transistor (BJT) current gain relationships in List I with their formulas in List II:",
        [
            ("Common-base current amplification factor alpha", "III", "alpha = Delta I_C / Delta I_E (always slightly less than 1, 0.95 - 0.995)", "Fraction of emitter carriers that successfully cross the base into collector."),
            ("Common-emitter current amplification factor beta", "I", "beta = Delta I_C / Delta I_B = alpha / (1 - alpha) (typically 20 - 300)", "Ratio of collector current change to base current change."),
            ("Relationship between emitter, base, and collector currents", "IV", "I_E = I_B + I_C", "By Kirchhoff's current law applied to the entire transistor."),
            ("Phase relationship between input and output AC voltage in CE amplifier", "II", "180 degrees phase inversion (out of phase)", "An increase in base voltage increases collector current, pulling collector voltage downward."),
        ],
        "B"
    ))

    # Question 58: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_58",
        "Semiconductor Devices",
        "advanced",
        "Match the solar cell photovoltaic parameters in List I with their definitions and relations in List II:",
        [
            ("Open-circuit voltage V_oc", "II", "V_oc = (eta * k_B * T / e) * ln(I_sc / I_0 + 1)", "Maximum voltage across the cell terminals when output current is zero."),
            ("Short-circuit current I_sc", "IV", "Current when terminal voltage is zero, directly proportional to incident light intensity", "Total photogenerated current collected under zero load resistance."),
            ("Fill Factor (FF) of a solar cell", "I", "FF = V_m * I_m / (V_oc * I_sc) (measure of squareness of V-I curve)", "Ratio of maximum usable electrical power output to theoretical maximum product V_oc * I_sc."),
            ("Power conversion efficiency eta", "III", "eta = P_max / P_incident = FF * V_oc * I_sc / P_incident", "Fraction of total incident light power converted into electrical power."),
        ],
        "C"
    ))

    # Question 59: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_59",
        "Semiconductor Devices",
        "advanced",
        "Match the diode clipping and clamping wave-shaping circuits in List I with their output wave behavior in List II (assuming diodes with 0.7 V drop):",
        [
            ("Positive shunt clipper with diode anode connected to ground", "IV", "Clips off all positive input voltages above +0.7 V, passing negative half-cycle intact", "Diode turns ON when input exceeds +0.7 V, holding output clamped to +0.7 V."),
            ("Negative shunt clipper with diode cathode connected to ground", "II", "Clips off all negative input voltages below -0.7 V, passing positive half-cycle intact", "Diode turns ON during negative half-cycle when input drops below -0.7 V."),
            ("Positive clamper circuit (series capacitor and shunt diode with cathode at input)", "III", "Shifts entire AC waveform upwards such that its negative peak rests near 0 V", "Capacitor charges to peak voltage V_m during first negative half-cycle, adding a +V_m DC offset."),
            ("Biased clipper with series reference battery V_B = +5 V", "I", "Limits output signal at +5.7 V while passing all lower potentials unchanged", "Diode conducts only when input voltage exceeds the combined barrier V_B + V_D = 5.7 V."),
        ],
        "A"
    ))

    # Question 60: Semiconductor Devices (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_60",
        "Semiconductor Devices",
        "advanced",
        "Match the semiconductor band structure conditions in List I with the position and behavior of the Fermi energy level E_F in List II:",
        [
            ("Intrinsic semiconductor at absolute zero (T = 0 K)", "I", "Lies exactly in the middle of the forbidden band gap [E_F = (E_c + E_v)/2]", "Symmetric distribution of states in conduction and valence bands places E_F at midgap."),
            ("n-type semiconductor with donor concentration N_D at moderate temperature", "III", "Lies close to the conduction band edge [E_c - E_F = k_B * T * ln(N_c / N_D)]", "Donor electrons populate states just below E_c, shifting E_F upward towards E_c."),
            ("p-type semiconductor with acceptor concentration N_A at moderate temperature", "II", "Lies close to the valence band edge [E_F - E_v = k_B * T * ln(N_v / N_A)]", "Acceptor states near E_v shift the chemical potential downward towards E_v."),
            ("Degenerate n-type semiconductor with extremely heavy doping (N_D > N_c)", "IV", "Lies inside the conduction band (E_F > E_c), exhibiting metallic conductivity", "Donor states merge into conduction band and Fermi level enters conduction band."),
        ],
        "D"
    ))

    # Question 61: Communication Systems (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_61",
        "Communication Systems",
        "beginner",
        "Match the basic functional blocks of a communication system in List I with their roles in List II:",
        [
            ("Transmitter", "II", "Processes and modulates the message signal into a form suitable for transmission", "Includes message transducer, modulator, and power amplifier."),
            ("Communication Channel", "III", "The physical transmission medium connecting transmitter and receiver", "Can be guided (cables, optical fibers) or unguided (free space atmosphere)."),
            ("Receiver", "IV", "Extracts, demodulates, and reconstructs the original information signal", "Performs amplification, filtering, demodulation, and decoding."),
            ("Transducer", "I", "Converts a non-electrical physical message into an electrical signal or vice versa", "Essential at both input (microphone) and output (loudspeaker) terminals."),
        ],
        "B"
    ))

    # Question 62: Communication Systems (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_62",
        "Communication Systems",
        "beginner",
        "Match the communication terms and transmission modes in List I with their definitions in List II:",
        [
            ("Point-to-point communication mode", "III", "Communication takes place over a link between a single dedicated transmitter and receiver", "Only the intended receiver captures the message (e.g. telephony)."),
            ("Broadcast communication mode", "IV", "A single powerful transmitter broadcasts signals to a large number of dispersed receivers", "Information is transmitted indiscriminately across the service area (e.g. Radio, TV)."),
            ("Attenuation", "I", "The gradual loss of signal power or strength as it propagates through the channel", "Must be countered by repeaters and amplifiers along the transmission path."),
            ("Noise", "II", "Unwanted random electrical disturbances that corrupt and obscure the message signal", "Limits the maximum achievable information capacity and fidelity."),
        ],
        "C"
    ))

    # Question 63: Communication Systems (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_63",
        "Communication Systems",
        "beginner",
        "Match the electromagnetic wave propagation modes in List I with their operational frequency ranges and features in List II:",
        [
            ("Ground (surface) wave propagation", "IV", "Frequencies < 2 MHz; waves glide along Earth's surface and attenuate due to ground conductivity", "Subject to severe tilt and energy absorption by the conducting Earth at higher frequencies."),
            ("Sky wave propagation", "I", "Frequencies 2 MHz - 30 MHz; total internal reflection by ionospheric layers", "Enables long-distance international shortwave radio communication."),
            ("Space wave (Line-of-Sight) propagation", "II", "Frequencies > 30 MHz; direct waves traveling along line-of-sight path in troposphere", "Used for FM radio, television broadcasting, radar, and satellite links."),
            ("Satellite communication link", "III", "Frequencies > 1 GHz; transponder receives uplink signal and retransmits downlink", "Overcomes Earth's curvature, providing continental and global coverage."),
        ],
        "A"
    ))

    # Question 64: Communication Systems (beginner)
    qs.append(make_matrix_q(
        f"{prefix}_64",
        "Communication Systems",
        "beginner",
        "Match the fundamental justifications for carrier modulation in List I with their physical explanations in List II:",
        [
            ("Practical antenna size requirement", "I", "Antenna length must be comparable to lambda/4; high carrier frequency reduces antenna size", "For 15 kHz audio, lambda = 20 km (L = 5 km), whereas for 1 MHz, lambda = 300 m (L = 75 m)."),
            ("Effective radiated power by antenna", "III", "Radiated power scales as P proportional to (L/lambda)^2; high frequency boosts radiation efficiency", "Low frequency audio radiates almost zero electromagnetic power into space."),
            ("Prevention of signal mixing and interference", "IV", "Multiplexing assigns distinct frequency bands to different transmitting stations", "Without modulation, all audio signals in 20 Hz - 20 kHz would collide and superimpose inextricably."),
            ("Modulation index definition", "II", "Ratio of modulating message amplitude to carrier amplitude (mu = A_m / A_c)", "Determines the depth of modulation and power distribution in sidebands."),
        ],
        "D"
    ))

    # Question 65: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_65",
        "Communication Systems",
        "intermediate",
        "Match the transmitter and receiver antenna height configurations on Earth (R = 6400 km) in List I with the maximum Line-of-Sight distance in List II:",
        [
            ("Transmitting antenna of height h_T = 32 m with receiver at ground level (h_R = 0)", "II", "d approx 20.2 km", "d = sqrt(2 R h_T) = sqrt(2 * 6.4e6 * 32) = sqrt(4.096e8) = 2.024e4 m approx 20.2 km."),
            ("Transmitting antenna h_T = 50 m and receiving antenna h_R = 50 m", "IV", "d_max approx 50.6 km", "d_T = d_R = sqrt(2 * 6.4e6 * 50) = sqrt(6.4e8) approx 25.3 km. Total d_max = 2 * 25.3 = 50.6 km."),
            ("Transmitting antenna h_T = 72 m with receiver at ground level (h_R = 0)", "I", "d approx 30.4 km", "d = sqrt(2 * 6.4e6 * 72) = sqrt(9.216e8) = 3.036e4 m approx 30.4 km."),
            ("Transmitting antenna h_T = 128 m with receiver at ground level (h_R = 0)", "III", "d approx 40.5 km", "d = sqrt(2 * 6.4e6 * 128) = sqrt(1.6384e9) = 4.048e4 m approx 40.5 km."),
        ],
        "B"
    ))

    # Question 66: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_66",
        "Communication Systems",
        "intermediate",
        "Match the modulation index mu = A_m / A_c conditions in Amplitude Modulation in List I with their envelope characteristics in List II:",
        [
            ("Under-modulation (0 < mu < 1)", "III", "Modulated envelope never reaches zero (A_min > 0); envelope detector reconstructs audio cleanly", "Ideal operating condition for broadcast AM without distortion."),
            ("Critical modulation (mu = 1)", "I", "Envelope reaches zero momentarily at trough (A_min = 0), giving 100% modulation depth", "Maximum distortion-free power transfer into sidebands."),
            ("Over-modulation (mu > 1)", "IV", "Envelope crosses zero line causing phase reversal and envelope distortion with splatter noise", "Simple diode detector cannot follow clipped envelope, generating severe harmonic distortion."),
            ("Modulation index in terms of envelope extremes", "II", "mu = (A_max - A_min) / (A_max + A_min)", "Since A_max = A_c(1 + mu) and A_min = A_c(1 - mu)."),
        ],
        "C"
    ))

    # Question 67: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_67",
        "Communication Systems",
        "intermediate",
        "An AM transmitter has carrier frequency f_c = 1000 kHz modulated by an audio tone of frequency f_m = 5 kHz. Match the spectral quantities in List I with their frequency values in List II:",
        [
            ("Upper Sideband (USB) frequency", "IV", "1005 kHz", "f_USB = f_c + f_m = 1000 + 5 = 1005 kHz."),
            ("Lower Sideband (LSB) frequency", "III", "995 kHz", "f_LSB = f_c - f_m = 1000 - 5 = 995 kHz."),
            ("Transmission channel bandwidth required", "II", "10 kHz", "Bandwidth = 2 * f_m = 2 * 5 = 10 kHz."),
            ("Carrier wave frequency component", "I", "1000 kHz", "Carrier frequency f_c remains unchanged in frequency during amplitude modulation."),
        ],
        "A"
    ))

    # Question 68: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_68",
        "Communication Systems",
        "intermediate",
        "An unmodulated carrier has power P_c = 10 kW. Match the modulation conditions in List I with the total transmitted power P_t in List II:",
        [
            ("Modulation index mu = 0 (unmodulated carrier)", "II", "P_t = 10.0 kW", "P_t = P_c (1 + 0) = 10.0 kW."),
            ("Modulation index mu = 0.5 (50% modulation)", "I", "P_t = 11.25 kW", "P_t = P_c(1 + mu^2/2) = 10(1 + 0.25/2) = 10 * 1.125 = 11.25 kW."),
            ("Modulation index mu = 1.0 (100% modulation)", "IV", "P_t = 15.0 kW", "P_t = P_c(1 + 1/2) = 10 * 1.5 = 15.0 kW."),
            ("Total power contained in both sidebands at mu = 1.0", "III", "P_sidebands = 5.0 kW", "P_sidebands = P_t - P_c = 15.0 - 10.0 = 5.0 kW."),
        ],
        "D"
    ))

    # Question 69: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_69",
        "Communication Systems",
        "intermediate",
        "Match the ionospheric radio wave propagation parameters in List I with their formulas and descriptions in List II:",
        [
            ("Critical frequency f_c for normal incidence onto ionospheric layer of peak electron density N_max", "III", "f_c = 9 * sqrt(N_max) (in SI units)", "Refractive index mu = sqrt(1 - 81*N/f^2) drops to 0 at critical frequency f_c."),
            ("Maximum Usable Frequency (MUF) for oblique incidence at angle theta_i", "II", "f_MUF = f_c * sec(theta_i) = f_c / cos(theta_i)", "Follows from Snell's law; oblique waves reflect at frequencies significantly higher than f_c."),
            ("Skip distance d_skip", "IV", "Minimum ground distance from transmitter beyond which sky wave returns to Earth", "Inside the skip zone, ground wave has died out and sky wave cannot return, resulting in a dead zone."),
            ("Condition for sky wave to penetrate through the ionosphere into outer space", "I", "Signal frequency exceeds MUF (f > f_MUF)", "Refractive index remains real and >0 throughout the layer, allowing wave to pass through."),
        ],
        "B"
    ))

    # Question 70: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_70",
        "Communication Systems",
        "intermediate",
        "Match the communication signals in List I with their typical required bandwidth in List II:",
        [
            ("Standard speech (telephony) signal", "I", "approx 3.1 kHz (frequency range 300 Hz - 3400 Hz)", "Sufficient for clear voice intelligibility across telephone lines."),
            ("High-fidelity music audio signal", "IV", "approx 20 kHz (frequency range 20 Hz - 20 kHz)", "Encompasses full range of human acoustic perception."),
            ("Composite video and audio signal for standard TV channel", "II", "approx 6 MHz", "Includes video luminance, chrominance, sound subcarrier, and guard bands."),
            ("Single optical fiber channel transmission capacity", "III", "Exceeds 100 GHz (up to multiple THz via WDM)", "Extremely high carrier frequency (~ 2 x 10^14 Hz) offers enormous informational bandwidth."),
        ],
        "C"
    ))

    # Question 71: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_71",
        "Communication Systems",
        "intermediate",
        "In an AM diode envelope detector circuit with load resistance R and shunt capacitance C, match the components and design criteria in List I with their functions in List II:",
        [
            ("Semiconductor diode", "IV", "Half-wave rectifies the modulated RF carrier, producing pulsating DC", "Eliminates one half of the carrier oscillations, leaving only unidirectional current pulses."),
            ("Shunt capacitor C", "II", "Bypasses high-frequency RF carrier ripples to ground while retaining modulating envelope", "Acts as low-impedance path for f_c and high-impedance path for f_m."),
            ("Time constant condition to avoid diagonal clipping distortion", "I", "RC << 1 / f_m (or 1/f_c << RC <= sqrt(1 - mu^2) / (mu * omega_m))", "Ensures the capacitor discharges quickly enough to follow the steepest downward envelope slope."),
            ("DC blocking capacitor in series with output", "III", "Blocks the DC carrier bias voltage and passes only the pure AC audio message to amplifier", "Prevents DC bias shifting in subsequent audio stages."),
        ],
        "A"
    ))

    # Question 72: Communication Systems (intermediate)
    qs.append(make_matrix_q(
        f"{prefix}_72",
        "Communication Systems",
        "intermediate",
        "When a carrier wave of power P_c is simultaneously modulated by multiple sinusoidal tones with modulation indices mu_1 = 0.4 and mu_2 = 0.3, match the parameters in List I with their values in List II:",
        [
            ("Effective overall modulation index mu_eff", "II", "mu_eff = sqrt(mu_1^2 + mu_2^2) = 0.5", "mu_eff = sqrt(0.4^2 + 0.3^2) = sqrt(0.16 + 0.09) = sqrt(0.25) = 0.5."),
            ("Ratio of total transmitted power to carrier power P_t / P_c", "IV", "P_t / P_c = 1 + mu_eff^2 / 2 = 1.125", "P_t / P_c = 1 + 0.25 / 2 = 1.125."),
            ("Fraction of total transmitted power contained in the sidebands", "III", "Fraction is 1/9 approx 11.1%", "Sideband power fraction is (mu_eff^2 / 2) / (1 + mu_eff^2 / 2) = 0.125 / 1.125 = 1/9."),
            ("Total sideband power if carrier power is P_c = 8 kW", "I", "P_sidebands = 1.0 kW", "P_sidebands = (mu_eff^2 / 2) * P_c = (0.25 / 2) * 8 = 1.0 kW."),
        ],
        "D"
    ))

    # Question 73: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_73",
        "Communication Systems",
        "advanced",
        "Match the amplitude modulation variants in List I with their transmission characteristics in List II:",
        [
            ("Double Sideband Full Carrier (DSB-FC / Standard AM)", "III", "Bandwidth = 2*f_m; modulation efficiency <= 33.3%; simple envelope detector receiver", "Carrier carries no information but consumes at least 66.7% of total radiated power."),
            ("Double Sideband Suppressed Carrier (DSB-SC)", "IV", "Bandwidth = 2*f_m; 100% power efficiency; requires synchronous coherent detector", "Eliminating carrier saves power, but receiver requires carrier re-injection."),
            ("Single Sideband Suppressed Carrier (SSB-SC)", "II", "Bandwidth = f_m; 100% power efficiency; halves spectrum and power requirements", "Suppression of carrier and one sideband makes it ideal for long-range point-to-point voice."),
            ("Vestigial Sideband (VSB)", "I", "Bandwidth slightly greater than f_m (f_m + f_v); transmits one full sideband and a vestige", "Standard for analog television broadcasting to conserve bandwidth while simplifying filters."),
        ],
        "B"
    ))

    # Question 74: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_74",
        "Communication Systems",
        "advanced",
        "Match the pulse modulation schemes in List I with their technical operating principles in List II:",
        [
            ("Pulse Amplitude Modulation (PAM)", "IV", "Amplitudes of regularly spaced pulses vary in proportion to instantaneous message amplitude", "Analog pulse modulation; simplest to generate but highly susceptible to channel noise."),
            ("Pulse Width Modulation (PWM / PDM)", "III", "Duration (width) of constant-amplitude pulses varies in proportion to modulating signal", "Immune to amplitude noise; pulse width carries information."),
            ("Pulse Position Modulation (PPM)", "I", "Timing position of constant-amplitude, constant-width pulses within fixed time slots is varied", "Highest noise immunity among analog pulse schemes and constant transmitter power."),
            ("Pulse Code Modulation (PCM)", "II", "Message is sampled, quantized into discrete binary levels, and transmitted as digital words", "Complete digital transmission offering regeneration at repeaters with near-zero noise accumulation."),
        ],
        "C"
    ))

    # Question 75: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_75",
        "Communication Systems",
        "advanced",
        "In digital sampling theory according to the Nyquist-Shannon theorem, match the sampling concepts in List I with their mathematical formulations in List II (for signal band-limited to f_max):",
        [
            ("Minimum Nyquist sampling rate f_s", "II", "f_s >= 2 * f_max", "Signal can be uniquely and completely reconstructed without distortion if sampled at least twice per cycle."),
            ("Maximum Nyquist sampling interval T_s", "I", "T_s = 1 / (2 * f_max)", "Maximum permissible time spacing between successive discrete samples."),
            ("Aliasing distortion", "III", "High frequency components fold over and corrupt lower baseband frequencies when f_s < 2*f_max", "Overlapping of spectral replicas in frequency domain due to undersampling."),
            ("Anti-aliasing low-pass filter", "IV", "Pre-filter placed before the sampler to sharply attenuate all frequencies above f_s / 2", "Ensures the input signal conforms strictly to the band-limited Nyquist criterion."),
        ],
        "A"
    ))

    # Question 76: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_76",
        "Communication Systems",
        "advanced",
        "Match the Frequency Modulation (FM) parameters in List I with their physical formulas in List II:",
        [
            ("Modulation index beta in Frequency Modulation", "I", "beta = Delta f / f_m where Delta f is frequency deviation", "Ratio of maximum frequency deviation Delta f to modulating frequency f_m."),
            ("Carson's rule for transmission bandwidth of an FM signal", "II", "Bandwidth approx 2*(Delta f + f_m) = 2*f_m*(beta + 1)", "Accurate empirical approximation accounting for >98% of total transmitted FM power."),
            ("Total transmitted power in an FM wave", "IV", "Remains strictly constant equal to unmodulated carrier power A_c^2 / (2*R) regardless of beta", "Modulation redistributes energy among sidebands without altering total power."),
            ("Noise suppression mechanism in FM receivers", "III", "Amplitude limiters clip off amplitude noise variations prior to frequency discriminator", "Since noise primarily corrupts signal amplitude, FM offers superior Signal-to-Noise Ratio."),
        ],
        "D"
    ))

    # Question 77: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_77",
        "Communication Systems",
        "advanced",
        "A television transmitting antenna of height h is erected on flat spherical Earth of radius R = 6400 km. Match the coverage characteristics in List I with their relations in List II:",
        [
            ("Maximum radio horizon distance d to ground-based TV antennas", "III", "d = sqrt(2 * R * h)", "Direct line-of-sight distance tangent to Earth's spherical surface."),
            ("Total circular geographical area covered by the broadcast", "I", "A_cov = pi * d^2 = 2 * pi * R * h (directly proportional to tower height h)", "Doubling the tower height exactly doubles the service surface area."),
            ("Factor by which coverage area increases if tower height is increased by 44%", "IV", "Increases by a factor of 1.44 (44% increase)", "Since A_cov proportional to h, a 44% increase in h produces a 44% increase in covered area."),
            ("Total population reached for uniform population density rho = 1000 persons/km^2 and h = 100 m", "II", "N = rho * (2 * pi * R * h) approx 4.02 x 10^6 people", "A = 2 pi * 6400 * 0.1 = 4021.2 km^2. Population N = 1000 * 4021.2 approx 4.02 x 10^6."),
        ],
        "B"
    ))

    # Question 78: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_78",
        "Communication Systems",
        "advanced",
        "Match the signal attenuation and decibel power relations in transmission media in List I with their quantitative values in List II:",
        [
            ("Power ratio corresponding to a +3 dB power gain", "II", "P_out / P_in approx 2.0 (signal power doubles)", "Gain (dB) = 10 log10(P_out/P_in) implies 10^0.3 approx 2.0."),
            ("Power ratio corresponding to a -20 dB transmission line attenuation", "IV", "P_out / P_in = 0.01 (signal power drops to 1% of input)", "-20 = 10 log10(P_out/P_in) implies P_out/P_in = 10^-2 = 0.01."),
            ("Total attenuation of an optical fiber of length 40 km having loss 0.25 dB/km", "I", "10 dB (output power is 10% of input power)", "Total loss alpha = 0.25 * 40 = 10 dB, which corresponds to a factor of 10 attenuation."),
            ("Repeater amplifier gain needed to fully compensate a -30 dB path loss", "III", "+30 dB (amplifies signal power by a factor of 1000)", "Net gain must be 0 dB, so amplifier must provide exactly +30 dB gain."),
        ],
        "C"
    ))

    # Question 79: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_79",
        "Communication Systems",
        "advanced",
        "In a superheterodyne AM radio receiver receiving carrier frequency f_RF = 1000 kHz with standard Intermediate Frequency f_IF = 455 kHz, match the receiver stages and frequencies in List I with their values and roles in List II:",
        [
            ("Local Oscillator frequency f_LO (higher than RF)", "IV", "f_LO = f_RF + f_IF = 1455 kHz", "Local oscillator is tuned above RF by the intermediate frequency: 1000 + 455 = 1455 kHz."),
            ("Image frequency f_image", "II", "f_image = f_RF + 2 * f_IF = 1910 kHz", "Signal at 1910 kHz would also beat with 1455 kHz to produce 455 kHz if not rejected by RF filter."),
            ("Intermediate Frequency (IF) amplifier role", "III", "Provides high fixed-tuned selectivity and major portion of overall receiver gain at 455 kHz", "Tuning remains fixed at 455 kHz, allowing optimal multi-stage high-Q bandpass filtering."),
            ("Mixer (converter) stage role", "I", "Non-linear multiplication of RF and LO signals to translate carrier down to fixed IF", "Generates sum and difference frequencies: |f_LO - f_RF| = f_IF."),
        ],
        "A"
    ))

    # Question 80: Communication Systems (advanced)
    qs.append(make_matrix_q(
        f"{prefix}_80",
        "Communication Systems",
        "advanced",
        "Match the digital carrier modulation schemes in List I with their modulation characteristics in List II:",
        [
            ("Amplitude Shift Keying (ASK)", "I", "Carrier amplitude is switched between two discrete levels representing binary 0 and 1", "Also called On-Off Keying (OOK); simplest to implement but vulnerable to noise."),
            ("Frequency Shift Keying (FSK)", "III", "Carrier frequency is switched between two distinct frequencies f_1 and f_2 for binary 0 and 1", "Constant envelope signal providing superior noise immunity compared to ASK."),
            ("Binary Phase Shift Keying (BPSK)", "II", "Carrier phase shifts by 180 degrees (pi radians) between binary 0 and 1 with constant amplitude", "Highest power efficiency and noise immunity among binary modulation schemes."),
            ("Quadrature Amplitude Modulation (QAM)", "IV", "Simultaneously modulates amplitude and phase of two orthogonal carriers in quadrature", "Achieves high spectral efficiency by transmitting multiple bits per baud symbol."),
        ],
        "D"
    ))

    return qs
