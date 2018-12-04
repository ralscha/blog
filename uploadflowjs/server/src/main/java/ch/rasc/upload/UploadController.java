package ch.rasc.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@CrossOrigin
public class UploadController {

  private final Map<String, FileInfo> fileInfos = new ConcurrentHashMap<>();

  private final String uploadDirectory;

  public UploadController(
      @Value("#{environment.uploadDirectory}") String uploadDirectory) {
    this.uploadDirectory = uploadDirectory;
    Path dataDir = Paths.get(uploadDirectory);

    try {
      Files.createDirectories(dataDir);
    }
    catch (IOException e) {
      Application.logger.error("constructor", e);
    }
  }

  @GetMapping("/upload")
  public void chunkExists(HttpServletResponse response,
      @RequestParam("flowChunkNumber") int flowChunkNumber,
      @RequestParam("flowIdentifier") String flowIdentifier) {

    FileInfo fi = this.fileInfos.get(flowIdentifier);
    if (fi != null && fi.containsChunk(flowChunkNumber)) {
      response.setStatus(HttpStatus.OK.value());
      return;
    }

    response.setStatus(HttpStatus.NOT_FOUND.value());
  }

  @PostMapping("/upload")
  public void processUpload(HttpServletResponse response,
      @RequestParam("flowChunkNumber") int flowChunkNumber,
      @RequestParam("flowTotalChunks") int flowTotalChunks,
      @RequestParam("flowChunkSize") long flowChunkSize,
      @SuppressWarnings("unused") @RequestParam("flowTotalSize") long flowTotalSize,
      @RequestParam("flowIdentifier") String flowIdentifier,
      @RequestParam("flowFilename") String flowFilename,
      @RequestParam("file") MultipartFile file) throws IOException {

    FileInfo fileInfo = this.fileInfos.get(flowIdentifier);
    if (fileInfo == null) {
      fileInfo = new FileInfo();
      this.fileInfos.put(flowIdentifier, fileInfo);
    }

    Path identifierFile = Paths.get(this.uploadDirectory, flowIdentifier);

    try (RandomAccessFile raf = new RandomAccessFile(identifierFile.toString(), "rw");
        InputStream is = file.getInputStream()) {
      raf.seek((flowChunkNumber - 1) * flowChunkSize);

      long readed = 0;
      long content_length = file.getSize();
      byte[] bytes = new byte[1024 * 100];
      while (readed < content_length) {
        int r = is.read(bytes);
        if (r < 0) {
          break;
        }
        raf.write(bytes, 0, r);
        readed += r;
      }
    }

    fileInfo.addUploadedChunk(flowChunkNumber);

    if (fileInfo.isUploadFinished(flowTotalChunks)) {
      Path uploadedFile = Paths.get(this.uploadDirectory, flowFilename);
      Files.move(identifierFile, uploadedFile, StandardCopyOption.ATOMIC_MOVE);

      this.fileInfos.remove(flowIdentifier);
    }

    response.setStatus(HttpStatus.OK.value());
  }

}
