import { Controller, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function BirthdayField() {
  const { control } = useFormContext();

  return (
    <Controller
      name="personalInfo.birthday"
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                {field.value ? (
                  format(field.value, "dd/MM/yyyy")
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {fieldState.error && (
            <span className="text-red-500 text-sm">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}