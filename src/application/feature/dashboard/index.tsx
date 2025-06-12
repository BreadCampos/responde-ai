import { Button } from "@/application/shared/components/button";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {" "}
      Futuro dashboard
      <h1 className="text-2xl text-foreground">Meu Dashboard</h1>
      <p className="text-muted-foreground">Bem-vindo de volta!</p>
      <div className="mt-4 flex gap-2">
        <Button variant="default">default</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="link"> link</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="secondary">secondary</Button>{" "}
        {/* <-- Ficará ótimo aqui */}
      </div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Ir para paragina existente
      </button>
    </div>
  );
};
