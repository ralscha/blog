package ch.rasc.googlevision.dto;

import java.util.List;

public class Web {

	private List<WebEntity> webEntities;

	private List<WebUrl> fullMatchingImages;

	private List<WebUrl> partialMatchingImages;

	private List<WebUrl> pagesWithMatchingImages;

	public List<WebEntity> getWebEntities() {
		return this.webEntities;
	}

	public void setWebEntities(List<WebEntity> webEntities) {
		this.webEntities = webEntities;
	}

	public List<WebUrl> getFullMatchingImages() {
		return this.fullMatchingImages;
	}

	public void setFullMatchingImages(List<WebUrl> fullMatchingImages) {
		this.fullMatchingImages = fullMatchingImages;
	}

	public List<WebUrl> getPartialMatchingImages() {
		return this.partialMatchingImages;
	}

	public void setPartialMatchingImages(List<WebUrl> partialMatchingImages) {
		this.partialMatchingImages = partialMatchingImages;
	}

	public List<WebUrl> getPagesWithMatchingImages() {
		return this.pagesWithMatchingImages;
	}

	public void setPagesWithMatchingImages(List<WebUrl> pagesWithMatchingImages) {
		this.pagesWithMatchingImages = pagesWithMatchingImages;
	}

}
