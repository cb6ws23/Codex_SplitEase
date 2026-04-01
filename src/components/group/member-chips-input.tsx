"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  addLabel: string;
  helperText: string;
  inputPlaceholder: string;
  inputTitle: string;
  maxMembersText: string;
  name: string;
};

const MAX_MEMBERS = 20;

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function MemberChipsInput({
  addLabel,
  helperText,
  inputPlaceholder,
  inputTitle,
  maxMembersText,
  name,
}: Props) {
  const [draft, setDraft] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const normalizedDraft = useMemo(() => normalizeName(draft), [draft]);
  const canAdd =
    normalizedDraft.length > 0 &&
    normalizedDraft.length <= 50 &&
    members.length < MAX_MEMBERS &&
    !members.includes(normalizedDraft);

  function addMember() {
    if (!canAdd) {
      return;
    }

    setMembers((current) => [...current, normalizedDraft]);
    setDraft("");
  }

  function removeMember(member: string) {
    setMembers((current) => current.filter((entry) => entry !== member));
  }

  return (
    <div className="space-y-3">
      <input name={name} type="hidden" value={members.join("\n")} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label={inputTitle}
          maxLength={50}
          onBlur={addMember}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addMember();
            }
          }}
          placeholder={inputPlaceholder}
          value={draft}
        />
        <Button
          className="sm:w-auto"
          disabled={!canAdd}
          onClick={addMember}
          type="button"
          variant="outline"
        >
          {addLabel}
        </Button>
      </div>

      {members.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-soft)] p-3">
          {members.map((member) => (
            <span
              key={member}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] text-[var(--text)]"
            >
              <span className="max-w-[14rem] truncate">{member}</span>
              <button
                aria-label={`${member} remove`}
                className="rounded-full p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--danger)]"
                onClick={() => removeMember(member)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-xs leading-5 text-[var(--text-muted)]">
        {helperText} {maxMembersText}
      </p>
    </div>
  );
}
