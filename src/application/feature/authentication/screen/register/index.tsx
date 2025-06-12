/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signupWithCompanyResolver,
  signupWithCompanySchema,
  type SignupWithCompanyFormValues,
} from "./register.schama";

import { useNavigate } from "react-router-dom";
import { RegisterUser } from "./components/register-user";
import { RegisterCompany } from "./components/register-company";
import { Form } from "@/application/shared/components/ui/form";
import { Stepper } from "@/application/shared/components/stepper";
import { useRegisterMutation } from "../../service/register-mutation";
import { useCreateCompanyMutation } from "@/application/feature/company/service/create-company";
import { toast } from "sonner";
import React from "react";
import { ROUTES } from "@/core/routes/route-constants";

const stepFields = [
  [
    "user.firstName",
    "user.lastName",
    "user.email",
    "user.password",
    "user.passwordConfirmation",
  ],
  [
    "company.legalName",
    "company.fantasyName",
    "company.document",
    "company.logoUrl",
    "company.addressLine",
    "company.theme.primary",
  ],
] as const;

export const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const registerMutation = useRegisterMutation();
  const createCompanyMutation = useCreateCompanyMutation();
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };

  const methods = useForm({
    resolver: signupWithCompanyResolver,
    defaultValues: {
      user: {
        email: "joao.campos@respondeai.com",
        firstName: "João Gabriel",
        lastName: "Campos",
        password: "qwe123QWE",
        passwordConfirmation: "qwe123QWE",
      },
      company: {
        theme: {
          primary: "#387cec",
        },
      },
    },
  });

  console.log("Métodos do Form:", methods.formState.errors);
  const handleNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid) {
      console.log("oi");
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 0) {
      onBack();
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const isLastStep = currentStep === stepFields.length - 1;

      if (isLastStep) {
        methods.handleSubmit(onSubmit)();
      } else {
        handleNextStep();
      }
    }
  };

  const onSubmit = async (data: SignupWithCompanyFormValues) => {
    const finalValidation = signupWithCompanySchema.safeParse(data);
    if (!finalValidation.success) {
      finalValidation.error.errors.forEach((error) => {
        methods.setError(error.path.join(".") as any, {
          type: "manual",

          message: error.message,
        });
      });

      return;
    }

    const { user: userPayload, company: companyPayload } = finalValidation.data;

    try {
      const registerResponse = await registerMutation.mutateAsync(userPayload);

      const accessToken = registerResponse?.token;

      const formatDocument = {
        ...companyPayload,
        document: companyPayload.document.replace(/\D/g, ""),
      };
      await createCompanyMutation.mutateAsync(formatDocument, {});

      if (accessToken) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error: any) {
      console.error("Falha no processo de cadastro:", error);
      toast(error.message || "Não foi possível concluir o cadastro.");
    }
  };

  const stepperSteps = [<RegisterUser />, <RegisterCompany />];

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="space-y-6"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">Registrar</h1>
        </div>

        <Stepper
          steps={stepperSteps}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      </form>
    </Form>
  );
};
