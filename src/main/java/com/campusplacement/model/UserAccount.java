package com.campusplacement.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name = "users")
public class UserAccount {
  @Id @GeneratedValue private UUID id;
  @Column(nullable = false, unique = true) private String email;
  @Column(nullable = false) private String passwordHash;
  @Column(nullable = false) private String fullName;
  @Column(nullable = false) private String role;
  protected UserAccount() {}
  public UserAccount(String email, String passwordHash, String fullName, String role) { this.email=email; this.passwordHash=passwordHash; this.fullName=fullName; this.role=role; }
  public UUID getId(){return id;} public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public String getFullName(){return fullName;} public String getRole(){return role;}
}
