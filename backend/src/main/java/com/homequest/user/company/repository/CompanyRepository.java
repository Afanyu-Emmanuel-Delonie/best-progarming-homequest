package com.homequest.user.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homequest.user.company.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
}
