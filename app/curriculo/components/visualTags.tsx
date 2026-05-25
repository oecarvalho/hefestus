"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TagsInputProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
};

export function TagsInput({
  value = [],
  onChange = () => {},
  placeholder = "Digite e pressione Enter",
  maxTags,
}: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();

    if (!trimmed) return;
    if (value.includes(trimmed)) return;

    if (maxTags && value.length >= maxTags) return;

    onChange([...value, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="border rounded-md p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">

      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-destructive"
          >
            <X size={14} />
          </button>
        </span>
      ))}

      <input
        className="outline-none flex-1 min-w-[120px] bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
      />
    </div>
  );
}