import { useState, useMemo, useCallback } from 'react';
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
import { mockEmployees } from '@/data/mockEmployees';
import { DEPARTMENTS, POSITIONS, type Employee, type SortConfig } from '@/types/employee';

const PAGE_SIZES = [10, 20, 50];

const Index = () => {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [posFilter, setPosFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
    const [darkMode, setDarkMode] = useState(false);

    // Modals
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editMode, setEditMode] = useState(false);

    const toggleDark = () => {
        setDarkMode((d) => !d);
        document.documentElement.classList.toggle('dark');
    };

    const handleSort = useCallback((key: keyof Employee) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key ? (prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc') : 'asc',
        }));
    }, []);

    const filtered = useMemo(() => {
        let data = [...employees];

        if (search) {
            const q = search.toLowerCase();
            data = data.filter((e) => e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
        }
        if (deptFilter !== 'all') data = data.filter((e) => e.department === deptFilter);
        if (posFilter !== 'all') data = data.filter((e) => e.position === posFilter);

        if (sortConfig.key && sortConfig.direction) {
            data.sort((a, b) => {
                const aVal = a[sortConfig.key!];
                const bVal = b[sortConfig.key!];
                const mod = sortConfig.direction === 'asc' ? 1 : -1;
                if (typeof aVal === 'string') return aVal.localeCompare(bVal as string) * mod;
                return ((aVal as number) - (bVal as number)) * mod;
            });
        }

        return data;
    }, [employees, search, deptFilter, posFilter, sortConfig]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

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

    const handleFormSubmit = (data: Omit<Employee, 'id'>) => {
        if (editMode && selectedEmployee) {
            setEmployees((prev) =>
                prev.map((e) => (e.id === selectedEmployee.id ? { ...e, ...data } : e))
            );
            toast.success('Funcionário atualizado com sucesso!');
        } else {
            const newId = Math.max(...employees.map((e) => e.id), 0) + 1;
            setEmployees((prev) => [...prev, { id: newId, ...data }]);
            toast.success('Funcionário adicionado com sucesso!');
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedEmployee) {
            setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id));
            toast.success('Funcionário excluído com sucesso!');
            setDeleteOpen(false);
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
                            <p className="text-xs text-muted-foreground">{filtered.length} funcionários</p>
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
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            className="pl-9"
                        />
                    </div>
                    <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setPage(0); }}>
                        <SelectTrigger className="w-full sm:w-44">
                            <SelectValue placeholder="Departamento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Departamentos</SelectItem>
                            {DEPARTMENTS.map((d) => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={posFilter} onValueChange={(v) => { setPosFilter(v); setPage(0); }}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Cargo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Cargos</SelectItem>
                            {POSITIONS.map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="container mx-auto px-4 pb-8 sm:px-6">
                <EmployeeTable
                    employees={paged}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />

                {/* Pagination */}
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Itens por página:</span>
                        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
                            <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZES.map((s) => (
                                    <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>
                            {filtered.length > 0
                                ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, filtered.length)} de ${filtered.length}`
                                : '0 resultados'}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(0)}>
                            ««
                        </Button>
                        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                            ‹
                        </Button>
                        <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                            ›
                        </Button>
                        <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
                            »»
                        </Button>
                    </div>
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
