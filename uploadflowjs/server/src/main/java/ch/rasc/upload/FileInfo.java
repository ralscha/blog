package ch.rasc.upload;

import java.util.HashSet;
import java.util.Set;

public class FileInfo {
	private final Set<Integer> uploadedChunks = new HashSet<>();

	public boolean isUploadFinished(int flowTotalChunks) {
		return this.uploadedChunks.size() == flowTotalChunks;
	}

	public boolean containsChunk(int flowChunkNumber) {
		return this.uploadedChunks.contains(flowChunkNumber);
	}

	public void addUploadedChunk(int flowChunkNumber) {
		this.uploadedChunks.add(flowChunkNumber);
	}
}