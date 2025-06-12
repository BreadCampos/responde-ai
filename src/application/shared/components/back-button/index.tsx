import { MoveLeft } from "lucide-react";
import { Button } from "../button";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}
export const BackButton = ({ children }: Props) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        onClick={handleBack}
        variant="ghost"
        className="text-card-foreground  flex-shrink-0"
        size={"icon"}
      >
        <MoveLeft size={24} />
      </Button>
      {children}
    </div>
  );
};
