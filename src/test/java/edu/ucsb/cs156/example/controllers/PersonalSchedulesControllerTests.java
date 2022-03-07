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

    // _________________________________________________________________________________
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

    // _________________________________________________________________________________
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
        when(repo.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repo, times(1)).findByIdAndUser(7L, u);
        String expectedJson = mapper.writeValueAsString(s1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void personal_schedules_dne__user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        when(repo.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repo, times(1)).findByIdAndUser(7L, u);
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

        when(repo.findByIdAndUser(eq(13L), eq(otherUser))).thenReturn(Optional.of(otherSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules?id=13"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repo, times(1)).findByIdAndUser(13L, u);
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

        when(repo.findById(eq(27L))).thenReturn(Optional.of(otherSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules/admin?id=27"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(repo, times(1)).findById(27L);
        String expectedJson = mapper.writeValueAsString(otherSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void personal_schedule_dne__admin() throws Exception {

        // arrange

        when(repo.findById(eq(29L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/PersonalSchedules/admin?id=29"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(repo, times(1)).findById(29L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 29 not found", json.get("message"));
    }

    // _________________________________________________________________________________
    // Test for /api/PersonalSchedules/post

    @WithMockUser(roles = { "USER" })
    @Test
    public void post_personal_schedule() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        PersonalSchedule expectedSchedule = PersonalSchedule.builder()
                .name("Schedule 1")
                .description("Schedule 1")
                .quarter("Quarter 1")
                .user(u)
                .id(0L)
                .build();

        when(repo.save(eq(expectedSchedule))).thenReturn(expectedSchedule);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/PersonalSchedules/post?name=Schedule 1&description=Schedule 1&quarter=Quarter 1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(repo, times(1)).save(expectedSchedule);
        String expectedJson = mapper.writeValueAsString(expectedSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules DELETE

    @WithMockUser(roles = { "USER" })
    @Test
    public void delete_personal_schedule__user() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule s1 = PersonalSchedule.builder().name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(u).id(15L).build();
        when(repo.findByIdAndUser(eq(15L), eq(u))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/PersonalSchedules?id=15")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(15L, u);
        verify(repo, times(1)).delete(s1);
        Map<String, Object> json = responseToJson(response);
        assertEquals("PersonalSchedule with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void delete_personal_schedule_dne__user() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(98L).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(15L).build();
        when(repo.findByIdAndUser(eq(15L), eq(otherUser))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/PersonalSchedules?id=15")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(15L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("PersonalSchedule with id 15 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void delete_diff_user_personal_schedule__user() throws Exception {
        // arrange
        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(98L).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(31L).build();
        when(repo.findById(eq(31L))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/PersonalSchedules?id=31")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(31L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("PersonalSchedule with id 31 not found", json.get("message"));
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules/admin DELETE

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void delete_personal_schedule__admin() throws Exception {
        // arrange

        User otherUser = User.builder().id(98L).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(16L).build();
        when(repo.findById(eq(16L))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/PersonalSchedules/admin?id=16")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(repo, times(1)).findById(16L);
        verify(repo, times(1)).delete(s1);
        Map<String, Object> output = responseToJson(response);
        assertEquals("PersonalSchedule with id 16 deleted", output.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void delete_personal_schedule_dne__admin() throws Exception {
        // arrange

        when(repo.findById(eq(17L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/PersonalSchedules/admin?id=17")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findById(17L);
        Map<String, Object> output = responseToJson(response);
        assertEquals("PersonalSchedule with id 17 not found", output.get("message"));
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules PUT/EDIT

    @WithMockUser(roles = { "USER" })
    @Test
    public void put_personal_schedule__user() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(u).id(67L).build();
        // We deliberately set the user information to another user
        // This should get ignored and overwritten with current user when PersonalSchedule is saved

        PersonalSchedule updatedSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").user(otherUser).id(67L).build();
        PersonalSchedule correctSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").user(u).id(67L).build();

        String requestBody = mapper.writeValueAsString(updatedSchedule);
        String expectedReturn = mapper.writeValueAsString(correctSchedule);

        when(repo.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/PersonalSchedules?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(67L, u);
        verify(repo, times(1)).save(correctSchedule); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedReturn, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void put_personal_schedule_dne__user() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule updatedSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").id(67L).build();

        String requestBody = mapper.writeValueAsString(updatedSchedule);

        when(repo.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/PersonalSchedules?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(67L, u);
        Map<String, Object> output = responseToJson(response);
        assertEquals("PersonalSchedule with id 67 not found", output.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void put_personal_schedule_diff_user__user() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(98L).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(31L).build();
        PersonalSchedule updatedSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").id(31L).build();

        when(repo.findByIdAndUser(eq(31L), eq(otherUser))).thenReturn(Optional.of(s1));

        String requestBody = mapper.writeValueAsString(updatedSchedule);

        // act
        MvcResult response = mockMvc.perform(
                put("/api/PersonalSchedules?id=31")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findByIdAndUser(31L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 31 not found", json.get("message"));
    }

    // _________________________________________________________________________________
    // Tests for /api/PersonalSchedules/admin PUT/EDIT

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void put_personal_schedule__admin() throws Exception {
        // arrange

        User otherUser = User.builder().id(255L).build();
        PersonalSchedule s1 = PersonalSchedule.builder()
            .name("Schedule 1").description("Schedule 1").quarter("Quarter 1").user(otherUser).id(77L).build();
        User yetAnotherUser = User.builder().id(512L).build();
        // We deliberately put the wrong user on the updated todo
        // We expect the controller to ignore this and keep the user the same
        PersonalSchedule updatedSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").user(yetAnotherUser).id(77L).build();
        PersonalSchedule correctSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").user(otherUser).id(77L).build();

        String requestBody = mapper.writeValueAsString(updatedSchedule);
        String expectedJson = mapper.writeValueAsString(correctSchedule);

        when(repo.findById(eq(77L))).thenReturn(Optional.of(s1));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/PersonalSchedules/admin?id=77")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(repo, times(1)).findById(77L);
        verify(repo, times(1)).save(correctSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void put_personal_schedules_dne__admin() throws Exception {
        // arrange

        User otherUser = User.builder().id(345L).build();
        PersonalSchedule updatedSchedule = PersonalSchedule.builder()
            .name("New Schedule").description("New Schedule").quarter("New Quarter").user(otherUser).id(77L).build();

        String requestBody = mapper.writeValueAsString(updatedSchedule);

        when(repo.findById(eq(77L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/PersonalSchedules/admin?id=77")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(repo, times(1)).findById(77L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 77 not found", json.get("message"));
    }

}