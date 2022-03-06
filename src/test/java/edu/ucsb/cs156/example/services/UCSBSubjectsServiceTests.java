package edu.ucsb.cs156.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.junit.jupiter.api.Test;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBSubject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.HttpClientErrorException;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;

@RestClientTest(UCSBSubjectsService.class)
class UCSBSubjectsServiceTests extends ControllerTestCase {

  @Autowired
  private MockRestServiceServer mockRestServiceServer;

  @Autowired
  private UCSBSubjectsService ucsbSubjectsService;

  @Test
  void get_returns_a_list_of_subjects() throws HttpClientErrorException, JsonProcessingException {
    String fakeJsonResult = "{ \"fake\" : \"result\" }";
    String expectedURL = UCSBSubjectsService.ENDPOINT;
    this.mockRestServiceServer.expect(requestTo(expectedURL))
        .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
        .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
        .andRespond(withSuccess(fakeJsonResult, MediaType.APPLICATION_JSON));

    List<UCSBSubject> actualResult = ucsbSubjectsService.get();
    assertEquals(fakeJsonResult, actualResult);
  }

}
