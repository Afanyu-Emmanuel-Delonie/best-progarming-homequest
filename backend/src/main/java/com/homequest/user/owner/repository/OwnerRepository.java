package com.homequest.user.owner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homequest.user.owner.model.Owner;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByUserPublicId(String userPublicId);
}
