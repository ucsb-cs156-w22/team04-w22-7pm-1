package edu.ucsb.cs156.example.services;

import java.util.Map;
import java.util.Arrays;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/**
 * Service object that wraps the UCSB Academic Curriculum API
 */
@Service
public class UCSBCurriculumService {

    private Logger logger = LoggerFactory.getLogger(UCSBCurriculumService.class);

    @Value("${app.ucsb.api.consumer_key}")
    private String apiKey;

    ObjectMapper mapper = new ObjectMapper();

    private final RestTemplate restTemplate;

    public UCSBCurriculumService(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.build();
    }

    public String getJSON(String subjectArea, String quarter, String courseLevel) {
        logger.info("quarter={}", quarter, "subjectArea={}", subjectArea, "courseLevel={}", courseLevel);
        logger.info("KEY = {}", this.apiKey);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        String URL = "https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter={quarter_in}&subjectCode={subjectCode_in}&objLevelCode={objLevelCode_in}&pageNumber=1&pageSize=100&includeClassSections=true";

        Map<String, String> uriVariables = Map.of("quarter_in", quarter, "subjectCode_in", subjectArea,
                "objLevelCode_in", courseLevel);

        if (courseLevel.equals("A")) {
            URL = "https://api.ucsb.edu/academics/curriculums/v1/classes/search?quarter={quarter_in}&subjectCode={subjectCode_in}&pageNumber=1&pageSize=100&includeClassSections=true";

            uriVariables = Map.of("quarter_in", quarter, "subjectCode_in", subjectArea);
        }

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(URL, HttpMethod.GET, entity, String.class, uriVariables);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            logger.error("exception:", e);
            retVal = "{\"error\": \"See backend log for error & stack trace\"}";
        }
        logger.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;
    }

    public String getSubjectsJSON() {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        String url = "https://api.ucsb.edu/students/lookups/v1/subjects";
        logger.info("url=" + url);

        String retVal = "";
        MediaType contentType = null;
        HttpStatus statusCode = null;
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            contentType = re.getHeaders().getContentType();
            statusCode = re.getStatusCode();
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        logger.info("json: {} contentType: {} statusCode: {}", retVal, contentType, statusCode);
        return retVal;
    }

}