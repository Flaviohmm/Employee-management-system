package com.flavio.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O primeiro nome é obrigatório")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "O sobrenome é obrigatório")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    @Column(nullable = false, unique = true)
    private String email;

    private String department;

    private String position;

    @NotNull(message = "O salário é obrigatório")
    private Double salary;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate hireDate;

    // Nome completo calculado (conveniência)
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
