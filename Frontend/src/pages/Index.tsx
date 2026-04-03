import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Users, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeFormModal from '@/components/employees/EmployeeFormModal';
import EmployeeViewModal from '@/components/employees/EmployeeViewModal';
import DeleteConfirmDialog from '@/components/employees/DeleteConfirmDialog';
import { employeeService, Employee, SortConfig } from '@/services/employeeService';

const PAGE_SIZES = [10, 20, 50];

const Index = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'id',
        direction: 'asc'
    });

    const [darkMode, setDarkMode] = useState(false);

    // Modals
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Toggle Dark Mode
    const toggleDark = () => {
        setDarkMode((d) => !d);
        document.documentElement.classList.toggle('dark');
    };

    // Carregar funcionários do Backend
    const loadEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const data = await employeeService.getAll(page, pageSize, search);
            // Spring Boot retorna um objeto Page com "content"
            setEmployees(data.content || data);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
            toast.error("Erro ao carregar dados do servidor.");
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    // Atualiza quando mudar página, tamanho ou busca
    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handleSort = useCallback((key: keyof Employee) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const handleAdd = () => {
        setSelectedEmployee(null);
        setEditMode(false);
        setFormOpen(true);
    };

    const handleEdit = (emp: Employee) => {
        setSelectedEmployee(emp);
        setEditMode(true);
        setFormOpen(true);
    };

    const handleView = (emp: Employee) => {
        setSelectedEmployee(emp);
        setViewOpen(true);
    };

    const handleDeleteClick = (emp: Employee) => {
        setSelectedEmployee(emp);
        setDeleteOpen(true);
    };

    // Submit do formulário (Create / Update)
    const handleFormSubmit = async (data: Omit<Employee, 'id'>) => {
        try {
            if (editMode && selectedEmployee) {
                await employeeService.update(selectedEmployee.id, data);
                toast.success('Funcionário atualizado com sucesso!');
            } else {
                await employeeService.create(data);
                toast.success('Funcionário adicionado com sucesso!');
            }
            loadEmployees();
            setFormOpen(false);
        } catch (error) {
            toast.error("Erro ao salvar funcionário.");
            console.error(error);
        }
    };

    // Confirmar exclusão
    const handleDeleteConfirm = async () => {
        if (!selectedEmployee) return;

        try {
            await employeeService.delete(selectedEmployee.id);
            toast.success('Funcionário excluído com sucesso!');
            loadEmployees(); // Recarrega após deletar
            setDeleteOpen(false);
        } catch (error) {
            toast.error("Erro ao excluir funcionário.");
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-foreground">Employee Manager</h1>
                            <p className="text-xs text-muted-foreground">{employees.length} funcionários</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleDark} className="rounded-full">
                            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button onClick={handleAdd} className="gap-2">
                            <Plus className="h-4 w-4" /> Adicionar
                        </Button>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="container mx-auto px-4 py-5 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome ou email..."
                            value={search}
                            onChange={(e) => { 
                                handleSearchChange(e.target.value)
                            }}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="container mx-auto px-4 pb-8 sm:px-6">
                <EmployeeTable
                    employees={employees}
                    loading={loading}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />

                {/* Paginação simples - pode melhorar depois */}
                <div className='mt-6 flex justify-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0 || loading}
                    >
                        Anterior
                    </Button>
                    <span className='flex items-center px-4 text-sm text-muted-foreground'>
                        Página {page + 1}
                    </span>
                    <Button
                        variant='outline'
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                    >
                        Próxima
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <EmployeeFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                employee={editMode ? selectedEmployee : null}
            />
            <EmployeeViewModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                employee={selectedEmployee}
            />
            <DeleteConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default Index;
