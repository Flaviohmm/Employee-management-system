export interface Employee {
    id: number;
    fullName: string;
    email: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
    key: keyof Employee | null;
    direction: SortDirection;
}

export const DEPARTMENTS = [
    'Engenharia',
    'Marketing',
    'Vendas',
    'RH',
    'Financeiro',
    'Operações',
    'TI',
    'Jurídico',
] as const;

export const POSITIONS = [
    'Estagiário',
    'Júnior',
    'Pleno',
    'Sênior',
    'Tech Lead',
    'Gerente',
    'Diretor',
    'VP',
] as const;