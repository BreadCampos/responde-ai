import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InputPreview } from "@/survey/components/input-preview";
import { ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { shouldShowQuestion } from "@/survey/helper/shouled-show-question";
import type { SurveyQuestion } from "@/survey/type/survey";

interface Props {
  question: SurveyQuestion;
}

export function SortableQuestionItem({ question }: Props) {
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

        <div {...listeners} className="p-2 cursor-grab">
          <ChevronsUpDown />
        </div>
      </div>
    </div>
  );
}
