import { useState, useMemo, type MouseEvent } from "react";

import { Form } from "@/components/ui/form";
import { ServeyModal } from "./components/survey-modal";
import { useForm } from "react-hook-form";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableQuestionItem } from "./components/sortable-question-item";
import { toast } from "sonner";
import { shouldShowQuestion } from "./helper/shouled-show-question";
import { Button } from "@/components/button";
import type { SurveyQuestion } from "./type/survey";
import { useToggle } from "@/hooks/use-toggle";

export const Survey = () => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

  const addNewQuestion = (newQuestion: SurveyQuestion) => {
    setQuestions((prev) =>
      [...prev, newQuestion].sort((a, b) => a.pageIndex - b.pageIndex)
    );
    toast.success("Pergunta adicionada com sucesso.");
  };

  const [currentPage, setCurrentPage] = useState(1);

  const methods = useForm({
    mode: "onTouched",
    shouldUnregister: false,
  });

  const [isModalOpen, toggleModal] = useToggle(false);
  const [questionToEdit, setQuestionToEdit] = useState<SurveyQuestion | null>(
    null
  );

  const handleOpenToAdd = () => {
    setQuestionToEdit(null);
    toggleModal();
  };

  const handleOpenToEdit = (question: SurveyQuestion) => {
    setQuestionToEdit(question);
    toggleModal();
  };

  const updateQuestion = (updatedQuestion: SurveyQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
    toast.success("Pergunta atualizada com sucesso.");
  };

  const deleteQuestion = (questionId: string) => {
    const isDependency = questions.some(
      (q) => q.conditional?.fieldId === questionId
    );

    if (isDependency) {
      if (
        !confirm(
          "Atenção: Outra pergunta depende desta. Deseja realmente deletá-la?"
        )
      ) {
        return;
      }
    }

    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    toast.success("Pergunta deletada com sucesso.");
  };

  const { trigger, getValues, handleSubmit } = methods;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      const newOrder = arrayMove(questions, oldIndex, newIndex);
      const movedItem = newOrder[newIndex];

      if (movedItem.conditional) {
        const dependencyId = movedItem.conditional.fieldId;
        const dependencyIndex = newOrder.findIndex(
          (q) => q.id === dependencyId
        );

        if (newIndex < dependencyIndex) {
          toast.error(
            "Movimento inválido: Uma pergunta não pode vir antes daquela da qual ela depende."
          );

          return;
        }
      }

      setQuestions(newOrder);
    }
  }

  const totalPages = useMemo(() => {
    if (questions.length === 0) return 1;
    return Math.max(...questions.map((q) => q.pageIndex), 1);
  }, [questions]);

  const questionsOnCurrentPage = useMemo(() => {
    return questions.filter((q) => q.pageIndex === currentPage);
  }, [currentPage, questions]);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleNextPage = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (isNavigating) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsNavigating(true);
    try {
      const visibleFieldsOnPage = questions
        .filter(
          (q) =>
            q.pageIndex === currentPage && shouldShowQuestion(q, getValues())
        )
        .map((q) => q.id);

      const isValid = await trigger(visibleFieldsOnPage);

      if (isValid && currentPage < totalPages) {
        setCurrentPage((p) => p + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      // Garante que o estado seja resetado no final, com sucesso ou erro.
      setIsNavigating(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const onSubmit = () => {
    toast.success("Simulação de envio do formulário completo.");
  };

  return (
    <Form {...methods}>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Criar Pesquisa</h1>
        <Button onClick={handleOpenToAdd} className="mb-4">
          Adicionar Pergunta +
        </Button>
        <ServeyModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onAddQuestion={addNewQuestion}
          onUpdateQuestion={updateQuestion}
          existingQuestions={questions}
          questionToEdit={questionToEdit}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-[700px] mx-auto"
        >
          <div className="p-6 border rounded-lg mt-4 space-y-4 bg-gray-50">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questionsOnCurrentPage.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {questionsOnCurrentPage.map((q) => (
                  <SortableQuestionItem
                    key={q.id}
                    question={q}
                    onDelete={deleteQuestion}
                    onEdit={handleOpenToEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {questions.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Adicione uma pergunta para começar.
              </p>
            )}
          </div>

          {questions.length > 0 && (
            <div className="flex items-center justify-between sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 border-t-2 mt-4 shadow-lg rounded-t-lg">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={`w-4 h-4 rounded-full text-sm text-[11px] font-bold transition-all ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              {currentPage < totalPages ? (
                <Button
                  type="button"
                  onClick={(e) => handleNextPage(e)}
                  disabled={isNavigating}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {isNavigating ? "Validando..." : "Próxima"}
                </Button>
              ) : (
                <Button type="submit" disabled={methods.formState.isSubmitting}>
                  {methods.formState.isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </Form>
  );
};
