#!/bin/bash
key=C
scale=major
octaves=2
tempo=120

python3 lilypond_example.py scale $key $scale $octaves $tempo
sleep 1

outfile="scale_${key}_${scale}_${octaves}o_${tempo}"
./ly2midi --outfile $outfile "$outfile.ly"
fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi" -o synth.midi-bank-select=5 # AJH_Piano.sf2