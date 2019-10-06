#!/bin/bash
# key=C
# scale=maj
# octaves=2
# tempo=120

# python3 lilypond_example.py scale $key $scale $octaves $tempo
# sleep 1

# outfile="scale_${key}_${scale}_${octaves}o_${tempo}"
# ./ly2midi --outfile $outfile "$outfile.ly"
# fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi" -o synth.midi-bank-select=5 # AJH_Piano.sf2


# python lilypond_example.py arpeggio $key $scale $octaves $tempo
# sleep 0.5

# outfile="arpeggio_${key}_${scale}_${octaves}o_${tempo}"
# ./ly2midi --outfile $outfile "$outfile.ly"
# fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi" -o synth.midi-bank-select=5 # AJH_Piano.sf2

key=C
scale=major
octaves=2
tempo=120

python lilypond_example.py scale $key $scale $octaves $tempo
sleep 0.2

outfile="scale_${key}_${scale}_${octaves}o_${tempo}"
./ly2midi --outfile $outfile "$outfile.ly"
fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi"