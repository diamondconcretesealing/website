"use client";

import { useEffect, useId, useRef, useState } from "react";

type SelectProps = {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
};

export function Select({
  label,
  name,
  options,
  placeholder = "Select…",
  required = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const listId = useId();

  // Sync custom value back to "" when the parent form is reset (e.g. after a successful submit)
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => {
      setValue("");
      setOpen(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // Keep the active option scrolled into view
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(option: string) {
    setValue(option);
    setOpen(false);
  }

  function openList() {
    setActive(Math.max(0, value ? options.indexOf(value) : 0));
    setOpen(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(options[active]);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
    }
  }

  return (
    <div className="block">
      <span id={labelId} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>

      <div ref={rootRef} className="relative">
        {/* Real value carried into FormData; required so the browser blocks empty submits */}
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          required={required}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
        />

        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${labelId} ${listId}-btn`}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          className="flex w-full items-center justify-between rounded-lg border border-line bg-surface-2 px-4 py-3 text-left text-white focus:border-brand"
        >
          <span id={`${listId}-btn`} className={value ? "text-white" : "text-white/55"}>
            {value || placeholder}
          </span>
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-line bg-surface py-1 shadow-xl shadow-black/40"
          >
            {options.map((option, i) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(option)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm ${
                    i === active ? "bg-surface-2 text-white" : "text-white/70"
                  }`}
                >
                  {option}
                  {selected && (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-brand">
                      <path
                        d="M5 10.5 8.5 14 15 6.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
