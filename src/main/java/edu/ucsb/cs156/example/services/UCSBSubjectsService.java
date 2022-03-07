package edu.ucsb.cs156.example.services;

import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import edu.ucsb.cs156.example.entities.UCSBSubject;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Service("UCSBSubjects")
public class UCSBSubjectsService {

        @Autowired
        ObjectMapper mapper = new ObjectMapper();

        @Value("${app.ucsb.api.consumer_key}")
        private String apiKey;

        public static final String ENDPOINT = "https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false";

        private final RestTemplate restTemplate;

        public UCSBSubjectsService(RestTemplateBuilder restTemplateBuilder) {
                restTemplate = restTemplateBuilder.build();
        }

        public List<UCSBSubject> get() throws JsonProcessingException {

                HttpHeaders headers = new HttpHeaders();
                headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("ucsb-api-key", this.apiKey);
                headers.set("ucsb-api-version", "1.0");

                HttpEntity<String> entity = new HttpEntity<>(headers);
                ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class);

                String UCSBSubjectJSON = re.getBody();
                List<UCSBSubject> UCSBSubjectList = mapper.readValue(UCSBSubjectJSON,
                                new TypeReference<List<UCSBSubject>>() {
                                });
                return UCSBSubjectList;
        }

}