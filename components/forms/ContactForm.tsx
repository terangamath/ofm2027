"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");

    const form = e.currentTarget;

    try {
      // Simulation d'envoi — à remplacer par un appel API réel
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 className="w-10 h-10 text-vert mb-3" aria-hidden="true" />
        <h3 className="font-serif text-lg font-bold text-anthracite mb-2">
          Message envoyé !
        </h3>
        <p className="text-gris text-sm">
          Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-5 text-sm text-vert hover:text-vert-clair font-medium transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {state === "error" && (
        <div
          role="alert"
          className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-rouge text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Une erreur est survenue. Veuillez réessayer ou nous écrire directement.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <FormField
          label="Nom complet"
          name="nom"
          type="text"
          required
          placeholder="Votre nom"
          autoComplete="name"
        />
        <FormField
          label="Adresse e-mail"
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
          autoComplete="email"
        />
      </div>

      <FormField
        label="Sujet"
        name="sujet"
        type="text"
        required
        placeholder="Ex : Question sur les inscriptions"
      />

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-anthracite mb-1.5"
        >
          Message <span className="text-rouge" aria-label="obligatoire">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Votre message..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-sable text-anthracite text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-vert/30 focus:border-vert transition-colors resize-y min-h-[120px]"
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vert text-blanc font-semibold rounded-xl text-sm hover:bg-vert-clair transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        aria-busy={state === "loading"}
      >
        {state === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-blanc/30 border-t-blanc rounded-full animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

function FormField({ label, name, type, required, placeholder, autoComplete }: FormFieldProps) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-anthracite mb-1.5">
        {label}{" "}
        {required && (
          <span className="text-rouge" aria-label="obligatoire">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-sable text-anthracite text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-vert/30 focus:border-vert transition-colors"
      />
    </div>
  );
}
