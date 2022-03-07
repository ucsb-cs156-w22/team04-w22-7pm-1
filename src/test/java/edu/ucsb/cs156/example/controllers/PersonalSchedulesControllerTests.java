package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.PersonalScheduleRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = PersonalSchedulesController.class)
@Import(TestConfig.class)
public class PersonalSchedulesControllerTests extends ControllerTestCase {
    @MockBean
    PersonalScheduleRepository repo;

    @MockBean
    UserRepository userRepo;

    // Authorization tests for /api/PersonalSchedules/admin/all

    @Test
    public void personal_schedules_admin_all__logged_out() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_admin_all__user_logged_in() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_admin__user_logged_in() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/admin?id=7"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void personal_schedules_admin_all__admin_logged_in() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/admin/all"))
                .andExpect(status().isOk());
    }

    // Authorization tests for /api/PersonalSchedules/all

    @Test
    public void personal_schedules_all__logged_out() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_all__user_logged_in() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/all"))
                .andExpect(status().isOk());
    }

    // _________________________________________________________________________________
    // Test for /api/PersonalScchedules/admin/all
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void personal_schedules_admin_all() throws Exception {

        // arrange

        User u1 = User.builder().id(1L).build();
        User u2 = User.builder().id(2L).build();
        User u = currentUserService.getCurrentUser().getUser();

        PersonalSchedule s1 = PersonalSchedule.builder().name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(u1).id(1L).build();
        PersonalSchedule s2 = PersonalSchedule.builder().name("Schedule 2").description("Schedule 2").quarter("Quarter 2").user(u2).id(2L).build();
        PersonalSchedule s3 = PersonalSchedule.builder().name("Schedule 3").description("Schedule 3").quarter("Quarter 3").user(u).id(3L).build();

        ArrayList<PersonalSchedule> expected = new ArrayList<>();
        expected.addAll(Arrays.asList(s1, s2, s3));

        when(repo.findAll()).thenReturn(expected);

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules/admin/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repo, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expected);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // _________________________________________________________________________________
    // Test for /api/PersonalSchedules/all

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_all() throws Exception {

        // arrange

        User thisUser = currentUserService.getCurrentUser().getUser();

        PersonalSchedule s1 = PersonalSchedule.builder().name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(thisUser).id(1L).build();
        PersonalSchedule s2 = PersonalSchedule.builder().name("Schedule 2").description("Schedule 2").quarter("Quarter 2").user(thisUser).id(2L).build();
        ArrayList<PersonalSchedule> expected = new ArrayList<>();
        expected.addAll(Arrays.asList(s1, s2));
        when(repo.findAllByUserId(thisUser.getId())).thenReturn(expected);

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repo, times(1)).findAllByUserId(eq(thisUser.getId()));
        String expectedJson = mapper.writeValueAsString(expected);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedule_exists__user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule s1 = PersonalSchedule.builder().name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(u).id(7L).build();
        when(repository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repository, times(1)).findByIdAndUser(7L, u);
        String expectedJson = mapper.writeValueAsString(s1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_dne__user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        when(repository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repository, times(1)).findByIdAndUser(7L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedule_different_user__user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherSchedule = PersonalSchedule.builder()
                .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(13L).build();

        when(repository.findByIdAndUser(eq(13L), eq(otherUser))).thenReturn(Optional.of(otherSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedule?id=13"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repository, times(1)).findByIdAndUser(13L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 13 not found", json.get("message"));
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules/admin

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void personal_schedule_diff_user__admin() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherSchedule = PersonalSchedule.builder()
                .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(27L).build();

        when(repository.findById(eq(27L))).thenReturn(Optional.of(otherSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedule/admin?id=27"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repository, times(1)).findById(27L);
        String expectedJson = mapper.writeValueAsString(otherSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void personal_schedule_dne__admin() throws Exception {

        // arrange

        when(repository.findById(eq(29L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedule/admin?id=29"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repository, times(1)).findById(29L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 29 not found", json.get("message"));
    }
}