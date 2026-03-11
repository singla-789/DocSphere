package com.Singla.DocSphereApi.Service;

import com.Singla.DocSphereApi.DTO.FileMetaDataDto;
import com.Singla.DocSphereApi.Document.FileMetaDataDocument;
import com.Singla.DocSphereApi.Document.ProfileDocument;
import com.Singla.DocSphereApi.Repository.FileMetaDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetaDataRepository fileMetaDataRepository;

    public List<FileMetaDataDto> uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currProfile = profileService.getCurrentProfile();
        List<FileMetaDataDocument> savedFiles = new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not enough credits to upload files. Please purchase more credits");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for(MultipartFile file : files){
            String FileName = UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(FileName);
            Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetaDataDocument fileMetadata = FileMetaDataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            userCreditsService.consumeCredit();

            savedFiles.add(fileMetaDataRepository.save(fileMetadata));

        }

        return savedFiles.stream().map(fileMetaDataDocument -> mapToDto(fileMetaDataDocument))
                .collect(Collectors.toList());

    }

    private FileMetaDataDto mapToDto(FileMetaDataDocument fileMetaDataDocument) {
       return FileMetaDataDto.builder()
                .id(fileMetaDataDocument.getId())
                .fileLocation(fileMetaDataDocument.getFileLocation())
                .name(fileMetaDataDocument.getName())
                .size(fileMetaDataDocument.getSize())
                .type(fileMetaDataDocument.getType())
                .clerkId(fileMetaDataDocument.getClerkId())
                .isPublic(fileMetaDataDocument.getIsPublic())
                .uploadedAt(fileMetaDataDocument.getUploadedAt())
                .build();
    }

    public List<FileMetaDataDto> getFiles() {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetaDataDocument> files = fileMetaDataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public FileMetaDataDto getPublicFile(String id) {
        Optional<FileMetaDataDocument> fileOptional = fileMetaDataRepository.findById(id);

        if (fileOptional.isEmpty() || !fileOptional.get().getIsPublic()) {
            throw new RuntimeException("Unable to get the file");
        }

        FileMetaDataDocument document = fileOptional.get();
        return mapToDto(document);
    }

    public FileMetaDataDto getDownloadableFile(String id){
        FileMetaDataDocument file =fileMetaDataRepository.findById(id).orElseThrow(() -> new RuntimeException("File Not Found"));
        return mapToDto(file);
    }

    public void deleteFile(String id) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();

            FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new RuntimeException("File is not belong to current user");
            }

            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);

            fileMetaDataRepository.deleteById(id);

        } catch (Exception e) {
            throw new RuntimeException("Error deleting the file");
        }
    }

    public FileMetaDataDto toggleFileData(String id){
        FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not Found"));
        file.setIsPublic(!file.getIsPublic());
        fileMetaDataRepository.save(file);
        return mapToDto(file);
    }
}
