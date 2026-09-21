package com.campusplacement.model;
import jakarta.persistence.*;
import java.time.LocalDate; import java.util.UUID;
@Entity public class Job {
 @Id private String id; @Column(nullable=false) private String title; private String roleType,workMode,location,description,companyName,logoUrl,website; private double salaryLpa,minCgpa; private int maxBacklogs,openPositions; private LocalDate applyDeadline;
 protected Job(){} public Job(String id,String title,String companyName,String location,double salary){this.id=id;this.title=title;this.companyName=companyName;this.location=location;this.salaryLpa=salary;this.roleType="Full Time";this.workMode="Hybrid";this.description="A career opportunity through the campus placement portal.";this.applyDeadline=LocalDate.now().plusMonths(1);}
 public String getId(){return id;} public String getTitle(){return title;} public String getRoleType(){return roleType;} public String getWorkMode(){return workMode;} public String getLocation(){return location;} public String getDescription(){return description;} public String getCompanyName(){return companyName;} public String getLogoUrl(){return logoUrl;} public String getWebsite(){return website;} public double getSalaryLpa(){return salaryLpa;} public double getMinCgpa(){return minCgpa;} public int getMaxBacklogs(){return maxBacklogs;} public int getOpenPositions(){return openPositions;} public LocalDate getApplyDeadline(){return applyDeadline;}
}
