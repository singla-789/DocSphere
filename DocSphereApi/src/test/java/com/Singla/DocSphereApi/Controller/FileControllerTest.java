package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.DTO.FileMetaDataDto;
import com.Singla.DocSphereApi.Security.ClerkJwksProvider;
import com.Singla.DocSphereApi.Service.FileMetaDataService;
import com.Singla.DocSphereApi.Service.UserCreditsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FileController.class)
@AutoConfigureMockMvc(addFilters = false)
class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileMetaDataService fileMetaDataService;

    @MockBean
    private UserCreditsService userCreditsService;

    @MockBean
    private ClerkJwksProvider clerkJwksProvider;

    @Test
    void uploadFiles_returnsOkWithFilesAndRemainingCredits() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "test-doc.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, upload test!".getBytes()
        );

        FileMetaDataDto dto = FileMetaDataDto.builder()
                .id("file-123")
                .name("test-doc.txt")
                .type(MediaType.TEXT_PLAIN_VALUE)
                .size(19L)
                .clerkId("test-clerk-id")
                .isPublic(false)
                .uploadedAt(LocalDateTime.now())
                .build();

        when(fileMetaDataService.uploadFiles(any(MultipartFile[].class)))
                .thenReturn(List.of(dto));
        when(userCreditsService.getuserCredits())
                .thenReturn(UserCredits.builder().credits(4).build());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/files/upload")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.files").isArray())
                .andExpect(jsonPath("$.files.length()").value(1))
                .andExpect(jsonPath("$.files[0].name").value("test-doc.txt"))
                .andExpect(jsonPath("$.files[0].id").value("file-123"))
                .andExpect(jsonPath("$.remainingCredits").value(4));

        verify(fileMetaDataService).uploadFiles(any(MultipartFile[].class));
        verify(userCreditsService).getuserCredits();
    }

    @Test
    void uploadFiles_multipleFiles_returnsAllInResponse() throws Exception {
        MockMultipartFile file1 = new MockMultipartFile("files", "a.txt", "text/plain", "content a".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("files", "b.txt", "text/plain", "content b".getBytes());

        FileMetaDataDto dto1 = FileMetaDataDto.builder().id("1").name("a.txt").build();
        FileMetaDataDto dto2 = FileMetaDataDto.builder().id("2").name("b.txt").build();

        when(fileMetaDataService.uploadFiles(any(MultipartFile[].class)))
                .thenReturn(List.of(dto1, dto2));
        when(userCreditsService.getuserCredits())
                .thenReturn(UserCredits.builder().credits(3).build());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/files/upload")
                        .file(file1)
                        .file(file2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.files.length()").value(2))
                .andExpect(jsonPath("$.remainingCredits").value(3));

        verify(fileMetaDataService).uploadFiles(any(MultipartFile[].class));
    }
}
