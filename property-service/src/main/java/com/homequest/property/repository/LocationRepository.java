package com.homequest.property.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homequest.property.model.Location;
import com.homequest.property.model.LocationType;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByCode(String code);
    List<Location> findByType(LocationType type);
    List<Location> findByParentCode(String parentCode);
}
