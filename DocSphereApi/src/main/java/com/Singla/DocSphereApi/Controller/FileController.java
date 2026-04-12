package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.DTO.FileMetaDataDto;
import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.Service.FileMetaDataService;
import com.Singla.DocSphereApi.Service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {
    private final FileMetaDataService fileMetaDataService;
    private final UserCreditsService userCreditsService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestPart("files") MultipartFile files[]) throws IOException{
        Map<String, Object> response = new HashMap<>();
        List<FileMetaDataDto> list = fileMetaDataService.uploadFiles(files);

        UserCredits finalCredits = userCreditsService.getuserCredits();

        response.put("files", list);
        response.put("remainingCredits",finalCredits.getCredits());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getFilesForCurrentUser() {
        List<FileMetaDataDto> files = fileMetaDataService.getFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicFile(@PathVariable String id){
        FileMetaDataDto file = fileMetaDataService.getPublicFile(id);
        return ResponseEntity.ok(file);
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<org.springframework.core.io.InputStreamResource> download(@PathVariable String id) throws IOException {
        FileMetaDataDto downloadableFile = fileMetaDataService.getDownloadableFile(id);

        software.amazon.awssdk.core.ResponseInputStream<software.amazon.awssdk.services.s3.model.GetObjectResponse> s3Stream =
                fileMetaDataService.downloadFile(id);

        String contentType = downloadableFile.getType() != null ? downloadableFile.getType() : "application/octet-stream";
        String fileName = downloadableFile.getName() != null ? downloadableFile.getName() : "download";

        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .body(new org.springframework.core.io.InputStreamResource(s3Stream));
    }

    @GetMapping("/preview/{id}")
    public ResponseEntity<?> preview(@PathVariable String id) throws IOException {
        FileMetaDataDto file = fileMetaDataService.getPublicFile(id);
        java.net.URI location = UriComponentsBuilder
                .fromUriString(file.getFileLocation())
                .build(true)
                .toUri();
        return ResponseEntity.status(302).location(location).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id){
        fileMetaDataService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable String id){
        FileMetaDataDto file = fileMetaDataService.toggleFileData(id);
        return ResponseEntity.ok(file);
    }


}
