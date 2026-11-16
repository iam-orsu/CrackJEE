from builder import make_matrix_q

def get_questions():
    qs = []

    # ==================================================
    # TOPIC 1: Principle of Mathematical Induction (20 questions)
    # ==================================================
    t = "Principle of Mathematical Induction"
    prefix = "math_mat_pmi"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the fundamental summation formulas in List I with their closed-form expressions for $n \in \mathbb{N}$ in List II:",
        [
            ("$\sum_{k=1}^n k = 1 + 2 + \dots + n$", "III", "$\frac{n(n+1)}{2}$", "Sum of the first $n$ positive integers is $\frac{n(n+1)}{2}$"),
            ("$\sum_{k=1}^n (2k - 1) = 1 + 3 + \dots + (2n-1)$", "I", "$n^2$", "Sum of the first $n$ odd positive integers is $n^2$"),
            ("$\sum_{k=1}^n k^2 = 1^2 + 2^2 + \dots + n^2$", "IV", "$\frac{n(n+1)(2n+1)}{6}$", "Sum of squares of the first $n$ positive integers is $\frac{n(n+1)(2n+1)}{6}$"),
            ("$\sum_{k=1}^n k^3 = 1^3 + 2^3 + \dots + n^3$", "II", "$\left[\frac{n(n+1)}{2}\right]^2$", "Sum of cubes of the first $n$ positive integers is $\left[\frac{n(n+1)}{2}\right]^2$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each inequality proposition in List I with the smallest integer $n_0 \ge 1$ in List II for which it holds for all $n \ge n_0$:",
        [
            ("$2^n > n^2$", "IV", "$n_0 = 5$", "For $n=1$, $2>1$ (true), but for $n=2,3,4$, $2^n \le n^2$. For all $n \ge 5$, $2^n > n^2$ holds strictly"),
            ("$n! > 2^n$", "II", "$n_0 = 4$", "Holds for $n=4$ ($24 > 16$) and all $n \ge 4$, while false for $n=1, 2, 3$"),
            ("$2^n > n$", "III", "$n_0 = 1$", "True for $n=1$ ($2 > 1$) and verified inductively for all $n \ge 1$"),
            ("$n! > 3^n$", "I", "$n_0 = 7$", "For $n=6$, $720 < 729$; for $n=7$, $5040 > 2187$, so $n_0 = 7$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "For any positive integer $n \in \mathbb{N}$, match each algebraic expression in List I with the largest integer in List II that is guaranteed to divide it for all $n$:",
        [
            ("$n^3 - n$", "II", "6", "$n^3 - n = (n-1)n(n+1)$ is the product of 3 consecutive integers, which is always divisible by $3! = 6$"),
            ("$3^{2n} - 1$", "IV", "8", "$3^{2n} - 1 = 9^n - 1 = (9-1)(9^{n-1} + \dots + 1)$ is always divisible by 8"),
            ("$2^{3n} - 1$", "I", "7", "$2^{3n} - 1 = 8^n - 1 = (8-1)(8^{n-1} + \dots + 1)$ is always divisible by 7"),
            ("$5^{2n} - 1$", "III", "24", "$5^{2n} - 1 = 25^n - 1$, and $25 \equiv 1 \pmod{24}$, so it is always divisible by 24")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Consider the proposition $P(n): \sum_{r=1}^n r(r+1) = \frac{n(n+1)(n+2)}{3}$. Match the proof components in List I with their expressions in List II:",
        [
            ("LHS evaluation for base case $P(1)$", "II", "2", "For $n=1$, LHS is $1(1+1) = 2$"),
            ("The $(k+1)$-th term $T_{k+1}$ added to $P(k)$", "IV", "$(k+1)(k+2)$", "The next term in the summation is $(k+1)(k+2)$"),
            ("Inductive hypothesis RHS for $P(k)$", "I", "$\frac{k(k+1)(k+2)}{3}$", "Hypothesis states $\sum_{r=1}^k r(r+1) = \frac{k(k+1)(k+2)}{3}$"),
            ("Required RHS form for $P(k+1)$", "III", "$\frac{(k+1)(k+2)(k+3)}{3}$", "Replacing $k$ with $k+1$ gives $\frac{(k+1)(k+2)(k+3)}{3}$")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the telescoping rational sums in List I with their closed-form values for $n \in \mathbb{N}$ in List II:",
        [
            ("$\sum_{r=1}^n \frac{1}{r(r+1)}$", "III", "$\frac{n}{n+1}$", "$\sum_{r=1}^n \left(\frac{1}{r} - \frac{1}{r+1}\right) = 1 - \frac{1}{n+1} = \frac{n}{n+1}$"),
            ("$\sum_{r=1}^n \frac{1}{(2r-1)(2r+1)}$", "I", "$\frac{n}{2n+1}$", "$\frac{1}{2}\sum_{r=1}^n \left(\frac{1}{2r-1} - \frac{1}{2r+1}\right) = \frac{1}{2}\left(1 - \frac{1}{2n+1}\right) = \frac{n}{2n+1}$"),
            ("$\sum_{r=1}^n \frac{1}{r(r+1)(r+2)}$", "IV", "$\frac{n(n+3)}{4(n+1)(n+2)}$", "$\frac{1}{2}\sum_{r=1}^n \left(\frac{1}{r(r+1)} - \frac{1}{(r+1)(r+2)}\right) = \frac{1}{4} - \frac{1}{2(n+1)(n+2)} = \frac{n(n+3)}{4(n+1)(n+2)}$"),
            ("$\sum_{r=1}^n \frac{r}{(r+1)!}$", "II", "$1 - \frac{1}{(n+1)!}$", "$\sum_{r=1}^n \left(\frac{1}{r!} - \frac{1}{(r+1)!}\right) = 1 - \frac{1}{(n+1)!}$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For all $n \in \mathbb{N}$, match each expression in List I with the greatest integer in List II that always divides it:",
        [
            ("$2^{4n} - 1$", "IV", "15", "$2^{4n} - 1 = 16^n - 1$, always divisible by $16 - 1 = 15$"),
            ("$3^{2n+2} - 8n - 9$", "II", "64", "$9^{n+1} - 8n - 9 = (1+8)^{n+1} - 8n - 9 = 64 \sum_{j=2}^{n+1} \binom{n+1}{j} 8^{j-2}$, divisible by 64"),
            ("$n(n^2 - 1)(3n + 2)$", "III", "24", "Product of consecutive integers yields divisibility by 24 for all $n \ge 1$"),
            ("$11^{n+2} + 12^{2n+1}$", "I", "133", "$121 \cdot 11^n + 12 \cdot 144^n \equiv 121 \cdot 11^n + 12 \cdot 11^n = 133 \cdot 11^n \equiv 0 \pmod{133}$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the finite products in List I with their evaluated closed forms for $n \ge 2$ in List II:",
        [
            ("$\prod_{r=2}^n \left(1 - \frac{1}{r}\right)$", "II", "$\frac{1}{n}$", "$\frac{1}{2} \cdot \frac{2}{3} \dots \frac{n-1}{n} = \frac{1}{n}$"),
            ("$\prod_{r=1}^n \left(1 + \frac{1}{r}\right)$", "IV", "$n + 1$", "$\frac{2}{1} \cdot \frac{3}{2} \dots \frac{n+1}{n} = n+1$"),
            ("$\prod_{r=2}^n \left(1 - \frac{1}{r^2}\right)$", "I", "$\frac{n+1}{2n}$", "$\prod_{r=2}^n \frac{r-1}{r} \cdot \frac{r+1}{r} = \frac{1}{n} \cdot \frac{n+1}{2} = \frac{n+1}{2n}$"),
            ("$\prod_{r=1}^n \left(1 + \frac{2}{r}\right)$", "III", "$\frac{(n+1)(n+2)}{2}$", "$\frac{3}{1} \cdot \frac{4}{2} \dots \frac{n+2}{n} = \frac{(n+1)(n+2)}{2}$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "By mathematical induction, match each $2 \times 2$ matrix $A$ in List I with its $n$-th power $A^n$ ($n \in \mathbb{N}$) in List II:",
        [
            ("$\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$", "II", "$\begin{pmatrix} 1 & n \\ 0 & 1 \end{pmatrix}$", "Induction on $n$: $\begin{pmatrix} 1 & k \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 1 & k+1 \\ 0 & 1 \end{pmatrix}$"),
            ("$\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$", "IV", "$\begin{pmatrix} \cos(n\theta) & -\sin(n\theta) \\ \sin(n\theta) & \cos(n\theta) \end{pmatrix}$", "Standard rotation matrix power verified by induction using angle addition formulas"),
            ("$\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}$", "I", "$\begin{pmatrix} 2^n & 0 \\ 0 & 3^n \end{pmatrix}$", "Diagonal matrix power raises each diagonal entry to power $n$"),
            ("$\begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix}$", "III", "$\begin{pmatrix} 1 & 0 \\ n & 1 \end{pmatrix}$", "Lower triangular unipotent matrix power has lower-left entry $n$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the factorial-related summations in List I with their closed forms for $n \in \mathbb{N}$ in List II:",
        [
            ("$\sum_{k=1}^n k \cdot k!$", "III", "$(n+1)! - 1$", "$k \cdot k! = (k+1)! - k!$. Sum telescopes to $(n+1)! - 1$"),
            ("$\sum_{k=1}^n (k^2 + 1)k!$", "I", "$n(n+1)!$", "$(k^2+1)k! = k(k+1)! - (k-1)k!$. Sum telescopes to $n(n+1)!$"),
            ("$\sum_{k=1}^n \frac{k}{(k+1)!}$", "IV", "$1 - \frac{1}{(n+1)!}$", "$\frac{k}{(k+1)!} = \frac{1}{k!} - \frac{1}{(k+1)!}$. Telescopes to $1 - \frac{1}{(n+1)!}$"),
            ("$\sum_{k=1}^n \frac{k-1}{k!}$", "II", "$1 - \frac{1}{n!}$", "$\frac{k-1}{k!} = \frac{1}{(k-1)!} - \frac{1}{k!}$. Sum telescopes to $1 - \frac{1}{n!}$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the alternating sums in List I with their closed-form values for $n \in \mathbb{N}$ in List II:",
        [
            ("$\sum_{r=1}^{2n} (-1)^{r-1} r$", "IV", "$-n$", "$1 - 2 + 3 - 4 + \dots + (2n-1) - 2n = (1-2) + (3-4) + \dots = -1 \times n = -n$"),
            ("$\sum_{r=1}^{2n} (-1)^{r} r^2$", "II", "$n(2n+1)$", "$-1^2 + 2^2 - 3^2 + 4^2 - \dots + (2n)^2 = (2-1)(2+1) + (4-3)(4+3) + \dots = 3 + 7 + 11 + \dots + (4n-1) = n(2n+1)$"),
            ("$\sum_{r=1}^n (-1)^{r-1}$", "III", "$\frac{1 - (-1)^n}{2}$", "Equals 1 if $n$ is odd, and 0 if $n$ is even, which is $\frac{1 - (-1)^n}{2}$"),
            ("$\sum_{r=1}^{2n} (-1)^{r-1} r(r+1)$", "I", "$-2n(n+1)$", "$(1\cdot 2 - 2\cdot 3) + (3\cdot 4 - 4\cdot 5) + \dots = -4 - 8 - \dots - 4n = -4 \frac{n(n+1)}{2} = -2n(n+1)$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "In proving the inequality $P(n)$ by mathematical induction, match each target inequality in List I with its essential inductive step key relation in List II:",
        [
            ("$2^n > n$ for all $n \ge 1$", "II", "$2^{k+1} = 2 \cdot 2^k > 2k = k + k \ge k + 1$", "Using $2^k > k$, $2^{k+1} > 2k \ge k+1$ holds for $k \ge 1$"),
            ("$(1+x)^n \ge 1 + nx$ for $x > -1, n \ge 1$", "IV", "$(1+x)^{k+1} \ge (1+kx)(1+x) = 1+(k+1)x + kx^2 \ge 1+(k+1)x$", "Bernoulli's inequality step relies on $kx^2 \ge 0$"),
            ("$n! > 2^n$ for $n \ge 4$", "I", "$(k+1)! = (k+1)k! > (k+1)2^k > 2 \cdot 2^k = 2^{k+1}$", "Since $k \ge 4$, $k+1 > 2$, yielding $(k+1)2^k > 2^{k+1}$"),
            ("$\sum_{r=1}^n \frac{1}{\sqrt{r}} > \sqrt{n}$ for $n \ge 2$", "III", "$\sqrt{k} + \frac{1}{\sqrt{k+1}} > \sqrt{k+1} \iff \sqrt{k(k+1)} > k$", "Inductive step uses $\sqrt{k(k+1)} + 1 > k+1$, which holds since $k(k+1) > k^2$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the arithmetic-geometric and special series in List I with their sum to $n$ terms in List II:",
        [
            ("$\sum_{r=1}^n r \cdot 2^r$", "II", "$(n-1)2^{n+1} + 2$", "Standard AGP formula: $\sum_{r=1}^n r 2^r = (n-1)2^{n+1} + 2$"),
            ("$\sum_{r=1}^n \frac{r}{2^r}$", "IV", "$2 - \frac{n+2}{2^n}$", "$\sum_{r=1}^n r (1/2)^r = 2 - \frac{n+2}{2^n}$"),
            ("$\sum_{r=1}^n r(r+1)(r+2)$", "I", "$\frac{n(n+1)(n+2)(n+3)}{4}$", "Product of 3 consecutive terms sums to $\frac{n(n+1)(n+2)(n+3)}{4}$"),
            ("$\sum_{r=1}^n r^2(r+1)$", "III", "$\frac{n(n+1)(n+2)(3n+1)}{12}$", "$\sum (r^3 + r^2) = \frac{n^2(n+1)^2}{4} + \frac{n(n+1)(2n+1)}{6} = \frac{n(n+1)(n+2)(3n+1)}{12}$")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For sequences defined recursively, mathematical induction proves their closed form. Match each recurrence relation and initial condition in List I with its general term $a_n$ for $n \ge 1$ in List II:",
        [
            ("$a_1 = 1, a_{n+1} = 2a_n + 1$", "III", "$2^n - 1$", "Base: $a_1 = 1 = 2^1 - 1$. Inductive step: $a_{k+1} = 2(2^k - 1) + 1 = 2^{k+1} - 1$"),
            ("$a_1 = 2, a_{n+1} = 3a_n - 2$", "I", "$3^{n-1} + 1$", "Base: $a_1 = 3^0 + 1 = 2$. Inductive step: $a_{k+1} = 3(3^{k-1}+1) - 2 = 3^k + 1$"),
            ("$a_1 = 1, a_{n+1} = a_n + 2n + 1$", "IV", "$n^2$", "Base: $a_1 = 1^2$. Inductive step: $a_{k+1} = k^2 + 2k + 1 = (k+1)^2$"),
            ("$a_1 = 2, a_{n+1} = a_n + 3n(n+1)$", "II", "$n^3 - n + 2$", "Base: $a_1 = 1 - 1 + 2 = 2$. $a_{k+1} - a_k = 3k(k+1) = (k+1)^3 - (k+1) - (k^3 - k)$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the identities involving Fibonacci numbers ($F_1 = 1, F_2 = 1, F_{n+1} = F_n + F_{n-1}$) in List I with their proven closed forms in List II:",
        [
            ("$\sum_{i=1}^n F_i = F_1 + F_2 + \dots + F_n$", "IV", "$F_{n+2} - 1$", "By induction: $F_1 = F_3 - 1 = 2-1 = 1$. Adding $F_{k+1}$ gives $F_{k+2} - 1 + F_{k+1} = F_{k+3} - 1$"),
            ("$\sum_{i=1}^n F_i^2 = F_1^2 + F_2^2 + \dots + F_n^2$", "II", "$F_n F_{n+1}$", "Inductive step: $F_k F_{k+1} + F_{k+1}^2 = F_{k+1}(F_k + F_{k+1}) = F_{k+1} F_{k+2}$"),
            ("$F_{n-1} F_{n+1} - F_n^2$ (Cassini's Identity)", "I", "$(-1)^n$", "Base: $F_0 F_2 - F_1^2 = 0 - 1 = -1 = (-1)^1$. Verified by induction or determinant of matrix power"),
            ("$F_1 + F_3 + F_5 + \dots + F_{2n-1}$", "III", "$F_{2n}$", "Base: $F_1 = F_2 = 1$. Inductive step: $F_{2k} + F_{2k+1} = F_{2k+2}$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the trigonometric identities established by induction for $n \in \mathbb{N}$ in List I with their expressions in List II (where denominators are non-zero):",
        [
            ("$\prod_{k=0}^{n-1} \cos(2^k x)$", "II", "$\frac{\sin(2^n x)}{2^n \sin x}$", "Multiply by $2\sin x$ repeatedly: $2\sin x \cos x = \sin 2x$, telescopes to $\frac{\sin(2^n x)}{2^n \sin x}$"),
            ("$\sum_{k=1}^n \sin(kx)$", "IV", "$\frac{\sin\left(\frac{nx}{2}\right)\sin\left(\frac{(n+1)x}{2}\right)}{\sin(x/2)}$", "Standard trigonometric sum formula verified by mathematical induction"),
            ("$\sum_{k=1}^n \cos((2k-1)x)$", "I", "$\frac{\sin(2nx)}{2\sin x}$", "Multiply by $2\sin x$: $2\sin x \cos((2k-1)x) = \sin(2kx) - \sin(2(k-1)x)$, telescopes to $\frac{\sin(2nx)}{2\sin x}$"),
            ("$\sum_{k=1}^n \cos(kx)$", "III", "$\frac{\sin\left(\frac{nx}{2}\right)\cos\left(\frac{(n+1)x}{2}\right)}{\sin(x/2)}$", "Standard sum of cosines formula verified by mathematical induction")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the inductive inequality statements in List I with the sharp bounds in List II valid for all integers $n \ge 2$:",
        [
            ("$\sum_{k=1}^n \frac{1}{k^2} = 1 + \frac{1}{4} + \dots + \frac{1}{n^2}$", "II", "$< 2 - \frac{1}{n}$", "Since $\frac{1}{k^2} < \frac{1}{k-1} - \frac{1}{k}$, inductive step easily proves $S_n \le 2 - \frac{1}{n} < 2$"),
            ("$\prod_{k=1}^n \frac{2k-1}{2k} = \frac{1}{2} \cdot \frac{3}{4} \dots \frac{2n-1}{2n}$", "IV", "$< \frac{1}{\sqrt{2n+1}}$", "Inductive step: $\frac{1}{\sqrt{2k+1}} \frac{2k+1}{2k+2} < \frac{1}{\sqrt{2k+3}} \iff \frac{2k+1}{2k+2} < \sqrt{\frac{2k+1}{2k+3}}$"),
            ("$1 + \frac{1}{2} + \frac{1}{3} + \dots + \frac{1}{2^n - 1}$", "I", "$< n$", "Grouping terms in blocks of powers of 2 gives $< 1 + 2(1/2) + 4(1/4) + \dots = n$"),
            ("$1 + \frac{1}{2} + \frac{1}{3} + \dots + \frac{1}{2^n}$", "III", "$> 1 + \frac{n}{2}$", "Grouping terms $1 + (1/2) + (1/3+1/4) + \dots > 1 + n(1/2)$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the $n$-th derivatives obtained through induction in List I with their expressions in List II:",
        [
            ("$\frac{d^n}{dx^n} (x e^x)$", "III", "$(x + n)e^x$", "Base: $(xe^x)' = (x+1)e^x$. If true for $k$, derivative is $e^x + (x+k)e^x = (x+k+1)e^x$"),
            ("$\frac{d^n}{dx^n} (\ln x)$", "I", "$(-1)^{n-1} \frac{(n-1)!}{x^n}$", "Base: $1/x$. Each differentiation multiplies by $-k$ and increases power of $x$ in denominator"),
            ("$\frac{d^n}{dx^n} \left(\frac{1}{ax+b}\right)$", "IV", "$\frac{(-1)^n n! a^n}{(ax+b)^{n+1}}$", "Repeated application of power and chain rule yields $(-1)^n n! a^n (ax+b)^{-(n+1)}$"),
            ("$\frac{d^n}{dx^n} (x^n)$", "II", "$n!$", "Differentiating $x^n$ exactly $n$ times yields the constant $n!$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the combinatorial identities in List I with their closed forms in List II, as established by mathematical induction:",
        [
            ("$\sum_{r=0}^n \binom{n}{r}$", "IV", "$2^n$", "Base case $\binom{0}{0}=1=2^0$. Step uses Pascal's identity $\binom{k+1}{r} = \binom{k}{r} + \binom{k}{r-1}$"),
            ("$\sum_{r=0}^n r \binom{n}{r}$", "II", "$n 2^{n-1}$", "Induction on $n$ using $r \binom{n}{r} = n \binom{n-1}{r-1}$ yields $n \sum \binom{n-1}{r-1} = n 2^{n-1}$"),
            ("$\sum_{r=0}^m \binom{n+r}{r}$ (Hockey-Stick Identity)", "I", "$\binom{n+m+1}{m}$", "Induction on $m$: $\binom{n+k+1}{k} + \binom{n+k+1}{k+1} = \binom{n+k+2}{k+1}$"),
            ("$\sum_{r=0}^n (-1)^r \binom{n}{r}$ for $n \ge 1$", "III", "0", "Alternating sum of binomial coefficients equals $(1 - 1)^n = 0$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "For a real parameter $x \ne 1$, match the polynomial identities established by induction in List I with their closed forms in List II:",
        [
            ("$\sum_{k=0}^{n-1} x^k = 1 + x + x^2 + \dots + x^{n-1}$", "II", "$\frac{x^n - 1}{x - 1}$", "Inductive step: $\frac{x^k - 1}{x - 1} + x^k = \frac{x^{k+1} - 1}{x - 1}$"),
            ("$\prod_{k=0}^{n-1} (1 + x^{2^k}) = (1+x)(1+x^2)\dots(1+x^{2^{n-1}})$", "IV", "$\frac{1 - x^{2^n}}{1 - x}$", "Multiply by $(1-x)$ gives $(1-x^2)(1+x^2)\dots = 1 - x^{2^n}$"),
            ("$\sum_{k=1}^n k x^{k-1}$", "I", "$\frac{1 - (n+1)x^n + n x^{n+1}}{(1-x)^2}$", "Derivative of $\sum_{k=0}^n x^k = \frac{x^{n+1}-1}{x-1}$ yields this closed form"),
            ("$\sum_{k=1}^n (2k-1) x^{k-1}$", "III", "$\frac{1 + x - (2n+1)x^n + (2n-1)x^{n+1}}{(1-x)^2}$", "Standard odd-coefficient AGP sum formula verified by induction")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each proposition proved by the Strong Form of Mathematical Induction (or Cauchy's backwards induction) in List I with its fundamental structural characterization in List II:",
        [
            ("Every integer $n \ge 2$ has a prime factorization", "II", "Decomposes $k+1$ into product $a \cdot b$ where $2 \le a, b \le k$", "Strong induction assumes prime factorization for all integers up to $k$, then factors $k+1 = a \cdot b$ if composite"),
            ("Any postage of $n \ge 8$ cents can be formed using 3-cent and 5-cent stamps", "IV", "Requires 3 consecutive base cases $P(8), P(9), P(10)$ then adds 3-cent stamps", "Since adding 3 cents to $P(k-2)$ establishes $P(k+1)$, exactly 3 base cases are required"),
            ("Every positive integer $n$ can be uniquely expressed in binary", "I", "Strong induction on $\lfloor n/2 \rfloor$", "The inductive step determines the least significant bit ($n \pmod 2$) and invokes the hypothesis on $\lfloor n/2 \rfloor < n$"),
            ("AM-GM inequality for $n$ variables by Cauchy's induction", "III", "Forward induction for $n = 2^k$, then backward induction from $k$ to $k-1$", "Cauchy proved $P(2) \implies P(2^k)$, then showed $P(k) \implies P(k-1)$ by setting $x_k = A$")
        ], "D"))

    # ==================================================
    # TOPIC 2: Complex Numbers (20 questions)
    # ==================================================
    t = "Complex Numbers"
    prefix = "math_mat_cplx"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the complex numbers $z$ in List I with their absolute values $|z|$ in List II:",
        [
            ("$3 + 4i$", "III", "5", "$|3+4i| = \sqrt{3^2 + 4^2} = 5$"),
            ("$5 - 12i$", "I", "13", "$|5-12i| = \sqrt{5^2 + (-12)^2} = 13$"),
            ("$1 + i\sqrt{3}$", "IV", "2", "$|1+i\sqrt{3}| = \sqrt{1 + 3} = 2$"),
            ("$\sqrt{7} - 3i$", "II", "4", "$|\sqrt{7}-3i| = \sqrt{7 + 9} = 4$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each complex number $z$ in List I with its principal argument $\operatorname{Arg}(z) \in (-\pi, \pi]$ in List II:",
        [
            ("$1 + i$", "IV", "$\pi/4$", "First quadrant with $\tan\theta = 1/1 = 1 \implies \pi/4$"),
            ("$-1 + i\sqrt{3}$", "II", "$2\pi/3$", "Second quadrant with $\tan\alpha = \sqrt{3} \implies \pi - \pi/3 = 2\pi/3$"),
            ("$-1 - i$", "III", "$-3\pi/4$", "Third quadrant with $\tan\alpha = 1 \implies -\pi + \pi/4 = -3\pi/4$"),
            ("$\sqrt{3} - i$", "I", "$-\pi/6$", "Fourth quadrant with $\tan\alpha = 1/\sqrt{3} \implies -\pi/6$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the integer powers of the imaginary unit $i$ in List I with their evaluated values in List II:",
        [
            ("$i^{2024}$", "II", "1", "$2024 = 4 \times 506 \implies i^{2024} = (i^4)^{506} = 1$"),
            ("$i^{2025}$", "IV", "$i$", "$2025 = 4 \times 506 + 1 \implies i^{2025} = i^1 = i$"),
            ("$i^{2026}$", "I", "$-1$", "$2026 = 4 \times 506 + 2 \implies i^{2026} = i^2 = -1$"),
            ("$i^{2027}$", "III", "$-i$", "$2027 = 4 \times 506 + 3 \implies i^{2027} = i^3 = -i$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Let $\omega$ be a non-real complex cube root of unity ($\omega^3 = 1, \omega \ne 1$). Match the algebraic expressions in List I with their values in List II:",
        [
            ("$1 + \omega + \omega^2$", "II", "0", "Fundamental property of cube roots of unity: $1+\omega+\omega^2 = 0$"),
            ("$\omega^4 + \omega^2$", "IV", "$-1$", "$\omega^4 + \omega^2 = \omega + \omega^2 = -1$"),
            ("$\omega^6 + \omega^3$", "I", "2", "$\omega^6 + \omega^3 = 1 + 1 = 2$"),
            ("$(1 - \omega + \omega^2)(1 + \omega - \omega^2)$", "III", "4", "Product is $(-2\omega)(-2\omega^2) = 4\omega^3 = 4$")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the geometric loci of $z = x + iy$ in the complex plane in List I with their geometric descriptions in List II:",
        [
            ("$|z - 2 - 3i| = 5$", "III", "Circle with center $(2, 3)$ and radius 5", "Distance from fixed point $(2, 3)$ is constant 5"),
            ("$|z - 2| = |z + 2|$", "I", "The imaginary axis ($y$-axis, $x = 0$)", "Perpendicular bisector of segment joining $(2, 0)$ and $(-2, 0)$"),
            ("$|z - 3| + |z + 3| = 10$", "IV", "Ellipse with foci at $(\pm 3, 0)$ and major axis length 10", "Sum of distances from $(\pm 3, 0)$ is constant $10 > 6$"),
            ("$\operatorname{Re}(z^2) = 4$", "II", "Rectangular hyperbola $x^2 - y^2 = 4$", "$\operatorname{Re}((x+iy)^2) = x^2 - y^2 = 4$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Let $\omega$ be a non-real cube root of unity. Match the expressions in List I with their numerical evaluations in List II:",
        [
            ("$(1 + \omega)^6$", "IV", "1", "$1+\omega = -\omega^2 \implies (-\omega^2)^6 = \omega^{12} = 1$"),
            ("$(1 - \omega + \omega^2)^6$", "II", "64", "$1+\omega^2 = -\omega \implies (-2\omega)^6 = 64\omega^6 = 64$"),
            ("$(1 + \omega - \omega^2)^3$", "III", "$-8$", "$1+\omega = -\omega^2 \implies (-2\omega^2)^3 = -8\omega^6 = -8$"),
            ("$(1 - \omega)(1 - \omega^2)$", "I", "3", "$1 - (\omega+\omega^2) + \omega^3 = 1 - (-1) + 1 = 3$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Given a complex number $z$ satisfying $|z - 3 - 4i| \le 2$, match the quantities in List I with their extreme values in List II:",
        [
            ("Maximum value of $|z|$", "II", "7", "Disk center is $z_0 = 3+4i$ with $|z_0| = 5$. Max $|z| = 5 + 2 = 7$"),
            ("Minimum value of $|z|$", "IV", "3", "Min $|z| = 5 - 2 = 3$"),
            ("Maximum value of $|z - 3|$", "I", "6", "Distance to $(3, 0)$ from center $(3, 4)$ is 4; max distance is $4 + 2 = 6$"),
            ("Minimum value of $|z - 3|$", "III", "2", "Distance from $(3, 0)$ to center $(3, 4)$ is 4; min distance is $4 - 2 = 2$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the complex equations/conditions in List I with the corresponding geometric rays or arcs in List II:",
        [
            ("$\arg(z) = \pi/3$", "II", "Ray from origin into first quadrant with angle $\pi/3$", "Locus is $y = \sqrt{3}x$ for $x > 0, y > 0$"),
            ("$\arg\left(\frac{z - 1}{z + 1}\right) = \frac{\pi}{2}$", "IV", "Semicircle in upper half plane with diameter $[-1, 1]$", "Angle subtended by $[-1, 1]$ is $\pi/2$ with positive imaginary part"),
            ("$\arg(z - 2) = \pi$", "I", "Open ray on real axis $(-\infty, 2)$ directed to the left", "$z - 2$ is negative real, so $y = 0$ and $x < 2$"),
            ("$\arg\left(\frac{z - 1}{z + 1}\right) = 0$", "III", "Union of open rays $(-\infty, -1) \cup (1, \infty)$ on the real axis", "Ratio is positive real, meaning $z$ lies on the real line outside $[-1, 1]$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each complex number in List I with one of its principal square roots in List II:",
        [
            ("$3 + 4i$", "III", "$2 + i$", "$(2+i)^2 = 4 - 1 + 4i = 3 + 4i$"),
            ("$-15 + 8i$", "I", "$1 + 4i$", "$(1+4i)^2 = 1 - 16 + 8i = -15 + 8i$"),
            ("$-7 - 24i$", "IV", "$3 - 4i$", "$(3-4i)^2 = 9 - 16 - 24i = -7 - 24i$"),
            ("$2i$", "II", "$1 + i$", "$(1+i)^2 = 1 - 1 + 2i = 2i$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the complex numbers in List I with their exponential polar representations $r e^{i\theta}$ ($\theta \in (-\pi, \pi]$) in List II:",
        [
            ("$\frac{1 + i}{\sqrt{2}}$", "IV", "$e^{i\pi/4}$", "Modulus 1, argument $\pi/4$: $\cos(\pi/4) + i\sin(\pi/4)$"),
            ("$\frac{-1 + i\sqrt{3}}{2}$", "II", "$e^{i 2\pi/3}$", "Cube root of unity $\omega = \cos(2\pi/3) + i\sin(2\pi/3)$"),
            ("$\frac{1 - i}{\sqrt{2}}$", "III", "$e^{-i\pi/4}$", "Modulus 1, argument $-\pi/4$: $\cos(-\pi/4) + i\sin(-\pi/4)$"),
            ("$\frac{-\sqrt{3} - i}{2}$", "I", "$e^{-i 5\pi/6}$", "Modulus 1, argument $-\pi + \pi/6 = -5\pi/6$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the geometric transformations of the Argand plane in List I with their algebraic formulas in List II:",
        [
            ("Counterclockwise rotation by $\pi/2$ about the origin", "II", "$z \mapsto iz$", "Multiplication by $e^{i\pi/2} = i$ rotates counterclockwise by $\pi/2$"),
            ("Reflection across the real axis", "IV", "$z \mapsto \bar{z}$", "Complex conjugate negates imaginary part, reflecting across $x$-axis"),
            ("Reflection through the origin (point inversion)", "I", "$z \mapsto -z$", "Negating $z$ inverts coordinates $(x, y) \mapsto (-x, -y)$"),
            ("Reflection across the imaginary axis", "III", "$z \mapsto -\bar{z}$", "Negating conjugate maps $x+iy \mapsto -x+iy$, reflecting across $y$-axis")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Let $\alpha_k = e^{i \frac{2k\pi}{7}}$ ($k = 0, 1, \dots, 6$) be the 7th roots of unity. Match the expressions in List I with their evaluated values in List II:",
        [
            ("$\sum_{k=0}^6 \alpha_k$", "II", "0", "Sum of all 7th roots of unity is 0"),
            ("$\sum_{k=1}^6 \alpha_k$", "IV", "$-1$", "Sum excluding $\alpha_0 = 1$ is $0 - 1 = -1$"),
            ("$\prod_{k=1}^6 (1 - \alpha_k)$", "I", "7", "Evaluating $\frac{z^7 - 1}{z - 1} = 1 + z + \dots + z^6$ at $z = 1$ yields 7"),
            ("$\sum_{k=1}^3 \cos\left(\frac{2k\pi}{7}\right)$", "III", "$-\frac{1}{2}$", "Pairing conjugate roots $\alpha_k + \alpha_{7-k} = 2\cos(2k\pi/7)$ gives $2 \sum_{k=1}^3 \cos(2k\pi/7) = -1 \implies -1/2$")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For a triangle with vertices $z_1, z_2, z_3$ in the complex plane, match each geometric condition in List I with its geometric characterization in List II:",
        [
            ("$z_1^2 + z_2^2 + z_3^2 = z_1 z_2 + z_2 z_3 + z_3 z_1$", "III", "Equilateral triangle", "Standard necessary and sufficient condition for vertices $z_1, z_2, z_3$ to form an equilateral triangle"),
            ("$\frac{z_3 - z_1}{z_2 - z_1} = \pm i$", "I", "Right-angled isosceles triangle at $z_1$", "The side lengths $|z_3 - z_1| = |z_2 - z_1|$ are equal and the angle between them is $\pi/2$"),
            ("$z_1 + z_2 + z_3 = 0$ with $|z_1| = |z_2| = |z_3| = R$", "IV", "Equilateral triangle with circumcenter at the origin", "Centroid $G = (z_1+z_2+z_3)/3 = 0$ coincides with circumcenter $O = 0$"),
            ("$\frac{z_1 - z_2}{z_3 - z_2} \in \mathbb{R}$", "II", "Collinear points (degenerate triangle)", "The vectors are parallel, so the argument is 0 or $\pi$, meaning $z_1, z_2, z_3$ lie on a straight line")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Consider the Apollonius circle defined by $|z + 2| = \frac{1}{2} |z - 4|$. Match the geometric properties in List I with their values in List II:",
        [
            ("Center of the Apollonius circle", "IV", "$(-4, 0)$", "$4((x+2)^2+y^2) = (x-4)^2+y^2 \implies (x+4)^2 + y^2 = 16$, center is $(-4, 0)$"),
            ("Radius of the circle", "II", "4", "Equation $(x+4)^2 + y^2 = 16$ gives radius $R = \sqrt{16} = 4$"),
            ("Area enclosed by the circle", "I", "$16\pi$", "Area is $\pi R^2 = \pi(4^2) = 16\pi$"),
            ("The diameter segment on the real axis", "III", "$[-8, 0]$", "The circle intersects the real axis at $x = -4 \pm 4$, which gives $[-8, 0]$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Let $z \in \mathbb{C}$ satisfy the equation $\left|z + \frac{4}{z}\right| = 2$. Match the expressions in List I with their exact values in List II:",
        [
            ("Maximum value of $|z|$", "II", "$\sqrt{5} + 1$", "From $|z|^2 - 2|z| - 4 \le 0$, the positive root gives max $|z| = \sqrt{5} + 1$"),
            ("Minimum value of $|z|$", "IV", "$\sqrt{5} - 1$", "From $|z|^2 + 2|z| - 4 \ge 0$, the positive root gives min $|z| = \sqrt{5} - 1$"),
            ("Product of maximum and minimum values of $|z|$", "I", "4", "$(\sqrt{5}+1)(\sqrt{5}-1) = 5 - 1 = 4$"),
            ("Difference between maximum and minimum values of $|z|$", "III", "2", "$(\sqrt{5}+1) - (\sqrt{5}-1) = 2$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "For the equation $z^n = 1$, match the trigonometric product and sum expressions in List I with their values in List II ($n \ge 3$):",
        [
            ("$\prod_{k=1}^{n-1} \sin\left(\frac{k\pi}{n}\right)$", "II", "$\frac{n}{2^{n-1}}$", "Derived from $\prod_{k=1}^{n-1} |1 - e^{i 2k\pi/n}| = n$ with $|1 - e^{i 2k\pi/n}| = 2\sin(k\pi/n)$"),
            ("$\sum_{k=1}^{n-1} \cot^2\left(\frac{k\pi}{n}\right)$", "IV", "$\frac{(n-1)(n-2)}{3}$", "Classical root sum of the polynomial equation for $\cot^2\theta$"),
            ("$\sum_{k=1}^{n-1} \csc^2\left(\frac{k\pi}{n}\right)$", "I", "$\frac{n^2 - 1}{3}$", "Using $\csc^2\theta = 1 + \cot^2\theta$, $\sum \csc^2 = (n-1) + \frac{(n-1)(n-2)}{3} = \frac{n^2-1}{3}$"),
            ("$\prod_{k=1}^{n-1} \cos\left(\frac{k\pi}{2n}\right)$", "III", "$\frac{\sqrt{n}}{2^{n-1}}$", "Known identity connecting cosine products of half-angles to $\sqrt{n}/2^{n-1}$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the complex equations of straight lines and circles in List I with their geometric parameters in List II:",
        [
            ("Circle $z\bar{z} - (2+3i)z - (2-3i)\bar{z} + 9 = 0$", "III", "Center $2+3i$ and radius 2", "In $z\bar{z} - \bar{z_0}z - z_0\bar{z} + c = 0$, center is $z_0 = 2+3i$, radius $r = \sqrt{|z_0|^2 - c} = \sqrt{13 - 9} = 2$"),
            ("Line $(1+i)z + (1-i)\bar{z} + 4 = 0$", "I", "Straight line with slope 1 passing through $(-2, 0)$", "With $z = x+iy$, $(1+i)(x+iy) + (1-i)(x-iy) + 4 = 2x - 2y + 4 = 0 \iff y = x + 2$"),
            ("Circle $|z|^2 - 4\operatorname{Re}(z) - 6\operatorname{Im}(z) - 12 = 0$", "IV", "Center $(2, 3)$ and radius 5", "$x^2+y^2-4x-6y-12=0 \iff (x-2)^2+(y-3)^2 = 25$, center $(2,3)$, radius 5"),
            ("Line $i(z - \bar{z}) = 6$", "II", "Horizontal straight line $y = -3$", "$z - \bar{z} = 2iy \implies i(2iy) = -2y = 6 \implies y = -3$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Four complex numbers $z_1, z_2, z_3, z_4$ determine geometric configurations. Match each condition in List I with its geometric meaning in List II:",
        [
            ("The cross ratio $\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)} \in \mathbb{R}$", "IV", "$z_1, z_2, z_3, z_4$ are concyclic or collinear", "The argument of the cross ratio is 0 or $\pi$, which is the condition for concyclic or collinear points"),
            ("$z_1 + z_3 = z_2 + z_4$", "II", "$z_1, z_2, z_3, z_4$ form the vertices of a parallelogram", "Diagonals bisect each other: midpoints $\frac{z_1+z_3}{2} = \frac{z_2+z_4}{2}$ coincide"),
            ("$z_1 + z_3 = z_2 + z_4$ and $|z_1 - z_3| = |z_2 - z_4|$", "I", "$z_1, z_2, z_3, z_4$ form the vertices of a rectangle", "Parallelogram with equal length diagonals is a rectangle"),
            ("$z_1 + z_3 = z_2 + z_4$ and $\frac{z_1 - z_3}{z_2 - z_4} \in i\mathbb{R}$", "III", "$z_1, z_2, z_3, z_4$ form the vertices of a rhombus", "Parallelogram whose diagonals are mutually perpendicular is a rhombus")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Let $z_1, z_2, z_3$ be the vertices of $\triangle ABC$ and $z_0$ be a special point. Match the expressions for $z_0$ in List I with its geometric identity in List II:",
        [
            ("$z_0 = \frac{z_1 + z_2 + z_3}{3}$", "II", "Centroid $G$", "The centroid is the arithmetic mean of the vertex coordinates"),
            ("$z_0 = \frac{a z_1 + b z_2 + c z_3}{a + b + c}$", "IV", "Incenter $I$", "Standard formula for the incenter using side lengths $a, b, c$ as weights"),
            ("$z_0 = z_1 + z_2 + z_3$ when circumcenter $O = 0$", "I", "Orthocenter $H$", "Euler line relation states $H - 0 = 3(G - 0) \implies H = 3G = z_1 + z_2 + z_3$"),
            ("$z_0 = \frac{z_1 \sin 2A + z_2 \sin 2B + z_3 \sin 2C}{\sin 2A + \sin 2B + \sin 2C}$", "III", "Circumcenter $O$", "Trigonometric barycentric coordinates of the circumcenter")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the regions defined by complex inequalities in List I with their geometric area in List II:",
        [
            ("$\{z \in \mathbb{C} : |z| \le 4 \text{ and } 0 \le \arg(z) \le \pi/2\}$", "II", "$4\pi$", "Quarter of a circular disk of radius 4: $\frac{1}{4}\pi(4^2) = 4\pi$"),
            ("$\{z \in \mathbb{C} : 2 \le |z| \le 5\}$", "IV", "$21\pi$", "Annulus area $\pi(5^2 - 2^2) = 21\pi$"),
            ("$\{z \in \mathbb{C} : |z - 1| \le 1 \text{ and } |z - i| \le 1\}$", "I", "$\frac{\pi}{2} - 1$", "Intersection of two unit disks with centers $(1, 0)$ and $(0, 1)$ at distance $\sqrt{2}$: area is $2(\frac{\pi}{4}) - 1 = \frac{\pi}{2} - 1$"),
            ("$\{z \in \mathbb{C} : |\operatorname{Re}(z)| + |\operatorname{Im}(z)| \le 3\}$", "III", "18", "Square with vertices at $(\pm 3, 0)$ and $(0, \pm 3)$: diagonal is 6, area is $\frac{1}{2}(6)(6) = 18$")
        ], "D"))

    # ==================================================
    # TOPIC 3: Quadratic Equations (20 questions)
    # ==================================================
    t = "Quadratic Equations"
    prefix = "math_mat_quad"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each quadratic equation in List I with the nature of its roots in List II:",
        [
            ("$x^2 - 6x + 9 = 0$", "III", "Real and equal roots", "$D = (-6)^2 - 4(1)(9) = 36 - 36 = 0$"),
            ("$x^2 - 5x + 6 = 0$", "I", "Real, distinct, and rational roots", "$D = 25 - 24 = 1 > 0$ (perfect square)"),
            ("$x^2 - 4x + 1 = 0$", "IV", "Real, distinct, and irrational roots", "$D = 16 - 4 = 12 > 0$ (not a perfect square)"),
            ("$x^2 + 2x + 5 = 0$", "II", "Complex conjugate roots", "$D = 4 - 20 = -16 < 0$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Let $\alpha$ and $\beta$ be the roots of $2x^2 - 7x + 3 = 0$. Match the expressions in List I with their values in List II:",
        [
            ("$\alpha + \beta$", "IV", "$7/2$", "Sum of roots is $-b/a = -(-7)/2 = 7/2$"),
            ("$\alpha \beta$", "II", "$3/2$", "Product of roots is $c/a = 3/2$"),
            ("$\alpha^2 + \beta^2$", "I", "$37/4$", "$(\alpha+\beta)^2 - 2\alpha\beta = 49/4 - 3 = 37/4$"),
            ("$\frac{1}{\alpha} + \frac{1}{\beta}$", "III", "$7/3$", "$\frac{\alpha+\beta}{\alpha\beta} = \frac{7/2}{3/2} = 7/3$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the specified roots in List I with the corresponding monic quadratic equation $x^2 + bx + c = 0$ in List II:",
        [
            ("Roots are $3$ and $-5$", "II", "$x^2 + 2x - 15 = 0$", "Sum is $-2$, product is $-15 \implies x^2 + 2x - 15 = 0$"),
            ("Roots are $2 + \sqrt{3}$ and $2 - \sqrt{3}$", "IV", "$x^2 - 4x + 1 = 0$", "Sum is 4, product is $4 - 3 = 1 \implies x^2 - 4x + 1 = 0$"),
            ("Roots are $1 + 2i$ and $1 - 2i$", "I", "$x^2 - 2x + 5 = 0$", "Sum is 2, product is $1 - 4i^2 = 5 \implies x^2 - 2x + 5 = 0$"),
            ("Roots are $-1/2$ and $4$", "III", "$x^2 - \frac{7}{2}x - 2 = 0$", "Sum is $7/2$, product is $-2 \implies x^2 - \frac{7}{2}x - 2 = 0$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each quadratic function $f(x)$ in List I with its vertex coordinates $(h, k)$ in List II:",
        [
            ("$f(x) = x^2 - 4x + 7$", "II", "$(2, 3)$", "$h = 2$, $k = f(2) = 4 - 8 + 7 = 3$"),
            ("$f(x) = -x^2 + 6x - 5$", "IV", "$(3, 4)$", "$h = 3$, $k = f(3) = -9 + 18 - 5 = 4$"),
            ("$f(x) = 2x^2 - 8x + 3$", "I", "$(2, -5)$", "$h = 2$, $k = f(2) = 8 - 16 + 3 = -5$"),
            ("$f(x) = -2x^2 - 4x + 1$", "III", "$(-1, 3)$", "$h = -1$, $k = f(-1) = -2 + 4 + 1 = 3$")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Let $\alpha, \beta$ be the roots of $x^2 - 4x + 2 = 0$. Match the symmetric expressions in List I with their values in List II:",
        [
            ("$\alpha^3 + \beta^3$", "III", "40", "$(\alpha+\beta)^3 - 3\alpha\beta(\alpha+\beta) = 64 - 24 = 40$"),
            ("$(\alpha - \beta)^2$", "I", "8", "$(\alpha+\beta)^2 - 4\alpha\beta = 16 - 8 = 8$"),
            ("$\frac{\alpha}{\beta} + \frac{\beta}{\alpha}$", "IV", "6", "$\frac{\alpha^2+\beta^2}{\alpha\beta} = \frac{12}{2} = 6$"),
            ("$\alpha^4 + \beta^4$", "II", "136", "$(\alpha^2+\beta^2)^2 - 2(\alpha\beta)^2 = 144 - 8 = 136$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the pairs of equations in List I with the condition / value of $k$ for them to share a common root in List II:",
        [
            ("$x^2 - 5x + 6 = 0$ and $x^2 - 7x + k = 0$ share root $x = 2$", "II", "$k = 10$", "$2^2 - 7(2) + k = 0 \implies k = 10$"),
            ("$x^2 - 5x + 6 = 0$ and $x^2 - 7x + k = 0$ share root $x = 3$", "IV", "$k = 12$", "$3^2 - 7(3) + k = 0 \implies k = 12$"),
            ("$x^2 + kx + 1 = 0$ and $x^2 + x + k = 0$ share a root ($k \ne 1$)", "I", "$k = -2$", "Subtracting gives $(k-1)x = k-1 \implies x = 1 \implies 1 + k + 1 = 0 \implies k = -2$"),
            ("$2x^2 + kx - 5 = 0$ and $x^2 - 3x - 4 = 0$ share a positive root", "III", "$k = -27/4$", "Positive root is $x=4$: $2(16) + 4k - 5 = 0 \implies 4k = -27 \implies k = -27/4$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Consider the quadratic equation $x^2 - 2(k-1)x + (k+5) = 0$. Match the conditions on its roots in List I with the corresponding range of $k$ in List II:",
        [
            ("Both roots are strictly positive", "II", "$k \in [4, \infty)$", "$D \ge 0$, sum $2(k-1) > 0$, product $k+5 > 0$ gives $k \ge 4$"),
            ("Both roots are strictly negative", "IV", "$k \in (-5, -1]$", "$D \ge 0$, sum $2(k-1) < 0$, product $k+5 > 0$ gives $-5 < k \le -1$"),
            ("Roots have opposite signs", "I", "$k \in (-\infty, -5)$", "Product $k+5 < 0 \implies k < -5$, which automatically guarantees $D > 0$"),
            ("The equation has real and equal roots", "III", "$k \in \{-1, 4\}$", "Discriminant $D = 4(k-4)(k+1) = 0 \implies k = -1$ or $k = 4$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the rational functions $y = f(x)$ ($x \in \mathbb{R}$) in List I with their range of values in List II:",
        [
            ("$y = \frac{x^2 - x + 1}{x^2 + x + 1}$", "II", "$[1/3, 3]$", "Condition for real $x$: $(y+1)^2 - 4(y-1)^2 \ge 0 \implies y \in [1/3, 3]$"),
            ("$y = \frac{x}{x^2 + 1}$", "IV", "$[-1/2, 1/2]$", "$y x^2 - x + y = 0$. Real $x \implies 1 - 4y^2 \ge 0 \implies y \in [-1/2, 1/2]$"),
            ("$y = \frac{x^2 + 2x + 1}{x^2 + 2x + 2}$", "I", "$[0, 1)$", "$y = 1 - \frac{1}{(x+1)^2 + 1}$, with $(x+1)^2+1 \in [1, \infty) \implies y \in [0, 1)$"),
            ("$y = \frac{x^2 - 4}{x^2 + 4}$", "III", "$[-1, 1)$", "$y = 1 - \frac{8}{x^2 + 4}$, with $x^2+4 \in [4, \infty) \implies y \in [-1, 1)$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Let $\alpha, \beta$ be the roots of $x^2 - 6x - 2 = 0$, and let $a_n = \alpha^n + \beta^n$ for $n \ge 0$ (Newton's Sums). Match the expressions in List I with their numerical values in List II:",
        [
            ("$\frac{a_{10} - 2a_8}{2a_9}$", "III", "3", "Newton's identity gives $a_{10} - 6a_9 - 2a_8 = 0 \implies a_{10} - 2a_8 = 6a_9$, so ratio is 3"),
            ("$a_1 = \alpha + \beta$", "I", "6", "Sum of roots of $x^2 - 6x - 2 = 0$ is 6"),
            ("$a_2 = \alpha^2 + \beta^2$", "IV", "40", "$a_2 = 6a_1 + 2a_0 = 6(6) + 2(2) = 40$"),
            ("$a_3 = \alpha^3 + \beta^3$", "II", "252", "$a_3 = 6a_2 + 2a_1 = 6(40) + 2(6) = 252$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the equations reducible to quadratics in List I with their real solutions sets in List II:",
        [
            ("$x^4 - 5x^2 + 4 = 0$", "IV", "$\{\pm 1, \pm 2\}$", "Substitute $u = x^2$: $(u-1)(u-4) = 0 \implies x = \pm 1, \pm 2$"),
            ("$4^x - 3 \cdot 2^{x+2} + 32 = 0$", "II", "$\{2, 3\}$", "Substitute $u = 2^x$: $u^2 - 12u + 32 = 0 \implies u = 4, 8 \implies x = 2, 3$"),
            ("$(x + 1/x)^2 - (x + 1/x) - 2 = 0$", "III", "$\{1\}$", "Substitute $u = x+1/x$: $(u-2)(u+1) = 0$. Since $|u| \ge 2$, only $u = 2$ gives real root $x = 1$"),
            ("$\sqrt{x+5} - \sqrt{x} = 1$", "I", "$\{4\}$", "$\sqrt{x+5} = 1 + \sqrt{x} \implies x+5 = 1 + 2\sqrt{x} + x \implies \sqrt{x} = 2 \implies x = 4$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "If $\alpha, \beta$ are the roots of $x^2 - 3x + 1 = 0$, match the transformed quadratic equations in List I with their expressions in List II:",
        [
            ("Equation whose roots are $\alpha^2, \beta^2$", "II", "$x^2 - 7x + 1 = 0$", "$\alpha^2+\beta^2 = 9 - 2 = 7$, $\alpha^2\beta^2 = 1 \implies x^2 - 7x + 1 = 0$"),
            ("Equation whose roots are $\alpha+2, \beta+2$", "IV", "$x^2 - 7x + 11 = 0$", "Replace $x$ with $x-2$: $(x-2)^2 - 3(x-2) + 1 = 0 \implies x^2 - 7x + 11 = 0$"),
            ("Equation whose roots are $1/\alpha, 1/\beta$", "I", "$x^2 - 3x + 1 = 0$", "Replace $x$ with $1/x$: $(1/x)^2 - 3(1/x) + 1 = 0 \implies x^2 - 3x + 1 = 0$"),
            ("Equation whose roots are $2\alpha, 2\beta$", "III", "$x^2 - 6x + 4 = 0$", "Replace $x$ with $x/2$: $(x/2)^2 - 3(x/2) + 1 = 0 \implies x^2 - 6x + 4 = 0$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the sign conditions on the coefficients of $f(x) = ax^2 + bx + c$ ($a \ne 0$) in List I with the nature/location of its graph in List II:",
        [
            ("$a > 0$ and $b^2 - 4ac < 0$", "II", "Parabola opens upwards and lies entirely strictly above the $x$-axis", "Positive leading coefficient and no real roots means $f(x) > 0$ for all $x \in \mathbb{R}$"),
            ("$a < 0$ and $b^2 - 4ac < 0$", "IV", "Parabola opens downwards and lies entirely strictly below the $x$-axis", "Negative leading coefficient and no real roots means $f(x) < 0$ for all $x \in \mathbb{R}$"),
            ("$a > 0, b < 0, c > 0$ and $b^2 - 4ac > 0$", "I", "Parabola opens upwards and intersects the positive $x$-axis at two distinct points", "Both sum $-b/a > 0$ and product $c/a > 0$ are positive with $D > 0$"),
            ("$a > 0, c < 0$", "III", "Parabola opens upwards and intersects the $x$-axis at one positive and one negative root", "Product of roots $c/a < 0$, guaranteeing two real roots of opposite signs")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For the quadratic equation $x^2 - (a-3)x + a = 0$, match the conditions on roots in List I with the values/intervals of $a \in \mathbb{R}$ in List II:",
        [
            ("Both roots are strictly greater than 2", "III", "$[9, 10)$", "$D \ge 0 \implies a \in (-\infty, 1] \cup [9, \infty)$, vertex $> 2 \implies a > 7$, and $f(2) > 0 \implies a < 10$"),
            ("Both roots are strictly less than 2", "I", "$(-\infty, 1]$", "$D \ge 0 \implies a \le 1$ or $a \ge 9$, vertex $< 2 \implies a < 7$, and $f(2) > 0 \implies a < 10$, giving $a \le 1$"),
            ("The number 2 lies strictly between the roots", "IV", "$(10, \infty)$", "$1 \cdot f(2) < 0 \implies 10 - a < 0 \implies a > 10$"),
            ("The equation has real and equal roots", "II", "$\{1, 9\}$", "Discriminant $D = (a-1)(a-9) = 0 \implies a = 1$ or $a = 9$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the systems and coupled quadratic conditions in List I with their solutions in List II:",
        [
            ("Equations $x^2 + ax + 1 = 0$ and $x^2 + x + a = 0$ have a common root", "IV", "$a = 1$ or $a = -2$", "If both roots common $a=1$; if one common root, subtracting gives $(a-1)x = a-1 \implies x=1 \implies a=-2$"),
            ("Equations $x^2 - bx + c = 0$ and $x^2 - cx + b = 0$ ($b \ne c$) have a common root", "II", "$b + c = -1$", "Subtracting gives $(c-b)x + c-b = 0 \implies x = -1 \implies 1 + b + c = 0 \implies b+c = -1$"),
            ("Number of real solutions to $x^2 + |x| - 6 = 0$", "I", "2", "$(|x|+3)(|x|-2) = 0 \implies |x| = 2 \implies x = \pm 2$"),
            ("Number of real solutions to $x^2 - 3|x| + 2 = 0$", "III", "4", "$(|x|-1)(|x|-2) = 0 \implies |x| = 1$ or $2 \implies x = \pm 1, \pm 2$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Consider the equation $x^2 - kx + 2k = 0$ where $k$ is an integer. Match each property of its roots in List I with the set of all integers $k$ in List II:",
        [
            ("All integers $k$ for which both roots are non-real complex numbers", "II", "$\{1, 2, 3, 4, 5, 6, 7\}$", "$D = k(k-8) < 0 \iff 0 < k < 8$"),
            ("All integers $k$ for which roots are equal integers", "IV", "$\{0, 8\}$", "$D = k^2 - 8k = 0 \implies k = 0$ or $k = 8$"),
            ("All integers $k$ for which both roots are distinct positive integers", "I", "$\{9\}$", "For $k=9$, $x^2 - 9x + 18 = 0 \implies x = 3, 6$"),
            ("Integer $k$ for which roots are integers of opposite sign", "III", "$\{-1\}$", "For $k=-1$, $x^2 + x - 2 = 0 \implies x = -2, 1$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each quadratic inequality involving absolute values in List I with its solution set in List II ($x \in \mathbb{R}$):",
        [
            ("$|x^2 - 1| \le 3$", "II", "$[-2, 2]$", "$-3 \le x^2 - 1 \le 3 \implies 0 \le x^2 \le 4 \implies -2 \le x \le 2$"),
            ("$x^2 - 4|x| + 3 < 0$", "IV", "$(-3, -1) \cup (1, 3)$", "$(|x|-1)(|x|-3) < 0 \implies 1 < |x| < 3 \implies x \in (-3, -1) \cup (1, 3)$"),
            ("$|x^2 - 5x + 6| \le x - 2$", "I", "$[2, 4]$", "For $x \ge 2$, divide by $x-2 > 0$: $-1 \le x - 3 \le 1 \implies 2 \le x \le 4$"),
            ("$x^2 - 2|x| - 8 \ge 0$", "III", "$(-\infty, -4] \cup [4, \infty)$", "$(|x|-4)(|x|+2) \ge 0 \implies |x| \ge 4 \implies x \in (-\infty, -4] \cup [4, \infty)$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Let $\alpha, \beta$ be the roots of $x^2 - x - 1 = 0$, with Lucas numbers $L_n = \alpha^n + \beta^n$. Match the terms in List I with their values in List II:",
        [
            ("$L_2 = \alpha^2 + \beta^2$", "III", "3", "$(\alpha+\beta)^2 - 2\alpha\beta = 1 - 2(-1) = 3$"),
            ("$L_3 = \alpha^3 + \beta^3$", "I", "4", "$L_3 = L_2 + L_1 = 3 + 1 = 4$"),
            ("$L_4 = \alpha^4 + \beta^4$", "IV", "7", "$L_4 = L_3 + L_2 = 4 + 3 = 7$"),
            ("$L_5 = \alpha^5 + \beta^5$", "II", "11", "$L_5 = L_4 + L_3 = 7 + 4 = 11$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the parameter conditions for a quadratic expression $f(x)$ to satisfy the given sign condition for all $x \in \mathbb{R}$ in List I with List II:",
        [
            ("$(m-1)x^2 + 2(m-1)x + 1 > 0$ for all $x \in \mathbb{R}$", "IV", "$m \in [1, 2)$", "For $m=1$, $1 > 0$ holds. For $m \ne 1$, $m-1 > 0$ and $D/4 = (m-1)(m-2) < 0 \implies 1 < m < 2$. Combined $[1, 2)$"),
            ("$x^2 - 2mx + (m^2 + m - 3) \ge 0$ for all $x \in \mathbb{R}$", "II", "$m \in [3, \infty)$", "$D/4 = m^2 - (m^2 + m - 3) = 3 - m \le 0 \implies m \ge 3$"),
            ("$-x^2 + 2mx - 9 < 0$ for all $x \in \mathbb{R}$", "I", "$m \in (-3, 3)$", "Leading coefficient $-1 < 0$, $D/4 = m^2 - 9 < 0 \implies m \in (-3, 3)$"),
            ("$x^2 + mx + 4 > 0$ for all $x \in \mathbb{R}$", "III", "$m \in (-4, 4)$", "$D = m^2 - 16 < 0 \implies m \in (-4, 4)$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the cubic and higher-order equations with their roots related to quadratics in List I with List II:",
        [
            ("Roots of $x^3 - 6x^2 + 11x - 6 = 0$", "II", "$\{1, 2, 3\}$", "$(x-1)(x-2)(x-3) = 0 \implies x = 1, 2, 3$"),
            ("Roots of $x^3 - 7x + 6 = 0$", "IV", "$\{1, 2, -3\}$", "$(x-1)(x-2)(x+3) = 0 \implies x = 1, 2, -3$"),
            ("Roots of $x^3 - 3x^2 + 4 = 0$", "I", "$\{-1, 2\}$ (with 2 repeated)", "$(x+1)(x-2)^2 = 0 \implies x = -1, 2$"),
            ("Roots of $x^4 - 10x^2 + 9 = 0$", "III", "$\{\pm 1, \pm 3\}$", "$(x^2-1)(x^2-9) = 0 \implies x = \pm 1, \pm 3$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each quadratic optimization problem in List I with its optimal value in List II:",
        [
            ("Minimum distance squared from origin to parabola $y = x^2 - 2$", "II", "$7/4$", "$d^2 = x^4 - 3x^2 + 4$. For $u = x^2 \ge 0$, vertex is at $u = 3/2$, minimum is $9/4 - 9/2 + 4 = 7/4$"),
            ("Maximum value of $f(x) = (x-1)(5-x)$ for $x \in \mathbb{R}$", "IV", "4", "Roots at 1 and 5, vertex at $x = 3 \implies f(3) = 2 \times 2 = 4$"),
            ("Minimum value of $f(x) = 2x^2 - 4x + 7$", "I", "5", "$f(x) = 2(x-1)^2 + 5$, minimum is 5 at $x=1$"),
            ("Minimum value of $x + \frac{9}{x}$ for $x > 0$", "III", "6", "By AM-GM, $x + 9/x \ge 2\sqrt{9} = 6$, equality at $x=3$")
        ], "D"))

    # ==================================================
    # TOPIC 4: Linear Inequalities (20 questions)
    # ==================================================
    t = "Linear Inequalities"
    prefix = "math_mat_lineq"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each 1D linear inequality in List I with its solution set in List II ($x \in \mathbb{R}$):",
        [
            ("$3x - 7 < 5x + 1$", "III", "$(-4, \infty)$", "$3x - 5x < 1 + 7 \implies -2x < 8 \implies x > -4$"),
            ("$-2x + 5 \ge 11$", "I", "$(-\infty, -3]$", "$-2x \ge 6 \implies x \le -3$"),
            ("$4(x - 2) \le 3(x + 1)$", "IV", "$(-\infty, 11]$", "$4x - 8 \le 3x + 3 \implies x \le 11$"),
            ("$\frac{x}{3} + 1 > \frac{x}{2} - 2$", "II", "$(-\infty, 18)$", "$2x + 6 > 3x - 12 \implies -x > -18 \implies x < 18$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each absolute value inequality in List I with its solution interval in List II ($x \in \mathbb{R}$):",
        [
            ("$|x - 3| \le 5$", "IV", "$[-2, 8]$", "$-5 \le x - 3 \le 5 \implies -2 \le x \le 8$"),
            ("$|2x + 1| < 7$", "II", "$(-4, 3)$", "$-7 < 2x + 1 < 7 \implies -8 < 2x < 6 \implies -4 < x < 3$"),
            ("$|x + 4| \ge 2$", "I", "$(-\infty, -6] \cup [-2, \infty)$", "$x+4 \le -2 \implies x \le -6$ or $x+4 \ge 2 \implies x \ge -2$"),
            ("$|3x - 6| > 9$", "III", "$(-\infty, -1) \cup (5, \infty)$", "$3x-6 < -9 \implies x < -1$ or $3x-6 > 9 \implies x > 5$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each double inequality in List I with its solution set in List II ($x \in \mathbb{R}$):",
        [
            ("$-3 \le 2x - 5 < 7$", "II", "$[1, 6)$", "Add 5: $2 \le 2x < 12 \implies 1 \le x < 6$"),
            ("$1 < 4 - 3x \le 10$", "IV", "$[-2, 1)$", "Subtract 4: $-3 < -3x \le 6 \implies 1 > x \ge -2 \implies [-2, 1)$"),
            ("$-5 \le \frac{2-3x}{4} \le 7$", "I", "$[-26/3, 22/3]$", "Multiply by 4: $-20 \le 2-3x \le 28 \implies -26/3 \le x \le 22/3$"),
            ("$0 \le 5x + 10 < 25$", "III", "$[-2, 3)$", "Subtract 10: $-10 \le 5x < 15 \implies -2 \le x < 3$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each interval notation in List I with its algebraic set-builder definition in List II:",
        [
            ("$[a, b]$", "II", "$\{x \in \mathbb{R} : a \le x \le b\}$", "Closed interval includes both endpoints"),
            ("$(a, b)$", "IV", "$\{x \in \mathbb{R} : a < x < b\}$", "Open interval excludes both endpoints"),
            ("$[a, b)$", "I", "$\{x \in \mathbb{R} : a \le x < b\}$", "Half-open interval includes left endpoint and excludes right endpoint"),
            ("$(a, b]$", "III", "$\{x \in \mathbb{R} : a < x \le b\}$", "Half-open interval excludes left endpoint and includes right endpoint")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each system of simultaneous linear inequalities in List I with its solution set in List II:",
        [
            ("$2x - 3 < 5$ and $3x + 1 \ge -5$", "III", "$[-2, 4)$", "$x < 4$ and $x \ge -2 \implies [-2, 4)$"),
            ("$4x + 3 \ge 2x + 7$ and $2(x - 1) < x + 3$", "I", "$[2, 5)$", "$2x \ge 4 \implies x \ge 2$; $2x - 2 < x + 3 \implies x < 5 \implies [2, 5)$"),
            ("$3x - 1 > 5$ and $2 - x > 4$", "IV", "$\emptyset$ (no solution)", "$x > 2$ and $x < -2$: no overlap"),
            ("$5x - 7 < 3(x + 3)$ and $1 - 2x \le 5 - 4x$", "II", "$(-\infty, 2]$", "$2x < 16 \implies x < 8$; $2x \le 4 \implies x \le 2 \implies (-\infty, 2]$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the compound absolute value inequalities in List I with their solution sets in List II:",
        [
            ("$1 \le |x - 2| \le 4$", "II", "$[-2, 1] \cup [3, 6]$", "$|x-2| \le 4 \implies -2 \le x \le 6$; $|x-2| \ge 1 \implies x \le 1$ or $x \ge 3$"),
            ("$2 < |2x + 3| \le 7$", "IV", "$[-5, -5/2) \cup (-1/2, 2]$", "$-7 \le 2x+3 \le 7 \implies -5 \le x \le 2$; $|2x+3| > 2 \implies x < -5/2$ or $x > -1/2$"),
            ("$0 < |x - 1| < 3$", "I", "$(-2, 1) \cup (1, 4)$", "$|x-1| < 3 \implies -2 < x < 4$, and $|x-1| > 0 \implies x \ne 1$"),
            ("$3 \le |x| < 5$", "III", "$(-5, -3] \cup [3, 5)$", "$3 \le x < 5$ or $-5 < x \le -3$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each rational linear inequality in List I with its solution set in List II:",
        [
            ("$\frac{x - 1}{x + 3} > 0$", "II", "$(-\infty, -3) \cup (1, \infty)$", "Signs change at $-3$ and $1$. Both factors have same sign for $x < -3$ or $x > 1$"),
            ("$\frac{2x + 3}{x - 4} \le 1$", "IV", "$[-7, 4)$", "$\frac{2x+3 - (x-4)}{x-4} \le 0 \implies \frac{x+7}{x-4} \le 0 \implies x \in [-7, 4)$"),
            ("$\frac{x + 2}{x - 1} \ge 2$", "I", "$(1, 4]$", "$\frac{x+2 - 2(x-1)}{x-1} \ge 0 \implies \frac{4-x}{x-1} \ge 0 \implies x \in (1, 4]$"),
            ("$\frac{3}{x - 2} < 1$", "III", "$(-\infty, 2) \cup (5, \infty)$", "$\frac{3 - (x-2)}{x-2} < 0 \implies \frac{5-x}{x-2} < 0 \implies x < 2$ or $x > 5$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each linear inequality in two variables in List I with the correct description of its half-plane in List II:",
        [
            ("$2x + 3y \le 6$", "II", "Closed half-plane containing the origin $(0, 0)$", "At $(0,0)$, $0 \le 6$ is true, boundary line included"),
            ("$x - y > 2$", "IV", "Open half-plane strictly not containing the origin $(0, 0)$", "At $(0,0)$, $0 > 2$ is false, boundary line excluded"),
            ("$3x - 4y \ge 12$", "I", "Closed half-plane not containing the origin $(0, 0)$", "At $(0,0)$, $0 \ge 12$ is false, boundary line included"),
            ("$y < 2x$", "III", "Open half-plane below the line $y = 2x$ passing through the origin", "Test point $(1, 0)$: $0 < 2$ is true, boundary line excluded")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each system of linear inequalities in List I with the complete set of vertices of its bounded feasible region in List II:",
        [
            ("$x \ge 0, y \ge 0, x + y \le 4, 2x + y \le 6$", "III", "$\{(0,0), (3,0), (2,2), (0,4)\}$", "Intersections: $(0,0)$, $(3,0)$, $(0,4)$, intersection of lines is $(2,2)$"),
            ("$x \ge 0, y \ge 0, x + 2y \le 8, 3x + 2y \le 12$", "I", "$\{(0,0), (4,0), (2,3), (0,4)\}$", "Intersections: $(0,0)$, $(4,0)$, $(0,4)$, intersection of lines is $(2,3)$"),
            ("$x \ge 0, y \ge 0, x \le 3, y \le 4$", "IV", "$\{(0,0), (3,0), (3,4), (0,4)\}$", "Rectangle with opposite corners $(0,0)$ and $(3,4)$"),
            ("$x \ge 0, y \ge 0, x + y \le 5$", "II", "$\{(0,0), (5,0), (0,5)\}$", "Right triangle with intercepts at $(5,0)$ and $(0,5)$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the conditions on real numbers $x, y$ in List I with the necessary and sufficient relations on $x, y$ in List II:",
        [
            ("$|x + y| = |x| + |y|$", "IV", "$xy \ge 0$", "Equality in triangle inequality holds if and only if $x, y$ have same sign"),
            ("$|x - y| = |x| + |y|$", "II", "$xy \le 0$", "Equality holds if and only if $x, y$ have opposite signs"),
            ("$|x + y| = |x - y|$", "I", "$xy = 0$", "Squaring gives $4xy = 0 \implies xy = 0$"),
            ("$|x + y| < |x| + |y|$", "III", "$xy < 0$", "Strict triangle inequality holds if and only if $x, y$ have strictly opposite signs")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each inequality condition in List I with the total number of integer solutions in List II:",
        [
            ("$|2x - 1| \le 7$ for $x \in \mathbb{Z}$", "II", "8", "$-3 \le x \le 4$: integers $-3, -2, -1, 0, 1, 2, 3, 4$, count is 8"),
            ("$|3x + 2| < 10$ for $x \in \mathbb{Z}^+$ (positive integers)", "IV", "2", "$-4 < x < 8/3$: positive integers 1, 2, count is 2"),
            ("$x^2 - 4x \le 5$ for $x \in \mathbb{Z}$", "I", "7", "$-1 \le x \le 5$: integers $-1, 0, 1, 2, 3, 4, 5$, count is 7"),
            ("$\frac{x-1}{x-4} \le 0$ for $x \in \mathbb{Z}$", "III", "3", "$1 \le x < 4$: integers 1, 2, 3, count is 3")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Consider the feasible region with vertices $O(0,0), A(4,0), B(3,2), C(0,4)$. Match the linear objective functions in List I with their maximum values over this region in List II:",
        [
            ("$Z = 3x + 2y$", "II", "13", "At $(3, 2)$, $Z = 3(3) + 2(2) = 13$, which is the maximum"),
            ("$Z = 5x + y$", "IV", "20", "At $(4, 0)$, $Z = 5(4) + 0 = 20$, which is the maximum"),
            ("$Z = x + 3y$", "I", "12", "At $(0, 4)$, $Z = 0 + 3(4) = 12$, which is the maximum"),
            ("$Z = 2x + 4y$", "III", "16", "At $(0, 4)$, $Z = 2(0) + 4(4) = 16$, which is the maximum")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each inequality involving sums of absolute values in List I with its solution set in List II ($x \in \mathbb{R}$):",
        [
            ("$|x - 1| + |x - 3| \le 4$", "III", "$[0, 4]$", "Using critical points 1 and 3, test each region: union is $[0, 4]$"),
            ("$|x + 2| + |x - 1| = 3$", "I", "$[-2, 1]$", "Equality holds where $(x+2)$ and $(1-x)$ have same sign, i.e., $x \in [-2, 1]$"),
            ("$|x| + |x - 2| \ge 4$", "IV", "$(-\infty, -1] \cup [3, \infty)$", "Outside $[0, 2]$, solving $-2x+2 \ge 4 \implies x \le -1$ and $2x-2 \ge 4 \implies x \ge 3$"),
            ("$|2x - 1| + |2x - 5| \le 6$", "II", "$[0, 3]$", "Inside $[1/2, 5/2]$ sum is 4; extending left gives $x \ge 0$, right gives $x \le 3$, yielding $[0, 3]$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the 2D regions defined by inequalities in List I with their enclosed areas in List II:",
        [
            ("$|x| + |y| \le 2$", "IV", "8", "Square with vertices at $(\pm 2, 0)$ and $(0, \pm 2)$, diagonals are 4, area $= \frac{1}{2} \times 4 \times 4 = 8$"),
            ("$|x - 1| + |y - 2| \le 3$", "II", "18", "Translated square with semi-diagonals 3, diagonals 6, area $= \frac{1}{2} \times 6 \times 6 = 18$"),
            ("$|2x| + |3y| \le 6$", "I", "12", "Rhombus with intercepts at $(\pm 3, 0)$ and $(0, \pm 2)$, diagonals 6 and 4, area $= \frac{1}{2} \times 6 \times 4 = 12$"),
            ("$x \ge 0, y \ge 0, x + y \le 4, 3x + y \le 6$", "III", "5", "Vertices $(0,0), (2,0), (1,3), (0,4)$. Quadrilateral area is $3 + 2 = 5$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Consider parameter dependent inequalities. Match each statement in List I with the set of values of $k$ in List II:",
        [
            ("$kx^2 - 4x + k > 0$ for all $x \in \mathbb{R}$", "II", "$(2, \infty)$", "$k > 0$ and $D = 16 - 4k^2 < 0 \implies k^2 > 4 \implies k > 2$"),
            ("$kx^2 - 4x + k < 0$ for all $x \in \mathbb{R}$", "IV", "$(-\infty, -2)$", "$k < 0$ and $D = 16 - 4k^2 < 0 \implies k < -2$"),
            ("The system $x + y \le 2$ and $x + y \ge k$ has a non-empty feasible region in the first quadrant ($x \ge 0, y \ge 0$)", "I", "$k \le 2$", "The line $x+y=k$ intersects the triangle $x\ge 0, y\ge 0, x+y\le 2$ as long as $k \le 2$"),
            ("The inequality $|x - k| \le 3$ has all its solutions contained within $[-1, 7]$", "III", "$[2, 4]$", "Solution $[k-3, k+3] \subseteq [-1, 7] \iff k-3 \ge -1$ and $k+3 \le 7 \implies k \in [2, 4]$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each fractional inequality with absolute values in List I with its solution set in List II ($x \in \mathbb{R}$):",
        [
            ("$\frac{|x| - 1}{|x| - 2} \le 0$", "II", "$(-2, -1] \cup [1, 2)$", "Let $u = |x| \ge 0$: $\frac{u-1}{u-2} \le 0 \implies 1 \le u < 2 \implies 1 \le |x| < 2 \implies x \in (-2, -1] \cup [1, 2)$"),
            ("$\frac{|x - 1| - 2}{|x - 1| - 3} < 0$", "IV", "$(-2, -1) \cup (3, 4)$", "$2 < |x-1| < 3 \implies x-1 \in (-3, -2) \cup (2, 3) \implies x \in (-2, -1) \cup (3, 4)$"),
            ("$\left|\frac{x + 1}{x - 1}\right| \le 1$", "I", "$(-\infty, 0]$", "For $x \ne 1$: $(x+1)^2 \le (x-1)^2 \implies 4x \le 0 \implies x \le 0$"),
            ("$\frac{1}{|x| - 3} > 0$", "III", "$(-\infty, -3) \cup (3, \infty)$", "$|x| - 3 > 0 \implies |x| > 3 \implies x \in (-\infty, -3) \cup (3, \infty)$")
        ], "D"))
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the linear inequalities involving floor $\lfloor x \rfloor$ and fractional part $\{x\}$ in List I with their solution sets in List II:",
        [
            ("$\lfloor x \rfloor \le x - 1/2$", "III", "$\bigcup_{k \in \mathbb{Z}} [k + 1/2, k + 1)$", "Equivalent to $\{x\} \ge 1/2$, true on $[k+1/2, k+1)$ for each integer $k$"),
            ("$\lfloor x \rfloor = 2x - 1$", "I", "$\{1/2, 1\}$", "Writing $x = n+f$ gives $2f = 1-n \in [0, 2)$, yielding solutions $1/2$ and $1$"),
            ("$\lfloor 2x \rfloor = 3$", "IV", "$[3/2, 2)$", "Definition of floor gives $3 \le 2x < 4 \implies 3/2 \le x < 2$"),
            ("$\lfloor x \rfloor > 2x$", "II", "$(-\infty, -1/2)$", "Testing integer intervals shows that $\lfloor x \rfloor > 2x$ holds for all $x < -1/2$")
        ], "A"))
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Consider the system of inequalities: $x \ge 0, y \ge 0, x + 2y \le 10, 3x + y \le 15, x + y \le 7$. Match each linear objective function in List I with its maximum value in List II:",
        [
            ("$Z = 2x + 5y$", "IV", "25", "Evaluated at vertices $(0,0), (5,0), (4,3), (0,5)$: maximum occurs at $(0,5)$ with $Z = 25$"),
            ("$Z = 5x + 2y$", "II", "26", "Maximum occurs at $(4, 3)$ with $Z = 5(4) + 2(3) = 26$"),
            ("$Z = 3x + 4y$", "I", "24", "Maximum occurs at $(4, 3)$ with $Z = 3(4) + 4(3) = 24$"),
            ("$Z = x + 6y$", "III", "30", "Maximum occurs at $(0, 5)$ with $Z = 0 + 6(5) = 30$")
        ], "B"))
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the multidimensional linear constraint systems in List I with their geometric properties in List II:",
        [
            ("$x + y \ge 4, x \ge 0, y \ge 0$ with objective $Z = 2x + 3y$", "II", "Unbounded feasible region with minimum value 8 and no maximum", "The region extends indefinitely into the first quadrant; minimum occurs at $(4, 0)$ with $Z = 8$"),
            ("$x - y \ge 1, x - y \le -1, x \ge 0, y \ge 0$", "IV", "Empty feasible region (infeasible system)", "The two half-planes $x - y \ge 1$ and $x - y \le -1$ are disjoint parallel strips"),
            ("$x + y \le 2, x + y \ge 5, x \ge 0, y \ge 0$", "I", "Inconsistent system with empty solution set", "No point $(x, y)$ can satisfy both $x+y \le 2$ and $x+y \ge 5$"),
            ("$x + y \le 4, x \ge 0, y \ge 0$ with objective $Z = 2x + 2y$", "III", "Infinite number of optimal solutions along the boundary line segment", "Objective function line is parallel to the boundary constraint $x+y=4$, giving maximum 8 at every point on the segment joining $(4,0)$ and $(0,4)$")
        ], "C"))
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "For non-negative real numbers $x_1, x_2, \dots, x_n$ satisfying linear constraints, match each optimization problem in List I with its extremum value in List II:",
        [
            ("Minimum of $x_1^2 + x_2^2 + x_3^2$ subject to $x_1 + x_2 + x_3 = 6$ ($x_i \in \mathbb{R}$)", "II", "12", "By Cauchy-Schwarz, $(x_1+x_2+x_3)^2 \le 3(x_1^2+x_2^2+x_3^2) \implies 36 \le 3S \implies S \ge 12$"),
            ("Maximum of $x_1 x_2 x_3$ subject to $x_1 + x_2 + x_3 = 6$ ($x_i \ge 0$)", "IV", "8", "By AM-GM, $\frac{x_1+x_2+x_3}{3} = 2 \ge (x_1 x_2 x_3)^{1/3} \implies x_1 x_2 x_3 \le 2^3 = 8$"),
            ("Minimum of $\frac{1}{x_1} + \frac{1}{x_2} + \frac{1}{x_3}$ subject to $x_1 + x_2 + x_3 = 6$ ($x_i > 0$)", "I", "$3/2$", "By AM-HM, $\frac{x_1+x_2+x_3}{3} \ge \frac{3}{1/x_1 + 1/x_2 + 1/x_3} \implies 2 \ge \frac{3}{S} \implies S \ge 3/2$"),
            ("Maximum of $x_1^2 + x_2^2 + x_3^2$ subject to $x_1 + x_2 + x_3 = 6$ with $x_i \ge 0$", "III", "36", "Convex function over simplex attains maximum at an extreme vertex: $(6,0,0) \implies 6^2 + 0 + 0 = 36$")
        ], "D"))

    return qs
