package ch.rasc.sse;

public class MemoryInfo {
	private final long heap;

	private final long nonHeap;

	private final long ts;
	
	public MemoryInfo(long heap, long nonHeap) {
		this.ts = System.currentTimeMillis();
		this.heap = heap;
		this.nonHeap = nonHeap;
	}

	public long getHeap() {
		return this.heap;
	}

	public long getNonHeap() {
		return this.nonHeap;
	}

	public long getTs() {
		return ts;
	}

}
