package edu.ucsb.cs156.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
@Slf4j
@RestClientTest(UCSBCurriculumService.class)
public class UCSBCurriculumServiceTest {
    @Value("${app.ucsb.api.consumer_key}")
    private String apiKey;

    //@Mock
    //private RestTemplate restTemplate;

    @Autowired
    private UCSBCurriculumService ucs;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Test
    public void test_getJSON_success() throws Exception {
/*
        String expectedResult = "{expectedResult}";

        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(new ResponseEntity<String>(expectedResult, HttpStatus.OK));

        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "L";

        String result = ucs.getJSON(subjectArea, quarter, level);

        assertEquals(expectedResult, result);

        level = "A";
        result = ucs.getJSON(subjectArea, quarter, level);

        assertEquals(expectedResult, result);
*/      
        String expectedResult = "{expectResult}";
        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "L";
        String rawURL = "https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter={quarter_in}&subjectCode={subjectCode_in}&objLevelCode={objLevelCode_in}&pageNumber=1&pageSize=100&includeClassSections=true";
        
        String expectedURL = rawURL.replace("{quarter_in}", quarter).replace("{subjectCode_in}", subjectArea).replace("{objLevelCode_in}", level);
        log.info("URL = "+ expectedURL);
        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("ucsb-api-version", "1.0"))
            .andExpect(header("ucsb-api-key", apiKey))
            .andRespond(withSuccess(expectedResult, MediaType.APPLICATION_JSON));

        String result = ucs.getJSON(subjectArea, quarter, level);
        assertEquals(expectedResult, result);

    }
/*
    @Test
    public void test_getJSON_exception() throws Exception {

        String expectedResult = "{\"error\": \"401: Unauthorized\"}";

        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(HttpClientErrorException.class);

        String subjectArea = "CMPSC";
        String quarter = "20201";
        String level = "L";

        String result = ucs.getJSON(subjectArea, quarter, level);

        assertEquals(expectedResult, result);
    }


    @Test
    public void test_getSubjectsJSON_success() throws Exception {
        String expectedResult = "[ {deptCode: \"ANTH\"} ]";
        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(new ResponseEntity<String>(expectedResult, HttpStatus.OK));
        String result = ucs.getSubjectsJSON();
        assertEquals(expectedResult, result);
    }

    @Test
    public void test_getSubjectsJSON_exception() throws Exception {
        String expectedResult = "{\"error\": \"401: Unauthorized\"}";
        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(HttpClientErrorException.class);
        String result = ucs.getSubjectsJSON();
        assertEquals(expectedResult, result);
    }

*/
}