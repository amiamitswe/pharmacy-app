import React, { useState, useRef } from "react";
import { Chip } from "@heroui/react";

/**
 * TagInput — simple tags field
 * Props:
 *  - value: string[] (controlled) — optional
 *  - onChange: (tags: string[]) => void — optional
 *  - placeholder: string
 *  - maxTags: number
 *  - disabled: boolean
 *  - validate: (tag: string, tags: string[]) => boolean  // optional custom validator
 */
export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter…",
  maxTags,
  disabled = false,
  validate,
}) {
  const [tags, setTags] = useState(value ?? []);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // keep internal state in sync if using as controlled
  React.useEffect(() => {
    if (Array.isArray(value)) setTags(value);
  }, [value]);

  const emit = (next) => {
    setTags(next);
    onChange?.(next);
  };

  const normalize = (t) => t.trim().replace(/\s+/g, " ");

  const canAdd = (t) => {
    if (!t) return false;
    if (maxTags && tags.length >= maxTags) return false;
    if (tags.includes(t)) return false;
    if (validate && !validate(t, tags)) return false;
    return true;
  };

  const addTag = (raw) => {
    const parts = raw
      .split(/[,\n]/) // allow comma or newline paste
      .map((s) => normalize(s))
      .filter(Boolean);

    if (!parts.length) return;

    const next = [...tags];
    for (const p of parts) {
      if (canAdd(p)) next.push(p);
    }
    if (next.length !== tags.length) {
      emit(next);
    }
    setInput("");
  };

  const removeTag = (t) => {
    emit(tags.filter((x) => x !== t));
    // refocus input for quick editing
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (disabled) return;

    // Enter or comma adds the tag
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }

    // Backspace on empty input deletes last tag
    if (e.key === "Backspace" && !input && tags.length) {
      e.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (text.includes(",") || text.includes("\n")) {
      e.preventDefault();
      addTag(text);
    }
  };

  return (
    <div
      className={[
        "min-h-16 dark:bg-[#27272a] bg-[#f5f5f5] hover:bg-[#e4e4e6] hover:dark:bg-[#3f3f46] transition-colors hover:delay-75 rounded-xl px-2 relative",
        "flex items-center",
        disabled ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
      onClick={() => inputRef.current?.focus()}
      role="group"
      aria-label="Tag input"
    >
      <label className="absolute top-2.5 left-4 text-xs text-default-600">
        {label}
      </label>
      <div className="mt-7 mb-2 px-2 flex flex-wrap gap-2 w-full">
        {tags.map((t) => (
          <Chip
            key={t}
            variant="flat"
            color="primary"
            size="sm"
            radius="sm"
            onClose={() => removeTag(t)}
          >
            {t}
          </Chip>
        ))}

        <input
          ref={inputRef}
          value={input}
          size="lg"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={tags.length ? "" : placeholder}
          className="flex-1 outline-none border-0 text-foreground text-sm py-1"
          disabled={disabled || (maxTags ? tags.length >= maxTags : false)}
        />
      </div>
    </div>
  );
}
