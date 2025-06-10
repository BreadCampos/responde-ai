import { useState, useMemo, type MouseEvent } from "react";
import { EditableTitle } from "./components/editable-title";
import type { Survey, SurveyQuestion } from "./type/survey";

import { Form } from "@/application/shared/components/ui/form";
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
import { Button } from "@/application/shared/components/button";
import { useToggle } from "@/application/shared/hooks/use-toggle";

export const SurveyForm = () => {
  // const [survey, setSurvey] = useState<Survey>({
  //   id: crypto.randomUUID(),
  //   title: "Formulário Sem Título",
  //   questions: [],
  // });

  const [survey, setSurvey] = useState<Survey>({
    id: "survey-test-01-complex",
    title: "Feedback de Produto e Experiência do Usuário",
    questions: [
      // --- PÁGINA 1: DADOS BÁSICOS ---
      {
        id: "q1_name",
        label: "Primeiro, qual o seu nome?",
        type: "text",
        placeholder: "Digite seu nome completo",
        pageIndex: 1,
        orderIndex: 0,
        validations: [
          {
            type: "required",
            errorMessage: "O nome é obrigatório.",
          },
          {
            type: "min_length",
            options: { value: 3 },
            errorMessage: "Por favor, insira um nome com pelo menos 3 letras.",
          },
        ],
      },
      {
        id: "q1_email",
        label: "E o seu melhor e-mail?",
        type: "text",
        placeholder: "exemplo@dominio.com",
        hint: "Usado apenas para comunicação sobre a pesquisa.",
        pageIndex: 1,
        orderIndex: 1,
        validations: [
          { type: "required" },
          {
            type: "email",
            errorMessage: "Por favor, insira um formato de e-mail válido.",
          },
        ],
      },
      {
        id: "q1_contact_preference",
        label:
          "Você aceita receber um contato por telefone para falarmos sobre sua experiência?",
        type: "radio",
        pageIndex: 1,
        orderIndex: 2,
        selectOptions: [
          { label: "Sim, aceito", value: "yes" },
          {
            label: "Não, prefiro não ser contatado",
            value: "no",
          },
        ],
        validations: [{ type: "required" }],
      },
      {
        id: "q1_phone",
        label: "Ótimo! Qual o seu telefone com DDD?",
        type: "text",
        placeholder: "(00) 00000-0000",
        pageIndex: 1,
        orderIndex: 3,
        mask: ["(00) 0000-0000", "(00) 00000-0000"],
        validations: [
          {
            type: "required",
            errorMessage:
              "Estou com problema de input com mask, coloque 'não' na anterior",
          },
        ],
        conditional: {
          fieldId: "q1_contact_preference",
          operator: "equals",
          value: "yes",
        },
      },

      // --- PÁGINA 2: USO DO PRODUTO ---
      {
        id: "q2_main_product",
        label: "Qual de nossos produtos você mais utiliza?",
        type: "select",
        placeholder: "Selecione o produto principal",
        pageIndex: 2,
        orderIndex: 0,
        validations: [{ type: "required" }],
        selectOptions: [
          { label: "Produto Alpha", value: "alpha" },
          { label: "Produto Beta", value: "beta" },
          { label: "Produto Gamma", value: "gamma" },
        ],
      },
      {
        id: "q2_feature_rating",
        label:
          "Numa escala de 1 a 5, como você avalia a facilidade de uso do produto?",
        type: "rating",
        pageIndex: 2,
        orderIndex: 1,
        validations: [{ type: "required" }],
        ratingOptions: {
          min: 1,
          max: 5,
          style: "stars",
        },
      },
      {
        id: "q2_used_features",
        label: "Quais destas funcionalidades você já utilizou?",
        type: "checkbox_group",
        hint: "Marque todas as opções aplicáveis.",
        pageIndex: 2,
        orderIndex: 2,
        validations: [
          {
            type: "required",
            errorMessage: "Por favor, selecione ao menos uma opção.",
          },
        ],
        selectOptions: [
          {
            label: "Dashboard de Análises",
            value: "dashboard",
          },
          {
            label: "Relatórios Customizados",
            value: "reports",
          },
          {
            label: "Suporte via Chat",
            value: "chat_support",
          },
        ],
      },
      {
        id: "q2_first_use_date",
        label: "Quando você começou a usar nosso produto?",
        type: "date",
        hint: "Pode ser uma data aproximada.",
        pageIndex: 2,
        orderIndex: 3,
        validations: [
          {
            type: "max",
            options: { value: new Date().toISOString().split("T")[0] }, // Define a data máxima como hoje
            errorMessage: "A data não pode ser no futuro.",
          },
        ],
      },

      // --- PÁGINA 3: FEEDBACK DETALHADO ---
      {
        id: "q3_nps_score",
        label:
          "De 0 a 10, o quão provável você é de nos recomendar a um amigo ou colega?",
        type: "rating",
        hint: "0 = Nada provável, 10 = Com certeza!",
        pageIndex: 3,
        orderIndex: 0,
        validations: [{ type: "required" }],
        ratingOptions: {
          min: 0,
          max: 10,
          style: "slider",
        },
      },
      {
        id: "q3_nps_promoter_reason",
        label: "Ficamos felizes com a sua nota! O que mais te agradou?",
        type: "textarea",
        placeholder: "Nos conte o que te fez dar essa nota...",
        pageIndex: 3,
        orderIndex: 1,
        conditional: {
          fieldId: "q3_nps_score",
          operator: "greater_than_equal",
          value: "9",
        },
        validations: [{ type: "required" }],
      },
      {
        id: "q3_nps_detractor_reason",
        label:
          "Lamentamos por não atender suas expectativas. O que podemos fazer para melhorar?",
        type: "textarea",
        placeholder: "Seu feedback é muito importante para nós...",
        pageIndex: 3,
        orderIndex: 2,
        conditional: {
          fieldId: "q3_nps_score",
          operator: "less_than_equal",
          value: "6",
        },
        validations: [{ type: "required" }],
      },
    ],
  });

  const addNewQuestion = (newQuestion: SurveyQuestion) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: [...prevSurvey.questions, newQuestion].sort(
        (a, b) => a.pageIndex - b.pageIndex
      ),
    }));
    toast.success("Pergunta adicionada com sucesso.");
  };

  const updateQuestion = (updatedQuestion: SurveyQuestion) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: prevSurvey.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
    toast.success("Pergunta atualizada com sucesso.");
  };

  const deleteQuestion = (questionId: string) => {
    const isDependency = survey.questions.some(
      (q) => q.conditional?.fieldId === questionId
    );
    if (
      isDependency &&
      !confirm(
        "Atenção: Outra pergunta depende desta. Deseja realmente deletá-la?"
      )
    ) {
      return;
    }
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: prevSurvey.questions.filter((q) => q.id !== questionId),
    }));
    toast.success("Pergunta deletada com sucesso.");
  };

  const handleTitleChange = (newTitle: string) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      title: newTitle,
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const methods = useForm({ mode: "onTouched", shouldUnregister: false });
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

  const { trigger, getValues, handleSubmit } = methods;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = survey?.questions.findIndex((q) => q.id === active.id);
      const newIndex = survey?.questions.findIndex((q) => q.id === over.id);

      const newOrder = arrayMove(survey?.questions, oldIndex, newIndex);
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

      setSurvey((prevSurvey) => ({ ...prevSurvey, questions: newOrder }));
    }
  }

  const totalPages = useMemo(() => {
    if (survey.questions.length === 0) return 1;
    return Math.max(...survey.questions.map((q) => q.pageIndex), 1);
  }, [survey.questions]);

  const questionsOnCurrentPage = useMemo(() => {
    return survey.questions.filter((q) => q.pageIndex === currentPage);
  }, [currentPage, survey.questions]);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleNextPage = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (isNavigating) return;
    e.preventDefault();
    setIsNavigating(true);
    try {
      const visibleFieldsOnPage = survey.questions
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
      setIsNavigating(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const onSubmit = () => {
    console.log("Formulário completo para envio:", survey);
    toast.success("Simulação de envio do formulário completo.");
  };

  return (
    <Form {...methods}>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="mb-4 text-left flex justify-between items-center w-8/12">
          <EditableTitle
            initialTitle={survey.title}
            onSave={handleTitleChange}
            className="text-3xl font-bold text-gray-800"
          />

          <Button onClick={handleOpenToAdd}>Adicionar Pergunta +</Button>
        </div>
        <ServeyModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onAddQuestion={addNewQuestion}
          onUpdateQuestion={updateQuestion}
          existingQuestions={survey.questions}
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

            {survey.questions.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Adicione uma pergunta para começar.
              </p>
            )}
          </div>

          {survey.questions.length > 0 && (
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
