# NLP Project

A [NestJS](https://nestjs.com/) REST API that demonstrates core natural language processing and recommendation techniques. Each feature is exposed as an HTTP endpoint with interactive documentation via Swagger.

**Author:** matin-sadeghi

## Features

| Module | Endpoint | Technique |
|--------|----------|-----------|
| Text Processing | `POST /text-processing` | Tokenization, lowercasing, word counts, Porter stemming |
| Text Classification | `POST /classification` | Multinomial Naive Bayes (trained on startup) |
| Information Retrieval | `POST /ir/search` | TF-IDF + cosine similarity |
| Collaborative Filtering | `POST /cf/recommend` | User-based CF with mean-centered cosine similarity |

## Tech Stack

- **Runtime:** Node.js, TypeScript
- **Framework:** NestJS 11
- **NLP:** [natural](https://github.com/NaturalNode/natural) (Porter stemmer)
- **API docs:** Swagger (`/api/docs`)
- **Validation:** class-validator, class-transformer

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Running the Application

```bash
# development (watch mode)
npm run start:dev

# production build
npm run build
npm run start:prod
```

The server listens on port `3000` by default (override with the `PORT` environment variable).

**Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## API Overview

### Text Processing

Apply optional preprocessing steps to a text file and write results under `output/`.

```bash
curl -X POST http://localhost:3000/text-processing \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/absolute/path/to/input.txt",
    "lowercase": true,
    "tokenize": true,
    "wordCount": true,
    "stemming": true
  }'
```

### Text Classification

Classify a text file into one of the training categories (e.g. `rec.autos`, `sci.electronics`, `Comp.graphics`, `soc.religion.christian`, `talk.politics.mideast`). The model trains automatically from `src/text-classification/dataset/` when the app starts.

```bash
curl -X POST http://localhost:3000/classification \
  -H "Content-Type: application/json" \
  -d '{ "filePath": "/absolute/path/to/document.txt" }'
```

### Information Retrieval

Search a corpus of text documents using a natural-language query. Documents are indexed from `src/information-retrieval/dataset/` at startup.

```bash
curl -X POST http://localhost:3000/ir/search \
  -H "Content-Type: application/json" \
  -d '{ "query": "space travel adventure", "topK": 5 }'
```

### Collaborative Filtering

Recommend songs for a user based on ratings in `src/collaborative-filtering/dataset/Songs Dataset Truncated.csv`. Wait until ratings finish loading (see server logs) before calling this endpoint.

```bash
curl -X POST http://localhost:3000/cf/recommend \
  -H "Content-Type: application/json" \
  -d '{ "userId": 1, "topK": 10 }'
```

## Project Structure

```
src/
├── text-processing/          # Tokenize, stem, count words
├── text-classification/      # Naive Bayes classifier + training data
├── information-retrieval/    # TF-IDF search + document corpus
├── collaborative-filtering/  # User-based recommendations + ratings CSV
├── utils/                    # Shared file helpers
├── app.module.ts
└── main.ts
output/                       # Generated results (created at runtime)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the app |
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm run test` | Unit tests (Jest) |
| `npm run test:e2e` | End-to-end tests |

## Notes

- Request bodies use **absolute file paths** for modules that read from disk.
- Classification and IR modules load datasets when the application boots; large corpora may increase startup time.
- Processed and classification outputs are saved under the `output/` directory at the project root.

## License

MIT
