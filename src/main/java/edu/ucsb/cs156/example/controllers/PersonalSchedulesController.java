package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.models.CurrentUser;
import edu.ucsb.cs156.example.repositories.PersonalScheduleRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Api(description = "API to handle CRUD operations for Personal Schedule database")
@RequestMapping("/api/PersonalSchedules")
@RestController
public class PersonalSchedulesController extends ApiController{

    @Autowired
    PersonalScheduleRepository repository;

    // GET (all) functions
    @ApiOperation(value = "List all personal schedules")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<PersonalSchedule> allUsersSchedules() {
        Iterable<PersonalSchedule> schedules = repository.findAll();
        return schedules;
    }

    @ApiOperation(value = "List this user's schedules")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<PersonalSchedule> thisUsersSchedules() {
        CurrentUser currentUser = getCurrentUser();
        Iterable<PersonalSchedule> schedules = repository.findAllByUserId(currentUser.getUser().getId());
        return schedules;
    }

    // GET (single) functions

    @ApiOperation(value = "Get a single schedule (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public PersonalSchedule getScheduleById(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PersonalSchedule schedule = repository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        return schedule;
    }

    @ApiOperation(value = "Get a single schedule (no matter who it belongs to, admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public PersonalSchedule getScheduleById_admin(
            @ApiParam("id") @RequestParam Long id) {
        PersonalSchedule schedule = repository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        return schedule;
    }

    // POST 

    @ApiOperation(value = "Create a new PersonalSchedule")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public PersonalSchedule postPersonalSchedule(
            @ApiParam("name") @RequestParam String name,
            @ApiParam("description") @RequestParam String description,
            @ApiParam("quarter") @RequestParam String quarter) {
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        PersonalSchedule schedule = new PersonalSchedule();
        schedule.setUser(currentUser.getUser());
        schedule.setName(name);
        schedule.setDescription(description);
        schedule.setQuarter(quarter);
        PersonalSchedule savedSchedule = repository.save(schedule);
        return savedSchedule;
    }

    /* 

    // DELETE functions

    @ApiOperation(value = "Delete a Todo owned by this user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deleteTodo(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        Todo todo = todoRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(Todo.class, id));

        todoRepository.delete(todo);

        return genericMessage("Todo with id %s deleted".formatted(id));

    }

    @ApiOperation(value = "Delete another user's todo")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteTodo_Admin(
            @ApiParam("id") @RequestParam Long id) {
        Todo todo = todoRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Todo.class, id));

        todoRepository.delete(todo);

        return genericMessage("Todo with id %s deleted".formatted(id));
    }

    // EDIT functions
    
    @ApiOperation(value = "Update a single schedule (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public PersonalSchedule putScheduleById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PersonalSchedule incomingSchedule) {
        User currentUser = getCurrentUser().getUser();
        PersonalSchedule schedule = repository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        schedule.setName(incomingSchedule.getName());
        schedule.setDescription(incomingSchedule.getDescription());
        schedule.setQuarter(incomingSchedule.isQuarter());

        repository.save(schedule);

        return schedule;
    }

    @ApiOperation(value = "Update a single schedule (regardless of ownership, admin only, can't change ownership)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public PersonalSchedule putScheduleById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PersonalSchedule incomingSchedule) {
        PersonalSchedule schedule = todoRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        schedule.setName(incomingSchedule.getName());
        schedule.setDescription(incomingSchedule.getDescription());
        schedule.setQuarter(incomingSchedule.isQuarter());

        repository.save(schedule);

        return schedule;
    }
    */
}