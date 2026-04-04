import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Download,
    FileText,
    FileSpreadsheet
} from 'lucide-react';
import { Employee, SortConfig } from "@/services/employeeService";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import axios from 'axios';

interface EmployeeTableProps {
    employees: Employee[];
    loading: boolean;
    sortConfig: SortConfig;
    onSort: (key: keyof Employee) => void;
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const SortIcon = ({ column, sortConfig }: { column: keyof Employee; sortConfig: SortConfig }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />
    return sortConfig.direction === 'asc' ? (
        <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
    ) : (
        <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
    );
};

const exportToCSV = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/employees/export/csv', {
            responseType: 'blob'
        });
        saveAs(response.data, 'funcionarios.csv');
    } catch (error) {
        alert('Erro ao exportar CSV');
    }
};

const exportToExcel = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/employees/export/excel', {
            responseType: 'blob'
        });
        saveAs(response.data, 'funcionarios.xlsx');
    } catch (error) {
        alert('Erro ao exportar Excel');
    }
};

const EmployeeTable = ({
    employees,
    loading,
    sortConfig,
    onSort,
    onView,
    onEdit,
    onDelete
}: EmployeeTableProps) => {
    return (
        <div>
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {([
                                ['id', 'ID'],
                                ['fullName', 'Nome Completo'],
                                ['email', 'Email'],
                                ['department', 'Departamento'],
                                ['position', 'Cargo'],
                                ['salary', 'Salário'],
                                ['hireDate', 'Contratação'],
                            ] as [keyof Employee, string][]).map(([key, label]) => (
                                <TableHead
                                    key={key}
                                    className="cursor-pointer select-none whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => onSort(key)}
                                >
                                    <span className="inline-flex items-center">
                                        {label}
                                        <SortIcon column={key} sortConfig={sortConfig} />
                                    </span>
                                </TableHead>
                            ))}
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                    Carregando funcionários...
                                </TableCell>
                            </TableRow>
                        ) : employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                    Nenhum funcionário encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp) => (
                                <TableRow key={emp.id} className="group">
                                    <TableCell className="font-mono text-xs text-muted-foreground">#{emp.id}</TableCell>
                                    <TableCell className="font-medium">
                                        {emp.fullName || `${emp.firstName} ${emp.lastName}`}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{emp.department || '—'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{emp.position || '—'}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{formatCurrency(emp.salary)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {
                                            emp.hireDate
                                                ? format(parseISO(emp.hireDate), 'dd/MM/yyyy', { locale: ptBR })
                                                : '------------'
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onView(emp)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(emp)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(emp)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex gap-3 mb-4 mt-4">
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <FileText size={20} />
                    Exportar CSV
                </button>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
                >   
                    <FileSpreadsheet size={20} />
                    Exportar Excel
                </button>
            </div>
        </div>
    );
};

export default EmployeeTable;