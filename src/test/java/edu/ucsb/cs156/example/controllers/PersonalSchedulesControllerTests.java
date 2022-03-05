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

    /*
    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_admin__user_logged_in() throws Exception {
        mockMvc.perform(get("/api/PersonalSchedules/admin?id=7"))
                .andExpect(status().is(403));
    }
    */

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
}