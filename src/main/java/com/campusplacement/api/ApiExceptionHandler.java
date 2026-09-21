package com.campusplacement.api;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<?> badRequest(IllegalArgumentException e){return ResponseEntity.badRequest().body(java.util.Map.of("message",e.getMessage()));}
 @ExceptionHandler(SecurityException.class) ResponseEntity<?> unauthorized(SecurityException e){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message",e.getMessage()));}
}
