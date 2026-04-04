import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Employee } from '@/services/employeeService';
import { useEffect } from 'react';

const employeeSchema = z.object({
    firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(50),
    lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres').max(50),
    email: z.string().email('Email inválido').max(255),
    department: z.string().min(1, 'Selecione um departamento'),
    position: z.string().min(1, 'Selecione um cargo'),
    salary: z.coerce.number().min(1, 'Salário deve ser maior que zero'),
    hireDate: z.string().min(1, 'Selecione uma data'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => void;
    employee?: Employee | null;
}

const EmployeeFormModal = ({ open, onClose, onSubmit, employee }: Props) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            position: '',
            salary: 0,
            hireDate: '',
        },
    });

    // Preenche o formulário quando estiver em modo de edição
    useEffect(() => {
        if (employee) {
            const firstName = employee.firstName || (employee.fullName?.split(' ')[0] || '');
            const lastName = employee.lastName || (employee.fullName?.split(' ').slice(1).join(' ') || '');
            
            reset({
                firstName,
                lastName,
                email: employee.email,
                department: employee.department || '',
                position: employee.position || '',
                salary: employee.salary,
                hireDate: employee.hireDate,
            });
        } else {
            reset({
                firstName: '',
                lastName: '',
                email: '',
                department: '',
                position: '',
                salary: 0,
                hireDate: '',
            });
        }
    }, [employee, reset]);

    const handleFormSubmit = (data: EmployeeFormData) => {
        // Converte para o formato esperado pelo backend
        const submitData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            department: data.department,
            position: data.position,
            salary: data.salary,
            hireDate: data.hireDate,
        };

        onSubmit(submitData);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {employee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="space-y-1.5">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input
                                id="firstName"
                                {...register('firstName')}
                                placeholder="Ex: João"
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input
                                id="lastName"
                                {...register('lastName')}
                                placeholder="Silva"
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register('email')} placeholder="email@empresa.com" />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Departamento</Label>
                            <Select
                                defaultValue={employee?.department}
                                onValueChange={(v) => setValue('department', v, { shouldValidate: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Engenharia',
                                        'Marketing',
                                        'Vendas',
                                        'RH',
                                        'Financeiro',
                                        'Operações',
                                        'TI',
                                        'Jurídico',].map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            {errors.department && (
                                <p className="text-sm text-destructive">{errors.department.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Cargo</Label>
                            <Select
                                defaultValue={employee?.position}
                                onValueChange={(v) => setValue('position', v, { shouldValidate: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o cargo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Estagiário',
                                        'Júnior',
                                        'Pleno',
                                        'Sênior',
                                        'Tech Lead',
                                        'Gerente',
                                        'Diretor',
                                        'VP',].map((p) => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            {errors.position && (
                                <p className="text-sm text-destructive">{errors.position.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="salary">Salário (R$)</Label>
                            <Input id="salary" type="number" step="0.01" {...register('salary')} />
                            {errors.salary && (
                                <p className="text-sm text-destructive">{errors.salary.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="hireDate">Data de Contratação</Label>
                            <Input id="hireDate" type="date" {...register('hireDate')} />
                            {errors.hireDate && (
                                <p className="text-sm text-destructive">{errors.hireDate.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {employee ? 'Salvar Alterações' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeFormModal;