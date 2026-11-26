import { useState } from "react";
import "./PostForm.css";

export default function PostForm({
  onAddPost,
  onSuccess,
  titleId = "post-form-title",
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm({ title: rawTitle, body: rawBody }) {
    const nextErrors = {};
    const trimmedTitle = rawTitle.trim();
    const trimmedBody = rawBody.trim();

    if (!trimmedTitle) {
      nextErrors.title = "Inserisci un titolo per il post.";
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = "Il titolo deve contenere almeno 3 caratteri.";
    }

    if (!trimmedBody) {
      nextErrors.body = "Inserisci il contenuto del post.";
    } else if (trimmedBody.length < 10) {
      nextErrors.body = "Il contenuto deve contenere almeno 10 caratteri.";
    }

    return nextErrors;
  }

  function clearFieldError(fieldName) {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm({ title, body });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const createdPost = await onAddPost({
        title: title.trim(),
        body: body.trim(),
      });

      setTitle("");
      setBody("");
      onSuccess?.(createdPost);
    } catch (error) {
      setSubmitError(
        error.message ||
          "Si è verificato un errore durante la pubblicazione del post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <div className="post-form-header">
        <h2 id={titleId}>Nuovo Post</h2>
        <p>I nuovi post vengono aggiunti localmente nella sessione corrente.</p>
      </div>
      <div className="form-post-body">
        <div className="post-form-error">
          {submitError && <p>{submitError}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="post-title">Titolo del post</label>
          <input
            id="post-title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearFieldError("title");
            }}
            placeholder="Es. Lorem ipsum dolor est"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "post-title-error" : undefined}
          />
          <div className="field-error">
            {errors.title && (
              <p id="post-title-error" role="alert">
                {errors.title}
              </p>
            )}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="post-body">Testo del post</label>
          <textarea
            id="post-body"
            name="body"
            rows={5}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              clearFieldError("body");
            }}
            placeholder="Scrivi qui il testo del post..."
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.body)}
            aria-describedby={errors.body ? "post-body-error" : undefined}
          />
          <div className="field-error">
            {errors.body && (
              <p id="post-body-error" role="alert">
                {errors.body}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="post-form-footer">
        <div className="post-form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Pubblicazione..." : "Pubblica post"}
          </button>
        </div>
      </div>
    </form>
  );
}
