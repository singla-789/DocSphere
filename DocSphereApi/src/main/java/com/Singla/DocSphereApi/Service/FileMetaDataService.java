package com.Singla.DocSphereApi.Service;

import com.Singla.DocSphereApi.DTO.FileMetaDataDto;
import com.Singla.DocSphereApi.Document.FileMetaDataDocument;
import com.Singla.DocSphereApi.Document.ProfileDocument;
import com.Singla.DocSphereApi.Repository.FileMetaDataRepository;
import com.Singla.DocSphereApi.Repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileMetaDataService {
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetaDataRepository fileMetaDataRepository;
    private final ProfileRepository profileRepository;
    private final S3Client s3Client;

    @Value("${supabase.s3.bucketName}")
    private String bucketName;

    @Value("${supabase.s3.endpointUrl}")
    private String endpointUrl;

    public List<FileMetaDataDto> uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currProfile = profileService.getCurrentProfile();
        List<FileMetaDataDocument> savedFiles = new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not enough credits to upload files. Please purchase more credits");
        }

        for(MultipartFile file : files){
            String fileKey = UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
            log.info("Uploaded file to Supabase S3: {}", fileKey);

            String fileUrl = buildPublicUrl(fileKey);

            FileMetaDataDocument fileMetadata = FileMetaDataDocument.builder()
                    .fileLocation(fileUrl)
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currProfile.getClerkId())
                    .isPublic(false)
                    .publicId(fileKey)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            userCreditsService.consumeCredit();

            savedFiles.add(fileMetaDataRepository.save(fileMetadata));

        }

        return savedFiles.stream().map(fileMetaDataDocument -> mapToDto(fileMetaDataDocument))
                .collect(Collectors.toList());

    }

    private String buildPublicUrl(String fileKey) {
        // endpointUrl format: https://<PROJECT-ID>.supabase.co/storage/v1/s3
        // public URL format:  https://<PROJECT-ID>.supabase.co/storage/v1/object/public/<BUCKET>/<FILE_KEY>
        String baseUrl = endpointUrl.replace("/storage/v1/s3", "");
        // Encode each path segment individually to handle spaces and special chars in filenames
        String encodedKey = URLEncoder.encode(fileKey, StandardCharsets.UTF_8).replace("+", "%20");
        return baseUrl + "/storage/v1/object/public/" + bucketName + "/" + encodedKey;
    }

    private FileMetaDataDto mapToDto(FileMetaDataDocument fileMetaDataDocument) {
       ProfileDocument profile = profileRepository.findByClerkId(fileMetaDataDocument.getClerkId());
       String ownerName = profile != null ? profile.getFirstName() + " " + profile.getLastName() : "Unknown User";

       return FileMetaDataDto.builder()
                .id(fileMetaDataDocument.getId())
                .fileLocation(fileMetaDataDocument.getFileLocation())
                .name(fileMetaDataDocument.getName())
                .size(fileMetaDataDocument.getSize())
                .type(fileMetaDataDocument.getType())
                .clerkId(fileMetaDataDocument.getClerkId())
                .ownerName(ownerName)
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

    public ResponseInputStream<GetObjectResponse> downloadFile(String id) {
        FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File Not Found"));
        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(file.getPublicId())
                .build();
        return s3Client.getObject(getRequest);
    }

    public void deleteFile(String id) {
        ProfileDocument currentProfile = profileService.getCurrentProfile();

        FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getClerkId().equals(currentProfile.getClerkId())) {
            throw new RuntimeException("File is not belong to current user");
        }

        if (file.getPublicId() != null) {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(file.getPublicId())
                    .build();
            s3Client.deleteObject(deleteRequest);
            log.info("Deleted file from Supabase S3: {}", file.getPublicId());
        }

        fileMetaDataRepository.deleteById(id);
    }

    public FileMetaDataDto toggleFileData(String id){
        FileMetaDataDocument file = fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not Found"));
        file.setIsPublic(!file.getIsPublic());
        fileMetaDataRepository.save(file);
        return mapToDto(file);
    }
}
