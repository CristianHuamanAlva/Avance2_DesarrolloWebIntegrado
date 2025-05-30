package com.example.PetCare.PetCare.persistance;

import com.example.PetCare.PetCare.domain.Appointment;
import com.example.PetCare.PetCare.domain.repository.AppointmentRepository;
import com.example.PetCare.PetCare.persistance.crud.CitaCrudRepository;
import com.example.PetCare.PetCare.persistance.entity.Cita;
import com.example.PetCare.PetCare.persistance.mapper.AppointmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CitaRepository implements AppointmentRepository {

    @Autowired
    private CitaCrudRepository citaCrudRepository;

    @Autowired
    private AppointmentMapper mapper;

    @Override
    public List<Appointment> getAll() {
        List<Cita> citas = (List<Cita>) citaCrudRepository.findAll();
        return mapper.toAppointments(citas);
    }

    @Override
    public Optional<List<Appointment>> getByStatus(String status) {
        Optional<List<Cita>> citas = citaCrudRepository.findByEstado(status);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<List<Appointment>> getByVeterinarian(int veterinarianId) {
        Optional<List<Cita>> citas = citaCrudRepository.findByVeterinarioIdVeterinario(veterinarianId);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<List<Appointment>> getByMedicalRecord(int medicalRecordId) {
        Optional<List<Cita>> citas = citaCrudRepository.findByHistoriaClinicaIdHistoria(medicalRecordId);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<List<Appointment>> getByDate(LocalDateTime date) {
        Optional<List<Cita>> citas = citaCrudRepository.findByFechaHoraAfter(date);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<List<Appointment>> getByDateBetween(LocalDateTime start, LocalDateTime end) {
        Optional<List<Cita>> citas = citaCrudRepository.findByFechaHoraBetween(start, end);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<List<Appointment>> getByCause(String cause) {
        Optional<List<Cita>> citas = citaCrudRepository.findByMotivoContainingIgnoreCase(cause);
        return citas.map(cits -> mapper.toAppointments(cits));
    }

    @Override
    public Optional<Appointment> getAppointment(int appointmentId) {
        return citaCrudRepository.findById(appointmentId).map(cita -> mapper.toAppointment(cita));
    }

    @Override
    public Appointment save(Appointment appointment) {
        Cita cita = mapper.toCita(appointment);
        return mapper.toAppointment(citaCrudRepository.save(cita));
    }

    @Override
    public void delete(int appointmentId) {
        citaCrudRepository.deleteById(appointmentId);
    }
}
