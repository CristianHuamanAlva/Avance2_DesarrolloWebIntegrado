package com.example.PetCare.PetCare.persistance;

import com.example.PetCare.PetCare.domain.Serv;
import com.example.PetCare.PetCare.domain.repository.ServRepository;
import com.example.PetCare.PetCare.persistance.crud.ServicioCrudRepository;
import com.example.PetCare.PetCare.persistance.entity.Servicio;
import com.example.PetCare.PetCare.persistance.mapper.ServMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ServicioRepository implements ServRepository {

    @Autowired
    private ServicioCrudRepository servicioCrudRepository;

    @Autowired
    private ServMapper mapper;

    @Override
    public List<Serv> getAll() {
        List<Servicio> servicios = (List<Servicio>) servicioCrudRepository.findAll();
        return mapper.toServices(servicios);
    }

    @Override
    public Optional<List<Serv>> getByName(String name) {
        List<Servicio> servicios = (List<Servicio>) servicioCrudRepository.findByNombreServicioContainingIgnoreCase(name);
        return Optional.of(mapper.toServices(servicios));
    }

    @Override
    public Optional<List<Serv>> getByCostoLessThan(double maxPrice) {
        Optional<List<Servicio>>  servicios = servicioCrudRepository.findByCostoLessThan(maxPrice);
        return servicios.map(servs -> mapper.toServices(servs));
    }

    @Override
    public Optional<List<Serv>> getByCostoGreaterThanEqual(double minPrice) {
        Optional<List<Servicio>>  servicios = servicioCrudRepository.findByCostoGreaterThanEqual(minPrice);
        return servicios.map(servs -> mapper.toServices(servs));
    }

    @Override
    public Optional<List<Serv>> getByCostoBetween(double from, double until) {
        Optional<List<Servicio>>  servicios = servicioCrudRepository.findByCostoBetween(from, until);
        return servicios.map(servs -> mapper.toServices(servs));
    }

    @Override
    public Optional<Serv> getService(int serviceId) {
        return servicioCrudRepository.findById(serviceId).map(servicio -> mapper.toService(servicio));
    }

    @Override
    public Serv save(Serv serv) {
        Servicio servicio = mapper.toServicio(serv);
        return mapper.toService(servicioCrudRepository.save(servicio));
    }

    @Override
    public void delete(int serviceId) {
        servicioCrudRepository.deleteById(serviceId);
    }
}
