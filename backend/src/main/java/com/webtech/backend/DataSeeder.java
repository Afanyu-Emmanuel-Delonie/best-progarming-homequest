package com.webtech.backend;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.auth.model.Role;
import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;
import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.FundingSource;
import com.homequest.property.model.Location;
import com.homequest.property.model.LocationType;
import com.homequest.property.model.Property;
import com.homequest.property.model.PropertyApplication;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;
import com.homequest.property.repository.LocationRepository;
import com.homequest.property.repository.PropertyApplicationRepository;
import com.homequest.property.repository.PropertyRepository;
import com.homequest.transaction.model.Commission;
import com.homequest.transaction.model.CommissionRecipientType;
import com.homequest.transaction.model.Transaction;
import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.model.TransactionType;
import com.homequest.transaction.repository.CommissionRepository;
import com.homequest.transaction.repository.TransactionRepository;
import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.model.AgentStatus;
import com.homequest.user.agent.repository.AgentRepository;
import com.homequest.user.client.model.Client;
import com.homequest.user.client.repository.ClientRepository;
import com.homequest.user.company.model.Company;
import com.homequest.user.company.repository.CompanyRepository;
import com.homequest.user.owner.model.Owner;
import com.homequest.user.owner.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AgentRepository agentRepository;
    private final OwnerRepository ownerRepository;
    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final LocationRepository locationRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyApplicationRepository applicationRepository;
    private final TransactionRepository transactionRepository;
    private final CommissionRepository commissionRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }

        log.info("Seeding database...");

        // ── 1. LOCATIONS ──────────────────────────────────────────────
        Location country = locationRepository.save(Location.builder()
                .code("RW").name("Rwanda").type(LocationType.COUNTRY).build());

        Location kigali = locationRepository.save(Location.builder()
                .code("RW-KGL").name("Kigali City").type(LocationType.PROVINCE).parent(country).build());

        Location gasabo = locationRepository.save(Location.builder()
                .code("RW-KGL-GSB").name("Gasabo").type(LocationType.DISTRICT).parent(kigali).build());

        Location nyarugenge = locationRepository.save(Location.builder()
                .code("RW-KGL-NYR").name("Nyarugenge").type(LocationType.DISTRICT).parent(kigali).build());

        Location northern = locationRepository.save(Location.builder()
                .code("RW-NOR").name("Northern Province").type(LocationType.PROVINCE).parent(country).build());

        Location musanze = locationRepository.save(Location.builder()
                .code("RW-NOR-MSZ").name("Musanze").type(LocationType.DISTRICT).parent(northern).build());

        log.info("Locations seeded.");

        // ── 2. COMPANY ────────────────────────────────────────────────
        Company company = companyRepository.save(new Company());
        Long companyId = company.getId();
        log.info("Company seeded with id={}", companyId);

        // ── 3. AUTH USERS ─────────────────────────────────────────────
        User adminUser  = saveUser("John",  "Admin",      "admin@homequest.rw",  "Admin@1234",  Role.ROLE_ADMIN);
        User agent1User = saveUser("Alice", "Uwase",      "alice@homequest.rw",  "Agent@1234",  Role.ROLE_AGENT);
        User agent2User = saveUser("Bob",   "Mugisha",    "bob@homequest.rw",    "Agent@1234",  Role.ROLE_AGENT);
        User ownerUser  = saveUser("Eric",  "Nkurunziza", "owner@homequest.rw",  "Owner@1234",  Role.ROLE_OWNER);
        User clientUser = saveUser("Marie", "Ingabire",   "client@homequest.rw", "Client@1234", Role.ROLE_CUSTOMER);

        log.info("Auth users seeded.");

        // ── 4. PROFILES ───────────────────────────────────────────────
        Agent alice = agentRepository.save(Agent.builder()
                .userPublicId(agent1User.getPublicId().toString())
                .firstName("Alice").lastName("Uwase")
                .phone("+250780000002").licenseNumber("LIC-AGT-001")
                .companyId(companyId).status(AgentStatus.ACTIVE).build());

        Agent bob = agentRepository.save(Agent.builder()
                .userPublicId(agent2User.getPublicId().toString())
                .firstName("Bob").lastName("Mugisha")
                .phone("+250780000003").licenseNumber("LIC-AGT-002")
                .companyId(companyId).status(AgentStatus.ACTIVE).build());

        Owner owner = ownerRepository.save(Owner.builder()
                .userPublicId(ownerUser.getPublicId().toString())
                .firstName("Eric").lastName("Nkurunziza")
                .phone("+250780000005").nationalId("1199880012345678").build());

        Client client = clientRepository.save(Client.builder()
                .userPublicId(clientUser.getPublicId().toString())
                .firstName("Marie").lastName("Ingabire")
                .phone("+250780000006").build());

        log.info("Profiles seeded.");

        // ── 5. PROPERTIES ─────────────────────────────────────────────
        Property prop1 = propertyRepository.save(Property.builder()
                .title("Modern 3BR Apartment in Gasabo")
                .description("Spacious apartment with great views in Gasabo district.")
                .price(new BigDecimal("120000.00"))
                .listingPrice(new BigDecimal("120000.00"))
                .address("KG 123 St").city("Kigali").country("Rwanda")
                .bedrooms(3).bathrooms(2).areaSqm(new BigDecimal("120.00"))
                .type(PropertyType.APARTMENT).status(PropertyStatus.AVAILABLE)
                .locationCode(gasabo.getCode())
                .listingAgentPublicId(alice.getUserPublicId())
                .ownerPublicId(owner.getUserPublicId())
                .companyId(companyId).build());

        Property prop2 = propertyRepository.save(Property.builder()
                .title("Executive Villa in Nyarugenge")
                .description("Luxury villa with pool and garden.")
                .price(new BigDecimal("350000.00"))
                .listingPrice(new BigDecimal("350000.00"))
                .address("KN 45 Ave").city("Kigali").country("Rwanda")
                .bedrooms(5).bathrooms(4).areaSqm(new BigDecimal("400.00"))
                .type(PropertyType.VILLA).status(PropertyStatus.AVAILABLE)
                .locationCode(nyarugenge.getCode())
                .listingAgentPublicId(alice.getUserPublicId())
                .ownerPublicId(owner.getUserPublicId())
                .companyId(companyId).build());

        Property prop3 = propertyRepository.save(Property.builder()
                .title("Commercial Office Space in Musanze")
                .description("Prime office space in Musanze town center.")
                .price(new BigDecimal("85000.00"))
                .listingPrice(new BigDecimal("85000.00"))
                .address("MZ 10 Blvd").city("Musanze").country("Rwanda")
                .bedrooms(0).bathrooms(2).areaSqm(new BigDecimal("200.00"))
                .type(PropertyType.OFFICE).status(PropertyStatus.UNDER_OFFER)
                .locationCode(musanze.getCode())
                .listingAgentPublicId(bob.getUserPublicId())
                .sellingAgentPublicId(alice.getUserPublicId())
                .ownerPublicId(owner.getUserPublicId())
                .companyId(companyId).build());

        Property prop4 = propertyRepository.save(Property.builder()
                .title("2BR House in Gasabo")
                .description("Cozy family house near schools and shops.")
                .price(new BigDecimal("75000.00"))
                .listingPrice(new BigDecimal("75000.00"))
                .address("KG 88 St").city("Kigali").country("Rwanda")
                .bedrooms(2).bathrooms(1).areaSqm(new BigDecimal("90.00"))
                .type(PropertyType.HOUSE).status(PropertyStatus.SOLD)
                .locationCode(gasabo.getCode())
                .listingAgentPublicId(bob.getUserPublicId())
                .sellingAgentPublicId(bob.getUserPublicId())
                .ownerPublicId(owner.getUserPublicId())
                .buyerPublicId(clientUser.getPublicId().toString())
                .companyId(companyId).build());

        log.info("Properties seeded.");

        // ── 6. PROPERTY APPLICATIONS ──────────────────────────────────
        applicationRepository.save(PropertyApplication.builder()
                .propertyId(prop1.getId())
                .buyerPublicId(clientUser.getPublicId().toString())
                .buyerFullName("Marie Ingabire")
                .buyerNationalId("1199990098765432")
                .buyerPhone("+250780000006")
                .offerAmount(new BigDecimal("115000.00"))
                .depositAmount(new BigDecimal("11500.00"))
                .fundingSource(FundingSource.BANK_MORTGAGE)
                .proposedClosingDate(LocalDate.now().plusMonths(2))
                .offerExpirationDate(LocalDate.now().plusDays(14))
                .specialConditions("Including all kitchen appliances")
                .status(ApplicationStatus.PENDING).build());

        applicationRepository.save(PropertyApplication.builder()
                .propertyId(prop2.getId())
                .buyerPublicId(clientUser.getPublicId().toString())
                .buyerFullName("Marie Ingabire")
                .buyerNationalId("1199990098765432")
                .buyerPhone("+250780000006")
                .offerAmount(new BigDecimal("340000.00"))
                .depositAmount(new BigDecimal("34000.00"))
                .fundingSource(FundingSource.CASH)
                .proposedClosingDate(LocalDate.now().plusMonths(1))
                .offerExpirationDate(LocalDate.now().plusDays(7))
                .status(ApplicationStatus.PENDING).build());

        applicationRepository.save(PropertyApplication.builder()
                .propertyId(prop3.getId())
                .buyerPublicId(ownerUser.getPublicId().toString())
                .buyerFullName("Eric Nkurunziza")
                .buyerNationalId("1199880012345678")
                .buyerPhone("+250780000005")
                .offerAmount(new BigDecimal("83000.00"))
                .depositAmount(new BigDecimal("8300.00"))
                .fundingSource(FundingSource.PAYMENT_PLAN)
                .proposedClosingDate(LocalDate.now().plusMonths(3))
                .offerExpirationDate(LocalDate.now().plusDays(10))
                .specialConditions("Payment in 12 monthly installments")
                .status(ApplicationStatus.ACCEPTED).build());

        log.info("Property applications seeded.");

        // ── 7. COMPLETED TRANSACTION WITH COMMISSION SPLIT ────────────
        // prop4 is SOLD — bob listed it, bob sold it, client bought it
        BigDecimal saleAmount = new BigDecimal("75000.00");
        BigDecimal commissionRate = new BigDecimal("0.05"); // 5%
        BigDecimal totalCommission = saleAmount.multiply(commissionRate);           // 3750
        BigDecimal companyCommission = totalCommission.multiply(new BigDecimal("0.10")); // 375
        BigDecimal agentPool = totalCommission.subtract(companyCommission);          // 3375
        BigDecimal listingAgentCommission = agentPool.multiply(new BigDecimal("0.30")); // 1012.50
        BigDecimal sellingAgentCommission = agentPool.multiply(new BigDecimal("0.70")); // 2362.50

        Transaction tx = transactionRepository.save(Transaction.builder()
                .propertyId(prop4.getId())
                .listingAgentPublicId(bob.getUserPublicId())
                .sellingAgentPublicId(bob.getUserPublicId())
                .ownerPublicId(owner.getUserPublicId())
                .buyerPublicId(clientUser.getPublicId().toString())
                .companyId(companyId)
                .saleAmount(saleAmount)
                .commissionRate(commissionRate)
                .totalCommission(totalCommission)
                .companyCommission(companyCommission)
                .listingAgentCommission(listingAgentCommission)
                .sellingAgentCommission(sellingAgentCommission)
                .type(TransactionType.SALE)
                .status(TransactionStatus.COMPLETED).build());

        commissionRepository.saveAll(List.of(
                Commission.builder().transactionId(tx.getId())
                        .recipientPublicId(bob.getUserPublicId())
                        .recipientType(CommissionRecipientType.LISTING_AGENT)
                        .amount(listingAgentCommission).build(),
                Commission.builder().transactionId(tx.getId())
                        .recipientPublicId(bob.getUserPublicId())
                        .recipientType(CommissionRecipientType.SELLING_AGENT)
                        .amount(sellingAgentCommission).build(),
                Commission.builder().transactionId(tx.getId())
                        .recipientPublicId(String.valueOf(companyId))
                        .recipientType(CommissionRecipientType.COMPANY)
                        .amount(companyCommission).build()));

        log.info("Transaction and commissions seeded.");
        log.info("✅ Database seeding complete.");
        log.info("──────────────────────────────────────────");
        log.info("Test credentials:");
        log.info("  Admin       : admin@homequest.rw  / Admin@1234");
        log.info("  Agent Alice : alice@homequest.rw  / Agent@1234");
        log.info("  Agent Bob   : bob@homequest.rw    / Agent@1234");
        log.info("  Owner       : owner@homequest.rw  / Owner@1234");
        log.info("  Customer    : client@homequest.rw / Client@1234");
        log.info("──────────────────────────────────────────");
    }

    private User saveUser(String firstName, String lastName, String email, String password, Role role) {
        String username = (firstName + lastName).toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
        return userRepository.save(User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .isActive(true)
                .build());
    }
}
