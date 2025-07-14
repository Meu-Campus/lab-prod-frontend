import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAxios, usePost } from "@/hooks/axios.hook";
import { toast } from "sonner";

const subjectSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export function SubjectComponent({ id }: { id?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const createSubject = usePost<SubjectFormData, SubjectFormData>('/subject', {
    onSuccess: () => {
      toast('Criado com sucesso')
    },
    onError: () => {
      toast('Erro ao criar')
    }
  });

  useEffect(() => {
    if (id) {
      setValue("name", 'ddd');
    }
  }, []);

  function submit(data: SubjectFormData) {
    if (id) {
      console.log("Atualizando assunto:", data);
    } else {
      createSubject.mutate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

        <Button loading={createSubject.isPending} type="submit" className="mt-4 w-full">Salvar</Button>
      </div>
    </form>
  )
}