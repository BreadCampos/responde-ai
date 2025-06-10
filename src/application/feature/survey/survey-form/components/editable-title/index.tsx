import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { cn } from "@/application/shared/lib/utils";

interface EditableTitleProps {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  className?: string;
}

export const EditableTitle = ({
  initialTitle,
  onSave,
  className,
}: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSave = () => {
    setIsEditing(false);
    if (title.trim() && title !== initialTitle) {
      onSave(title.trim());
    } else {
      setTitle(initialTitle);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "p-2 -m-2 bg-background border border-primary rounded-md outline-none",
          className // Permite aplicar estilos de fora (como tamanho da fonte)
        )}
      />
    );
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      className={cn(
        "p-2 -m-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors",
        className
      )}
      title="Clique para editar o título"
    >
      {initialTitle}
    </h1>
  );
};
