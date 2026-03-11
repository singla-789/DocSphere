package com.Singla.DocSphereApi.Repository;

import com.Singla.DocSphereApi.Document.FileMetaDataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileMetaDataRepository extends MongoRepository<FileMetaDataDocument,String> {
    List<FileMetaDataDocument> findByClerkId(String clerkId);
    Long countByClerkId(String clerkId);
}
