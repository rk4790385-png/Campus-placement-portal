package com.campusplacement.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity public class StudentProfile {
  @Id private UUID id;
  @OneToOne @MapsId private UserAccount user;
  private String phone="", usn="", branch="", skills="", linkedin="", github="", portfolio="", resumeUrl="", bio="";
  private Integer semester, backlogs; private Double cgpa;
  protected StudentProfile() {} public StudentProfile(UserAccount user){this.user=user;}
  public UUID getId(){return id;} public String getPhone(){return phone;} public String getUsn(){return usn;} public String getBranch(){return branch;} public String getSkills(){return skills;} public String getLinkedin(){return linkedin;} public String getGithub(){return github;} public String getPortfolio(){return portfolio;} public String getResumeUrl(){return resumeUrl;} public String getBio(){return bio;} public Integer getSemester(){return semester;} public Integer getBacklogs(){return backlogs;} public Double getCgpa(){return cgpa;}
  public void update(String phone,String usn,String branch,Integer semester,Double cgpa,Integer backlogs,String skills,String linkedin,String github,String portfolio,String resumeUrl,String bio){this.phone=phone;this.usn=usn;this.branch=branch;this.semester=semester;this.cgpa=cgpa;this.backlogs=backlogs;this.skills=skills;this.linkedin=linkedin;this.github=github;this.portfolio=portfolio;this.resumeUrl=resumeUrl;this.bio=bio;}
}
