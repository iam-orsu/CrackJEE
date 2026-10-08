# CrackJEE API Reference

Backend runs on port **3001**. Frontend runs on port **3000**.

All requests and responses use `application/json`. Every response has a `success` boolean at the top level.

---

## Base URL

```
http://localhost:3001
```

In production, the Nginx proxy routes `/api/*` from port 443 to port 3001.

---

## Authentication

Protected endpoints require a JWT Bearer token.

```
Authorization: Bearer <token>
```

Get the token from `/api/auth/login` or `/api/auth/register`. Tokens expire after **24 hours**.

When a request is rejected, you get:

```json
{ "success": false, "error": "Invalid or expired token" }
```

---

## Rate Limits

| Scope | Limit | Window | Endpoints |
|-------|-------|--------|-----------|
| Auth | 5 requests | 15 min | POST /api/auth/register, POST /api/auth/login |
| Question generation | 100 requests | 1 hour | GET /api/questions/next, POST /api/questions/batch |
| Global | 60 requests | 1 min | All endpoints |

Rate limited responses return HTTP 429.

---

## Error Format

Every error follows the same shape:

```json
{ "success": false, "error": "Human readable message" }
```

Common status codes:

| Code | Meaning |
|------|---------|
| 400 | Validation error — check the `error` field |
| 401 | Missing or expired token |
| 404 | Resource not found |
| 409 | Conflict — e.g. email already registered |
| 429 | Rate limit exceeded |
| 503 | Database is down |

---

## Endpoints

### Auth

---

#### POST /api/auth/register

Create a new student account.

**Request body:**

```json
{
  "name": "Arjun",
  "email": "arjun@example.com",
  "password": "mypassword123",
  "class": "12",
  "targetExam": "Main",
  "currentLevel": "beginner"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | 2 to 100 chars |
| email | string | yes | valid email |
| password | string | yes | 8 to 128 chars |
| class | `"11"` `"12"` `"Dropper"` | yes | |
| targetExam | `"Main"` `"Advanced"` `"Both"` | yes | |
| currentLevel | `"beginner"` `"intermediate"` `"advanced"` | no | default: `"beginner"` |

**Response 201:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "uuid",
      "name": "Arjun",
      "email": "arjun@example.com",
      "class": "12",
      "targetExam": "Main",
      "currentLevel": "beginner"
    }
  }
}
```

---

#### POST /api/auth/login

Sign in and get a token.

**Request body:**

```json
{
  "email": "arjun@example.com",
  "password": "mypassword123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "uuid",
      "name": "Arjun",
      "email": "arjun@example.com",
      "class": "12",
      "targetExam": "Main",
      "currentLevel": "beginner"
    }
  }
}
```

---

#### GET /api/auth/me

> Requires auth

Get the current user's profile.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Arjun",
    "email": "arjun@example.com",
    "class": "12",
    "targetExam": "Main",
    "currentLevel": "intermediate",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Questions

All question endpoints require auth.

---

#### GET /api/questions/next

> Requires auth | Rate limited: 100/hour

Generate one AI question on demand. Calls DeepSeek for generation and OpenAI for validation. Uses Redis cache to avoid regenerating the same topic/difficulty combinations.

**Query params:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| subject | `"Mathematics"` `"Physics"` `"Chemistry"` | yes | |
| topic | string | yes | Must be a valid topic for the subject and class |
| difficulty | `"beginner"` `"intermediate"` `"advanced"` | no | default: `"intermediate"` |
| examType | `"Main"` `"Advanced"` `"Both"` | no | default: `"Main"` |
| studentClass | `"11"` `"12"` `"Dropper"` | no | default: `"12"` |

**Example request:**

```
GET /api/questions/next?subject=Mathematics&topic=Circles&difficulty=intermediate&studentClass=12
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "topic": "Circles",
    "subject": "Mathematics",
    "questionText": "A chord of a circle of radius 10 cm subtends a right angle at the centre. Find the area of the minor segment.",
    "options": ["28.5 cm²", "32.5 cm²", "25.0 cm²", "35.4 cm²"],
    "difficulty": "intermediate",
    "examType": "Main",
    "diagram": null
  }
}
```

The `diagram` field is either `null` or a template object the frontend renders as an SVG. The response **never** includes the answer or explanation. Submit the answer to get those back.

---

#### POST /api/questions/batch

> Requires auth | Rate limited: 100/hour

Generate multiple questions in one call. Used for practice test mode.

**Request body:**

```json
{
  "selections": [
    { "subject": "Physics",     "topic": "Laws of Motion" },
    { "subject": "Mathematics", "topic": "Circles" },
    { "subject": "Chemistry",   "topic": "Chemical Bonding" }
  ],
  "count": 5,
  "difficulty": "intermediate",
  "examType": "Main",
  "studentClass": "12"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| selections | array of `{subject, topic}` | yes | 1 to 150 items |
| count | number | no | 1 to 100, default: 10 |
| difficulty | `"beginner"` `"intermediate"` `"advanced"` `"mixed"` | no | default: `"mixed"` |
| examType | `"Main"` `"Advanced"` `"Both"` | no | default: `"Main"` |
| studentClass | `"11"` `"12"` `"Dropper"` | no | default: `"12"` |

**Response 200:**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "topic": "Laws of Motion", "subject": "Physics", "questionText": "...", "options": ["...", "...", "...", "..."], "difficulty": "intermediate", "examType": "Main", "diagram": null },
    { "id": "uuid", "topic": "Circles", "subject": "Mathematics", "questionText": "...", "options": ["...", "...", "...", "..."], "difficulty": "intermediate", "examType": "Main", "diagram": null }
  ]
}
```

---

#### GET /api/questions/topics

> Requires auth

List all valid topics. Pass these exact strings when calling `/next` or `/batch`.

**Query params (both optional):**

| Param | Type | Notes |
|-------|------|-------|
| subject | `"Mathematics"` `"Physics"` `"Chemistry"` | Omit to get all three |
| studentClass | `"11"` `"12"` `"Dropper"` | Filters by class syllabus, default: `"12"` |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "Mathematics": ["Sets", "Circles", "Quadratic Equations", "Conic Sections", "..."],
    "Physics":     ["Laws of Motion", "Waves", "Electrostatics", "..."],
    "Chemistry":   ["Chemical Bonding", "Electrochemistry", "Organic Chemistry Basics", "..."]
  }
}
```

---

### Answers

---

#### POST /api/answers/submit

> Requires auth

Submit an answer. Returns whether it was correct, the right answer, and an explanation. Also updates the student's topic progress automatically.

**Request body:**

```json
{
  "questionId": "uuid-from-question-response",
  "answer": "B",
  "timeSpent": 87
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| questionId | string | yes | The `id` from the question response |
| answer | `"A"` `"B"` `"C"` `"D"` | yes | Single uppercase letter |
| timeSpent | number | yes | Seconds spent, 0 to 3600 |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "isCorrect": false,
    "correctAnswer": "B",
    "explanation": "The area of a sector with angle 90 is (90/360) * π * r² = 78.5 cm². Subtract the triangle area of 50 cm² to get 28.5 cm²."
  }
}
```

A topic is automatically flagged as weak when the success rate drops below 60% after 3 or more attempts.

---

### Progress

All progress endpoints require auth.

---

#### GET /api/user/dashboard

> Requires auth

Full dashboard data in a single call. Returns stats, weak areas, recent activity, weekly chart data, and per-subject accuracy.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalAttempts": 142,
      "correctAttempts": 98,
      "accuracy": 69
    },
    "weakAreas": [
      {
        "id": "uuid",
        "topicName": "Rotational Motion",
        "subject": "Physics",
        "attempts": 8,
        "correctCount": 3,
        "successRate": 0.375,
        "markedAsWeak": true,
        "lastAttemptAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "recentActivity": [
      {
        "id": "uuid",
        "isCorrect": true,
        "timeSpent": 87,
        "createdAt": "2025-01-15T10:00:00.000Z",
        "question": {
          "topic": "Circles",
          "subject": "Mathematics",
          "difficulty": "intermediate"
        }
      }
    ],
    "weeklyStats": [
      { "date": "2025-01-09", "total": 12, "correct": 9 },
      { "date": "2025-01-10", "total": 8,  "correct": 5 },
      { "date": "2025-01-11", "total": 15, "correct": 11 },
      { "date": "2025-01-12", "total": 0,  "correct": 0 },
      { "date": "2025-01-13", "total": 20, "correct": 14 },
      { "date": "2025-01-14", "total": 18, "correct": 13 },
      { "date": "2025-01-15", "total": 9,  "correct": 7 }
    ],
    "subjectAccuracy": [
      { "subject": "Physics",     "accuracy": 74, "attempts": 50 },
      { "subject": "Mathematics", "accuracy": 68, "attempts": 60 },
      { "subject": "Chemistry",   "accuracy": 58, "attempts": 32 }
    ]
  }
}
```

`weeklyStats` always has exactly 7 entries for the last 7 calendar days. `subjectAccuracy` always has all 3 subjects even if attempts is 0.

---

#### GET /api/progress/weak-areas

> Requires auth

Topics where the student's success rate is below 60% and they have attempted at least 3 questions. Ordered by success rate ascending (worst first).

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "topicName": "Rotational Motion",
      "subject": "Physics",
      "attempts": 8,
      "correctCount": 3,
      "successRate": 0.375,
      "markedAsWeak": true,
      "lastAttemptAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/stats/overview

> Requires auth

All topic progress for the student. Ordered by subject alphabetically, then by success rate ascending.

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "topicName": "Circles",
      "subject": "Mathematics",
      "attempts": 12,
      "correctCount": 9,
      "successRate": 0.75,
      "markedAsWeak": false,
      "lastAttemptAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### System

---

#### GET /health

No auth required. Check if the server and database are up.

**Response 200:**

```json
{ "status": "ok", "db": "up", "ts": "2025-01-15T10:00:00.000Z" }
```

**Response 503:**

```json
{ "status": "error", "db": "down" }
```

---

## Diagram Field

When a question has a visual setup, the `diagram` field contains a template object instead of `null`.

```json
{
  "diagram": {
    "template": "inclined_plane",
    "params": {
      "angle_deg": 30,
      "show_weight": true,
      "show_normal": true,
      "show_friction": false,
      "show_applied": false,
      "labels": { "angle": "30°", "block": "m", "weight": "mg", "normal": "N" }
    }
  }
}
```

Available templates:

| Template | Subject | Description |
|----------|---------|-------------|
| `inclined_plane` | Physics | Block on slope with force vectors |
| `simple_circuit` | Physics | Series or parallel electric circuit |
| `lens_mirror` | Physics | Ray optics with image formation |
| `projectile_motion` | Physics | Parabolic trajectory |
| `pulley_system` | Physics | Atwood machine |
| `wave_diagram` | Physics | Transverse or standing wave |
| `capacitor_field` | Physics | Parallel plate capacitor |
| `pv_diagram` | Physics | Thermodynamic P-V diagram |
| `energy_profile` | Chemistry | Reaction coordinate diagram |
| `coordinate_geometry` | Mathematics | Points, lines, circles on axes |
| `triangle` | Mathematics | Triangle with angles and optional incircle/circumcircle |
| `circle_geometry` | Mathematics | Circle, two circles, or tangent from external point |
| `conic_section` | Mathematics | Parabola, ellipse, or hyperbola |
| `argand_plane` | Mathematics | Complex numbers on Argand diagram |
| `molecular_geometry` | Chemistry | VSEPR 3D molecular shape |
| `mo_diagram` | Chemistry | Molecular orbital energy diagram |
| `crystal_structure` | Chemistry | Unit cell (SCC, BCC, FCC, NaCl) |
| `electrochemical_cell` | Chemistry | Galvanic/Daniell cell |
| `organic_structure` | Chemistry | 2D skeletal structure from SMILES |

The frontend `DiagramRenderer` component handles all rendering. Pass the `diagram` object as a prop.

---

## Quick Start

```js
// 1. Register
const res = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Arjun',
    email: 'arjun@example.com',
    password: 'mypassword123',
    class: '12',
    targetExam: 'Main'
  })
});
const { data } = await res.json();
const token = data.token;

// 2. Get a question
const q = await fetch('http://localhost:3001/api/questions/next?subject=Mathematics&topic=Circles&difficulty=intermediate', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: question } = await q.json();

// 3. Submit answer
const ans = await fetch('http://localhost:3001/api/answers/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ questionId: question.id, answer: 'B', timeSpent: 90 })
});
const { data: result } = await ans.json();
console.log(result.isCorrect, result.explanation);
```
