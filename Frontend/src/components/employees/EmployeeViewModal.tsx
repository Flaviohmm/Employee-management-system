import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building2, Briefcase, DollarSign, CalendarDays } from 'lucide-react';
import { Employee } from '@/services/employeeService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const DetailRow = ({ 
    icon: Icon, 
    label, 
    children 
}: { 
    icon: React.ElementType; 
    label: string; 
    children: React.ReactNode 
}) => (
    <div className="flex items-start gap-3 py-3">
        <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{children}</p>
        </div>
    </div>
);

const EmployeeViewModal = ({ open, onClose, employee }: Props) => {
    if (!employee) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detalhes do Funcionário</DialogTitle>
                </DialogHeader>
                <div className="divide-y divide-border">
                    <DetailRow icon={User} label="Nome Completo">
                        {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                    </DetailRow>
                    <DetailRow icon={Mail} label="Email">{employee.email}</DetailRow>
                    <DetailRow icon={Building2} label="Departamento">
                        <Badge variant="secondary">{employee.department}</Badge>
                    </DetailRow>
                    <DetailRow icon={Briefcase} label="Cargo">
                        <Badge variant="outline">{employee.position}</Badge>
                    </DetailRow>
                    <DetailRow icon={DollarSign} label="Salário">{formatCurrency(employee.salary)}</DetailRow>
                    <DetailRow icon={CalendarDays} label="Data de Contratação">
                        {format(new Date(employee.hireDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </DetailRow>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeViewModal;
