package com.flavio.employee_management.service;

import com.flavio.employee_management.dto.EmployeeRequestDTO;
import com.flavio.employee_management.dto.EmployeeResponseDTO;
import com.flavio.employee_management.entity.Employee;
import com.flavio.employee_management.repository.EmployeeRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

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

    // Exportar para CSV
    public void exportToCsv(HttpServletResponse response) throws Exception {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=funcionarios.csv");

        try (PrintWriter writer = response.getWriter()) {
            StatefulBeanToCsv<EmployeeResponseDTO> beanToCsv = new StatefulBeanToCsvBuilder<EmployeeResponseDTO>(writer)
                    .withQuotechar(CSVWriter.NO_QUOTE_CHARACTER)
                    .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
                    .build();

            List<EmployeeResponseDTO> employees = repository.findAll().stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());

            beanToCsv.write(employees);
        }
    }

    // Exportar para Excel (.xlsx)
    public void exportToExcel(HttpServletResponse response) throws Exception {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=funcionarios.xlsx");

        try (XSSFWorkbook workbook = new XSSFWorkbook()){
            XSSFSheet sheet = workbook.createSheet("Funcionários");

            // Cabeçalho
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Nome Completo", "Email", "Departamento", "Cargo", "Salário", "Data de Contratação"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                // Estilo negrito
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Dados
            List<Employee> employees = repository.findAll();
            int rowNum = 1;
            for (Employee emp : employees) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(emp.getId());
                row.createCell(1).setCellValue(emp.getFullName());
                row.createCell(2).setCellValue(emp.getEmail());
                row.createCell(3).setCellValue(emp.getDepartment() != null ? emp.getDepartment() : "--------");
                row.createCell(4).setCellValue(emp.getPosition() != null ? emp.getPosition() : "--------");
                row.createCell(5).setCellValue(emp.getSalary() != null ? emp.getSalary() : 0.0);
                row.createCell(6).setCellValue(emp.getHireDate() != null ? emp.getHireDate().toString() : "--------");
            }

            // Auto size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(response.getOutputStream());
        }
    }

    // Exportar para PDF
    public void exportToPdf(HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=funcionarios.pdf");

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Título
        com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 18, com.itextpdf.text.Font.BOLD);
        Paragraph title = new Paragraph("Relatório de Funcionários", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Tabela
        PdfPTable table = new PdfPTable(7); // 7 colunas
        table.setWidthPercentage(100);

        // Cabeçalhos
        com.itextpdf.text.Font headerFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12, com.itextpdf.text.Font.BOLD);
        String[] headers = {"ID", "Nome Completo", "Email", "Departamento", "Cargo", "Salário (R$)", "Data de Contratação"};
        for (String header: headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }

        // Dados
        com.itextpdf.text.Font dataFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 10);
        List<Employee> employees = repository.findAll();

        for (Employee emp : employees) {
            table.addCell(new PdfPCell(new Phrase(emp.getId().toString(), dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getFullName(), dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getEmail(), dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getDepartment() != null ? emp.getDepartment() : "--------", dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getPosition() != null ? emp.getPosition() : "--------", dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getSalary() != null ? String.format("%.2f", emp.getSalary()) : "0.00", dataFont)));
            table.addCell(new PdfPCell(new Phrase(emp.getHireDate() != null ? emp.getHireDate().toString() : "--------", dataFont)));
        }

        document.add(table);
        document.close();
    }
}
