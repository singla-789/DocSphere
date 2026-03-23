package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.DTO.FileMetaDataDto;
import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.Service.FileMetaDataService;
import com.Singla.DocSphereApi.Service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Resource> download(@PathVariable String id) throws IOException {

        FileMetaDataDto downloadableFile = fileMetaDataService.getDownloadableFile(id);
        Path path = Paths.get(downloadableFile.getFileLocation());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+downloadableFile.getName()+"\"")
                .body(resource);
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
