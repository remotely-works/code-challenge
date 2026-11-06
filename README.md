# Remotely Challenge

Welcome. This challenge is part of our hiring process. Before you start, please read this whole document. The way we evaluate this challenge has changed significantly in the last year, and the differences from a "standard take-home" are the whole point.

## What we are actually testing

We are not testing whether you can write code from scratch with no help. In 2026, that is no longer a useful signal.

We are testing three things:

1. **Judgment.** Can you make good calls about libraries, architecture, data modeling, and UX without anyone holding your hand?
2. **Guided AI.** Can you direct an AI agent (Cursor, Claude Code, Copilot, Codex, whatever you prefer) to produce work you would be proud to ship, catching it when it is confidently wrong?
3. **Ownership.** Do you understand every line in your own submission well enough to defend it in a live conversation?

If you ship something you cannot explain, you will not pass. That is the most important sentence in this README.

## AI policy

You can use AI assistants. We are not testing whether you can write code without them.

What we want to see is **Guided AI**, not one-shot prompting:

- You specified intent clearly before the agent started writing.
- You reviewed what the agent produced and pushed back when it was wrong, over-engineered, or product-wrong.
- You made the architectural and product calls the agent could not make for you.
- The commit history reflects iteration and decision-making, not a single dump of agent output.

One-shot submissions are easy to spot and will not pass. Submissions where the candidate cannot explain their own code in the follow-up interview will not pass either.

## Evaluation rubric

We score submissions on these dimensions, roughly in this order:

1. **It works end to end.** All required features run on a clean checkout.
2. **Code quality and structure.** Clear boundaries, sensible naming, no dead code, no obvious agent-generated cruft.
3. **Library and framework choices.** You picked sensible tools and can justify why.
4. **UI quality.** See the next section.
5. **Test coverage where it matters.** Not exhaustive, but present on the parts that would hurt to break.
6. **Commit history.** Incremental, readable, tells a story.
7. **Ability to defend every decision in the follow-up interview.**

Shipping more features matters less than shipping fewer features well. A clean implementation of features 1 to 4 beats a buggy implementation of all 6.

## UI quality

The frontend should look like something you would be comfortable shipping to a real user of a real product.

You do not need to be a designer. You do need to use the tools that make decent UI nearly free in 2026: a component library (shadcn/ui, Radix, Mantine, Chakra, MUI) and/or a utility framework (Tailwind). Reach for one. There is no excuse for an unstyled form in the year of our lord 2026.

Submissions with raw, unstyled HTML, broken layouts, no loading or error states, or obvious visual bugs will not pass.

## What happens after you submit

If your submission passes our initial review, we will invite you to a **live technical interview** where we walk through your own code line by line. You should expect questions like:

- "Why did you choose this library over the alternatives?"
- "Walk me through what happens when the user clicks this button."
- "What did the agent get wrong here, and how did you catch it?"
- "Why did you accept this trade-off?"
- "If we asked you to add multi-tenancy to this, where would you start?"

This interview is the most important part of the process. Candidates who shipped their own work tend to enjoy it. Candidates who did not, do not.

---

## The Challenge

This challenge consists of building a simple app for managing candidates. There is no frontend provided, but a small in-memory backend in Go is provided. Part of the task is changing that backend to not be in-memory anymore.

### What if I do not know Go?

Go is fairly easy to read, but if you do not feel confident with Go you can roll your own backend in your preferred stack. Please include instructions on how to run it.

### Setup

You can set up the project with the starter or toolkit of your choosing, as long as the project works by running `npm start` on the delivered project.

The project **must** use **plain React** (no Next.js, Remix, or any other meta-framework). Library choices beyond that are yours.

### Delivered project

The delivered project should be a git repository. Changes should be added incrementally across multiple commits. A single "initial commit" with the whole solution is a red flag.

### Tasks

Implement the following features. You do not need to complete all of them, but the more you complete *well*, the better.

**1. Candidate list**

The index of the app should be a list of candidates. Each row shows picture, name, email, and skills. The list should be paginated so the user can browse all candidates.

**2. Candidate detail**

From the list, the user should be able to navigate to the detail page of a candidate on its own route. This page displays all candidate data.

**3. Create candidates**

The index should have a "Create candidate" button. Clicking it shows a form (modal or page, your call) with the following fields:

- First name (required)
- Last name (required)
- Email (required, must be a valid email)
- Phone (required)
- Picture (file upload, required)
- Skills (multiple, optional)

On successful submission, redirect to the detail page of the new candidate.

**4. Edit candidates**

From a candidate's detail page, the user should be able to edit. The form is the same as create, prefilled with current data. On success, redirect back to the detail page.

**5. Persistence**

The provided backend stores candidates in memory. Replace this with a SQL database of your choice. You may make any changes you want to the backend logic, structure, and architecture during this step.

**6. (Bonus) Delete candidates**

Implement `DELETE /candidates/{id}` in the server and add a delete affordance (in the list, the detail, or both). The user must confirm before deletion.

---

## Backend

The backend is a simple REST API for retrieving, updating, and creating candidates.

### Running the backend

With Go:

```
cd server && go run .
```

Or with Docker:

```
cd server
docker build -t remotely-server .
docker run -d -p 8080:8080 --name remotely-server remotely-server
```

The backend has CORS enabled and runs on `localhost:8080`.

### Endpoints

#### GET /candidates

Returns up to 25 candidates depending on the requested page. Accepts a `page` query parameter that must be a number.

**Example response:**

```json
{
  "status": 200,
  "data": {
    "total": 80,
    "candidates": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "picture": "<data uri>",
        "phone": "<phone>",
        "email": "<email>",
        "skills": ["Java", "Kotlin"]
      }
    ],
    "pagination": {
      "per_page": 25,
      "page": 1,
      "total_pages": 4
    }
  }
}
```

#### GET /candidates/{id}

Returns the requested candidate by ID.

**Example response:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "picture": "<data uri>",
    "phone": "<phone>",
    "email": "<email>",
    "skills": ["Java", "Kotlin"]
  }
}
```

**Example response if not found:**

```json
{
  "status": 404,
  "errors": ["not found"]
}
```

#### POST /candidates

Creates a new candidate. **Note:** changes are ephemeral; if the server restarts, the changes are lost (this is what you fix in task 5).

Expects a JSON body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "picture": "<data uri>",
  "phone": "<phone>",
  "email": "<email>",
  "skills": ["Java", "Kotlin"]
}
```

**Example response:**

```json
{
  "status": 201,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "picture": "<data uri>",
    "phone": "<phone>",
    "email": "<email>",
    "skills": ["Java", "Kotlin"]
  }
}
```

**Example response on validation errors:**

```json
{
  "status": 400,
  "errors": ["first_name is not valid", "last_name is not valid"]
}
```

#### PATCH /candidates/{id}

Updates the candidate with the given id. **Note:** changes are ephemeral until you implement task 5.

Expects a JSON body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "picture": "<data uri>",
  "phone": "<phone>",
  "email": "<email>",
  "skills": ["Java", "Kotlin"]
}
```

**Example response:**

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "picture": "<data uri>",
    "phone": "<phone>",
    "email": "<email>",
    "skills": ["Java", "Kotlin"]
  }
}
```

**Example response on validation errors:**

```json
{
  "status": 400,
  "errors": ["first_name is not valid", "last_name is not valid"]
}
```
