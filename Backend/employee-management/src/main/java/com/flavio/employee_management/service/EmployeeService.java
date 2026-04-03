package com.flavio.employee_management.service;

import com.flavio.employee_management.dto.EmployeeRequestDTO;
import com.flavio.employee_management.dto.EmployeeResponseDTO;
import com.flavio.employee_management.entity.Employee;
import com.flavio.employee_management.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public EmployeeResponseDTO create(EmployeeRequestDTO dto) {
        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setHireDate(dto.getHireDate());

        Employee saved = repository.save(employee);

        return convertToResponseDTO(saved);
    }

    public Page<EmployeeResponseDTO> findAll(Pageable pageable, String search) {
        Page<Employee> employees;

        if (search != null && !search.trim().isEmpty()) {
            employees = repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    search, search, pageable
            );
        } else {
            employees = repository.findAll(pageable);
        }

        return employees.map(this::convertToResponseDTO);
    }

    public EmployeeResponseDTO findById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com ID: " + id));
        return convertToResponseDTO(employee);
    }

    @Transactional
    public EmployeeResponseDTO update(Long id, EmployeeRequestDTO dto) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com ID: " + id));

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());
        employee.setHireDate(dto.getHireDate());

        Employee updated = repository.save(employee);
        return convertToResponseDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Funcionário não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    private EmployeeResponseDTO convertToResponseDTO(Employee employee) {
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getSalary(),
                employee.getHireDate()
        );
    }
}
