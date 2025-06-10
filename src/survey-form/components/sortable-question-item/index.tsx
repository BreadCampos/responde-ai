import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InputPreview } from "@/survey-form/components/input-preview";
import { ChevronsUpDown, Edit, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { shouldShowQuestion } from "@/survey-form/helper/shouled-show-question";
import type { SurveyQuestion } from "@/survey-form/type/survey";

interface Props {
  question: SurveyQuestion;
  onDelete: (questionId: string) => void;
  onEdit: (question: SurveyQuestion) => void;
}

export function SortableQuestionItem({ onDelete, question, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { watch } = useFormContext();
  const formValues = watch();

  // 1. A decisão de mostrar ou não é feita aqui
  if (!shouldShowQuestion(question, formValues)) {
    // 2. Retornar null DESMONTA o componente por completo
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-2 border rounded-md bg-white shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <InputPreview question={question} />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar pergunta"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
            aria-label="Deletar pergunta"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div {...listeners} className="p-2 cursor-grab">
            <ChevronsUpDown />
          </div>
        </div>
      </div>
    </div>
  );
}
