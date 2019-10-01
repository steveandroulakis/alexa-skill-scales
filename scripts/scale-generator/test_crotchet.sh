./ly2midi --outfile test_crotchet "test_crotchet.ly"

fluidsynth -F "test_crotchet.wav" Masterpiece.sf2 "test_crotchet.midi"
