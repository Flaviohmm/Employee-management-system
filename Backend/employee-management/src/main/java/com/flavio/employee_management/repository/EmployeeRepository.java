package com.flavio.employee_management.repository;

import com.flavio.employee_management.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Busca por nome ou sobrenome (ignorando maiúsculas/minúsculas)
    Page<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName, Pageable pageable);

    // Busca por departamento
    Page<Employee> findByDepartmentContainingIgnoreCase(String department, Pageable pageable);
}
