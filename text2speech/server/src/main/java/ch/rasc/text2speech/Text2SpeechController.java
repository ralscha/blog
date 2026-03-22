package ch.rasc.text2speech;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PreDestroy;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.ListVoicesRequest;
import com.google.cloud.texttospeech.v1.ListVoicesResponse;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.Voice;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;

@RestController
@CrossOrigin
public class Text2SpeechController {

  private static final MediaType AUDIO_MPEG = MediaType.parseMediaType("audio/mpeg");

  private final TextToSpeechClient textToSpeechClient;

  public Text2SpeechController() throws IOException {
    this.textToSpeechClient = TextToSpeechClient.create();
  }

  @PreDestroy
  public void destroy() {
    if (this.textToSpeechClient != null) {
      this.textToSpeechClient.close();
    }
  }

  @GetMapping("voices")
  public List<VoiceDto> getSupportedVoices() {
    ListVoicesRequest request = ListVoicesRequest.getDefaultInstance();
    ListVoicesResponse listResponse = this.textToSpeechClient.listVoices(request);
    return listResponse.getVoicesList().stream()
        .map(voice -> new VoiceDto(getSupportedLanguage(voice), voice.getName(),
            voice.getSsmlGender().name()))
        .sorted(Comparator.comparing(VoiceDto::language).thenComparing(VoiceDto::name))
        .collect(Collectors.toList());
  }

  @PostMapping(value = "speak", produces = "audio/mpeg")
  public ResponseEntity<byte[]> speak(@RequestBody SpeakRequest request) {

    SynthesisInput input = SynthesisInput.newBuilder().setText(request.text()).build();

    VoiceSelectionParams voiceSelection = VoiceSelectionParams.newBuilder()
        .setLanguageCode(request.language()).setName(request.voice()).build();

    AudioConfig audioConfig = AudioConfig.newBuilder().setPitch(request.pitch())
        .setSpeakingRate(request.speakingRate()).setAudioEncoding(AudioEncoding.MP3)
        .build();

    SynthesizeSpeechResponse response = this.textToSpeechClient.synthesizeSpeech(input,
        voiceSelection, audioConfig);

    return ResponseEntity.ok().contentType(AUDIO_MPEG)
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=speech.mp3")
        .body(response.getAudioContent().toByteArray());
  }

  private static String getSupportedLanguage(Voice voice) {
    List<String> languageCodes = voice.getLanguageCodesList();
    if (!languageCodes.isEmpty()) {
      return languageCodes.getFirst();
    }
    return null;
  }

  public record SpeakRequest(String language, String voice, String text, double pitch,
      double speakingRate) {
  }

}
