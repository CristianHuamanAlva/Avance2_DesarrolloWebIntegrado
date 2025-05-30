package com.example.PetCare.PetCare.persistance;

import com.example.PetCare.PetCare.domain.Owner;
import com.example.PetCare.PetCare.domain.repository.OwnerRepository;
import com.example.PetCare.PetCare.persistance.crud.DuenioCrudRepository;
import com.example.PetCare.PetCare.persistance.entity.Duenio;
import com.example.PetCare.PetCare.persistance.entity.Usuario;
import com.example.PetCare.PetCare.persistance.mapper.OwnerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DuenioRepository implements OwnerRepository {

    @Autowired
    private DuenioCrudRepository duenioCrudRepository;

    @Autowired
    private OwnerMapper mapper;


    @Override
    public List<Owner> getAll() {
        return mapper.toOwners((List<Duenio>) duenioCrudRepository.findAll());
    }

    @Override
    public Optional<Owner> getOwner(int ownerId) {
        return duenioCrudRepository.findById(ownerId).map(mapper::toOwner);
    }

    @Override
    public Optional<Owner> getByUserId(int userId) {
        return duenioCrudRepository.findByUsuario_IdUsuario(userId).map(mapper::toOwner);
    }

    @Override
    public List<Owner> getByAddress(String address) {
        return duenioCrudRepository.findByDireccionContainingIgnoreCase(address)
                .stream()
                .map(mapper::toOwner)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Owner> getByPhone(String phone) {
        return duenioCrudRepository.findByTelefono(phone).map(mapper::toOwner);
    }

    @Override
    public boolean existsByUserId(int userId) {
        return duenioCrudRepository.existsByUsuario_IdUsuario(userId);
    }

    @Override
    public Owner save(Owner owner) {
        Duenio duenio;

        if (owner.getOwnerId() == 0) {
            // Crear nuevo dueño
            duenio = mapper.toDuenio(owner);

            // Asegurar que se mantenga el usuario (asociado por ID)
            Usuario usuario = new Usuario();
            usuario.setIdUsuario(owner.getUser().getUserId());
            duenio.setUsuario(usuario);

        } else {
            // Editar dueño existente
            Optional<Duenio> existenteOpt = duenioCrudRepository.findById(owner.getOwnerId());
            if (existenteOpt.isPresent()) {
                Duenio existente = existenteOpt.get();

                // Actualizar solo los campos modificables
                existente.setTelefono(owner.getPhone());
                existente.setDireccion(owner.getAddress());

                // (Opcional) Asegurarse de no cambiar el usuario
                // pero si necesitas permitir eso, también puedes setear el usuario aquí

                duenio = existente;
            } else {
                // No encontrado, crear nuevo
                duenio = mapper.toDuenio(owner);
                Usuario usuario = new Usuario();
                usuario.setIdUsuario(owner.getUser().getUserId());
                duenio.setUsuario(usuario);
            }
        }

        return mapper.toOwner(duenioCrudRepository.save(duenio));
    }


    @Override
    public void delete(int ownerId) {
        duenioCrudRepository.deleteById(ownerId);
    }
}
