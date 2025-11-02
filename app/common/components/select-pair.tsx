import { useState } from "react";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export default function SelectPair({
    name,
    required,
    label,
    description,
    placeholder,
    options,
    defaultValue,
}: {
    name: string;
    required?: boolean;
    label: string;
    description: string;
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
    defaultValue?: string;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(defaultValue);
    return (
        <div className="space-y-2 flex flex-col">
            <Label className="flex flex-col gap-1 items-start" onClick={() => setOpen(true)}>
                {label}
                <small className="text-muted-foreground">{description}</small>
            </Label>
            <Select
                open={open}
                onOpenChange={setOpen}
                onValueChange={setValue}
                value={value}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <input type="hidden" name={name} value={value || ""} required={required} />
        </div>
    );
}