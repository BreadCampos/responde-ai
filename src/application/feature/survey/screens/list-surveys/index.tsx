import { Button } from "@/application/shared/components/button";
import { ROUTES } from "@/core/routes/route-constants";
import { useNavigate } from "react-router-dom";

export const ListSurveys = () => {
  const navigate = useNavigate();

  const redirectionToCreate = () => {
    navigate(ROUTES.SURVEY_CREATE);
  };
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 bg-card rounded-lg shadow-md">
      <div className="mb-4 w-full flex justify-between items-center">
        <h1 className="text-2xl text-card-foreground font-bold mb-4">
          Enquetes
        </h1>
        <Button
          variant="default"
          onClick={redirectionToCreate}
          className="mb-4"
        >
          Adicionar nova enquete
        </Button>
      </div>

      <div className="flex-1 border-white border-1 w-full rounded-lg p-4  flex flex-col items-center justify-center dark:border-primary">
        <p className="text-muted-foreground mb-4">furuta listagem</p>
      </div>
    </div>
  );
};
