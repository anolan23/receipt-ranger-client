# Receipt upload API changes

The backend no longer uses a background job queue. Uploading a receipt is now a single request that finishes the work and returns the new receipt id. **There is no task polling anymore.**

## What changed

|                                   | Before                          | After                              |
| --------------------------------- | ------------------------------- | ---------------------------------- |
| `POST /receipts`                  | `202` with `{"task_id": "..."}` | `201` with `{"receipt_id": "..."}` |
| `POST /receipts/demo`             | `202` with `{"task_id": "..."}` | `201` with `{"receipt_id": "..."}` |
| `GET /receipts/tasks/<id>/status` | Poll for progress               | **Removed** (returns 404)          |

Request format is unchanged: `multipart/form-data` with a `file` field, plus the usual `Authorization: Bearer <access_token>` header (not needed for `/receipts/demo`).

## What to do in the app

1. Send the upload as before.
2. **Wait for the response.** It takes roughly **8 to 15 seconds**, so show a loading state and don't use a short request timeout. Set the client timeout to at least **60 seconds**.
3. On `201`, read `receipt_id` and fetch the receipt with `GET /receipts/<receipt_id>` (or navigate to it).
4. Delete the polling code and any handling of `task_id` / `ready` / `state` / `successful`.

```js
const form = new FormData();
form.append('file', file);

const res = await fetch(`${API}/receipts`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: form,
  signal: AbortSignal.timeout(60_000),
});

if (!res.ok) throw await res.json(); // see "Errors"
const { receipt_id } = await res.json();
```

## Errors

Failures return JSON in this shape, and a failure now means no receipt was created, so it is safe to retry:

```json
{ "title": "Too Many Requests", "detail": "...", "status": 429 }
```

| Status | Meaning                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`  | No `file` field in the request                                                                                                                                                        |
| `401`  | Missing or expired access token (refresh it, then retry)                                                                                                                              |
| `429`  | Receipt limit reached for the user's plan (or, on `/receipts/demo`, more than 5 requests per day)                                                                                     |
| `500`  | Processing failed, or the file isn't a supported image (png, jpg, jpeg, gif, bmp, tiff, webp). The `detail` field has the reason. Check the file type on the client before uploading. |

Previously a failed job could still report success with no result. That no longer happens, because failures now come back as errors on the upload request itself.

## Other notes

- `ocr_text` is empty for newly created receipts. The image is now read directly instead of going through OCR. Don't rely on that field.
- `POST /receipts/parse-receipt` (raw text body) is unchanged and returns `{"receipt_id": "..."}`.
