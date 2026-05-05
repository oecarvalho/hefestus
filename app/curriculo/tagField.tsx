"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { TagsInput } from "./visualTags";

type TagsFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  maxTags?: number;
};

export function TagsField({
  name,
  label,
  placeholder,
  maxTags,
}: TagsFieldProps) {
  const { control, formState } = useFormContext();

  return (
    <Field>
      <FieldLabel className="text-xs text-muted-foreground">
        {label}
      </FieldLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TagsInput
            value={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
            maxTags={maxTags}
          />
        )}
      />

      <FieldError>
        {formState.errors?.[name]?.message as string}
      </FieldError>
    </Field>
  );
}