package com.homequest.user.client.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homequest.user.client.model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByUserPublicId(String userPublicId);

    List<Client> findByCompanyId(Long companyId);
}
