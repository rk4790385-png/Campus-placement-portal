package com.campusplacement.model;
import jakarta.persistence.*;
import java.time.Instant; import java.util.UUID;
@Entity @Table(name="applications", uniqueConstraints=@UniqueConstraint(columnNames={"student_id","job_id"})) public class Application {
 @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) @JoinColumn(name="student_id") private UserAccount student; @ManyToOne(optional=false) private Job job; @Column(nullable=false) private String status="applied"; @Column(nullable=false) private Instant appliedAt=Instant.now();
 protected Application(){} public Application(UserAccount student,Job job){this.student=student;this.job=job;} public UUID getId(){return id;} public UserAccount getStudent(){return student;} public Job getJob(){return job;} public String getStatus(){return status;} public Instant getAppliedAt(){return appliedAt;}
 public void setStatus(String status){this.status=status;}
}
